package com.lcs.findraco.mcp.exception;

/**
 * A tool call refused for a reason Claude can act on (an unknown plan, an invalid argument, a rule of the tool). The
 * message reaches Claude as the tool's error result, so it is English, names what to change and carries no personal
 * data.
 */
public class McpToolException extends RuntimeException {

    public McpToolException(String message) {
        super(message);
    }
}
