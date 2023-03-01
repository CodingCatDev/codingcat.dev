---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1646791334/main-codingcatdev-photo/Intro_to_Svelte.png
excerpt: All about the amazing sugar syntax and short methods.
published: published
slug: svelte-basics-sugar-syntax-markup
start: June 1, 2022
title: Svelte Basics - Sugar Syntax Markup
weight: 10
youtube: https://youtu.be/Zz_PnjFeomQ
---

Svelte gives you some nice features that allows you to write less code while still keeping all the functionality. You can easily write any JavaScript inside of your HTML by putting it in `{}` curly braces. Here we declared a variable called count set to zero and can display that value in our markup. This is really powerful, because not only can you use variables and call functions, you can dynamically change anything with a little bit of logic. Here we are saying if the count is equal to 1 display time, otherwise show the plural form times.

```
count.svelte
```

Now let’s look at how Svelte handles events. Any DOM event can be used with the on colon on: directive. If we want to increase the count by clicking a button, then we only need to add the on:click to the button and write an inline function to increase the count by 1 each time it is clicked. It is important to note that Svelte is reactive by assignment. That means a variable needs to be assigned a new value in order to update. That equals is key here. The next bit of sugar syntax we’ll look at is Templating Blocks.

Say you wanted to change a CSS class based on a variable like so:

```css
so: class={active ? 'active' : ''}
```

This says that if the active variable is true, then give the element the class of active. If it is false, leave the class empty. Svelte takes this a step further though and makes it even easier with

```css
class:active={active}
```

If the name and the value match, you are able to shorten it even further to `class:active`.

```css
class:active
```

We can do the same with an inline style

```css
style="color: red;"
```

can be dynamic with

```css
style:color={color}
```

or the shorthand if they match

```css
style:color
```