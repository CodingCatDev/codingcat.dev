---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1644851521/main-codingcatdev-photo/Divvy.jpg
devto: https://dev.to/codingcatdev/how-to-achieve-169-resolution-while-using-divvy-on-a-mac-1iog
excerpt: Perfecting screen capture for HD videos on a Mac, using Divvy. Download your own template.
hashnode: https://hashnode.codingcat.dev/post-how-to-achieve-16-9-resolution-while-using-divvy-on-a-mac
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=how-to-achieve-16-9-resolution-while-using-divvy-on-a-mac&_id=b39aafad45d44dd296c8dc37f10e35e0
published: published
slug: how-to-achieve-16-9-resolution-while-using-divvy-on-a-mac
start: March 19, 2022
title: How to achieve 16:9 resolution while using Divvy on a Mac
---

Have you ever tried to record a video and notice that it is a few pixels off? Lets fix that so you can produce good quality videos!

## Easy Solution

So before I go down this crazy exercise, I do want to call out one of the simpiliest tricks to when recording videos. Just hide the menubar on MacOS.

![https://media.codingcat.dev/image/upload/v1657636767/main-codingcatdev-photo/1d56ac09-1005-4fe4-a2b7-f7b540f90d4e.png](https://media.codingcat.dev/image/upload/v1657636767/main-codingcatdev-photo/1d56ac09-1005-4fe4-a2b7-f7b540f90d4e.png)

## Is this still a dev post?

Most of the time as a developer I am looking for cool side projects. It just so happens that I have been looking for an excuse to try out Remix as we have been looking to partner with them at [Builder](https://builder.io/).

What I wanted to do was create a simple tool that would calculate what to set Divvy's margins to so that I can capture my screen correctly for recording both at [Builder.io](https://builder.io/) and [CodingCat.dev](https://codingcat.dev/).

I wanted to have a little fun with it and added a downloadable background for you computer that has the menubar set, the margins called out, and the amount of boxes you are using within Divvy add by using [Cloudinary's React SDK](https://cloudinary.com/documentation/react_integration) and overlays.

> 
> 
> 
> Dont care about the math? Cool I don't really either but I needed to understand it to write this purrfect [Divvy Calculator](https://divvy.codingcat.dev/). See something broken, PR's more than welcome. [GitHub Repo](https://github.com/CodingCatDev/divvy-screen-size)
> 

Quick example of the Cloudinary transformation code below.

```jsx
// Apply the transformation.
  myImage
    // Crop the image.
    .resize(thumbnail().width(reducedWidth).height(reducedHeight))
    //Menu Bar
    .overlay(
      source(
        image(`1`).transformation(
          new Transformation()
            .resize(
              fill()
                .width(Math.round(reducedWidth))
                .height(Math.round(menuBarHeight))
            )
            .effect(new ColorizeEffectAction().color("#391").level("colorize"))
        )
      ).position(new Position().gravity(compass(northWest())))
    )
    //Margin left
    .overlay(
      source(
        image(`1`).transformation(
          new Transformation()
            .resize(
              fill()
                .width(Math.round(reducedScreenMargin / 2))
                .height(Math.round(reducedScreenHeight))
            )
            .effect(new ColorizeEffectAction().color("red").level("colorize"))
        )
      ).position(
        new Position()
          .gravity(compass(northWest()))
          .offsetY(reducedMenuBarHeight)
      )
    )
    .overlay(
      source(
        image(`1`).transformation(
          new Transformation()
            .resize(
              fill()
                .width(Math.round(reducedScreenMargin / 2))
                .height(Math.round(reducedScreenHeight))
            )
            .effect(new ColorizeEffectAction().color("red").level("colorize"))
        )
      ).position(
        new Position()
          .gravity(compass(northEast()))
          .offsetY(reducedMenuBarHeight)
      )
    );

```

## MacOS and the menu bar

When you are using a display on a Mac the windows all stay under the menu bar at the top. So your beautify 4K monitor that you are recording on will be in a purrfect 56.25% ratio (2160/3840) also commonly referred to as 16:9 (9/16).

So if you screen is 4K 3840px by 2160px, and your menu is 24px high then your actual usable height is 2160px - 24px => 2136px. Which of course means it will be 3840px by 2136px so if we divide 2136/3840.

## How Divvy Window Manager Works

[Divvy](https://mizage.com/windivvy/) allows you to break your monitor up into sections columns by rows shown below.

![https://media.codingcat.dev/image/upload/v1657636765/main-codingcatdev-photo/55f21eff-6df0-4703-9c0e-3ef55f295b8b.png](https://media.codingcat.dev/image/upload/v1657636765/main-codingcatdev-photo/55f21eff-6df0-4703-9c0e-3ef55f295b8b.png)

This is an amazingly simple, but yet very powerful tool. You can break your screen up into anything from 1x1 all the way to 10x10 blocks. There are a lot more features check out the below video to see more of what is possible.

<div style={{overflow: 'hidden',paddingTop: '56.25%', position: 'relative', width: '100%', height: '0px'}}> <div style={{width: '100%', height:'100%',position: 'absolute', top: 0, left: 0}}> <iframe src="https://www.youtube.com/embed/Z6eBPC-4ZOY" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style={{width: '100%', height:'100%'}}></iframe> </div> </div>

[https://www.youtube.com/embed/Z6eBPC-4ZOY](https://www.youtube.com/embed/Z6eBPC-4ZOY)

## What is the big deal

So if you are using Divvy Window Manager and placing your windows into 4 equal locations, what this really means is that you will end up with a ratio closer to 55.625%. This small difference of only .625 might not seem like much but when you are producing a 4K screen capture those 40+ pixels really show up (trust me)!

![https://media.codingcat.dev/image/upload/v1657636764/main-codingcatdev-photo/a8d482b2-2c84-4bcb-b682-04e63405be66.jpg](https://media.codingcat.dev/image/upload/v1657636764/main-codingcatdev-photo/a8d482b2-2c84-4bcb-b682-04e63405be66.jpg)