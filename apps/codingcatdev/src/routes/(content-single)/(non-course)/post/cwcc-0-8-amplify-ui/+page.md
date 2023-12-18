---
type: post
authors:
  - alex-patterson
episode: 8
recording_date: 'August 19, 2022 10:45 AM'
season: 0
published: published
podcast: code-with-coding-cat
chapters_done: false
cloudinary_convert: false
cover: >-
  https://media.codingcat.dev/image/upload/v1659308888/main-codingcatdev-photo/Amplify-UI.jpg
excerpt: >-
  Amplify UI is a collection of accessible, themeable, performant React (and
  more!) components that can connect directly to the cloud.
preview: >-
  https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=podcast&selectionSlug=Amplify-UI&_id=fbe488bf6b204daea1e634eb1768b1b9
slug: cwcc-0-8-amplify-ui
start: 'August 19, 2022'
title: Live Coding with the Amplify UI team
youtube: 'https://youtu.be/weT3YwBZt-k'
devto: >-
  https://dev.to/codingcatdev/live-coding-with-the-amplify-ui-team-1596-temp-slug-3596967
---

## AWS Amplify UI: Build UI Fast with Amplify on React

[AWS Amplify UI](https://ui.docs.amplify.aws/) is a set of React components that make it easy to build beautiful and responsive user interfaces. The components are built on top of the Amplify framework, which provides a unified way to connect your app to backend services.

Amplify UI is designed to be easy to use, even for beginners. The components are well-documented and there are plenty of examples to help you get started.

In this blog post, we'll show you how to use Amplify UI to build a simple todo app.

## Getting Started

The first step is to install Amplify UI. You can do this with the following command:

```bash
npm install @aws-amplify/ui
```

Once Amplify UI is installed, you can start using the components in your app.

## Creating a Todo List

To create a todo list, we'll use the following components:

- `AmplifyCard`: This component is used to create a card that displays a todo item.
- `AmplifyInput`: This component is used to create a text input field.
- `AmplifyButton`: This component is used to create a button.

Here's the code for our todo list:

```js
import React from 'react';
import { AmplifyCard, AmplifyInput, AmplifyButton } from '@aws-amplify/ui';

const TodoList = () => {
	const [todos, setTodos] = useState([]);

	const addTodo = () => {
		const newTodo = {
			text: e.target.value
		};

		setTodos([...todos, newTodo]);
	};

	return (
		<div>
			<AmplifyCard>
				<h2>Todo List</h2>
				<ul>
					{todos.map((todo, index) => (
						<li key={index}>
							{todo.text}
							<AmplifyButton onClick={() => setTodos(todos.filter((t) => t.id !== todo.id))}>
								Delete
							</AmplifyButton>
						</li>
					))}
				</ul>
			</AmplifyCard>

			<AmplifyInput placeholder="Enter a new todo" onChange={(e) => addTodo()} />
		</div>
	);
};

export default TodoList;
```

This code will create a todo list with a text input field and a button. When you enter a todo item in the text input field and click the button, the item will be added to the list.

## What is next?

[AWS Amplify UI](https://ui.docs.amplify.aws/) is a powerful tool that can help you build beautiful and responsive user interfaces. The components are easy to use and well-documented, making them a great choice for beginners and experienced developers alike.

If you're looking for a way to build user interfaces quickly and easily, then [AWS Amplify UI](https://ui.docs.amplify.aws/) is a great option.
