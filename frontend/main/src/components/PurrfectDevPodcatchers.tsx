import Link from 'next/link';
import Image from 'next/image';
import AJHeadphones from '@/components/global/icons/AJHeadphones';

export default function PurrfectDevPodcatchers(): JSX.Element {
  return (
    <>
      <section className="my-20 text-center">
        <div className="flex flex-col">
          <p className="mb-8 text-3xl leading-snug tracking-wide lg:text-6xl">
            Subscribe on your podcatcher of choice.
          </p>
          <div className="flex flex-wrap justify-center mb-8">
            <a
              href="https://podcasts.apple.com/us/podcast/purrfect-dev/id1491655542"
              target="_blank"
              rel="noreferrer"
              aria-label="Listen on Apple Podcasts"
            >
              <Image
                src="/static/images/podcatchers/applepodcasts-badge.svg"
                alt="Image of Apple Podcasts logo"
                loader={({ src }) => src}
                width={660}
                height={168}
              />
            </a>

            <a
              href="https://open.spotify.com/show/2kiOI0PCB2jXMU0cdqUy4z"
              target="_blank"
              rel="noreferrer"
              aria-label="Listen on Spotify"
            >
              <Image
                src="/static/images/podcatchers/spotify-badge.svg"
                alt="Image of Spotify logo"
                loader={({ src }) => src}
                width={660}
                height={168}
              />
            </a>
          </div>

          <div className="flex flex-wrap justify-center">
            <a
              href="https://www.breaker.audio/purrfect-dot-dev-1"
              target="_blank"
              rel="noreferrer"
              aria-label="Listen on Breaker"
            >
              <Image
                src="/static/images/podcatchers/breaker-badge.svg"
                alt="Image of breaker logo"
                loader={({ src }) => src}
                width={330}
                height={84}
              />
            </a>

            {/* <a
              href=""
              target="_blank"
              rel="noreferrer"
              aria-label="Listen on "
            >
              <Image
                src="/static/images/podcatchers/castbox-badge.svg"
                alt="Image of castbox logo"
                loader={({ src }) => src}
                width={330}
                height={84}
              />
            </a> */}

            <a
              href="https://podcasts.google.com/?feed=aHR0cHM6Ly9hbmNob3IuZm0vcy8xMTViMjAzYy9wb2RjYXN0L3Jzcw=="
              target="_blank"
              rel="noreferrer"
              aria-label="Listen on Google Podcasts"
            >
              <Image
                src="/static/images/podcatchers/googlepodcasts-badge.svg"
                alt="Image of Google Podcasts logo"
                loader={({ src }) => src}
                width={330}
                height={84}
              />
            </a>

            <a
              href="https://overcast.fm/itunes1491655542/purrfect-dev"
              target="_blank"
              rel="noreferrer"
              aria-label="Listen on Overcast"
            >
              <Image
                src="/static/images/podcatchers/overcast-badge.svg"
                alt="Image of Overcast logo"
                loader={({ src }) => src}
                width={330}
                height={84}
              />
            </a>

            <a
              href="https://pca.st/aysv9xg5"
              target="_blank"
              rel="noreferrer"
              aria-label="Listen on Pocket Casts"
            >
              <Image
                src="/static/images/podcatchers/pocketcasts-badge.svg"
                alt="Image of Pocket Casts logo"
                loader={({ src }) => src}
                width={330}
                height={84}
              />
            </a>

            <a
              href="https://radiopublic.com/purrfectdev-Gy40q4"
              target="_blank"
              rel="noreferrer"
              aria-label="Listen on RadioPublic"
            >
              <Image
                src="/static/images/podcatchers/radiopublic-badge.svg"
                alt="Image of Radio Public logo"
                loader={({ src }) => src}
                width={330}
                height={84}
              />
            </a>

            <a
              href="https://www.stitcher.com/s?fid=491385&refid=stpr"
              target="_blank"
              rel="noreferrer"
              aria-label="Listen on Stitcher"
            >
              <Image
                src="/static/images/podcatchers/stitcher-badge.svg"
                alt="Image of Stitcher logo"
                loader={({ src }) => src}
                width={330}
                height={84}
              />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
