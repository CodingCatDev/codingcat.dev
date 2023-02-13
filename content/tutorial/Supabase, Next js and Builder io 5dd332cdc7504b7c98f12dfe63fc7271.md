---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/main-codingcatdev-photo/0.0.png
excerpt: We will walk through how to get up and running on Next.js with Supabase. Then we will build UI using http://builder.io/.
hashnode: https://hashnode.codingcat.dev/tutorial-supabase-nextjs-and-builderio
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=tutorial&selectionSlug=supabase-nextjs-and-builderio&_id=5dd332cdc7504b7c98f12dfe63fc7271
published: published
slug: supabase-nextjs-and-builderio
start: June 12, 2022
title: Supabase, Next.js and Builder.io
youtube: https://youtu.be/yPohaXjNqxU
---

## What are similar tools to Supabase that you may have used?

- [Firebase](https://firebase.google.com/) - Most are trying to match features of Firebase. Offers a realtime JSON database and a document based database called Firestore. Closed source available on Google Cloud Platform.
- [Apprite](https://appwrite.io/) - Allows for a Docker image to be hosted anywhere that you want, with a MariaDB database.
- [Nhost](https://nhost.io/) - Postgres Database hosted on Hasura.

## Getting Started with Supabase

Once you [sign in](https://app.supabase.com/) to Supabase’s dashboard you will be presented with the option to create a new Project ( you may also need to create an organization).

## Live Coding

[GitHub Repo](https://github.com/codercatdev/supabase-nextjs.git) - Final project that you can run locally, just make sure to add your own `.env` files. 

Jon and I talk about how to setup Supabase for Authentication first. We talk about the Magic Link system where you can open a url in your email to login. We then dive into the code.

## Connection

You must get your API keys from `/project/[yourproject]/settings/api` and add them to `.env`. 

![Untitled](https://media.codingcat.dev/image/upload/v1657636587/main-codingcatdev-photo/44f90b08-4272-458f-b9c3-4888a426ff63.png)

You will need to make sure you have a supabase instance created from your configuration to connect the client side of your application.

`/utils/supabaseClient.js`

```jsx
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## Authentication

How to easily check for authenticated user and show a react component.

`/pages/sports.js`

```jsx
import Sports from '../components/Sports';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function Home() {
  const [session, setSession] = useState(null);
  const [me, setMe] = useState(null);
  useEffect(() => {
    setSession(supabase.auth.session());

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);
  return (
    <>
      <div className="container">
        {session ? <Sports session={session} /> : <div>Please Login</div>}
      </div>
    </>
  );
}
```

## Data

In Supabase you can see data in your Postgres database.

![Untitled](https://media.codingcat.dev/image/upload/v1657636587/main-codingcatdev-photo/1d13ceac-1187-4502-951a-118086192326.png)

Supabase uses [PostgREST](https://postgrest.org/en/stable/) to then allow you to access this table.

### Access Data in the Client

This is our full sports page that brings in all of our sports table. There are a couple things to call out here.

1. You can add sports by just calling `supabase.from('sports').insert`
2. When you setup a listener you get the full payload `supabase.from('sports').on('*', (payload)`

```jsx
import { supabase } from '../utils/supabaseClient';
import { faker } from '@faker-js/faker';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Sports({ session }) {
  const [sports, setSports] = useState([]);
  useEffect(() => {
    const sub = supabase
      .from('sports')
      .on('*', (payload) => {
        setSports((current) => [payload.new, ...current]);
        // supabase
        //   .from('sports')
        //   .select('*')
        //   .order('created_at', { ascending: false })
        //   .then((d) => console.log(d));
      })
      .subscribe();
    supabase
      .from('sports')
      .select('*')
      .order('created_at', { ascending: false })
      .then((d) => setSports(d.data));
    return () => {
      if (sub) sub.unsubscribe();
    };
  }, []);

  const addSports = async () => {
    const name = faker.name.findName();
    const image = faker.image.sports(null, null, true);
    await supabase.from('sports').insert([{ name, image }]);
  };
  return (
    <div>
      {session && (
        <div>
          <button onClick={() => addSports()}>Add Sports</button>
          <ul
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr' }}
          >
            {sports?.map((sport) => (
              <li
                key={sport.id}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                {sport.image && (
                  <div>
                    <Image
                      loader={(image) => image.src}
                      src={sport.image}
                      width="100px"
                      height="100px"
                      alt={sport.name}
                    />
                  </div>
                )}
                <div>{sport.name}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
```

### Policies

In order to protect your data you need to setup Policies. These are pretty awesome because they can be written at any level within your table.

![Untitled](https://media.codingcat.dev/image/upload/v1657636587/main-codingcatdev-photo/e61b6631-ecf3-4dcc-a41a-281c090c7ad1.png)

## Builder.io

You can access [Builder.io’s Dashboard](https://builder.io/content). If you hit (CMD or CTRL) + P, and type in API this will give you your API key.

In Next.js `getStaticProps` you can get all the data for your page. This is where we willl look for pages that are created in builder. Pass that data to the client.

```jsx
const page =
    (await builder
      .get('page', {
        apiKey: 'e89fbe16533145d4ae320467ed536a91',
        userAttributes: isPersonalizedRequest
          ? {
              // if it's a personalized page let's fetch it:
              ...getTargetingValues(params.path[0].split(';').slice(1)),
            }
          : {
              urlPath: '/' + (params?.path?.join('/') || ''),
            },
        cachebust: true,
      })
      .toPromise()) || null;
```

Get our sports data from [Supabase](https://supabase.com/) and pass to client.

```jsx
const { data: sports } = await supabase
    .from('sports')
    .select('*')
    .order('created_at', { ascending: false });
```

Then display both our page and data using a single component.

```html
<BuilderComponent
        renderLink={Link}
        model="page"
        content={page}
        data={{ sports }}
      />
```

That is all it takes to hook up [Builder.io](http://Builder.io) and start interacting with the data from Supabase using the state.