---
type: podcast
authors:
  - alex-patterson
episode: 2
recording_date: Feb 14, 2024 12:00 PM
season: 1
published: published
podcast: code-with-coding-cat
chapters_done: false
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1707339236/main-codingcatdev-photo/2024-2-14-amplify-gen2.png
devto:
excerpt: 'AWS Amplify using Gen2, a code first approach'
guests:
  - erik-hanchett
hashnode:
picks:
slug: cwcc-1-2-aws-amplify
sponsors:
spotify:
start: Feb 14, 2024
title: 'Next.js Amplified: Full-Stack Web Apps on AWS Amplify Gen2'
youtube: https://youtube.com/live/SAF2gP7U5CM?feature=share
---

<script>
  import OpenIn from '$lib/components/content/OpenIn.svelte'
</script>

<OpenIn url="https://github.com/CodingCatDev/amplify-gen2-nextjs-code-with-codingcatdev"  />

Welcome back to Code with CodingCat.dev, where we dive into the ever-evolving world of coding with a casual vibe and some purr-fectly thought-out code. Today, we're joined by Eric, a developer advocate from the AWS Amplify team, to unpack the game-changing AWS Amplify Gen2 for building full-stack web and mobile apps. If you're navigating the high seas of the coding cosmos, looking for ways to build more with less and streamline your workflows, get comfy, and let's unravel the mysteries of Amplify Gen2 together.

## Reconnecting at re:Invent

It's always a blast catching up at events like AWS re:Invent, where the community's passion for engineering and advocacy converges. It was especially thrilling for Eric, who, transitioning from UI engineering to developer advocacy, marched into re:Invent with a speaker badge and an eager heart. Post-re:Invent, the wind-down was a chance to deep dive into projects, create fresh content, and especially explore the new frontiers of Amplify Gen2.

## Hobbies, Football, and Taylor Swift

Speaking of depth, besides the tech realm, there's the unbeatable mashup of football and music that stirs our guest Eric's soul. As a devoted San Francisco 49ers fan, the postseason was a rollercoaster ride paired with cheer for global icon Taylor Swift. Every game is a story of triumph and heartbreak, much like our journey as developers, where resilience is the name of the game.

## What is AWS Amplify Gen2?

Amplify Gen2 is all about rethinking app creation. Those familiar with Amplify's CLI and Studio would appreciate the shift toward more code-centric workflows. It's about creating the right abstractions that spice up the developer experience. Take a leap into a .notation and TypeScript-first approach that straightforwardly ties your app to databases and more.

### The Power of TypeScript and Dot Notation

With Amplify Gen2, TypeScript takes center stage, offering streamlined syntax and the intelligence of auto-complete and error-checking to ensure your backend talks smoothly with AppSync and the managed GraphQL service.

```typescript
// Define a model in Amplify Gen2 with TypeScript and dot notationconst model
Name = amplifyModel.defineModel({
	fieldName: Types.String.required(),
	anotherField: Types.Enum(['option1', 'option2']).required()
});
```

Embrace the richness of TypeScript and craft your backend like a maestro orchestrating a symphony.

## Live Coding Session: Meal Planning App

Let’s roll up our virtual sleeves and jump into a live coding session. We’ll embark on crafting a meal planning app. The goal is to create a simple CRUD app with authenticated user access. We start from scratch, initializing a next app and methodically setting up our backend with Amplify Gen2.

### Setting Up the Schema

Our meal planning app will revolve around a schema with items like breakfast, lunch, and dinner alongside their calorie counts. With Gen2, typing out the schema is a breeze, with authenticity checks and comprehensive data modeling features integrated seamlessly.

```json
// Sample JSON schema for a simple meal planning app
{ "Meal": { "MealName": "string", "Calories": "number", "Date": "string" } }
```

### Hooks, States, and Server Actions

We delve into creating reactive components using hooks, managing states for meal entries, and carrying out server actions like submissions and deletions. Our components evolve with the interplay of client and server-side logic, leaving us with a fully functional, albeit basic, meal planner by the end of the session.

### Debugging on the Fly

We're all too familiar with the occasional hiccups that pop up when diving into code. Our session is no stranger to these, as we troubleshoot real-time, lending authenticity to the experience. We navigate through issues like unresponsive delete buttons and state retention on refresh, all part of the raw charm of live coding.

![An image showcasing the live debugging process, with a focus on the code editor and the console revealing the error messages.](https://media.codingcat.dev/image/upload/v1709762335/main-codingcatdev-photo/3QAnMKyWNPuCC6pA4Gvq-4371.67.png)

### The Might of Amplify

In our app, Amplify Gen2 flexes its muscles by streamlining DB actions, from data entry to deletions, all the while ensuring security with user authentication. As we rap up the meal planning app, its simplistic CRUD functionality stands testament to Amplify's prowess.

## Wrapping Up and Deployment

Our coding dance comes full circle as we discuss pushing our local wonders to the cloud. With AWS Amplify, deploying is as simple as linking your GitHub repo and letting Amplify's continuous deployment take the wheel.

### Console Wonders

Take a moment to appreciate the ephemeral environments Amplify conjures with each sandbox, a temporary realm where your project breathes before you decide its fate - to flourish in the production environment or vanish into the digital aether.

## What's Next for AWS Amplify Gen2?

As we bid goodbye, remember that this is just the beginning for Amplify Gen2. The horizon is ablaze with potential features like storage and functions, taking the tool's capabilities to new zeniths. Until Amplify sheds its preview cloak, keep experimenting, staying tuned for updates, and, most importantly, keep coding!

If you've been hooked by our coding adventure and are itching for more deep dives into the coding universe with a laid-back touch, check out our plethora of posts, tutorials, and nifty tips over at [CodingCat.dev](http://codingcat.dev). Until next time, stay curious and code on!
