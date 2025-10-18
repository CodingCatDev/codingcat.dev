'use client';

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudflareTurnstileWidget } from "@/components/cloudflare-turnstile";

const sponsorshipTiers = [
	{
		name: "Dedicated Video",
		price: "$4,000 USD",
		description:
			"A full video dedicated to your product or service. Includes a permanent logo and link on our sponsors page.",
		value: "dedicated-video",
	},
	{
		name: "Integrated Mid-Roll Ad (60 seconds)",
		price: "$1,800 USD",
		description:
			"A 60-second ad integrated into the middle of a video. Includes a permanent logo and link on our sponsors page.",
		value: "mid-roll-ad",
	},
	{
		name: "Quick Shout-Out (30 seconds)",
		price: "$900 USD",
		description:
			"A 30-second shout-out at the beginning of a video. Includes a permanent logo and link on our sponsors page.",
		value: "shout-out",
	},
	{
		name: "Blog Post / Newsletter Sponsorship",
		price: "$500 USD",
		description:
			"Sponsor a blog post or our weekly newsletter. Your logo and a link will be featured.",
		value: "blog-newsletter",
	},
	{
		name: "Video Series (Custom Pricing)",
		price: "Contact for pricing",
		description:
			"Sponsor a whole series of videos. Contact us for custom pricing and packages.",
		value: "video-series",
	},
];

const formSchema = z.object({
	fullName: z.string().min(2, {
		message: "Full name must be at least 2 characters.",
	}),
	email: z.string().email({
		message: "Please enter a valid email address.",
	}),
	companyName: z.string().optional(),
	sponsorshipTier: z.string().min(1, "Please select a sponsorship tier."),
	message: z.string().optional(),
	honeypot: z.string().optional(), // Honeypot field
	"cf-turnstile-response": z.string().min(1, { message: "Please complete the CAPTCHA." }),
});

export default function SponsorshipsPage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: "",
			email: "",
			companyName: "",
			sponsorshipTier: undefined,
			message: "",
			honeypot: "",
			"cf-turnstile-response": "",
		},
	});

	async function onSubmit(values: z.infer<typeof formSchema>) {
		// Honeypot check
		if (values.honeypot) {
			console.log("Honeypot field filled out, ignoring submission.");
			return;
		}
		// TODO: Add Cloudflare Turnstile verification here

		const response = await fetch("/api/sponsorship", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			// We only send the values that the API route expects, excluding the turnstile response
			// which is verified on the server from the body.
			// body: JSON.stringify({
			// 	...values,
			// 	// The turnstile token is automatically included in the form data
			// 	// and will be sent to the server.
			// }),
			body: JSON.stringify(values),
		});

		if (response.ok) {
			form.reset();
			// TODO: Show a success message to the user
			console.log("Sponsorship request submitted successfully!");
		} else {
			// TODO: Show an error message to the user
			console.error("Failed to submit sponsorship request.");
		}
	}

	return (
		<div className="container px-5 mx-auto">
			<div className="w-full flex flex-col gap-4 md:gap-8 my-8 md:my-12">
				<div className="flex flex-col gap-2 md:gap-4">
					<h1 className="text-3xl font-bold leading-tight tracking-tighter text-balance md:text-4xl md:leading-none lg:text-5xl">
						Sponsor CodingCat.dev
					</h1>
					<p className="text-lg text-muted-foreground">
						Reach a large audience of developers, students, and tech
						enthusiasts.
					</p>
				</div>

				<div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
					{sponsorshipTiers.map((tier) => (
						<Card key={tier.value}>
							<CardHeader>
								<CardTitle>{tier.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-2xl font-bold">{tier.price}</p>
								<p className="mt-2 text-muted-foreground">
									{tier.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>

				<div className="my-8">
					<h2 className="text-2xl font-bold text-center">
						Ready to Sponsor?
					</h2>
					<p className="text-center text-muted-foreground">
						Fill out the form below to get in touch.
					</p>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className="space-y-8 max-w-xl mx-auto mt-8"
						>
							<FormField
								control={form.control}
								name="fullName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input placeholder="Your Name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email Address</FormLabel>
										<FormControl>
											<Input placeholder="your.email@example.com" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="companyName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company Name</FormLabel>
										<FormControl>
											<Input placeholder="Your Company" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="sponsorshipTier"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Sponsorship Tier of Interest</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a tier" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{sponsorshipTiers.map((tier) => (
													<SelectItem key={tier.value} value={tier.value}>
														{tier.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Message</FormLabel>
										<FormControl>
											<Textarea
												placeholder="Tell us a little bit about your company and what you'd like to promote."
												className="resize-none"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							{/* Honeypot field - do not remove */}
							<FormField
								control={form.control}
								name="honeypot"
								render={({ field }) => (
									<FormItem className="hidden">
										<FormControl>
											<Input {...field} />
										</FormControl>
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="cf-turnstile-response"
								render={({ field, fieldState }) => (
									<FormItem>
										<FormControl>
											<CloudflareTurnstileWidget {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button type="submit">Submit Request</Button>
						</form>
					</Form>
				</div>
			</div>
		</div>
	);
}