---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1646791334/main-codingcatdev-photo/Intro_to_Svelte.png
excerpt: File Based Routing
published: published
slug: fundamentals-file-based-routing
start: June 1, 2022
title: Fundamentals - File Based Routing
weight: 7
youtube: https://youtu.be/XdhthjV9R7o
--- 

Let’s dive into the next benefit of SvelteKit, file based routing. Any time you create a SvelteKit project, it automatically comes with a routes directory. Any new file created inside of the routes directory becomes a new url that you can visit. This means the structure of your project is defined and easily tracked inside the routes folder. At the base level, the index.svelte file goes to the home route or the ‘/’ slash that appears after your domain name. Any new file inside that folder, will automatically track to a url of the same name. The about file will be at /about.

New folders can also be created to hold files that are relevant to the routes inside it. For example, in the blog directory, the index.svelte file would go to /blogroute. We can also add dynamic routes by using square brackets around the name of the file as seen in [post].svelte. This tells SvelteKit that whatever is inside the brackets is changeable. What you put inside the brackets doesn’t matter, you can name it whatever you want,. It relates to the route parameter, what comes after the last / in the route you are on. So, in this blog example it would grab each of the posts id and add it after /blog giving us a route for each individual post.

We also get access to [endpoints in SvelteKit](https://www.youtube.com/https://www.youtube.com/watch?v=NHWCtmmDIjo). Endpoints are where you handle all of your backend logic with HTTP requests like GET and POST . This allows us to communicate between other internal or external APIs and what shows on the page. They only run on the server and bridge the gap between the backend and frontend code.

You get all of this out of the box with SvelteKit without having to set anything up yourself. Next we’ll look at some options you can use to style your SvelteKit projects.

[https://www.sitepoint.com/svelte-fetch-data/](https://www.sitepoint.com/svelte-fetch-data/)