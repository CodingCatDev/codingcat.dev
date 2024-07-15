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

  delete sanityDoc.created;
  delete sanityDoc.deleted;
  delete sanityDoc.updated;

  try {
    if (created) {
      await formatPodcast(sanityDoc._type, sanityDoc.slug)
    } else if (updated) {
      await formatPodcast(sanityDoc._type, sanityDoc.slug)
    } else {
      await unPublishPodcast(sanityDoc._type, sanityDoc._id, sanityDoc.hashnode)
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

  console.debug('Adding', { slug: podcast?.slug, hashnode: podcast?.hashnode });

  try {
    const article: any = {
      title: podcast.title,
      subtitle: podcast?.excerpt?.length && podcast?.excerpt?.length > 250 ? podcast?.excerpt?.substring(0, 247) + "..." : podcast?.excerpt || '',
      publicationId: '60242f8180da6c44eadf775b',
      slug: `${podcast._type}-${podcast.slug}`,
      tags: [
        {
          id: '56744721958ef13879b94cad',
          name: 'JavaScript',
          slug: 'javascript'
        },
        {
          id: '56744722958ef13879b94f1b',
          name: 'Web Development',
          slug: 'web-development'
        },
        {
          id: '56744723958ef13879b955a9',
          name: 'Beginner Developers',
          slug: 'beginners'
        }
      ],
      coverImageOptions: {
        coverImageURL: podcast?.coverImage?.secure_url,
      },
      originalArticleURL: `https://codingcat.dev/${podcast._type}/${podcast.slug}`,
      contentMarkdown: `
Original: https://codingcat.dev/${podcast._type}/${podcast.slug}

${podcast?.youtube ? '%[' + podcast?.youtube?.replace('live', 'embed') + ']' : ''}

${toMarkdown(podcast.content, { serializers })}`
    }

    if (_type === 'podcast') {
      article.tags.push({
        id: '56744722958ef13879b950d3',
        name: 'podcast',
        slug: 'podcast'
      });
      article.seriesId = '65a9ad4ef60adbf4aeedd0a2';
    }
    console.debug("article", JSON.stringify(article, null, 2));

    let response;
    if (podcast?.hashnode) {
      console.debug('updateArticle to hashnode');
      response = await updateArticle(podcast.hashnode, article);
      console.debug('updateArticle result:', response.status);
    } else {
      console.debug('addArticle to hashnode');
      response = await addArticle(article);
      console.debug('addArticle result:', response.status);
    }

    const json = await response.json();
    console.debug("result payload", JSON.stringify(json, null, 2));

    // Get new hashnode url and update
    if (response.status >= 200 && response.status <= 299) {
      const hashnode = json?.data?.publishPost?.post?.slug;
      if (hashnode && !podcast?.hashnode) {
        console.debug('Article Added to hashnode', JSON.stringify(json, null, 2));
        await updateSanity(podcast._id, hashnode);
        console.debug('Sanity Updated', podcast._id, hashnode);
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

const unPublishPodcast = async (_type: string, id: string, hashnode: string) => {
  if (!id) {
    return Response.json({ success: false, error: "Podcast not found" }, { status: 404 });
  }

  console.debug('Unpublishing', { _type, id, hashnode });

  try {

    if (!hashnode) {
      return Response.json({ success: false, error: "hashnode not found" }, { status: 404 });
    }
    const response = await unpublishArticle(hashnode);

    // Remove hashnode from sanity
    if (response.status >= 200 && response.status <= 299) {
      const json = await response.json();
      console.log('hashnode remove response', JSON.stringify(json, null, 2))
      if (json.error)
        return Response.json({ success: false, error: JSON.stringify(json, null, 2) }, { status: 200 });
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
  return fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: {
      authorization: process.env.PRIVATE_HASHNODE || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operationName: 'publishPost',
      query: `mutation publishPost($input: PublishPostInput!) { 
				publishPost(
				  input: $input
				) {
				post {
				  id
				  title
				  slug
				}
			  }
			}
			  `,
      variables: {
        input: {
          ...article
        }
      }
    })
  });
};

const getArticle = async (hashnode: any) => {
  return fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: {
      authorization: process.env.PRIVATE_HASHNODE || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operationName: 'Publication',
      query: `query Publication {
        publication(host: "hashnode.codingcat.dev") {
            post(slug: "${hashnode}") {
                id
            }
        }
      }`})
  });
};

const unpublishArticle = async (hashnode: string) => {
  const requestedArticle = await getArticle(hashnode);
  const json = await requestedArticle.json();
  return fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: {
      authorization: process.env.PRIVATE_HASHNODE || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operationName: 'removePost',
      query: `mutation removePost($input: RemovePostInput!) { 
				removePost(
				  input: $input
				) {
          post {
            slug
          }
			  }
			}
			  `,
      variables: {
        input: {
          id: json?.data?.publication?.post?.id
        }
      }
    })
  });
};

const updateArticle = async (hashnode: string, article: any) => {
  const requestedArticle = await getArticle(hashnode);
  const json = await requestedArticle.json();

  //slug cannot be set again
  const update = article;
  delete update.slug;

  return fetch('https://gql.hashnode.com', {
    method: 'POST',
    headers: {
      authorization: process.env.PRIVATE_HASHNODE || '',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      operationName: 'updatePost',
      query: `mutation updatePost($input: UpdatePostInput!) { 
				updatePost(
				  input: $input
				) {
          post {
            slug
          }
			  }
			}
			  `,
      variables: {
        input: {
          ...json?.data?.publication?.post,
          ...update
        }
      }
    })
  });
};

const updateSanity = async (_id: string, hashnode: string) => {
  return sanityWriteClient.patch(_id).set({ hashnode }).commit();
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