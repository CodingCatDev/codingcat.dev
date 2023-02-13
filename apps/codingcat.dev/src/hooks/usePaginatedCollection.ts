// ...usePaginatedCollection.ts
import {
  DocumentData,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  OrderByDirection,
  query,
  Query,
  startAfter,
} from '@firebase/firestore';
import { orderBy, QuerySnapshot } from 'firebase/firestore';
import { useState } from 'react';
import { ObservableStatus, useFirestoreCollection } from 'reactfire';

export interface UsePaginatedCollection<T> {
  query: Query<T>;
  limit: number;
  orderBy: OrderBy<T>;
}

interface OrderBy<T> {
  field: keyof T & string;
  direction: OrderByDirection;
}

export interface PaginatedCollection<T = DocumentData>
  extends Omit<ObservableStatus<QuerySnapshot<T>>, 'data'> {
  prevDisabled: boolean;
  nextDisabled: boolean;
  prev(): void;
  next(): Promise<void>;
  cursor: number;
  page: number;
  loading: boolean;
  data?: QuerySnapshot<T>;
  limit: number;
  update?(query?: Query): void;
}

/**
 * Retrieves a firestore collection with pagination controls
 * limit and orderBy fields are required for this operation
 * @param options requires {@link UsePaginatedCollection} (query, limit, and order)
 * @returns
 */
const usePaginatedCollection = <T = DocumentData>(
  options: UsePaginatedCollection<T>
): PaginatedCollection<T> => {
  const [cursor, setCursor] = useState(0);
  const [order] = useState(
    orderBy(options.orderBy.field, options.orderBy.direction)
  );
  const [q, setQuery] = useState(
    query(options.query, order, limit(options.limit))
  );

  const update = (newQuery?: Query<T>) => {
    if (newQuery) {
      setQuery(query(newQuery, order, limit(options.limit)));
      return;
    }
    setQuery(query(options.query, order, limit(options.limit)));
  };

  const result = useFirestoreCollection(q, {});
  const [lastPage, setLastPage] = useState(false);

  const prevDisabled = cursor === 0;
  const nextDisabled = (result.data?.size ?? 0) < options.limit || lastPage;
  const prev = () => {
    const prevCursor = result.data?.docs[0];
    if (prevDisabled || !prevCursor) return;

    const q = query(
      options.query,
      order,
      limitToLast(options.limit),
      endBefore(prevCursor)
    );
    setQuery(q);
    setCursor((state) => state - 1);
    setLastPage(false);
  };

  const next = async () => {
    const nextCursor = result.data?.docs[result.data?.size - 1];
    if (nextDisabled || !nextCursor) return;
    const q = query(
      options.query,
      order,
      limit(options.limit),
      startAfter(nextCursor)
    );

    // check if there are documents for next page
    const docCheck = await getDocs(query(q, limit(1)));
    if (!docCheck.size) {
      setLastPage(true);
      return;
    }

    setQuery(q);
    setCursor((state) => state + 1);
  };

  return {
    ...result,
    prevDisabled,
    nextDisabled,
    prev,
    next,
    cursor,
    update,
    limit: options.limit,
    loading: result.status === 'loading',
    page: cursor + 1,
  };
};

export default usePaginatedCollection;

export function defaultPaginatedCollectionValues<T>(): PaginatedCollection<T> {
  const voidPromise = async () => {};
  const voidFunction = () => {};
  return {
    cursor: 0,
    limit: 10,
    loading: false,
    error: undefined,
    firstValuePromise: voidPromise(),
    hasEmitted: false,
    isComplete: false,
    next: voidPromise,
    nextDisabled: true,
    page: 1,
    prev: voidFunction,
    prevDisabled: true,
    status: 'loading',
  };
}
