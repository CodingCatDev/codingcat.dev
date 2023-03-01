---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1646791334/main-codingcatdev-photo/Intro_to_Svelte.png
excerpt: Reactivity
published: published
slug: svelte-basics-reactivity
start: June 1, 2022
title: Svelte Basics - Reactivity
weight: 13
youtube: https://youtu.be/HrhJ8sApEZc
---
## Assignments

Welcome back, earlier we talked about Svelte’s reactivity needing an assignment. For a state change to trigger a re-render, it needs to be assigned a new value. Because of this, some JavaScript methods, like push and splice won’t automatically trigger updates. We need to explicitly reassign the value.

## Statements

Statements can also be made reactive by prefixing it with the dollar sign colon syntax. These can be single values or grouped with a block.