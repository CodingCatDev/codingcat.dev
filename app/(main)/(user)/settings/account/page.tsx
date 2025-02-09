import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import Subscriptions from "./subscriptions";
import { Suspense } from "react";

export default function AccountPage() {
	return (
		<div className="grid gap-6">
			<Card>
				<CardHeader>
					<CardTitle>Account</CardTitle>
					<CardDescription>Manage your account settings.</CardDescription>
				</CardHeader>
				<Suspense fallback={<CardContent>Loading...</CardContent>}>
					<Subscriptions />
				</Suspense>
			</Card>

			{/* <Card>
        <CardHeader>
          <CardTitle>The Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4">
            <div className="grid gap-2 py-2">
              <Label htmlFor="delete-account">Delete Account</Label>
              <Button variant="destructive" id="delete-account">
                Delete Account
              </Button>
            </div>
          </form>
        </CardContent>
      </Card> */}
		</div>
	);
}
