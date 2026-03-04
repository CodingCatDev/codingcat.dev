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
 * Parse the Playwright storage state JSON from the env var.
 */
function parseCookiesFromEnv(): Record<string, string> {
  const authJson = process.env.NOTEBOOKLM_AUTH_JSON;
  if (!authJson) {
    throw new Error(
      '[NotebookLM] NOTEBOOKLM_AUTH_JSON env var is not set. ' +
        'Set it to a Playwright storage state JSON with Google cookies.'
    );
  }

  let storageState: { cookies?: NotebookLMCookie[] };
  try {
    storageState = JSON.parse(authJson) as { cookies?: NotebookLMCookie[] };
  } catch {
    throw new Error(
      '[NotebookLM] NOTEBOOKLM_AUTH_JSON is not valid JSON. ' +
        'Expected Playwright storage state format: {"cookies": [...]}'
    );
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

/**
 * Fetch with an AbortController timeout.
 */
async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });
    return response;
  } finally {
    clearTimeout(timer);
  }
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
