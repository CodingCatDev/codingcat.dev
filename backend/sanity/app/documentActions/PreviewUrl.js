import React from 'react';
import sanityClient from 'part:@sanity/base/client';
const client = sanityClient.withConfig({ apiVersion: `2021-05-19` });

import { Button, Select } from '@sanity/ui';

export function PreviewUrl({ id, type, published, draft }) {
  const doc = draft || published;

  const [isDialogOpen, setDialogOpen] = React.useState(false);
  const [courses, setCourses] = React.useState([]);
  const [selection, setSelection] = React.useState({});
  const [selectedCourse, setSelectedCourse] = React.useState({});

  const url = () => {
    const location = window.location;
    switch (location.host) {
      case 'admin-dev.codingcat.dev':
        return 'https//dev.codingcat.dev';
      case 'admin.codingcat.dev':
        return 'https//codingcat.dev';
      default:
        return 'localhost:3000';
    }
  };
  const navigate = () => {
    if (type === 'lesson') {
      const course = selection.courses.find((c) => c._id === selectedCourse);
      window.open(
        `${url()}/${course.type}/${course.slug}/${selection.type}/${
          selection.slug
        }`,
        '__blank'
      );
    }
  };
  return {
    label: `Open Live Preview`,
    onHandle: () => {
      setCourses([]);
      setSelection({});
      setSelectedCourse({});
      const query = `
      *[_id == $id][0]{
        "type":_type,
        "slug":slug.current,
        "courses": *[ _type == 'course' && $id in sections[].lessons[]._ref ]
        {
          _id,
          title,
          "type": _type,
          "slug":slug.current
        }
      }
      `;
      const params = { id };
      client.fetch(query, params).then((s) => {
        if (type !== 'lesson') {
          window.open(`${url()}/${s.type}/${s.slug}`, '_blank');
        } else {
          setSelection(s);
          console.log(s);
          if (s?.courses && s?.courses.length > 0) {
            for (const [i, course] of s?.courses.entries()) {
              if (i === 0) {
                setSelectedCourse(course._id);
              }
              setCourses((prevCourses) => [...prevCourses, course]);
            }
            setDialogOpen(true);
          } else {
            alert('This lesson has no associated courses.');
          }
        }
      });
    },
    dialog: isDialogOpen && {
      type: 'modal',
      onClose: () => {
        setDialogOpen(false);
      },
      header: 'Choose Course for Lesson',
      content: (
        <>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.currentTarget.value)}
          >
            {courses.map((c) => (
              <option value={c._id}>{c.title}</option>
            ))}
          </Select>
          <Button
            mode="default"
            onClick={() => {
              navigate();
            }}
          >
            Select
          </Button>
        </>
      ),
    },
  };
}
