---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1646791334/main-codingcatdev-photo/Intro_to_Svelte.png
excerpt: 3 Kinds of templating blocks
published: published
slug: svelte-basics-sugar-syntax-logic-each-block
start: June 1, 2022
title: Svelte Basics - Sugar Syntax Logic and Each Blocks
weight: 11
youtube: https://youtu.be/tEvjQygygcA
---

Svelte provides 3 different kinds of templating blocks to make it easier to conditionally render something in your markup. These are the Logic blocks (if, else if, and else), the Each block for looping over arrays, Await for when you are waiting on async data, and Key to allow a transition to be played each time and expression changes.

## If, Else, and Else If

We can easily show or hide something in Svelte by creating a variable in the script tag and using Svelte’s if block, only show the content if the statement is truthy. I know that’s a funny word, but it just means that something resolves to true and falsey refers to false values. You can also add multiple statements using else if or an else block. This time we set the count to 0 and display different text based on the value of count.

## Each

For each loops can be a bit cumbersome to write in JavaScript and inside your markup it makes it difficult to tell what is going on. Svelte gives us an each block that will loop over an array. Here we created an array of different cat types and then in each loop we just say each cats as cat and can then use each value inside our list item. I’m using an image from Cat as a Service to dynamically grab a different cat by our type and setting the alt text to be each type followed by the word cat. Here is what is shown by this block, a cute cat, a fluffy cat, and a funny cat. Next we’ll talk about the Await block.