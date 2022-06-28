import { Sponsor } from '@/models/sponsor.model';
import Image from 'next/image';

export default function SponsorCards({
  sponsors,
}: {
  sponsors: Sponsor[];
}): JSX.Element {
  console.log('sponsors', sponsors);
  return (
    <div className="flex">
      <div className="rounded-md bg-basics-50 dark:bg-primary-800">
        <h2 className="w-full p-2 m-0 text-2xl font-bold 2xl:p-4 rounded-t-md 2xl:shrink-0 bg-primary-900 dark:bg-primary-900 text-basics-50">
          {`Sponsors`}
        </h2>
        <div className="flex flex-wrap">
          {sponsors.map((s, i) => (
            <div className="p-2" key={i}>
              <a href={s.url} rel="noreferrer noopener" target="_blank">
                <div className="w-full rounded-lg shadow-lg bg-primary-50 dark:bg-primary-500">
                  <div className="p-2">
                    <div
                      style={{
                        overflow: 'hidden',
                        paddingTop: '56.25%',
                        position: 'relative',
                        width: '100%',
                        height: 0,
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                        {s?.coverPhoto?.public_id && (
                          <Image
                            src={s.coverPhoto.public_id}
                            alt={`Sponsorship Image for ${s.company}`}
                            layout="fill"
                          />
                        )}
                      </div>
                    </div>
                    <h2 className="flex flex-wrap content-center pl-1 text-2xl font-semibold">
                      {s.company}
                    </h2>
                    <p className="m-2 text-lg">{s.description}</p>
                  </div>
                  <div className="flex w-full mt-2 rounded-b-lg bg-primary-900">
                    <p className="px-4 py-2 text-sm text-white uppercase border-none cursor-pointer">
                      More Information -{'>'}
                    </p>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
