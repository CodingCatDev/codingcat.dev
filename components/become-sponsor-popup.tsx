"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Link from "next/link";

export function BecomeSponsorPopup() {
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsOpen(true);
		}, 5000); // 5 seconds

		return () => clearTimeout(timer);
	}, []);

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Become a Sponsor!</AlertDialogTitle>
					<AlertDialogDescription>
						Enjoying the content? Help us keep it going by becoming a sponsor.
						You&apos;ll get your brand in front of a large audience of
						developers.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Maybe later</AlertDialogCancel>
					<AlertDialogAction asChild>
						<Link href="/sponsorships">Learn More</Link>
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
