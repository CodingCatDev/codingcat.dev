import { firestore } from './../config/config';
import * as functions from 'firebase-functions';

import { queryAll, querySectionsByCourseId } from '../utilities/notion.server';

export const scheduledNotionToFirestore = functions
  .runWith({
    timeoutSeconds: 540,
  })
  .pubsub.schedule('every 5 minutes')
  .onRun(async () => {
    const courses = await queryAll('course', 10000);

    await courses.results.map(async (q: any) => {
      const courseRef = firestore.collection('courses').doc(q.id);
      await courseRef.set(q, { merge: true });
      const sectionsRaw = await querySectionsByCourseId(q.id, false);
      const sections: any = [];
      for (const s of sectionsRaw.results as any) {
        const lesson = {
          title: `${s?.properties?.lesson_title?.rollup?.array
            ?.at(0)
            ?.title.map((t: any) => t.plain_text)
            .join('')}`,
          _id: s?.properties?.lesson_id?.rollup?.array?.at(0)?.formula?.string,
          id: s?.properties?.lesson_id?.rollup?.array?.at(0)?.formula?.string,
          slug: s?.properties?.lesson_slug?.rollup?.array?.at(0)?.url
            ? s?.properties?.lesson_slug.rollup?.array?.at(0)?.url
            : null,
        };
        const exists = sections.find(
          (e: any) =>
            e.title ===
            `${s?.properties?.title?.title
              .map((t: any) => t.plain_text)
              .join('')}`
        );

        if (exists) {
          exists.lessons.push(lesson);
        } else {
          sections.push({
            ...s,
            title: `${s?.properties?.title?.title
              .map((t: any) => t.plain_text)
              .join('')}`,
            _key: s.id,
            lessons: [lesson],
          });
        }
      }

      for (const section of sections) {
        const sectionRef = courseRef.collection('sections').doc(section.id);
        await sectionRef.set(section, { merge: true });

        for (const lesson of section.lessons) {
          await sectionRef
            .collection('lessons')
            .doc(lesson.id)
            .set(lesson, { merge: true });
        }
      }
    });

    return true;
  });
