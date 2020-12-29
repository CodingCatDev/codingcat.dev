import React from 'react';
import Head from 'next/head';

import dynamic from 'next/dynamic';
import { NextRouter, withRouter } from 'next/router';

import { useUser } from '@/utils/auth/useUser';

import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { MainListItems } from '@/layout/ListItems';
import AJPrimary from '@/components/global/icons/AJPrimary';
import Brightness7Icon from '@material-ui/icons/Brightness7';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import AvatarMenu from '@/components/User/AvatarMenu';

const FirebaseAuth = dynamic(() => import('@/components/FirebaseAuth'), {
  ssr: false,
  loading: () => <p>Playing with yarn...</p>,
});

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="https://ajonp.com">
        AJONP LLC
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
    backgroundColor: theme.palette.primary.main,
  },
  icon: {
    height: '2rem',
    width: '2rem',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: 'border-box',
    backgroundColor: theme.palette.primary.light,
    color: 'white',
    borderColor: 'none',
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
}));

const Layout = ({
  router,
  children,
  handleThemeChange,
  darkMode,
}: {
  router: NextRouter;
  children: any;
  handleThemeChange: any;
  darkMode: boolean;
}) => {
  const { user, signout }: { user: any; signout: any } = useUser();

  const theme = useTheme();
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <>
      <Head>
        {/* Material-UI Stuff */}
        <meta name="theme-color" content={theme.palette.primary.main} />
      </Head>
      {user ? (
        <div className={classes.root}>
          <AppBar
            position="absolute"
            className={clsx(classes.appBar, open && classes.appBarShift)}
          >
            <Toolbar className={classes.toolbar}>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                className={clsx(
                  classes.menuButton,
                  open && classes.menuButtonHidden
                )}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                component="h1"
                variant="h6"
                color="inherit"
                noWrap
                className={classes.title}
              >
                {router.query.id || router.query.type || 'Dashboard'}
              </Typography>
              <IconButton color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                color="inherit"
                aria-label="upload picture"
                component="span"
                onClick={() => handleThemeChange()}
              >
                {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
              </IconButton>
              <AvatarMenu />
            </Toolbar>
          </AppBar>
          <Drawer
            variant="permanent"
            classes={{
              paper: clsx(
                classes.drawerPaper,
                !open && classes.drawerPaperClose
              ),
            }}
            open={open}
          >
            <div className={classes.toolbarIcon}>
              CodingCatDev
              <AJPrimary className={`${classes.icon}`} />
              <IconButton onClick={toggleDrawer} style={{ color: 'white' }}>
                <ChevronLeftIcon />
              </IconButton>
            </div>
            <MainListItems />
          </Drawer>
          <main className={classes.content}>
            <div className={classes.appBarSpacer} />
            <Grid
              container
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
            >
              {children}
            </Grid>
            <Box sx={{ pt: 4 }}>
              <Copyright />
            </Box>
          </main>
        </div>
      ) : (
        <div>
          <FirebaseAuth />
        </div>
      )}
    </>
  );
};

export default withRouter(Layout);
