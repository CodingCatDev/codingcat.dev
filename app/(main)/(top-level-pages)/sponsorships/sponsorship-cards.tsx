import CoverImage from "@/components/cover-image";

export default function SponsorshipCards() {
  return (
    <div className="flex flex-col gap-2 md:gap-8">
      <h2>Sponsorships</h2>
      <hr />
      <section className="relative grid gap-2 md:gap-4 grid-cols-1 sm:grid-cols-3">
        <a
          className="overflow-hidden card card-hover"
          href="/sponsorships/podcast"
        >
          <header>
            <CoverImage
              image={{
                _type: "cloudinary.asset",
                public_id: "main-codingcatdev-photo/podcast-sponsorship",
              }}
            />
          </header>
          <div className="p-4 space-y-4">
            <h3 data-toc-ignore="">Podcast Sponsorship</h3>
            <article>
              <p>
                Become an exclusive sponsor for a single episode, or multiple
                podcasts. Includes both video and audio within the show.
              </p>
            </article>
          </div>
        </a>
        <a
          className="overflow-hidden card card-hover"
          href="/sponsorships/code-with-codingcatdev"
        >
          <header>
            <CoverImage
              image={{
                _type: "cloudinary.asset",
                public_id: "main-codingcatdev-photo/code-with-ccd-sponsorship",
              }}
            />
          </header>
          <div className="p-4 space-y-4">
            <h3 data-toc-ignore="">Code with CodingCat.dev Sponsorship</h3>
            <article>
              <p>
                Looking to showcase your product, live coding helps others to
                explain how they can see your product!
              </p>
            </article>
          </div>
        </a>

        <a
          className="overflow-hidden card card-hover"
          href="/sponsorships/blog"
        >
          <header>
            <CoverImage
              image={{
                _type: "cloudinary.asset",
                public_id: "main-codingcatdev-photo/blog-sponsorship",
              }}
            />
          </header>
          <div className="p-4 space-y-4">
            <h3 data-toc-ignore="">Blog Sponsorship</h3>
            <article>
              <p>
                Blog sponsorship is a great way to reach a highly engaged
                audience of potential customers.
              </p>
            </article>
          </div>
        </a>
      </section>
    </div>
  );
}
