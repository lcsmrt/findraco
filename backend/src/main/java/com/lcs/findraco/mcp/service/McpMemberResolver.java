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
 * category names. A full name wins over a first name, so two Anas with different surnames are told apart by the
 * surname.
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

    private static long one(String name, String planName, List<PlanMemberResponse> members) {
        if (name == null || name.isBlank()) {
            throw new McpToolException("attributedTo cannot hold a blank name. " + membersOf(planName, members));
        }
        List<PlanMemberResponse> matches = members.stream()
                .filter(member -> McpNames.matches(name, member.name()))
                .toList();
        if (matches.isEmpty()) {
            matches = members.stream()
                    .filter(member -> McpNames.matches(name, McpNames.firstName(member.name())))
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

    private static String membersOf(String planName, List<PlanMemberResponse> members) {
        return "Members of \"" + planName + "\": "
                + members.stream().map(PlanMemberResponse::name).collect(Collectors.joining(", ")) + ".";
    }
}
