"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useFirestoreUser } from "@/lib/firebase.hooks";
import type { Subscription } from "@/lib/stripe.types";
import {
	collection,
	doc,
	getFirestore,
	onSnapshot,
	query,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { useEffect, useState } from "react";

export default function Subscriptions() {
	const { currentUser } = useFirestoreUser();
	const [stripeSubscriptions, setStripeSubscriptions] = useState<
		Subscription[]
	>([]);
	const [showStripePortal, setShowStripePortal] = useState(false);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!currentUser?.uid) return;
		setLoading(true);
		const unsub = onSnapshot(
			query(
				collection(
					doc(collection(getFirestore(), "stripe-customers"), currentUser?.uid),
					"subscriptions",
				),
			),
			(querySnapshot) => {
				const subscriptions: Subscription[] = [];
				querySnapshot.forEach((doc) => {
					subscriptions.push({ id: doc.id, ...doc.data() } as Subscription);
				});
				setStripeSubscriptions(subscriptions);
				setLoading(false);
			},
		);
		return () => unsub();
	}, [currentUser]);

	const onShowStripePortal = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		setShowStripePortal(true);

		const functionRef = httpsCallable(
			getFunctions(),
			"ext-firestore-stripe-payments-createPortalLink",
		);
		const { data } = (await functionRef({
			returnUrl: window.location.href,
		})) as { data: { url: string } };
		window.location.assign(data.url);
	};

	return (
		<CardContent className="flex flex-col gap-4">
			<section>
				<h2 className="mb-4">Active Subscriptions</h2>
				<ScrollArea className="h-32 rounded-md border">
					<div className="p-4">
						{loading ? (
							<>Loading...</>
						) : (
							stripeSubscriptions
								?.filter((subscription) => subscription.status === "active")
								.map((sub) => (
									<div key={sub.id}>
										<div className="text-sm flex">
											{sub.items.map((item) => (
												<div className="flex items-center gap-2" key={item.id}>
													<p>{item.price.product.name}</p>
													<Badge>active</Badge>

													<p className="flex gap-2">
														{new Date(
															sub.current_period_start.seconds * 1000,
														).toLocaleString()}
														{" to "}
														{new Date(
															sub.current_period_end.seconds * 1000,
														).toLocaleString()}
													</p>
													{sub?.canceled_at && (
														<Badge variant="secondary">
															Canceled{" "}
															{new Date(
																sub.canceled_at.seconds * 1000,
															).toLocaleString()}
														</Badge>
													)}
												</div>
											))}
										</div>
										<Separator className="my-2" />
									</div>
								))
						)}
					</div>
				</ScrollArea>
			</section>
			<section>
				<h2 className="mb-4">Canceled Subscriptions</h2>
				<ScrollArea className="h-32 rounded-md border">
					<div className="p-4">
						{loading ? (
							<>Loading...</>
						) : (
							stripeSubscriptions
								?.filter((subscription) => subscription.status === "canceled")
								.map((sub) => (
									<div key={sub.id}>
										<div className="text-sm flex">
											{sub.items.map((item) => (
												<div className="flex items-center gap-2" key={item.id}>
													<p>{item.price.product.name}</p>
													<Badge variant="destructive">canceled</Badge>

													<p className="flex gap-2">
														{new Date(
															sub.current_period_start.seconds * 1000,
														).toLocaleString()}
														<span> to </span>
														{new Date(
															sub.current_period_end.seconds * 1000,
														).toLocaleString()}
														{sub?.canceled_at &&
															new Date(
																sub.canceled_at.seconds * 1000,
															).toLocaleString()}
													</p>
												</div>
											))}
										</div>
										<Separator className="my-2" />
									</div>
								))
						)}
					</div>
				</ScrollArea>
			</section>
			<section>
				<h2 className="mb-4">Stripe Portal</h2>

				<Button className="hover:cursor-pointer" onClick={onShowStripePortal}>
					{showStripePortal ? "Redirecting..." : "Open Stripe Portal"}
				</Button>
			</section>
		</CardContent>
	);
}
