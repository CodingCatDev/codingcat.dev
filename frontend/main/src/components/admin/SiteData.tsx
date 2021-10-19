import { ChangeEvent } from 'react';
import { Site, SocialType } from '@/models/site.model';
import SiteDataPageLinks from '@/components/admin/SiteDataPageLinks';
import SiteDataSocialLinks from './SiteDataSocialLinks';
import {
  arrayUnion,
  doc,
  DocumentReference,
  setDoc,
} from '@firebase/firestore';
import { useFirestore, useFirestoreDocData } from 'reactfire';

const siteInitial: Site = {
  id: '',
  title: '',
  pageLinks: [],
  socialLinks: [],
};

export default function SiteData(): JSX.Element {
  const firestore = useFirestore();
  const siteRef = doc(
    firestore,
    'site',
    'codingcatdev'
  ) as DocumentReference<Site>;
  const { data: site } = useFirestoreDocData(siteRef);

  const onTitle = async (e: ChangeEvent<HTMLInputElement>) => {
    const u = {
      ...site,
      title: e.target.value,
    } as Site;
    await siteUpdate(u);
  };

  const setSitePageLink = (pageLink: { title: string; slug: string }) => {
    return setDoc(
      siteRef,
      {
        pageLinks: arrayUnion(pageLink),
      },
      { merge: true }
    );
  };

  const setSiteSocialLink = (socialLink: {
    type: SocialType;
    href: string;
  }) => {
    return setDoc(
      siteRef,
      {
        socialLinks: arrayUnion(socialLink),
      },
      { merge: true }
    );
  };

  const siteUpdate = (siteUpdate: Site) => {
    return setDoc(siteRef, siteUpdate, { merge: true });
  };

  if (!site) {
    return <></>;
  }

  return (
    <>
      <section className="flex flex-wrap mb-2 space-y-2 lg:space-y-0">
        <div className="flex flex-col pr-2">
          <div className="flex">
            <p className="flex items-center mr-2 font-bold uppercase text-primary-900 dark:text-basics-50">
              Title:{' '}
            </p>
            <input
              type="text"
              placeholder="Title"
              value={site?.title}
              onChange={(e) => onTitle(e)}
            ></input>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SiteDataPageLinks
          site={site}
          setSitePageLink={setSitePageLink}
          siteUpdate={siteUpdate}
        />
        <SiteDataSocialLinks
          site={site}
          setSiteSocialLink={setSiteSocialLink}
          siteUpdate={siteUpdate}
        />
      </section>
    </>
  );
}
