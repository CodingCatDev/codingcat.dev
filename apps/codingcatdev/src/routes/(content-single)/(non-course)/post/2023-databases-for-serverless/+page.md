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

## Database Solutions

Interesting it isn't as easy anymore to just say we are going with Postgres, MySQL or MongoDB. There are tons of choices out there already that include or wrap these databases, and there are tons of options coming out that include some awesome future features. So how can one decide? I will break these down into the buckets that have the most feature parity along with general availability (aka won't be a flash in the pan).

### Established Backend as a Service

The BaaS platforms are really unique in that they have so much of the authentication and authorization baked into each one of the products. You often able to customize the database (and other resources) down to the data level.

<section class="flex flex-col gap-2 md:gap-8">
  <div class="flex flex-col gap-2 p-2 bcu-card variant-soft">
    <a target="_blank" rel="noopener noreferrer" href="https://firebase.com" class="text-3xl">Firebase</a>
    <p>
    I am a <a target="_blank" rel="noopener noreferrer" href="https://developers.google.com/community/experts/directory/profile/profile-alex-patterson">Firebase GDE</a> and I still consider <a target="_blank" rel="noopener noreferrer" href="https://firebase.google.com/products/firestore">Firestore</a> to be an amazing product and very well established being more than 5 years old now. Firebase provides built-in support for Authentication, Remote Config, Cloud Functions, Cloud Messaging, Cloud Storage and Hosting. Every Firebase project is a Google Cloud Platform project and can extend its reach in incredible ways.
    </p>
  </div>
  <div class="flex flex-col gap-2 p-2 bcu-card variant-soft">
    <a target="_blank" rel="noopener noreferrer" href="https://aws.amazon.com/amplify/" class="text-3xl">AWS Amplify</a>
    <p>
    I am also an <a target="_blank" rel="noopener noreferrer" href="https://aws.amazon.com/developer/community/community-builders/community-builders-directory/?cb-cards.sort-by=item.additionalFields.cbName&cb-cards.sort-order=asc&awsf.builder-category=*all&awsf.location=*all&awsf.year=*all&cb-cards.q=alex%2Bpatterson&cb-cards.q_operator=AND">AWS Community Builder</a> focusing on Front-End Web & Mobile. The AWS Amplify product includes <a target="_blank" rel="noopener noreferrer" href="https://aws.amazon.com/dynamodb/">DynamoDB</a> which is a fast, flexible NoSQL database service for single-digit millisecond performance at any scale. Utilizing all of the services within Amazon Web Services (AWS) portfolio is amazing powerful. AWS Amplify includes Authentication, PubSub, Functions, Push notifications, and Storage. All of this while using Cloud Formation for IaC to make changes easily (although at times slow) and consistent across environments.
    </p>
  </div>
  <div class="flex flex-col gap-2 p-2 bcu-card variant-soft">
    <a target="_blank" rel="noopener noreferrer" href="https://appwrite.io/" class="text-3xl">Appwrite</a>
    <p>
    Appwrite is an open source alternative to the above mentioned products, it can be loaded with a simple docker compose command anywhere docker runs. Full disclosure I was a Developer Advocate for them as well. Everything in Appwrite is written in PHP but like the others provides a host of different <a target="_blank" rel="noopener noreferrer" href="https://appwrite.io/docs/sdks">SDK's</a> for both web and mobile. As of writing this the database powering the default solution is <a target="_blank" rel="noopener noreferrer" href="https://mariadb.org/">MariaDB</a>. One of the unique abstractions that Appwrite provides is that it allows really for any database type and I am sure the team will add Postgres in the near future. Appwrite also includes Authentication, Storage, and Functions. Appwrite's realtime is not built into the connection like Firestore, but it makes it easy to get any events across the entire system not just the database which is really awesome!
    </p>
  </div>
  <div class="flex flex-col gap-2 p-2 bcu-card variant-soft">
    <a target="_blank" rel="noopener noreferrer" href="https://supabase.com/" class="text-3xl">Supabase</a>
    <p>
    Of course if I am writing about Appwrite I need to also talk about Supabase. Supabase hasn't been around as long as Firebase and AWS Amplify, but it has won the hearts of developers. It includes a <a target="_blank" rel="noopener noreferrer" href="https://supabase.com/database">Postgres Database</a> along with Authentication, Storage, Realtime and Edge Functions.
    </p>
  </div>
  <div class="flex flex-col gap-2 p-2 bcu-card variant-soft">
    <a target="_blank" rel="noopener noreferrer" href="https://www.mongodb.com/atlas" class="text-3xl">MongoDB Atlas</a>
    <p>
     Unlike the solutions above MongoDB actually positions its <a target="_blank" rel="noopener noreferrer" href="https://www.mongodb.com/atlas">Atlas</a> product as a "data platform". As you can read in their blog <a target="_blank" rel="noopener noreferrer" href="https://www.mongodb.com/blog/post/world-recap-why-serverless-architecture-developers">Why Serverless is the Architecture Developers Have Been Waiting For</a> MongoDB is positioning itself really well with the MongoDB Atlas Serverless product!
    </p>
  </div>
</section>

### New Database Services

Some of these might include full BaaS, but are too new to put into an established place. Others have not figured out who they want to be yet. Then there are those who know who they and just offer a database.

<section class="flex flex-col gap-2 md:gap-8">
  <div class="flex flex-col gap-2 p-2 bcu-card variant-soft">
    <a target="_blank" rel="noopener noreferrer" href="https://planetscale.com/" class="text-3xl">PlanetScale</a>
    <p></p>
  </div>
</section>

### Postgres

- AWS Aurora
- CockroachDB

### Redis

- Upstash

### Other

- Fauna

## What to consider in the Future

So you now know the different choices that are available in the market, what is so compelling about some of these future market leaders?

### Branch Preview Deployments

It is very common to when using to preview deployments for your frontend applications to only use a single database like below. This is a huge step forward from hitting any type of production database, but when previewing the deployment you might want to make new backend changes as well for this specific preview without affecting all other previews that other preview branches are working from.

![Shared Images](https://media.codingcat.dev/image/upload/q_auto,f_auto/main-codingcatdev-photo/15d1641c99cb88031236dddc1482e83655653c708d3c9832948b2c4512e2573b.png)

<span class="text-xs"><a href="https://neon.tech/docs/guides/vercel">Image by Neon.tech</a></span>

This is where a solutions like [Neon](https://neon.tech/docs/guides/vercel) and [Xata](https://xata.io/docs/concepts/how-it-works#branches-and-zero-downtime-migrations) are bringing the concept of previews to the next level and including a branch of you database as well to match! You can see in the below diagram you can have a database with specific migrations ready to take place when merge back to your main branch.

![picture 3](https://media.codingcat.dev/image/upload/v1685398212/main-codingcatdev-photo/74a9de0eb93132b58892d7dd2c82a30d67d0d1f93d571098bb0f3f5bf091f72f.png)

<span class="text-xs"><a href="https://neon.tech/docs/guides/vercel">Image by Neon.tech</a></span>
