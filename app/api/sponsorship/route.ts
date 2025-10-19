
import { NextResponse } from "next/server";
import { z } from "zod";
import { apiVersion, dataset, projectId } from "@/sanity/lib/api";
import { createClient } from "next-sanity";
import { Resend } from 'resend';
import { EmailTemplate } from "./sponsorship-template";
import { formSchema } from "@/lib/sponsorship-schema";

const sanityWriteClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_API_WRITE_TOKEN,
  perspective: "published",
  useCdn: false,
});

const resend = new Resend(process.env.RESEND_API_KEY);

const rateLimitStore: Record<string, { count: number; timestamp: number }> = {};

const RATE_LIMIT_COUNT = 2; // 2 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export async function POST(request: Request) {
  const body = await request.json();

  try {
    const {
      fullName,
      email,
      companyName,
      sponsorshipTier,
      message,
      honeypot,
      "cf-turnstile-response": turnstileToken,
    } = formSchema.parse(body);

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ message: "Spam detected" }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for") || request.headers.get("CF-Connecting-IP") || "127.0.0.1";

    const now = Date.now();
    const userEntry = rateLimitStore[ip];

    if (userEntry && now - userEntry.timestamp < RATE_LIMIT_WINDOW) {
      if (userEntry.count >= RATE_LIMIT_COUNT) {
        return NextResponse.json({ message: "Too many requests" }, { status: 429 });
      }
      userEntry.count++;
    } else {
      rateLimitStore[ip] = { count: 1, timestamp: now };
    }

    const turnstileResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
          response: turnstileToken,
          remoteip: ip,
        }),
      }
    );
    const turnstileData = await turnstileResponse.json();
    if (!turnstileData.success) {
      return NextResponse.json(
        { message: "Invalid CAPTCHA", details: turnstileData["error-codes"] },
        { status: 400 }
      );
    }

    const sponsorshipRequest = {
      _type: "sponsorshipRequest",
      fullName,
      email,
      companyName,
      sponsorshipTier,
      message,
    };

    try {
      await sanityWriteClient.create(sponsorshipRequest);
    } catch (error) {
      return NextResponse.json(
        { message: "Failed to save sponsorship request", details: error },
        { status: 500 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['delivered@resend.dev'],
      subject: 'New Sponsorship Request',
      react: EmailTemplate({
        fullName,
        email,
        companyName,
        sponsorshipTier,
        message,
      }),
    });

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }


    return NextResponse.json({ message: "Sponsorship request submitted successfully" });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
