---
type: podcast
episode: 6
recording_date: January 26, 2023 2:15 PM
season: 3
published: published
podcast: CodingCat.dev
chapters_done: true
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1674078725/main-codingcatdev-photo/Effective-Testing-using-Cypress.io.jpg
devto: https://dev.to/codingcatdev/36-effective-testing-using-cypressio-35l2
excerpt: Jordan tells his story of becoming a Developer Advocate and demos testing Angular components using Cypress.io.
guests:
  - jordan-powell
hashnode: https://hashnode.codingcat.dev/podcast-3-6-Effective-Testing-using-Cypress.io
picks:
  [
    { author: 'alex-patterson', name: 'Scrimba', site: 'https://scrimba.com' },
    { author: 'alex-patterson', name: 'Nuts.js', site: 'https://nutsjs.dev' },
    { author: 'brittney-postma', name: 'New Amsterdam', site: 'https://www.nbc.com/new-amsterdam' },
    {
      author: 'brittney-postma',
      name: 'Svelte discord “This week in Svelte”',
      site: 'https://discord.gg/FQyMkqUX?event=1067950776619634729'
    },
    {
      author: 'brittney-postma',
      name: 'Svelte Sirens Testing in Svelte',
      site: 'https://sveltesirens.dev/events/testing-in-svelte'
    },
    {
      author: 'jordan-powell',
      name: 'Ernie Ball Music Man StingRay 5 HH',
      site: 'https://reverb.com/p/ernie-ball-music-man-stingray-5-hh-bass-guitar'
    }
  ]
slug: 3-6-Effective-Testing-using-Cypress.io
sponsors:
  - storyblok
spotify: https://open.spotify.com/episode/1i4smLpDSTwwzEqyohsJNM?si=Ai0qZ4fdTpmmbzFTasdHqw
start: February 22, 2023 12:00 AM
title: Effective Testing using Cypress.io
youtube: https://youtu.be/02xJskNqhow
---

## Podcast Questions

1. How did you get started at Cypress.io?
2. How did you get into DevRel?
3. Jordan tries to prove to Alex why he should test.
4. What is Unit vs. E2E Testing?
5. Angular Cypress Demo
6. Angular Component Testing

## More about Cypress.io

Are you tired of writing ineffective tests that only serve to clutter your codebase? Well, fear not my dear developers, because I'm here to introduce you to the magical world of [Cypress.io](http://cypress.io/) - the ultimate solution for all your testing woes.

With [Cypress.io](http://cypress.io/), testing has never been more enjoyable. In fact, it's so enjoyable that you might even forget you're testing at all! Just fire up Cypress and watch as it automagically clicks buttons, types in text boxes, and navigates through your app - all while you sit back and relax with a cup of coffee.

But don't let the ease of use fool you - Cypress is a powerhouse when it comes to testing. It's designed to handle even the most complex applications with ease. Let's take a look at some code examples to see just how effective Cypress can be.

Suppose you have a simple login form on your website. You want to test whether the form accepts valid credentials and rejects invalid ones. With Cypress, you can write a test like this:

```jsx
describe('Login form', () => {
	it('Accepts valid credentials', () => {
		cy.visit('/login');
		cy.get('#username').type('testuser');
		cy.get('#password').type('testpassword');
		cy.get('#login-btn').click();
		cy.url().should('eq', 'https://example.com/dashboard');
	});

	it('Rejects invalid credentials', () => {
		cy.visit('/login');
		cy.get('#username').type('invaliduser');
		cy.get('#password').type('invalidpassword');
		cy.get('#login-btn').click();
		cy.get('.error-msg').should('be.visible');
	});
});
```

In this example, we use Cypress's **`visit`** command to navigate to the login page. We then use the **`get`** command to select the username and password input fields and the login button. We simulate user input with the **`type`** command and simulate a button click with the **`click`** command. Finally, we use Cypress's assertion commands to verify that the user is redirected to the dashboard on successful login and that an error message is displayed on unsuccessful login.

But what if you're testing a more complex application, like a single-page app? Cypress can handle that too. Here's an example of testing a form submission in a React app:

```jsx
describe('Contact form', () => {
	it('Submits form successfully', () => {
		cy.visit('/');
		cy.get('[data-cy="name-input"]').type('Test User');
		cy.get('[data-cy="email-input"]').type('testuser@example.com');
		cy.get('[data-cy="message-input"]').type('This is a test message.');
		cy.get('[data-cy="submit-btn"]').click();
		cy.get('[data-cy="success-msg"]').should('be.visible');
	});
});
```

In this example, we use Cypress's **`data-cy`** attribute selectors to select the input fields and submit button. We simulate user input with the **`type`** command and simulate a button click with the **`click`** command. Finally, we use Cypress's assertion commands to verify that a success message is displayed on form submission.

And the best part? Cypress is so versatile that you can use it for just about any type of application. Whether you're testing a simple website or a complex single-page application, Cypress has got you covered.

So why waste time with ineffective testing when you can have the power of Cypress.io at your fingertips? Give it a try and see for yourself why developers everywhere are turning to Cypress for their testing needs. And who knows, you might even find yourself having fun in the process!

## Angular Testing with Cypress.io

To get started with Angular Component tests using Cypress.io, you need to have a basic understanding of [Angular](https://angular.io/) and [Cypress](https://www.cypress.io/). If you are new to Angular or Cypress, you can learn more about them on their respective official websites.

Now, let's dive into writing tests for an Angular Component using Cypress.io.

## Setting up Cypress.io in your Angular application

To set up Cypress.io in your Angular application, you need to follow these steps:

1. Install Cypress.io by running the following command in your Angular application's root directory:

   ```bash
   npm install cypress --save-dev
   ```

2. Once the installation is complete, add a script to your **`package.json`** file to run Cypress:

   ```json
   "scripts": {
     "cypress": "cypress open"
   }
   ```

3. Create a **`cypress.json`** file in the root directory of your Angular application and add the following configuration:

   ```json
   {
   	"baseUrl": "http://localhost:4200"
   }
   ```

4. Start your Angular application by running the following command in your terminal:

   ```bash
   ng serve
   ```

5. Finally, run the following command to open the Cypress test runner:

   ```bash
   npm run cypress
   ```

## Writing tests for an Angular Component using Cypress.io

Now that we have set up Cypress.io in our Angular application, let's write tests for an Angular Component.

For this tutorial, we will write tests for a simple Angular Component that displays a message on the screen.

Here's what the component looks like:

```tsx
import { Component } from '@angular/core';

@Component({
	selector: 'app-message',
	template: ` <div>{{ message }}</div> `
})
export class MessageComponent {
	message = 'Hello, world!';
}
```

Our component is very simple. It just displays a message on the screen.

Let's write some tests for this component using Cypress.io.

### Test 1: Ensure the message is displayed

Our first test will ensure that the message is displayed on the screen.

Here's what the test looks like:

```tsx
describe('MessageComponent', () => {
	beforeEach(() => {
		cy.visit('/message');
	});

	it('should display the message', () => {
		cy.get('app-message div').should('contain.text', 'Hello, world!');
	});
});
```

In this test, we first visit the **`/message`** route in our Angular application. Then, we use the **`cy.get()`** method to get the **`div`** element inside the **`app-message`** component and ensure that it contains the text **`Hello, world!`**.

### Test 2: Ensure the message can be changed

Our second test will ensure that the message can be changed by the user.

Here's what the test looks like:

```tsx
describe('MessageComponent', () => {
	beforeEach(() => {
		cy.visit('/message');
	});

	it('should allow the user to change the message', () => {
		cy.get('app-message div')
			.should('contain.text', 'Hello, world!')
			.click()
			.type('Hello, Cypress!')
			.should('contain.text', 'Hello, Cypress!');
	});
});
```

In this test, we first visit the **`/message`** route in our Angular application. Then, we use the **`cy.get()`** method to get the **`div`** element inside the **`app-message`** component and ensure that it contains the text **`Hello, world!`**.

Next, we simulate a click on the **`div`** element and type in the new message, "Hello, Cypress!". Finally, we assert that the **`div`** element contains the new message.

## Conclusion

In this tutorial, we learned how to write Angular Component tests using Cypress.io. We first set up Cypress.io in our Angular application and then wrote two tests for a simple Angular Component. These tests demonstrated how to ensure that a message is displayed on the screen and how to change the message using user input.

Writing tests for your Angular application is an important aspect of software development. Tests help you catch bugs early and ensure that your application works as intended. Cypress.io provides a powerful and easy-to-use testing framework that can help you write comprehensive tests for your Angular application.

## Learn more about Angular

- [Angular Material Course](https://codingcat.dev/course/angularmaterial)
- [Angular CLI Deploy](https://codingcat.dev/tutorial/angular-cli-deploying)
- [Debug Angular 9](https://codingcat.dev/post/debug-angular-9-in-chrome-console)
- [Adding Angular Components to your Static Site](https://codingcat.dev/post/adding-angular-components-to-your-static-site)
