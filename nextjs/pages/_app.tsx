/* purgecss start ignore */
import "../styles/globals.css";
import "primereact/resources/themes/vela-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "../layout/layout.scss";
/* purgecss end ignore */

import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { CSSTransition } from "react-transition-group";
import Link from "next/link";

import "../configureAmplify";

import { AppTopbar } from "../layout/AppTopbar";
import { AppMenu } from "../layout/AppMenu";

function MyApp({ Component, pageProps }) {
  const [layoutMode, setLayoutMode] = useState("static");
  const [layoutColorMode, setLayoutColorMode] = useState("dark");
  const [staticMenuInactive, setStaticMenuInactive] = useState(false);
  const [overlayMenuActive, setOverlayMenuActive] = useState(false);
  const [mobileMenuActive, setMobileMenuActive] = useState(false);
  const [inputStyle, setInputStyle] = useState("outlined");
  const [ripple, setRipple] = useState(false);
  const sidebar = useRef();
  let menuClick = false;

  useEffect(() => {
    if (mobileMenuActive) {
      addClass(document.body, "body-overflow-hidden");
    } else {
      removeClass(document.body, "body-overflow-hidden");
    }
  }, [mobileMenuActive]);

  const onInputStyleChange = (inputStyle) => {
    setInputStyle(inputStyle);
  };

  const onLayoutModeChange = (mode) => {
    setLayoutMode(mode);
  };

  const onColorModeChange = (mode) => {
    setLayoutColorMode(mode);
  };

  const onWrapperClick = (event) => {
    if (!menuClick) {
      setOverlayMenuActive(false);
      setMobileMenuActive(false);
    }
    menuClick = false;
  };

  const onToggleMenu = (event) => {
    menuClick = true;

    if (isDesktop()) {
      if (layoutMode === "overlay") {
        setOverlayMenuActive((prevState) => !prevState);
      } else if (layoutMode === "static") {
        setStaticMenuInactive((prevState) => !prevState);
      }
    } else {
      setMobileMenuActive((prevState) => !prevState);
    }
    event.preventDefault();
  };

  const onSidebarClick = () => {
    menuClick = true;
  };

  const onMenuItemClick = (event) => {
    if (!event.item.items) {
      setOverlayMenuActive(false);
      setMobileMenuActive(false);
    }
  };

  const addClass = (element, className) => {
    if (element.classList) element.classList.add(className);
    else element.className += " " + className;
  };

  const removeClass = (element, className) => {
    if (element.classList) element.classList.remove(className);
    else
      element.className = element.className.replace(
        new RegExp(
          "(^|\\b)" + className.split(" ").join("|") + "(\\b|$)",
          "gi"
        ),
        " "
      );
  };

  const isDesktop = () => {
    return typeof window !== "undefined" ? window.innerWidth > 1024 : false;
  };

  const isSidebarVisible = () => {
    if (isDesktop()) {
      if (layoutMode === "static") return !staticMenuInactive;
      else if (layoutMode === "overlay") return overlayMenuActive;
      else return true;
    }

    return true;
  };

  const logo =
    layoutColorMode === "dark"
      ? "/assets/layout/images/logo.svg"
      : "/assets/layout/images/logo.svg";

  const wrapperClass = classNames("layout-wrapper", {
    "layout-overlay": layoutMode === "overlay",
    "layout-static": layoutMode === "static",
    "layout-static-sidebar-inactive":
      staticMenuInactive && layoutMode === "static",
    "layout-overlay-sidebar-active":
      overlayMenuActive && layoutMode === "overlay",
    "layout-mobile-sidebar-active": mobileMenuActive,
    "p-input-filled": inputStyle === "filled",
    "p-ripple-disabled": ripple === false,
  });

  const sidebarClassName = classNames("layout-sidebar", {
    "layout-sidebar-dark": layoutColorMode === "dark",
    "layout-sidebar-light": layoutColorMode === "light",
  });

  return (
    <div className={wrapperClass} onClick={onWrapperClick}>
      <AppTopbar onToggleMenu={onToggleMenu} />

      <CSSTransition
        classNames="layout-sidebar"
        timeout={{ enter: 200, exit: 200 }}
        in={isSidebarVisible()}
        unmountOnExit
      >
        <div
          ref={sidebar}
          className={sidebarClassName}
          onClick={onSidebarClick}
        >
          <div className="layout-logo">
            <Link href={"/"}>
              <img alt="Logo" src={logo} />
            </Link>
          </div>
          <AppMenu onMenuItemClick={onMenuItemClick} />
        </div>
      </CSSTransition>

      <div className="layout-main">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
