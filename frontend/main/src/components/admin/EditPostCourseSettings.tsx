import { useEffect, useState } from 'react';
import Link from 'next/link';
import { postHistoryUpdate } from '@/services/api';
import { NavigationSettings, Post } from '@/models/post.model';
import { take } from 'rxjs/operators';
import { AccessMode } from '@/models/access.model';

export default function EditPostCourseSettings({
  historyInput,
}: {
  historyInput: Post;
}): JSX.Element {
  const [history, setHistory] = useState<Post>();
  const [accessMode, setAccessMode] = useState<AccessMode | unknown>();
  const [navigationSettings, setNavigationSettings] = useState<
    NavigationSettings | unknown
  >();

  useEffect(() => {
    setHistory(historyInput);
    setAccessMode(historyInput.accessSettings?.accessMode);
    setNavigationSettings(historyInput.navigationSettings);
  }, [historyInput]);

  function onAccessModeChange(e: React.ChangeEvent<HTMLInputElement>): void {
    let accessMode: AccessMode = e.target.value as AccessMode;
    let historyUpdate: Post | undefined = undefined;

    if (e.target.type !== 'radio') {
      accessMode = AccessMode.closed;
      if (e.target.id === 'course-price') {
        historyUpdate = {
          ...history,
          accessSettings: {
            accessMode,
            price: parseFloat(e.target.value) as number,
            productId: history?.accessSettings?.productId || null,
          },
        } as Post;
      }
      if (e.target.id === 'productId') {
        historyUpdate = {
          ...history,
          accessSettings: {
            accessMode,
            price: history?.accessSettings?.price || null,
            productId: e.target.value,
          },
        } as Post;
      }
    } else {
      historyUpdate = {
        ...history,
        accessSettings: {
          accessMode,
        },
      } as Post;
    }
    if (historyUpdate) {
      setAccessMode(accessMode);
      setHistory(historyUpdate);
      postHistoryUpdate(historyUpdate).pipe(take(1)).subscribe();
    }
  }


  function onCourseNavigationChange(e: any): void {
    const navigationSettings: NavigationSettings = e.target
      .value as NavigationSettings;
    const historyUpdate = {
      ...history,
      navigationSettings,
    } as Post;

    setNavigationSettings(navigationSettings);
    setHistory(historyUpdate);
    postHistoryUpdate(historyUpdate).pipe(take(1)).subscribe();
  }

  if (!history) {
    return <></>;
  }

  return (
    <div className="grid grid-cols-1 gap-10">
      <section className="bg-basics-50 dark:bg-basics-800 text-basics-900">
        <header className="grid grid-cols-1 gap-2 p-4 border-b-2 border-primary-900">
          <h1 className="font-sans text-2xl">Course Access Settings</h1>
          <p className="italic text-basics-600">
            Controls how users will gain access to the course.
          </p>
        </header>
        <section className="p-4">
          <ul>
            <li className="flex flex-wrap space-x-4 space-y-4">
              <h2 className="py-4 font-sans text-xl">Access Mode</h2>
              <ul className="grid max-w-2xl grid-cols-1 gap-4">
                <li className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="open"
                    name="accessmode"
                    value="open"
                    onChange={(e) => onAccessModeChange(e)}
                    checked={accessMode === AccessMode.open}
                    className={`mt-1 border-gray-300 shadow-sm text-primary-900 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50`}
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <label
                      htmlFor="open"
                      className={`font-bold ${
                        accessMode !== AccessMode.open ? 'opacity-50' : ''
                      }`}
                    >
                      Open
                    </label>
                    <p
                      className={` ${
                        accessMode !== AccessMode.open ? 'opacity-50' : ''
                      }`}
                    >
                      The course is not protected. Any user can access its
                      content without the need to be logged-in or enrolled.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="free"
                    name="accessmode"
                    value="free"
                    onChange={(e) => onAccessModeChange(e)}
                    checked={accessMode === AccessMode.free}
                    className={`mt-1 border-gray-300 shadow-sm text-primary-900 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50`}
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <label
                      htmlFor="free"
                      className={`font-bold ${
                        accessMode !== AccessMode.free ? 'opacity-50' : ''
                      }`}
                    >
                      Free
                    </label>
                    <p
                      className={` ${
                        accessMode !== AccessMode.free ? 'opacity-50' : ''
                      }`}
                    >
                      The course is protected. Resistration and enrollment are
                      required in order to access the content.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="closed"
                    name="accessmode"
                    value="closed"
                    onChange={(e) => onAccessModeChange(e)}
                    checked={accessMode === AccessMode.closed}
                    className={`mt-1 border-gray-300 shadow-sm text-primary-900 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50`}
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <label
                      htmlFor="closed"
                      className={`font-bold ${
                        accessMode !== AccessMode.closed ? 'opacity-50' : ''
                      }`}
                    >
                      Closed
                    </label>
                    <p
                      className={`${
                        accessMode !== AccessMode.closed ? 'opacity-50' : ''
                      }`}
                    >
                      The course can only be accessed through admin enrollment
                      (manual), group enrollment, or integration (shopping cart
                      or membership) enrollment. No enrollment button will be
                      displayed, unless a URL is set (optional).
                    </p>
                    <blockquote
                      className={`flex flex-wrap w-full pl-4 space-x-4 border-l-2 ${
                        accessMode !== AccessMode.closed
                          ? 'border-basics-300'
                          : 'border-primary-900'
                      }`}
                    >
                      <ul className="grid grid-cols-1 gap-2">
                        <li className="flex flex-wrap w-full">
                          <label
                            htmlFor="course-price"
                            className={`font-bold ${
                              accessMode !== AccessMode.closed
                                ? 'opacity-50'
                                : ''
                            }`}
                          >
                            Course Price
                          </label>
                          <input
                            type="number"
                            id="course-price"
                            name="course-price"
                            value={history?.accessSettings?.price}
                            placeholder="$9.99"
                            disabled={accessMode !== AccessMode.closed}
                            onChange={(e) => onAccessModeChange(e)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm disabled:opacity-50 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                          />
                        </li>
                        <li className="flex flex-wrap w-full">
                          <label
                            htmlFor="productId"
                            className={`font-bold ${
                              accessMode !== AccessMode.closed
                                ? 'opacity-50'
                                : ''
                            }`}
                          >
                            Stripe Product ID
                          </label>
                          <input
                            type="text"
                            id="productId"
                            name="productId"
                            placeholder="price_1234"
                            pattern="price_"
                            value={history?.accessSettings?.productId}
                            disabled={accessMode !== AccessMode.closed}
                            onChange={(e) => onAccessModeChange(e)}
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm disabled:opacity-50 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
                          />
                        </li>
                      </ul>
                    </blockquote>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </section>
      <section className="bg-basics-50 dark:bg-basics-800 text-basics-900">
        <header className="grid grid-cols-1 gap-2 p-4 border-b-2 border-primary-900">
          <h1 className="font-sans text-2xl">Course Navigation Settings</h1>
          <p className="italic text-basics-600">
            Controls how users interact with the content and their navigational
            experience.
          </p>
        </header>
        <section className="p-4">
          <ul>
            <li className="flex flex-wrap space-x-4 space-y-4">
              <h2 className="py-4 font-sans text-xl">Course Progression</h2>
              <ul
                className="grid max-w-2xl grid-cols-1 gap-4"
                onChange={(e) => onCourseNavigationChange(e)}
              >
                <li className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="linear"
                    name="courseProgression"
                    value="linear"
                    onChange={(e) => onAccessModeChange(e)}
                    checked={navigationSettings === NavigationSettings.linear}
                    className={`mt-1 border-gray-300 shadow-sm text-primary-900 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50`}
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <label
                      htmlFor="linear"
                      className={`font-bold ${
                        navigationSettings !== NavigationSettings.linear
                          ? 'opacity-50'
                          : ''
                      }`}
                    >
                      Linear
                    </label>
                    <p
                      className={`font-bold ${
                        navigationSettings !== NavigationSettings.linear
                          ? 'opacity-50'
                          : ''
                      }`}
                    >
                      Requires the user to progress through the course in the
                      designated step sequence.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="freeform"
                    name="courseProgression"
                    value="freeform"
                    onChange={(e) => onAccessModeChange(e)}
                    checked={navigationSettings === NavigationSettings.freeform}
                    className={`mt-1 border-gray-300 shadow-sm text-primary-900 focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50`}
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <label
                      htmlFor="freeform"
                      className={`font-bold ${
                        navigationSettings !== NavigationSettings.freeform
                          ? 'opacity-50'
                          : ''
                      }`}
                    >
                      Free Form
                    </label>
                    <p
                      className={` ${
                        navigationSettings !== NavigationSettings.freeform
                          ? 'opacity-50'
                          : ''
                      }`}
                    >
                      Allows the user to move freely through the course without
                      following the designated step sequence.
                    </p>
                  </div>
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </section>
      <section className="bg-basics-50 dark:bg-basics-800 text-basics-900">
        <header className="grid grid-cols-1 gap-2 p-4 border-b-2 border-primary-900">
          <h1 className="font-sans text-2xl">Course Users</h1>
        </header>
        <section className="p-4">
          <p>
            Users enrolled via Groups using this Course are excluded from the
            listings below and should be managed via the{' '}
            <Link href="/group">
              <a>Group</a>
            </Link>{' '}
            admin screen.
          </p>
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div>
              {/* search input */}
              <input type="text" placeholder="Search All Course Users" />
              <ul className="p-2 border border-t-0 border-primary-900">
                <li>users...</li>
                <li>users...</li>
                <li>users...</li>
              </ul>
            </div>
            <div className="grid content-center h-full grid-cols-1 place-items-center">
              <button>
                <svg
                  className="w-10"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </button>
              <button>
                <svg
                  className="w-10"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z"
                  />
                </svg>
              </button>
            </div>
            <div>
              {/* search input */}
              <input type="text" placeholder="Search Assigned Course Users" />
              <ul className="p-2 border border-t-0 border-primary-900">
                <li>users...</li>
              </ul>
            </div>
          </section>
        </section>
      </section>
    </div>
  );
}
