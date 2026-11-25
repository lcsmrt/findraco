package com.lcs.findraco.mcp.tool;

import com.lcs.findraco.mcp.response.McpContactResponse;
import com.lcs.findraco.mcp.service.McpToolRunner;
import com.lcs.findraco.plan.request.ContactFilter;
import com.lcs.findraco.plan.service.ContactService;
import io.modelcontextprotocol.spec.McpSchema.CallToolResult;
import org.springframework.ai.mcp.annotation.McpTool;
import org.springframework.ai.mcp.annotation.McpToolParam;
import org.springframework.stereotype.Component;

@Component
public class McpContactTools {

    private final McpToolRunner runner;
    private final ContactService contactService;

    public McpContactTools(McpToolRunner runner, ContactService contactService) {
        this.runner = runner;
        this.contactService = contactService;
    }

    @McpTool(
            name = "list_contacts",
            title = "List contacts",
            description = "Lists the active contacts of a plan: people without an account (a mother, a friend) whose "
                    + "shares of a purchase are money to receive, not the plan's spending. Each has a name, what it "
                    + "still owes (owed, from the purchases already made, less what it paid back) and its credit "
                    + "(what it paid beyond what it owed); one of the two is zero. Use the names in create_transaction "
                    + "attributedTo, or contact for a payment.",
            annotations = @McpTool.McpAnnotations(readOnlyHint = true, openWorldHint = false))
    public CallToolResult listContacts(
            @McpToolParam(required = false, description = "Plan name or id; the default plan when omitted")
                    String plan) {
        return runner.inPlan(
                "list_contacts",
                plan,
                resolved -> contactService.findAll(new ContactFilter(false), resolved.ctx()).stream()
                        .map(contact -> new McpContactResponse(contact.name(), contact.owed(), contact.credit()))
                        .toList());
    }
}
