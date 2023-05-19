---
type: post
authors:
  - alex-patterson
cloudinary_convert: false
cover: 'https://media.codingcat.dev/image/upload/v1684351400/main-codingcatdev-photo/2023-serverless-databases.png'
devto:
excerpt: Databases that work well with serverless applications in 2023
hashnode:
published: draft
slug: 2023-databases-for-serverless
start: May 19, 2023
title: '2023 Databases for Serverless Applications'
youtube:
---

So what's the deal with serverless and edge compute? Well, basically, they're ways of running applications without having to worry about managing servers. This is great for developers because it means they can focus on building cool stuff instead of worrying about infrastructure.

But what does this have to do with databases? Well, if you're not managing servers, then you need a way to store your data. And that's where databases come in.

There are a lot of different databases out there, but not all of them are created equal. Some databases are better suited for serverless and edge compute than others.

So which databases are the best for serverless and edge compute? That's what I'm here to talk about today.

I'm going to give you a quick overview of some of the best databases for serverless and edge compute. I'll also tell you a little bit about each database and why it's a good fit for serverless and edge compute.

## What is a Serverless Database

Did you know that the [first relation database](https://en.wikipedia.org/wiki/Relational_database) was created in 1970?!? Now comes the part where I feel really old in telling you that the first database that I used was MySQL on a [MAMP](https://codex.wordpress.org/Installing_WordPress_Locally_on_Your_Mac_With_MAMP) stack back in 2001.

Okay enough nostalgia!

In the last 10+ years we started to build everything on the web in a serverless world, except for our databases. We no longer need to stand up a server, or even a VM to deliver a great website, except for when it comes to data. We are just now coming to realize that we need to create serverless-first storage solutions.

## What criteria must be met to be considered serverless?

### Connectionless

Connectionless databases are the way to go for developers who want to focus on building their applications, not managing database connections.

Traditional database protocols are stateful, which means that they keep track of the state of the connection between the client and the server. This can be a problem for developers who want to scale their applications to zero compute, because it means that they need to keep track of a lot of connections that are not being used.

HTTP, on the other hand, is a stateless protocol. This means that the client and the server do not need to keep track of the state of the connection. This makes it much easier to scale applications to zero compute, because the server can close connections that are not being used.

Connectionless databases provide an **abstraction** over connection pooling. This means that developers can use connectionless databases without having to worry about managing connections themselves. The database will automatically open and close connections as needed, which frees developers up to focus on their applications.

Here are some of the benefits of using connectionless databases:

- **Simplicity:** Connectionless databases are much simpler to use than traditional database protocols. This is because developers do not need to worry about managing connections themselves.
- **Scalability:** Connectionless databases are much more scalable than traditional database protocols. This is because the server can close connections that are not being used, which frees up resources for other connections.
- **Performance:** Connectionless databases can often perform better than traditional database protocols. This is because the server does not need to keep track of the state of the connection, which can improve performance.
