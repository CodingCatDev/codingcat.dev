import React from 'react';
import { connectSearchBox } from 'react-instantsearch-dom';

export default connectSearchBox(({ refine, ...rest }) => (
  <form className="flex items-center w-full space-x-2">
    <label aria-label="search" htmlFor="search">
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
    </label>
    <input
      type="search"
      name="search"
      placeholder="Search for anything fun!"
      className="w-5/6 leading-tight border rounded shadow-none appearance-none text-ccd-basics-400 focus:outline-none focus:ring-ccd-purples-900"
      aria-label="Search"
      onChange={(e) => refine(e.target.value)}
    />
  </form>
));
