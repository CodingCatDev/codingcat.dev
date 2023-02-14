import useOnClickOutside from '@/hooks/useOnClickOutside';
import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';

import AlgoliaInstantSearch from '@/components/algolia/algoliaInstantSearch';

export default function SearchModal(): JSX.Element {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  useOnClickOutside(ref, () => setShow(false));

  const showModal = () => {
    setShow(true);
  };

  const hideModal = () => {
    setShow(false);
  };

  const escFunction = useCallback((e: { keyCode: number }) => {
    if (e.keyCode === 27) {
      setShow(false);
    }
  }, []);

  const cmdKFunction = useCallback(
    (e: { metaKey: any; ctrlKey: any; code: string }) => {
      if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
        setShow(true);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener('keydown', escFunction, false);
    document.addEventListener('keydown', cmdKFunction, false);
    return () => {
      document.removeEventListener('keydown', escFunction, false);
      document.removeEventListener('keydown', cmdKFunction, false);
    };
  }, [cmdKFunction, escFunction]);

  const Modal = ({
    show,
    children,
  }: {
    show: boolean;
    children: JSX.Element;
  }) => {
    const showHideclassNameName = show
      ? 'fixed inset-0 z-50 bg-basics-900 dark:bg-basics-900 dark:bg-opacity-50 bg-opacity-50 grid place-items-center h-screen'
      : 'hidden';
    return <section className={showHideclassNameName}>{children}</section>;
  };

  return (
    <>
      {show && (
        <Modal show={show}>
          <section
            className="relative grid w-full max-w-lg grid-cols-1 mx-auto transition-all rounded-md shadow-md min-h-1/2 max-h-1/2 bg-basics-50 text-basics-900"
            style={{
              animation:
                'scale-in-center 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
            }}
          >
            <section
              className="absolute grid w-full h-full gap-4 p-4 grid-rows-search"
              ref={ref}
            >
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
      )}
      <button
        className={
          show
            ? 'hidden'
            : 'flex items-center p-1 rounded-full hover:bg-primary-800 text-basics-50 dark:hover:bg-primary-700'
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
}
