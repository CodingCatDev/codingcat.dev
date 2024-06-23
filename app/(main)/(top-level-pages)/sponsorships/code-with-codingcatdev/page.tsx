import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import PortableText from "@/components/portable-text";

import type { PageQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { BreadcrumbLinks } from "@/components/breadrumb-links";
import SponsorshipCards from "../sponsorship-cards";
import SponsorshipForm from "../sponsorship-form";
import AJPrimary from "@/components/icons/aj-primary";

type Props = {
  params: false;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const page = await sanityFetch<PageQueryResult>({
    query: pageQuery,
    params: {
      slug: "code-with-codingcatdev",
    },
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(page?.coverImage);

  return {
    title: page?.title,
    description: page?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function SponsorshipsPage() {
  const [page] = await Promise.all([
    sanityFetch<PageQueryResult>({
      query: pageQuery,
      params: {
        slug: "code-with-codingcatdev",
      },
    }),
  ]);

  if (!page?._id) {
    return notFound();
  }

  return (
    <div className="container px-5 mx-auto">
      <BreadcrumbLinks
        links={[
          { title: "Sponsorships", href: "/sponsorships" },
          { title: page.title },
        ]}
      />
      <section className="grid grid-cols-1 gap-2 md:mx-8 md:gap-8 mx-auto prose-violet lg:prose-xl dark:prose-invert">
        <div className="flex flex-col items-center sm:hidden">
          <AJPrimary cls="w-48 h-48" />
        </div>
        <div className="flex justify-center m-4">
          <h1 className="flex flex-col gap-2">
            <span className="text-xl md:text-4xl">Sponsorship for</span>
            <span className="md:text-6xl font-extrabold">
              {" "}
              Code with CodingCat.dev{" "}
            </span>
            <span className="text-xl md:text-2xl">
              a CodingCat.dev Production
            </span>
          </h1>
          <div className="flex-col items-center hidden sm:flex">
            <AJPrimary cls="w-48 h-48" />
          </div>
        </div>
        <div className="flex justify-center bg-muted/50 ">
          <div className="flex flex-col p-8">
            <section className="my-8 flex flex-col gap-1 md:gap-4">
              <p className="">
                On CodingCat.dev your advertisement is{" "}
                <span className="uppercase text-primary font-black text-3xl">
                  permanent
                </span>
                !
              </p>
              <p>
                You read that right, it is not just while you are sponsoring and
                it doesn&apos;t change by the flavor of the week like Carbon or
                Google Ads.
              </p>

              <p>
                Streaming sponsorship is a great way to reach a highly engaged
                audience of potential customers. By sponsoring a stream, your
                company can be featured prominently on the footer of the stream
                of{" "}
                <span className="uppercase font-black text-2xl text-primary">
                  over 16K subscribers
                </span>
                , with the opportunity to reach a large number of viewers who
                are already interested in the topics your video is about.
              </p>
            </section>
          </div>
        </div>
        <SponsorshipForm />
        <div className="flex justify-center bg-muted/50 ">
          <div className="flex flex-col p-8">
            <div className="flex justify-center w-full gap-4 p-8 font-extrabold">
              <p className="text-4xl">
                <span className="text-8xl text-primary"> Why </span>
                <span className="font-bold">
                  would you sponsor live coding?
                </span>
              </p>
            </div>
            <ul>
              <li>
                <strong>Reach a large audience:</strong>
                Live streaming on YouTube and Twitch is a great way to reach a
                large audience. In fact, YouTube Live is one of the most popular
                live streaming platforms in the world, with millions of viewers
                tuning in each day.
              </li>
              <li>
                <strong>Engage with your audience:</strong>
                Live streaming is also a great way to engage with your audience.
                You can interact with viewers in real time, answer questions,
                and get feedback. This can help you build relationships with
                your audience and create a sense of community.
              </li>
              <li>
                <strong>Promote your brand:</strong>
                Live streaming is a great way to promote your brand. You can use
                live streaming to showcase your products or services, announce
                new initiatives, or simply share your company culture. This can
                help you raise awareness of your brand and attract new
                customers.
              </li>
              <li>
                <strong>Drive traffic to your website:</strong>
                Live streaming can also help you drive traffic to your website.
                You can include a link to your website in your live stream
                description, or you can encourage viewers to visit your website
                for more information. This can help you increase website traffic
                and generate leads.
              </li>
            </ul>
          </div>
        </div>
        <div className="flex justify-center bg-muted/50 ">
          <div className="flex flex-col p-8">
            <p>
              If you&apos;re looking for a way to reach a large audience, engage
              with your audience, promote your brand, and drive traffic to your
              website, then sponsoring live YouTube is a great option.
            </p>
          </div>
        </div>
        <SponsorshipCards />
      </section>
    </div>
  );
}
