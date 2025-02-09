"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { addSubscription, getStripePrice } from "@/lib/firebase";
import { onSnapshot } from "firebase/firestore";
import { useFirestoreUser } from "@/lib/firebase.hooks";
import Link from "next/link";
import { useCookies } from "react-cookie";
import { jwtDecode } from "jwt-decode";
import { CourseQueryResult, HomePageQueryResult } from "@/sanity/types";
import { Price3 } from "@/lib/stripe.types";

export default function Buy({
  title,
  stripeProduct,
}: {
  title: NonNullable<HomePageQueryResult>["featuredCourses"][0]["title"];
  stripeProduct: NonNullable<HomePageQueryResult>["featuredCourses"][0]["stripeProduct"];
}) {
  const { currentUser } = useFirestoreUser();
  const [redirecting, setRedirecting] = useState(false);
  const [price, setPrice] = useState<Price3 | null>(null);
  const [showBuy, setShowBuy] = useState(false);
  const { toast } = useToast();
  const [cookies] = useCookies(["app.idt"]);
  const [jwt, setJwt] = useState<any | null>(null);

  useEffect(() => {
    if (showBuy) setRedirecting(false);
  }, [showBuy]);

  useEffect(() => {
    const session = cookies?.["app.idt"];
    if (session) {
      const jwtPalyoad = jwtDecode(session);
      setJwt(jwtPalyoad);
    } else {
      setJwt(null);
    }
  }, [cookies]);

  const getPrice = async () => {
    const price = await getStripePrice({ stripeProduct });
    const priceData = price.data() as any;
    console.debug(priceData);
    setPrice(priceData);
  };

  useEffect(() => {
    if (stripeProduct && showBuy) getPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripeProduct, showBuy]);

  const onSubscribe = async () => {
    setRedirecting(true);
    const docRef = await addSubscription({ stripeProduct });

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
        <DialogTitle className="text-2xl font-bold">
          Purchase: {title}
        </DialogTitle>
      </DialogHeader>
      {price && (
        <div className="mt-4 flex gap-2 sm:gap-4 text-xl sm:text-2xl">
          <div className="flex items-center justify-between">Price:</div>
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold">{price.unit_amount / 100}</span>
            <span className="uppercase"> {price.currency}</span>
          </div>
        </div>
      )}
      <Button onClick={onSubscribe} disabled={redirecting}>
        {redirecting ? "Redirecting..." : "Continue to Stripe"}
        {!redirecting && <ArrowRightIcon className="ml-2" />}
      </Button>
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
          href="/login?redirectTo=/pro"
          className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          Login
        </Link>
      </div>
    </>
  );

  const hooray = (
    <>
      <DialogHeader>
        <DialogTitle>Pro</DialogTitle>
      </DialogHeader>
      You bought this course or are a Pro already 🎉
    </>
  );

  return (
    <>
      <Dialog onOpenChange={(open) => setShowBuy(open)} open={showBuy}>
        <DialogContent className="rounded-lg  p-6">
          {currentUser?.uid ? (jwt?.stripeRole ? hooray : subscribe) : login}
        </DialogContent>
      </Dialog>
      <Button
        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-foreground"
        onClick={() => setShowBuy(true)}
      >
        Buy Course
      </Button>
    </>
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
