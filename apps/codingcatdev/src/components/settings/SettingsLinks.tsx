import Link from 'next/link';

const links = `cursor-pointer tracking-wide text-xl text-ccd-primary-900`;

export default function SettingsLinks(): JSX.Element {
  return (
    <nav>
      <ul className="grid gap-4">
        <li>
          <Link href="/user/profile" className={links}>
            Profile
          </Link>
        </li>
        <li>
          <Link href="/user/membership" className={links}>
            Membership
          </Link>
        </li>
        <li>
          <Link href="/user/settings" className={links}>
            Settings
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
