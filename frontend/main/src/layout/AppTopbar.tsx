import { Dispatch, SetStateAction, useState } from 'react';
import OutsideClick from '@/components/OutsideClick';
import AvatarMenu from '@/components/user/AvatarMenu';
import dynamic from 'next/dynamic';
const CodingCatBuilder = dynamic(
  () =>
    import('@/components/builder/CodingCatBuilder').then((res) => res as any),
  { ssr: false }
) as any;

export const AppTopbar = (props: {
  setOverlayMenuActive: Dispatch<SetStateAction<boolean>>;
  overlayMenuActive: boolean;
  header: any;
}): JSX.Element => {
  const { setOverlayMenuActive, overlayMenuActive, header } = props;

  return (
    <>
      <CodingCatBuilder
        model="header"
        content={header}
        context={{
          toggleOverlay: () => setOverlayMenuActive(!overlayMenuActive),
          setOverlayMenuActive,
          overlayMenuActive,
        }}
      />
    </>
  );
};

export const AvatarMenuWrapper = () => {
  const [userMenu, setUserMenu] = useState(false);

  return (
    <>
      {/* Profile dropdown --> */}
      <OutsideClick toggle={setUserMenu} value={false}>
        <AvatarMenu userMenu={userMenu} setUserMenu={setUserMenu} />
      </OutsideClick>
    </>
  );
};
