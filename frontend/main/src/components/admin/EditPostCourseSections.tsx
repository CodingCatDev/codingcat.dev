import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  addCourseSection,
  postHistoryUpdate,
  postsByUpdatedAtObservable,
  postsSearchByTitleObservable,
} from '@/services/api';
import { Post, Section } from '@/models/post.model.ts';
import { take } from 'rxjs/operators';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const arrayMove = require('array-move');

export default function EditPostCourseSections({
  historyInput,
}: {
  historyInput: Post;
}): JSX.Element {
  const [history, setHistory] = useState<Post>();
  const [section, setSection] = useState<Section>();
  const [lessonSearch, setLessonSearch] = useState<string>('');
  const [lessons, setLessons] = useState<Post[]>();

  useEffect(() => {
    setHistory(historyInput);
    postsByUpdatedAtObservable('lesson')
      .pipe(take(1))
      .subscribe((p) => setLessons(p));
  }, [historyInput]);

  const sectionInput = async (e: any) => {
    const title = e.target.value;
    setSection({ ...(section as Section), title });
  };

  const createSection = async () => {
    if (!history || !section) {
      return;
    }
    addCourseSection(history, section)
      .pipe(take(1))
      .subscribe((h) => {
        setHistory(h);
        setSection({ title: '' } as Section);
      });
  };

  const onLessonSearch = (e: any) => {
    const title = e.target.value;
    postsSearchByTitleObservable('lesson', title)
      .pipe(take(1))
      .subscribe((p) => setLessons(p));
    setLessonSearch(title);
  };

  const onLessonDelete = (sectionIndex: number, lessonIndex: number) => {
    if (history?.sections) {
      const section = { ...history.sections[sectionIndex] };
      section.lessons?.splice(lessonIndex, 1);

      const historyUpdate = {
        ...history,
      };
      if (historyUpdate.sections) {
        historyUpdate.sections[sectionIndex] = section;
      }
      setHistory(historyUpdate);
      postHistoryUpdate(historyUpdate);
    }
  };

  const onSectionDelete = (sectionIndex: number) => {
    if (history?.sections) {
      const sections = [...history.sections];
      sections.splice(sectionIndex, 1);

      const historyUpdate = {
        ...history,
      };
      if (historyUpdate.sections) {
        historyUpdate.sections = sections;
      }
      setHistory(historyUpdate);
      postHistoryUpdate(historyUpdate);
    }
  };

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) {
      return;
    }

    if (
      source.droppableId == 'LesssonSearch' &&
      destination.droppableId == 'LesssonSearch'
    ) {
      return;
    }

    if (
      history &&
      history.sections &&
      destination.droppableId &&
      source.droppableId
    ) {
      if (
        source.droppableId == 'Sections' &&
        destination.droppableId == 'Sections'
      ) {
        const sections = history.sections;
        const movedSections = arrayMove(
          sections,
          source.index,
          destination.index
        );
        history.sections = movedSections;
        const historyUpdate = { ...history };
        delete historyUpdate.createdAt; //TODO This was erroring
        postHistoryUpdate(historyUpdate).pipe(take(1)).subscribe();
      } else {
        const start = parseInt(source.droppableId);
        const finish = parseInt(destination.droppableId);

        if (start === finish) {
          const lessons = history.sections[finish].lessons;
          if (lessons && lessons.length > 0) {
            const movedLessons = arrayMove(
              lessons,
              source.index,
              destination.index
            );
            history.sections[finish].lessons = movedLessons;
            const historyUpdate = { ...history };
            delete historyUpdate.createdAt; //TODO This was erroring
            postHistoryUpdate(historyUpdate).pipe(take(1)).subscribe();
          }
        } else {
          const startSection = { ...history.sections[start] };
          const finishSection = { ...history.sections[finish] };

          if (source.droppableId == 'LesssonSearch' && lessons) {
            const selectedLesson = lessons[source.index];
            const selectedSectionLesson = {
              id: selectedLesson.id as string,
              title: selectedLesson.title,
              slug: selectedLesson.slug,
            };
            if (finishSection.lessons?.length) {
              const finishSectionLessons = [...finishSection.lessons];
              finishSectionLessons.splice(
                destination.index,
                0,
                selectedSectionLesson
              );
              finishSection.lessons = finishSectionLessons;
            } else {
              const finishSectionLessons = [selectedSectionLesson];
              finishSection.lessons = finishSectionLessons;
            }
          } else {
            if (startSection.lessons?.length) {
              const startSectionLessons = [...startSection.lessons];
              startSectionLessons.splice(source.index, 1);

              if (finishSection.lessons?.length) {
                const finishSectionLessons = [...finishSection.lessons];
                finishSectionLessons.splice(
                  destination.index,
                  0,
                  startSection.lessons[source.index]
                );
                finishSection.lessons = finishSectionLessons;
              } else {
                const finishSectionLessons = [
                  startSection.lessons[source.index],
                ];
                finishSection.lessons = finishSectionLessons;
              }
              startSection.lessons = startSectionLessons;
            }
          }

          const historyUpdate = {
            ...history,
          };

          if (historyUpdate.sections) {
            historyUpdate.sections[start] = startSection;
            historyUpdate.sections[finish] = finishSection;
          }
          setHistory(historyUpdate);
          postHistoryUpdate(historyUpdate).pipe(take(1)).subscribe();
        }
      }
    }
  };

  return (
    <>
      <div className="grid gap-4">
        <div className="flex items-center p-4 space-x-4 rounded-lg bg-primary-900 dark:bg-primary-900">
          <div className="flex-grow">
            <input
              id="title"
              type="text"
              placeholder="New Section Title"
              value={section?.title}
              className="w-full"
              onChange={(e) => {
                sectionInput(e);
              }}
            />
          </div>
          <button
            className="ml-1 cursor-pointer btn-secondary"
            onClick={() => createSection()}
          >
            Add Section
          </button>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Droppable droppableId={`Sections`} type="Sections">
              {(provided, snapshot) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {history &&
                    history.sections &&
                    history.sections?.map((section, si) => (
                      <Draggable
                        draggableId={`section${si}`}
                        index={si}
                        key={`section${si}`}
                      >
                        {(provided, snapshot) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            className="rounded-lg header bg-secondary-600 dark:bg-secondary-600 text-basics-50 dark:text-basics-50"
                          >
                            <Droppable
                              droppableId={`${si}`}
                              key={`${si}`}
                              type="Lessons"
                            >
                              {(provided, snapshot) => (
                                <div
                                  className="grid grid-flow-row p-2"
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                >
                                  <div className="flex flex-wrap justify-between w-full p-4">
                                    <h2 className="font-sans text-4xl">
                                      {section.title}
                                    </h2>
                                    <button onClick={() => onSectionDelete(si)}>
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        className="w-12"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                        />
                                      </svg>
                                    </button>
                                  </div>
                                  {section &&
                                    section.lessons?.map((lesson, li) => (
                                      <Draggable
                                        draggableId={`${si}${li}`}
                                        index={li}
                                        key={`${si}${li}`}
                                      >
                                        {(provided, snapshot) => (
                                          <div
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            ref={provided.innerRef}
                                            className="flex items-center justify-between p-2 space-x-4 flex-nowrap rounded-xl bg-basics-50 text-basics-900 sections"
                                          >
                                            <Link
                                              href={`/admin/lessons/${lesson.id}`}
                                            >
                                              <a className="text-2xl underline">
                                                {lesson.title}
                                              </a>
                                            </Link>
                                            <button
                                              onClick={() =>
                                                onLessonDelete(si, li)
                                              }
                                            >
                                              <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                className="w-8"
                                              >
                                                <path
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                  strokeWidth={2}
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                />
                                              </svg>
                                            </button>
                                          </div>
                                        )}
                                      </Draggable>
                                    ))}
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        )}
                      </Draggable>
                    ))}
                </div>
              )}
            </Droppable>
            <div className="grid items-start content-start w-full grid-cols-1 row-start-1 gap-4 justify-items-start lg:col-start-2">
              <input
                type="text"
                placeholder="Lesson Search"
                className="w-full"
                value={lessonSearch}
                onChange={(e) => {
                  onLessonSearch(e);
                }}
              />
              <div className="grid grid-cols-1 gap-4">
                <Droppable
                  droppableId={'LesssonSearch'}
                  type="Lessons"
                  isDropDisabled={true}
                >
                  {(provided, snapshot) => (
                    <div
                      style={{ width: '100%', height: '100%' }}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {lessons?.map(
                        (l, i) =>
                          l.id && (
                            <Draggable draggableId={l.id} index={i} key={l.id}>
                              {(provided, snapshot) => (
                                <div
                                  className="flex justify-between w-full px-4 py-2 mt-2 text-2xl truncate rounded-full bg-primary-900 text-basics-50 dark:bg-primary-900 dark:text-basics-50"
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  <p>{l.title}</p>
                                </div>
                              )}
                            </Draggable>
                          )
                      )}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
      <style jsx>{`
        .header + .header,
        .sections + .sections {
          margin-top: 1rem;
        }
      `}</style>
    </>
  );
}
