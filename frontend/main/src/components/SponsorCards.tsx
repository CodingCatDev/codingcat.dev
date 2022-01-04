import { Sponsor } from '@/models/sponsor.model';
import Image from 'next/image';

export default function RecentPostsList({
  sponsors,
}: {
  sponsors: Sponsor[];
}): JSX.Element {
  return (
    <>
      {sponsors.map((s, i) => (
        <div className="p-2" key={i}>
          <div className="max-w-md rounded-lg shadow-lg bg-primary-50 dark:bg-primary-500">
            <div className="px-2">
              <div>
                <div className="flex flex-wrap content-center pt-2">
                  <Image
                    className="object-cover w-20 h-20 border-2 rounded-full border-primary-500"
                    src="https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=334&q=80"
                    alt="Sponsorship Image"
                  />
                  <h2 className="flex flex-wrap content-center pl-1 text-2xl font-semibold">
                    Sponsor 1
                  </h2>
                </div>
                <p className="m-2 text-lg">
                  This is a nice a nice section about your sponsorship. It can
                  have details about your company and what special things our
                  guests should know about.
                </p>
              </div>
            </div>
            <div className="flex w-full mt-2 rounded-b-lg bg-primary-900">
              <a className="p-2 text-sm text-white uppercase border-none cursor-pointer">
                More Information -{'>'}
              </a>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
