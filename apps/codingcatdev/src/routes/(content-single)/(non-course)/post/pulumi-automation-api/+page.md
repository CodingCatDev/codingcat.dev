---
type: post
authors:
  - alex-patterson
cloudinary_convert: false
cover: 'https://media.codingcat.dev/image/upload/v1686165962/main-codingcatdev-photo/pulumi-automation-api.png'
devto:
excerpt: Databases that work well with serverless applications in 2023
hashnode:
published: published
start: June 8, 2023
title: 'Pulumi Automation API - Static Websites as a RESTful API'
youtube:
---

Lets get a little bit meta on this example. I am going to show you how to use a SvelteKit application with the <a target="_blank" rel="noopener noreferrer" href="https://www.pulumi.com/docs/using-pulumi/automation-api">Pulumi Automation API</a> to create other static websites!

## When to Use Pulumi Automation API

The Pulumi Automation API is a programmatic interface for running Pulumi programs without the Pulumi CLI. It allows you to embed Pulumi within your application code, making it easy to create custom experiences on top of Pulumi that are tailored to your use-case, domain, and team.

The Automation API is available in the Node, Python, Go, .NET, and Java SDKs. It provides a number of features that make it a powerful tool for building custom infrastructure automation solutions, including:

- **Strongly typed:** The Automation API is strongly typed, which means that you can be confident that your code will work as expected. This is in contrast to the Pulumi CLI, which is dynamically typed.
- **Safe:** The Automation API is safe, which means that it is difficult to make mistakes that could lead to infrastructure failures. This is because the Automation API uses a number of safeguards, such as type checking and validation, to prevent errors.
- **Extensible:** The Automation API is extensible, which means that you can customize it to meet your specific needs. This can be done by adding new commands, plugins, and other features.

The Automation API can be used for a variety of purposes, including:

- **CI/CD integration:** The Automation API can be used to integrate Pulumi with your CI/CD pipeline. This allows you to automate the deployment of your infrastructure to production.
- **Integration testing:** The Automation API can be used to write integration tests for your Pulumi programs. This helps to ensure that your infrastructure is working as expected.
- **Multi-stage deployments:** The Automation API can be used to support multi-stage deployments, such as blue-green deployments. This allows you to deploy new versions of your infrastructure without disrupting existing users.
- **Deployments involving application code:** The Automation API can be used to deploy infrastructure that is involved in the deployment of your application code. This can include things like database migrations and load balancers.
- **Building higher level tools:** The Automation API can be used to build higher level tools, such as custom CLIs over Pulumi. This can make it easier for developers to use Pulumi to manage their infrastructure.

If you are looking for a powerful tool for building custom infrastructure automation solutions, the Pulumi Automation API is a great option. It is available in a variety of languages and provides a number of features that make it a safe and extensible solution.

## Pulumi Over Http

This example is meant to show how you can use Pulumi's Automation API to create static websites hosted on AWS. The example utilizes SvelteKit API's so that you can expose infrastructure as RESTful resources. All the infrastructure is defined in inline programs that are constructed and altered on the fly based on input parsed from user-specified POST bodies. Be sure to read through the handlers to see how Automation API detect structured error cases such as update conflicts (409), and missing stacks (404).

You will find all of the code needed inside of `src/routes/api/stacks` and `src/routes/api/stacks/[id]`.

## SvelteKit Example Steps

1. First You enter content that is needed for the website you are creating, then click Create Site
1. A Pulumi stack is created with a Pulumi program that adds an `index.html` to a new bucket.
1. The stack has an output for `websiteUrl` that will show the new website.

### Pre-Requirements needed to run the example

1. A Pulumi CLI installation ([v3.0.0](https://www.pulumi.com/docs/install/versions/) or later)
1. The AWS CLI, with appropriate credentials. If you are on a Mac I would highly recommend using [Brew's AWS CLI](https://formulae.brew.sh/formula/awscli) if this is a first time setup. The below setup is how you can quickly set your aws access (although this is not best practice).

```bash
 aws configure
 AWS Access Key ID [*************xxxx]: <Your AWS Access Key ID>
 AWS Secret Access Key [**************xxxx]: <Your AWS Secret Access Key>
 Default region name: [us-east-2]: us-east-2
 Default output format [None]: json
```

### Run example localhost

Clone example

```bash
git clone https://github.com/codercatdev/pulumi-over-http.git
```

Install necessary packages

```bash
pnpm install
```

Run Dev Environment

```bash
pnpm dev
```

### List stacks

If you have used this example in the past you will see a listing page appear, if not you will see a message "No Sites Found".

![input box with create site](https://media.codingcat.dev/image/upload/v1686238749/main-codingcatdev-photo/b6a8ad6342a85385efed3eb1612022c6700f1e3dfe200e2a7a3efac2812a03be.png)

![stacks within project](https://media.codingcat.dev/image/upload/v1686238657/main-codingcatdev-photo/9e20606f542ec435da876efb0fda02835885f49965f360ffcefe86cd0fecd289.png)

In the `src/routes/+page.ts` we are using a load function to get our stacks from an API that we created.

```ts
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	const stacksRes = await fetch('/api/stacks');
	const stacks = await stacksRes.json();

	return {
		stacks
	};
}) satisfies PageLoad;
```

This is a `GET` http call that is calling our API found within `src/routes/api/stacks/+server.ts`.

```ts
import { listHandler } from './pulumi';

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
	return listHandler();
};
```

This GET method calls our `listHandler` function within `src/routes/api/stacks/pulumi.ts`, which lists stacks within a project called `pulumi_over_http`.

```ts
const projectName = 'pulumi_over_http';

// lists all sites
export const listHandler = (async () => {
	try {
		// set up a workspace with only enough information for the list stack operations
		const ws = await LocalWorkspace.create({
			projectSettings: { name: projectName, runtime: 'nodejs' }
		});
		const stacks = await ws.listStacks();
		return new Response(JSON.stringify(stacks));
	} catch (e) {
		return new Response(JSON.stringify(e), { status: 500 });
	}
}) satisfies RequestHandler;
```

### Create Site

On the homepage add the below code to the input box replacing "Hello World!" and click the "Create Site" button.

```html
<h1>Xena</h1>
<p>A domesticated, black crazy cat.</p>

<img
	src="https://media.codingcat.dev/image/upload/q_auto,f_auto,w_800/main-codingcatdev-photo/xena-blackcatui.jpg"
	alt="black cat sleeping"
/>
```

This form can be found in `src/lib/CreateSite.svelte` and includes the `onCreate` function to call our API.

![image showing creating button](https://media.codingcat.dev/image/upload/v1686238540/main-codingcatdev-photo/e40ad3b49c092ddfb2949a137f95d320a466977ca773f31977d268a960ca46c4.png)

```svelte
<script lang="ts">
	let creating = false;
	let content = 'Hello World!';

	const onCreate = async () => {
		creating = true;
		const resp = await fetch('/api/stacks', {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id: Date.now(), content })
		});
		const respJson = await resp.json();
		if (resp.status > 200) {
			alert('Error occured, see console.');
			console.error(content);
			creating = false;
		} else {
			window.location.href = `/${respJson.id}`;
		}
	};
</script>

<form class="flex w-full gap-2">
	<textarea class="flex-1 text-black" bind:value={content} />
	<button class="bcu-button variant-filled-primary" on:click={() => onCreate()} disabled={creating}>
		{#if creating}
			Creating...
		{:else}
			Create Site
		{/if}
	</button>
</form>
```

We have a new method inside of `src/routes/api/stacks/+server.ts` that handles this `POST` call and calls the `createHandler` function.

```ts
import { createHandler, listHandler } from './pulumi';

/** @type {import('./$types').RequestHandler} */
export const GET = async () => {
	return listHandler();
};

export const POST = async (requestEvent) => {
	return createHandler(requestEvent);
};
```

The `createHandler` function within `src/routes/api/stacks/pulumi.ts`, creates the new site within AWS.

```ts
// creates new sites
export const createHandler = (async ({ request }) => {
	const { id, content } = await request.json();
	const stackName = id;
	try {
		// create a new stack
		const stack = await LocalWorkspace.createStack({
			stackName,
			projectName,
			// generate our pulumi program on the fly from the POST body
			program: createPulumiProgram(content)
		});
		await stack.setConfig('aws:region', { value: 'us-west-2' });
		// deploy the stack, tailing the logs to console
		const upRes = await stack.up({ onOutput: console.info });
		return new Response(JSON.stringify({ id: stackName, url: upRes.outputs.websiteUrl.value }));
	} catch (e) {
		if (e instanceof StackAlreadyExistsError) {
			return new Response(`stack "${stackName}" already exists`, { status: 409 });
		} else {
			return new Response(JSON.stringify(e), { status: 500 });
		}
	}
}) satisfies RequestHandler;
```

A crucial part of this call is `LocalWorkspace.createStack` in which we pass `createPulumiProgram`. This program is what takes our input HTML, creates an S3 bucket, sets the correct permissions on the bucket, and creates the index.html file inside of that bucket, which returns the new websiteEndpoint.

```ts
// this function defines our pulumi S3 static website in terms of the content that the caller passes in.
// this allows us to dynamically deploy websites based on user defined values from the POST body.
const createPulumiProgram = (content: string) => async () => {
	// Create a bucket and expose a website index document
	const siteBucket = new s3.Bucket('s3-website-bucket', {
		website: {
			indexDocument: 'index.html'
		}
	});

	// Allow for policy update
	new s3.BucketPublicAccessBlock('bucketPublicAccessBlock', {
		bucket: siteBucket.bucket,
		blockPublicPolicy: false
	});

	// here our HTML is defined based on what the caller curries in.
	const indexContent = content;

	// write our index.html into the site bucket
	new s3.BucketObject('index', {
		bucket: siteBucket,
		content: indexContent,
		contentType: 'text/html; charset=utf-8',
		key: 'index.html'
	});

	// Create an S3 Bucket Policy to allow public read of all objects in bucket
	const publicReadPolicyForBucket = (bucketName: string): PolicyDocument => {
		const policy: PolicyDocument = {
			Version: '2012-10-17',
			Statement: [
				{
					Effect: 'Allow',
					Principal: '*',
					Action: ['s3:GetObject'],
					Resource: [
						`arn:aws:s3:::${bucketName}/*` // policy refers to bucket name explicitly
					]
				}
			]
		};
		console.log('POLICY: ', JSON.stringify(policy));
		return policy;
	};
	// Set the access policy for the bucket so all objects are readable
	new s3.BucketPolicy('bucketPolicy', {
		bucket: siteBucket.bucket, // refer to the bucket created earlier
		policy: siteBucket.bucket.apply(publicReadPolicyForBucket) // use output property `siteBucket.bucket`
	});

	return {
		websiteUrl: siteBucket.websiteEndpoint
	};
};
```

When all of this finishes happening you will be forwarded to the stack page for your site.

### View Stack

In the stack page view for your new site you will see the site url which will open the full website, along with an iframe view of that site which you just created.

![website link and iframe preview](https://media.codingcat.dev/image/upload/v1686238568/main-codingcatdev-photo/51835572a07cc1062709bb8b6b95ebfdf6803b236aef037e4322efa606b9bc6c.jpg)

In order to get the data for this stack, first capture the id in our Svelte load function at `src/routes/[id]/+page.ts`. You can do this by using the params object that is passed to the load.

```ts
import type { PageLoad } from './$types';

export const load = (async ({ fetch, params }) => {
	const stacksRes = await fetch(`/api/stacks/${params.id}`);
	if (stacksRes.status > 200) {
		console.error(stacksRes.status, stacksRes.statusText);
	}
	const stacks = await stacksRes.json();
	return {
		id: params.id,
		url: stacks?.url
	};
}) satisfies PageLoad;
```

We get the stacks information again from our API, in a new location `src/routes/api/stacks/[id]/+server.ts` that requires our id to be used in the typing for the params.

```ts
import { getHandler } from './pulumi';

export const GET = async (requestEvent) => {
	return getHandler(requestEvent);
};
```

The `GET` function calls the `getHandler` within `src/routes/api/stacks/[id]/pulumi.ts` and as you can see below we get the stack id from `params.id` and assign it to `stackName`.

```ts
// gets info about a specific site
export const getHandler = (async ({ params }) => {
	const stackName = params?.id;
	try {
		// select the existing stack
		const stack = await LocalWorkspace.selectStack({
			stackName,
			projectName,
			// don't need a program just to get outputs
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			program: async () => {}
		});
		const outs = await stack.outputs();
		return new Response(JSON.stringify({ id: stackName, url: outs.websiteUrl.value }));
	} catch (e) {
		if (e instanceof StackNotFoundError) {
			return new Response(`stack "${stackName}" does not exist`, { status: 404 });
		} else {
			return new Response(JSON.stringify(e), { status: 500 });
		}
	}
}) satisfies RequestHandler;
```

### Delete Stack

Now that the stack is created, it can be deleted by clicking the button "Delete Stack". This will remove all of the associated resources within AWS and remove your website.

![delete stack button](https://media.codingcat.dev/image/upload/v1686239332/main-codingcatdev-photo/368de20c40695ef6d8fdc8a48e69dfbbc5fc304f761d3f8419bbd6633ea1d2ab.png)

The Svelte component can be found at `src/lib/DeleteStack.svelte` and it contains the function `onDelete`.

```svelte
<script lang="ts">
	export let id = '';
	let deleting = false;

	const onDelete = async () => {
		deleting = true;
		const resp = await fetch(`/api/stacks/${id}`, {
			method: 'DELETE',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			}
		});
		if (resp.status > 200) {
			console.error(resp.statusText);
		} else {
			window.location.href = `/`;
		}
	};
</script>

<form>
	<button
		class="bcu-button bcu-button-sm variant-filled-secondary"
		on:click={() => onDelete()}
		disabled={deleting}
	>
		{#if deleting}
			Deleting...
		{:else}
			Delete Stack: {id}
		{/if}
	</button>
</form>
```

Within the `onDelete` function you can see the fetch call to `/api/stacks/${id}` with the method `DELETE`. This API can be found at `src/routes/api/stacks/[id]/+server.ts`.

```ts
import { deleteHandler, getHandler } from './pulumi';

export const GET = async (requestEvent) => {
	return getHandler(requestEvent);
};

export const DELETE = async (requestEvent) => {
	return deleteHandler(requestEvent);
};
```

As you can see the `DELETE` function calls `deleteHandler` within `src/routes/api/stacks/[id]/pulumi.ts`. Once again using the Pulumi Automation API you can use the [LocalWorkspace](https://www.pulumi.com/docs/using-pulumi/automation-api/concepts-terminology/#localworkspace) class to select the correct stack and then call the destroy and remove methods.

```ts
export const deleteHandler = (async ({ params }) => {
	const stackName = params.id;
	try {
		// select the existing stack
		const stack = await LocalWorkspace.selectStack({
			stackName,
			projectName,
			// don't need a program for destroy
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			program: async () => {}
		});
		// deploy the stack, tailing the logs to console
		await stack.destroy({ onOutput: console.info });
		await stack.workspace.removeStack(stackName);
		return new Response(undefined, { status: 200 });
	} catch (e) {
		if (e instanceof StackNotFoundError) {
			return new Response(`stack "${stackName}" does not exist`, { status: 404 });
		} else if (e instanceof ConcurrentUpdateError) {
			return new Response(`stack "${stackName}" already has update in progress`, { status: 409 });
		} else {
			return new Response(JSON.stringify(e), { status: 500 });
		}
	}
}) satisfies RequestHandler;
```

### Stack Update

For bonus points I have left a `PUT` method in `src/routes/api/stacks/[id]/+server.ts` which calls the`updateHandler` function in `src/routes/api/stacks/[id]/pulumi.ts`.

Try using the below code to wire up an update to the current stack for changing the website.

```ts
// updates the content for an existing site
export const updateHandler = (async ({ request, params }) => {
	const stackName = params?.id;
	const { content } = await request.json();
	try {
		// select the existing stack
		const stack = await LocalWorkspace.selectStack({
			stackName,
			projectName,
			// generate our pulumi program on the fly from the POST body
			program: createPulumiProgram(content)
		});
		await stack.setConfig('aws:region', { value: 'us-west-2' });
		// deploy the stack, tailing the logs to console
		const upRes = await stack.up({ onOutput: console.info });
		return new Response(JSON.stringify({ id: stackName, url: upRes.outputs.websiteUrl.value }));
	} catch (e) {
		if (e instanceof StackNotFoundError) {
			return new Response(`stack "${stackName}" does not exist`, { status: 404 });
		} else if (e instanceof ConcurrentUpdateError) {
			return new Response(`stack "${stackName}" already has update in progress`, { status: 409 });
		} else {
			return new Response(JSON.stringify(e), { status: 500 });
		}
	}
}) satisfies RequestHandler;
```
