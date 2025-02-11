import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Suspense } from "react";
import Appearance from "./appearance";

export default function AppearancePage() {
	return (
		<div className="grid gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Appearance</CardTitle>
					<CardDescription>
						Customize the appearance of the application.
					</CardDescription>
				</CardHeader>
				<Suspense fallback={<CardContent>Loading...</CardContent>}>
					<Appearance />
				</Suspense>
			</Card>
		</div>
	);
}
