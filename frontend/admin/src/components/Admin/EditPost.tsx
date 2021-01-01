import React, { useState, ComponentType, useEffect, useRef } from 'react';
import {
  Box,
  Chip,
  Grid,
  Button,
  makeStyles,
  Tabs,
  Tab,
  AppBar,
  createStyles,
  Theme as AugmentedTheme,
} from '@material-ui/core';
import { green, grey, purple, pink } from '@material-ui/core/colors';

import TimeAgo from 'react-timeago';
import {
  getCloudinaryCookieToken,
  postDataObservable,
  postHistoriesDataObservable,
  postHistoryCreate,
  postHistoryDataObservable,
  postHistoryPublish,
  postHistoryUpdate,
  postUpdate,
} from '@/services/api';
import firebase from 'firebase/app';

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
import Player from '@/components/global/video/Player';
import CloudinaryUpload from '@/components/Cloudinary/CloudinaryUpload';

import videojs from 'video.js';
import 'videojs-youtube';
import 'video.js/dist/video-js.css';

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
  const [post, setPost] = useState<Post | Course>();
  const [path, setPath] = useState<string>('');
  const [tab, setTab] = useState<TabType>(TabType.edit);
  const [tabIndex, setTabIndex] = useState(0);
  const [saving, setSaving] = useState<boolean>(false);
  const [updateContent$, setUpdateContent$] = useState<Subject<Post | Course>>(
    new Subject<Post | Course>()
  );
  const [preview, setPreview] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);

  const [player, setPlayer] = useState<any>();
  const [playerOptions, setPlayerOptions] = useState<object>({});
  const videoEl = useRef<any>();

  useEffect(() => {
    if (history && history.coverVideo && history.coverVideo.public_id) {
      getCloudinaryCookieToken()
        .pipe(take(1))
        .subscribe((cookieToken) => {
          var now = new Date();
          var time = now.getTime();
          time += 3600 * 1000;
          now.setTime(time);
          document.cookie = `${cookieToken}; domain=.codingcat.dev; expires=${now.toISOString()}; path=/`;

          // Example that works
          // document.cookie = '__cld_token__=exp=1609523857~acl=*%2fccd-cloudinary%2fvideos%2f*~hmac=e6fbd91e8115245c2af22f38930c060d397a6a820ee844a880f9f3e8b2336b53; domain=.codingcat.dev;expires=Thu, 18 Dec 2025 12:00:00 UTC; path=/';

          setPlayerOptions({
            autoplay: false,
            controls: true,
            fluid: true,
            sources: [
              // {
              //   src: `https://media.codingcat.dev/video/private/v1/${history.coverVideo?.public_id}.m3u8?${cookieToken}`,
              //   type: 'application/x-mpegURL',
              // },
              {
                src: `https://media.codingcat.dev/video/private/v1/${history.coverVideo?.public_id}.webm`,
                type: 'video/webm',
              },
              {
                src: `https://media.codingcat.dev/video/private/v1/${history.coverVideo?.public_id}.mp4`,
                type: 'video/mp4',
              },
            ],
          });
        });
    }
    return () => {};
  }, [history]);

  // Sets initial state
  useEffect(() => {
    const path = `/posts/${router.query.id}`;
    setPath(path);

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
          setHistory(histories[0]);
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
            .subscribe((u) => {
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

  useEffect(() => {
    if (videoEl.current == null) return;
    setPlayer(videojs(videoEl.current, playerOptions));
    return () => {
      if (player) player.dispose();
    };
  }, [playerOptions]);

  function handleChange(value: string) {
    const content = value;
    const update: Post | Course = { ...history, content } as Post | Course;
    setHistory(update);
    updateContent$.next({ ...update, historyId: history?.id });
  }

  function toggleShowHistory() {
    setShowHistory(!showHistory);
  }

  function onPublish() {
    if (history) {
      setSaving(true);
      postHistoryPublish(history)
        .pipe(take(1))
        .subscribe(() => setSaving(false));
    }
  }
  function selectTab(tab: TabType, index: number) {
    setTab(tab);
    setTabIndex(index);
  }

  async function onVideoDelete() {
    if (history) {
      if (history.publishedAt) {
        postHistoryCreate(history)
          .pipe(take(1))
          .subscribe((h) =>
            postHistoryUpdate({
              ...h,
              coverVideo: firebase.firestore.FieldValue.delete() as any,
            })
              .pipe(take(1))
              .subscribe((newHistory) => setHistory(newHistory))
          );
      } else {
        postHistoryUpdate({
          ...history,
          coverVideo: firebase.firestore.FieldValue.delete() as any,
        })
          .pipe(take(1))
          .subscribe((newHistory) => setHistory(newHistory));
      }
    }
  }
  async function onImageDelete() {
    if (history) {
      if (history && history.publishedAt) {
        postHistoryCreate(history)
          .pipe(take(1))
          .subscribe((h) =>
            postHistoryUpdate({
              ...h,
              coverPhoto: firebase.firestore.FieldValue.delete() as any,
            })
              .pipe(take(1))
              .subscribe((newHistory) => setHistory(newHistory))
          );
      } else {
        postHistoryUpdate({
          ...history,
          coverPhoto: firebase.firestore.FieldValue.delete() as any,
        })
          .pipe(take(1))
          .subscribe((newHistory) => setHistory(newHistory));
      }
    }
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
                  </Box>
                  <Box sx={{ display: `${showHistory ? 'none' : 'block'}` }}>
                    <Button variant="contained" onClick={() => onPublish()}>
                      Publish
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        style={{
                          height: '1.5rem',
                          width: '1.5rem',
                          marginLeft: '1rem',
                        }}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                        />
                      </svg>
                    </Button>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
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
                    <Box
                      sx={{
                        display: history.coverVideo ? 'flex' : 'none',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        minWidth: '300px',
                      }}
                    >
                      <>
                        <div data-vjs-player>
                          <video
                            ref={videoEl}
                            className="video-js"
                            playsInline
                          />
                        </div>
                      </>
                      <Chip
                        label="Cover Video"
                        onDelete={() => onVideoDelete()}
                        color="default"
                      />
                    </Box>
                    <Box
                      sx={{
                        display: history.coverVideo ? 'none' : 'flex',
                      }}
                    >
                      <CloudinaryUpload
                        setHistory={setHistory}
                        history={history}
                        type={MediaType.video}
                      />
                    </Box>
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
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            minWidth: '300px',
                          }}
                        >
                          <img
                            src={history.coverPhoto?.thumbnail_url}
                            height="100%"
                            width="100%"
                          />
                          <Chip
                            label="Cover Image"
                            onDelete={() => onImageDelete()}
                            color="default"
                          />
                        </Box>
                      </Box>
                    ) : (
                      <CloudinaryUpload
                        setHistory={setHistory}
                        history={history}
                        type={MediaType.photo}
                      />
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
