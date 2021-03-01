import { useEffect, useState } from 'react';
import { siteDataObservable, siteUpdate } from '@/services/api';
import { Site } from '@/models/site.model';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import SiteDataPageLinks from '@/components/admin/SiteDataPageLinks';

const siteInitial: Site = {
  id: '',
  title: '',
  pageLinks: [],
  socialLinks: [],
};

export default function SiteData(): JSX.Element {
  const [site$, setSite$] = useState<Observable<Site | null>>();
  const [site, setSite] = useState<Site | null>(siteInitial);

  useEffect(() => {
    setSite$(siteDataObservable());
  }, []);

  useEffect(() => {
    if (site$) site$.subscribe((s) => setSite(s));
  }, [site$]);

  const onTitle = (e: any) => {
    const siteUpdate = {
      ...site,
      title: e.target.value,
    } as Site;
    update(siteUpdate);
  };

  const update = (update: Site) => {
    if (update && update.id) {
      setSite(update);
      siteUpdate(update).pipe(take(1)).subscribe();
    }
  };

  return (
    <>
      <section className="flex flex-wrap space-y-2 lg:space-y-0">
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
      <section>
        <SiteDataPageLinks />
      </section>
    </>
  );
}
