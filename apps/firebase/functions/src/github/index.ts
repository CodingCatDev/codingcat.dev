import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Octokit } from 'octokit';
import * as crypto from 'crypto';
import { sendTopic } from '../utilities/pubsub';
import slugify from 'slugify';
// @ts-ignore
import * as matter from 'gray-matter';

const updatetopic = 'GitHubUpdateFirestore';
const webhookupdatetopic = 'GitHubUpdateFirestoreFromWebhook';
const webhookdeletetopic = 'GitHubRemoveFirestoreFromWebhook';
const OWNER = 'codingcatdev';
const REPO = 'v2-codingcat.dev';

// Initialize Firebase admin
admin.initializeApp();

/**
 * Uncomment to test locally
 */
// export const test = functions
// 	.runWith({ secrets: ["GH_TOKEN"] })
// 	.https.onRequest(async (request, response) => {
// 		if (!process.env.GH_TOKEN) {
// 			throw new functions.https.HttpsError(
// 				"failed-precondition",
// 				"Missing GitHub Personal Token"
// 			);
// 		}
// 		try {
// 			await updateContentFromGitHub();
// 		} catch (error) {
// 			throw new functions.https.HttpsError("unknown");
// 		}
// 		response.status(200).send();
// 	});

/**
 * GitHub Webhook for push events
 */
export const webhook = functions
  .runWith({ secrets: ['GH_WEBHOOK_SECRET'] })
  .https.onRequest(async (request, response) => {
    if (!process.env.GH_WEBHOOK_SECRET) {
      response.status(401).send('Missing GitHub Webhook Secret');
      return;
    }
    const method = request.method;

    if (method !== 'POST') {
      throw new functions.https.HttpsError('unimplemented', 'Wrong method');
    }

    const payload = request.body;
    const xHubSignature256 = request.get('X-Hub-Signature-256');

    if (!xHubSignature256) {
      response.status(401).send('Missing xHubSignature256');
      return;
    }

    const sig = Buffer.from(xHubSignature256);
    const hmac = crypto.createHmac('sha256', process.env.GH_WEBHOOK_SECRET);

    const digest = Buffer.from(
      'sha256=' + hmac.update(request.rawBody).digest('hex'),
      'utf8'
    );
    if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Signature of digest did not match'
      );
    }

    functions.logger.debug('gh:payload', payload);

    const owner = payload.repository.owner.name;
    const repo = payload.repository.name;

    //TODO: maybe have more included in secrets array?
    if (owner !== 'CodingCatDev' || repo !== 'v2-codingcat.dev') {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Incorrect Owner/Repo'
      );
    }

    /**
     * Loop through changed files and collect from all commits
     */
    let changed;
    let removed;
    for (const commit of payload.commits) {
      changed = [...commit.added, ...commit.modified];
      removed = [...commit.removed];
    }
    //Remove dups
    changed = [...new Set(changed)];
    removed = [...new Set(removed)];

    /**
     * Send Topic to lookup each files data and update Firestore
     */
    for (const path of changed) {
      const splitPath = path.split('/');
      const content = splitPath.at(0);
      // Skip if this file is not in the content directory
      if (content !== 'content') {
        continue;
      }

      await sendTopic(webhookupdatetopic, { path, owner, repo });
    }
    /**
     * Send Topic to lookup each files data and remove from Firestore
     */
    for (const path of removed) {
      const splitPath = path.split('/');
      const content = splitPath.at(0);
      // Skip if this file is not in the content directory
      if (content !== 'content') {
        continue;
      }

      await sendTopic(webhookdeletetopic, { path });
    }
    response.status(200).send();
  });

/*
 * Adds file data to firestore from GitHub content
 */
export const addItemToFirestoreFromWebhook = functions
  .runWith({ secrets: ['GH_TOKEN'] })
  .pubsub.topic(webhookupdatetopic)
  .onPublish(async (message) => {
    if (!process.env.GH_TOKEN) {
      functions.logger.error('Missing GitHub Personal Token');
      return;
    }
    /** @type {{type: string, content: Object}} payload */
    const payload = JSON.parse(JSON.stringify(message.json));
    functions.logger.debug('payload', payload);

    const { path, owner, repo } = payload;

    const splitPath = path.split('/');
    const type = splitPath.at(1);

    if (!path || !type || !owner || !repo) {
      functions.logger.debug(`Missing Data in Payload`);
      return;
    }

    /**
     * Send Topic for single path object
     */
    const octokit = createOctokit();
    const { data, headers } = await octokit.rest.repos.getContent({
      owner,
      repo,
      path,
    });
    functions.logger.debug(headers['x-ratelimit-remaining']);
    await sendTopic(updatetopic, { type, content: data });
  });

/*
 * Adds file data to firestore from GitHub content
 */
export const removeItemFromFirestoreFromWebhook = functions
  .runWith({ secrets: ['GH_TOKEN'] })
  .pubsub.topic(webhookdeletetopic)
  .onPublish(async (message) => {
    if (!process.env.GH_TOKEN) {
      functions.logger.error('Missing GitHub Personal Token');
      return;
    }
    /** @type {{type: string, content: Object}} payload */
    const payload = JSON.parse(JSON.stringify(message.json));
    functions.logger.debug('payload', payload);

    const { path } = payload;
    const splitPath = path.split('/');
    const type = splitPath.at(1);
    const name = splitPath.at(2);
    const lesson = splitPath.at(3);
    const lessonName = splitPath.at(4);

    if (lesson && lessonName) {
      const ref = admin
        .firestore()
        .collection(type)
        .doc(slugify(name))
        .collection(lesson)
        .doc(slugify(lessonName));
      await ref.delete();
      functions.logger.debug(`removed: ${lessonName}`);
    } else {
      const ref = admin.firestore().collection(type).doc(slugify(name));
      await ref.delete();
      functions.logger.debug(`removed: ${name}`);
    }
  });

/**
 * Allows for authenticated user to run update
 * TODO: only allow admins
 */
export const addContent = functions
  .runWith({ secrets: ['GH_TOKEN'] })
  .https.onCall(async (data, context) => {
    if (!process.env.GH_TOKEN) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Missing GitHub Personal Token'
      );
    }
    // Checking that the user is authenticated.
    if (!context.auth) {
      // Throwing an HttpsError so that the client gets the error details.
      throw new functions.https.HttpsError(
        'failed-precondition',
        'The function must be called while authenticated.'
      );
    }
    try {
      await updateContentFromGitHub();
      functions.logger.info(`Successfully added content for pubsub`);
    } catch (error) {
      functions.logger.error(`Failed to load cron data`);
    }
  });

/**
 * Runs nightly update for GitHub content
 * This checks all content so we might not want this after initial load.
 * TODO: Should this run more/less often?
 */
export const addContentNightly = functions
  .runWith({ secrets: ['GH_TOKEN'] })
  .pubsub.schedule('0 0 * * *')
  .timeZone('America/New_York')
  .onRun(async (context) => {
    if (!process.env.GH_TOKEN) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'Missing GitHub Personal Token'
      );
    }
    try {
      await updateContentFromGitHub();
    } catch (error) {
      throw new functions.https.HttpsError('unknown', 'Unknown Error');
    }
  });

/*
 * Adds file data to firestore from GitHub content
 */
export const addItemToFirestore = functions
  .runWith({ secrets: ['GH_TOKEN'] })
  .pubsub.topic(updatetopic)
  .onPublish(async (message) => {
    if (!process.env.GH_TOKEN) {
      functions.logger.error('Missing GitHub Personal Token');
      return;
    }
    /** @type {{type: string, content: Object}} payload */
    const payload = JSON.parse(JSON.stringify(message.json));
    functions.logger.debug('payload', payload);

    const { content } = payload;
    const { path } = content;

    const splitPath = path.split('/');
    const type = splitPath.at(1);
    const name = splitPath.at(2);
    const lesson = splitPath.at(3);
    const lessonName = splitPath.at(4);
    if (!type) {
      functions.logger.error(`Missing Type for content update.`);
    }

    let ref;
    if (lesson && lessonName) {
      ref = admin
        .firestore()
        .collection(type)
        .doc(slugify(name))
        .collection(lesson)
        .doc(slugify(lessonName));
      await updateDocumentFromGitHub(ref, payload);
    } else {
      ref = admin.firestore().collection(type).doc(createSlug(type, content));
      await updateDocumentFromGitHub(ref, payload);
    }
    /**
     * If this is a course there should be lesson data as well.
     * Only should run when full run, not webhook
     * */
    if (type === 'course' && content.lesson) {
      functions.logger.debug('lesson', content.lesson);
      const lessonSlug = slugify(content.lesson.name);
      const lessonRef = ref.collection('lesson').doc(lessonSlug);
      await updateDocumentFromGitHub(lessonRef, {
        content: content.lesson,
      });
    }
  });

/**
 * Set Octokit instance and return  */
const createOctokit = () => {
  // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
  return new Octokit({
    auth: process.env.GH_TOKEN,
  });
};

const createSlug = (
  type: string,
  content: { name: string; path: string }
): string => {
  let fileSlug = slugify(content.name);
  if (type === 'course') {
    // Get the Folder name of course for uniqueness
    fileSlug = slugify(content.path.split('/').at(-2) || '');
  }
  return fileSlug;
};

/**
 * Returns GitHub's version of content, including encoded file
 * @param {string} path */
const getGitHubContent = async (path: string) => {
  const octokit = createOctokit();
  const { data, headers } = await octokit.rest.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path,
  });
  functions.logger.debug(data);
  functions.logger.debug(
    'x-ratelimit-remaining',
    headers['x-ratelimit-remaining']
  );
  return data;
};

/**
 * Returns GitHub's version of content, including encoded file
 * @param {string} path */
const getGitHubCommit = async (path: string) => {
  const octokit = createOctokit();
  const { data, headers } = await octokit.rest.repos.listCommits({
    owner: OWNER,
    repo: REPO,
    path,
  });
  functions.logger.debug(data);
  functions.logger.debug(
    'x-ratelimit-remaining',
    headers['x-ratelimit-remaining']
  );
  return data;
};

/**
 * Triggers the lookup of content from GitHub
 * and updates Firestore based on latest content
 */
const updateContentFromGitHub = async () => {
  const octokit = createOctokit();

  // Find all the content to send to firestore
  for (const type of [
    'framework',
    'language',
    'page',
    'podcast',
    'post',
    'tutorial',
  ]) {
    const { data, headers }: { data: any; headers: any } =
      await octokit.rest.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: `content/${type}`,
      });
    functions.logger.info(`Found ${data?.length} ${type} to check.`);
    functions.logger.debug(headers['x-ratelimit-remaining']);

    // trigger pubsub to scale this update all at once
    // TODO: recursive for directories
    for (const d of data) {
      await sendTopic(updatetopic, { type, content: d });
    }
  }

  /**
   * Find all Course data
   */
  const {
    data: courseDirs,
    headers: courseDirHeaders,
  }: { data: any; headers: any } = await octokit.rest.repos.getContent({
    owner: OWNER,
    repo: REPO,
    path: `content/course`,
  });
  functions.logger.info(`Found ${courseDirs?.length} courses to check.`);
  functions.logger.debug(courseDirHeaders['x-ratelimit-remaining']);

  // Loop each Course
  for (const course of courseDirs) {
    // Get Course detail from index
    const {
      data: indexFile,
      headers: indexFileHeaders,
    }: { data: any; headers: any } = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: `${course.path}/index.md`,
    });
    functions.logger.debug(`Found index for course to check.`);
    functions.logger.debug(indexFileHeaders['x-ratelimit-remaining']);

    // If there is no course, just bail
    if (!indexFile?.name) {
      continue;
    }

    // Get Course lessons
    const {
      data: lessonFiles,
      headers: lessonFilesHeaders,
    }: { data: any; headers: any } = await octokit.rest.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: `${course.path}/lesson`,
    });
    functions.logger.debug(
      `Found ${lessonFiles?.length} lessons for ${indexFile?.name} to check.`
    );
    functions.logger.debug(lessonFilesHeaders['x-ratelimit-remaining']);

    for (const lesson of lessonFiles) {
      // Send the details for course with each lesson
      await sendTopic(updatetopic, {
        type: 'course',
        content: {
          ...indexFile,
          lesson,
        },
      });
    }
  }
};

/**
 * Gets raw markdown file and updates Firestore
 * @param {admin.firestore.DocumentReference<admin.firestore.DocumentData>} ref
 * @param {any} payload
 * @returns Promise<void>
 */
const updateDocumentFromGitHub = async (
  ref: admin.firestore.DocumentReference<admin.firestore.DocumentData>,
  payload: any
) => {
  // Check if this file already exists
  const doc = await ref.get();

  if (doc.exists) {
    functions.logger.info(`Document already exists, checking sha...`);
    if (doc.data()?.sha == payload?.content?.sha) {
      functions.logger.info(`sha matches no need to continue`);
      return;
    }
  }

  // Get raw file
  const gitHubContent: any = await getGitHubContent(payload.content.path);
  functions.logger.info(
    `${payload.content.path} github file content`,
    gitHubContent
  );

  // Get commit
  const gitHubCommit = await getGitHubCommit(payload.content.path);

  // Convert encoded file
  const bufferObj = Buffer.from(gitHubContent.content, gitHubContent.encoding);
  const decodedFile = bufferObj.toString();
  // Decode markdown and get frontmatter
  const mdObject = matter(decodedFile);

  /**
   * Update Firestore with the github data, frontmatter, and markdown.
   * Flatten the Author data for easier searches
   */
  await ref.set(
    {
      github: {
        content: gitHubContent,
        commit: gitHubCommit,
      },
      content: mdObject.content,
      ...mdObject.data,
      weight: mdObject?.data?.weight ? mdObject?.data?.weight : 0,
      published: mdObject?.data?.published
        ? mdObject?.data?.published
        : 'draft',
      start: mdObject?.data?.start
        ? admin.firestore.Timestamp.fromDate(new Date(mdObject?.data?.start))
        : admin.firestore.Timestamp.fromDate(new Date('Jan 01, 1900')),
    },
    { merge: true }
  );
};
