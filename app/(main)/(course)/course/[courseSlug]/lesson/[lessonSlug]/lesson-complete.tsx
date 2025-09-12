"use client";
import { useCompletedLesson, useFirestoreUser } from "@/lib/firebase.hooks";
import { Checkbox } from "@/components/ui/checkbox";
import type { LessonsInCourseQueryResult } from "@/sanity/types";
import { toast } from "sonner";
import type { BaseCompletedLesson } from "@/lib/types";

export default function LessonComplete({
	lesson,
	course,
}: {
	lesson: BaseCompletedLesson;
	course: NonNullable<LessonsInCourseQueryResult>;
}) {
	const { currentUser } = useFirestoreUser();
	const { completeLesson, addComplete, removeComplete } = useCompletedLesson({
		lesson,
		course,
	});

	const makeComplete = async (isChecked: boolean | "indeterminate") => {
		if (!currentUser?.uid) {
			toast("You must be logged in to complete a lesson.");
			return;
		}
		if (isChecked) {
			await addComplete();
			toast("What a rockstar! 🎉");
		} else {
			await removeComplete();
		}
	};
	return (
		<>
			{currentUser?.uid ? (
				<div className="flex items-center gap-2">
					<Checkbox
						checked={!!completeLesson?._id}
						onCheckedChange={makeComplete}
					/>
				</div>
			) : (
				<></>
			)}
		</>
	);
}
