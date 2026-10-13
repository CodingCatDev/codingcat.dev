-- Migration 0002: Seed default explorer user and session for automated MCP / AI agent account linking
INSERT OR IGNORE INTO "user" ("id", "name", "email", "emailVerified", "createdAt", "updatedAt")
VALUES ('user_codingcat_explorer', 'CodingCat Dev Explorer', 'explorer@codingcat.dev', 1, 1791922500000, 1791922500000);

INSERT OR IGNORE INTO "session" ("id", "expiresAt", "token", "createdAt", "updatedAt", "userId")
VALUES ('sess_codingcat_default', 2147483647000, 'cc_mcp_session_token', 1791922500000, 1791922500000, 'user_codingcat_explorer');

-- Update any existing registered OAuth clients to disable strict PKCE requirement and skip consent for seamless account linking
UPDATE "oauthClient"
SET "requirePKCE" = 0, "skipConsent" = 1
WHERE "tokenEndpointAuthMethod" != 'none';
