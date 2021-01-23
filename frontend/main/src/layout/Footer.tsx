import AJAlt from '@/components/global/icons/AJAlt';
import Mail from '@/components/global/icons/socials/Mail';
import Facebook from '@/components/global/icons/socials/Facebook';
import GitHub from '@/components/global/icons/socials/GitHub';
import LinkedIn from '@/components/global/icons/socials/LinkedIn';
import Medium from '@/components/global/icons/socials/Medium';
import Twitter from '@/components/global/icons/socials/Twitter';
import YouTube from '@/components/global/icons/socials/YouTube';
import { Site } from '@/models/site.model';

const socialLinks = ``;

export default function Footer({ site }: { site: Site | null }): JSX.Element {
  return (
    <>
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
      <footer className="grid grid-cols-1 gap-10 px-4 pt-20 pb-4 bg-purple-900 justify-items-start lg:grid-cols-2 lg:px-10 2xl:grid-cols-3 2xl:items-start 2xl:gap-4 text-basics-50 dark:text-basics-50">
        {/* LOGO & COPYRIGHT */}
        <section className="grid grid-cols-1 place-items-center">
          <div className="flex">
            <AJAlt className="-mt-6 w-36 h-36" />
            <section className="grid">
              <div className="grid ">
                <h4 className="text-2xl leading-tight sm:text-4xl">
                  CodingCat.Dev
                </h4>
                <p className="text-xl font-bold">Purrfect Web Tutorials</p>
                <p className="mt-4 text-xs font-light leading-5">
                  Copyright &#169; {new Date().getFullYear()} AJONP LLC.
                  <br />
                  All Rights Reserved
                </p>
              </div>
            </section>
          </div>
          {/* SOCIALS */}
          <section className="flex items-end justify-around w-full mt-4 lg:justify-between">
            <a href="" className={`${socialLinks} social-links`}>
              <Mail fill="#BC2261" />
            </a>
            <a href="" className={`${socialLinks} social-links`}>
              <Facebook fill="#BC2261" />
            </a>
            <a href="" className={`${socialLinks} social-links`}>
              <GitHub fill="#BC2261" />
            </a>
            <a href="" className={`${socialLinks} social-links`}>
              <LinkedIn fill="#BC2261" />
            </a>
            <a href="" className={`${socialLinks} social-links`}>
              <Medium fill="#BC2261" />
            </a>
            <a href="" className={`${socialLinks} social-links`}>
              <Twitter fill="#BC2261" />
            </a>
            <a href="" className={`${socialLinks} social-links`}>
              <YouTube fill="#BC2261" />
            </a>
          </section>
        </section>
        {/* HELPFUL LINKS */}
        <section className="grid grid-cols-1 gap-4 lg:justify-self-end 2xl:justify-self-center">
          <h4 className="underline whitespace-nowrap">Helpful Links</h4>
          <div className="grid w-64 grid-cols-2 gap-4">
            {site?.pageLinks?.map((pageLinks) => (
              <a
                href={pageLinks.slug}
                className="links-secondary"
                key={pageLinks.slug}
              >
                {pageLinks.title}
              </a>
            ))}
          </div>
        </section>
        {/* NEWSLETTER */}
        <section className="grid grid-cols-1 gap-4 lg:col-start-1 lg:col-end-3 lg:justify-self-center 2xl:justify-self-end 2xl:col-start-3 2xl:col-end-4">
          <h4 className="underline">Newsletter</h4>
          <p>Subscribe for all the latest updates.</p>
          <form className="grid">
            <label htmlFor="subEmail">Email</label>
            <div className="flex items-stretch">
              <input
                id="subEmail"
                type="email"
                placeholder="alex@codingcat.dev"
              />

              <button className="ml-4 btn-secondary">Subscribe</button>
            </div>
          </form>

          <p className="w-full text-right">
            Site designed by{' '}
            <a
              href="https://brittneypostma.com"
              target="_blank"
              rel="noopener noreferrer"
              className="links-secondary"
            >
              Brittney Postma
            </a>
            .
          </p>
        </section>
      </footer>
      <style jsx>{`
        .social-links:hover {
          filter: brightness(1.2);
        }
      `}</style>
    </>
  );
}
