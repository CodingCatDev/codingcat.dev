"use client";
import { useBookmarked, useFirestoreUser } from "@/lib/firebase.hooks";
import { Checkbox } from "@/components/ui/checkbox";
import type { BaseBookmarkContent } from "@/lib/types";
import { toast } from "sonner";

export default function Bookmark({
	content,
}: {
	content: BaseBookmarkContent;
}) {
	const { currentUser } = useFirestoreUser();
	const { bookmarked, addBookmark, removeBookmark } = useBookmarked({
		content,
	});

	const makeComplete = async (isChecked: boolean) => {
		if (!currentUser?.uid) {
			toast("You must be logged in to complete a lesson.");
			return;
		}
		if (isChecked) {
			await addBookmark();
			toast("Bookmark added 〽️");
		} else {
			await removeBookmark();
		}
	};
	return (
		<>
			{currentUser?.uid ? (
				<div className="flex items-center gap-2">
					<Checkbox
						checked={!!bookmarked?._id}
						onCheckedChange={makeComplete}
					/>
				</div>
			) : (
				<></>
			)}
		</>
	);
}
