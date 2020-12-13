import { Listbox, Transition } from '@headlessui/react';
import OutsideClick from '@/components/OutsideClick';
import { useEffect, useState } from 'react';
import { postCreate, postsBaseNameUnique } from '@/services/api';
import {
  Post,
  PostStatus,
  PostType,
  PostVisibility,
} from '@/models/post.model';

import { InputText } from 'primereact/inputtext';
import { toKebabCase } from '@/utils/basics/stringManipulation';
import { take } from 'rxjs/operators';

const postInitial = {
  type: PostType.post,
  title: '',
  status: PostStatus.draft,
  visibility: PostVisibility.private,
  permalink: '',
  basename: '',
};

export default function CreatePost() {
  const [showModal, setShowModal] = useState(false);
  const [post, setPost] = useState<Post>(postInitial);
  const [basenameUnique, setBasenameUnique] = useState(false);

  //TODO: We should pull these from firebase config or remote config
  const postTypeSelectItems = [
    { label: PostType.post, value: PostType.post },
    { label: PostType.tutorials, value: PostType.tutorials },
    { label: PostType.podcasts, value: PostType.podcasts },
  ];

  const create = async () => {
    await postCreate(post.type, post.title, post.basename);
    setShowModal(false);
    setPost(postInitial);
  };

  const basenameInput = async (e: any, isTitle: any) => {
    const basename = toKebabCase(e.target.value);
    let postUpdate;
    if (isTitle) {
      postUpdate = {
        ...post,
        title: e.target.value,
        basename,
      };
    } else {
      postUpdate = {
        ...post,
        basename,
      };
    }
    setPost(postUpdate);
    setBasenameUnique(await postsBaseNameUnique(postUpdate.basename));
  };

  return (
    <>
      <div className="flex self-end">
        <button
          className="cursor-pointer btn-primary"
          onClick={() => setShowModal(true)}
        >
          Create Post
        </button>
      </div>

      <>
        <Transition
          show={showModal}
          enter="ease-out duration-75"
          leave="ease-in duration-75"
        >
          {/* This example requires Tailwind CSS v2.0+ */}
          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-ccd-purples-100 bg-opacity-70" />
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
                              Create Post
                            </h3>
                            <div className="flex">
                              <div className={'grid gap-4'}>
                                <Listbox
                                  as="div"
                                  className="space-y-1"
                                  value={postTypeSelectItems}
                                  onChange={() => setPost(post)}
                                >
                                  {({ open }) => (
                                    <>
                                      <Listbox.Label className="block text-sm font-bold leading-5">
                                        Type
                                      </Listbox.Label>
                                      <div className="relative">
                                        <span className="inline-block w-full rounded-md shadow-sm">
                                          <Listbox.Button className="relative w-full py-2 pl-3 pr-10 text-left transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md cursor-default focus:outline-none focus:shadow-outline-blue focus:border-ccd-purples-300 sm:text-sm sm:leading-5">
                                            <span className="block truncate">
                                              {post.type}
                                            </span>
                                            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                              <svg
                                                className="w-5 h-5 text-gray-400"
                                                viewBox="0 0 20 20"
                                                fill="none"
                                                stroke="currentColor"
                                              >
                                                <path
                                                  d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                                  strokeWidth="1.5"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                            </span>
                                          </Listbox.Button>
                                        </span>

                                        <Transition
                                          show={open}
                                          leave="transition ease-in duration-100"
                                          leaveFrom="opacity-100"
                                          leaveTo="opacity-0"
                                          className="absolute w-full mt-1 bg-white rounded-md shadow-lg"
                                        >
                                          <Listbox.Options
                                            static
                                            className="py-1 overflow-auto text-base leading-6 rounded-md shadow-xs max-h-60 focus:outline-none sm:text-sm sm:leading-5"
                                          >
                                            {postTypeSelectItems.map(
                                              (postType) => (
                                                <Listbox.Option
                                                  key={postType.value}
                                                  value={postType.value}
                                                >
                                                  {({ selected, active }) => (
                                                    <div
                                                      className={`${
                                                        active
                                                          ? 'text-white bg-ccd-purples-600'
                                                          : 'text-gray-900'
                                                      } cursor-default select-none relative py-2 pl-8 pr-4`}
                                                    >
                                                      <span
                                                        className={`${
                                                          selected
                                                            ? 'font-semibold'
                                                            : 'font-normal'
                                                        } block truncate`}
                                                      >
                                                        {postType.label}
                                                      </span>
                                                      {selected && (
                                                        <span
                                                          className={`${
                                                            active
                                                              ? 'text-white'
                                                              : 'text-ccd-purples-600'
                                                          } absolute inset-y-0 left-0 flex items-center pl-1.5`}
                                                        >
                                                          <svg
                                                            className="w-5 h-5"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                          >
                                                            <path
                                                              fillRule="evenodd"
                                                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                              clipRule="evenodd"
                                                            />
                                                          </svg>
                                                        </span>
                                                      )}
                                                    </div>
                                                  )}
                                                </Listbox.Option>
                                              )
                                            )}
                                          </Listbox.Options>
                                        </Transition>
                                      </div>
                                    </>
                                  )}
                                </Listbox>
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
                                      basenameInput(e, true);
                                    }}
                                  />
                                </label>
                                <div className="flex">
                                  <label
                                    className="block mb-2 text-sm font-bold leading-5"
                                    htmlFor="username"
                                  >
                                    <div className="flex">
                                      Basename
                                      {basenameUnique ? (
                                        <div>
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="h-4 text-ccd-greens-600"
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
                                            className="h-4 text-ccd-reds-800"
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
                                      id="basename"
                                      type="basename"
                                      required
                                      value={post.basename}
                                      onChange={(e) => basenameInput(e, false)}
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
                          type="submit"
                          onClick={() => create()}
                          className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white border border-transparent rounded-md shadow-sm disabled:opacity-25 bg-ccd-purples-900 hover:bg-ccd-purples-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ccd-purples-500 sm:ml-3 sm:w-auto sm:text-sm"
                          disabled={
                            post.title === '' ||
                            post.basename === '' ||
                            !basenameUnique
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
