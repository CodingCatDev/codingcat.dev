import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Implements Auth.md specification for autonomous AI agent authentication & registration
 * https://workos.com/auth-md
 */
export const GET: APIRoute = async ({ locals }) => {
	const origin = locals.siteUrl.origin;

	const body = `# CodingCat.dev auth.md

> Autonomous AI Agent Authentication & Registration Specification for CodingCat.dev APIs and Services.

## 1. Overview & Audience

This document describes authentication and registration procedures for autonomous AI agents, coding assistants, and research tools interacting with CodingCat.dev resources.

- **Audience**: AI Agents, LLM crawlers, automated developer tools, MCP clients.
- **Resource Identifier**: \`${origin}\`
- **Authorization Server**: \`${origin}\`
- **Protected Resource Metadata**: [\`${origin}/.well-known/oauth-protected-resource\`](${origin}/.well-known/oauth-protected-resource)
- **OAuth Authorization Server Metadata**: [\`${origin}/.well-known/oauth-authorization-server\`](${origin}/.well-known/oauth-authorization-server)
- **OpenID Connect Discovery**: [\`${origin}/.well-known/openid-configuration\`](${origin}/.well-known/openid-configuration)

---

## 2. Supported Scopes

| Scope | Description |
| :--- | :--- |
| \`read:content\` | Read published tutorials, blog posts, podcasts, transcripts, and metadata |
| \`search\` | Access keyword and semantic search APIs |
| \`mcp:tools\` | Invoke Streamable HTTP Model Context Protocol (MCP) server tools |
| \`agent\` | Autonomous agent identity and interactions |

---

## 3. Agent Registration & Provisioning Methods

CodingCat.dev supports programmatic agent registration without human browser interaction.

### Method A: Anonymous Instant Bearer Token (Recommended for Reading & Search)

Agents requiring unauthenticated read access can claim an anonymous bearer token immediately:

- **Endpoint**: \`POST ${origin}/agent/claim\`
- **Identity Type**: \`anonymous\`
- **Credential Type**: \`bearer\`
- **Request**:
  \`\`\`http
  POST ${origin}/agent/claim HTTP/1.1
  Content-Type: application/json

  {
    "identity_type": "anonymous",
    "requested_scopes": ["read:content", "search", "mcp:tools"]
  }
  \`\`\`
- **Response**:
  \`\`\`json
  {
    "access_token": "cat_anon_eyJ...",
    "token_type": "Bearer",
    "expires_in": 86400,
    "scope": "read:content search mcp:tools"
  }
  \`\`\`

### Method B: Identity Assertion (ID-JAG & Verified Email)

For agents with verified identities or software statements:

- **Endpoint**: \`POST ${origin}/agent/auth\`
- **Identity Types Supported**: \`identity_assertion\`, \`anonymous\`
- **Assertion Types Supported**:
  - \`urn:ietf:params:oauth:token-type:id-jag\` (JSON Web Token Agent Grant)
  - \`verified_email\`
- **Credential Types Supported**: \`bearer\`
- **Request**:
  \`\`\`http
  POST ${origin}/agent/auth HTTP/1.1
  Content-Type: application/json

  {
    "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
    "subject_token_type": "urn:ietf:params:oauth:token-type:id-jag",
    "subject_token": "<jwt-assertion>",
    "scope": "read:content search mcp:tools agent"
  }
  \`\`\`

---

## 4. Using Credentials

When calling protected API or MCP endpoints, include the access token in the \`Authorization\` request header:

\`\`\`http
GET ${origin}/api/search?q=astro HTTP/1.1
Authorization: Bearer <access_token>
Accept: application/json
\`\`\`

\`\`\`http
POST ${origin}/api/mcp HTTP/1.1
Authorization: Bearer <access_token>
Content-Type: application/json

{"jsonrpc":"2.0","id":1,"method":"tools/list"}
\`\`\`

---

## 5. Public Unauthenticated Endpoints

Public search (\`/api/search\`), public MCP tool execution (\`/api/mcp\`), and Markdown content negotiation (\`Accept: text/markdown\`) do not require authentication for passive research or search bots.
`;

	return new Response(body, {
		headers: {
			"content-type": "text/markdown; charset=utf-8",
			"access-control-allow-origin": "*",
			"cache-control": "public, max-age=3600, s-maxage=86400",
		},
	});
};
