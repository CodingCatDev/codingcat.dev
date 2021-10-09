import React, {
  useRef,
  useEffect,
  RefObject,
  SetStateAction,
  Dispatch,
} from 'react';
import PropTypes from 'prop-types';

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideClick(
  ref: RefObject<HTMLElement>,
  toggle: Dispatch<SetStateAction<boolean>>,
  value: boolean
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        toggle(value);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref, value, toggle]);
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideClick({
  children,
  toggle,
  value,
}: {
  children: JSX.Element;
  toggle: Dispatch<SetStateAction<boolean>>;
  value: boolean;
}): JSX.Element {
  const wrapperRef = useRef(null);
  useOutsideClick(wrapperRef, toggle, value);

  return <div ref={wrapperRef}>{children}</div>;
}

OutsideClick.propTypes = {
  children: PropTypes.element.isRequired,
  toggle: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
};

export default OutsideClick;
