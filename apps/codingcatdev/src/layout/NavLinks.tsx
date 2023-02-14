import ActiveLink from '@/components/ActiveLink';
import Blog from '@/components/global/icons/nav/Blog';
import Courses from '@/components/global/icons/nav/Courses';
import Podcasts from '@/components/global/icons/nav/Podcasts';
import Tutorials from '@/components/global/icons/nav/Tutorials';
import Schedule from '@/components/global/icons/nav/Schedule';

const navLinks = `grid place-items-center links-secondary`;

const Link = ({
  href,
  name,
  component,
}: {
  href: string;
  name: string;
  component: JSX.Element;
}) => {
  return (
    <ActiveLink activeClassName="" href={`${href}`}>
      <a className={`${navLinks} nav-links`}>
        <span className="sr-only">{`${name}`}</span>
        {component}
        {`${name}`}
      </a>
    </ActiveLink>
  );
};

const NavLinks = () => {
  return (
    <nav className="flex mx-auto">
      <div className="hidden md:flex md:gap-4 md:place-items-center">
        <Link href="/courses" name="Courses" component={<Courses />} />
        <Link href="/tutorials" name="Tutorials" component={<Tutorials />} />
        <Link href="/podcasts" name="Podcasts" component={<Podcasts />} />
        <Link
          href="/schedule"
          name="Schedule"
          component={<Schedule fill="#BC2261" />}
        />
        <Link href="/blog" name="Blog" component={<Blog />} />
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
