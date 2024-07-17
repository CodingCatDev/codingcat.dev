import { PodcastQueryResult } from "@/sanity.types";
import { podcastQuery, postQuery } from "@/sanity/lib/queries";
import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import toMarkdown from '@sanity/block-content-to-markdown'
import { createClient } from "next-sanity";


const secret = process.env.PRIVATE_SYNDICATE_WEBOOK_SECRET;

const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_WRITE_TOKEN,
  apiVersion: '2022-03-07',
  perspective: 'raw'
});

export async function POST(request: Request) {
  if (!secret)
    return Response.json(
      { success: false, error: "Missing Secret PRIVATE_SYNDICATE_WEBOOK_SECRET" },
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

  try {
    if (created) {
      await formatPodcast(sanityDoc._type, sanityDoc.slug)
    } else if (updated) {
      await formatPodcast(sanityDoc._type, sanityDoc.slug)
    } else {
      await unPublishPodcast(sanityDoc._type, sanityDoc._id, sanityDoc.devto)
    }
  } catch (e) {
    const error = JSON.stringify(e);
    console.error(error);
    Response.json({ success: false, error }, { status: 400 });
  }
  return Response.json({ success: true });
}

const formatPodcast = async (_type: string, slug: string) => {

  const podcast = await sanityQuery(_type, slug);

  if (!podcast?._id) {
    return Response.json({ success: false, error: "Podcast not found" }, { status: 404 });
  }

  console.log('Adding', { slug: podcast?.slug, devto: podcast?.devto });

  try {
    const article: any = {
      article: {
        title: podcast.title,
        published: true,
        tags: ['webdev', 'javascript', 'beginners'],
        main_image: podcast?.coverImage?.secure_url?.replace('upload/', 'upload/b_rgb:5e1186,c_pad,w_1000,h_420/'),
        canonical_url: `https://codingcat.dev/${podcast._type}/${podcast.slug}`,
        description: podcast?.excerpt || '',
        organization_id: '1009',
        body_markdown: `
Original: https://codingcat.dev/${podcast._type}/${podcast.slug}

${podcast?.youtube ? `{% youtube ${podcast?.youtube?.replace('live', 'embed')} %}` : ``}

${toMarkdown(podcast.content, { serializers })}`
      }
    }

    if (_type === 'podcast') {
      article.article.tags.push('podcast');
      article.article.series = `codingcatdev_podcast_${podcast?.season || 4}`;
    }
    console.log("article", JSON.stringify(article, null, 2));

    let response;
    if (podcast?.devto) {
      console.log('updateArticle to devto');
      response = await updateArticle(podcast.devto, article);
      console.log('updateArticle result:', response.status);
    } else {
      console.log('addArticle to devto');
      response = await addArticle(article);
      console.log('addArticle result:', response.status);
    }

    const json = await response.json();
    console.log("result payload", JSON.stringify(json, null, 2));

    // Get new devto url and update
    if (response.status >= 200 && response.status <= 299) {
      if (json?.url && !podcast?.devto) {
        console.log('Article Added to Dev.to', JSON.stringify(json, null, 2));
        await updateSanity(podcast._id, json.url);
        console.log('Sanity Updated', podcast._id, json.url);
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

const unPublishPodcast = async (_type: string, id: string, devto: string) => {
  if (!id) {
    return Response.json({ success: false, error: "Podcast not found" }, { status: 404 });
  }

  console.log('Unpublishing', { _type, id, devto });

  try {

    if (!devto) {
      return Response.json({ success: false, error: "DevTo not found" }, { status: 404 });
    }
    const response = await unpublishArticle(devto);

    // Remove devto from sanity
    if (response.status >= 200 && response.status <= 299) {
      console.log('removed post from devto')
      return Response.json({ success: true }, { status: 200 });
    }
    return Response.json({ success: true }, { status: 200 });
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

const unpublishArticle = async (devto: string) => {
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

const sanityQuery = async (_type: string, slug: string) => {
  const query = _type === 'podcast' ? podcastQuery : postQuery;
  const [podcast] = await Promise.all([
    sanityWriteClient.fetch<PodcastQueryResult>(
      query,
      {
        slug
      },
      {
        stega: false,
        perspective: "raw",
        useCdn: false
      }
    ),
  ]);
  return podcast;
}

// Check base.ts for the custom types
const serializers = {
  types: {
    code: (props: any) => '```' + props?.node?.language + '\n' + props?.node?.code + '\n```',
    "cloudinary.asset": (props: any) => `![](${props?.node?.secure_url})`,
    codepen: (props: any) => `{% codepen ${props?.node?.url} %}`,
    codesandbox: (props: any) => `{% codesandbox ${props?.node?.url?.split('https://codesandbox.io/p/sandbox/')?.at(-1)} %}`,
    twitter: (props: any) => `{% twitter ${props?.node?.id} %}`,
    quote: (props: any) => `> ${toMarkdown(props?.node?.content, { serializers })}`
  }
}