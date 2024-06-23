/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "@/lib/firebase";
import { User } from "@/lib/firebase.types";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useFirestoreUser } from "@/lib/firebase.hooks";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import UploadProfileImage from "./upload-profile-image";

export default function ProfilePage() {
  const { user } = useFirestoreUser();
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const [cookies] = useCookies(["app.idt"]);
  const [jwt, setJwt] = useState<any | null>(null);

  useEffect(() => {
    const session = cookies?.["app.idt"];
    if (session) {
      const jwtPalyoad = jwtDecode(session);
      setJwt(jwtPalyoad);
    } else {
      setJwt(null);
    }
  }, [cookies]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);

    const data = new FormData(event.currentTarget);
    const values = Object.fromEntries(data.entries());
    const uid = getAuth(app)?.currentUser?.uid;
    if (!uid) {
      setSaving(false);
      toast({
        variant: "destructive",
        description: "missing uid, try logging in again",
      });
      return;
    }
    const profile: NonNullable<User["settings"]>["profile"] = values;
    try {
      await setDoc(
        doc(getFirestore(), "users/" + uid),
        {
          settings: { profile },
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
    setSaving(false);
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>
                Update your profile information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex gap-2 sm:gap-4">
                  <Avatar>
                    {user?.settings?.profile?.picture ? (
                      <img
                        src={user?.settings?.profile?.picture}
                        alt={jwt.email || jwt.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    ) : (
                      <img
                        src={jwt?.picture}
                        alt={jwt?.email || jwt?.name}
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                    )}
                    <AvatarFallback>CC</AvatarFallback>
                  </Avatar>

                  <UploadProfileImage />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    name="name"
                    autoComplete="given-name"
                    defaultValue={
                      user?.settings?.profile?.name || user?.idt?.name
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={
                      user?.settings?.profile?.email || user?.idt?.email
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    name="bio"
                    rows={3}
                    defaultValue={
                      user?.settings?.profile?.bio || "Awesome developer!"
                    }
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t p-6 flex justify-between">
              <span className="text-yellow-500 flex-1">
                {saving ? "Saving..." : ""}
              </span>
              <Button type="submit" className="ml-4">
                Save
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </Suspense>
  );
}
