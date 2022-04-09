import React, { useState } from 'react';

import algoliasearch from 'algoliasearch/lite';
import {
  InstantSearch,
  Hits,
  Index,
  connectStateResults,
  PoweredBy,
  MenuSelect,
  Configure,
} from 'react-instantsearch-dom';
import CustomSearchBox from '@/components/algolia/connectSearchBox';
import * as hitComps from '@/components/algolia/customHitComponents';

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || '',
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || ''
);

const searchIndices = [
  {
    name: `builder-course`,
    title: `Courses`,
    hitComp: `BlogPostHit`,
  },
  {
    name: `builder-tutorial`,
    title: `Tutorials`,
    hitComp: `BlogPostHit`,
  },
  {
    name: `builder-post`,
    title: `Courses`,
    hitComp: `BlogPostHit`,
  },
  {
    name: `builder-podcast`,
    title: `Courses`,
    hitComp: `BlogPostHit`,
  },
];

const Results = connectStateResults(
  ({ searchState: state, searchResults: res, children }: any) => {
    const message = state.query
      ? `No results for '${state.query}' in ${res?.index?.replace(
          'builder-',
          ''
        )}`
      : 'Please search above';
    return res && res.nbHits > 0 ? children : message;
  }
);
// const Stats = connectStateResults(({ searchResults: res }: any) => {
//   return (
//     res && res.nbHits > 0 && `${res.nbHits} result${res.nbHits > 1 ? `s` : ``}`
//   );
// });

const HitList = ({ show }: { show: boolean }): JSX.Element => {
  const [, setFocus] = useState(false);

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
          <main className="overflow-y-auto">
            {searchIndices.map(({ name, hitComp }) => (
              <div className="pr-2 mb-2 overflow-y-auto" key={name}>
                <Index indexName={name}>
                  <Configure filters="published:published" />
                  <Results>
                    <Hits
                      hitComponent={ahitComps[hitComp](() => setFocus(false))}
                    />
                  </Results>
                </Index>
              </div>
            ))}
          </main>
          <footer>
            <hr className="mb-2 opacity-20 text-primary-900" />
            <div className="flex justify-between">
              <PoweredBy />
              <MenuSelect attribute="type" />
            </div>
          </footer>
        </InstantSearch>
      )}
      <style global jsx>{`
        .ais-Hits {
          max-height: 50%;
        }
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
