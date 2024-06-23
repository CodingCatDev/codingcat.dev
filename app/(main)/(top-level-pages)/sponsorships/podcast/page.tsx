import type { Metadata, ResolvingMetadata } from "next";
import { type PortableTextBlock } from "next-sanity";
import { notFound } from "next/navigation";

import PortableText from "@/components/portable-text";

import type { PageQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import { BreadcrumbLinks } from "@/components/breadrumb-links";
import CoverImage from "@/components/cover-image";
import AJHeadphones from "@/components/icons/aj-headphones";
import Podcatchers from "./podcatchers";
import SponsorshipCards from "../sponsorship-cards";
import SponsorshipForm from "../sponsorship-form";

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
      slug: "podcast",
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

export default async function SponsorshipsPodcastPage() {
  const [page] = await Promise.all([
    sanityFetch<PageQueryResult>({
      query: pageQuery,
      params: {
        slug: "podcast",
      },
    }),
  ]);

  if (!page?._id) {
    return notFound();
  }

  const Arrow = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path
        xmlns="http://www.w3.org/2000/svg"
        d="M17.92 11.62a1 1 0 0 0-.21-.33l-5-5a1 1 0 0 0-1.42 1.42l3.3 3.29H7a1 1 0 0 0 0 2h7.59l-3.3 3.29a1 1 0 0 0 0 1.42 1 1 0 0 0 1.42 0l5-5a1 1 0 0 0 .21-.33 1 1 0 0 0 0-.76z"
      />
    </svg>
  );

  return (
    <div className="container px-5 mx-auto">
      <BreadcrumbLinks
        links={[
          { title: "Sponsorships", href: "/sponsorships" },
          { title: page.title },
        ]}
      />
      <div className="w-full flex flex-col gap-4 md:gap-8 my-8 md:my-12">
        <section className="mx-auto prose-violet lg:prose-xl dark:prose-invert">
          <section className="grid grid-cols-1 gap-2 mx-2 md:mx-8 md:gap-8">
            <div className="flex flex-col items-center sm:hidden">
              <AJHeadphones cls="w-48 h-48" />
            </div>
            <div className="flex justify-center m-4">
              <h1 className="flex flex-col gap-2">
                <span className="text-xl md:text-4xl">Sponsorship for</span>
                <span className="md:text-6xl font-extrabold">
                  CodingCat.dev Podcast
                </span>
                <span className="text-xl md:text-2xl">
                  a CodingCat.dev Production
                </span>
              </h1>
              <div className="flex-col items-center hidden sm:flex">
                <AJHeadphones cls="w-48 h-48" />
              </div>
            </div>
            <div className="flex justify-center p-2 sm:p-4 bg-muted/50">
              <div className="flex flex-col p-8">
                <section className="my-8 flex flex-col gap-1 md:gap-4">
                  <p className="">
                    On CodingCat.dev your advertisement is
                    <span className="uppercase font-black text-3xl p-2 rounded m-1 text-primary">
                      permanent
                    </span>
                    !
                  </p>
                  <p>
                    You read that right, it is not just while you are sponsoring
                    and it doesn&apos;t change by the flavor of the week like
                    Carbon or Google Ads.
                  </p>

                  <p>
                    Podcast sponsorship is a great way to reach a highly engaged
                    audience of potential customers. By sponsoring a podcast,
                    your company can be featured prominently in the pre-roll and
                    mid-roll of a channel with{" "}
                    <span className="uppercase font-black text-2xl text-primary">
                      over 16K subscribers
                    </span>
                    , with the opportunity to reach a large number of viewers
                    who are already interested in the topics your video is
                    about.
                  </p>
                </section>
              </div>
            </div>

            <SponsorshipForm />

            <div className="flex justify-center p-2 sm:p-4 bg-muted/50">
              <div className="flex flex-col max-w-xl gap-4 p-8 font-extrabold">
                <p className="text-4xl">
                  Are you interested in reaching other web designers and
                  developers?
                </p>
                <p className="text-6xl text-primary">
                  We&lsquo;d love to help!
                </p>
                <p className="text-2xl">
                  CodingCat.dev Podcast is a weekly podcast that focuses on
                  developer&lsquo;s backgrounds, tools and tips.
                </p>
                <p className="text-2xl">
                  We aim to keep listeners up to date on the latest technology
                  and best practices, along with guiding developers on their
                  journey and helping them use tools in their everyday workflow.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center p-2 sm:p-4 bg-muted/50">
              <div className="flex justify-center w-full gap-4 p-8 font-extrabold">
                <p className="text-4xl">
                  <span className="text-4xl sm:text-8xl text-primary">
                    {" "}
                    Why{" "}
                  </span>
                  <span className="font-bold">do we make the podcast?</span>
                </p>
              </div>
              <div className="flex flex-wrap justify-center sm:flex-nowrap">
                <div className="flex flex-col gap-4 p-8 font-extrabold">
                  <p className="text-2xl">
                    <a href="/author/alex-patterson" target="_blank">
                      Alex
                    </a>{" "}
                    created CodingCat.dev so that everyone has access to a great
                    learning platform and a safe learning community. He has a
                    primary background in web development and architecture.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center p-2 sm:p-4 bg-muted/50">
              <div className="flex justify-center w-full gap-4 p-8 font-extrabold">
                <p className="text-4xl">
                  <span className="text-4xl sm:text-8xl text-primary">
                    {" "}
                    Where{" "}
                  </span>
                  <span className="font-bold">
                    do we distribute the podcast?
                  </span>
                </p>
              </div>
              <div className="flex flex-col w-full max-w-xl gap-4 p-8 font-extrabold">
                <p className="text-2xl">
                  Our podcast is very visual and interactive, so we first
                  livestream to{" "}
                  <a
                    href="https://twitch.tv/codingcatdev"
                    rel="noreferrer"
                    target="_blank"
                    className="text-primary"
                  >
                    Twitch
                  </a>{" "}
                  then the episodes receive a number for release and are
                  released to all the below syndication platforms.
                </p>
                <Podcatchers />
              </div>
            </div>
            <div className="flex flex-col justify-center gap-8 p-2 sm:p-4 bg-muted/50">
              <p className="flex justify-center w-full text-6xl font-bold text-primary">
                Audience Breakdown
              </p>
              <div className="flex flex-col w-full gap-8 text-2xl">
                <div className="flex flex-col items-center gap-4">
                  <div className="text-4xl font-bold text-primary">
                    Age Range
                  </div>
                  <div className="font-bold text-4xl sm:text-8xl text-primary">
                    25-34
                  </div>
                  <div className="font-bold">
                    Most listeners fall within this range.
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="text-4xl font-bold text-primary">Spotify</div>
                  <div className="w-full max-w-xl">
                    <CoverImage
                      image={{
                        _type: "cloudinary.asset",
                        public_id: "main-codingcatdev-photo/spotify-analytics",
                        context: {
                          _type: "cloudinary.assetContext",
                          custom: {
                            _type: "cloudinary.assetContextCustom",
                            alt: "Spotify Analytics",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="text-4xl font-bold text-primary">YouTube</div>
                  <div className="w-full max-w-xl">
                    <CoverImage
                      image={{
                        _type: "cloudinary.asset",
                        public_id: "main-codingcatdev-photo/youtube-analytics",
                        context: {
                          _type: "cloudinary.assetContext",
                          custom: {
                            _type: "cloudinary.assetContextCustom",
                            alt: "YouTube Analytics",
                          },
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center p-2 sm:p-4 bg-muted/50">
              <p className="flex justify-center w-full text-4xl font-bold md:text-6xl">
                Sponsoring is Purrfect for:
              </p>
              <div className="flex flex-col max-w-xl gap-4 p-2 font-extrabold md:p-8">
                <div className="grid grid-cols-[3rem_1fr] items-center text-2xl">
                  <div className="w-12">
                    <Arrow />
                  </div>
                  <div>
                    Web design and development tools, software and services
                  </div>
                  <div className="w-12">
                    <Arrow />
                  </div>
                  <div>Teams looking to hire</div>
                  <div className="w-12">
                    <Arrow />
                  </div>
                  <div>Technical training material and courses</div>
                  <div className="w-12">
                    <Arrow />
                  </div>
                  <div>Technical software</div>
                  <div className="w-12">
                    <Arrow />
                  </div>
                  <div>Hardware products</div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center p-2 sm:p-4 bg-muted/50">
              <p className="flex justify-start w-full text-4xl font-bold md:text-6xl text-primary">
                Audience Interests:
              </p>
              <div className="flex flex-wrap md:flex-nowrap">
                <div className="flex flex-col max-w-xl gap-4 p-2 font-extrabold md:p-8">
                  <p className="flex justify-start w-full text-3xl font-bold md:text-4xl">
                    Hard Skills
                  </p>
                  <div className="grid grid-cols-[3rem_1fr] gap-2 items-center text-2xl">
                    <div className="w-12">
                      <Arrow />
                    </div>
                    <div>
                      JavaScript frameworks (e.g. React, Angular, Vue, and
                      Svelte)
                    </div>
                    <div className="w-12">
                      <Arrow />
                    </div>
                    <div>CSS and CSS libraries like TailwindCSS</div>
                    <div className="w-12">
                      <Arrow />
                    </div>
                    <div>Backend Frameworks (e.g. NodeJs, Rust)</div>
                    <div className="w-12">
                      <Arrow />
                    </div>
                    <div>Cloud Solutions (e.g. AWS, GCP, Azure)</div>
                    <div className="w-12">
                      <Arrow />
                    </div>
                    <div>
                      Lifestyle Products (e.g. keyboards, VSCode themes)
                    </div>
                  </div>
                </div>
                <div className="flex flex-col max-w-xl gap-4 p-2 font-extrabold md:p-8">
                  <p className="flex justify-start w-full text-3xl font-bold md:text-4xl">
                    Soft Skills
                  </p>
                  <div className="grid grid-cols-[3rem_1fr] gap-2 items-center text-2xl">
                    <div className="w-12">
                      <Arrow />
                    </div>
                    <div>How to get a job in tech</div>
                    <div className="w-12">
                      <Arrow />
                    </div>
                    <div>How to run a freelance business</div>
                    <div className="w-12">
                      <Arrow />
                    </div>
                    <div>How to start a podcast</div>
                    <div className="w-12">
                      <Arrow />
                    </div>
                    <div>How to change careers</div>
                    <div className="w-12">
                      <Arrow />
                    </div>
                    <div>Mental health and awareness</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-start gap-4 md:gap-8 md:px-24 p-2 sm:p-4 bg-muted/50">
              <div className="flex flex-col justify-start w-full gap-4 font-extrabold">
                <p className="text-4xl">
                  <span className="text-4xl sm:text-8xl text-primary">
                    {" "}
                    Pricing{" "}
                  </span>
                </p>
              </div>
              <div className="grid grid-cols-[1fr] gap-2 text-xl md:text-2xl p-2 md:p-8">
                <div>
                  <span className="text-2xl font-bold md:text-4xl text-primary">
                    Single Show
                  </span>
                  - $300 USD
                </div>
                <div>
                  <span className="text-2xl font-bold md:text-4xl text-primary">
                    3+ Shows
                  </span>
                  - $250 USD
                </div>
                <div>
                  <span className="text-2xl font-bold md:text-4xl text-primary">
                    10+ Shows
                  </span>
                  - $200 USD
                </div>
                <p className="text-sm">
                  * per show pricing, contact us to arrange for annual terms.
                </p>
              </div>
              <p className="text-md md:text-2xl">
                We have found that we get the best results for our advertisers
                when they sponsor at least three shows, Alex and Brittney are
                able to test out the product, and your marketing team approves
                both pre-roll and mid-roll videos.
              </p>
            </div>
            <div className="flex flex-col gap-4 py-2 md:py-8 md:flex-row md:px-8 p-2 sm:p-4 bg-muted/50">
              <div className="flex flex-col w-full gap-4">
                <p className="w-full text-4xl font-bold">
                  As part of the sponsorship package, you&lsquo;ll receive:
                </p>
                <div className="flex gap-2 py-8 text-2xl items-center">
                  <span className="text-6xl font-bold text-primary">1</span>
                  <p className="text-3xl text-primary">
                    A sponsorship section within the episode show notes, on our
                    website.
                  </p>
                </div>
                <p className="text-2xl">
                  These notes will be listed on CodingCat.dev Podcast
                  permanently and within the user&lsquo;s podcatcher of choice
                  (Apple, Spotify...). This is a great opportunity to include
                  unique targeted links and promo codes!
                </p>
              </div>
              <div className="w-full">
                <CoverImage
                  className="w-full h-auto"
                  image={{
                    _type: "cloudinary.asset",
                    public_id:
                      "main-codingcatdev-photo/Screen_Shot_2022-08-02_at_12.55.38_PM",
                    context: {
                      _type: "cloudinary.assetContext",
                      custom: {
                        _type: "cloudinary.assetContextCustom",
                        alt: "CodingCat.dev Podcast Sponsorship Image show logo.",
                      },
                    },
                  }}
                  // classes="object-cover w-full bg-cover rounded bg-black/50"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 py-2 md:py-8 md:flex-row md:px-8 p-2 sm:p-4 bg-muted/50">
              <div className="flex flex-col w-full gap-4">
                <div className="flex gap-2 py-8 text-2xl items-center">
                  <span className="text-6xl font-bold text-primary">2</span>
                  <p className="text-3xl text-primary">
                    A call-out in the pre-roll of the show.
                  </p>
                </div>
                <p className="text-2xl">
                  The call-out will include the name of the company and slogan.
                  Because we are a video podcast, there will also be an
                  opportunity for your own branding to be included in the video.
                  We highly suggest your marketing team creates the video with a
                  voice-over from Brittney and Alex.
                </p>
              </div>
              <div className="flex flex-col w-full gap-4">
                <div className="flex gap-2 py-8 text-2xl items-center">
                  <span className="text-6xl font-bold text-primary">3</span>
                  <p className="text-3xl text-primary">
                    A 60-90 second sponsor spot mid-roll during the show.
                  </p>
                </div>
                <p className="text-2xl">
                  We can provide a standard ad read provided by your marketing
                  department. We have found that because we are a video podcast,
                  this is a good time to showcase your product. We can also
                  provide a personal experience aad that allows Alex and
                  Brittney to demonstrate their own experience with your
                  product.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-4 py-2 md:py-8 md:flex-row md:px-8 p-2 sm:p-4 bg-muted/50">
              <div className="flex flex-col w-full gap-4">
                <div className="flex gap-2 py-8 text-2xl items-center">
                  <span className="text-6xl font-bold text-primary">4</span>
                  <p className="text-3xl text-primary">
                    An evergreen listing on the CodingCat.dev Podcast sponsors
                    page.
                  </p>
                </div>
                <p className="text-2xl">
                  This is a useful resource for listeners wanting to quickly
                  reference a sponsor&lsquo;s offering, but are unable to recall
                  which episode, coupon code, or link was used during the ad
                  read.
                </p>
              </div>
              <div className="flex flex-col w-full gap-4">
                <div className="flex gap-2 py-8 text-2xl items-center">
                  <span className="text-6xl font-bold text-primary">5</span>
                  <p className="text-3xl text-primary">
                    Access to a password protected dashboard.
                  </p>
                </div>
                <p className="text-2xl">
                  This will include easy access to all documents, including
                  invoices and contracts.
                </p>
              </div>
            </div>

            <SponsorshipForm />
            <SponsorshipCards />
          </section>
        </section>
        <article>
          {page.content?.length && (
            <PortableText
              className="prose-violet lg:prose-xl dark:prose-invert"
              value={page.content as PortableTextBlock[]}
            />
          )}
        </article>
      </div>
    </div>
  );
}
