import {
  ReactLogo,
  AngularLogo,
  VueLogo,
  SvelteLogo,
  CssLogo,
  HtmlLogo,
} from '@/components/global/icons/VendorLogos';
import Link from 'next/link';

export default function Skills() {
  return (
    <>
      {/* These 3 are bigger in size, so they are h-8/16 */}
      <Link href="/tags/reactjs">
        <a>
          <ReactLogo className="h-14 md:h-16 " />
        </a>
      </Link>
      <Link href="/tags/angular">
        <a>
          <AngularLogo className="h-14 md:h-16 " />
        </a>
      </Link>
      <Link href="/tags/vue">
        <a>
          <VueLogo className="h-14 md:h-16 " />
        </a>
      </Link>
      {/* These 3 are smaller in size, so they are h-10/20 */}
      <Link href="/tags/svelte">
        <a>
          <SvelteLogo className="h-16 md:h-20 " />
        </a>
      </Link>
      <Link href="/tags/css">
        <a>
          <CssLogo className="h-16 md:h-20 " />
        </a>
      </Link>
      <Link href="/tags/html">
        <a>
          <HtmlLogo className="h-16 md:h-20 " />
        </a>
      </Link>
    </>
  );
}
