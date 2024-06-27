"use client";
import { useBookmarked, useFirestoreUser } from "@/lib/firebase.hooks";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { BaseBookmarkContent } from "@/lib/types";

export default function Bookmark({
  content,
}: {
  content: BaseBookmarkContent;
}) {
  const { currentUser } = useFirestoreUser();
  const { bookmarked, addBookmark, removeBookmark } = useBookmarked({
    content,
  });
  const { toast } = useToast();

  const makeComplete = async (isChecked: boolean) => {
    if (!currentUser?.uid) {
      toast({
        variant: "destructive",
        description: "You must be logged in to complete a lesson.",
      });
      return;
    }
    if (isChecked) {
      await addBookmark();
      toast({
        description: "Bookmark added 〽️",
      });
    } else {
      await removeBookmark();
    }
  };
  return (
    <>
      {currentUser?.uid ? (
        <div className="flex items-center gap-2">
          <Checkbox
            checked={bookmarked?._id ? true : false}
            onCheckedChange={makeComplete}
          />
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
