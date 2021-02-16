import { Dispatch, SetStateAction } from 'react';

export const Hamburger = (props: {
  setOverlayMenuActive: Dispatch<SetStateAction<boolean>>;
  overlayMenuActive: boolean;
}): JSX.Element => {
  const { setOverlayMenuActive, overlayMenuActive } = props;

  return (
    <button
      className="inline-flex items-center justify-center p-1 text-xl rounded-md text-basics-50 hover:bg-primary-700 dark:hover:bg-primary-700 dark:text-basics-50 dark:hover:bg-primary-700focus:outline-none focus:ring-2 focus:ring-inset focus:ring-basics-50"
      aria-expanded="false"
      onClick={() => setOverlayMenuActive(!overlayMenuActive)}
    >
      <span className="sr-only">Open main menu</span>
      {!overlayMenuActive ? (
        <svg
          className="block w-10"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      ) : (
        <svg
          className="block w-10"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
    </button>
  );
};
