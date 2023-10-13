---
type: lesson
authors:
  - anthony-campolo
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1684519320/main-codingcatdev-photo/courses/solidjs-intro/basics.png
locked: locked
published: draft
section: Basics
slug: basics
title: Solid Basics
weight: 2
---

## File System Based Routing

File System Based Routing is a popular approach for managing routes in modern JavaScript frameworks, including SolidJS. It simplifies the process of defining routes by mapping URL paths to files in your project's directory structure.

The framework auto-generates routes based on the file and directory naming/structure. Something like a `pages` or `routes` folder is usually used and each page will be a file inside of the directory. For example, `routes/about.js` would correspond to the `"/about"` route.

```bash
mkdir src/routes
echo > src/routes/index.jsx
```

The `@solidjs/router` library is available to handle routing in your SolidJS applications. This library allows you to explicitly define routes and associate them with components that should be rendered when those routes are matched.

This example is currently showing how to install and create your routing setup from scratch. Later in the tutorial we will use SolidStart which has `@solidjs/router` included by default.

Create and export an `App` component that displays a header and link to the SolidJS GitHub repository.

```jsx
// src/routes/index.jsx

export default function App() {
  return (
    <div class="App">
      <header class="header">
        <h1>A First Look at Solid</h1>
        <a class="link" href="https://github.com/solidjs">
          Learn Solid
        </a>
      </header>
    </div>
  )
}
```

## Styling

While Solid can be used with popular styling libraries or framework like [Tailwind](https://tailwindcss.com/docs/guides/solidjs), this example will only use vanilla CSS. Create a file called `root.css` in `src` to hold all global styles.

```bash
echo > src/root.css
```

Include the following styling in that file:

```css
/* src/root.css */

body {
  margin: 0;
  font-family: system-ui;
  -moz-osx-font-smoothing: grayscale;
}

.App {
  text-align: center;
}

.header {
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
}

.link {
  color: #b318f0;
}
```

Import the `App` component into `root.jsx` file.

```jsx
// src/root.jsx

/* @refresh reload */
import { render } from 'solid-js/web'
import App from './routes/index'
import './root.css'

render(
  () => <App />,
  document.getElementById('root')
)
```

![A page showing A First Look at Solid text](https://media.codingcat.dev/image/upload/v1684519512/main-codingcatdev-photo/courses/solidjs-intro/02-solid-home-page-with-styling.png)

## Components and Reactive Primitives

When building applications with Solid, there are two foundational concepts that form the building blocks at the core of the framework. These are **Components** and the **Reactive Primitives** which include Signals, Effects, and Memos. Before diving into the first Reactive Primitive, let's cover components briefly.

```bash
mkdir src/components
echo > src/components/Counter.jsx
```

A Component is a function that accepts a `props` object and returns JSX elements. It is a lightweight factory function that does not hold state itself. Adding an `input` tag after `BasicComponent` in the following example lets you change the value being passed as `props`.

```jsx
// src/components/Counter.jsx

const BasicComponent = (props) => {
  const value = () => props.value || 'default'
  return <div>{value}</div>
}

export default function Counter() {
  return (
    <div>
      <BasicComponent value={value()} />
      <input type="text" oninput={(e) => setValue(e.currentTarget.value)} />
    </div>
  )
}
```

But where is the value coming from in the first place and where it is being stored and modified when state changes in your application?

### Create Signal

**[Signals](https://www.solidjs.com/tutorial/introduction_signals)** are the most basic reactive primitive and all reactivity in Solid is based around them. So what are Signals exactly? Signals contain values that change over time. The framework tracks these changing values and broadcasts them to the rest of interface.

A signal automatically updates anything tracking it every time the signal's value is changed. This ensures the changing values are reflected in real time. The value being tracked can be any JavaScript object. These trackable signals require observers that can be updated by those trackable values.

The `createSignal` function takes an `initialValue` as its first argument and returns a getter and a setter. Together, these form a pair of functions as a two-element array, which in this example contain `getValue` and `setValue`.

```jsx
// src/components/Counter.jsx

import { createSignal } from 'solid-js'

const initialValue = 0

export default function Counter() {
  const [getValue, setValue] = createSignal(initialValue)
  console.log(getValue())
  // getValue() == 0

  return <div>Value: {getValue()}</div>
}
```

Import the `Counter` component to `src/routes/index.jsx` and return `<Counter />` underneath the heading and link tag.

```jsx
// src/routes/index.jsx

import Counter from '../components/Counter'

export default function App() {
  return (
    <div class="App">
      <header class="header">
        <h1>A First Look at Solid</h1>
        <a class="link" href="https://github.com/solidjs">
          Learn Solid
        </a>
        <Counter />
      </header>
    </div>
  )
}
```

This modifies the state directly by running `getValue` as a function. But your component will only display a value of 0 right now and there is no way to change it. To do this, we have to change the `Counter` component so the value will be set with `setValue`.

```jsx
// src/components/Counter.jsx

import { createSignal } from 'solid-js'

const initialValue = 0
const newValue = 1

export default function Counter() {
	const [getValue, setValue] = createSignal(initialValue)
	setValue(newValue)
	console.log(getValue()) // getValue() == 1

	return (
    <>
      Value: {getValue()}
    </>
  )
}
```

### Create Effect

An **[Effect](https://www.solidjs.com/tutorial/introduction_effects)** is an example of an observer that runs a side effect depending on a signal. Effects are a way to make general, arbitrary code (also known as side effects) run whenever dependencies change.

[createEffect](https://www.solidjs.com/docs/latest#createeffect) creates a new computation (for example to modify the DOM manually) and runs the given function in a tracking scope.

```jsx
// src/components/Counter.jsx

import { createSignal, createEffect } from 'solid-js'

export default function Counter() {
  const [count, setCount] = createSignal(0)
  createEffect(() => count())

  return (
    <>
      <button onClick={() => setCount(count() + 1)}>
        Click Me
      </button>

      <div>The count is now: {count()}</div>
    </>
  )
}
```

This automatically tracks the dependencies and reruns the function whenever the dependencies update.

![A browser showing a Click Me Button with a count of 1](https://media.codingcat.dev/image/upload/v1684519511/main-codingcatdev-photo/courses/solidjs-intro/04-create-effect-button.png)

### Create Resource

The `createResource` function is designed for asynchronous data handling in your application. It is invoked with an asynchronous fetcher function and returns a signal that updates with the fetched data when the operation completes. The fetcher function can be anything that returns a promise, such as a function to fetch data from a server. Create a component file called `Users.jsx` that will fetch users from the `jsonplaceholder.typicode.com` API.

```bash
echo > src/components/Users.jsx
```

`createResource` can be used in two different ways:

1. You can pass only the fetcher function as an argument. In this scenario, the fetcher function will be invoked only once when the resource is created.
2. You can pass a source signal as the first argument, followed by the fetcher function. In this case, whenever the source signal changes, it will trigger the fetcher function again. The source signal's value will be passed as an argument to the fetcher function.

```jsx
// src/components/Users.jsx

import { createResource } from 'solid-js'

const fetchUser = async () => (
  await fetch(`https://jsonplaceholder.typicode.com/users?_limit=5`)
).json()

export default function Users() {
  const [user] = createResource(fetchUser)

  return (
    <div>
      <span>{user.loading && 'Loading...'}</span>
      <pre>{JSON.stringify(user(), null, 2)}</pre>
    </div>
  )
}
```

This demonstrates the first way of using `createResource` since it involves passing the fetcher function (`fetchUser` in this case) as the sole argument to `createResource`. The fetcher function is only invoked once when the resource is created and does not re-run based on changes to any signals. To run the fetcher function, import the `Users` component in the `App` component.

```jsx
// src/routes/index.jsx

import Counter from '../components/Counter'
import Users from '../components/Users'

export default function App() {
  return (
    <div class="App">
      <header class="header">
        <h1>A First Look at Solid</h1>
        <a href="https://github.com/solidjs">
          Learn Solid
        </a>
        <Counter />
        <Users />
      </header>
    </div>
  )
}
```

![Browser window showing a count of 1 with a list of names](https://media.codingcat.dev/image/upload/v1684519512/main-codingcatdev-photo/courses/solidjs-intro/05-onmount-displaying-users.png)