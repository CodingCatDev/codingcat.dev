---
title: 'Excited for move to Wordpress'
date: '2020-10-26'
---

## Why is CodingCatDev switching to Wordpress

CodingCatDev has been using [Sanity.io](https://www.sanity.io/ 'Sanity.io') and [Firebase](https://firebase.com/ 'Firebase') for the backend, [Gatsby](https://www.gatsbyjs.com/ 'Gatsby') for the frontend and [Google Cloud Platform](https://cloud.google.com/ 'Google Cloud Platform')\> for the build pipeline. It resulted in an absolutely blazing fast site with fantastic Search Engine Optimization and Social Meta Data.

**So why would we switch?**

The main goal for CodingCatDev is to allow others (not just Alex) to create wonderful Courses, Lessons, and Tutorials. Unfortunately, at the time of writing this Sanity.io does not allow for [fine grained access control](https://www.sanity.io/docs/access-control#custom-access-control). We were also looking into making changes to create content that is Server Side Rendered (SSR) so that authors are able to securely create courses that they can monetize. In the old world these were controlled using Firebase and the solution was not working as well as we had hoped when creating it. There were several Cloud Functions that were required to keep Stripe payments and subscriptions safe. On top of this we were tweaking the design to show progress indicators and other nice features that a Learning Managment System (LMS) should have. CodingCatDev shouldn't be an all or nothing solution either when it comes to taking courses. While much of the site has been created so that our Pro members get the greatest benefits, we also want to allow people to by package deals for a given track, or just a single class. This comes with a great deal of complexity that others have already solved.

## Content Management System

Knowing the only reason that we left Sanity.io was because of the fine grained control restriction we did a lot of research on CMS platforms that might do the trick and the only two that we could find (at the base level) were [Dato CMS](https://www.datocms.com/pricing/compare 'Dato CMS') and [Flamelink](https://flamelink.io/features 'Flamelink').

For one of our upcoming courses [AngularFire Master Course](/angularfire-master-course/) we will actually build a CMS that handles a great deal of these challenges and is backed by Firebase, but it wasn't ready for full consumption.

## Learning Management System

We did extensive research with all of the hosted solutions that are available today including

- [Learnworlds](http://https://www.learnworlds.com/ 'Learnworlds')
- [Thinkific](https://www.thinkific.com/ 'Thinkific')
- [Teachable](https://teachable.com/ 'Teachable')
- [Podia](https://www.podia.com/ 'Podia')

Many of this solutions would have worked but ultimately we felt that for long term success we needed to have control over the system that hosts our content. We don't want to be stuck in a situation where a hosted LMS company fails and we lose decades worth of peoples work.

### LMS Goals

- Allow for structured content
- Progress for students
- Lessons that allow quizzes, videos, and any embeddable content
- Allow creation of content using Markdown or Block coding (for advanced or beginner)
- Unlimited course hosting with no upsell requirements
- Unlimited users
- Certificates
- Badges

## Specific CodingCatDev Requirements

One of our biggest feature requests when moving to an LMS was to allow progress to be shown for the end users for each course.

![Progress of Course shown.](https://res.cloudinary.com/ajonp/images/f_auto,q_auto/v1603737569/ccd-cloudinary/image-1603737568572/image-1603737568572-217x300.png)

We also wanted to allow for copying code blocks more easily so this was a must have for a technical project

```javascript
<script>alert( 'Hello, world!' );</script>
```

## Wordpress with Learndash

We ultimately decided that Learndash checked all of the boxes! So far it was easy to move all of the content from Sanity.io (after some GROQ magic). I think it will be in CCD's best interest so that we can continue to grow the platform at large.

Just like anyone who has re-written their personal blog using several methods this will come with a learning curve, as we currently have no one on staff that can customize Wordpress.

As I always say the web is fun, so we will learn together on this journey!!
