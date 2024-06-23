"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { addSubscription } from "@/lib/firebase";
import { onSnapshot } from "firebase/firestore";
import { useFirestoreUser } from "@/lib/firebase.hooks";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { usePathname } from "next/navigation";

export default function GoPro({
  setShowGoPro,
}: {
  setShowGoPro: Dispatch<SetStateAction<boolean>>;
}) {
  const { currentUser } = useFirestoreUser();
  const [subType, setSubType] = useState("yearly");
  const [redirecting, setRedirecting] = useState(false);
  const { toast } = useToast();
  const [cookies] = useCookies(["app.idt"]);
  const [jwt, setJwt] = useState<any | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const session = cookies?.["app.idt"];
    if (session) {
      const jwtPalyoad = jwtDecode(session);
      setJwt(jwtPalyoad);
    } else {
      setJwt(null);
    }
  }, [cookies]);

  const onSubscribe = async () => {
    setRedirecting(true);
    const docRef = await addSubscription({ productRole: subType });

    onSnapshot(docRef, (snap) => {
      const { error, url } = snap.data() as { error: Error; url: string };
      if (error) {
        console.error(error);
        toast({
          variant: "destructive",
          description: error.message,
        });
      }
      if (url) {
        // We have a Stripe Checkout URL, let's redirect.
        window.location.assign(url);
      }
    });
  };

  const subscribe = (
    <>
      <DialogHeader>
        <DialogTitle>Select Subscription Type</DialogTitle>
      </DialogHeader>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          className={`rounded-lg p-4 hover:cursor-pointer ${subType === "monthly" && "bg-primary"}`}
          onClick={() => setSubType("monthly")}
        >
          <div className="flex justify-between">
            <div>
              <div className="text-sm">Monthly</div>
              <div className="text-3xl font-bold">$29</div>
              <div className="text-sm">Just $0.79 per day</div>
            </div>
            {subType === "monthly" && <CheckIcon className="" />}
          </div>
        </Card>
        <Card
          className={`rounded-lg p-4 hover:cursor-pointer ${subType === "yearly" && "bg-primary"}`}
          onClick={() => setSubType("yearly")}
        >
          <div className="flex justify-between">
            <div>
              <div className="text-sm">yearly</div>
              <div className="text-3xl font-bold">$199</div>
              <div className="text-sm">Save $149 compared to monthly</div>
            </div>
            {subType === "yearly" && <CheckIcon className="" />}
          </div>
        </Card>
      </div>
      <div className="mt-4 rounded-lg  p-4 ">
        <div className="text-xl font-bold">Pro</div>
        <ul className="mt-4 space-y-2">
          <li className="flex items-center">
            <RocketIcon className="mr-2 " />
            Watch all PRO courses
          </li>
          <li className="flex items-center">
            <ClockIcon className="mr-2 " />
            Join PRO office hours
          </li>
          <li className="flex items-center">
            <BookIcon className="mr-2 " />
            Read all PRO posts
          </li>
          <li className="flex items-center">
            <PaletteIcon className="mr-2 " />
            Pro Picked Custom Theme
          </li>
        </ul>
      </div>
      <div className="mt-6 flex justify-end">
        <Button onClick={onSubscribe} disabled={redirecting}>
          {redirecting ? "Redirecting..." : "Continue to Stripe"}
          {!redirecting && <ArrowRightIcon className="ml-2" />}
        </Button>
      </div>
    </>
  );

  const login = (
    <>
      <DialogHeader>
        <DialogTitle>Login First</DialogTitle>
      </DialogHeader>
      <div className="mt-4 grid gap-2 sm:gap-4">
        <p>First you will need to login.</p>
        <Link
          href={`/login?redirectTo=${pathname}`}
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Login
        </Link>
      </div>
    </>
  );

  const hooray = <>You are a Pro 🎉</>;

  return (
    <Dialog defaultOpen onOpenChange={(open) => setShowGoPro(open)}>
      <DialogContent className="rounded-lg  p-6">
        {currentUser?.uid ? (jwt?.stripeRole ? hooray : subscribe) : login}
      </DialogContent>
    </Dialog>
  );
}

function ArrowRightIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

function BookIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  );
}

function CheckIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function ClockIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function PaletteIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  );
}

function RocketIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}
