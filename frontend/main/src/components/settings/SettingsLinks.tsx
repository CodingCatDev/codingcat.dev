import Link from 'next/link';

const links = `cursor-pointer tracking-wide text-xl text-ccd-primary-900`;

export default function UserProfile(): JSX.Element {
  return (
    <nav>
      <ul className="grid gap-4">
        <li>
          <Link href="/user/profile">
            <a className={links}>Profile</a>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
