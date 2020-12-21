import { Listbox, Transition } from '@headlessui/react';
import OutsideClick from '@/components/OutsideClick';
import { useEffect, useState } from 'react';
import { postCreate, postsSlugUnique } from '@/services/api';
import {
  Post,
  PostStatus,
  PostType,
  PostVisibility,
} from '@/models/post.model';

import { InputText } from 'primereact/inputtext';
import { toKebabCase } from '@/utils/basics/stringManipulation';
import { take } from 'rxjs/operators';
import router from 'next/router';

const postInitial = {
  type: PostType.post,
  title: '',
  titleSearch: '',
  status: PostStatus.draft,
  visibility: PostVisibility.private,
  permalink: '',
  slug: '',
};

export default function CreatePost({ type }: { type: PostType }) {
  const [showModal, setShowModal] = useState(false);
  const [post, setPost] = useState<Post>(postInitial);
  const [slugUnique, setSlugUnique] = useState(false);

  useEffect(() => {
    setPost({
      ...postInitial,
      type,
    });
  }, [type]);

  const create = async () => {
    postCreate(post.type, post.title, post.slug)
      .pipe(take(1))
      .subscribe((p) => {
        setShowModal(false);
        router.push(`/admin/${router.query.type}/${p.id}`);
      });
  };

  const slugInput = async (e: any, isTitle: any) => {
    const slug = toKebabCase(e.target.value);
    let postUpdate;
    if (isTitle) {
      postUpdate = {
        ...post,
        title: e.target.value,
        slug,
      };
    } else {
      postUpdate = {
        ...post,
        slug,
      };
    }
    setPost(postUpdate);
    postsSlugUnique(postUpdate.slug)
      .pipe(take(1))
      .subscribe((unique) => setSlugUnique(unique));
  };

  return (
    <>
      <div className="flex self-end">
        <button
          className="cursor-pointer btn-primary"
          onClick={() => setShowModal(true)}
        >
          Create {post.type}
        </button>
      </div>

      <>
        <Transition
          show={showModal}
          enter="ease-out duration-75"
          leave="ease-in duration-75"
        >
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-purple-100 bg-opacity-70" />
              </div>
              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                aria-hidden="true"
              >
                ​
              </span>

              <div
                className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <OutsideClick toggle={setShowModal} value={false}>
                  <>
                    <form>
                      <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4 h-80">
                        <div className="sm:flex sm:items-start">
                          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                            <h3 className="pb-2" id="modal-headline">
                              Create {post.type}
                            </h3>
                            <div className="flex">
                              <div className={'grid gap-4'}>
                                <label
                                  className="block mb-2 text-sm font-bold leading-5"
                                  htmlFor="username"
                                >
                                  Title
                                  <input
                                    className="w-full px-3 py-2 border rounded shadow appearance-none text-grey-darker"
                                    id="title"
                                    type="title"
                                    required
                                    value={post.title}
                                    onChange={(e) => {
                                      slugInput(e, true);
                                    }}
                                  />
                                </label>
                                <div className="flex">
                                  <label
                                    className="block mb-2 text-sm font-bold leading-5"
                                    htmlFor="username"
                                  >
                                    <div className="flex">
                                      Slug
                                      {slugUnique ? (
                                        <div>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="h-4 text-green-600"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                          </svg>
                                        </div>
                                      ) : (
                                        <div>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="h-4 text-red-800"
                                          >
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth="2"
                                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                          </svg>
                                        </div>
                                      )}
                                    </div>
                                    <input
                                      className="w-full px-3 py-2 border rounded shadow appearance-none text-grey-darker"
                                      id="slug"
                                      type="slug"
                                      required
                                      value={post.slug}
                                      onChange={(e) => slugInput(e, false)}
                                    />
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          onClick={() => create()}
                          className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-purple-900 border border-transparent rounded-md shadow-sm disabled:opacity-25 hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                          disabled={
                            post.title === '' || post.slug === '' || !slugUnique
                          }
                        >
                          Create
                        </button>
                        <button
                          onClick={() => setShowModal(false)}
                          type="button"
                          className="inline-flex justify-center w-full px-4 py-2 mt-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                </OutsideClick>
              </div>
            </div>
          </div>
        </Transition>
      </>
    </>
  );
}
