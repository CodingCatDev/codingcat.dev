---
authors:
  - alex-patterson
cloudinary_convert: false
cover: 'https://media.codingcat.dev/image/upload/v1681939723/main-codingcatdev-photo/courses/svelte/how-to-call-an-api.png'
excerpt: 'Using fetch within Svelte provides a simple and consistent way to make HTTP requests.'
published: published
slug: how-to-call-an-api
start: April 17, 2023
stackblitz: 'https://stackblitz.com/github/CodingCatDev/svelte-course/tree/10-how-to-call-an-api?embed=1&file=apps/svelte-site/src/routes/%2Bpage.svelte'
title: 'Learn Svelte: The Ultimate Guide - How to call an API'
weight: 3
youtube: https://youtu.be/O-72Vwpe5Ag
---

## Fetching Data from a Web API

To fetch data from a web API, we can use the fetch API. The fetch API is a modern JavaScript API that makes it easy to make HTTP requests.

To use the fetch API, we first need to create a request object. The request object specifies the URL of the API and the HTTP method that we want to use.

Once we have created a request object, we can use the fetch() method to make the request. The fetch() method returns a promise that resolves to the response object.

The response object contains the status code, headers, and body of the response. We can use the status code to determine whether the request was successful or not.

If the request was successful, we can use the headers and body of the response to get the data that we need.

Below is an example of us getting using the Fetch API to get kitten data.

```svelte
let kittens: { src: string; name: string }[] = [];

const getKittens = async () => {
    const res = await fetch('https://api.thecatapi.com/v1/images/search?limit=10');
    const kittenJson = await res.json();
    kittens = kittenJson.map((k: any) => {
        return { src: k.url, name: k.id };
    });
};
```

## Handling Errors

When we make a request to a web API, there is always the possibility that the request will fail. For example, the API may be down or the request may be invalid.

To handle errors, we can use the catch() method on the promise returned by the fetch() method. The catch() method takes a function as an argument. The function will be called if the request fails.

The function passed to the catch() method will receive the error object as an argument. The error object contains information about the error, such as the status code and the message.

## Caching Data

To improve the performance of our application, we can cache the data that we fetch from the web API. Caching the data means that we store the data in memory so that we don't have to fetch it from the API every time.

To cache data, we can use the cache() method on the response object. The cache() method takes a boolean value as an argument. The boolean value specifies whether we want to cache the data in memory.

If we set the boolean value to true, the response object will be cached in memory. The next time we make a request to the same API, the response object will be returned from the cache instead of being fetched from the API.

## Conclusion

In this blog post, we showed you how to use the fetch API to fetch data from a web API in Svelte. We also showed you how to handle errors and cache the data.
