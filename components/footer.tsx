import {
  FaGithub,
  FaLinkedin,
  FaSquareXTwitter,
  FaYoutube,
} from "react-icons/fa6";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import NavLink from "@/components/nav-link";

export default async function Footer() {
  return (
    <footer className="flex flex-col gap-6 lg:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t justify-center">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          &copy; {new Date().getFullYear()} CodingCat.dev. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <NavLink
            href="/ftc-disclosure"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            FTC Disclosure
          </NavLink>
          <NavLink
            href="/terms-of-use"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Terms of Use
          </NavLink>
          <NavLink
            href="/privacy-policy"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Privacy Policy
          </NavLink>
          <NavLink
            href="/sponsors"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Sponsors
          </NavLink>
          <NavLink
            href="/sponsorships"
            className="text-xs hover:underline underline-offset-4"
            prefetch={false}
          >
            Sponsorships
          </NavLink>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <NavLink
          href="https://twitter.com/codingcatdev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          prefetch={false}
        >
          <FaSquareXTwitter />
          <span className="sr-only">Twitter</span>
        </NavLink>
        <NavLink
          href="https://github.com/codingcatdev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          prefetch={false}
        >
          <FaGithub />
          <span className="sr-only">GitHub</span>
        </NavLink>
        <NavLink
          href="https://linkedin.com/company/codingcatdev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          prefetch={false}
        >
          <FaLinkedin />
          <span className="sr-only">NavLinkedIn</span>
        </NavLink>
        <NavLink
          href="https://youtube.com/codingcatdev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          prefetch={false}
        >
          <FaYoutube />
          <span className="sr-only">YouTube</span>
        </NavLink>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-[300px]">
          <form
            className="flex space-x-2"
            action="https://buttondown.email/api/emails/embed-subscribe/codingcatdev"
            method="post"
            target="popupwindow"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              className="max-w-lg flex-1"
            />
            <input type="hidden" value="1" name="embed" />

            <Button type="submit">Subscribe</Button>
          </form>
        </div>
      </div>
    </footer>
  );
}
