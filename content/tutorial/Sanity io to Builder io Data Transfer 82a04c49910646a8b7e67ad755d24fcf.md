---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1636731429/main-codingcatdev-photo/From_Sanity.io_to_Builder.io.png
excerpt: In this example I will walk you through what data looks like in Sanity.io and how to get that data over to your Builder.io instance while creating models.
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=tutorial&selectionSlug=sanity-io-to-builder-io-data-transfer&_id=82a04c49910646a8b7e67ad755d24fcf
published: archived
slug: sanity-io-to-builder-io-data-transfer
start: June 3, 2022
title: Sanity.io to Builder.io Data Transfer
---

![From_Sanity.io_to_Builder.io](https://media.codingcat.dev/image/upload/v1657636656/main-codingcatdev-photo/3f2a5890-8011-4395-bba2-dfa3e9240cd5.jpg)

I am hoping to make a Sanity.io plugin for builder. In doing so I thought I would write a little conversion tool before hand to figure out all the ins and outs of Builder.io and Sanity.io, so I thought I would share some of my findings. I will keep this tutorial updated as the plugin progresses.

The repo example has three things that you might find useful.

- Deleting All Data
- Creating all new types
- Adding all new Data

**Repo for conversion example** https://github.com/CodingCatDev/sanity-to-builder.git

## Deleting All Data

https://github.com/CodingCatDev/sanity-to-builder/blob/84d8b5d436b2d674f916670317cb48de916c8a68/src/index.ts#L175

In order to delete all the data you need to first find all the models you want to delete

### Get all Models from Builder (even unpublished)

In sanity you deal with things like `draft.` in documents. In Builder these items are just known to be unpublished version. So you need to have `includeUnpublished=true` in your API call. I looked for a while in the sdk and have not found this option so far.

You can handle this by using the fetch command instead of the sdk.

https://github.com/CodingCatDev/sanity-to-builder/blob/84d8b5d436b2d674f916670317cb48de916c8a68/src/config.ts#L134

## Creating all new types

First you need to find all the types in your sanity.io database. I find it best to use Groq. So we can find all the types in Sanity and then create those in Builder as new Models.

## Adding all new Data

## Long Term goal

The End goal is to build a plugin for syncing your data...

**Builder content link** https://github.com/BuilderIO/builder/tree/main/plugins/contentful