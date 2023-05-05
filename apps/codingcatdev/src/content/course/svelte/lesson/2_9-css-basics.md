---
authors:
  - alex-patterson
cloudinary_convert: false
cover: 'https://media.codingcat.dev/image/upload/v1681939723/main-codingcatdev-photo/courses/svelte/css-basics.png'
excerpt: 'Svelte CSS component scope allows you to style components without affecting the rest of the page.'
published: draft
slug: css-basics
start: April 17, 2023
stackblitz: 'https://stackblitz.com/github/CodingCatDev/svelte-course/tree/07-component-events-forwarding?embed=1&file=apps/svelte-site/src/routes/%2Bpage.svelte'
title: 'Learn Svelte: The Ultimate Guide - CSS Basics'
weight: 2
youtube: https://youtu.be/4TYAjtbyTb4
---

## Scoped CSS in Svelte

Svelte is a modern JavaScript framework that is quickly gaining popularity among web developers. One of the things that makes Svelte so appealing is its use of scoped CSS. Scoped CSS allows you to style your components without affecting the rest of your application. This can be a huge advantage, especially when you are working on large projects with multiple developers.

To use scoped CSS in Svelte, you simply add a style block to your component definition. The style block can contain any valid CSS code. Svelte will automatically scope the CSS to the component, so it will only affect the elements that are within the component's scope.

For example, the following code defines a component with a style block:

```svelte
<script>
	export default {
		name: 'MyComponent',
		style: `
    h1 {
      color: red;
    }
  `
	};
</script>
```

This component will style all h1 elements within its scope to be red.

Scoped CSS can be a powerful tool for managing the style of your Svelte applications. By using scoped CSS, you can avoid CSS conflicts and keep your code organized.

Here are some additional benefits of using scoped CSS in Svelte:

- **Reduced CSS bloat:** Scoped CSS means that your CSS is only included in the component that needs it. This can help to reduce the overall size of your CSS bundle, which can improve performance.
- **Improved code organization:** Scoped CSS keeps your CSS code organized by component. This makes it easier to find and modify the CSS for a particular component.
- **Enhanced developer productivity:** Scoped CSS can help developers to be more productive by making it easier to write and maintain CSS code
