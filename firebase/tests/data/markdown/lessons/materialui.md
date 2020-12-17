---
title: 'MaterialUI'
date: '2019-08-28'
---

https://youtu.be/XfOaUonBTsk?t=1979

> You must have [Node](https://nodejs.org/en/download/) installed so you can leverage npm.  
> This module is part of a series if you would like to start from here please execute

```
git clone https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs.git && cd ajonp-ajsbooks-nextjs && git checkout 02-Setup && npm i && code .
```

> If you notice any issues please submit a [pull request](https://github.com/AJONPLLC/ajonp-ajsbooks-nextjs/pulls)

# Next.js with Material-UI

There are a couple of updates that you will make to your project structure in order to make using Material-UI the most performant within your Next.js project.I used the officially referenced [MaterialUI Example Next.js Project](https://github.com/mui-org/material-ui/tree/master/examples/nextjs). They have been keeping the [repo](https://github.com/mui-org/material-ui/tree/master/examples/nextjs) updated very well with the new updates coming from Next.js.

## Components Directory[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-materialui#components-directory)

You will create a new folder that will be used for all of your independent components. This includes the main structure for your app in `MenuAppBar.tsx`. Later will will continue to add the rest of your React Components to this directory.

```
mkdir components
```

## Theme Directory[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-materialui#theme-directory)

This is slightly different than the layout of the official example, however I didn't like have so many folders called source. So you will add the main theme for MaterialUI into a new directory called `themes`.

```
mkdir themes
```

There are multiple ways to theme your entire website, if you are more familiar with other methods then do what is comfortable for you! For me being brand new with [MaterialUI](https://material-ui.com/customization/themes/#themes) I decided to continue with the example repo and use this method.Now you can add a new file to the `themes` directory called `theme.tsx`.themes/theme.tsx

```
import red from '@material-ui/core/colors/red'; import { createMuiTheme } from '@material-ui/core/styles'; // Create a theme instance. const theme = createMuiTheme({ palette: { primary: { main: '#556cd6' }, secondary: { main: '#19857b' }, error: { main: red.A400 }, background: { default: '#fff' } } }); export default theme;
```

## Custom \_app.tsx for MaterialUI[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-materialui#custom-_apptsx-for-materialui)

Per the [Next.js App docs](https://nextjs.org/docs#custom-app).

> Next.js uses the App component to initialize pages. You can override it and control the page initialization. Which allows youto do amazing things like:
>
> To override, create the `./pages/_app.js`

- Persisting layout between page changes
- Keeping state when navigating pages
- Custom error handling using componentDidCatch
- Inject additional data into pages (for example by processing GraphQL queries)

It is for persisting the layout that you are going to create the `_app.tsx` file. This will allow things like your theme and `MenuAppBar` to not require rerender.

pages/\_app.tsx

```
import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/styles';
import App, { Container } from 'next/app';
import Head from 'next/head'; import React from 'react';
import MenuAppBar from '../components/MenuAppBar';
import theme from '../themes/theme';

class MyApp extends App {

    componentDidMount() {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles && jssStyles.parentNode) {
            jssStyles.parentNode.removeChild(jssStyles);
        }
    }

    render() {
        const { Component, pageProps } = this.props;
        return (
            <Container>
                <Head><title>AJ' Books</title> </Head>
                <ThemeProvider theme={theme}>
                <CssBaseline />
                <MenuAppBar />
                <Component { ...pageProps } />
                </ThemeProvider>
            </Container >
        );
    }
}

export default MyApp;
```

## Custom \_document.tsx for MaterialUI[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-materialui#custom-_documenttsx-for-materialui)

Per the [Next.js Document docs](https://nextjs.org/docs#custom-document).

> A custom is commonly used to augment your application's `<html>` and `<body>` tags. This is necessary because Next.js pages skip the definition of the surrounding document's markup.
>
> This allows you to support Server-Side Rendering for CSS-in-JS libraries like styled-components or emotion. Note, styled-jsx is included in Next.js by default.
>
> A custom `<Document>` can also include getInitialProps for expressing asynchronous server-rendering data requirements.

This again works great while using MaterialUI, because it will allow us to pass along the styles for your themes through props, anywhere in your application.

pages/\_document.tsx

```
/* https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_document.js */

import React from "react";
import Document, { Head, Main, NextScript } from "next/document";
import { ServerStyleSheets } from "@material-ui/styles";
import theme from "../themes/theme";

class MyDocument extends Document {
  render() {
    return (
      <html lang="en">
        <Head>
          {" "}
          <meta charSet="utf-8" />
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no"
          />
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>{" "}
        <body>
          {" "}
          <Main /> <NextScript />{" "}
        </body>{" "}
      </html>
    );
  }
}
MyDocument.getInitialProps = async ctx => {
  // Resolution order //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;
  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: App => props => sheets.collect(<App {...props} />)
    });
  const initialProps = await Document.getInitialProps(ctx);
  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      <React.Fragment key="styles">
        {" "}
        {initialProps.styles} {sheets.getStyleElement()}{" "}
      </React.Fragment>
    ]
  };
};

export default MyDocument;

```

## Add MenuAppBar Component[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-materialui#add-menuappbar-component)

The [App Bar Component](https://material-ui.com/components/app-bar/) threw me off at first as I expected it under navigation, but it really does belong in the surfaces section. Because you are making a fairly complex version of an App Bar I broke this out into its own component. Your MenuAppBar component has several dependencies that you are going to use so it made sense to group them.

![](https://codingcat.dev/wp-content/uploads/2020/09/image-51.png)

![Menu App Bar Preview](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/4-navigation/Screen_Shot_2019-08-28_at_4.54.09_PM.png)

### Key MaterialUI Components[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-materialui#key-materialui-components)

- App Bar: [https://material-ui.com/api/app-bar/](https://material-ui.com/api/app-bar/)
- Button: [https://material-ui.com/api/button/](https://material-ui.com/api/button/)
- Icon Button: [https://material-ui.com/api/icon-button/](https://material-ui.com/api/icon-button/)
- Menu: [https://material-ui.com/api/menu/](https://material-ui.com/api/menu/)
- MenuItem: [https://material-ui.com/api/menu-item/](https://material-ui.com/api/menu-item/)
- Styles: [https://material-ui.com/styles/api/#api](https://material-ui.com/styles/api/#api)
- ToolBar: [https://material-ui.com/api/toolbar/#toolbar-api](https://material-ui.com/api/toolbar/#toolbar-api)
- Typography: [https://material-ui.com/api/typography/#typography-api](https://material-ui.com/api/typography/#typography-api)
- Icons: [https://material-ui.com/api/icon/](https://material-ui.com/api/icon/)
- MenuIcon: [https://material-ui.com/components/drawers/#persistent-drawer](https://material-ui.com/components/drawers/#persistent-drawer)

### Full Code[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-materialui#full-code)

/components/MenuAppBar.tsx

```
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { flexGrow: 1 },
    menuButton: { marginRight: theme.spacing(2) },
    title: { flexGrow: 1 }
  })
);
function MenuAppBar() {
  const classes = useStyles();
  const [auth] = React.useState(false);
  const [anchorEl, setAnchorEl] =
    (React.useState < null) | (HTMLElement > null);
  const open = Boolean(anchorEl);
  function handleMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget);
  }
  function handleClose() {
    setAnchorEl(null);
  }
  return (
    <div className={classes.root}>
      {" "}
      <AppBar position="static">
        {" "}
        <Toolbar>
          {" "}
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="Menu"
          >
            {" "}
            <MenuIcon />{" "}
          </IconButton>{" "}
          <Typography variant="h6" className={classes.title}>
            {" "}
            Photos{" "}
          </Typography>{" "}
          {auth && (
            <div>
              {" "}
              <IconButton
                aria-owns={open ? "menu-appbar" : undefined}
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                {" "}
                <AccountCircle />{" "}
              </IconButton>{" "}
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={open}
                onClose={handleClose}
              >
                {" "}
                <MenuItem onClick={handleClose}>Profile</MenuItem>{" "}
                <MenuItem onClick={handleClose}>My account</MenuItem>{" "}
              </Menu>{" "}
            </div>
          )}{" "}
          {!auth && (
            <div>
              {" "}
              <Button color="inherit">Sign In</Button>{" "}
            </div>
          )}{" "}
        </Toolbar>{" "}
      </AppBar>{" "}
    </div>
  );
}
export default MenuAppBar;

```

## Update Index Page[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-materialui#update-index-page)

You can see in the below file that you are keeping it very simple for your initial update, you will only us the [Container](https://material-ui.com/components/container/) component.pages/index.tsx

```
import Container from "@material-ui/core/Container";
import React from "react";

export default function App() {
  return <Container maxWidth="lg">Hello Next.js ????</Container>;
}

```

## Use React Dev tools[](https://codingcat.dev/courses/nextjs9/nextjs-using-materialui-and-firebase-materialui#use-react-dev-tools)

If you are new to ReactJS (like myself), I would recommend installing [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en) for Chrome.Here you can inspect the layout of your full application. If you take a look

![React Dev Tools](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/f8mmv34ulizhtxmknbpx.png)

As you highlight components you can see the Props that are passed through them, highlight `ThemeProvider` this is where much of the theming for MaterialUI will come from in the updates will will continue to make in your app.

![MaterialUI ThemeProvider](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/cnhji8alguos2tt3rnzz.png)

# Run Next.js Development server

```
npm run dev
```

Open your browser at [http://localhost:3000](http://localhost:3000/) (your port may differ).

![Next.js Hello](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/oy53wlavfbw3efhdqrpf.png)

You should also notice the lightning bolt showing the prerender page, showing the dev server running.

![Next.js Lightning Bolt](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/20-lesson-nextjs/ri4rbjbtykjhrysscyw2.png)

> If you get to the end and something is broken just grab the full branch

```
git checkout 03-MaterialUI -f && npm i
```
