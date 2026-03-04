/**
 * NotebookLM TypeScript Client — Authentication
 *
 * Reads Google cookies from the NOTEBOOKLM_AUTH_JSON env var (Playwright
 * storage state format), fetches the NotebookLM homepage to extract CSRF
 * and session tokens, and returns an AuthTokens object for RPC calls.
 *
 * @module lib/services/notebooklm/auth
 */

import type { AuthTokens, NotebookLMCookie } from './types';
import { fetchWithTimeout } from './rpc';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const NOTEBOOKLM_HOME = 'https://notebooklm.google.com/';

const ALLOWED_DOMAINS = [
  '.google.com',
  'notebooklm.google.com',
  '.googleusercontent.com',
];

const CSRF_REGEX = /"SNlM0e"\s*:\s*"([^"]+)"/;
const SESSION_REGEX = /"FdrFJe"\s*:\s*"([^"]+)"/;

/** Default timeout for the initial auth fetch (ms) */
const AUTH_FETCH_TIMEOUT_MS = 30_000;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Check if a cookie domain is in the allowed list.
 */
function isAllowedDomain(domain: string): boolean {
  const normalized = domain.startsWith('.') ? domain : `.${domain}`;
  return ALLOWED_DOMAINS.some(
    (allowed) =>
      normalized === allowed ||
      normalized.endsWith(allowed) ||
      domain === allowed.replace(/^\./, '')
  );
}

/**
 * Load the Playwright storage state JSON from env var or file path.
 *
 * Supports three modes:
 * 1. NOTEBOOKLM_AUTH_JSON contains raw JSON: {"cookies": [...]}
 * 2. NOTEBOOKLM_AUTH_JSON contains a file path: ~/.notebooklm/storage_state.json
 * 3. NOTEBOOKLM_AUTH_JSON contains double-quoted JSON (from .env.local quoting)
 */
function parseCookiesFromEnv(): Record<string, string> {
  const authJson = process.env.NOTEBOOKLM_AUTH_JSON;
  if (!authJson) {
    throw new Error(
      '[NotebookLM] NOTEBOOKLM_AUTH_JSON env var is not set. ' +
        'Set it to a file path (e.g., ~/.notebooklm/storage_state.json) ' +
        'or inline Playwright storage state JSON.'
    );
  }

  let storageState: { cookies?: NotebookLMCookie[] };

  // Check if the value looks like a file path (doesn't start with { or ")
  const trimmed = authJson.trim();
  if (!trimmed.startsWith('{') && !trimmed.startsWith('"') && !trimmed.startsWith("'")) {
    // Treat as file path — resolve ~ to home directory
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const fs = require('fs') as typeof import('fs');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const path = require('path') as typeof import('path');
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const os = require('os') as typeof import('os');

      const resolvedPath = trimmed.startsWith('~')
        ? path.join(os.homedir(), trimmed.slice(1))
        : path.resolve(trimmed);

      console.log(`[NotebookLM] Loading auth from file: ${resolvedPath}`);
      const fileContent = fs.readFileSync(resolvedPath, 'utf-8');
      storageState = JSON.parse(fileContent) as { cookies?: NotebookLMCookie[] };
    } catch (err) {
      throw new Error(
        `[NotebookLM] Failed to read auth file "${trimmed}": ${err instanceof Error ? err.message : String(err)}`
      );
    }
  } else {
    // Treat as inline JSON
    try {
      // .env.local may double-quote the value, producing a JSON string literal.
      // Try parsing once; if the result is a string, parse again.
      let parsed: unknown = JSON.parse(trimmed);
      if (typeof parsed === 'string') {
        parsed = JSON.parse(parsed);
      }
      storageState = parsed as { cookies?: NotebookLMCookie[] };
    } catch {
      throw new Error(
        '[NotebookLM] NOTEBOOKLM_AUTH_JSON is not valid JSON and not a valid file path. ' +
          'Set it to a file path (e.g., ~/.notebooklm/storage_state.json) ' +
          'or valid Playwright storage state JSON: {"cookies": [...]}'
      );
    }
  }

  const rawCookies = storageState.cookies;
  if (!Array.isArray(rawCookies) || rawCookies.length === 0) {
    throw new Error(
      '[NotebookLM] No cookies found in NOTEBOOKLM_AUTH_JSON. ' +
        'Expected format: {"cookies": [{"name": "SID", "value": "...", "domain": ".google.com"}, ...]}'
    );
  }

  // Filter to allowed domains and deduplicate (last wins)
  const cookies: Record<string, string> = {};
  for (const cookie of rawCookies) {
    if (
      cookie.name &&
      cookie.value &&
      cookie.domain &&
      isAllowedDomain(cookie.domain)
    ) {
      cookies[cookie.name] = cookie.value;
    }
  }

  if (!cookies['SID']) {
    throw new Error(
      '[NotebookLM] SID cookie not found in NOTEBOOKLM_AUTH_JSON. ' +
        'The Google auth cookies may be missing or from the wrong domain.'
    );
  }

  return cookies;
}

/**
 * Build a Cookie header string from a cookies record.
 */
function buildCookieHeader(cookies: Record<string, string>): string {
  return Object.entries(cookies)
    .map(([name, value]) => `${name}=${value}`)
    .join('; ');
}

// ---------------------------------------------------------------------------
// Main auth function
// ---------------------------------------------------------------------------

/**
 * Initialize authentication for the NotebookLM client.
 *
 * 1. Reads cookies from NOTEBOOKLM_AUTH_JSON env var
 * 2. Fetches the NotebookLM homepage to extract CSRF + session tokens
 * 3. Returns AuthTokens for use in RPC calls
 *
 * @throws Error if cookies are missing, auth is expired, or tokens can't be extracted
 */
export async function initAuth(): Promise<AuthTokens> {
  console.log('[NotebookLM] Initializing authentication...');

  // Step 1: Parse cookies from env
  const cookies = parseCookiesFromEnv();
  const cookieHeader = buildCookieHeader(cookies);

  console.log(
    `[NotebookLM] Found ${Object.keys(cookies).length} cookies from allowed domains`
  );

  // Step 2: Fetch NotebookLM homepage to get CSRF and session tokens
  let html: string;
  let finalUrl: string;

  try {
    const response = await fetchWithTimeout(
      NOTEBOOKLM_HOME,
      {
        method: 'GET',
        headers: {
          Cookie: cookieHeader,
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        redirect: 'follow',
      },
      AUTH_FETCH_TIMEOUT_MS
    );

    finalUrl = response.url;
    html = await response.text();
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(
        '[NotebookLM] Auth fetch timed out after ' +
          `${AUTH_FETCH_TIMEOUT_MS}ms. Check network connectivity.`
      );
    }
    throw new Error(
      `[NotebookLM] Failed to fetch NotebookLM homepage: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Step 3: Check for auth redirect (Google login page)
  if (
    finalUrl.includes('accounts.google.com') ||
    finalUrl.includes('/signin') ||
    finalUrl.includes('ServiceLogin')
  ) {
    throw new Error(
      '[NotebookLM] Authentication expired — redirected to Google login page. ' +
        'Update NOTEBOOKLM_AUTH_JSON with fresh cookies from a logged-in browser session.'
    );
  }

  // Step 4: Extract CSRF token
  const csrfMatch = html.match(CSRF_REGEX);
  if (!csrfMatch || !csrfMatch[1]) {
    throw new Error(
      '[NotebookLM] Could not extract CSRF token (SNlM0e) from NotebookLM page. ' +
        'The page structure may have changed, or auth cookies may be invalid.'
    );
  }
  const csrfToken = csrfMatch[1];

  // Step 5: Extract session ID
  const sessionMatch = html.match(SESSION_REGEX);
  if (!sessionMatch || !sessionMatch[1]) {
    throw new Error(
      '[NotebookLM] Could not extract session ID (FdrFJe) from NotebookLM page. ' +
        'The page structure may have changed, or auth cookies may be invalid.'
    );
  }
  const sessionId = sessionMatch[1];

  console.log('[NotebookLM] Authentication initialized successfully');

  return {
    cookies,
    cookieHeader,
    csrfToken,
    sessionId,
  };
}
