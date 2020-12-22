import { useEffect, useState } from 'react';
import {
  addCourseSection,
  postHistoryUpdate,
  postsByUpdatedAtObservable,
  postsSearchByTitleObservable,
} from '@/services/api';
import { Course, Section } from '@/models/course.model.ts';
import { take } from 'rxjs/operators';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { useCallback } from 'react';
const arrayMove = require('array-move');
import AlgoliaInstantSearch from '@/components/algolia/algoliaInstantSearch';
import { Post } from '@/models/post.model';

export default function CourseSections({
  historyInput,
}: {
  historyInput: Course;
}) {
  const [history, setHistory] = useState<Course>();
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
    setSection({ ...section, title });
  };

  const createSection = async () => {
    if (!history || !section) {
      return;
    }
    addCourseSection(history, section)
      .pipe(take(1))
      .subscribe((h) => {
        setHistory(h);
        setSection({ title: '' });
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
        postHistoryUpdate(historyUpdate);
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
            postHistoryUpdate(historyUpdate);
          }
        } else {
          const startSection = { ...history.sections[start] };
          const finishSection = { ...history.sections[finish] };

          if (source.droppableId == 'LesssonSearch' && lessons) {
            const selectedLesson = lessons[source.index];
            const selectedSectionLesson = {
              id: selectedLesson.id as string,
              title: selectedLesson.title,
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
          postHistoryUpdate(historyUpdate);
        }
      }
    }
  };

  return (
    <>
      <div className="grid gap-5 mx-8 grid-col-1">
        <div className="grid grid-flow-col">
          <div className="flex flex-col pr-2">
            <label
              className="block mb-2 text-sm font-bold leading-5"
              htmlFor="username"
            >
              Section Name
            </label>
            <div className="flex">
              <input
                className="w-full px-3 py-2 border rounded shadow-sm appearance-none text-grey-darker"
                id="title"
                type="title"
                required
                value={section?.title}
                onChange={(e) => {
                  sectionInput(e);
                }}
              />
              <button
                className="cursor-pointer btn-primary"
                onClick={() => createSection()}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-5">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="col-span-6">
              <Droppable droppableId={`Sections`} type="Sections">
                {(provided, snapshot) => (
                  <div
                    className="grid grid-flow-row gap-2"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
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
                            >
                              <Droppable
                                droppableId={`${si}`}
                                key={`${si}`}
                                type="Lessons"
                              >
                                {(provided, snapshot) => (
                                  <div
                                    className={`grid grid-flow-row gap-2 p-4 rounded-lg ${
                                      snapshot.isDraggingOver
                                        ? 'bg-red-200'
                                        : 'bg-red-400'
                                    }`}
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                  >
                                    <div className="flex items-center justify-between border-b-2 border-purple-900 border-solid">
                                      {section.title}
                                      <button
                                        onClick={() => onSectionDelete(si)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                          className="w-6 h-6 m-2 transform hover:rotate-12 hover:text-red-900"
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
                                              className={`px-4 rounded-lg flex justify-between items-center  ${
                                                snapshot.isDragging
                                                  ? 'text-purple-400 bg-purple-200'
                                                  : 'text-white  bg-purple-400'
                                              }`}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              ref={provided.innerRef}
                                            >
                                              {lesson.title}
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
                                                  className="w-6 h-6 m-2 transform hover:rotate-12 hover:text-red-900"
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
            </div>
            <div className="grid grid-cols-1 col-span-6 gap-2 p-1 bg-gray-100 place-content-start">
              <div className="flex flex-col pr-2">
                <label
                  className="block mb-2 text-sm font-bold leading-5"
                  htmlFor="username"
                >
                  Lessons
                </label>
                <div className="flex">
                  <input
                    className="w-full p-1 border rounded shadow-sm appearance-none text-grey-darker"
                    placeholder="Lesson Search"
                    id="title"
                    type="title"
                    required
                    value={lessonSearch}
                    onChange={(e) => {
                      onLessonSearch(e);
                    }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1 place-content-start">
                <Droppable
                  droppableId={'LesssonSearch'}
                  type="Lessons"
                  isDropDisabled={true}
                >
                  {(provided, snapshot) => (
                    <div
                      className={`grid grid-flow-row gap-2 p-4 rounded-lg`}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {lessons?.map(
                        (l, i) =>
                          l.id && (
                            <Draggable draggableId={l.id} index={i} key={l.id}>
                              {(provided, snapshot) => (
                                <div
                                  className={`px-4 rounded-lg  ${
                                    snapshot.isDragging
                                      ? 'text-purple-400 bg-purple-200'
                                      : 'text-white  bg-purple-400'
                                  }`}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  ref={provided.innerRef}
                                >
                                  {l.title}
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
          </DragDropContext>
        </div>
      </div>
    </>
  );
}
