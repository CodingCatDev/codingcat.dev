import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Suspense } from "react";
import Profile from "./profile";

export default function ProfilePage() {
	return (
		<div className="grid gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Profile</CardTitle>
					<CardDescription>Update your profile information.</CardDescription>
				</CardHeader>
				<Suspense fallback={<CardContent>Loading...</CardContent>}>
					<Profile />
				</Suspense>
			</Card>
		</div>
	);
}
