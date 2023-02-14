import Link from 'next/link';
import Image from 'next/image';

import { UserInfoExtended } from '@/models/user.model';
import { StripeProduct } from '@/models/stripe.model';
import useIsMember from '@/hooks/useIsMember';
import { useAuth } from 'reactfire';
import { signOut } from '@/components/FirebaseAuth';
import MembershipCards from '@/components/user/MembershipCards';
import ProfileProFeatures from '@/components/user/ProfileProFeatures';

export default function UserMembership({
  user,
  products,
}: {
  user: UserInfoExtended;
  products: StripeProduct[];
}): JSX.Element {
  const auth = useAuth();

  const { member, team } = useIsMember(user);

  return (
    <>
      {member || team ? (
        <section>
          <div className="grid gap-3 m-2 justify-items-center place-items-center">
            <div className="text-2xl">You are already a member.</div>
            <div className="grid grid-flow-col gap-3 justify-items-center">
              {/* <Link href="/user/membership">
              <a>
                <div className=" btn-primary">See Membership</div>
              </a>
            </Link> */}
              <Link href="/courses">
                <div className="btn-secondary">Start Courses</div>
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="p-4">
            {/* Valid User */}
            {user && user.uid && (
              <div
                className={`${
                  member ? 'w-full' : 'mx-auto'
                } "w-full relative z-0 px-8 md:px-0 md:py-16"`}
              >
                <div
                  className={`${
                    member
                      ? 'rounded'
                      : 'rounded-b md:rounded-b-none md:rounded-r'
                  } flex flex-wrap bg-white max-w-lg shadow-lg overflow-hidden mx-auto`}
                >
                  {user.photoURL && (
                    <div className="w-32 h-32 m-4">
                      <Image
                        src={user.photoURL}
                        loader={() => user.photoURL || ''}
                        layout="responsive"
                        height="500"
                        width="500"
                        unoptimized={true}
                        alt={`${user.displayName} Photo`}
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex flex-wrap justify-end w-full pt-2 pr-2">
                      <button
                        type="button"
                        onClick={() => signOut(auth)}
                        className="items-center justify-center px-4 py-2 text-white rounded bg-secondary-500 hover:opacity-75"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                  {user && !member && (
                    <div className="p-8 text-xl text-primary-800">
                      <p className="p-2">
                        Welcome {user.displayName}! You are now signed in.
                      </p>
                      <p className="p-2">
                        In order to use <span className="font-black">ALL</span>{' '}
                        the{' '}
                        <span className="font-bold text-secondary-500">
                          Membership
                        </span>{' '}
                        features you must select an option for membership below.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
          <section className="grid grid-cols-1 gap-10 mb-8 text-center">
            <div className="max-w-xl mx-auto">
              <h1 className="font-sans text-4xl font-semibold lg:text-5xl ">
                Become a{' '}
                <span className="text-secondary-600 dark:text-secondary-600">
                  Purrfect Peep
                </span>{' '}
                and join CodingCat.dev
              </h1>
              <h2 className="mt-4 font-sans text-lg lg:text-lg text-basics-600">
                Get access to all of the exclusive content and up your coding
                skills.
              </h2>
            </div>
            <MembershipCards products={products} user={user} />
          </section>
          <ProfileProFeatures />
        </>
      )}
    </>
  );
}
