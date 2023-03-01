---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1646791334/main-codingcatdev-photo/Intro_to_Svelte.png
excerpt: Styling
published: published
slug: fundamentals-styling-in-sveltekit
start: June 1, 2022
title: Svelte Fundamentals - Styling in Svelte
weight: 8
youtube: https://youtu.be/uWOOLfAN42w
---

Welcome back, in the last video there was one file we didn’t look at, the `__layout.svelte`. There may be times where you want a specific layout to be repeated on multiple pages, that’s exactly what this file does. By itself it will wrap the entire routes directory with whatever is in this file.

This can be overridden with a different layout by adding `.reset` to the filename in the folder you want to change.

Let’s look inside the main layout file. The first thing we see is a script tag just like a regular script tag in HTML. There is a Header being imported and we’ll also see the first way we can style our application, by importing a stylesheet. This is a regular CSS file that can be used to style things globally for the project.

Below the script block there is some markup that might look similar to HTML, but this is actually a superset of HTML providing some extra features. You may notice a tag you don’t recognize, a slot element. The slot is how Svelte knows where to put the content from the other routes. First the Header component is being used, then the main element and we are telling Svelte to place any other routes content inside of the main tag. Then, finally the footer is below.

If we scroll down further, we will see another way to Style in SvelteKit, with a style tag. CSS in a style tag is scoped by default in Svelte, which means these styles only affect elements in this file.

Also, if you aren’t using a style in that file, with the VSCode Svelte extension you see we get a nice visual warning that let’s us know. Although, any unused styles will be wiped out of your production code when it gets built, let’s switch this to the correct element to apply the styles. Now, we are correctly styling the a element to change the color of the link.

**`:global`** - Since styles are scoped by default, if there is a case where you need a style to apply everywhere in a project, you can use the global selector. We put the a element inside to select all the links on our site.**Libraries** - Finally, you can also use popular libraries like SASS or Tailwind as well. We will walk through installing these later in our starter kits.