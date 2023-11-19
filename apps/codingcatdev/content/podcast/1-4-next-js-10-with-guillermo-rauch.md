---
type: podcast
authors:
  - alex-patterson
  - brittney-postma
episode: 4
recording_date: January 1, 2021
season: 1
published: published
podcast: CodingCat.dev
chapters_done: true
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/main-codingcatdev-photo/fosawiikzx30ajcilo2a.png
devto: https://dev.to/codingcatdev/1-4-next-js-10-56k1
excerpt: Talking with Guillermo Rauch about Next.js 10 and Vercel. Including plans for 2021.
guests:
  - guillermo-rauch
hashnode: https://hashnode.codingcat.dev/podcast-1-4-next-js-10-with-guillermo-rauch
picks:
  [
    {
      author: 'alex-patterson',
      name: 'Next.js Discussions',
      site: 'https://github.com/vercel/next.js/discussions'
    },
    {
      author: 'alex-patterson',
      name: 'Lightest - Visualize web performance against competitors.',
      site: 'https://lightest.app/'
    },
    {
      author: 'brittney-postma',
      name: 'Bridgerton (tv series)',
      site: 'https://www.netflix.com/title/80232398'
    },
    {
      author: 'brittney-postma',
      name: 'The Console Logs (my digital garden/notes site)',
      site: 'https://www.theconsolelogs.com/'
    },
    {
      author: 'guillermo-rauch',
      name: 'What is Next for Vercel',
      site: 'https://rauchg.com/2020/next-for-vercel'
    },
    {
      author: 'guillermo-rauch',
      name: 'Virtual Event Starter Kit',
      site: 'https://vercel.com/virtual-event-starter-kit'
    },
    { author: 'guillermo-rauch', name: 'Demo Store', site: 'https://demo.vercel.store/' },
    { author: 'guillermo-rauch', name: 'Vercel Commerce', site: 'https://nextjs.org/commerce' },
    { author: 'guillermo-rauch', name: 'Cleanshot', site: 'https://cleanshot.com' },
    {
      author: 'guillermo-rauch',
      name: 'Lighthouse Metrics',
      site: 'https://lighthouse-metrics.com/'
    }
  ]
slug: 1-4-next-js-10-with-guillermo-rauch
spotify: https://open.spotify.com/episode/5mrXe0wPHc84li5d1ZvVYd?si=SnzQ51ErR8ysFEuCuYJvsg
start: January 1, 2021
title: Next.js 10
youtube: https://www.youtube.com/watch?v=Xr4wqU5FyMI
---

## Since we last talked a year ago

1.  Zeit became Vercel and gained $21M in funding.
2.  Vercel’s $40M Series B happened in December.
3.  Next.js 9 added (to name a few)
4.  Preview Mode
5.  Environment Variables
6.  Fast Refresh

- Static Regeneration

1.  Next.js Analytics / Commerce
2.  Next.js 10 released
3.  next/image
4.  @next/mdx

## Vercel

- We are now using Vercel and Next.js in our next version of codingcat.dev. It has taken me a little bit of getting used to the CI/CD flow coming from Amplify and Google Cloud Build for Firebase hosting. Can you tell me more about Deploy Preview?
- https://rauchg.com/2020/vercel#preview

## NextJS

1.  I have seen a lot of movement to NextJS in the Jamstack community in the last year. What do you think is driving this move from Gatsby to Next? – Brittney
2.  What is in store for NextJS in 2021? – Brittney
3.  In browser navigation not working in Firefox and editing in dev tools requires the server to be restarted.
4.  Images must be in the public folder.

## CodingCat.dev on Next.js

Currently we are running on Firebase as a backend with two separate Next.js sites

1.  Admin – Next.js, React, MaterialUI, backed by Firebase
2.  Main – Next.js, React, Tailwindcss, backed by Firebase

How can we statically build only our important pages, and then rely on regeneration for the rest? Is it as simple as saying build latest 50 pages and let page props do the rest?

Lighthouse vs. Vercel Analytics how to get 100?

I have read what I will call “way” too much about the Next.js chunks and that Lighthouse complaining about them is basically a non-issue, but is this true?

So in looking at the P99 on Vercel we actually get 100, so what gives, what is this actually showing?

## Guillermo Rauch

“Impossible just takes longer”
