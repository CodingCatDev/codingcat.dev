import AJAlt from '@/components/global/icons/AJAlt';
import Mail from '@/components/global/icons/socials/Mail';
import Facebook from '@/components/global/icons/socials/Facebook';
import GitHub from '@/components/global/icons/socials/GitHub';
import LinkedIn from '@/components/global/icons/socials/LinkedIn';
import Medium from '@/components/global/icons/socials/Medium';
import Twitter from '@/components/global/icons/socials/Twitter';
import YouTube from '@/components/global/icons/socials/YouTube';

const socialLinks = ``;

export const Footer = () => {
  return (
    <>
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        height="100"
        width="100%"
        viewBox="0 0 90 20"
        preserveAspectRatio="none"
      >
        <path
          d="M0 5 H5 C25 5 25 20 45 20 S65 5 85 5 H90 V-5 H0z"
          fill="#EFE4F4"
          stroke="transparent"
        />
      </svg>
      <footer className="grid items-end justify-around gap-10 pt-16 pb-8 xl:flex xl:gap-4 text-ccd-basics-050 bg-ccd-purples-900">
        {/* LOGO & COPYRIGHT */}
        <section className="grid">
          <div className="flex">
            <AJAlt className="w-24 h-24" />
            <section className="grid">
              <div className="grid ">
                <h4 className="mt-6 leading-tight">CodingCat.Dev</h4>
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
          <section className="flex items-end justify-between w-full mt-4">
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
        <section className="grid gap-4">
          <h4 className="underline">Helpful Links</h4>
          <a href="" className="links-secondary">
            FTC Disclosure
          </a>
          <a href="" className="links-secondary">
            Privacy Policy
          </a>
          <a href="" className="links-secondary">
            Terms of Service
          </a>
          <a href="" className="links-secondary">
            Sitemap
          </a>
        </section>
        {/* NEWSLETTER */}
        <section className="grid gap-4">
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
              className="font-bold rounded-md text-ccd-basics-050 hover:underline hover:text-ccd-basics-050"
            >
              Brittney Postma
            </a>
            .
          </p>
        </section>
        <style jsx>{`
          .social-links:hover {
            filter: brightness(1.2);
          }
        `}</style>
      </footer>
    </>
  );
};
