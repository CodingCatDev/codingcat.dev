import S from '@sanity/desk-tool/structure-builder';
import { CgWebsite } from 'react-icons/cg';
import { FaPodcast, FaYoutube, FaReact } from 'react-icons/fa';
import { FiFeather, FiUsers, FiDollarSign } from 'react-icons/fi';
import { HiOutlineAcademicCap } from 'react-icons/hi';
import { RiPencilRulerLine, RiPagesLine } from 'react-icons/ri';
import { IoLogoHtml5 } from 'react-icons/io5';
import { workflowListItems } from './workflow';

const listItems = [
  // {schema: 'workflow.metadata', title: 'Metadata', icon: FiDatabase},
  { schema: 'course', title: 'Courses', icon: HiOutlineAcademicCap },
  { schema: 'lesson', title: 'Lessons', icon: RiPencilRulerLine },
  { schema: 'page', title: 'Pages', icon: RiPagesLine },
  { schema: 'podcast', title: 'Podcasts', icon: FaPodcast },
  { schema: 'post', title: 'Posts', icon: FiFeather },
  { schema: 'tutorial', title: 'Tutorials', icon: FaYoutube },
];
const adminItems = [
  { schema: 'author', title: 'Authors', icon: FiUsers },
  { schema: 'sponsor', title: 'Sponsors', icon: FiDollarSign },
  { schema: 'site', title: 'Sites', icon: CgWebsite },
  { schema: 'framework', title: 'Frameworks', icon: FaReact },
  { schema: 'language', title: 'Languages', icon: IoLogoHtml5 },
];

const docTypeListItems = listItems.map(({ schema, title, icon }) =>
  S.documentTypeListItem(schema).icon(icon).title(title)
);
const adminListItems = adminItems.map(({ schema, title, icon }) =>
  S.documentTypeListItem(schema).icon(icon).title(title)
);

export default () =>
  S.list()
    .title('Content')
    .items([
      ...workflowListItems,
      S.divider(),
      ...docTypeListItems,
      S.divider(),
      ...adminListItems,
    ]);
