---
type: podcast
authors:
  - alex-patterson
episode: 22
recording_date: 'Nov 13,2023 2:00 PM'
season: 3
published: published
podcast: CodingCat.dev
chapters_done: false
cloudinary_convert: false
cover: >-
  https://media.codingcat.dev/image/upload/v1700665455/main-codingcatdev-photo/3.23-fly.io.png
devto: 'https://dev.to/codingcatdev/speedrun-your-app-onto-flyio-1227'
excerpt: >-
  Fly is a platform for running full stack apps and databases close to your
  users
guests:
  - dov-alperin
hashnode: podcast-3-22-fly-io-with-dov-alperin
picks:
  - author: dov-alperin
    name: The Morning Show
    site: >-
      https://tv.apple.com/us/show/the-morning-show/umc.cmc.25tn3v8ku4b39tr6ccgb8nl6m
  - author: alex-patterson
    name: Sentry Performance Monitoring
    site: >-
      https://blog.sentry.io/performance-monitoring-for-every-developer-web-vitals-and-function/?original_referrer=https%3A%2F%2Fsentry.io%2F
slug: 3-22-fly-io-with-dov-alperin
sponsors:
  - storyblok
spotify: >-
  https://open.spotify.com/episode/5zS8lOvpTyl3SMK7Pd6mhz?si=BNyY0rPDSuyrJMQWyInn6g
start: 'Nov 15, 2023'
title: Speedrun Your App Onto Fly.io
youtube: 'https://youtu.be/JFObDifxL74'
---

In today's rapidly evolving digital landscape, businesses are constantly seeking ways to enhance their online presence, improve application performance, and deliver seamless user experiences. Enter edge computing, a transformative technology that brings computational resources closer to the end-users, enabling faster data processing, reduced latency, and enhanced scalability. Fly.io emerges as a frontrunner in this domain, providing a powerful JavaScript platform that empowers developers to build, deploy, and manage edge applications with unparalleled ease and efficiency.

## Interview with Dov from Fly.io

I was lucky enough to sit down and chat with Dov to learn more about his background and Fly.io.

> "Fly.io has a lot of really powerful primitives if you want to build a platform." - Dov

### Dov's Background

Dov actually started working with Fly.io through open source! He created a Terraform provider for their platform which brought him to their attention. Really cool example of open source kickstarting a career.

Some key things about Dov:

- Platform Engineer at Fly.io focused on infrastructure.
- Got into tech through freelance work across React, Node and some Go.
- Learned a lot through open source contributions.
- Currently getting a formal CS degree to complement his experience.

### Why Fly.io for Frontend Devs?

When your app is running closer to users, it improves performance since requests don't need to travel as far. Let's think through an example...

Say you build an amazing new social media app called **CodingCat Social**. It starts to gain traction and users from all over the world begin signing up. If your back end was only running in a single region like US-East, any requests from Africa would need to make a long round trip before getting a response.

With Fly.io, you could deploy your containerized app to regions close to your users. Now when someone in Hong Kong goes to load their feed, it will pull from a local instance rather than one halfway across the world!

### How it Works

Fly.io makes it easy to deploy docker containers globally. Under the hood they utilize:

- [Firecracker microVMs](https://firecracker-microvm.github.io/)
- A network overlay for communication
- Automated services like PostgreSQL databases in regions
- Easy scaling to add instances via CLI

There are also partnerships in the work to offer fully managed databases and other data services all running on Fly.io's infrastructure. Pretty cool!

### CI/CD and Integrations

Since Fly.io uses the standard Docker tooling, it works nicely with CI/CD pipelines. Dov showed an example deploying a Remix app through GitHub Actions. It uses the [Fly CLI](https://fly.io/docs/getting-started/installing-flyctl/) and the syntax looks identical to local commands.

Here is what that workflow looks like:

1. Make code changes and push to GitHub
2. GitHub Actions runs tests and builds docker image
3. Use Fly CLI to deploy freshly built container
4. Image runs on Fly.io edge closest to you

They also have integrations for other tools like Terraform if you want to manage infrastructure as code. Overall, it seems pretty straightforward to get up and going!

## Revolutionizing Content Delivery with Fly.io's Global Edge Network

At its core, Fly.io is a global edge network that transforms containers into micro-VMs, strategically distributed across 30+ regions on six continents. This extensive network enables developers to deploy their applications closer to their target audience, significantly reducing latency and ensuring lightning-fast content delivery. Whether you're serving static content, dynamic web applications, or APIs, Fly.io ensures that your users receive content with minimal delay, regardless of their geographical location.

Learn more about [Fly.io's global edge network](https://community.fly.io/t/what-difference-between-edge-and-instace/8797)

## Harnessing the Power of JavaScript for Edge Application Development

Fly.io differentiates itself from other edge computing platforms by embracing JavaScript as its primary language. This choice empowers developers to utilize their existing JavaScript skills and seamlessly transition to edge application development. With Fly.io, developers can write, test, and deploy their applications locally using familiar JavaScript frameworks and tools, eliminating the learning curve associated with new programming languages or complex infrastructure setups.

[Discover Fly.io's JavaScript-centric approach](https://fly.io/docs/js/)

## Simplified Deployment and Management for Effortless Edge Operations

Deploying and managing edge applications can often be a daunting task, requiring specialized expertise and intricate configurations. Fly.io simplifies this process by providing a user-friendly interface and intuitive command-line tools. Developers can effortlessly deploy their applications to any region in the world with just a few clicks or commands, ensuring a smooth and hassle-free deployment experience.

[Learn how to deploy and manage edge applications with Fly.io](https://techcrunch.com/2022/07/28/fly-io-wants-to-change-the-way-companies-deploy-apps-at-the-edge/)

## Unleashing the Scalability of Edge Applications

As user demand fluctuates, edge applications must adapt accordingly. Fly.io's auto-scaling capabilities dynamically adjust the number of micro-VMs allocated to each application based on real-time traffic patterns. This ensures that your applications can handle spikes in demand without performance degradation or downtime, providing a consistent and reliable user experience.

[Explore Fly.io's auto-scaling capabilities](https://fly.io/docs/apps/scale-count/)

## Ensuring Security at the Edge

In today's interconnected world, security remains paramount. Fly.io prioritizes security by employing a robust network architecture and implementing industry-standard security protocols. This safeguards your applications and data from unauthorized access, ensuring that your users' privacy and sensitive information are protected.

With Fly.io, you can rest assured that your [cat website](https://codingcat.dev) is safe and secure. Your cat photos and videos will be protected from prying eyes, and your users' personal information will be kept confidential.

[Read more about Fly.io's security measures](https://fly.io/docs/about/security/)

## Real-World Applications of Fly.io

Fly.io's versatility and ease of use have made it a popular choice for a wide range of applications. From high-traffic websites and e-commerce platforms to real-time gaming experiences and IoT applications, Fly.io empowers developers to build and deploy edge applications that deliver exceptional performance and scalability.

In addition to deploying cat websites, Fly.io can be used to build a variety of other applications, such as:

- **Live streaming video chat platforms**
- **Real-time gaming applications**
- **IoT applications**
- **E-commerce platforms**
- **High-traffic websites**

[Explore some real-world use cases of Fly.io](https://community.fly.io/t/use-cases-applications-for-fly/204)

## Fly.io: A Catalyst for Innovation in the Edge Computing Era

As edge computing continues to revolutionize the digital landscape, Fly.io stands as a powerful platform that empowers developers to create innovative and high-performance edge applications. With its global edge network, JavaScript-centric approach, simplified deployment and management, auto-scaling capabilities, and robust security measures, Fly.io is poised to play a pivotal role in shaping the future of edge computing.

## Wrap Up

That summarizes the key points from my chat with Dov. Fly.io is an interesting platform for running applications globally at the edge for better performance. If your users are distributed, it's worth checking out!

I want to thank Dov again for joining me. Make sure to [Follow Fly.io on Twitter](https://twitter.com/flydotio) and keep tabs on their new offerings coming soon including GPU instances and managed data services.

Until next time, happy coding!
