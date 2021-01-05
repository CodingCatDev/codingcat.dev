import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Button,
  makeStyles,
  Tabs,
  Tab,
  AppBar,
  createStyles,
  Theme as AugmentedTheme,
} from '@material-ui/core';
import { green, grey } from '@material-ui/core/colors';
import matter from 'gray-matter';
import TimeAgo from 'react-timeago';
import {
  postDataObservable,
  postHistoriesDataObservable,
  postHistoryCreate,
  postHistoryPublish,
  postHistoryUpdate,
} from '@/services/api';

import { Post, PostStatus, PostType, MediaType } from '@/models/post.model.ts';
import { Course } from '@/models/course.model.ts';

import { debounce, switchMap, take } from 'rxjs/operators';
import { interval, Subject } from 'rxjs';
import Link from 'next/link';
import ShowMDX from '@/components/ShowMDX';
import PostHistories from '@/components/Admin/PostHistories';
import CourseSections from '@/components/Admin/CourseSections';

import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import CloudinaryUpload from '@/components/Cloudinary/CloudinaryUpload';
import VideoFormModal from '@/components/Admin/VideoFormModal';

import ImageModal from '@/components/Admin/ImageModal';
import VideoModal from '@/components/Admin/VideoModal';
import PublishModal from '@/components/Admin/PublishModal';

enum TabType {
  edit = 'edit',
  sections = 'sections',
  preview = 'preview',
}

const useStyles = makeStyles((theme: AugmentedTheme) =>
  createStyles({
    table: {
      minWidth: 650,
    },
    status: {
      borderRadius: '0.25rem',
      padding: '0.25rem',
    },
    statusPublished: {
      color: green[900],
      backgroundColor: green[400],
    },
    statusDraft: {
      color: grey[900],
      backgroundColor: grey[500],
    },
    link: {
      textDecoration: 'underline',
      cursor: 'pointer',
    },
    tabs: {
      color: 'white',
      backgroundColor: theme.palette.primary.main,
    },
  })
);

export default function EditPost({
  router,
  type,
}: {
  router: any;
  type: PostType;
}) {
  const [postFound, setPostFound] = useState(false);
  const [postHistories, setPostHistories] = useState<Post[] | Course[]>([]);
  const [history, setHistory] = useState<Post | Course>();
  const [, setPost] = useState<Post | Course>();
  const [, setPath] = useState<string>('');
  const [tab, setTab] = useState<TabType>(TabType.edit);
  const [tabIndex, setTabIndex] = useState(0);
  const [saving, setSaving] = useState<boolean>(false);
  const [updateContent$] = useState<Subject<Post | Course>>(
    new Subject<Post | Course>()
  );
  const [preview, setPreview] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);

  // Sets initial state
  useEffect(() => {
    const path = `/posts/${router.query.id}`;
    setPath(path);
    setTab(TabType.edit);
    setTabIndex(0);
    // Set initial post to created
    const postSubscribe = postDataObservable(path)
      .pipe(
        switchMap((post) => {
          setPostFound(true);
          setPost(post);
          return postHistoriesDataObservable(post.id as string);
        })
      )
      .subscribe((histories) => {
        setPostHistories(histories);
        if (histories.length > 0) {
          const dbHistory = histories[0];

          // Most likely this is the first time creation
          // Update the frontmatter with the correct data
          // the database
          if (dbHistory) {
            let title = dbHistory.title || '';
            let excerpt = dbHistory.excerpt || '';
            let slug = dbHistory.slug || '';

            const fm = matter(dbHistory.content || '');
            if (fm && fm.data) {
              if (fm.data.title) {
                title = fm.data.title;
              }
              if (fm.data.excerpt) {
                excerpt = fm.data.excerpt;
              }
              if (fm.data.slug) {
                slug = fm.data.slug;
              }
            }
            const content = matter.stringify(fm.content, {
              title,
              excerpt,
              slug,
            });
            dbHistory.content = content;
            setHistory(dbHistory);
          }
        }
      });

    const contentSubscribe = updateContent$
      .pipe(debounce(() => interval(800)))
      .subscribe((h) => {
        setSaving(true);

        // We need a new version if the last history is published
        if (h?.publishedAt) {
          postHistoryCreate(h)
            .pipe(take(1))
            .subscribe(() => {
              setSaving(false);
            });
        } else {
          postHistoryUpdate(h)
            .pipe(take(1))
            .subscribe(() => setSaving(false));
        }
      });

    return () => {
      postSubscribe.unsubscribe();
      contentSubscribe.unsubscribe();
    };
  }, [router]);

  useEffect(() => {
    if (tab === 'preview') {
      setPreview(history?.content || '');
    } else {
      setPreview('');
    }
  }, [tab]);

  function handleChange(value: string) {
    const content = value;
    try {
      const fm = matter(content);
      if (history) {
        if (fm.data.title) {
          history.title = fm.data.title;
        }
        if (fm.data.excerpt) {
          history.excerpt = fm.data.excerpt;
        }
        if (fm.data.slug) {
          history.slug = fm.data.slug;
        }
      }
    } catch (e) {}
    const update: Post | Course = { ...history, content } as Post | Course;
    setHistory(update);
    updateContent$.next({ ...update, historyId: history?.id });
  }

  function toggleShowHistory() {
    setShowHistory(!showHistory);
  }

  function selectTab(tab: TabType, index: number) {
    setTab(tab);
    setTabIndex(index);
  }

  function onTab() {
    switch (tab) {
      case TabType.sections:
        return <CourseSections historyInput={history as Course} />;
      case TabType.preview:
        return (
          <div
            className={`block h-full w-full sm:text-sm rounded-md rounded-t-none overflow-y-auto`}
          >
            <article className="pt-8 prose prose-purple lg:prose-xl">
              <ShowMDX markdown={preview}></ShowMDX>
            </article>
          </div>
        );
      default:
        return (
          <SimpleMDE
            onChange={handleChange}
            value={history ? history.content : ''}
            options={{
              sideBySideFullscreen: false,
            }}
          />
        );
    }
  }
  const classes = useStyles();

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignContent="flex-start"
        style={{ paddingTop: '0.25rem' }}
      >
        {' '}
        {history && Object.keys(history).length > 0 ? (
          <>
            <Grid
              container
              item
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  bgcolor: 'background.paper',
                  justifyContent: 'space-between',
                }}
                style={{ width: '100%' }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <h1>{history.title}</h1>
                </Box>
                <Box
                  sx={{
                    display: `${showHistory ? 'none' : 'flex'}`,
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'center',
                    flexGrow: 1,
                  }}
                >
                  <Box
                    sx={{
                      marginRight: '0.5rem',
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}
                  >
                    {history.coverVideo ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          minWidth: '300px',
                        }}
                      >
                        <VideoModal post={history} />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: 'grid',
                          gap: '0.5rem',
                        }}
                      >
                        <CloudinaryUpload
                          setHistory={setHistory}
                          history={history}
                          type={MediaType.video}
                        />
                        <VideoFormModal
                          setHistory={setHistory}
                          post={history}
                        />
                      </Box>
                    )}
                  </Box>
                  <Box
                    sx={{
                      marginLeft: '0.5rem',
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'center',
                      alignContent: 'center',
                    }}
                  >
                    {history.coverPhoto ? (
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          minWidth: '300px',
                        }}
                      >
                        <ImageModal post={history} />
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: history.coverPhoto ? 'none' : 'flex',
                        }}
                      >
                        <CloudinaryUpload
                          setHistory={setHistory}
                          history={history}
                          type={MediaType.photo}
                        />
                      </Box>
                    )}
                  </Box>
                </Box>
                <div>
                  <Box sx={{ display: `${showHistory ? 'block' : 'none'}` }}>
                    <Button
                      variant="contained"
                      onClick={() => toggleShowHistory()}
                    >
                      Back
                    </Button>
                  </Box>
                </div>
                <Box
                  sx={{
                    display: `${showHistory ? 'none' : 'flex'}`,
                    flexDirection: 'column',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      m: 1,
                    }}
                  >
                    <span
                      className={`${classes.status} ${
                        history.status === PostStatus.published
                          ? classes.statusPublished
                          : classes.statusDraft
                      }`}
                    >
                      {history.status}
                    </span>

                    <span
                      className={classes.link}
                      onClick={() => toggleShowHistory()}
                    >
                      {history?.id}
                    </span>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      m: 1,
                      flexGrow: 1,
                    }}
                  >
                    <span>
                      <TimeAgo date={history?.updatedAt?.toDate() as Date} />
                    </span>
                    {saving ? (
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-8 h-8"
                          style={{ height: '2rem', width: '2rem' }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                      </span>
                    ) : (
                      <span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-8 h-8 text-green-500"
                          style={{ height: '2rem', width: '2rem' }}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </span>
                    )}
                    <Box sx={{ display: `${showHistory ? 'none' : 'block'}` }}>
                      <PublishModal history={history} setSaving={setSaving} />
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Grid>
            <Grid
              container
              item
              direction="column"
              justifyContent="flex-start"
              alignItems="center"
            >
              {showHistory ? (
                <PostHistories postHistories={postHistories} />
              ) : (
                <>
                  <Box sx={{ width: '100%' }}>
                    <AppBar position="static" color="default">
                      <Tabs
                        value={tabIndex}
                        indicatorColor="secondary"
                        textColor="inherit"
                        variant="fullWidth"
                        aria-label="Editor for Post with Preview"
                        className={classes.tabs}
                      >
                        <Tab
                          label="Edit"
                          onClick={() => selectTab(TabType.edit, 0)}
                        />
                        <Tab
                          label="Sections"
                          onClick={() => selectTab(TabType.sections, 1)}
                          style={{
                            display: `${
                              type === PostType.course ? 'block' : 'none'
                            }`,
                          }}
                        />
                        <Tab
                          label="MDX Preview"
                          onClick={() => selectTab(TabType.preview, 2)}
                        />
                      </Tabs>
                    </AppBar>
                    <Box sx={{ padding: '1rem' }}>{onTab()}</Box>
                  </Box>
                </>
              )}
            </Grid>
          </>
        ) : (
          <div className="grid w-full h-full grid-cols-1 place-content-center place-items-center">
            {postFound ? (
              <div className="pb-8">
                Creating your first history of this post...
              </div>
            ) : (
              <div className="pb-8">
                It appears you have found a page without data.
              </div>
            )}
            <Link href={`/admin/${router.query.type}`}>
              <a>
                <button className="btn-primary">
                  {`Return to ${router.query.type} list.`}
                </button>
              </a>
            </Link>
          </div>
        )}
      </Grid>
    </>
  );
}
