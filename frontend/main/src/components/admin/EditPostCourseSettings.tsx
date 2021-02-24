import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  addCourseSection,
  postHistoryUpdate,
  usersDataObservable,
} from '@/services/api';
import { Post, Section } from '@/models/post.model.ts';
import { take } from 'rxjs/operators';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { UserInfoExtended } from '@/models/user.model';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const arrayMove = require('array-move');

export default function EditPostCourseSettings({
  historyInput,
}: {
  historyInput: Post;
}): JSX.Element {
  const [history, setHistory] = useState<Post>();

  useEffect(() => {
    setHistory(historyInput);
  }, [historyInput]);

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
                    name="open"
                    value="open"
                    className="mt-1"
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="open" className="font-bold">
                      Open
                    </label>
                    <p>
                      The course is not protected. Any user can access its
                      content without the need to be logged-in or enrolled.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="free"
                    name="free"
                    value="free"
                    className="mt-1"
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="free" className="font-bold">
                      Free
                    </label>
                    <p>
                      The course is protected. Resistration and enrollment are
                      required in order to access the content.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="buy-now"
                    name="buy-now"
                    value="buy-now"
                    className="mt-1"
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="buy-now" className="font-bold">
                      Buy now
                    </label>
                    <p>
                      The course is protected via the LearnDash built-in Stripe.
                      Users need to purchase the course (one-time fee) in order
                      to gain access.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="recurring"
                    name="recurring"
                    value="recurring"
                    className="mt-1"
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="recurring" className="font-bold">
                      Recurring
                    </label>
                    <p>
                      The course is protected via the LearnDash built-in Stripe.
                      Users need to purchase the course (recurring fee) in order
                      to gain access.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="closed"
                    name="closed"
                    value="closed"
                    className="mt-1"
                    checked
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="closed" className="font-bold">
                      Closed
                    </label>
                    <p>
                      The course can only be accessed through admin enrollment
                      (manual), group enrollment, or integration (shopping cart
                      or membership) enrollment. No enrollment button will be
                      displayed, unless a URL is set (optional).
                    </p>
                    <blockquote className="flex flex-wrap w-full pl-4 space-x-4 border-l-2 border-primary-900">
                      <ul className="grid grid-cols-1 gap-2">
                        <li className="flex flex-wrap w-full">
                          <label htmlFor="course-price" className="font-bold">
                            Course Price
                          </label>
                          <input
                            type="number"
                            id="course-price"
                            name="course-price"
                            placeholder="$9.99"
                          />
                        </li>
                        <li className="flex flex-wrap w-full">
                          <label htmlFor="button-url" className="font-bold">
                            Button URL
                          </label>
                          <input
                            type="url"
                            id="button-url"
                            name="button-url"
                            placeholder="https://condingcat.dev"
                            pattern="https://.*"
                            required
                          />
                        </li>
                      </ul>
                    </blockquote>
                  </div>
                </li>
              </ul>
            </li>
            <li className="flex flex-wrap space-x-4 space-y-4">
              <h2 className="py-4 font-sans text-xl">Course Prerequisites</h2>
              <ul className="grid max-w-2xl grid-cols-1 gap-4">
                <li>
                  <label htmlFor="course-prereq"></label>
                  <input
                    type="checkbox"
                    id="course-prereq"
                    name="course-prereq"
                    className="mt-1"
                  />
                </li>
              </ul>
            </li>
            <li className="flex flex-wrap space-x-4 space-y-4">
              <h2 className="py-4 font-sans text-xl">Course Points</h2>
              <ul className="grid max-w-2xl grid-cols-1 gap-4">
                <li>
                  <label htmlFor="course-points"></label>
                  <input
                    type="checkbox"
                    id="course-points"
                    name="course-points"
                    className="mt-1"
                  />
                </li>
              </ul>
            </li>
            <li className="flex flex-wrap space-x-4 space-y-4">
              <h2 className="py-4 font-sans text-xl">
                Course Access Expiration
              </h2>
              <ul className="grid max-w-2xl grid-cols-1 gap-4">
                <li>
                  <label htmlFor="course-expiration"></label>
                  <input
                    type="checkbox"
                    id="course-expiration"
                    name="course-expiration"
                    className="mt-1"
                  />
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
              <ul className="grid max-w-2xl grid-cols-1 gap-4">
                <li className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="linear"
                    name="linear"
                    value="linear"
                    className="mt-1"
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="linear" className="font-bold">
                      Linear
                    </label>
                    <p>
                      Requires the user to progress through the course in the
                      designated step sequence.
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <input
                    type="radio"
                    id="free-form"
                    name="free-form"
                    value="free-form"
                    className="mt-1"
                    checked
                  />
                  <div className="grid grid-cols-1 gap-2">
                    <label htmlFor="free-form" className="font-bold">
                      Free Form
                    </label>
                    <p>
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
