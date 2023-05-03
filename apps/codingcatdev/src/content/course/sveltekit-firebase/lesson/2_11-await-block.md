---
authors:
  - alex-patterson
cloudinary_convert: false
cover: 'https://media.codingcat.dev/image/upload/v1681939723/main-codingcatdev-photo/courses/svelte/await-block.png'
excerpt: 'Svelte makes dealing with promises easy by using an await block.'
published: draft
slug: await-block
start: April 17, 2023
stackblitz: 'https://stackblitz.com/github/CodingCatDev/svelte-firebase-course/tree/11-await-block?embed=1&file=apps/svelte-site/src/routes/%2Bpage.svelte'
title: Await Block
weight: 3
youtube:
---

## Svelte Await Blocks

Svelte await blocks are a powerful feature that allow you to write asynchronous code in a concise and easy-to-read way. They are similar to promises, but they have some key advantages.

First, await blocks are much easier to read. They are written in a natural, declarative style, which makes it easy to understand what the code is doing.

Second, await blocks are more efficient. They do not require the use of callbacks, which can make code more complex and less performant.

Third, await blocks are more flexible. They can be used with any asynchronous function, not just those that return promises.

## How to Use Svelte Await Blocks

To use Svelte await blocks, you first need to define an asynchronous function. An asynchronous function is a function that returns a promise.

Once you have defined an asynchronous function, you can use it in an await block. To do this, simply surround the call to the asynchronous function with the `await` keyword.

For example, the following code defines an asynchronous function that fetches a random number from a server:

```svelte
async function getRandomNumber() {
  const res = await fetch(`/tutorial/random-number`);
  const text = await res.text();
  return text;
}
```

The following code uses the `getRandomNumber()` function in an await block:

```svelte
{#await getRandomNumber()}
	<p>...waiting</p>
{:then number}
	<p>The number is {number}</p>
{:catch error}
	<p style="color: red">{error.message}</p>
{/await}
```

This code will first fetch a random number from the server. If the request is successful, the number will be displayed on the screen. If the request fails, an error message will be displayed.

## Advantages of Svelte Await Blocks

Svelte await blocks have several advantages over other ways of writing asynchronous code.

First, await blocks are much easier to read. They are written in a natural, declarative style, which makes it easy to understand what the code is doing.

Second, await blocks are more efficient. They do not require the use of callbacks, which can make code more complex and less performant.

Third, await blocks are more flexible. They can be used with any asynchronous function, not just those that return promises.

## Conclusion

Svelte await blocks are a powerful feature that allow you to write asynchronous code in a concise and easy-to-read way. They are a great way to improve the readability, efficiency, and flexibility of your code.
