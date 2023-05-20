---
type: lesson
authors:
  - alex-patterson
cloudinary_convert: false
cover: 'https://media.codingcat.dev/image/upload/v1683216921/main-codingcatdev-photo/courses/svelte/stores'
excerpt: 'Svelte data stores are a way to manage application state that is shared between components.'
published: published
slug: data-stores
start: April 17, 2023
stackblitz: 'https://stackblitz.com/github/CodingCatDev/svelte-course/tree/14-data-stores?embed=1&file=apps/svelte-site/src/routes/%2Bpage.svelte'
title: 'Learn Svelte: The Ultimate Guide - Data Stores'
weight: 14
youtube: https://youtu.be/goxNKlQAb0U
---

In Svelte, stores are a way to manage application state that is shared between components. They are created using the `writable()` function from the `svelte/store` module.

## Writeable Store

To create a writable store, you pass the initial value of the store as the first argument to the `writable()` function. For example, the following code creates a store called `count` with an initial value of 0:

```svelte
import {writable} from 'svelte/store'; const count = writable(0);
```

Once you have created a store, you can subscribe to it using the `subscribe()` method. The `subscribe()` method takes a callback function as its argument. This callback function will be called whenever the value of the store changes.

For example, the following code subscribes to the `count` store and updates the value of a `h1` element whenever the value of the store changes:

```svelte
<h1>The count is {$count}</h1>

count.subscribe(value => {
  document.querySelector('h1').innerText = `The count is ${value}`;
});
```

In addition to the `subscribe()` method, writable stores also have a `set()` method. The `set()` method allows you to set the value of the store. For example, the following code sets the value of the `count` store to 1:

```svelte
count.set(1);
```

Finally, writable stores also have an `update()` method. The `update()` method allows you to update the value of the store using a function. For example, the following code updates the value of the `count` store by incrementing it by 1:

```svelte
count.update(n => n + 1);
```

Writable stores are a powerful way to manage application state in Svelte. They allow you to share state between components and to update state in a reactive way.

Here are some additional tips for using writable stores:

- Use descriptive names for your stores. This will make it easier to understand your code and to debug problems.
- Avoid mutating the state of a store directly. Instead, use the `set()` or `update()` methods to update the state of the store.
- Use subscriptions to listen for changes to the state of a store. This will allow you to update the UI in response to changes to the state of the store.
- Use the `readonly` keyword to create read-only stores. This will prevent components from accidentally mutating the state of the store.

## Auto Subscriptions

Svelte also has a feature called auto-subscriptions. Auto-subscriptions allow you to subscribe to a store without having to explicitly call the subscribe() method. To use auto-subscriptions, you simply declare the store variable at the top level of your component. For example, the following code declares a store variable called count at the top level of the App component:

```ts
import { writable } from 'svelte/store';

const count = writable(0);

export default {
	name: 'App',
	components: {},
	data() {
		return {
			count
		};
	}
};
```

An easier way of using auto subscribe is to use the `$` syntax.

```svelte
<script>
	import { count } from './stores.js';
	import Incrementer from './Incrementer.svelte';
	import Decrementer from './Decrementer.svelte';
	import Resetter from './Resetter.svelte';
</script>

<h1>The count is {$count}</h1>
```

### Benefits of auto-subscriptions

There are several benefits to using auto-subscriptions:

It makes your code more concise. You don't have to explicitly call the subscribe() method, which can make your code more concise.
It makes your code more maintainable. If you need to add or remove subscriptions, you can do so without having to search through your code for explicit calls to the subscribe() method.
It makes your code more performant. Auto-subscriptions only subscribe to stores that are actually used in your component. This can improve the performance of your application by preventing unnecessary subscriptions.
Conclusion

Auto-subscriptions are a powerful feature that can make your Svelte code more concise, maintainable, and performant. If you're not already using auto-subscriptions, I encourage you to give them a try.

## Svelte Derived Stores

To create a derived store, you use the derived() function from the svelte/store module. The derived() function takes a function as its first argument. This function takes the values of the input stores as its arguments and returns the value of the derived store.

For example, the following code creates a derived store called elapsed that is based on the time store:

```ts
import { derived } from 'svelte/store';

const elapsed = derived((time) => Math.round(($time - start) / 1000));
```

The elapsed store will be updated whenever the time store is updated. This means that you can use the elapsed store to get the elapsed time without having to worry about manually updating it.

Derived stores are a powerful way to manage application state in Svelte. They allow you to create stores that are based on the value of other stores. This can make your code more concise and easier to maintain.

### Benefits of using derived stores

There are several benefits to using derived stores:

Conciseness: Derived stores can make your code more concise. For example, instead of having to write a function to calculate the elapsed time, you can simply use the elapsed store.
Maintainability: Derived stores can make your code more maintainable. If you need to change the way that the elapsed time is calculated, you can simply change the function that is used to create the elapsed store. You don't have to search through your code for all of the places where the elapsed time is calculated.
Performance: Derived stores can improve the performance of your application. When you use a derived store, Svelte only updates the derived store when the input stores are updated. This can improve the performance of your application by preventing unnecessary updates.
