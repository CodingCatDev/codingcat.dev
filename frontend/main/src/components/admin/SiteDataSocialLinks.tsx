import { useEffect, useState } from 'react';
import { addSiteSocialLink, siteUpdate } from '@/services/api';
import { take } from 'rxjs/operators';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { SocialLink, Site, SocialType } from '@/models/site.model';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const arrayMove = require('array-move');

export default function SiteDataSocialLinks({
  siteInput,
}: {
  siteInput: Site;
}): JSX.Element {
  const [site, setSite] = useState<Site>({ id: '', title: '' });
  const [socialLink, setSocialLink] = useState<SocialLink>({
    type: SocialType.facebook,
    href: '',
  });

  useEffect(() => {
    setSite(siteInput);
  }, [siteInput]);

  const createSocialLink = async () => {
    if (!site) {
      return;
    }
    addSiteSocialLink(site, socialLink)
      .pipe(take(1))
      .subscribe((h) => {
        setSite(h);
        setSocialLink({ type: SocialType.facebook, href: '' });
      });
  };

  const onSocialLinkDelete = (i: number) => {
    if (site.socialLinks) {
      const socialLinks = [...site.socialLinks];
      socialLinks.splice(i, 1);

      const update = { ...site };

      if (site.socialLinks) {
        update.socialLinks = socialLinks;
      }
      setSite(update);
      siteUpdate(update).pipe(take(1)).subscribe();
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result;
    if (!destination) {
      return;
    }
    const sections = site.socialLinks;
    const moved = arrayMove(sections, source.index, destination.index);
    const update = { ...site, socialLinks: moved };
    setSite(update);
    siteUpdate(update).pipe(take(1)).subscribe();
  };

  return (
    <>
      <div className="grid content-start gap-4">
        <div className="flex items-center p-4 space-x-4 rounded-lg bg-primary-900 dark:bg-primary-900">
          <div className="flex-grow">
            <input
              id="title"
              type="text"
              placeholder="Social Title"
              value={socialLink.type}
              className="w-full"
              onChange={(e) => {
                setSocialLink({
                  ...socialLink,
                  type: e.target.value as SocialType,
                });
              }}
            />
          </div>
          <div className="flex-grow">
            <input
              id="slug"
              type="url"
              placeholder="https://twitter.com/CodingCatDev"
              value={socialLink.href}
              className="w-full"
              onChange={(e) => {
                setSocialLink({ ...socialLink, href: e.target.value });
              }}
            />
          </div>
          <button
            className="ml-1 cursor-pointer btn-secondary"
            onClick={() => createSocialLink()}
          >
            Add Social Link
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid">
            <Droppable droppableId={`SocialLinks`} type="SocialLinks">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {site &&
                    site.socialLinks &&
                    site.socialLinks?.map((pl, pli) => (
                      <Draggable
                        draggableId={`pl${pli}`}
                        index={pli}
                        key={`pl${pli}`}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="rounded-lg header bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50"
                          >
                            <div className="flex flex-wrap justify-between w-full p-4">
                              <div className="flex flex-col">
                                <h2 className="font-sans text-4xl">
                                  {pl.type}
                                </h2>
                                <p className="font-sans text-xl">{pl.href}</p>
                              </div>
                              <button onClick={() => onSocialLinkDelete(pli)}>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  className="w-12"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                </div>
              )}
            </Droppable>
          </div>
        </DragDropContext>
      </div>
      <style jsx>{`
        .header + .header {
          margin-top: 1rem;
        }
      `}</style>
    </>
  );
}
