import { Listbox, Transition } from '@headlessui/react';
import OutsideClick from '@/components/OutsideClick';
import { useEffect, useState } from 'react';
import { postCreate, postHistoryCreate, postsSlugUnique } from '@/services/api';
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

export default function RestoreHistory({ postHistory }: { postHistory: Post }) {
  const [showModal, setShowModal] = useState(false);
  const [post, setPost] = useState<Post>(postInitial);

  useEffect(() => {
    setPost(postHistory);
  }, [postHistory]);

  const restore = async () => {
    postHistoryCreate(post)
      .pipe(take(1))
      .subscribe(() => {
        setShowModal(false);
      });
  };

  const restoreModal = async () => {
    setShowModal(true);
  };

  return (
    <>
      <button className="btn-primary" onClick={() => restoreModal()}>
        Restore
      </button>

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
                            <p className="pb-2" id="modal-headline">
                              Are you sure you want to restore from:
                              <p>{post.id}</p>
                              <p>Last Updated:</p>
                              <p>{post.updatedAt?.toDate().toDateString()}</p>
                            </p>
                            <div className="flex"></div>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          onClick={() => restore()}
                          className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-purple-900 border border-transparent rounded-md shadow-sm disabled:opacity-25 hover:bg-purple-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Restore
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
