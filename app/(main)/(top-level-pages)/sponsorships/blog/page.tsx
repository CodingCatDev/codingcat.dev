import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

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
      slug: "blog",
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
        slug: "blog",
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
      <section className="grid grid-cols-1 gap-2 mx-2 md:mx-8 md:gap-8 markdown">
        <div className="flex flex-col items-center sm:hidden">
          <AJPrimary cls="w-48 h-48" />
        </div>
        <div className="flex justify-center m-4">
          <h1 className="flex flex-col gap-2">
            <span className="text-xl md:text-4xl">Sponsorship for</span>
            <span className="md:text-6xl font-extrabold">
              {" "}
              CodingCat.dev Blog{" "}
            </span>
            <span className="text-xl md:text-2xl">
              a CodingCat.dev Production
            </span>
          </h1>
          <div className="flex-col items-center hidden sm:flex">
            <AJPrimary cls="w-48 h-48" />
          </div>
        </div>
        <div className="flex justify-center card bg-muted/50 text-2xl">
          <div className="flex flex-col p-8">
            <div className="flex justify-center w-full gap-4 p-8 font-extrabold">
              <p className="text-4xl">
                <span className="text-8xl text-primary-500"> Why </span>
                <span className="font-bold">would you sponsor our blog?</span>
              </p>
            </div>
            <section className="my-8 flex flex-col gap-1 md:gap-4">
              <p className="">
                On CodingCat.dev your advertisement is{" "}
                <span className="uppercase bg-surface-backdrop-token dark:text-primary-500 font-black text-3xl p-2 rounded m-1">
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
                Blog sponsorship is a great way to reach a highly engaged
                audience of potential customers. By sponsoring a blog post, your
                company can be featured prominently on a popular blog, with the
                opportunity to reach a large number of readers who are already
                interested in the topics your post is about.
              </p>
            </section>
          </div>
        </div>

        <SponsorshipForm />

        <div className="flex justify-center card bg-muted/50">
          <div className="flex flex-col p-8">
            <ul className="flex flex-col gap-2 text-2xl ml-4 pl-4 list-disc">
              <li data-sourcepos="3:1-4:0">
                <p data-sourcepos="3:4-3:322">
                  <strong>Increased Brand Awareness and Visibility:</strong>
                  By sponsoring blog posts on CodingCat.dev, your brand will be
                  prominently featured in front of a highly engaged audience of
                  tech enthusiasts and programmers. This exposure can
                  significantly boost brand awareness and make your company more
                  recognizable in the tech industry.
                </p>
              </li>
              <li data-sourcepos="5:1-6:0">
                <p data-sourcepos="5:4-5:278">
                  <strong>Enhanced Brand Credibility and Reputation:</strong>
                  Being associated with a reputable blog like CodingCat.dev can
                  enhance your brand&apos;s credibility and reputation. The
                  blog&apos;s audience will associate your company with
                  high-quality content and expertise, fostering trust and
                  loyalty.
                </p>
              </li>
              <li data-sourcepos="7:1-8:0">
                <p data-sourcepos="7:4-7:297">
                  <strong>Targeted Audience Reach:</strong>
                  CodingCat.dev attracts a dedicated readership of individuals
                  passionate about coding and programming. Sponsoring blog posts
                  on this platform ensures you&apos;re reaching a highly
                  targeted audience of potential customers genuinely interested
                  in your products or services.
                </p>
              </li>
              <li data-sourcepos="9:1-10:0">
                <p data-sourcepos="9:4-9:280">
                  <strong>Long-Term Impact and Brand Recall:</strong>
                  Unlike traditional advertising that fades quickly, sponsoring
                  long-term blog posts on CodingCat.dev creates a lasting
                  impression. Your brand will remain visible and associated with
                  valuable content long after the initial publication date.
                </p>
              </li>
              <li data-sourcepos="11:1-12:0">
                <p data-sourcepos="11:4-11:301">
                  <strong>Cost-Effective Marketing Strategy:</strong>
                  Compared to traditional advertising methods, blog sponsorship
                  offers a cost-effective way to reach a large audience. The
                  targeted nature of blog readership ensures your marketing
                  efforts are reaching the right people, maximizing the return
                  on your investment.
                </p>
              </li>
            </ul>
          </div>
        </div>
        <SponsorshipCards />
      </section>
    </div>
  );
}
