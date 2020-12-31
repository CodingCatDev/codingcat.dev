import Link from 'next/link';

const links = `cursor-pointer tracking-wide text-xl text-ccd-primary-900`;

export default function UserProfile() {
  return (
    <nav>
      <ul className="grid gap-4">
        <li>
          <Link href="/user/profile">
            <a className={links}>Profile</a>
          </Link>
        </li>
        <li>
          <Link href="/user/account">
            <a className={links}>Account</a>
          </Link>
        </li>
        <li>
          <Link href="/user/billing">
            <a className={links}>Billing</a>
          </Link>
        </li>
        <li>
          <Link href="/user/notifications">
            <a className={links}>Notifications</a>
          </Link>
        </li>
        <li>
          <Link href="/user/support">
            <a className={links}>Contact Support</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
