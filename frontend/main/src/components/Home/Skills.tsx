import {
  ReactLogo,
  AngularLogo,
  VueLogo,
  SvelteLogo,
  CssLogo,
  HtmlLogo,
} from '@/components/global/icons/VendorLogos';

export default function Skills() {
  return (
    <>
      {/* These 3 are bigger in size, so they are h-8/16 */}
      <ReactLogo className="h-14 md:h-16 " />
      <AngularLogo className="h-14 md:h-16 " />
      <VueLogo className="h-14 md:h-16 " />
      {/* These 3 are smaller in size, so they are h-10/20 */}
      <SvelteLogo className="h-16 md:h-20 " />
      <CssLogo className="h-16 md:h-20 " />
      <HtmlLogo className="h-16 md:h-20 " />
    </>
  );
}
