import ActiveLink from '@/components/ActiveLink';
import Blog from '@/components/global/icons/nav/Blog';
import Courses from '@/components/global/icons/nav/Courses';
import Podcasts from '@/components/global/icons/nav/Podcasts';
import Tutorials from '@/components/global/icons/nav/Tutorials';
import Schedule from '@/components/global/icons/nav/Schedule';

const navLinks = `grid place-items-center links-secondary`;

const NavLinks = () => {
  return (
    <nav className="flex mx-auto">
      <div className="hidden md:flex md:gap-4 md:place-items-center">
        <ActiveLink activeClassName="" href="/courses">
          <a className={`${navLinks} nav-links`}>
            <Courses />
            Courses
          </a>
        </ActiveLink>
        <ActiveLink activeClassName="" href="/tutorials">
          <a className={`${navLinks} nav-links`}>
            <Tutorials />
            Tutorials
          </a>
        </ActiveLink>
        <ActiveLink activeClassName="" href="/podcasts">
          <a className={`${navLinks} nav-links`}>
            <Podcasts />
            Podcasts
          </a>
        </ActiveLink>
        <ActiveLink activeClassName="" href="/schedule">
          <a className={`${navLinks} nav-links`}>
            <Schedule fill="#BC2261" />
            Schedule
          </a>
        </ActiveLink>
        <ActiveLink activeClassName="" href="/blog">
          <a className={`${navLinks} nav-links`}>
            <Blog />
            Blog
          </a>
        </ActiveLink>
      </div>
      <style jsx>{`
        .nav-links:hover {
          filter: brightness(1.5);
        }
      `}</style>
    </nav>
  );
};

export default NavLinks;
