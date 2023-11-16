---
type: podcast
authors:
  - alex-patterson
  - brittney-postma
episode: 6
recording_date: August 17, 2022 6:00 PM
season: 0
published: published
podcast: code-with-coding-cat
chapters_done: false
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1657910422/main-codingcatdev-photo/Remix-with-KentCDodds.jpg
devto:
excerpt: Kent C. Dodds walks us through an Epic reveal of Remix
guests:
  - kent-c-dodds
hashnode:
picks:
slug: cwcc-0-6-remix-with-kent-c-dodds
sponsors:
spotify:
start: August 17, 2022
title: 'Remix with Kent C. Dodds'
youtube: https://youtu.be/ZWVYJOclIXY
---

<script lang="ts">
	import Video from '$lib/components/content/Video.svelte'
	import Shorts from '$lib/components/content/Shorts.svelte'
</script>

<Shorts />

Remix is a full-stack React framework that provides a seamless server and browser runtime for building modern web applications. It leverages distributed systems and native browser features to deliver snappy page loads, instant transitions, and a resilient user experience. Remix is built on top of the Web Fetch API, making it deployable to various environments, including serverless, traditional Node.js, and even non-Node.js environments like Cloudflare Workers.

**Getting Started with Remix**

To get started with Remix, follow the quickstart guide provided in the official documentation:

```bash
npx create-remix
```

This command will create a new Remix project and install the necessary dependencies. Once the project is created, you can start the development server using the following command:

```bash
npm run dev
```

The development server will open your browser to the Remix application. You can now start making changes to the code and see the results reflected in the browser immediately.

**Key Features of Remix**

Remix offers several key features that make it a powerful and versatile framework for building modern web applications:

- **Server-side rendering (SSR):** Remix can render React components on the server, providing SEO benefits and faster initial page loads.

- **Client-side rendering (CSR):** Remix also supports CSR, allowing for interactive and dynamic web applications.

- **Data fetching:** Remix provides built-in data fetching capabilities, making it easy to load data from APIs or other sources.

- **Routing:** Remix has a flexible routing system that supports both static and dynamic routes.

- **Forms:** Remix simplifies handling user input and form submissions.

- **Error handling:** Remix provides a robust error handling mechanism for graceful handling of errors and unexpected situations.

**The Epic Stack**

The Epic Stack is a popular architecture for building web applications using Remix, Tailwind CSS, and TypeScript. It combines the strengths of these tools to provide a productive and efficient development experience.

**Kent C. Dodds' Contributions to Remix**

Kent C. Dodds is a renowned developer and educator who has made significant contributions to the development of Remix. He is the creator of React Router, a popular routing library for React applications, and has been a key contributor to Remix's development since its inception.

**Examples of Remix Applications**

Remix has been used to build a variety of web applications, including:

- **Landbot:** A conversational AI platform

- **Vercel:** A cloud platform for deploying and hosting web applications

- **Superview:** A data visualization tool

- **Remix Academy:** An online course platform

**Code Snippets from Remix Documentation**

Here are some code snippets from the Remix documentation that demonstrate the framework's capabilities:

**Fetching data from an API:**

```jsx
import { useFetcher } from '@remix/data';

function MyComponent() {
	const { data } = useFetcher('/api/data.json');

	if (!data) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			{data.map((item) => (
				<div key={item.id}>
					<h2>{item.title}</h2>
					<p>{item.description}</p>
				</div>
			))}
		</div>
	);
}
```

**Handling form submissions:**

```jsx
import { useForm } from '@remix/forms';

function MyForm() {
	const { register, handleSubmit } = useForm();

	const onSubmit = (values) => {
		// Submit the form data to an API or perform other actions
		console.log(values);
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<input type="text" {...register('name')} />
			<input type="email" {...register('email')} />
			<button type="submit">Submit</button>
		</form>
	);
}
```

**Error handling:**

```jsx
import { ErrorBoundary } from '@remix/error-boundary';

function MyComponent() {
	return <ErrorBoundary>{/* Render your component here */}</ErrorBoundary>;
}
```

**Advantages of Using Remix**

Remix offers several advantages over other React frameworks:

- **Seamless server and browser runtime:** Remix provides a unified runtime that handles both server-side and client-side rendering, simplifying development and improving performance.

- **Resilient user experience:** Remix's use of distributed systems and native browser features ensures a responsive and reliable user experience, even under heavy load.

- **Deployment flexibility:** Remix can be deployed to various environments, including serverless, traditional Node.js, and non-Node.js

## Shorts

<Video title="Exciting future developments in Angular Router and Remix Router" src="https://youtube.com/shorts/kx5CVRBnhdI" />
<Video title="No JavaScript Needed State Management for Apps Made Easy" src="https://youtube.com/shorts/Mc0awq5d15A" />
<Video title="Mastering React Using Closures to Avoid Bugs" src="https://youtube.com/shorts/lvM-8rzPGgk" />
<Video title="Revolutionary Remix Ensuring Seamless JavaScript Experience for Users" src="https://youtube.com/shorts/RRa2mfs5YcQ" />
<Video title="Revolutionary Remix Router Revolutionizing UX and DX on a Server" src="https://youtube.com/shorts/TURK2J6yxfA" />
<Video title="Revolutionize your Web Experiences with Remix The Ultimate JavaScript Framework" src="https://youtube.com/shorts/5QOjDtmLWrU" />
<Video title="Revolutionizing Data Loading Remix Center Stack Simplifies JavaScript Development" src="https://youtube.com/shorts/LRBUVrFH27k" />
<Video title="Remix Center Stack Simplifies JavaScript Development" src="https://youtube.com/shorts/LRBUVrFH27k" />
<Video title="Data Management Remix Makes Network Tab a Breeze" src="https://youtube.com/shorts/GspbUXLmpeY" />
<Video title="Spicing Up My Background with a Neon Remix Sign" src="https://youtube.com/shorts/3UlJknYDV8w" />
<Video title="Unleash Your Creativity with the Ultimate Fake Books App in Remix" src="https://youtube.com/shorts/TbdZU7b2bKQ" />
