import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default async function LoginPage(props: {
	searchParams: Promise<{ error?: string }>;
}) {
	const { error } = await props.searchParams;

	async function signIn(formData: FormData) {
		"use server";

		const email = formData.get("email") as string;
		const password = formData.get("password") as string;

		const supabase = await createClient();
		const { error } = await supabase.auth.signInWithPassword({
			email,
			password,
		});

		if (error) {
			redirect(`/dashboard/login?error=${encodeURIComponent(error.message)}`);
		}

		redirect("/dashboard");
	}

	return (
		<div className="flex min-h-screen items-center justify-center bg-background">
			<Card className="w-full max-w-sm">
				<CardHeader>
					<CardTitle className="text-2xl">CodingCat.dev</CardTitle>
					<CardDescription>
						Sign in to the Content Ops Dashboard
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={signIn} className="flex flex-col gap-4">
						{error && (
							<div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
								{error}
							</div>
						)}
						<div className="flex flex-col gap-2">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="admin@codingcat.dev"
								required
							/>
						</div>
						<div className="flex flex-col gap-2">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								name="password"
								type="password"
								required
							/>
						</div>
						<Button type="submit" className="w-full">
							Sign In
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
