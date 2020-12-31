import ActiveLink from '@/components/ActiveLink';
import Blog from '@/components/global/icons/nav/Blog';
import Courses from '@/components/global/icons/nav/Courses';
import Community from '@/components/global/icons/nav/Community';
import Podcasts from '@/components/global/icons/nav/Podcasts';
import Tutorials from '@/components/global/icons/nav/Tutorials';

const navLinks = `grid place-items-center content-between links-secondary`;

const NavLinks = () => {
  return (
    <nav className="flex mx-auto">
      <div className="hidden md:flex md:space-x-4">
        <ActiveLink activeClassName="bg-primary-900" href="/courses">
          <a className={`${navLinks} nav-links`}>
            <Courses />
            Courses
          </a>
        </ActiveLink>
        <ActiveLink activeClassName="bg-primary-900" href="/tutorials">
          <a className={`${navLinks} nav-links`}>
            <Tutorials />
            Tutorials
          </a>
        </ActiveLink>
        <ActiveLink activeClassName="bg-primary-900" href="/podcasts">
          <a className={`${navLinks} nav-links`}>
            <Podcasts className="w-35 h-35" />
            Podcasts
          </a>
        </ActiveLink>
        <ActiveLink activeClassName="bg-primary-900" href="/blog">
          <a className={`${navLinks} nav-links`}>
            <Blog />
            Blog
          </a>
        </ActiveLink>

        <ActiveLink activeClassName="bg-primary-900" href="/community">
          <a className={`${navLinks} nav-links`}>
            <Community />
            Community
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
