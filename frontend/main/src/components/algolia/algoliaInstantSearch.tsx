import React, { useState, useEffect, createRef } from 'react';

import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  Index,
  connectStateResults,
  PoweredBy,
} from 'react-instantsearch-dom';
import CustomSearchBox from './customSearchBox';
import * as hitComps from './customHitComponents';

const useClickOutside = (
  ref: { current: { contains: (arg0: any) => any } },
  handler: () => any,
  events: string[]
) => {
  if (!events) events = [`mousedown`, `touchstart`];
  const detectClickOutside = (event: { target: any }) =>
    !ref.current.contains(event.target) && handler();
  useEffect(() => {
    for (const event of events)
      document.addEventListener(event, detectClickOutside);
    return () => {
      for (const event of events)
        document.removeEventListener(event, detectClickOutside);
    };
  });
};

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || ''
);

const searchIndices = [
  {
    name: `${process.env.NEXT_PUBLIC_ALGOLIA_INDEX || ''}`,
    title: `Courses`,
    hitComp: `BlogPostHit`,
  },
];

const Results = connectStateResults(
  ({ searchState: state, searchResults: res, children }: any) => {
    const message = state.query
      ? `No results for '${state.query}'`
      : 'Please search above';
    return res && res.nbHits > 0 ? children : message;
  }
);
const Stats = connectStateResults(({ searchResults: res }: any) => {
  return (
    res && res.nbHits > 0 && `${res.nbHits} result${res.nbHits > 1 ? `s` : ``}`
  );
});

const HitList = (show: any) => {
  const [query, setQuery] = useState(``);
  const [focus, setFocus] = useState(false);

  const searchClient = {
    search(requests: any) {
      const shouldSearch = requests.some(
        ({ params: { query } }: any) => query !== ''
      );
      if (shouldSearch) {
        return algoliaClient.search(requests);
      }
      return Promise.resolve({
        results: [{ hits: [] }],
      });
    },
    searchForFacetValues: algoliaClient.searchForFacetValues,
  };
  const ahitComps = hitComps as any;
  return (
    <>
      {show && (
        <InstantSearch
          indexName={searchIndices[0].name}
          searchClient={searchClient}
        >
          <header>
            <CustomSearchBox />
            <hr className="mt-2 opacity-20 text-primary-900" />
          </header>
          {searchIndices.map(({ name, title, hitComp }) => (
            <main className="pr-2 overflow-y-auto max-h-80" key={name}>
              <Index indexName={name}>
                <Results>
                  <Hits
                    hitComponent={ahitComps[hitComp](() => setFocus(false))}
                  />
                </Results>
              </Index>
            </main>
          ))}
          <footer>
            <hr className="mb-2 opacity-20 text-primary-900" />
            <div className="justify-self-end">
              <PoweredBy />
            </div>
          </footer>
        </InstantSearch>
      )}
      <style global jsx>{`
        .ais-Hits-list {
          display: grid;
          gap: 0.5rem;
          width: fit-content;
        }
      `}</style>
    </>
  );
};
export default HitList;
