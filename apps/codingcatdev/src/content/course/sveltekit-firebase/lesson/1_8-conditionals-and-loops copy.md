---
cloudinary_convert: false
cover: 'https://media.codingcat.dev/image/upload/v1681906158/main-codingcatdev-photo/courses/svelte/Svelte-5.png'
excerpt:
published: draft
slug: conditionals-and-loops
start: April 17, 2023
stackblitz: 'https://stackblitz.com/github/CodingCatDev/svelte-firebase-course/tree/08-conditionals-and-loops?embed=1&file=apps/svelte-site/src/routes/+page.svelte'
title: Conditionals and Loops
weight: 8
youtube:
---

## Conditionals and Loops in Svelte

Svelte is a modern JavaScript framework that is quickly gaining popularity among web developers. One of the things that makes Svelte so powerful is its ability to express logic in the component's code. This is done using conditionals and loops.

## Conditionals

Conditionals are used to make decisions in code. They are used to check if a condition is true or false, and then execute different code depending on the result.

Svelte has two types of conditionals: if-else statements and switch statements.

## If-Else

**If-else statements** are used to check if a condition is true or false. If the condition is true, the code inside the if block will be executed. If the condition is false, the code inside the else block will be executed.

For example, the following code checks if the variable `isLoggedIn` is true or false. If it is true, the code inside the if block will be executed. If it is false, the code inside the else block will be executed:

```svelte
{#if isLoggedIn}
	<h1>You are logged in!</h1>
{:else}
	<h1>You are not logged in!</h1>
{/if}
```

## Switch

<alert class="bcu-alert variant-soft-primary">This is still in the works 😸</alert>

**Switch statements** are used to check if a value is equal to one of a set of values. If the value is equal to one of the values, the code inside the corresponding case block will be executed.

For example, the following code checks if the variable `myNumber` is equal to 1, 2, or 3. If it is equal to 1, the code inside the case 1 block will be executed. If it is equal to 2, the code inside the case 2 block will be executed. If it is equal to 3, the code inside the case 3 block will be executed. If it is equal to any other value, the code inside the default block will be executed:

```
{#switch myNumber}
  {case 1}
    <h1>My number is 1!</h1>
  {case 2}
    <h1>My number is 2!</h1>
  {case 3}
    <h1>My number is 3!</h1>
  {default}
    <h1>My number is not 1, 2, or 3!</h1>
{/switch}
```

## Each Blocks

Each blocks are used to iterate over a collection of data and render a component for each item in the collection. The syntax for each blocks is as follows:

```svelte
{#each items as item}
	<MyComponent {...item} />
{/each}
```

The `items` variable is an array of items. The `MyComponent` component is a component that will be rendered for each item in the array. The `...item` syntax is used to pass the current item in the array to the `MyComponent` component.

For example, the following code will render a list of items:

```svelte
<ul>
	{#each items as item}
		<li>{item.name}</li>
	{/each}
</ul>
```

In this example, the `items` variable is an array of objects. The `MyComponent` component is a component that will be rendered for each object in the array. The `...item` syntax is used to pass the current object in the array to the `MyComponent` component.

**Conclusion**

Conditionals and loops are powerful tools that can be used to control the flow of code in Svelte components. By understanding how to use conditionals and loops, we can build more complex and sophisticated components.
