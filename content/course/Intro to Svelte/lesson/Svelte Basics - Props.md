---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1646791334/main-codingcatdev-photo/Intro_to_Svelte.png
excerpt: Props
published: published
slug: svelte-basics-props
start: June 1, 2022
title: Svelte Basics - Props
weight: 14
youtube: https://youtu.be/SBLnGV4ld2Q
---

## Props

Before we talk about how to use props in Svelte, let’s review what a prop is. Props is short for properties and they are used to pass data between components. Variables and functions declared in a svelte file are only available inside that file unless we explicitly “export” them. We add the export keyword to the front of the declaration to allow other components to access it. This follows the same principle as modules where we export out and then import where we want to use it.

## Default Values

By default these values will be undefined and you will get a warning in development if you don’t pass a value to the component. To give a prop a default value, we simply set it to a value when we declare it. Here we gave prop a default value of the string prop and set count to 0.

## Using Props

To use the prop in another component, we import it and can then pass along different values. Here we gave prop a value of New Count and set the count to 3.