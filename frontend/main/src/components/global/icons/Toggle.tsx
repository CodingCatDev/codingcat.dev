import { useTheme } from 'next-themes';
import nightwind from 'nightwind/helper';
import { useState, useEffect } from 'react';

export default function Toggle() {
  const [loaded, setLoaded] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setLoaded(true);
  }, []);

  const toggle = () => {
    nightwind.beforeTransition();
    if (theme !== 'dark') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };
  return (
    <button
      className="self-center p-1 m-2 rounded-full hover:bg-primary-800 dark:hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-basics-50 text-yellow-50 dark:text-yellow-50"
      aria-label="Toggle dark mode"
      onClick={toggle}
    >
      {loaded && (
        <>
          {theme != 'dark' ? (
            <svg
              className="w-8"
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="w-8"
              fill="white"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </>
      )}
    </button>
  );
}
