import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";

import "../styles/styles.css";
import "../configureAmplify";
import Link from "next/link";
import "primereact/resources/themes/vela-purple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "../layout/layout.scss";

import { AppTopbar } from "../layout/AppTopbar";

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

  const onRipple = (e) => {
    PrimeReact.ripple = e.value;
    setRipple(e.value);
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

  const menu = [
    { label: "Dashboard", icon: "pi pi-fw pi-home", to: "/" },
    {
      label: "UI Kit",
      icon: "pi pi-fw pi-sitemap",
      items: [
        {
          label: "Form Layout",
          icon: "pi pi-fw pi-id-card",
          to: "/formlayout",
        },
        { label: "Input", icon: "pi pi-fw pi-check-square", to: "/input" },
        {
          label: "Float Label",
          icon: "pi pi-fw pi-bookmark",
          to: "/floatlabel",
        },
        { label: "Button", icon: "pi pi-fw pi-mobile", to: "/button" },
        { label: "Table", icon: "pi pi-fw pi-table", to: "/table" },
        { label: "List", icon: "pi pi-fw pi-list", to: "/list" },
        { label: "Tree", icon: "pi pi-fw pi-share-alt", to: "/tree" },
        { label: "Panel", icon: "pi pi-fw pi-tablet", to: "/panel" },
        { label: "Overlay", icon: "pi pi-fw pi-clone", to: "/overlay" },
        { label: "Menu", icon: "pi pi-fw pi-bars", to: "/menu" },
        { label: "Message", icon: "pi pi-fw pi-comment", to: "/messages" },
        { label: "File", icon: "pi pi-fw pi-file", to: "/file" },
        { label: "Chart", icon: "pi pi-fw pi-chart-bar", to: "/chart" },
        { label: "Misc", icon: "pi pi-fw pi-circle-off", to: "/misc" },
      ],
    },
    {
      label: "Utilities",
      icon: "pi pi-fw pi-globe",
      items: [
        { label: "Display", icon: "pi pi-fw pi-desktop", to: "/display" },
        {
          label: "Elevation",
          icon: "pi pi-fw pi-external-link",
          to: "/elevation",
        },
        { label: "Flexbox", icon: "pi pi-fw pi-directions", to: "/flexbox" },
        { label: "Icons", icon: "pi pi-fw pi-search", to: "/icons" },
        { label: "Grid System", icon: "pi pi-fw pi-th-large", to: "/grid" },
        { label: "Spacing", icon: "pi pi-fw pi-arrow-right", to: "/spacing" },
        {
          label: "Typography",
          icon: "pi pi-fw pi-align-center",
          to: "/typography",
        },
        { label: "Text", icon: "pi pi-fw pi-pencil", to: "/text" },
      ],
    },
    {
      label: "Pages",
      icon: "pi pi-fw pi-clone",
      items: [
        { label: "Crud", icon: "pi pi-fw pi-user-edit", to: "/crud" },
        {
          label: "Calendar",
          icon: "pi pi-fw pi-calendar-plus",
          to: "/calendar",
        },
        { label: "Empty Page", icon: "pi pi-fw pi-circle-off", to: "/empty" },
      ],
    },
    {
      label: "Menu Hierarchy",
      icon: "pi pi-fw pi-search",
      items: [
        {
          label: "Submenu 1",
          icon: "pi pi-fw pi-bookmark",
          items: [
            {
              label: "Submenu 1.1",
              icon: "pi pi-fw pi-bookmark",
              items: [
                { label: "Submenu 1.1.1", icon: "pi pi-fw pi-bookmark" },
                { label: "Submenu 1.1.2", icon: "pi pi-fw pi-bookmark" },
                { label: "Submenu 1.1.3", icon: "pi pi-fw pi-bookmark" },
              ],
            },
            {
              label: "Submenu 1.2",
              icon: "pi pi-fw pi-bookmark",
              items: [
                { label: "Submenu 1.2.1", icon: "pi pi-fw pi-bookmark" },
                { label: "Submenu 1.2.2", icon: "pi pi-fw pi-bookmark" },
              ],
            },
          ],
        },
        {
          label: "Submenu 2",
          icon: "pi pi-fw pi-bookmark",
          items: [
            {
              label: "Submenu 2.1",
              icon: "pi pi-fw pi-bookmark",
              items: [
                { label: "Submenu 2.1.1", icon: "pi pi-fw pi-bookmark" },
                { label: "Submenu 2.1.2", icon: "pi pi-fw pi-bookmark" },
                { label: "Submenu 2.1.3", icon: "pi pi-fw pi-bookmark" },
              ],
            },
            {
              label: "Submenu 2.2",
              icon: "pi pi-fw pi-bookmark",
              items: [
                { label: "Submenu 2.2.1", icon: "pi pi-fw pi-bookmark" },
                { label: "Submenu 2.2.2", icon: "pi pi-fw pi-bookmark" },
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Documentation",
      icon: "pi pi-fw pi-question",
      command: () => {
        window.location = "#/documentation";
      },
    },
    {
      label: "View Source",
      icon: "pi pi-fw pi-search",
      command: () => {
        window.location = "https://github.com/primefaces/sigma-react";
      },
    },
  ];

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
    return window.innerWidth > 1024;
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
      ? "assets/layout/images/logo-white.svg"
      : "assets/layout/images/logo.svg";

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
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
