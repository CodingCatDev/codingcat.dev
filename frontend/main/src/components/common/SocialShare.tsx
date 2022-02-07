import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaRedditAlien,
  FaHackerNews,
} from 'react-icons/fa/';

export default function SocialShare({
  href,
  excerpt,
  title,
}: {
  href: string;
  excerpt: string;
  title: string;
}): JSX.Element {
  return (
    <>
      <a
        href={`https://twitter.com/intent/tweet?url=${href}&via=CodingCatDev&hashtags=CodingCatDevShares&text=${excerpt}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share to Twitter"
        className="border-none"
      >
        <button className="btn-secondary">
          <FaTwitter />
        </button>
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${href}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share to CodingCatDev LinkedIn"
        className="border-none"
      >
        <button className="btn-secondary">
          <FaLinkedinIn />
        </button>
      </a>
      <a
        href={`https://www.facebook.com/sharer.php?u=${href}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share to Facebook"
        className="border-none"
      >
        <button className="btn-secondary">
          <FaFacebookF />
        </button>
      </a>
      <a
        href={`https://www.reddit.com/submit?url=${href}&title=${title}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share to Reddit"
        className="border-none"
      >
        <button className="btn-secondary">
          <FaRedditAlien />
        </button>
      </a>{' '}
      <a
        href={`https://news.ycombinator.com/submitlink?u=${href}&t=${title}`}
        target="_blank"
        rel="noreferrer"
        aria-label="Share to Hackernews"
        className="border-none"
      >
        <button className="btn-secondary">
          <FaHackerNews />
        </button>
      </a>
    </>
  );
}
