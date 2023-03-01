---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1646791334/main-codingcatdev-photo/Intro_to_Svelte.png
excerpt: Slots
published: published
slug: svelte-basics-slots
start: June 1, 2022
title: Svelte Basics - Slots
weight: 15
youtube: https://youtu.be/cJ03g4bjSFI
---
## Slots

Components in Svelte can also have content placed inside of them as a “child”. To tell Svelte where you want that content to be located, we use a `<slot />`. By default, any content added inside when a component is used will be located where the slot was placed. We can also have multiple children of a component by using named slots. We give each component a name, and then tell the component which slot to place the content in when the component is rendered.