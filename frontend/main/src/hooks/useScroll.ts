import { useState, useEffect } from 'react';

type SSRRect = {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
};
const EmptySSRRect: SSRRect = {
  bottom: 0,
  height: 0,
  left: 0,
  right: 0,
  top: 0,
  width: 0,
  x: 0,
  y: 0,
};

/**
 * useScroll React custom hook
 *
 * Original source: {@link https://gist.github.com/joshuacerbito/ea318a6a7ca4336e9fadb9ae5bbb87f4}
 * Typescript version: {@link https://gist.github.com/gusfune/5ee7d6815db966ab16d88dda7cf414da}
 *
 * @param scrollX - Horizontal scroll position in pixels
 * @param scrollY - Vertical scroll position in pixels
 * @param scrollDirection - returns last position of movement, either `up`, `down` or `undefined`.
 *
 * @example ```ts
 * const { scrollX, scrollY, scrollDirection } = useScroll();
 * ```
 */
const useScroll = () => {
  const [lastScrollTop, setLastScrollTop] = useState<number>(0);
  const [bodyOffset, setBodyOffset] = useState<DOMRect | SSRRect>(
    typeof window === 'undefined' || !window.document
      ? EmptySSRRect
      : document.body.getBoundingClientRect()
  );
  const [scrollY, setScrollY] = useState<number>(bodyOffset.top);
  const [scrollX, setScrollX] = useState<number>(bodyOffset.left);
  const [scrollDirection, setScrollDirection] = useState<
    'down' | 'up' | undefined
  >();

  const listener = () => {
    setBodyOffset(
      typeof window === 'undefined' || !window.document
        ? EmptySSRRect
        : document.body.getBoundingClientRect()
    );
    setScrollY(-bodyOffset.top);
    setScrollX(bodyOffset.left);
    setScrollDirection(lastScrollTop > -bodyOffset.top ? 'down' : 'up');
    setLastScrollTop(-bodyOffset.top);
  };

  useEffect(() => {
    window.addEventListener('scroll', listener);
    return () => {
      window.removeEventListener('scroll', listener);
    };
  });

  return {
    scrollY,
    scrollX,
    scrollDirection,
  };
};

export { useScroll };
