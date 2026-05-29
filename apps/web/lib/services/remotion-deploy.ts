/**
 * Remotion Lambda deployment service — one-time CLI setup only.
 *
 * This file imports deploySite, deployFunction, and getOrCreateBucket from
 * @remotion/lambda, which pull in @rspack/core → @rspack/binding (a native
 * binary). These MUST NOT be imported from Vercel serverless routes.
 *
 * Run this locally or in CI to set up the Lambda infrastructure, then store
 * the resulting REMOTION_SERVE_URL and REMOTION_FUNCTION_NAME as env vars.
 *
 * @module lib/services/remotion-deploy
 */

import {
  deploySite,
  deployFunction,
  getOrCreateBucket,
  type AwsRegion,
} from "@remotion/lambda";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function log(message: string, data?: Record<string, unknown>): void {
  const ts = new Date().toISOString();
  if (data) {
    console.log(`[REMOTION] [${ts}] ${message}`, data);
  } else {
    console.log(`[REMOTION] [${ts}] ${message}`);
  }
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DeployResult {
  functionName: string;
  serveUrl: string;
  siteName: string;
  bucketName: string;
  region: string;
}

// ---------------------------------------------------------------------------
// Deploy helper (one-time setup)
// ---------------------------------------------------------------------------

/**
 * Deploy the Remotion Lambda infrastructure (one-time setup).
 *
 * This will:
 * 1. Create or reuse an S3 bucket for Remotion
 * 2. Deploy the Remotion bundle (site) to S3
 * 3. Deploy the Lambda function
 *
 * After running this, set the returned `serveUrl` as REMOTION_SERVE_URL
 * and `functionName` as REMOTION_FUNCTION_NAME in your environment.
 *
 * @param entryPoint - Path to the Remotion entry file (e.g., "remotion/index.ts")
 * @returns Deploy result with function name, serve URL, etc.
 */
export async function deployRemotionLambda(
  entryPoint: string = "remotion/index.ts"
): Promise<DeployResult> {
  const region = (process.env.REMOTION_AWS_REGION || "us-east-1") as AwsRegion;

  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    throw new Error(
      "[REMOTION] Cannot deploy: AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY " +
        "must be set in environment variables."
    );
  }

  log("Starting Remotion Lambda deployment", { region, entryPoint });

  // Step 1: Get or create the S3 bucket
  log("Step 1/3: Getting or creating S3 bucket...");
  let bucketName: string;
  try {
    const bucketResult = await getOrCreateBucket({ region });
    bucketName = bucketResult.bucketName;
    log(`Bucket ready: ${bucketName}`);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `[REMOTION] Failed to get or create S3 bucket in ${region}: ${message}. ` +
        `Ensure your AWS credentials have S3 permissions.`
    );
  }

  // Step 2: Deploy the site (bundle) to S3
  log("Step 2/3: Deploying Remotion bundle to S3...");
  let serveUrl: string;
  let siteName: string;
  try {
    const siteResult = await deploySite({
      entryPoint,
      bucketName,
      region,
      siteName: "codingcat-video-pipeline",
      options: {
        onBundleProgress: (progress: number) => {
          if (progress % 25 === 0 || progress === 100) {
            log(`Bundle progress: ${progress}%`);
          }
        },
        onUploadProgress: (upload) => {
          if (upload.totalFiles > 0) {
            const pct = Math.round(
              (upload.filesUploaded / upload.totalFiles) * 100
            );
            if (pct % 25 === 0) {
              log(
                `Upload progress: ${upload.filesUploaded}/${upload.totalFiles} files (${pct}%)`
              );
            }
          }
        },
      },
    });
    serveUrl = siteResult.serveUrl;
    siteName = siteResult.siteName;
    log(`Site deployed: ${serveUrl}`, { siteName });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `[REMOTION] Failed to deploy site to S3: ${message}. ` +
        `Ensure the entry point "${entryPoint}" exists and is a valid Remotion project.`
    );
  }

  // Step 3: Deploy the Lambda function
  log("Step 3/3: Deploying Lambda function...");
  let functionName: string;
  try {
    const fnResult = await deployFunction({
      region,
      timeoutInSeconds: 240,
      memorySizeInMb: 2048,
      createCloudWatchLogGroup: true,
      cloudWatchLogRetentionPeriodInDays: 14,
      diskSizeInMb: 2048,
    });
    functionName = fnResult.functionName;
    log(
      `Lambda function deployed: ${functionName}` +
        (fnResult.alreadyExisted ? " (already existed)" : " (newly created)")
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `[REMOTION] Failed to deploy Lambda function: ${message}. ` +
        `Ensure your AWS credentials have Lambda and IAM permissions. ` +
        `See: https://www.remotion.dev/docs/lambda/permissions`
    );
  }

  log("Deployment complete! Set these environment variables:", {
    REMOTION_SERVE_URL: serveUrl,
    REMOTION_FUNCTION_NAME: functionName,
    REMOTION_AWS_REGION: region,
  });

  return {
    functionName,
    serveUrl,
    siteName,
    bucketName,
    region,
  };
}
