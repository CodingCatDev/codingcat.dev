import { useState, useEffect, Fragment } from 'react';
import { Listbox } from '@headlessui/react';
import { useDarkMode, useMediaQuery } from 'usehooks-ts';

// There is also a default that is set in _app to avoid FOUC

const lightSvg = (active: boolean) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 mr-2"
  >
    <path
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
      className={`${
        active ? 'stroke-white' : 'stroke-primary-500 dark:stroke-primary-400'
      }`}
    />
    <path
      d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
      className={`${
        active ? 'stroke-white' : 'stroke-primary-500 dark:stroke-primary-400'
      }`}
    />
  </svg>
);

const darkSvg = (active: boolean) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 mr-2">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
      className="fill-transparent"
    />
    <path
      d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
      className={`${
        active ? 'fill-white' : 'fill-primary-500 dark:fill-primary-400'
      }`}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
      className={`${
        active ? 'fill-white' : 'fill-primary-500 dark:fill-primary-400'
      }`}
    />
  </svg>
);

const systemSvg = (active: boolean) => (
  <svg viewBox="0 0 24 24" fill="none" className="w-8 mr-2">
    <path
      d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
      strokeWidth={2}
      strokeLinejoin="round"
      className={`${
        active ? 'stroke-white' : 'stroke-primary-500 dark:stroke-primary-400'
      }`}
    />
    <path
      d="M14 15c0 3 2 5 2 5H8s2-2 2-5"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`${
        active ? 'stroke-white' : 'stroke-primary-500 dark:stroke-primary-400'
      }`}
    />
  </svg>
);

export default function Toggle(): JSX.Element {
  const { isDarkMode, enable, disable } = useDarkMode();

  const theme = [
    { name: 'light', svg: lightSvg, text: 'Light' },
    { name: 'dark', svg: darkSvg, text: 'Dark' },
    { name: 'system', svg: systemSvg, text: 'System' },
  ];
  const [selected, setSelected] = useState(theme[0]);

  useEffect(() => {
    if (isDarkMode) {
      setTheme('dark');
    } else {
      if (!('darkMode' in localStorage)) {
        setTheme('system');
      } else {
        setTheme('light');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDarkMode]);

  const setTheme = (e: any) => {
    if (e === 'light') {
      setSelected(theme[0]);
      disable();
    }
    if (e === 'dark') {
      setSelected(theme[1]);
      enable();
    }
    if (e === 'system' && window && window.localStorage) {
      setSelected(theme[2]);
      window.localStorage.removeItem('darkMode');
    }
    setTailwind();
  };

  // Tailwind
  const setTailwind = () => {
    if (
      ('darkMode' in localStorage && eval(localStorage.darkMode)) ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Listbox value={selected} onChange={setTheme}>
      <Listbox.Button className="self-center p-1 m-2 rounded-full hover:bg-primary-800 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-basics-50 text-yellow-50 dark:text-yellow-50">
        {selected.name === 'light' && (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8"
          >
            <path
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              className="stroke-white"
            />
            <path
              d="M12 4v1M17.66 6.344l-.828.828M20.005 12.004h-1M17.66 17.664l-.828-.828M12 20.01V19M6.34 17.664l.835-.836M3.995 12.004h1.01M6 6l.835.836"
              className="stroke-white"
            />
          </svg>
        )}
        {selected.name === 'dark' && (
          <svg viewBox="0 0 24 24" fill="none" className="w-8">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.715 15.15A6.5 6.5 0 0 1 9 6.035C6.106 6.922 4 9.645 4 12.867c0 3.94 3.153 7.136 7.042 7.136 3.101 0 5.734-2.032 6.673-4.853Z"
              className="fill-transparent"
            />
            <path
              d="m17.715 15.15.95.316a1 1 0 0 0-1.445-1.185l.495.869ZM9 6.035l.846.534a1 1 0 0 0-1.14-1.49L9 6.035Zm8.221 8.246a5.47 5.47 0 0 1-2.72.718v2a7.47 7.47 0 0 0 3.71-.98l-.99-1.738Zm-2.72.718A5.5 5.5 0 0 1 9 9.5H7a7.5 7.5 0 0 0 7.5 7.5v-2ZM9 9.5c0-1.079.31-2.082.845-2.93L8.153 5.5A7.47 7.47 0 0 0 7 9.5h2Zm-4 3.368C5 10.089 6.815 7.75 9.292 6.99L8.706 5.08C5.397 6.094 3 9.201 3 12.867h2Zm6.042 6.136C7.718 19.003 5 16.268 5 12.867H3c0 4.48 3.588 8.136 8.042 8.136v-2Zm5.725-4.17c-.81 2.433-3.074 4.17-5.725 4.17v2c3.552 0 6.553-2.327 7.622-5.537l-1.897-.632Z"
              className="fill-white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17 3a1 1 0 0 1 1 1 2 2 0 0 0 2 2 1 1 0 1 1 0 2 2 2 0 0 0-2 2 1 1 0 1 1-2 0 2 2 0 0 0-2-2 1 1 0 1 1 0-2 2 2 0 0 0 2-2 1 1 0 0 1 1-1Z"
              className="fill-white"
            />
          </svg>
        )}{' '}
        {selected.name === 'system' && (
          <svg viewBox="0 0 24 24" fill="none" className="w-8">
            <path
              d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6Z"
              strokeWidth={2}
              strokeLinejoin="round"
              className="stroke-white fill-primary-400/20"
            />
            <path
              d="M14 15c0 3 2 5 2 5H8s2-2 2-5"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="stroke-white"
            />
          </svg>
        )}
      </Listbox.Button>
      <Listbox.Options className="absolute right-0 z-50 p-2 overflow-hidden text-xl font-semibold rounded-lg shadow-lg bg-primary-50 dark:bg-primary-900 top-full ring-1 ring-primary-900 dark:ring-primary-400 w-36">
        {theme.map((t) => (
          <Listbox.Option key={t.name} value={t.name} as={Fragment}>
            {({ active }) => (
              <li
                className={`flex cursor-pointer bg-primary-50 dark:bg-primary-900 
                ${
                  active
                    ? 'bg-primary-500 text-white'
                    : 'bg-primary-50 text-primary-500 dark:text-primary-400'
                }
                `}
              >
                {t.svg(active)}
                {t.text}
              </li>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Listbox>
  );
}
