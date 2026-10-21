UPDATE "oauthClient"
SET
  "scopes" = '["openid","profile","email","offline_access","read:content","search","mcp:tools","agent"]',
  "requirePKCE" = 0,
  "skipConsent" = 1;
