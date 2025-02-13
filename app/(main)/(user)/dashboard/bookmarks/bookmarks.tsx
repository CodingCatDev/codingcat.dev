"use client";
import CloudinaryImage from "@/components/cloudinary-image";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/components/ui/card";
import { useBookmarks } from "@/lib/firebase.hooks";
import Link from "next/link";

export default function Bookmarks() {
	const { bookmarks } = useBookmarks();

	return (
		<>
			{bookmarks.map((bookmark) => (
				<Card
					key={bookmark._id}
					className="overflow-hidden shadow-md transition-all hover:scale-[1.02] hover:shadow-lg relative flex flex-col"
				>
					{bookmark?.coverImage?.public_id && (
						<CardHeader className="p-0">
							<Link href={bookmark._cc_pathname} className="block mb-5 group">
								<CloudinaryImage
									src={bookmark?.coverImage?.public_id}
									alt={bookmark?.coverImage?.context?.custom?.alt || ""}
								/>
							</Link>
						</CardHeader>
					)}
					<CardContent className="flex-grow">
						<h3 className="mb-3 text-3xl leading-snug text-balance">
							<Link href={bookmark._cc_pathname} className="hover:underline">
								{bookmark.title}
							</Link>
						</h3>
					</CardContent>
					<CardFooter>
						<Badge>{bookmark?._type}</Badge>
					</CardFooter>
				</Card>
			))}
		</>
	);
}
