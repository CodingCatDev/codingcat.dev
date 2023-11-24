---
type: podcast
authors:
  - alex-patterson
episode: 2
recording_date: Dec 6, 2023 6:00 PM
season: 1
published: published
podcast: code-with-coding-cat
chapters_done: false
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1700824674/main-codingcatdev-photo/1.2-aws-amplify.png
devto:
excerpt: "Amplify, the wizard of SSR deployments, unveils its hosting prowess by default. New SSR apps roll out the red carpet using Amplify Hosting's compute service, with a backstage pass for the VIPs—Next.js 12 and 13 stealing the show."
guests:
  - erik-hanchett
hashnode:
picks:
slug: cwcc-1-2-aws-amplify
sponsors:
  - storyblok
spotify:
start: Jan 1, 2024
title: 'Next.js Amplified: Full-Stack Web & Mobile Apps on AWS'
youtube: https://youtube.com/live/Yy0XJP9ReJk?feature=share
---

Today, [AWS Amplify Hosting](https://aws.amazon.com/amplify/hosting/) announces Next.js 12 and 13 support. Your app can take advantage of Next.js features including server-side rendering (SSR), API routes, middleware, incremental static regeneration (ISR), and image optimization.

In combination with Next.js feature support, Amplify Hosting is improving the experience of running Next.js apps on AWS:

1. **Faster builds.** Next.js apps deploy at least 3x faster, helping developers deliver changes to production faster.
2. **Amazon CloudWatch integration.** Server-side logs are delivered to [Amazon CloudWatch](https://aws.amazon.com/cloudwatch/), allowing teams to observe, monitor and troubleshoot their apps.
3. **Next.js apps work seamlessly with Amplify back-ends** such as [Authentication](https://aws.amazon.com/amplify/authentication/) and [Data](https://docs.amplify.aws/start/getting-started/data-model/q/integration/next/).
4. **Fully managed hosting infrastructure** reduces operational overhead for development teams, with fewer resources to manage in your AWS account. To learn more about pricing visit <https://aws.amazon.com/amplify/pricing/>.

Follow the tutorial below to create and deploy your Next.js app to AWS with Amplify Hosting.

## Before you begin

This tutorial assumes the following prerequisites.

- You have an [AWS account](https://portal.aws.amazon.com/billing/signup).
- Node.js 16 and Next.js 13 are installed on your machine.
- You have some development experience including JavaScript, working in the terminal and using Git.

## Create a Next.js app

Open Terminal then enter the commands to create a new Next.js app with [Create Next App](https://nextjs.org/docs/api-reference/create-next-app) and change to the app’s directory.

```
npx create-next-app my-next-app-on-amplify --javascript --no-eslint
cd my-next-app-on-amplify
```

You will create two pages to demonstrate static site generation (SSG) and server-side rendering (SSR).

In your editor, replace the contents of the \``pages/index.js`\` file with the code below. The change creates a static page that displays the page’s build time.

```javascript
// pages/index.js
export default function Home({ formattedDate }) {
	return (
		<>
			<h1>Static page</h1>
			<p>This page is static. It was built on {formattedDate}.</p>
			<p>
				<a href="/ssr">View a server-side rendered page.</a>
			</p>
		</>
	);
}

export async function getStaticProps() {
	const buildDate = Date.now();
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		dateStyle: 'long',
		timeStyle: 'long'
	}).format(buildDate);

	return { props: { formattedDate } };
}
```

Now create a new \``pages/ssr.js`\` file containing the code below. The change creates a SSR page that displays the page’s render time.

```javascript
// pages/ssr.js
export default function SSR({ formattedDate }) {
	return (
		<>
			<h1>Server-side rendered page</h1>
			<p>This page is server-side rendered. It was rendered on {formattedDate}.</p>
			<p>
				<a href="/">View a static page.</a>
			</p>
		</>
	);
}

export async function getServerSideProps() {
	const renderDate = Date.now();
	const formattedDate = new Intl.DateTimeFormat('en-US', {
		dateStyle: 'long',
		timeStyle: 'long'
	}).format(renderDate);
	console.log(`SSR ran on ${formattedDate}. This will be logged in CloudWatch.`);
	return { props: { formattedDate } };
}
```

Commit your code to Git, then push your repository to a provider of your choice—Amplify supports AWS CodeCommit, GitHub, GitLab and Bitbucket.

## Deploy to Amplify Hosting

With your app pushed to a Git provider, you are ready to deploy to Amplify Hosting.

Start by visiting [the Amplify Console](https://console.aws.amazon.com/amplify/home). If you have not created an Amplify app before, scroll to the bottom of the page then select **Amplify Hosting > Host your web app > Get started**. If you have created an app before, select **New app > Host web app**.

![](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2022/11/15/Amplify-Web-Compute-01-Get-started.png)

Choose your Git repository hosting provider then select **Continue**.

![](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2022/11/15/Amplify-Web-Compute-02-Choose-git-provider.png)

Depending on your Git provider, you will be prompted to allow Amplify Hosting access to your repositories. After a successful authorization, choose the repository for this app from the **Recently updated repositories list** then select **Next**.

![](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2022/11/15/Amplify-Web-Compute-03-Add-repo.png)

On the **Build settings** page, Amplify automatically detects the correct build settings so there is no need to make any configuration change. Accept the default by selecting **Next**.

![](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2022/11/15/Amplify-Web-Compute-05-Build-settings.png)

On the **Review** page, select **Save and deploy**.

![](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2022/11/15/Amplify-Web-Compute-06-Review.png)

Your app will be created and you will be taken to the app’s page in the Amplify Console. Amplify Hosting will provision an isolated build and hosting environment for your project and deploy it. The process will take 2–3 minutes; you can monitor progress by selecting the **Provision**, **Build** or **Deploy** links as shown below.

![](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2022/11/15/Amplify-Web-Compute-07-Provision-build-deploy.png)

## View your app

![](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2022/11/15/Amplify-Web-Compute-08-Deploy-complete-1.png)

After the deploy phase is marked complete, selecting one of the **Provision**, **Build** or **Deploy** links will show the build summary page. Here you can see information about the build including its duration. Visiting the **Domain** link will take you to your app—the format is \``https://<branch-name>.<app-id>.amplifyapp.com`\`. As you navigate between the two pages, notice the build date on the static page does not change whereas the SSR page’s render date is updated on every page refresh.

The output of the \``console.log`\` function called on every server-side render is sent to CloudWatch. Select **App settings > Monitoring > Hosting compute log** from your app’s page in the Amplify Console for deep links to the app’s log streams so you can work with them in CloudWatch. For example, the screen shot below shows search results for \``This will be logged in CloudWatch`\`.

![](https://d2908q01vomqb2.cloudfront.net/0a57cb53ba59c46fc4b692527a38a87c78d84028/2022/11/16/Amplify-Web-Compute-11-CloudWatch.png)

## Learn more

Congratulations, you’ve successfully deployed a Next.js 13 app to Amplify Hosting. To learn more about Amplify Hosting’s features including [custom domain names](https://docs.aws.amazon.com/amplify/latest/userguide/custom-domains.html), [web previews for pull requests](https://docs.aws.amazon.com/amplify/latest/userguide/pr-previews.html) and [feature branches](https://docs.aws.amazon.com/amplify/latest/userguide/multi-environments.html) visit [docs.aws.amazon.com](https://docs.aws.amazon.com/amplify/latest/userguide/server-side-rendering-amplify.html).
