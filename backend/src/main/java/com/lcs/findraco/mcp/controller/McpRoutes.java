package com.lcs.findraco.mcp.controller;

/** The MCP server's routes, outside {@code /api}: Claude reaches them on the app's own domain. */
public final class McpRoutes {
    public static final String MCP = "/mcp";
    public static final String PROTECTED_RESOURCE_METADATA = "/.well-known/oauth-protected-resource";

    private McpRoutes() {}
}
