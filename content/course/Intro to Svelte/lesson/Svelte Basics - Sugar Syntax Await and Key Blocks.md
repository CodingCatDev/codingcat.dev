---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1646791334/main-codingcatdev-photo/Intro_to_Svelte.png
excerpt: The Await and Key blocks
published: published
slug: svelte-basics-sugar-syntax-await-and-key-blocks
start: June 1, 2022
title: Svelte Basics - Sugar Syntax Await and Key Blocks
weight: 12
youtube: https://youtu.be/ADqGFpSUp8o
---
## Await

If we have asynchronous data coming in from an outside source that we need to wait on, we can “await” that data and do something with it using an await block. We can set a pending state or omit it completely and only show this markup once the data is received. We can also catch any errors that happen and display that to the user.

## Key

The last templating block in Svelte is the key block. A key block is special to Svelte because it works in conjunction with Svelte’s built in animations and transitions. This is a bit more complex, but let’s break it down. We are importing the fly transition that comes out of the box with Svelte and setting the count to 0 in the script tag. In the markup, we have a p tag with the text Count and then our key block. The key block is going to rerender the element inside of it each time count changes so that the transition plays. The span tag is styled with display: inline-block to make it appear next to the Count text. Next we are using the in directive, which plays as the element comes in, with the fly transition that we want to start up 20 px from where it ends. In the span tag, we are displaying the value of count. Here is the final rendered transition.