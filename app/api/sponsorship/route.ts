
import { NextResponse } from "next/server";
import { z } from "zod";
import { client } from "@/sanity/lib/client";

const formSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  companyName: z.string().optional(),
  sponsorshipTier: z.string(),
  message: z.string().optional(),
  honeypot: z.string().optional(),
});

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
    } = formSchema.parse(body);

    // Honeypot check
    if (honeypot) {
      return NextResponse.json({ message: "Spam detected" }, { status: 400 });
    }

    // TODO: Verify Cloudflare Turnstile token
    // const turnstileToken = request.headers.get("X-Turnstile-Token");
    // const ip = request.headers.get("CF-Connecting-IP");
    // const turnstileResponse = await fetch(
    //   "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({
    //       secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
    //       response: turnstileToken,
    //       remoteip: ip,
    //     }),
    //   }
    // );
    // const turnstileData = await turnstileResponse.json();
    // if (!turnstileData.success) {
    //   return NextResponse.json({ message: "Spam detected" }, { status: 400 });
    // }

    const sponsorshipRequest = {
      _type: "sponsorshipRequest",
      fullName,
      email,
      companyName,
      sponsorshipTier,
      message,
    };

    await client.create(sponsorshipRequest);

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
