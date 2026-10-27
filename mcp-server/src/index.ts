import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  ALL_RULE_CATEGORIES,
  CODINGCAT_RULES_REGISTRY,
  CODINGCAT_THEME_CSS,
  CODINGCAT_TOKENS_JSON,
  type CodingCatRuleCategory,
} from "./rules-registry";

type Bindings = {
  TOOLKIT_VERSION: string;
  BRAND_NAME: string;
};

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id?: string | number | null;
  method: string;
  params?: Record<string, unknown>;
}

const app = new Hono<{ Bindings: Bindings }>();

app.use("*", cors());

/**
 * Root discovery endpoint
 */
app.get("/", (c) => {
  return c.json({
    name: "codingcatdev-mcp-server",
    brand: c.env?.BRAND_NAME ?? "CodingCat.dev",
    version: c.env?.TOOLKIT_VERSION ?? "1.0.0",
    endpoints: {
      mcp: "/mcp",
      rules: "/rules",
      tokens: "/tokens",
    },
    tools: [
      "list_codingcat_rules",
      "get_codingcat_rules",
      "get_codingcat_tokens",
    ],
    categories: ALL_RULE_CATEGORIES,
  });
});

/**
 * Convenience REST endpoints for direct HTTP agents
 */
app.get("/rules", (c) => {
  const rules = ALL_RULE_CATEGORIES.map((key) => {
    const entry = CODINGCAT_RULES_REGISTRY[key];
    return {
      category: entry.category,
      title: entry.title,
      skill: entry.skill,
      sourcePath: entry.sourcePath,
      summary: entry.summary,
    };
  });
  return c.json({ categories: rules });
});

app.get("/rules/:category", (c) => {
  const category = c.req.param("category") as CodingCatRuleCategory;
  const entry = CODINGCAT_RULES_REGISTRY[category];
  if (!entry) {
    return c.json(
      {
        error: `Unknown category '${category}'. Valid categories: ${ALL_RULE_CATEGORIES.join(", ")}`,
      },
      404
    );
  }
  return c.json(entry);
});

app.get("/tokens", (c) => {
  const format = c.req.query("format") ?? "json";
  if (format === "css") {
    return c.text(CODINGCAT_THEME_CSS, 200, {
      "Content-Type": "text/css; charset=utf-8",
    });
  }
  return c.json(CODINGCAT_TOKENS_JSON);
});

/**
 * MCP Tool Definitions (modeled after sanity-io/agent-toolkit)
 */
const MCP_TOOLS = [
  {
    name: "list_codingcat_rules",
    description:
      "Lists all available CodingCat.dev Design System categories, @alex.patterson voice rules, and AJ Mascot / Excalidraw media studio rules.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "get_codingcat_rules",
    description:
      "Fetches the complete Markdown specifications and design tokens for one or more CodingCat.dev rule categories in a single call.",
    inputSchema: {
      type: "object",
      properties: {
        categories: {
          type: "array",
          items: {
            type: "string",
            enum: ALL_RULE_CATEGORIES,
          },
          description:
            "Array of rule categories to retrieve (e.g. ['overview', 'colors', 'typography', 'voice', 'excalidraw']).",
        },
      },
      required: ["categories"],
      additionalProperties: false,
    },
  },
  {
    name: "get_codingcat_tokens",
    description:
      "Returns the canonical CodingCat.dev W3C Design Tokens (tokens.json) or Tailwind CSS v4 @theme variables (theme.css).",
    inputSchema: {
      type: "object",
      properties: {
        format: {
          type: "string",
          enum: ["json", "css", "both"],
          description:
            "Output format: 'json' for W3C tokens.json, 'css' for Tailwind v4 theme.css, or 'both' (default: 'both').",
        },
      },
      additionalProperties: false,
    },
  },
];

/**
 * MCP Streamable HTTP endpoint (GET /mcp for server info, POST /mcp for JSON-RPC 2.0)
 */
app.get("/mcp", (c) => {
  return c.json({
    protocolVersion: "2024-11-05",
    serverInfo: {
      name: "codingcatdev-mcp-server",
      version: c.env?.TOOLKIT_VERSION ?? "1.0.0",
    },
    tools: MCP_TOOLS,
  });
});

app.post("/mcp", async (c) => {
  const body = await c.req.json<JsonRpcRequest>();
  const { id = null, method, params = {} } = body;

  if (method === "initialize") {
    return c.json({
      jsonrpc: "2.0",
      id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: {
          tools: { listChanged: false },
          resources: { subscribe: false, listChanged: false },
        },
        serverInfo: {
          name: "codingcatdev-mcp-server",
          version: c.env?.TOOLKIT_VERSION ?? "1.0.0",
        },
      },
    });
  }

  if (method === "notifications/initialized") {
    return c.body(null, 204);
  }

  if (method === "ping") {
    return c.json({ jsonrpc: "2.0", id, result: {} });
  }

  if (method === "tools/list") {
    return c.json({
      jsonrpc: "2.0",
      id,
      result: {
        tools: MCP_TOOLS,
      },
    });
  }

  if (method === "tools/call") {
    const toolName = params.name as string | undefined;
    const args = (params.arguments ?? {}) as Record<string, unknown>;

    if (toolName === "list_codingcat_rules") {
      const listSummary = ALL_RULE_CATEGORIES.map((cat) => {
        const item = CODINGCAT_RULES_REGISTRY[cat];
        return `- **${item.category}** (${item.skill}): ${item.summary}`;
      }).join("\n");

      return c.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: `# Available CodingCat.dev Rule Categories\n\n${listSummary}`,
            },
          ],
        },
      });
    }

    if (toolName === "get_codingcat_rules") {
      const requested = Array.isArray(args.categories)
        ? (args.categories as string[])
        : ALL_RULE_CATEGORIES;

      const validEntries = requested
        .filter((cat): cat is CodingCatRuleCategory =>
          ALL_RULE_CATEGORIES.includes(cat as CodingCatRuleCategory)
        )
        .map((cat) => CODINGCAT_RULES_REGISTRY[cat]);

      if (validEntries.length === 0) {
        return c.json({
          jsonrpc: "2.0",
          id,
          result: {
            isError: true,
            content: [
              {
                type: "text",
                text: `No valid categories provided. Valid categories: ${ALL_RULE_CATEGORIES.join(", ")}`,
              },
            ],
          },
        });
      }

      const combinedMarkdown = validEntries
        .map(
          (entry) =>
            `<!-- Category: ${entry.category} | Source: ${entry.sourcePath} -->\n${entry.markdown}`
        )
        .join("\n\n---\n\n");

      return c.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: [
            {
              type: "text",
              text: combinedMarkdown,
            },
          ],
        },
      });
    }

    if (toolName === "get_codingcat_tokens") {
      const format = (args.format as string | undefined) ?? "both";
      const blocks: Array<{ type: "text"; text: string }> = [];

      if (format === "json" || format === "both") {
        blocks.push({
          type: "text",
          text: `### tokens/tokens.json\n\`\`\`json\n${JSON.stringify(CODINGCAT_TOKENS_JSON, null, 2)}\n\`\`\``,
        });
      }
      if (format === "css" || format === "both") {
        blocks.push({
          type: "text",
          text: `### tokens/theme.css\n\`\`\`css\n${CODINGCAT_THEME_CSS}\n\`\`\``,
        });
      }

      return c.json({
        jsonrpc: "2.0",
        id,
        result: {
          content: blocks,
        },
      });
    }

    return c.json({
      jsonrpc: "2.0",
      id,
      error: {
        code: -32601,
        message: `Unknown tool: ${toolName}`,
      },
    });
  }

  return c.json({
    jsonrpc: "2.0",
    id,
    error: {
      code: -32601,
      message: `Method not found: ${method}`,
    },
  });
});

export default app;
