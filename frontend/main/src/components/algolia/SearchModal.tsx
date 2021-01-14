import React, { useState } from 'react';
import AlgoliaInstantSearch from './algoliaInstantSearch';

export default () => {
  const [show, setShow] = useState(false);

  const showModal = () => {
    setShow(true);
  };

  const hideModal = () => {
    setShow(false);
  };

  const Modal = ({ handleClose, show, children }: any) => {
    const showHideclassNameName = show
      ? 'w-screen h-screen fixed inset-0 z-50 bg-basics-900 dark:bg-basics-900 dark:bg-opacity-50 bg-opacity-50 p-24'
      : 'hidden';
    return <section className={showHideclassNameName}>{children}</section>;
  };

  return (
    <>
      <Modal show={show} handleClose={hideModal}>
        <section
          className="grid w-full max-w-lg grid-cols-1 mx-auto transition-all rounded-md shadow-md min-h-1/2 bg-basics-50"
          style={{
            animation:
              'scale-in-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
          }}
        >
          <section className="relative grid w-full h-full grid-cols-1 gap-4 p-4 grid-rows-search">
            <AlgoliaInstantSearch show={show}></AlgoliaInstantSearch>
            <button
              className="absolute top-0 right-0 p-5 text-2xl transition-colors rounded-full text-primary-900 hover:text-secondary-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-900"
              onClick={hideModal}
              aria-label="Close Search Modal"
            >
              X
            </button>
          </section>
        </section>
      </Modal>
      <button
        className={
          show
            ? 'hidden'
            : 'flex items-center p-1 rounded-full hover:bg-primary-800 text-basics-50 dark:text-basics-50 dark:hover:bg-primary-700'
        }
        onClick={showModal}
        aria-label="Show Search Modal"
      >
        <svg
          className="w-8"
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M337.509 305.372h-17.501l-6.571-5.486c20.791-25.232 33.922-57.054 33.922-93.257C347.358 127.632 283.896 64 205.135 64 127.452 64 64 127.632 64 206.629s63.452 142.628 142.225 142.628c35.011 0 67.831-13.167 92.991-34.008l6.561 5.487v17.551L415.18 448 448 415.086 337.509 305.372zm-131.284 0c-54.702 0-98.463-43.887-98.463-98.743 0-54.858 43.761-98.742 98.463-98.742 54.7 0 98.462 43.884 98.462 98.742 0 54.856-43.762 98.743-98.462 98.743z"></path>
        </svg>
      </button>
    </>
  );
};
