import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideClick(ref, toggle, value) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        toggle(value);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

/**
 * Component that alerts if you click outside of it
 */
function OutsideClick(props) {
  const wrapperRef = useRef(null);
  const { toggle, value } = props;
  useOutsideClick(wrapperRef, toggle, value);

  return <div ref={wrapperRef}>{props.children}</div>;
}

OutsideClick.propTypes = {
  children: PropTypes.element.isRequired,
  toggle: PropTypes.func.isRequired,
  value: PropTypes.bool.isRequired,
};

export default OutsideClick;
