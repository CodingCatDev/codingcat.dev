import React, { useState } from "react";
import Link from "next/link";
import { CSSTransition } from "react-transition-group";
import classNames from "classnames";

const AppSubmenu = (props) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const onMenuItemClick = (event, item, index) => {
    //avoid processing disabled items
    if (item.disabled) {
      event.preventDefault();
      return true;
    }

    //execute command
    if (item.command) {
      item.command({ originalEvent: event, item: item });
    }

    if (index === activeIndex) setActiveIndex(null);
    else setActiveIndex(index);

    if (props.onMenuItemClick) {
      props.onMenuItemClick({
        originalEvent: event,
        item: item,
      });
    }
  };

  const renderLinkContent = (item) => {
    let submenuIcon = item.items && (
      <i className="pi pi-fw pi-angle-down menuitem-toggle-icon"></i>
    );
    let badge = item.badge && (
      <span className="menuitem-badge">{item.badge}</span>
    );

    return (
      <React.Fragment>
        <i className={item.icon}></i>
        <span>{item.label}</span>
        {submenuIcon}
        {badge}
      </React.Fragment>
    );
  };

  const renderLink = (item, i) => {
    let content = renderLinkContent(item);

    if (item.to) {
      return (
        <Link href={item.to}>
          <a>{content}</a>
        </Link>
      );
    } else {
      return (
        <a
          href={item.url}
          onClick={(e) => onMenuItemClick(e, item, i)}
          target={item.target}
        >
          {content}
        </a>
      );
    }
  };

  let items =
    props.items &&
    props.items.map((item, i) => {
      let active = activeIndex === i;
      let styleClass = classNames(item.badgeStyleClass, {
        "active-menuitem": active && !item.to,
      });

      return (
        <li className={styleClass} key={i}>
          {item.items && props.root === true && <div className="arrow"></div>}
          {renderLink(item, i)}
          <CSSTransition
            classNames="p-toggleable-content"
            timeout={{ enter: 1000, exit: 450 }}
            in={active}
            unmountOnExit
          >
            <AppSubmenu
              items={item.items}
              onMenuItemClick={props.onMenuItemClick}
            />
          </CSSTransition>
        </li>
      );
    });

  return items ? <ul className={props.className}>{items}</ul> : null;
};

const menu = [
  { label: "Blog", icon: "pi pi-fw pi-home", to: "/blog/" },
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
];

export const AppMenu = (props) => {
  return (
    <div className="layout-menu-container">
      <AppSubmenu
        items={menu}
        className="layout-menu"
        onMenuItemClick={props.onMenuItemClick}
        root={true}
      />
    </div>
  );
};
