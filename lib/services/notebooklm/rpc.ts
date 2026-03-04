/**
 * NotebookLM TypeScript Client — RPC Encoding/Decoding
 *
 * Implements the Google BatchExecute protocol used by NotebookLM.
 * Handles encoding RPC requests, building HTTP bodies/URLs, and
 * decoding the chunked anti-XSSI response format.
 *
 * @module lib/services/notebooklm/rpc
 */

import { BATCHEXECUTE_URL } from './types';

// ---------------------------------------------------------------------------
// Error class
// ---------------------------------------------------------------------------

export class NotebookLMRPCError extends Error {
  public readonly code: number | undefined;
  public readonly methodId: string | undefined;

  constructor(
    message: string,
    options?: { code?: number; methodId?: string }
  ) {
    super(message);
    this.name = 'NotebookLMRPCError';
    this.code = options?.code;
    this.methodId = options?.methodId;
  }
}

// ---------------------------------------------------------------------------
// Encoding
// ---------------------------------------------------------------------------

/**
 * Encode an RPC request for the BatchExecute protocol.
 *
 * Format: `[[[ methodId, JSON.stringify(params), null, "generic" ]]]`
 */
export function encodeRpcRequest(
  methodId: string,
  params: unknown[]
): unknown[][] {
  const paramsJson = JSON.stringify(params);
  const inner = [methodId, paramsJson, null, 'generic'];
  return [[inner]];
}

/**
 * Build the URL-encoded request body for a BatchExecute POST.
 *
 * Format: `f.req=<encoded_json>&at=<csrf_token>&`
 */
export function buildRequestBody(
  rpcRequest: unknown[][],
  csrfToken?: string
): string {
  const fReq = JSON.stringify(rpcRequest);
  let body = `f.req=${encodeURIComponent(fReq)}`;
  if (csrfToken) {
    body += `&at=${encodeURIComponent(csrfToken)}`;
  }
  body += '&';
  return body;
}

/**
 * Build the full BatchExecute URL with query parameters.
 */
export function buildRpcUrl(
  methodId: string,
  sourcePath: string,
  sessionId: string
): string {
  const params = new URLSearchParams({
    rpcids: methodId,
    'source-path': sourcePath,
    'f.sid': sessionId,
    rt: 'c',
  });
  return `${BATCHEXECUTE_URL}?${params.toString()}`;
}

// ---------------------------------------------------------------------------
// Decoding
// ---------------------------------------------------------------------------

/**
 * Strip the anti-XSSI prefix from a Google API response.
 *
 * Google prepends `)]}'` followed by a newline to prevent JSON hijacking.
 */
function stripAntiXssi(response: string): string {
  if (response.startsWith(")]}'")) {
    const newlineIdx = response.indexOf('\n');
    if (newlineIdx !== -1) {
      return response.slice(newlineIdx + 1);
    }
  }
  return response;
}

/**
 * Parse the chunked response format.
 *
 * The response body (after anti-XSSI stripping) consists of alternating
 * lines: a byte count (integer), then a JSON payload line.
 *
 * Returns an array of parsed JSON chunks.
 */
function parseChunkedResponse(response: string): unknown[][] {
  const stripped = stripAntiXssi(response);
  const lines = stripped.split('\n');
  const chunks: unknown[][] = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    // Try to parse as a byte count (integer)
    const byteCount = parseInt(line, 10);
    if (!isNaN(byteCount) && byteCount > 0 && i + 1 < lines.length) {
      // Next line should be the JSON payload
      const jsonLine = lines[i + 1];
      try {
        const parsed = JSON.parse(jsonLine) as unknown[];
        if (Array.isArray(parsed)) {
          chunks.push(parsed);
        }
      } catch {
        // Not valid JSON — skip this pair
      }
      i += 2;
    } else {
      i += 1;
    }
  }

  return chunks;
}

/**
 * Extract the RPC result from parsed response chunks.
 *
 * Looks for `["wrb.fr", rpcId, jsonDataString, ...]` entries.
 * Error responses have `["er", rpcId, errorCode]`.
 *
 * @returns The parsed result data (from the JSON string at index 2)
 * @throws NotebookLMRPCError if an error response is found
 */
function extractRpcResult(
  chunks: unknown[][],
  rpcId: string
): unknown {
  for (const chunk of chunks) {
    if (!Array.isArray(chunk)) continue;

    for (const item of chunk) {
      if (!Array.isArray(item)) continue;
      const arr = item as unknown[];

      // Check for error response
      if (arr[0] === 'er') {
        const errorRpcId = arr[1] as string | undefined;
        const errorCode = arr[2] as number | undefined;
        if (errorRpcId === rpcId || !errorRpcId) {
          throw new NotebookLMRPCError(
            `RPC error for method ${rpcId}: code ${errorCode ?? 'unknown'}`,
            { code: errorCode, methodId: rpcId }
          );
        }
      }

      // Check for successful response
      if (arr[0] === 'wrb.fr' && arr[1] === rpcId) {
        const jsonDataString = arr[2];
        if (typeof jsonDataString === 'string' && jsonDataString.length > 0) {
          try {
            return JSON.parse(jsonDataString) as unknown;
          } catch {
            throw new NotebookLMRPCError(
              `Failed to parse RPC result JSON for method ${rpcId}`,
              { methodId: rpcId }
            );
          }
        }
        // Empty result string — return null
        return null;
      }
    }
  }

  throw new NotebookLMRPCError(
    `No RPC result found for method ${rpcId} in response`,
    { methodId: rpcId }
  );
}

/**
 * Decode a full BatchExecute response text into the RPC result.
 *
 * Handles anti-XSSI stripping, chunked parsing, and result extraction.
 *
 * @param responseText - The raw response body from the BatchExecute endpoint
 * @param rpcId - The RPC method ID to extract results for
 * @returns The parsed result data
 * @throws NotebookLMRPCError on errors
 */
export function decodeResponse(
  responseText: string,
  rpcId: string
): unknown {
  if (!responseText || responseText.trim().length === 0) {
    throw new NotebookLMRPCError(
      `Empty response for method ${rpcId}`,
      { methodId: rpcId }
    );
  }

  const chunks = parseChunkedResponse(responseText);

  if (chunks.length === 0) {
    throw new NotebookLMRPCError(
      `No parseable chunks in response for method ${rpcId}`,
      { methodId: rpcId }
    );
  }

  return extractRpcResult(chunks, rpcId);
}
