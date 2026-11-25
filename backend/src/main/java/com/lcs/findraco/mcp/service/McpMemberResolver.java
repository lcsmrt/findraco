package com.lcs.findraco.mcp.service;

import com.lcs.findraco.mcp.exception.McpToolException;
import com.lcs.findraco.plan.request.ContactFilter;
import com.lcs.findraco.plan.service.ContactService;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.plan.service.PlanService;
import com.lcs.findraco.transaction.request.TransactionParticipantRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.stereotype.Service;

/**
 * Turns the names Claude hears ("Marina", "Marína Souza", "Mãe") into members and active contacts of the plan, by the
 * same rule as plan and category names. A name of several words is a full name, so two Anas with different surnames
 * are told apart by the surname; a one-word name is compared with full names and first names together, so it never
 * silently picks one of two people it could mean. A name that fits a member and a contact is refused, not guessed.
 */
@Service
public class McpMemberResolver {

    /** More names than any plan has members, so a runaway list is refused before it is resolved. */
    private static final int MAX_NAMES = 20;

    private final PlanService planService;
    private final ContactService contactService;

    public McpMemberResolver(PlanService planService, ContactService contactService) {
        this.planService = planService;
        this.contactService = contactService;
    }

    /** One person a name can mean: a member or a contact. */
    private record Party(boolean contact, long id, String name) {}

    /**
     * The participants named, in the order spoken; each name must match exactly one member or contact and no one twice.
     * An equal split among them is the caller's request, with no amounts.
     */
    public List<TransactionParticipantRequest> resolve(List<String> names, String planName, PlanContext ctx) {
        if (names.size() > MAX_NAMES) {
            throw new McpToolException("attributedTo takes at most " + MAX_NAMES + " names.");
        }
        List<Party> everyone = parties(ctx);
        List<Party> chosen = new ArrayList<>();
        for (String name : names) {
            Party party = one(name, planName, everyone);
            if (chosen.contains(party)) {
                throw new McpToolException("\"" + name.strip() + "\" names someone already listed in attributedTo.");
            }
            chosen.add(party);
        }
        return chosen.stream()
                .map(party -> party.contact()
                        ? new TransactionParticipantRequest(null, party.id(), null)
                        : new TransactionParticipantRequest(party.id(), null))
                .toList();
    }

    /** The id of the active contact a payment came from; an unknown or ambiguous name is refused. */
    public long contact(String name, String planName, PlanContext ctx) {
        List<Party> contacts = parties(ctx).stream().filter(Party::contact).toList();
        if (name == null || name.isBlank()) {
            throw new McpToolException("contact cannot be blank. " + listing(planName, contacts));
        }
        List<Party> matches =
                contacts.stream().filter(party -> fits(name, party)).toList();
        if (matches.isEmpty()) {
            throw new McpToolException("No contact of plan \"" + planName + "\" is named \"" + name.strip() + "\". "
                    + listing(planName, contacts));
        }
        if (matches.size() > 1) {
            throw new McpToolException("Several contacts of plan \"" + planName + "\" are named \"" + name.strip()
                    + "\"; use the full name. " + listing(planName, contacts));
        }
        return matches.get(0).id();
    }

    private List<Party> parties(PlanContext ctx) {
        Stream<Party> members = planService.getMembers(ctx.planId(), ctx.userId()).stream()
                .map(member -> new Party(false, member.userId(), member.name()));
        Stream<Party> contacts = contactService.findAll(new ContactFilter(false), ctx).stream()
                .map(contact -> new Party(true, contact.id(), contact.name()));
        return Stream.concat(members, contacts).toList();
    }

    private static Party one(String name, String planName, List<Party> everyone) {
        if (name == null || name.isBlank()) {
            throw new McpToolException("attributedTo cannot hold a blank name. " + listing(planName, everyone));
        }
        List<Party> matches =
                everyone.stream().filter(party -> fits(name, party)).toList();
        if (matches.isEmpty()) {
            throw new McpToolException("No member or contact of plan \"" + planName + "\" is named \"" + name.strip()
                    + "\". " + listing(planName, everyone));
        }
        if (matches.size() > 1) {
            boolean mixed = matches.stream().anyMatch(Party::contact)
                    && matches.stream().anyMatch(party -> !party.contact());
            throw new McpToolException(
                    mixed
                            ? "\"" + name.strip() + "\" is ambiguous: it names a member and a contact of plan \""
                                    + planName + "\". " + listing(planName, everyone)
                            : "Several " + (matches.get(0).contact() ? "contacts" : "members") + " of plan \""
                                    + planName
                                    + "\" are named \"" + name.strip() + "\"; use the full name. "
                                    + listing(planName, everyone));
        }
        return matches.get(0);
    }

    /**
     * A one-word name is a full name for someone called just that and a first name for the others, so a first name
     * that is also another person's whole name is ambiguous, not silently the second.
     */
    private static boolean fits(String name, Party party) {
        return McpNames.matches(name, party.name())
                || (isOneWord(name) && McpNames.matches(name, McpNames.firstName(party.name())));
    }

    private static boolean isOneWord(String name) {
        return name.strip().indexOf(' ') < 0;
    }

    private static String listing(String planName, List<Party> parties) {
        String members = names(parties, false);
        String contacts = names(parties, true);
        String listing = members.isEmpty() ? "" : "Members of \"" + planName + "\": " + members + ".";
        if (!contacts.isEmpty()) {
            listing += (listing.isEmpty() ? "" : " ") + "Contacts of \"" + planName + "\": " + contacts + ".";
        }
        return listing;
    }

    private static String names(List<Party> parties, boolean contacts) {
        return parties.stream()
                .filter(party -> party.contact() == contacts)
                .map(Party::name)
                .collect(Collectors.joining(", "));
    }
}
