---
title: "Better Performance through analysis"
date: "2019-08-17"
---

> Please note I wrote this on my phone driving 6 hours, so I hope to update in more detail. Fun fact I now know how to do git remote recursive from Android ????

The current web standard for initial page load is 2.0 seconds. This is only part of the performance story. Let's dive in a little deeper and see how else we can improve performance. In terms of data reduction and user experience, sometimes these things are not as noticeable.

## Web.dev[](https://codingcat.dev/blog/better-performance-through-analysis#webdev)

[Web.dev learning](https://web.dev/learn) is one of the best sources to increase performance on your site.As you can see in the video, they have several subjects to help improve your sites performance.I actually find myself using the [measure](https://web.dev/measure) feature prior to diving into the learning section. But I never was good at "hitting the books" in school, I am a visual hands on learner ????.It is nice to repeat the lighthouse metrics to see what you have learned and the trends over time.

![](https://res.cloudinary.com/ajonp/image/upload/v1600706347/codingcat.dev/image_70309666.png)

![metrics](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screenshot_20190817-083308_2.png)

## Firebase performance monitoring[](https://codingcat.dev/blog/better-performance-through-analysis#firebase-performance-monitoring)

Firebase Performance Monitoring [docs](https://firebase.google.com/docs/perf-mon) have the best information possible. With that said there are three key elements:

1. Automatically measure app startup time, HTTP/S network requests, and more
2. Gain insight into situations where app performance could be improved
3. Customize Performance Monitoring for your app

The awesome part of Firebase is that it is a very small amount of code that gives you all of this great info!Here you can see a great overview

![overview](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screenshot_20190817-100008_2.png)

You can see all the pages and how many samples determine the average performance.

![pages](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screenshot_20190817-170441.png)

## Why 2 seconds[](https://codingcat.dev/blog/better-performance-through-analysis#why-2-seconds)

Google ranks search results higher based on many inputs to the algorithm, speed is one of the most important factors! Now if you want to go beyond that checkout [Google's Performance blog](https://developers.google.com/web/fundamentals/performance/why-performance-matters/).

## User perception matters[](https://codingcat.dev/blog/better-performance-through-analysis#user-perception-matters)

You really need to make all pages feel like less than one second, why? Humans can't perceive things much faster than one second, but past that they start to think things are wrong. Google cares about the user and uses the [RAIL method](https://developers.google.com/web/fundamentals/performance/rail).

- **Response** - How quickly browser reacts
- **Animation** - effects that make a site look good
- **Idle** - Settling down so browser does not have to process
- **Load** - How quick does this page load

## Additional tools[](https://codingcat.dev/blog/better-performance-through-analysis#additional-tools)

As Google's post points out[Chrome DevTools](https://developers.google.com/web/fundamentals/performance/rail#devtools) The developer tools built into Google Chrome. Provides in-depth analysis on everything that happens while your page loads or runs.[Lighthouse](https://developers.google.com/web/fundamentals/performance/rail#lighthouse) Available in Chrome DevTools, as a Chrome Extension, as a Node.js module, and within WebPageTest. You give it a URL, it simulates a mid-range device with a slow 3G connection, runs a series of audits on the page, and then gives you a report on load performance, as well as suggestions on how to improve. Also provides audits to improve accessibility, make the page easier to maintain, qualify as a Progressive Web App, and more.[WebPageTest](https://developers.google.com/web/fundamentals/performance/rail#webpagetest) Available at webpagetest.org/easy. You give it a URL, it loads the page on a real Moto G4 device with a slow 3G connection, and then gives you a detailed report on the page's load performance. You can also configure it to include a Lighthouse audit.

## Difference on what you test[](https://codingcat.dev/blog/better-performance-through-analysis#difference-on-what-you-test)

If the majority of your users are on desktop, you probably care more about testing for desktop. However, if you are looking to build a broader user base, especially in developing world's, you better check low end mobile results!

### Desktop for AJonP[](https://codingcat.dev/blog/better-performance-through-analysis#desktop-for-ajonp)

I try to get an all A rating, but this shows even smaller items that you can fix.

![AJonP desktop sample](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screenshot_20190818-124358.png)

It allows you to really dig down into the details.

![AJonP desktop details](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screenshot_20190818-124455.png)

### Mobile low-end for AJonP[](https://codingcat.dev/blog/better-performance-through-analysis#mobile-low-end-for-ajonp)

An example where I can improve performance still on low end devices.

![first byte](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screenshot_20190817-225336.png)

![technical](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/ajonp-ajonp-com/blog/Screenshot_20190817-225421.png)
