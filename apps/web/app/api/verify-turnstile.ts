import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const { "cf-turnstile-response": turnstileToken } = await request.json();

	const secretKey = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;

	if (!secretKey) {
		return NextResponse.json(
			{ success: false, message: "TURNSTILE_SECRET_KEY is not set" },
			{ status: 500 },
		);
	}

	const response = await fetch(
		"https://challenges.cloudflare.com/turnstile/v0/siteverify",
		{
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: `secret=${secretKey}&response=${turnstileToken}`,
		},
	);

	const data = await response.json();

	if (data.success) {
		return NextResponse.json({
			success: true,
			message: "Turnstile verification successful",
		});
	} else {
		return NextResponse.json(
			{ success: false, message: "Turnstile verification failed" },
			{ status: 400 },
		);
	}
}
