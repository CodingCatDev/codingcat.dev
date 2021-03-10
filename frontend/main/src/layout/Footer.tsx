import Link from 'next/link';
import AJAlt from '@/components/global/icons/AJAlt';
import Mail from '@/components/global/icons/socials/Mail';
import Facebook from '@/components/global/icons/socials/Facebook';
import GitHub from '@/components/global/icons/socials/GitHub';
import LinkedIn from '@/components/global/icons/socials/LinkedIn';
import Medium from '@/components/global/icons/socials/Medium';
import Twitter from '@/components/global/icons/socials/Twitter';
import YouTube from '@/components/global/icons/socials/YouTube';
import { Site, SocialLink, SocialType } from '@/models/site.model';

const socialLinks = ``;

export default function Footer({
  site,
  hideWave,
}: {
  site: Site | null;
  hideWave?: boolean;
}): JSX.Element {
  function socialLinkPicker(sl: SocialLink) {
    switch (sl.type) {
      case SocialType.facebook:
        return <Facebook fill="#BC2261" />;
      case SocialType.github:
        return <GitHub fill="#BC2261" />;
      case SocialType.linkedin:
        return <LinkedIn fill="#BC2261" />;
      case SocialType.mail:
        return <Mail fill="#BC2261" />;
      case SocialType.medium:
        return <Medium fill="#BC2261" />;
      case SocialType.twitter:
        return <Twitter fill="#BC2261" />;
      case SocialType.youtube:
        return <YouTube fill="#BC2261" />;
    }
  }
  return (
    <>
      {!hideWave && (
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          height="100"
          width="100%"
          viewBox="0 0 90 20"
          preserveAspectRatio="none"
          className="fill-current text-primary-50 dark:text-basics-700"
        >
          <path
            d="M0 5 H5 C25 5 25 20 45 20 S65 5 85 5 H90 V-5 H0z"
            stroke="transparent"
          />
        </svg>
      )}
      <footer className="px-4 pt-20 pb-4 bg-purple-900 lg:grid-cols-2 lg:px-10 text-basics-50 dark:text-basics-50">
        <div className="grid items-start gap-10 grid-cols-auto">
          {/* LOGO & COPYRIGHT */}
          <section className="grid grid-cols-1 justify-items-start">
            <div className="flex">
              <AJAlt className="-mt-6 w-36 h-36" />
              <section className="grid">
                <div className="grid ">
                  <h4 className="text-2xl leading-tight sm:text-4xl">
                    CodingCat.Dev
                  </h4>
                  <p className="text-xl font-bold">Purrfect Web Tutorials</p>
                  <p className="w-full mt-4 text-sm font-light leading-5">
                    Site designed by{' '}
                    <a
                      href="https://brittneypostma.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="links-secondary"
                    >
                      Brittney Postma
                    </a>
                  </p>
                  <p className="w-full text-sm font-light leading-5">
                    and developed by{' '}
                    <a
                      href="https://alexpatterson.dev/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="links-secondary"
                    >
                      Alex Patterson
                    </a>
                    .
                  </p>
                </div>
              </section>
            </div>
            {/* SOCIALS */}
            <section className="flex flex-wrap items-end justify-center gap-8 mt-4">
              {site?.socialLinks?.map((sl, i) => (
                <a
                  key={i}
                  href={sl.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={`social-links`}
                >
                  {socialLinkPicker(sl)}
                </a>
              ))}
            </section>
          </section>
          {/* HELPFUL LINKS */}
          <section className="grid grid-cols-1 gap-4 lg:justify-self-end 2xl:justify-self-center">
            <h4 className="underline whitespace-nowrap">Helpful Links</h4>
            <div className="grid w-64 grid-cols-2 gap-4">
              {site?.pageLinks?.map((pageLink) =>
                pageLink.title === 'Contact Us' ? (
                  <a
                    className="links-secondary"
                    href="mailto:support@codingcat.dev"
                  >
                    {pageLink.title}
                  </a>
                ) : (
                  <Link href={pageLink.slug} key={pageLink.slug}>
                    <a className="links-secondary">{pageLink.title}</a>
                  </Link>
                )
              )}
            </div>
          </section>
          {/* NEWSLETTER */}
          <section className="grid grid-cols-1 gap-4 lg:col-start-1 lg:col-end-3 lg:justify-self-center 2xl:justify-self-end 2xl:col-start-3 2xl:col-end-4">
            <h4 className="underline">Newsletter</h4>
            <p>Subscribe for all the latest updates.</p>
            <form className="grid grid-cols-1 gap-4">
              <label htmlFor="subEmail">Email</label>
              <div className="flex flex-wrap gap-4 lg:flex-nowrap">
                <input
                  id="subEmail"
                  type="email"
                  placeholder="alex@codingcat.dev"
                />

                <button className="btn-secondary">Subscribe</button>
              </div>
            </form>
          </section>
        </div>
        <p className="mt-10 text-sm font-light leading-5 text-center">
          Copyright &#169; {new Date().getFullYear()} AJONP LLC.
          <br />
          All Rights Reserved
        </p>
      </footer>
      <style jsx>{`
        .social-links:hover {
          filter: brightness(1.2);
        }
      `}</style>
    </>
  );
}
