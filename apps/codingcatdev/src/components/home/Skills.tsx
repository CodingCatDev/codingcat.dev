import {
  ReactLogo,
  AngularLogo,
  VueLogo,
  SvelteLogo,
  CssLogo,
  HtmlLogo,
} from '@/components/global/icons/VendorLogos';
import Link from 'next/link';

export default function Skills(): JSX.Element {
  return (
    <>
      {/* These 3 are bigger in size, so they are h-8/16 */}
      <Link href="/frameworks/react">
        <span className="sr-only">React</span>
        <ReactLogo className="h-14 md:h-16 " />
      </Link>
      <Link href="/frameworks/angular">
        <span className="sr-only">Angular</span>
        <AngularLogo className="h-14 md:h-16 " />
      </Link>
      <Link href="/frameworks/vue">
        <span className="sr-only">Vue</span>
        <VueLogo className="h-14 md:h-16 " />
      </Link>
      {/* These 3 are smaller in size, so they are h-10/20 */}
      <Link href="/frameworks/svelte">
        <span className="sr-only">Svelte</span>
        <SvelteLogo className="h-16 md:h-20 " />
      </Link>
      <Link href="/languages/css">
        <span className="sr-only">CSS</span>
        <CssLogo className="h-16 md:h-20 " />
      </Link>
      <Link href="/languages/html">
        <span className="sr-only">HTML</span>
        <HtmlLogo className="h-16 md:h-20 " />
      </Link>
    </>
  );
}
