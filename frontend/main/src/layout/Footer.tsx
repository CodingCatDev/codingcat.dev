import AJAlt from '@/components/global/icons/AJAlt';
import Mail from '@/components/global/icons/socials/Mail';
import Facebook from '@/components/global/icons/socials/Facebook';
import GitHub from '@/components/global/icons/socials/GitHub';
import LinkedIn from '@/components/global/icons/socials/LinkedIn';
import Medium from '@/components/global/icons/socials/Medium';
import Twitter from '@/components/global/icons/socials/Twitter';
import YouTube from '@/components/global/icons/socials/YouTube';
import { Site, SocialLink, SocialType } from '@/models/site.model';
import Link from 'next/link';
import Discord from '@/components/global/icons/socials/Discord';
import Twitch from '@/components/global/icons/socials/Twitch';

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
      case SocialType.discord:
        return <Discord fill="#BC2261" />;
      case SocialType.twitch:
        return <Twitch fill="#BC2261" stroke="black" strokeWidth="60" />;
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
      <footer className="px-4 pt-20 pb-4 bg-purple-900 lg:grid-cols-2 lg:px-10 text-basics-50">
        <div className="grid items-start justify-center gap-10 xl:justify-around grid-cols-auto">
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
                  <span className="sr-only">{sl.type}</span>
                  {socialLinkPicker(sl)}
                </a>
              ))}
            </section>
          </section>
          {/* HELPFUL LINKS */}
          <section className="grid grid-cols-1 lg:justify-self-end 2xl:justify-self-center">
            <h4 className="underline whitespace-nowrap">Helpful Links</h4>
            <div className="grid grid-cols-1 gap-2 mt-4">
              {site?.pageLinks?.map((pageLink, i) => (
                <div key={`helpful-link-${i}`}>
                  {pageLink.slug.includes('://') ||
                  pageLink.slug.includes('mailto') ? (
                    <div className="flex items-center gap-2">
                      <a
                        href={pageLink.slug}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="links-secondary"
                      >
                        {pageLink.title}
                      </a>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  ) : (
                    <Link href={pageLink.slug}>
                      <a href={pageLink.slug} className="links-secondary">
                        {pageLink.title}
                      </a>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
          {/* NEWSLETTER */}
          <section className="grid grid-cols-1 gap-2 lg:col-start-1 lg:col-end-3 lg:justify-self-center 2xl:justify-self-end 2xl:col-start-3 2xl:col-end-4">
            <h4 className="underline">Newsletter</h4>

            <div id="revue-embed">
              <form
                className="grid grid-cols-1"
                action="http://codingtreats.com/add_subscriber"
                method="post"
                id="revue-form"
                name="revue-form"
                target="_blank"
              >
                <div className="flex flex-wrap gap-4 revue-form-group lg:flex-nowrap">
                  <div className="flex flex-col">
                    <label htmlFor="member_email">Email address</label>
                    <div className="flex gap-2">
                      <input
                        className="revue-form-field"
                        placeholder="Your email address..."
                        type="email"
                        name="member[email]"
                        id="member_email"
                      />
                      <input
                        className="btn-secondary justify-self-end"
                        type="submit"
                        value="Subscribe"
                        name="member[subscribe]"
                        id="member_submit"
                      />
                    </div>
                  </div>
                </div>
                <div className="max-w-xs mt-2 revue-form-footer">
                  By subscribing, you agree with Revue’s{' '}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.getrevue.co/terms"
                  >
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a
                    target="_blank"
                    rel="noreferrer"
                    href="https://www.getrevue.co/privacy"
                  >
                    Privacy Policy
                  </a>
                  .
                </div>
              </form>
            </div>
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
