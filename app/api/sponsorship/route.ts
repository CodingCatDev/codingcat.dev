import { NextResponse } from "next/server";
import { z } from "zod";
import { apiVersion, dataset, projectId } from "@/sanity/lib/api";
import { createClient } from "next-sanity";
import { Resend } from "resend";
import { EmailTemplate } from "./sponsorship-template";
import { formSchema } from "@/lib/sponsorship-schema";
import { render } from "@react-email/render";

const sanityWriteClient = createClient({
	projectId,
	dataset,
	apiVersion,
	token: process.env.SANITY_API_WRITE_TOKEN,
	perspective: "published",
	useCdn: false,
});

const resend = new Resend(process.env.RESEND_SPONSORSHIP_API_KEY);

const rateLimitStore: Record<string, { count: number; timestamp: number }> = {};

const RATE_LIMIT_COUNT = 2; // 2 requests
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export async function POST(request: Request) {
	console.log("Received sponsorship request");
	const body = await request.json();
	console.log("Request body:", body);

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
			console.warn("Honeypot triggered");
			return NextResponse.json({ message: "Spam detected" }, { status: 400 });
		}

		const ip =
			request.headers.get("x-forwarded-for") ||
			request.headers.get("CF-Connecting-IP") ||
			"127.0.0.1";
		console.log("Client IP:", ip);

		const now = Date.now();
		const userEntry = rateLimitStore[ip];
		console.log("Rate limit store:", rateLimitStore);

		if (userEntry && now - userEntry.timestamp < RATE_LIMIT_WINDOW) {
			if (userEntry.count >= RATE_LIMIT_COUNT) {
				console.warn("Rate limit exceeded for IP:", ip);
				return NextResponse.json(
					{ message: "Too many requests" },
					{ status: 429 },
				);
			}
			userEntry.count++;
		} else {
			rateLimitStore[ip] = { count: 1, timestamp: now };
		}

		console.log("Verifying Turnstile token");
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
			},
		);
		const turnstileData = await turnstileResponse.json();
		console.log("Turnstile response:", turnstileData);
		if (!turnstileData.success) {
			console.warn("Invalid CAPTCHA", turnstileData["error-codes"]);
			return NextResponse.json(
				{ message: "Invalid CAPTCHA", details: turnstileData["error-codes"] },
				{ status: 400 },
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
			console.log("Creating Sanity document:", sponsorshipRequest);
			const sanityResponse = await sanityWriteClient.create(sponsorshipRequest);
			console.log("Sanity response:", sanityResponse);
		} catch (error) {
			console.error("Failed to save sponsorship request:", error);
			return NextResponse.json(
				{ message: "Failed to save sponsorship request", details: error },
				{ status: 500 },
			);
		}

		try {
			console.log("Sending email with Resend");
			const { data, error } = await resend.emails.send({
				from: "Sponsorships <onboarding@resend.dev>",
				to: ["alex@codingcat.dev"],
				subject: "New Sponsorship Request",
				html: await render(
					EmailTemplate({
						fullName,
						email,
						companyName,
						sponsorshipTier,
						message,
					}),
				),
			});
			console.log("Resend response:", { data, error });
			if (error) {
				console.error("Failed to send email:", error);
				return NextResponse.json({ message: error.message }, { status: 400 });
			}
		} catch (error) {
			console.error("Error sending email with Resend:", error);
			return NextResponse.json(
				{ message: "Failed to send email" },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			message: "Sponsorship request submitted successfully",
		});
	} catch (error) {
		console.error("Error processing sponsorship request:", error);
		if (error instanceof z.ZodError) {
			return NextResponse.json({ message: error.message }, { status: 400 });
		}
		return NextResponse.json(
			{ message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
