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

### Web Native

A web native database is a database that is designed to be used with web applications, think of this simply in terms of allowing the use of [fetch()](https://developer.mozilla.org/en-US/docs/Web/API/fetch). It is typically stored on the web server and is accessed by web clients using a web browser. Web native databases are often used for storing data that is used by multiple users, such as user profiles, product catalogs, and order information. Utilizing either HTTP APIs or WebSockets rather than connecting directly.

When choosing a web native database, it is important to consider the following factors:

- The amount of data that will be stored
- The number of users who will be accessing the database
- The type of data that will be stored
- The level of security required

Web native databases offer a number of advantages over other types of databases, including:

- Scalability: Web native databases can be scaled to meet the needs of growing applications.
- Performance: Web native databases are typically very fast and efficient.
- Security: Web native databases can be secured using a variety of techniques.
- Cost: Web native databases are typically very cost-effective.

### Lightweight

One of the key benefits of lightweight databases is that they can help to reduce complexity. In the past, developers had to worry about a lot of the details involved in managing a database, such as setting up and configuring the database server, creating and managing user accounts, and ensuring data security. However, with lightweight databases, many of these tasks are handled by the database vendor. This can free developers up to focus on their core application logic, which can lead to faster development times and lower costs.

Another benefit of lightweight databases is that they are often more scalable than traditional databases. This is because they are typically designed to be distributed across multiple servers. This can help to ensure that applications can continue to perform even under heavy load.

Here are some additional details about how complexity is shifting to the database vendor:

- Database vendors are increasingly providing tools and services to help developers manage their databases. This includes features such as automatic backups, data replication, and security management.
- Database vendors are also working to make their databases more self-service. This means that developers can perform tasks such as creating and managing user accounts, and configuring database settings without having to contact the database vendor.
- The shift of complexity to the database vendor is a positive trend for developers. It frees them up to focus on their core application logic, and it can help to reduce the overall cost of database management.

### Developer eXperience

No one wants to remember how to query a database using SQL (okay maybe a few of you), so it is very important to keep your users writing statements that are in their native language for the majority of users that means [TypeScript](https://www.typescriptlang.org/). If you are working on large applications that have several people included automating the task of type safety is a must! Luckily their are many companies stepping up to the challenge in this area like [Prisma](https://www.prisma.io/), [Kysely](https://github.com/koskimas/kysely), [Drizzle](https://github.com/drizzle-team/drizzle-orm), [Contentlayer](https://www.contentlayer.dev/), and [Zapatos](https://jawj.github.io/zapatos/). These tools will make your DX super easy and remove lots of nasty 🐞's from your code!
