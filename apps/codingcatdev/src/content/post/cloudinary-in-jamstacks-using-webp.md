---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1600704486/ccd-cloudinary/cloudinary_webp.png
devto: https://dev.to/codingcatdev/cloudinary-in-jamstack-using-webp-38p2
excerpt: Create a single source for all of your posting needs, using the best format for the browser!
hashnode: https://hashnode.codingcat.dev/post-cloudinary-in-jamstacks-using-webp-1
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=cloudinary-in-jamstacks-using-webp&_id=26860022ff5f4392ae227a2297b04a8a
published: published
slug: cloudinary-in-jamstacks-using-webp
start: July 31, 2019
title: Cloudinary in Jamstack using Webp
---
# Cloudinary and Jamstacks

The awesome part about hosting on Cloudinary is that it provides a very extensive API for developers. However for content creators they often don't care that much about the technical aspects that are required to show images on the Web. We have been told repeatedly that storage is cheap and it doesn't matter if we just throw these images on an unmanaged server, or a CMS like Adobe AEM or Wordpress. However as we start moving more items to the "Cloud" pricing and functionality do start to matter, for both the producer and consumer of this content.

## What is Webp

> 
> 
> 
> WebP is a modern image format that provides superior lossless and lossy compression for images on the web. Using WebP, webmasters and web developers can create smaller, richer images that make the web faster.
> 

WebP lossless images are 26% smaller in size compared to PNGs. WebP lossy images are 25-34% smaller than comparable JPEG images at equivalent SSIM quality index. [Webp](https://developers.google.com/speed/webp/) is a format created by Google in 2010, and has been implemented in many of todays browsers.

### Why do we care about Webp

In many cloud based systems they will create several different image sizes which starts to add up on your storage costs. Now the consumer doesn't necessarily care about this cost for the producer. The consumer will care about how much data their phone is using and eating up their phone plan.

### How does Cloudinary make Webp easy?

HTTP Calls:Original Call 134 KBURL: [https://res.cloudinary.com/ajonp/image/upload/q_auto/ajonp-ajonp-com/blog/Cloudinary_-_Webp.webp](https://res.cloudinary.com/ajonp/image/upload/q_auto/ajonp-ajonp-com/blog/Cloudinary_-_Webp.webp)

![https://media.codingcat.dev/image/upload/v1657636767/main-codingcatdev-photo/990facc3-4189-47ec-915b-cbb8962fc956.png](https://media.codingcat.dev/image/upload/v1657636767/main-codingcatdev-photo/990facc3-4189-47ec-915b-cbb8962fc956.png)

Webp Call 49.7 KB - 63% reductionURL: [https://res.cloudinary.com/ajonp/image/upload/q_auto/ajonp-ajonp-com/blog/Cloudinary_-_Webp.webp](https://res.cloudinary.com/ajonp/image/upload/q_auto/ajonp-ajonp-com/blog/Cloudinary_-_Webp.webp)

![https://media.codingcat.dev/image/upload/v1657636767/main-codingcatdev-photo/7edfd877-9c56-4213-b9f8-ccad3d64b077.png](https://media.codingcat.dev/image/upload/v1657636767/main-codingcatdev-photo/7edfd877-9c56-4213-b9f8-ccad3d64b077.png)

Webp Call @ width of 800px 49.7 KB - 92.5% reductionURL: [https://res.cloudinary.com/ajonp/image/upload/w_800/v1564600835/ajonp-ajonp-com/blog/Cloudinary_-_Webp.webp](https://res.cloudinary.com/ajonp/image/upload/w_800/v1564600835/ajonp-ajonp-com/blog/Cloudinary_-_Webp.webp)

![https://media.codingcat.dev/image/upload/v1657636763/main-codingcatdev-photo/d0da1485-f7e8-434c-ac28-9f1bcc205507.png](https://media.codingcat.dev/image/upload/v1657636763/main-codingcatdev-photo/d0da1485-f7e8-434c-ac28-9f1bcc205507.png)

Without doing anything more than changing png to webp, you can automatically reduce the call by 63%. Now most software can take this a step further and authomatically consider the screen size that your browser should request so an example above would be to request the picture width is 800px ('w_800).

### Webp Support

As you can see below Webp format is supported in all major browsers except for Safari (and iOS Safari).

![https://media.codingcat.dev/image/upload/v1657636766/main-codingcatdev-photo/0492fb46-673b-417b-ac30-40813df7fa1f.png](https://media.codingcat.dev/image/upload/v1657636766/main-codingcatdev-photo/0492fb46-673b-417b-ac30-40813df7fa1f.png)

[https://caniuse.com/#feat=webp](https://caniuse.com/#feat=webp)As you can see on Android using Chrome there is no issue with looking up the image using Webp.

![https://media.codingcat.dev/image/upload/v1657636763/main-codingcatdev-photo/978c35b2-c5cc-40d0-901f-86e941b46372.jpg](https://media.codingcat.dev/image/upload/v1657636763/main-codingcatdev-photo/978c35b2-c5cc-40d0-901f-86e941b46372.jpg)

When we attempt this on Safari the browser treats this as a file and downloads it.

![https://media.codingcat.dev/image/upload/v1657636768/main-codingcatdev-photo/c2a149c7-36f0-4c8c-bc58-1e757b8c0ca4.png](https://media.codingcat.dev/image/upload/v1657636768/main-codingcatdev-photo/c2a149c7-36f0-4c8c-bc58-1e757b8c0ca4.png)

### HTML picture to the rescue

So as a developer I can't honestly say "well just have people use anything except Safari". So how do we solve this 100% of the time? HTML `<picture>` element is in for the rescue! When the

```
<picture>
  <source
    srcset="https://res.cloudinary.com/ajonp/image/upload/q_auto/ajonp-ajonp-com/blog/Cloudinary_-_Webp.webp"
    type="image/webp"
  />
  <img
    src="https://res.cloudinary.com/ajonp/image/upload/q_auto/ajonp-ajonp-com/blog/Cloudinary_-_Webp.webp"
    alt="Cloudinary Webp"
  />
</picture>

```

![https://media.codingcat.dev/image/upload/v1657636770/main-codingcatdev-photo/a9d5300d-5d9c-4a23-a3ce-e37e8b621173.png](https://media.codingcat.dev/image/upload/v1657636770/main-codingcatdev-photo/a9d5300d-5d9c-4a23-a3ce-e37e8b621173.png)

As you can see below Safari will use the `<img>` tag and not refer back to the `<source>` tag, and it will show the image correctly.

![https://media.codingcat.dev/image/upload/v1657636764/main-codingcatdev-photo/dab3fd4a-a7f0-45f1-be7b-f5e143d74e68.png](https://media.codingcat.dev/image/upload/v1657636764/main-codingcatdev-photo/dab3fd4a-a7f0-45f1-be7b-f5e143d74e68.png)

![https://media.codingcat.dev/image/upload/v1657636762/main-codingcatdev-photo/20b0aea2-3459-4ee6-bf55-df5d3d6002e6.jpg](https://media.codingcat.dev/image/upload/v1657636762/main-codingcatdev-photo/20b0aea2-3459-4ee6-bf55-df5d3d6002e6.jpg)

In Chrome the `<source>` tag is used so it will automatically pickup the webp extension and work correctly.

## Markdown

### Why Markdown

I cross post my lessons and blogs over to [DEV](https://dev.to/). Because of this I don't prefer to use shortcodes and instead stick with supported markdown syntax. I also tend to move on the the next "cool" technology platform often.For instance I can easily load all Markdown to:

### Markdown in Hugo

I fully admit that it takes me much longer to take my [markdown file images](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#images) and replace them for `<picture>` tags (yes I am lazy). Hugo provides amazing things called [shortcodes](https://gohugo.io/content-management/shortcodes/) that will allow you to execute a great deal of code in a short one line example of markdown. [xabeng](https://dev.to/xabeng) created an awesome set of shortcodes [my hugo shortcode for including image from cloudinary](https://dev.to/xabeng/my-hugo-shortcode-for-including-image-from-cloudinary-1l46).

### VSCode Extension - Paste Image - Cloudinary

[markdown image paste](https://marketplace.visualstudio.com/items?itemName=njLeonZhang.markdown-image-paste) is a fantastic plugin that allows you to take screenshots easily and loads them directly to cloudinary. By default once the upload completes it will place the new image URL into a markdown image tag.I did open an [issue](https://github.com/njleonzhang/vscode-extension-mardown-image-paste/issues/9) to allow for `html` code instead of the generic markdown syntax.