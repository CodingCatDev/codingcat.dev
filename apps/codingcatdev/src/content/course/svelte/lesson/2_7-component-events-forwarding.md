---
authors:
  - alex-patterson
cloudinary_convert: false
cover: 'https://media.codingcat.dev/image/upload/v1681939723/main-codingcatdev-photo/courses/svelte/component-events.png'
excerpt: 'Event forwarding is a powerful tool that can be used to communicate between components in Svelte.'
published: published
slug: component-events-forwarding
start: April 17, 2023
stackblitz: 'https://stackblitz.com/github/CodingCatDev/svelte-course/tree/07-component-events-forwarding?embed=1&file=apps/svelte-site/src/routes/%2Bpage.svelte'
title: 'Learn Svelte: The Ultimate Guide - Component Events and Forwarding'
weight: 2
youtube: https://youtu.be/ZW8hGGwLB3Q
---

## Svelte Component Events and Forwarding Events

Svelte is a modern JavaScript framework that is quickly gaining popularity among web developers. One of the things that makes Svelte so powerful is its component-based architecture. Components are reusable pieces of code that can be used to build complex user interfaces.

In this blog post, we will discuss Svelte component events and forwarding events. We will learn how to create component events, how to forward component events, and how to use component events to communicate between components.

## What are Svelte Component Events?

Svelte component events are custom events that can be emitted by components. Component events can be used to communicate between components and to trigger other events.

To create a component event, we use the `on:eventname` directive. The `on:eventname` directive takes a function as its value. The function will be called whenever the event is emitted.

For example, the following code creates a component event called `click`:

```svelte
<button
	on:click={() => {
		// do something when the button is clicked
	}}
>
	Click Me!
</button>
```

## How to Forward Component Events

Svelte components can forward component events to their parent components. To forward a component event, we use the `emit:eventname` directive. The `emit:eventname` directive takes a value as its value. The value will be passed to the event handler when the event is emitted.

For example, the following code forwards the `click` event to the parent component:

```svelte
<button
	on:click={() => {
		// do something when the button is clicked
		this.$emit('click');
	}}
>
	Click Me!
</button>
```

## How to Use Component Events to Communicate Between Components

Svelte component events can be used to communicate between components. To use component events to communicate between components, we need to create a component event in one component and forward the event to the other component.

For example, the following code creates a component event called `click` in the `Button` component and forwards the event to the `App` component:

```svelte
<script>
import App from './App.svelte';

export default {
  name: 'Button',
  on:click={() => {
    // do something when the button is clicked
    this.$emit('click');
  }}
};
</script>
```

```svelte
<script>
import Button from './Button.svelte';

export default {
  name: 'App',
  on:click={() => {
    // do something when the button is clicked
  }}
};
</script>
```

In this example, the `Button` component emits the `click` event when the button is clicked. The `App` component listens for the `click` event and calls a function when the event is emitted.

## Conclusion

Svelte component events are a powerful way to communicate between components. By understanding how to use component events, we can build web applications that are both interactive and responsive.
