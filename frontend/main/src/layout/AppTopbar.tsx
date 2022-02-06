import { Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import Toggle from '@/components/global/icons/Toggle';

import OutsideClick from '@/components/OutsideClick';
import SearchModal from '@/components/algolia/SearchModal';
import AvatarMenu from '@/components/user/AvatarMenu';
import { BuilderComponent } from '@builder.io/react';

export const AppTopbar = (props: {
  setOverlayMenuActive: Dispatch<SetStateAction<boolean>>;
  overlayMenuActive: boolean;
  header: any;
}): JSX.Element => {
  const { setOverlayMenuActive, overlayMenuActive, header } = props;

  return (
    <>
      <BuilderComponent
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
