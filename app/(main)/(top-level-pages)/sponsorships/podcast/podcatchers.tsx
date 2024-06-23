import CoverImage from "@/components/cover-image";

export default function Podcatchers() {
  return (
    <section className="my-20 text-center">
      <div className="flex flex-col">
        <div className="grid grid-flow-col gap-4">
          <a
            href="https://podcasts.apple.com/us/podcast/purrfect-dev/id1491655542"
            target="_blank"
            rel="noreferrer"
            aria-label="Listen on Apple Podcasts"
          >
            <CoverImage
              className="w-full h-auto"
              quality={100}
              image={{
                _type: "cloudinary.asset",
                public_id:
                  "main-codingcatdev-photo/podcatchers/applepodcasts-badge",
                context: {
                  _type: "cloudinary.assetContext",
                  custom: {
                    _type: "cloudinary.assetContextCustom",
                    alt: "Image of Apple Podcasts logo",
                  },
                },
              }}
            />
          </a>

          <a
            href="https://open.spotify.com/show/2kiOI0PCB2jXMU0cdqUy4z"
            target="_blank"
            rel="noreferrer"
            aria-label="Listen on Spotify"
          >
            <CoverImage
              className="w-full h-auto"
              quality={100}
              image={{
                _type: "cloudinary.asset",
                public_id: "main-codingcatdev-photo/podcatchers/spotify-badge",
                context: {
                  _type: "cloudinary.assetContext",
                  custom: {
                    _type: "cloudinary.assetContextCustom",
                    alt: "Image of Spotify logo",
                  },
                },
              }}
            />
          </a>
        </div>

        <div className="grid grid-flow-col gap-4">
          <a
            href="https://www.breaker.audio/purrfect-dot-dev-1"
            target="_blank"
            rel="noreferrer"
            aria-label="Listen on Breaker"
          >
            <CoverImage
              className="w-full h-auto"
              quality={100}
              image={{
                _type: "cloudinary.asset",
                public_id: "main-codingcatdev-photo/podcatchers/breaker-badge",
                context: {
                  _type: "cloudinary.assetContext",
                  custom: {
                    _type: "cloudinary.assetContextCustom",
                    alt: "Image of breaker logo",
                  },
                },
              }}
            />
          </a>

          <a
            href="https://overcast.fm/itunes1491655542/purrfect-dev"
            target="_blank"
            rel="noreferrer"
            aria-label="Listen on Overcast"
          >
            <CoverImage
              className="w-full h-auto"
              quality={100}
              image={{
                _type: "cloudinary.asset",
                public_id: "main-codingcatdev-photo/podcatchers/overcast-badge",
                context: {
                  _type: "cloudinary.assetContext",
                  custom: {
                    _type: "cloudinary.assetContextCustom",
                    alt: "Image of Overcast logo",
                  },
                },
              }}
            />
          </a>

          <a
            href="https://pca.st/aysv9xg5"
            target="_blank"
            rel="noreferrer"
            aria-label="Listen on Pocket Casts"
          >
            <CoverImage
              className="w-full h-auto"
              quality={100}
              image={{
                _type: "cloudinary.asset",
                public_id:
                  "main-codingcatdev-photo/podcatchers/pocketcasts-badge",
                context: {
                  _type: "cloudinary.assetContext",
                  custom: {
                    _type: "cloudinary.assetContextCustom",
                    alt: "Image of Pocket Casts logo",
                  },
                },
              }}
            />
          </a>

          <a
            href="https://radiopublic.com/purrfectdev-Gy40q4"
            target="_blank"
            rel="noreferrer"
            aria-label="Listen on RadioPublic"
          >
            <CoverImage
              className="w-full h-auto"
              quality={100}
              image={{
                _type: "cloudinary.asset",
                public_id:
                  "main-codingcatdev-photo/podcatchers/radiopublic-badge",
                context: {
                  _type: "cloudinary.assetContext",
                  custom: {
                    _type: "cloudinary.assetContextCustom",
                    alt: "Image of Radio Public logo",
                  },
                },
              }}
            />
          </a>

          <a
            href="https://www.stitcher.com/s?fid=491385&refid=stpr"
            target="_blank"
            rel="noreferrer"
            aria-label="Listen on Stitcher"
          >
            <CoverImage
              className="w-full h-auto"
              quality={100}
              image={{
                _type: "cloudinary.asset",
                public_id: "main-codingcatdev-photo/podcatchers/stitcher-badge",
                context: {
                  _type: "cloudinary.assetContext",
                  custom: {
                    _type: "cloudinary.assetContextCustom",
                    alt: "Image of Stitcher logo",
                  },
                },
              }}
            />
          </a>
        </div>
      </div>
    </section>
  );
}
