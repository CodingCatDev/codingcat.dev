import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Box,
  Grid,
  Button,
  IconButton,
  makeStyles,
  Tabs,
  Tab,
  AppBar,
  createStyles,
  Theme as AugmentedTheme,
  TextField,
} from '@material-ui/core';
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
const arrayMove = require('array-move');
import { Post } from '@/models/post.model';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme: AugmentedTheme) =>
  createStyles({
    sectionDeleteIcon: {
      height: '2rem',
      width: '2rem',
      '&:hover': {
        color: 'red',
      },
    },
    section: {
      backgroundColor: theme.palette.secondary.main,
      padding: '1rem',
      marginTop: '0.5rem',
      borderRadius: '0.75rem',
    },
    sectionDragging: {
      backgroundColor: theme.palette.secondary.light,
      color: theme.palette.secondary.main,
      padding: '1rem',
      marginTop: '0.5rem',
      borderRadius: '0.75rem',
    },
    lesson: {
      color: 'white',
      backgroundColor: theme.palette.primary.main,
      paddingLeft: '1rem',
      borderRadius: '0.75rem',
    },
    lessonDeleteIcon: {
      height: '1.5rem',
      width: '1.5rem',
      color: 'white',
      '&:hover': {
        color: 'red',
      },
    },
    lessonTitle: {
      color: 'white',
    },
  })
);

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
              permalink: selectedLesson.permalink,
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

  const classes = useStyles();

  return (
    <>
      <Grid container direction="row" style={{ paddingTop: '0.25rem' }}>
        <Grid
          container
          item
          direction="column"
          justifyContent="center"
          alignContent="flex-start"
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              paddingLeft: '1rem',
              paddingRight: '1rem',
            }}
          >
            <Box sx={{ flexGrow: 1, marginRight: '1rem' }}>
              <TextField
                label="Section Name"
                id="title"
                type="title"
                value={section?.title}
                fullWidth
                variant="filled"
                onChange={(e) => {
                  sectionInput(e);
                }}
              />
            </Box>
            <Button
              variant="contained"
              className="cursor-pointer btn-primary"
              onClick={() => createSection()}
            >
              Add Section
            </Button>
          </Box>
        </Grid>
        <DragDropContext onDragEnd={onDragEnd}>
          <Grid
            container
            direction="row"
            justifyContent="flex-start"
            alignContent="flex-start"
            style={{ paddingTop: '0.25rem' }}
          >
            <div style={{ width: '60%', marginRight: '1rem' }}>
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
                            >
                              <Droppable
                                droppableId={`${si}`}
                                key={`${si}`}
                                type="Lessons"
                              >
                                {(provided, snapshot) => (
                                  <Grid
                                    container
                                    item
                                    direction="row"
                                    className={
                                      snapshot.isDraggingOver
                                        ? classes.sectionDragging
                                        : classes.section
                                    }
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                  >
                                    <Box
                                      sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        flexWrap: 'wrap',
                                        justifyContent: 'space-between',
                                      }}
                                      style={{ width: '100%' }}
                                    >
                                      <h2>{section.title}</h2>
                                      <IconButton
                                        onClick={() => onSectionDelete(si)}
                                      >
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                          className={classes.sectionDeleteIcon}
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                          />
                                        </svg>
                                      </IconButton>
                                    </Box>
                                    {section &&
                                      section.lessons?.map((lesson, li) => (
                                        <Draggable
                                          draggableId={`${si}${li}`}
                                          index={li}
                                          key={`${si}${li}`}
                                        >
                                          {(provided, snapshot) => (
                                            <Box
                                              sx={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                flexWrap: 'wrap',
                                                justifyContent: 'space-between',
                                                width: '100%',
                                                marginTop: '0.5rem',
                                              }}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              ref={provided.innerRef}
                                              className={classes.lesson}
                                            >
                                              <Link
                                                href={`/admin/lessons/${lesson.id}`}
                                              >
                                                <a>
                                                  <h3
                                                    className={
                                                      classes.lessonTitle
                                                    }
                                                  >
                                                    {lesson.title}
                                                  </h3>
                                                </a>
                                              </Link>
                                              <IconButton
                                                onClick={() =>
                                                  onLessonDelete(si, li)
                                                }
                                              >
                                                <svg
                                                  xmlns="http://www.w3.org/2000/svg"
                                                  fill="none"
                                                  viewBox="0 0 24 24"
                                                  stroke="currentColor"
                                                  className={
                                                    classes.lessonDeleteIcon
                                                  }
                                                >
                                                  <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                  />
                                                </svg>
                                              </IconButton>
                                            </Box>
                                          )}
                                        </Draggable>
                                      ))}
                                    {provided.placeholder}
                                  </Grid>
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
            <div style={{ width: '35%' }}>
              <Grid
                item
                container
                direction="row"
                justifyContent="center"
                alignContent="flex-start"
                style={{ paddingTop: '0.25rem' }}
              >
                {' '}
                <TextField
                  label="Lesson Search"
                  placeholder="Lesson Search"
                  fullWidth
                  variant="filled"
                  value={lessonSearch}
                  onChange={(e) => {
                    onLessonSearch(e);
                  }}
                />
                <Grid
                  item
                  container
                  direction="column"
                  style={{ paddingTop: '0.25rem' }}
                >
                  {' '}
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
                              <Draggable
                                draggableId={l.id}
                                index={i}
                                key={l.id}
                              >
                                {(provided, snapshot) => (
                                  <Box
                                    sx={{
                                      display: 'flex',
                                      flexDirection: 'row',
                                      flexWrap: 'wrap',
                                      justifyContent: 'space-between',
                                      width: '100%',
                                      marginTop: '0.5rem',
                                    }}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    ref={provided.innerRef}
                                    className={classes.lesson}
                                  >
                                    <h3>{l.title}</h3>
                                  </Box>
                                )}
                              </Draggable>
                            )
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Grid>
              </Grid>
            </div>
          </Grid>
        </DragDropContext>
      </Grid>
    </>
  );
}
