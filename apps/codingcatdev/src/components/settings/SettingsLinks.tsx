import Link from 'next/link';

const links = `cursor-pointer tracking-wide text-xl text-ccd-primary-900`;

export default function SettingsLinks(): JSX.Element {
  return (
    <nav>
      <ul className="grid gap-4">
        <li>
          <Link href="/user/profile">
            <a className={links}>Profile</a>
          </Link>
        </li>
        <li>
          <Link href="/user/membership">
            <a className={links}>Membership</a>
          </Link>
        </li>
        <li>
          <Link href="/user/settings">
            <a className={links}>Settings</a>
          </Link>
        </li>
        {/*
        <li>
          <Link href="/user/support">
            <a className={links}>Contact Support</a>
          </Link>
        </li> */}
      </ul>
    </nav>
  );
}
