---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1649933071/main-codingcatdev-photo/lb.jpg
devto: https://dev.to/codingcatdev/learning-builderio-from-a-developers-perspective-c69
excerpt: I sat down with Tim Benniks who is a developer advocate, for his first time ever checking out Builder.io.
hashnode: https://hashnode.codingcat.dev/post-learning-builder-io-from-a-developers-perspective
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=learning-builder-io-from-a-developers-perspective&_id=435587b1f59749b5bfa95089f29fc4d2
published: published
slug: learning-builder-io-from-a-developers-perspective
start: April 13, 2022
title: Learning Builder.io from a Developers Perspective
---
I sat down with Tim Benniks, who is a professional developer advocate, to introduce him to Builder.io. It was great to hear what questions a developer might have when being first introduced to the tool. I know Tim is well versed in all things Jamstack, so he wasn't coming into the conversation completely blind.

## Key Takeaways

It was a huge help to talk with Tim about a product that I am supporting and building awareness about.

### What Developers need to know

- Developers want to see code
- Understanding of what data is required to build out the pages, user interface, and state management
- How custom components can be used

### What I learned

Because I have been learning the product over several months now there were many areas that I take for granted. When I show people the product it is going to be important to mention very key items that both developers and content creators will find useful. For instance, when I was entering one of the data bindings for state Tim was surprised by the editor.

[https://media.codingcat.dev/image/upload/f_auto,c_limit,w_3840,q_auto/main-codingcatdev-photo/Screen_Shot_2022-04-13_at_8.11.20_PM](https://media.codingcat.dev/image/upload/f_auto,c_limit,w_3840,q_auto/main-codingcatdev-photo/Screen_Shot_2022-04-13_at_8.11.20_PM)

Something I forgot to mention was the fact this is not the only editor. Not only can you use components and bind dynamic data, there is also the capability to access global styling and JavaScript with a built in editor as well. In the image below you can see that you are also able to run JavaScript on the server via Builder.isServer as well as only on the client via Builder.isBrowser.

[https://media.codingcat.dev/image/upload/f_auto,c_limit,w_3840,q_auto/main-codingcatdev-photo/Screen_Shot_2022-04-13_at_8.15.41_PM](https://media.codingcat.dev/image/upload/f_auto,c_limit,w_3840,q_auto/main-codingcatdev-photo/Screen_Shot_2022-04-13_at_8.15.41_PM)

## More Details

Below are some more details that may have been missed in the video. I am sure as I learn more I will release some more videos, both on CodingCat.dev and [Builder.io](https://builder.io/).

This is probably one of the biggest areas to understand in builder. In most of the common frameworks that we use today they have very specific and well defined methods of calling APIs. Explaining that the framework is best suited to do this in must cases for creating pages and structure to your site. For instance when we were walking through how to create pages in Next.js, it is key to call your CMS (no matter if this is builder or something else) to build out post pages.

Below is how CodingCat.dev creates pages in Next.js. This will be the same in Nuxt, SvelteKit, Gatsby or anything that creates SSG pages.

```jsx
export async function getStaticPaths() {
  const paths: string[] = [];
  for (const postType of [
    ModelType.page,
    ModelType.post,
    ModelType.tutorial,
    ModelType.podcast,
    ModelType.course,
    ModelType.authors,
  ]) {
    const pages = (await getAllBuilder({
      model: postType,
      fields: `data.url`,
      startEnd: true,
    })) as CodingCatBuilderContent[];
    pages
      .filter(
        (page) =>          !['/blog', '/courses', '/podcasts', '/tutorials'].includes(
            `${page?.data?.url}`          )
      )
      .map((page) => paths.push(`${page?.data?.url}`));
  }
  return {
    paths,
    fallback: true,
  };
}

```

When the page is then generated you must call your CMS for that specific page and pass the data that is required to generate the visual page.

```jsx
getAllBuilder({
          preview,
          model: slug ? type : 'page',
          limit: 1,
          userAttributes: {
            urlPath: '/' + (params?.page?.join('/') || ''),
          },
          startEnd: true,
        }),

```

Then when this data passes into the system it is in two different areas of BuilderComponent, content and data.

```jsx
<BuilderComponent
          options={{ includeRefs: true }}
          model={model}
          content={modelData}
          data={{
            recentPosts,
            modelData,
            courseData,
          }}
     />

```

Below is a breakdown that I made so that you can understand what all the props for the `BuilderComponent` actually do. As you can see data is meant to include dynamically changing state data, and content will be your pages data as Described by the Builder.io JSON.

[https://media.codingcat.dev/image/upload/f_auto,c_limit,w_3840,q_auto/main-codingcatdev-photo/BuilderComponent](https://media.codingcat.dev/image/upload/f_auto,c_limit,w_3840,q_auto/main-codingcatdev-photo/BuilderComponent)

### Builder JSON

As you are using the visual editor, ever developer knows that all of this has to end up as HTML and CSS in the end. Because Builder.io creates a special serialized JSON this is what allows it to be translated into any framework using Builder.io's open source project [Mitosis](https://github.com/BuilderIO/mitosis).

Below is an example of what that JSON looks like (again available directly within the visual editor data section.

```json
{
  "ownerId": "303fa35cceca49e6ab548071602c8ebd",
  "lastUpdateBy": null,
  "createdDate": 1649885165355,
  "id": "df677f1d384f4c708cf2e64d41038d33",
  "@version": 3,
  "name": "Learning Builder.io from a Developers Perspective",
  "modelId": "3346f48bd7cf4337aa99627827b24b4a",
  "published": "draft",
  "meta": {
    "kind": "page",
    "hasLinks": false  },
  "priority": -1853.5,
  "query": [
    {
      "@type": "@builder.io/core:Query",
      "property": "urlPath",
      "operator": "is",
      "value": "/post/learning-builder-io-from-a-developers-perspective"    }
  ],
  "data": {
    "page": {
      "title": "Learning Builder.io from a Developers Perspective",
      "authors": [
        {
          "author": {
            "@type": "@builder.io/core:Reference",
            "id": "d4652e9fa73543dc8a422e20608fc7d2",
            "model": "author"          }
        }
      ],
      "frameworks": [],
      "excerpt": "I sat down with Tim Benniks who is a developer advocate, for his first time ever checking out Builder.io. It was great to hear what questions a developer might have about creating pages with a Visual Editor.",
      "coverPhoto": {
        "created_by": {
          "id": "dbfd615dfc7e1b5d5a6d1427802862",
          "type": "user"        },
        "url": "htts://media.codingcat.dev/image/upload/v1649885350/main-codingcatdev-photo/Learning_Builder.io_from_a_Developers_Perspective.jpg",
        "uploaded_by": {
          "id": "dbfd615dfc7e1b5d5a6d1427802862",
          "type": "user"        },
        "resource_type": "image",
        "access_mode": "public",
        "bytes": 699229,
        "format": "jpg",
        "metadata": {},
        "type": "upload",
        "version": 1649885350,
        "height": 1080,
        "tags": [],
        "width": 1920,
        "duration": null,
        "secure_url": "https://media.codingcat.dev/image/upload/v1649885350/main-codingcatdev-photo/Learning_Builder.io_from_a_Developers_Perspective.jpg",
        "created_at": "2022-04-13T21:29:10Z",
        "public_id": "main-codingcatdev-photo/Learning_Builder.io_from_a_Developers_Perspective"      }
    },
    "title": "Learning Builder.io from a Developers Perspective",
    "inputs": [],
    "blocks": [
      "/* @ref:block:builder-ad4ccd18b8fb48869d2af8910c217787 */"    ]
  },
  "metrics": {
    "clicks": 0,
    "impressions": 0  },
  "variations": {},
  "lastUpdated": 1649897478865,
  "testRatio": 1,
  "screenshot": "https://cdn.builder.io/api/v1/image/assets%2F303fa35cceca49e6ab548071602c8ebd%2F78aab7136e5d44ba878113dc279fa6a5",
  "createdBy": "HYxMkZFRmMTuS5LD6DoM9GlsuXV2",
  "lastUpdatedBy": "HYxMkZFRmMTuS5LD6DoM9GlsuXV2"}

```

The "blocks" item is where ever single item that is in our layers panel will be described as a unique block component. It is far too large to show everything. Below is an example of one of those blocks. In this case it is our custom Next.js component called NextImage.

```json
{
  "@type": "@builder.io/sdk:Element",
  "@version": 2,
  "id": "builder-a882c6d717364475be6dc0cef0f178a0",
  "component": {
    "name": "NextImage",
    "options": {
      "layout": "responsive",
      "width": 1920,
      "height": 1080,
      "alt": "An image description",
      "className": "rounded-xl",
      "cloudinaryImage": {
        "public_id": "main-codingcatdev-photo/BuilderComponent",
        "resource_type": "image",
        "type": "upload",
        "format": "png",
        "version": 1649896683,
        "url": "htts://media.codingcat.dev/image/upload/v1649896683/main-codingcatdev-photo/BuilderComponent.png",
        "secure_url": "https://media.codingcat.dev/image/upload/v1649896683/main-codingcatdev-photo/BuilderComponent.png",
        "width": 1920,
        "height": 1080,
        "bytes": 317529,
        "duration": null,
        "tags": [],
        "metadata": {},
        "created_at": "2022-04-14T00:38:03Z",
        "access_mode": "public",
        "created_by": {
          "type": "user",
          "id": "dbfd615dfc7e1b5d5a6d1427802862"        },
        "uploaded_by": {
          "type": "user",
          "id": "dbfd615dfc7e1b5d5a6d1427802862"        }
      }
    }
  },
  "responsiveStyles": {
    "large": {
      "borderRadius": "20px",
      "boxShadow": "-webkit-box-shadow: 5px 5px 15px 5px #000000;  box-shadow: 5px 5px 15px 5px #000000;"    }
  }
}

```

I can't come close to teaching you everything about Builder.io in a single post, but my team is building out documentation, courses, and videos to help developers be successful!