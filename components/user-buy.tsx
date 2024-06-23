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
import { CourseQueryResult, HomePageQueryResult } from "@/sanity.types";

export default function Buy({
  title,
  stripeProduct,
}: {
  title: NonNullable<HomePageQueryResult>["featuredCourses"][0]["title"];
  stripeProduct: NonNullable<HomePageQueryResult>["featuredCourses"][0]["stripeProduct"];
}) {
  const { currentUser } = useFirestoreUser();
  const [redirecting, setRedirecting] = useState(false);
  const [price, setPrice] = useState({
    product: "",
    unit_amount: 0,
  });
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
    setPrice(price.data() as any);
  };

  useEffect(() => {
    if (stripeProduct) getPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stripeProduct]);

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
        <DialogTitle>Purchase {title}</DialogTitle>
      </DialogHeader>
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

  const hooray = <>You bought this course or are a Pro 🎉</>;

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
