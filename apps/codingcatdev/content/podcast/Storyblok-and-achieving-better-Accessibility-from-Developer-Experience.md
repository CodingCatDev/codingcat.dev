---
type: podcast
authors:
  - alex-patterson
  - brittney-postma
anchor: https://anchor.fm/purrfect-dev/episodes/2-44---Svelte--Accessibility--DX-with-Josefine-Schaefer-e1pj1ll
episode: 44
recording_date: October 13, 2022 2:15 PM
season: 2
published: published
podcast: CodingCat.dev
calendarid: d87ebc82-c959-4b5a-8c96-e568ed0c5ada
chapters_done: false
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1666368014/main-codingcatdev-photo/Storyblok%20and%20achieving%20better%20Accessibility%20from%20Developer%20Experience.png
devto: https://dev.to/codingcatdev/244-svelte-accessibility-dx-with-josefine-schaefer-2lbg
excerpt: All about Storyblok and how achieving better A11y can be done through developer experience.
guests:
  - josefine-schaefer
  - alex-jover-morales
hashnode: https://hashnode.codingcat.dev/podcast-2-44-contentblok-accessibility
picks:
  [
    { author: 'alex-patterson', name: 'The Boolean Game', site: 'https://boolean.method.ac/' },
    {
      author: 'alex-patterson',
      name: 'VSCode Pets',
      site: 'https://marketplace.visualstudio.com/items?itemName=tonybaloney.vscode-pets'
    },
    {
      author: 'brittney-postma',
      name: 'House of the Dragon',
      site: 'https://www.hbo.com/house-of-the-dragon'
    },
    {
      author: 'brittney-postma',
      name: 'Gitako',
      site: 'https://chrome.google.com/webstore/detail/gitako-github-file-tree/giljefjcheohhamkjphiebfjnlphnokk?hl=en-US'
    },
    {
      author: 'alex-jover-morales',
      name: 'Tekken Bloodline',
      site: 'https://www.netflix.com/title/81002441'
    },
    {
      author: 'josefine-schaefer',
      name: 'What Font',
      site: 'https://chrome.google.com/webstore/detail/whatfont/jabopobgcpjmedljpbcaablpmlmfcogm?hl=en'
    },
    {
      author: 'josefine-schaefer',
      name: 'Soudns Like a Cult',
      site: 'https://www.soundslikeacult.com/'
    }
  ]
slug: Storyblok-and-achieving-better-Accessibility-from-Developer-Experience
sponsors:
  - jamstackconf
  - storyblok
spotify: https://open.spotify.com/episode/7HghjPmPWz34g48L6quVkX?si=RisJUtzYTl-zPMUpdosm9g
start: October 19, 2022 12:00 PM
title: Storyblok and achieving better Accessibility from Developer Experience
youtube: https://youtu.be/QBCUuaD2d7g
---

# Coding Together: Improving DX and Accessibility with Svelte and Storyblock

Welcome back to another episode of CodingCat Dev, where we discuss the latest and greatest in web development! Today we have two special guests - Josephine from Storyblock and Alex from VueDos. This episode is brought to you by Storyblock, the flexible headless CMS that gives developers and content creators the freedom to build anything.

But first, a quick word from our sponsor Storyblock:

> We know that creating content can be a tedious balancing act. Developers want flexibility to make seamless digital experiences, while content teams need the tools to work independently and make changes without everything falling apart. We met our limits using plugin after plugin and waiting weeks for edits – all for this. We knew it was time to rebuild the blocks.
>
> Storyblock gives marketers creative control to visually edit content and developers are no longer restrained to a set of technologies. Storyblock makes it simple for teams to work together with localization and personalization tools, and allows you to publish on all channels and devices.
>
> The truth is, we all want the same thing - to deliver the right information to the right destination at the right time. Come try Storyblock at [jamstack.com](https://jamstack.com)

And don't forget to grab your tickets for Jamstack Conf in San Francisco November 6-7 at [jamstack.org/conf](https://jamstack.org/conf)!

Alright, let's dive into today's topic - how Svelte and Storyblock can improve developer experience (DX) and accessibility.

Brittany: Thanks for joining us Josephine and Alex! Why don't you both introduce yourselves quickly?

Josephine: Hi everyone! I'm Josephine and I'm based in Germany. I'm on the developer relations team at Storyblock working together with Alex.

Alex: Same here, I'm on the developer relations team at Storyblock. I'm Alex and you may know me from VueDos, where I share Vue tips and tricks. I'm joining you today from Brussels since we have a conference here tomorrow.

Brittany: Awesome to have you both on the show today! We were originally thinking of focusing just on Svelte and accessibility, since Josephine and I have chatted about it before. But I think we can tie in Storyblock really nicely as we discuss how these technologies can improve DX and accessibility.

So let's start with the basics - why are accessibility and DX important to each of you? Josephine, do you want to go first?

Josephine: Of course! I think accessibility and DX really go hand in hand in a lot of ways. When I first started in web development coming from a very different background, accessibility wasn't something I thought much about. But I quickly realized that our goal as developers should be to make our content and apps as inclusive as possible. Accessibility is key for allowing as many people as possible to interact with our content.

And DX is like the flip side of that same coin - we want to make it as easy as possible for developers to create accessible and inclusive experiences. DX is about streamlining the process so developers can make the right choices.

Brittany: Love that perspective! Accessibility is not just about the end product, but also the tools and systems behind it. Alex, what are your thoughts on dev experience and accessibility?

Alex: Great point. I like to think of DX as UX for developers - it's about making difficult things easy through better tooling and systems. Svelte is a great example of prioritizing DX - it removes a lot of the complexity so you can focus on building accessible apps.

Brittany: Awesome. So how does Svelte play into accessibility and improving DX?

Josephine: When I first learned about Svelte, I was drawn in by its tagline "Accessibility First". It makes accessibility considerations easy to implement upfront. For example, I get compiler warnings if I forget an alt attribute on an image. Having accessibility built into the framework means I spend less time worrying about it later.

It's all about putting the tools in the developer's toolbox from the start. And that frees up mental space to think about even more ways to improve accessibility.

Alex: I don't have as much experience with Svelte specifically, but it seems like a great example of how frameworks can enhance DX around accessibility versus having to bolt it on later. The compiler can catch issues that otherwise would fall through the cracks.

Brittany: Definitely! I think Svelte and Storyblock could make a great team for improving DX and accessibility. How do they complement each other?

Josephine: In theory they are made for each other! Both prioritize performance, accessibility, and thinking in components. Once we get over some of the rough patches integrating them, it will be a power couple!

Brittany: Let's see it in action! How about we do a quick code demo to show how Storyblock and SvelteKit could work together?

_The group then walks through creating a new SvelteKit project connected to a Storyblock space, running into a few hiccups with package versions along the way. They show how to call the Storyblock API to pull in content blocks and how to connect it to real-time editing in Storyblock._

Josephine: So in summary, there are three key steps to integrate Storyblock into a Svelte project:

1. Install the [Storyblock](https://www.storyblok.com/docs/requirements-installation-updates#installation) SDK
2. Initialize in `main.js` with your access token
3. Use the Storyblock utilities like `useStoryblock` and `useBridge` to connect your components

The magic happens when you can edit live in Storyblock and see the changes reflected immediately in your Svelte components.

Alex: A few bumps there, but it shows the potential! I'm looking forward to seeing how the integrations mature over time.

Brittany: Me too! I think Storyblock solves a lot of content problems for JAMstack sites and Svelte is a great fit.

But we're running short on time - let's wrap up with some perfect picks!

_Each person shares a favorite productivity tool, TV show, game, or other recommendation_

Brittany: Thanks again Josephine and Alex for joining us today! Excited to see you both at upcoming conferences.

Josephine &amp; Alex: Thank you, this was great!

Brittany: And don't forget to check out Storyblock's revamped ambassador program - it's a great way to get involved in the community and learn more about JAMstack and headless CMS.

That's a wrap for this episode of CodingCat Dev. Stay tuned for more chats at the intersection of web development, creativity, and community!

## Links

- [https://www.w3.org/standards/webdesign/accessibility](https://www.w3.org/standards/webdesign/accessibility)
- [Vue A11y](https://vuejs.org/guide/best-practices/accessibility.html)
- [Storyblok Ambassador Program](https://www.storyblok.com/ambassadors)
