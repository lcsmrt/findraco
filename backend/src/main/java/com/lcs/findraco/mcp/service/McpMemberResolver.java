package com.lcs.findraco.mcp.service;

import com.lcs.findraco.mcp.exception.McpToolException;
import com.lcs.findraco.plan.response.PlanMemberResponse;
import com.lcs.findraco.plan.service.PlanContext;
import com.lcs.findraco.plan.service.PlanService;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * Turns the names Claude hears ("Marina", "Marína Souza") into members of the plan, by the same rule as plan and
 * category names. A name of several words is a full name, so two Anas with different surnames are told apart by the
 * surname; a one-word name is compared with full names and first names together, so it never silently picks one of
 * two members it could mean.
 */
@Service
public class McpMemberResolver {

    /** More names than any plan has members, so a runaway list is refused before it is resolved. */
    private static final int MAX_NAMES = 20;

    private final PlanService planService;

    public McpMemberResolver(PlanService planService) {
        this.planService = planService;
    }

    /** The user ids named, in the order spoken; each name must match exactly one member and no member twice. */
    public List<Long> resolve(List<String> names, String planName, PlanContext ctx) {
        if (names.size() > MAX_NAMES) {
            throw new McpToolException("attributedTo takes at most " + MAX_NAMES + " names.");
        }
        List<PlanMemberResponse> members = planService.getMembers(ctx.planId(), ctx.userId());
        List<Long> ids = new ArrayList<>();
        for (String name : names) {
            long id = one(name, planName, members);
            if (ids.contains(id)) {
                throw new McpToolException("\"" + name.strip() + "\" names a member already listed in attributedTo.");
            }
            ids.add(id);
        }
        return ids;
    }

    /**
     * An update resends the stored shares, and the transaction service refuses a share of someone who is no longer in
     * the plan; the caller is told so before anything is sent, instead of getting the service's unrelated message.
     */
    public void requireAllInPlan(List<Long> userIds, PlanContext ctx) {
        List<Long> memberIds = planService.getMembers(ctx.planId(), ctx.userId()).stream()
                .map(PlanMemberResponse::userId)
                .toList();
        if (!memberIds.containsAll(userIds)) {
            throw new McpToolException("This transaction is shared with someone who is no longer in the plan, "
                    + "so it cannot be changed through Claude.");
        }
    }

    private static long one(String name, String planName, List<PlanMemberResponse> members) {
        if (name == null || name.isBlank()) {
            throw new McpToolException("attributedTo cannot hold a blank name. " + membersOf(planName, members));
        }
        List<PlanMemberResponse> matches = members.stream()
                .filter(member -> McpNames.matches(name, member.name()))
                .toList();
        if (isOneWord(name)) {
            // A one-word name is a full name for a member called just that and a first name for the others, so a
            // first name that is also another member's whole name is ambiguous, not silently the second.
            matches = members.stream()
                    .filter(member -> McpNames.matches(name, member.name())
                            || McpNames.matches(name, McpNames.firstName(member.name())))
                    .toList();
        }
        if (matches.isEmpty()) {
            throw new McpToolException("No member of plan \"" + planName + "\" is named \"" + name.strip() + "\". "
                    + membersOf(planName, members));
        }
        if (matches.size() > 1) {
            throw new McpToolException("Several members of plan \"" + planName + "\" are named \"" + name.strip()
                    + "\"; use the full name. " + membersOf(planName, members));
        }
        return matches.get(0).userId();
    }

    private static boolean isOneWord(String name) {
        return name.strip().indexOf(' ') < 0;
    }

    private static String membersOf(String planName, List<PlanMemberResponse> members) {
        return "Members of \"" + planName + "\": "
                + members.stream().map(PlanMemberResponse::name).collect(Collectors.joining(", ")) + ".";
    }
}
