---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1618944342/main-codingcatdev-photo/y7qzlepeu5tmeezlxef6.png
devto: https://dev.to/codingcatdev/aws-amplify-vs-aws-cdk-what-is-the-most-powerful-aws-iac-in-2020-1e1a
excerpt: AWS Amplify vs. AWS CDK. So you are just getting started with your next project and can't figure out what IaC to start with, lets compare two of AWS's most popular.
hashnode: https://hashnode.codingcat.dev/post-aws-amplify-vs-aws-cdk-2020
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=aws-amplify-vs-aws-cdk-2020&_id=b414a85e4b984834a02ba53a7e6e7143
published: published
slug: aws-amplify-vs-aws-cdk-2020
start: November 18, 2020
title: AWS Amplify vs. AWS CDK What is the most powerful AWS IaC in 2020?
---
## What are AWS Amplify and AWS CDK?

First things first acronyms are always a tough start to a post so lets clear up a few of them.

AWS's description for the AWS CDK

> The AWS Cloud Development Kit (AWS CDK) is an open source software development framework to define your cloud application resources using familiar programming languages.
> 
> 
> https://aws.amazon.com/cdk/
> 

AWS's description for AWS Amplify

> AWS Amplify is a set of products and tools that enables mobile and front-end web developers to build and deploy secure, scalable full stack applications, powered by AWS. With Amplify, you can configure app backends in minutes, connect them to your app in just a few lines of code, and deploy static web apps in three steps. Get to market faster with AWS Amplify.
> 
> 
> https://aws.amazon.com/amplify/
> 

At first glance it would seems like these two products are not related at all. However both are tools that you can use to build cloud applications while maintaining the resource definitions in your code, what we call Infrastructure as Code (IaC). There are several tools that help with IaC across many cloud platforms, but especially with AWS and we will cover those in further details.

The AWS CDK was released at AWS New Your Summit 2019 which you can watch Martin Beeby talk about in the below YouTube video.

[https://youtu.be/bz4jTx4v-l8](https://youtu.be/bz4jTx4v-l8)

The most amazing part about the CDK is that you can write your definitions in the language of your choice (well of the supported choices). At the time of this article the supported languages are TypeScript, JavaScript, Python, Java, and C#.

Developers can use one of the supported programming languages to define reusable cloud components known as [Constructs](https://docs.aws.amazon.com/cdk/latest/guide/constructs.html). You compose these together into [Stacks](https://docs.aws.amazon.com/cdk/latest/guide/stacks.html) and [Apps](https://docs.aws.amazon.com/cdk/latest/guide/apps.html).

Below you can see it is very readable in your IDE

![Untitled](https://media.codingcat.dev/image/upload/v1657680609/main-codingcatdev-photo/5fa49430-ba9b-4c2c-929c-f8fbb0829012.png)

From: [https://docs.aws.amazon.com/cdk/latest/guide/home.html](https://docs.aws.amazon.com/cdk/latest/guide/home.html)

To get started all you have to do is install the AWS CDK globally with npm like below.

Once you do this I would suggest reading through the [getting started guide](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html) that AWS provides.

### AWS Amplify

AWS Amplify was released in 2018, probably the best example of the release I could find was from Nader Dabit, Senior Developer Advocate at Amazon Web Services.

https://youtu.be/yp3nNcqH5is

I had an opportunity to sit down with Nader on [Purrfect.dev](https://codingcat.dev/podcasts/0-10-amplify-with-nader-dabit/) to discuss how AWS Amplify fits into a developer's ecosystem. You can see the video below

https://youtu.be/kUM8Zcb369U

Or please subscribe to the podcast and listen.

<iframe src="https://anchor.fm/purrfect-dev/embed/episodes/0-10---Amplify-with-Nader-Dabit-edvjpb/a-a3lu891" width="400px" height="102px" frameborder="0" scrolling="no"></iframe>

When you start using AWS Amplify you will notice that it is geared more towards the entire platform to be supported. Making it very simple for a Web or Mobile developer to get started very easy. The configurations for your backend are done mainly through the CLI and some configurations on your GraphQL (or REST) definitions.

## Why do they both exist?

What is similar between AWS CDK and AWS Amplify is that they both create CloudFormation files and deploy using AWS CloudFormation. This is the key when comparing them as Infrastructure as Code tools. However where the difference lies is the focus for each tool.

### AWS Amplify

AWS Amplify is all about mobile and web apps and has a very specific setup to get you writing your web or mobile application fast! It does this by using 3 components [libraries](https://aws.amazon.com/amplify/features/#Libraries), [UI components](https://aws.amazon.com/amplify/features/#UI_components), and a [CLI toolchain](https://aws.amazon.com/amplify/features/#CLI_toolchain). What Amplify does is allow for creating the below services very easily.

User registration & authentication

Offline synchronization & conflict resolution

Access data from multiple data sources

Manage user content

Collect analytics data for your app

AI/ML including text translations

Create conversational chatbots

Send targeted communications

Manage messaging & subscriptions

Much of this is done via the CLI and one comment that I hear a lot is that there is too much hidden "magic" that is happening when using the CLI to create all of these configurations.

If you know for a fact that your next application is going to need tools outside of the ones listed above I would look to leverage another IaC like AWS CDK. The biggest thing is going to be developer happiness and testability within your application. If you spend all day fighting with customized CloudFormation written in customized JSON resources in AWS Amplify your developers are probably going to start to dislike the maintenance of the entire Amplify solution.

The wonderful part about both AWS Amplify and AWS CDK is that they are both powered by CloudFormation, so you get all the benefits of CloudFormation, including repeatable deployment, easy rollback, and drift detection.

Both tools also allow you to develop infrastructure and runtime code together.

One of the biggest things that I believe AWS CDK has that Amplify does not are the idea of Constructs. Constructs are vetted architecture patterns, available as an open-source extension of the AWS Cloud Development Kit (CDK), that can be easily assembled declaratively to create a production-ready workload. You can find an entire [AWS Solutions Constructs repository](https://aws.amazon.com/solutions/constructs/patterns/).

So a great example of using the CDK over Amplify would be if you are developing an IoT solution. This isn't a great fit for Amplify but below are all the Constructs that will get you started quickly.

![https://media.codingcat.dev/image/upload/v1657680609/main-codingcatdev-photo/53ab91f1-4b07-4b32-9176-39105129c4b3.png](https://media.codingcat.dev/image/upload/v1657680609/main-codingcatdev-photo/53ab91f1-4b07-4b32-9176-39105129c4b3.png)

There is a great list of features still coming on the [AWS CDK roadmap](https://github.com/orgs/aws/projects/7).

## So is AWS Amplify or AWS CDK the most powerful in 2020?

I know you read through all of the above and you did your best to already formulate an opinion and that was my goal. Don't let the tools stop you from creating exactly what you need, make sure you list out what you are trying to accomplish and then you can easily determine what IaC will work best for you. I believe as long as you have your Infrastructure in some type of code and it allows you to repeat your work easily, that is going to be the best solution for you.

WHY NOT BOTH??

Better yet if you are looking to start with AWS Amplify and then continue building on top of this base you absolutely can! Checkout Nader Dabit's *Mixing Amplify with CDK - Building an Authenticated GraphQL API with TypeScript on AWS*

https://youtu.be/rjiiNpJzOYk

## Alternative IaC Tools

Ernesto Garbarino has a great article breaking down [Infrastructure as Code](https://spacelift.io/blog/infrastructure-as-code) over on Spacelift. He breaks down the benefits and disadvantages of IaC. There is also a great list of tools for SCM that they have listed as well.

If you haven't watched [Purrfect.dev's Pulumi Episode](https://codingcat.dev/podcasts/infrastructure-as-code-with-pulumi/) you should check it out now!

[https://youtu.be/X0LF2LugNTY](https://youtu.be/X0LF2LugNTY)