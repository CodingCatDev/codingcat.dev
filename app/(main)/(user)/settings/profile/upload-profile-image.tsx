/* eslint-disable @next/next/no-img-element */
"use client";
import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useFirestoreUser } from "@/lib/firebase.hooks";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa6";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { setDoc, doc, getFirestore } from "firebase/firestore";

export default function UploadProfileImage() {
  const [open, setOpen] = useState(false);
  const { currentUser, user } = useFirestoreUser();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const reset = () => {
    setUploading(false);
    setProgress(0);
    setOpen(false);
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);

    if (!currentUser?.uid) {
      toast({ variant: "destructive", description: "Please login first" });
      reset();
      return;
    }

    const file = acceptedFiles.at(0);

    if (!file) {
      toast({
        variant: "destructive",
        description: "File not found or invalid",
      });
      reset();
      return;
    }

    try {
      const uploadTask = uploadBytesResumable(
        ref(getStorage(), `users/${currentUser.uid}/settings/profile/picture`),
        file
      );

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error: any) => {
          console.error(error);
          toast({
            variant: "destructive",
            description: "Failed to upload image",
          });
          reset();
        },
        async () => {
          const url = await getDownloadURL(
            ref(getStorage(), uploadTask.snapshot.ref.fullPath)
          );
          try {
            await setDoc(
              doc(getFirestore(), "users/" + currentUser.uid),
              {
                settings: { profile: { picture: url } },
              },
              { merge: true }
            );
            toast({
              description: "Saved.",
            });
          } catch (error) {
            toast({
              variant: "destructive",
              description: JSON.stringify(error),
            });
          }
          reset();
        }
      );
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        description: "Failed to upload image",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
      "image/webp": [".webp"],
    },
  });

  const removeProfileImage = async () => {
    if (!currentUser?.uid) {
      toast({
        variant: "destructive",
        description: "Must be logged in to remove image",
      });
      return;
    }
    await setDoc(
      doc(getFirestore(), "users/" + currentUser.uid),
      {
        settings: { profile: { picture: null } },
      },
      { merge: true }
    );
    // Remove object but we don't care about the result
    deleteObject(
      ref(getStorage(), `users/${currentUser.uid}/settings/profile/picture`)
    );
  };

  return (
    <>
      {currentUser?.uid ? (
        <div className="flex items-center justify-center gap-2">
          <Dialog
            open={open}
            onOpenChange={(open) => {
              reset();
              setOpen(open);
            }}
          >
            <DialogTrigger asChild>
              <Button variant="outline">Upload Image</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Upload Image</DialogTitle>
                <DialogDescription>
                  Drag and drop an image or click to upload. You can also take a
                  new photo on mobile.
                </DialogDescription>
              </DialogHeader>
              {!uploading && (
                <div className="grid gap-4 py-4">
                  <div
                    className="flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-colors hover:border-gray-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 hover:cursor-pointer"
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    {isDragActive ? (
                      <span>Drop the files here...</span>
                    ) : (
                      <div className="grid gap-1 text-center">
                        <FaUpload className="mx-auto h-6 w-6" />
                        <span>Drag and drop or click to upload</span>
                        <span className="text-sm">
                          *.jpeg, *.jpg, *.png, *.webp
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <DialogFooter>
                {uploading && <Progress value={progress} />}
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {user?.settings?.profile?.picture && (
            <Button variant="destructive" onClick={() => removeProfileImage()}>
              {removing ? "Removing..." : "Reset"}
            </Button>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  );
}
