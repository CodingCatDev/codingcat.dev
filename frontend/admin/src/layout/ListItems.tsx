import Link from 'next/link';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import List from '@material-ui/core/List';
import Courses from '@/components/global/icons/nav/Courses';
import Lessons from '@/components/global/icons/nav/Lessons';
import Tutorials from '@/components/global/icons/nav/Tutorials';
import Blog from '@/components/global/icons/nav/Blog';
import Podcasts from '@/components/global/icons/nav/Podcasts';
import Community from '@/components/global/icons/nav/Community';
import { makeStyles } from '@material-ui/core/styles';
import { forwardRef, useMemo } from 'react';

const useStyles = makeStyles((theme) => ({
  icon: {
    height: '2rem',
    width: '2rem',
  },
  dashboard: {
    fill: 'rgb(188, 34, 97)',
  },
}));

export const MainListItems = () => {
  const classes = useStyles();

  return (
    <List>
      <Link href="/" passHref>
        <ListItem button component="a">
          <ListItemIcon>
            <DashboardIcon className={`${classes.icon} ${classes.dashboard}`} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
      </Link>
      <Link href="/admin/courses" passHref>
        <ListItem button component="a">
          <ListItemIcon>
            <Courses className={`${classes.icon}`} />
          </ListItemIcon>
          <ListItemText primary="Courses" />
        </ListItem>
      </Link>
      <Link href="/admin/lessons" passHref>
        <ListItem button component="a">
          <ListItemIcon>
            <Lessons className={`${classes.icon}`} />
          </ListItemIcon>
          <ListItemText primary="Lessons" />
        </ListItem>
      </Link>
      <Link href="/admin/tutorials" passHref>
        <ListItem button component="a">
          <ListItemIcon>
            <Tutorials className={`${classes.icon}`} />
          </ListItemIcon>
          <ListItemText primary="Tutorials" />
        </ListItem>
      </Link>
      <Link href="/admin/blog" passHref>
        <ListItem button component="a">
          <ListItemIcon>
            <Blog className={`${classes.icon}`} />
          </ListItemIcon>
          <ListItemText primary="Blog" />
        </ListItem>
      </Link>
      <Link href="/admin/podcasts" passHref>
        <ListItem button component="a">
          <ListItemIcon>
            <Podcasts className={`${classes.icon}`} />
          </ListItemIcon>
          <ListItemText primary="Podcasts" />
        </ListItem>
      </Link>
      <Link href="/admin/community" passHref>
        <ListItem button component="a">
          <ListItemIcon>
            <Community className={`${classes.icon}`} />
          </ListItemIcon>
          <ListItemText primary="Community" />
        </ListItem>
      </Link>
    </List>
  );
};
