---
episode: 3
recording_date: January 5, 2023 2:15 PM
season: 3
published: published
podcast: CodingCat.dev
chapters_done: true
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1670526725/main-codingcatdev-photo/Tea-CLI.jpg
devto: https://dev.to/codingcatdev/33-tea-cli-teaxyz-3akf
excerpt: We chat with Max Howell about how he got started into OSS, why he helped to build Homebrew, and what he is building now with the Tea CLI.
guests:
  - max-howell
hashnode: https://hashnode.codingcat.dev/podcast-3-3-Tea-CLI
picks:
  [
    { author: 'alex-patterson', name: 'Oh My Git!', site: 'https://ohmygit.org' },
    { author: 'alex-patterson', name: 'ChatGPT', site: 'https://openai.com/blog/chatgpt/' },
    { author: 'brittney-postma', name: 'Minecraft', site: 'https://www.minecraft.net/en-us' },
    { author: 'brittney-postma', name: 'Skeleton.dev', site: 'https://www.skeleton.dev' },
    { author: 'max-howell', name: 'Warp Terminal', site: 'https://www.warp.dev/' }
  ]
slug: 3-3-Tea-CLI
sponsors:
  - storyblok
spotify: https://open.spotify.com/episode/58lsWx4oAwvV0cWRgzPDjH?si=psBsPDSyToyqQLSmhx6fZg
start: February 1, 2023
title: 'Tea CLI tea.xyz'
youtube: https://youtu.be/i-j3sf5uYf0
---

## Podcast Questions

1. Can you tell us more about yourself?
2. How did you become a developer, what was it like working at Apple?
3. Are you still maintaining brew in anyway?
4. How does a unified packaging infrastructure differ from a package manager?
5. What type of developer would use [tea.xyz](http://tea.xyz) for their stack?
6. White paper on Tea [https://tea.xyz/white-paper/](https://tea.xyz/white-paper/)

## Tea CLI

Are you tired of constantly switching between multiple tools to manage your projects, packages, and configurations? Do you wish there was a single, unified tool that could handle all of your development needs? Look no further than [Tea CLI](https://tea.xyz/tea-cli/) from [tea.xyz](https://tea.xyz/).

Tea CLI is a powerful command-line interface that helps developers manage all aspects of their projects. From creating a new project to deploying it, Tea CLI has got you covered. Let's take a closer look at some of the key features of Tea CLI and how to use them with Bash commands.

To get started with Tea CLI, you'll first need to install it on your system. Here's how you can do that using Bash:

```bash
curl -sL https://cli.tea.xyz/install.sh | bash
```

Once you have Tea CLI installed, you can create a new project using the **`create`** command. This command will generate a new project template with all the necessary files and dependencies.

```bash
tea create my-project
```

Tea CLI also comes with a built-in package manager called **`teapm`**. With **`teapm`**, you can easily install, update, and remove packages from your project. Here's how you can use **`teapm`** to install the **`lodash`** package:

```bash
tea teapm install lodash
```

To run your project, you can use the **`run`** command:

```bash
tea run
```

And to deploy your project, you can use the **`deploy`** command:

```bash
tea deploy
```

Tea CLI also provides a variety of configuration options to help you customize your project. You can view and modify the current configuration with the **`config`** command:

```bash
tea config
```

And you can set a specific configuration value using the **`set`** command:

```bash
tea config set key value
```

These are just a few examples of what you can do with [Tea CLI](https://github.com/teaxyz/cli). With its powerful features and easy-to-use interface, Tea CLI is a must-have tool for any developer. So why not give it a try and see how it can streamline your workflow and make your life easier?
