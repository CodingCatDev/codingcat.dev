import { PodcastQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { podcastQuery } from "@/sanity/lib/queries";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import toMarkdown from '@sanity/block-content-to-markdown'
import { createClient } from "next-sanity";


const secret = process.env.PRIVATE_SYNDICATE_WEBOOK_SECRET;

const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN
});

export async function POST(request: Request) {
  if (!secret)
    return Response.json(
      { success: false, error: "Missing Secret PRIVATE_ALGOLIA_WEBOOK_SECRET" },
      { status: 400 }
    );

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);

  if (!signature)
    return Response.json(
      { success: false, error: "Missing Signature Header" },
      { status: 401 }
    );

  const body = await request.text();
  if (!(await isValidSignature(body, signature, secret))) {
    return Response.json(
      { success: false, message: "Invalid signature" },
      { status: 400 }
    );
  }

  const sanityDoc = JSON.parse(body);
  const created = sanityDoc.created;
  const deleted = sanityDoc.deleted;
  const updated = sanityDoc.updated;

  delete sanityDoc.created;
  delete sanityDoc.deleted;
  delete sanityDoc.updated;

  try {
    if (created) {
      await formatPodcast(sanityDoc.slug)
    } else if (updated) {
      await formatPodcast(sanityDoc.slug)
    } else {
      await unPublishPodcast(sanityDoc.slug)
    }
  } catch (e) {
    const error = JSON.stringify(e);
    console.error(error);
    Response.json({ success: false, error }, { status: 400 });
  }
  return Response.json({ success: true });
}

const formatPodcast = async (slug: string) => {
  const [podcast] = await Promise.all([
    sanityFetch<PodcastQueryResult>({
      query: podcastQuery,
      params: {
        slug
      },
      stega: false,
      perspective: "raw",
    }),
  ]);

  if (!podcast?._id) {
    return Response.json({ success: false, error: "Podcast not found" }, { status: 404 });
  }

  console.debug('Adding', { slug: podcast?.slug, devto: podcast?.devto });

  try {
    const article = {
      article: {
        title: podcast.title,
        published: true,
        tags: ['podcast', 'webdev', 'javascript', 'beginners'],
        main_image: podcast?.coverImage?.secure_url?.replace('upload/', 'upload/b_rgb:5e1186,c_pad,w_1000,h_420/'),
        canonical_url: `https://codingcat.dev/${podcast._type}/${podcast.slug}`,
        description: podcast?.excerpt || '',
        organization_id: '1009',
        body_markdown: toMarkdown(podcast.content, { serializers })
      }
    }
    console.debug("article", JSON.stringify(article, null, 2));

    let response;
    if (podcast?.devto) {
      console.debug('updateArticle to devto');
      response = await updateArticle(podcast.devto, article);
      console.debug('updateArticle result:', response.status);
    } else {
      console.debug('addArticle to devto');
      response = await addArticle(article);
      console.debug('addArticle result:', response.status);
    }

    // Get new devto url and update
    if (response.status >= 200 && response.status <= 299) {
      const json = await response.json();
      if (json?.url && !podcast?.devto) {
        console.debug('Article Added to Dev.to', JSON.stringify(json, null, 2));
        await updateSanity(podcast._id, json.url);
        console.debug('Sanity Updated', podcast._id, json.url);
      }
    }
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error },
      { status: 500 }
    );
  }
}

const unPublishPodcast = async (slug: string) => {
  const [podcast] = await Promise.all([
    sanityFetch<PodcastQueryResult>({
      query: podcastQuery,
      params: {
        slug
      },
      stega: false,
      perspective: "raw"
    }),
  ]);

  if (!podcast?._id) {
    return Response.json({ success: false, error: "Podcast not found" }, { status: 404 });
  }

  console.debug('Unpublishing', { slug: podcast?.slug, devto: podcast?.devto });

  try {

    if (!podcast?.devto) {
      return Response.json({ success: false, error: "DevTo not found" }, { status: 404 });
    }
    const response = await unpublishArticle(podcast._id, podcast.devto);

    // Get new devto url and update
    if (response.status >= 200 && response.status <= 299) {
      const unpubResponse = await unpublishArticle(podcast._id, podcast.devto);
      if (unpubResponse.status === 204) {
        console.debug('Unpublished Article', podcast._id, podcast.devto);
      }
    }
    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json(
      { success: false, error },
      { status: 500 }
    );
  }
}

const addArticle = async (article: any) => {
  return fetch('https://dev.to/api/articles/', {
    method: 'POST',
    headers: {
      'api-key': process.env.PRIVATE_DEVTO || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(article)
  });
};

const getArticle = async (devto: any) => {
  return fetch(`https://dev.to/api/articles/${devto.split("https://dev.to/").at(-1)}`, {
    method: 'GET',
    headers: {
      'api-key': process.env.PRIVATE_DEVTO || '',
      'Content-Type': 'application/json'
    }
  });
};

const updateArticle = async (devto: string, article: any) => {
  const requestedArticle = await getArticle(devto);
  const json = await requestedArticle.json();
  return fetch(`https://dev.to/api/articles/${json?.id}`, {
    method: 'PUT',
    headers: {
      'api-key': process.env.PRIVATE_DEVTO || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(article)
  });
};

const unpublishArticle = async (_id: string, devto: string) => {
  const requestedArticle = await getArticle(devto);
  const json = await requestedArticle.json();
  return fetch(`https://dev.to/api/articles/${json?.id}/unpublish`, {
    method: 'PUT',
    headers: {
      'api-key': process.env.PRIVATE_DEVTO || '',
      'Content-Type': 'application/json'
    }
  });
};

const updateSanity = async (_id: string, url: string) => {
  return sanityWriteClient.patch(_id).set({ devto: url }).commit();
};

// Check base.ts for the custom types
const serializers = {
  types: {
    code: (props: any) => '```' + props?.node?.language + '\n' + props?.node?.code + '\n```',
    "cloudinary.asset": (props: any) => `![](${props?.node?.secure_url})`,
    codepen: (props: any) => `{% codepen ${props?.node?.url} %}`,
    codesandbox: (props: any) => `{% codesandbox ${props?.node?.url?.split('https://codesandbox.io/p/sandbox/')?.at(-1)} %}`,
    twitter: (props: any) => `{% twitter ${props?.node?.id} %}`
  }
}