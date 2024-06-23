"use client";
import { useEffect, useState } from "react";
import GoPro from "./user-go-pro";
import Link from "next/link";
import CoverImage from "./cover-image";
import { CloudinaryAsset } from "@/sanity.types";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";

export default function ProBenefits({
  coverImage,
}: {
  coverImage: CloudinaryAsset;
}) {
  const [showGoPro, setShowGoPro] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const showSubscribe = searchParams.get("showSubscribe");

  useEffect(() => {
    if (showSubscribe) {
      router.replace("/pro");
      setShowGoPro(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const proButton = (
    <Button
      className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      onClick={() => setShowGoPro(true)}
    >
      Sign Up for Pro
    </Button>
  );

  return (
    <>
      {showGoPro && <GoPro setShowGoPro={setShowGoPro} />}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Take Your Experience to the Next Level
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Unlock premium benefits with our CodingCat.dev Pro plan,
                  including advanced courses, lifetime access, and personalized
                  support.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {proButton}
                {/* <Link
                  href="pro/learn-more"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  prefetch={false}
                >
                  Learn More
                </Link> */}
              </div>
            </div>
            <CoverImage
              image={coverImage}
              width={550}
              height={550}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full"
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
            <div className="space-y-4">
              <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Unlock Exclusive Content
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                As a CodingCat.dev Pro member, you&apos;ll gain access to our
                advanced course library, covering topics like machine learning,
                data science, and cloud architecture.
              </p>
              <Link
                href="/courses"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Explore Courses
              </Link>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                As a CodingCat.dev Pro member, you&apos;ll have access to all of
                our premium content, ensuring you can learn at your own pace and
                revisit materials whenever you need.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Personalized Support
              </div>
              <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Get Tailored Guidance
              </h2>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed">
                As a CodingCat.dev Pro member, you&apos;ll have access to our
                team of expert instructors who can provide personalized support
                and feedback to help you achieve your learning goals.
              </p>
              <Link
                href="#"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                prefetch={false}
              >
                Contact Support
              </Link>
            </div>
            <div className="flex flex-col items-start space-y-4">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                Pricing
              </div>
              <h2 className="lg:leading-tighter text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                Affordable Plans
              </h2>
              <div className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Monthly</span>
                    <span className="text-2xl font-bold">$29</span>
                  </div>
                  <p className="text-muted-foreground">
                    Billed monthly, cancel anytime.
                  </p>
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Yearly</span>
                    <span className="text-2xl font-bold">$199</span>
                  </div>
                  <p className="text-muted-foreground">
                    Save $149, compared to monthly
                  </p>
                </div>
              </div>
              {proButton}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
