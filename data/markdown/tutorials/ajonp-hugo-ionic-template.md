---
title: "AJonP Hugo Ionic Template"
date: "2018-12-09"
---

https://youtu.be/CZmEZ62yMFA

> Just a little donation reminder as Hugo says "Hugo stands on the shoulder of many great open source libraries", as does many of my tutorials. [Brew](https://github.com/Homebrew/brew#donations) [Hugo](https://github.com/gohugoio/hugo#dependencies)

# Hugo Getting Started

Checkout the guide at [gohugo.io](https://gohugo.io/getting-started/installing/). My guides will always be on a Mac, but I will always try to provide a link for additional operating systems.

## Lesson Steps

1. Install Hugo
2. Create new Hugo site
3. Start Using AJonP Template

### Lesson 2 (required for Algolia)

Please chekcout Lesson: [Hugo Ionic](https://ajonp.com/lessons/hugo-ionic-template) for the next set of features 1. Victor Hugo 1. Deploy

## Install Hugo

### Brew

If you are like me and just bought a new Mac, you probaly are taking brew for granted and think it is just there right ????! Well first you can head over to [brew.sh](https://brew.sh/) they will tell you to run

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" 
```

### Hugo

```
brew install hugo 
```

# Create new Hugo site

```
hugo new site 4-hugo-ionic cd 4-hugo-ionic 
```

At this point you will notice that the project remains pretty empty in a generic skeleton.

![](data:image/jpeg;base64,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)![Hugo Skeleton](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1544487496/ajonp-ajonp-com/4-lesson-hugo-ionic/hugo_init.png)

It only has two files config.toml and archetypes/default.md

> If you run `hugo serve` right now, you will see a blank screen as there is no content to show.

## Index.html

Adding this to the base of our site will be used for setting up the [Home Page](https://gohugo.io/templates/homepage/). This is the only required page you will ever need to build a Hugo based site. Please keep in mind that this is still a

layouts/Index.html

```
You could make an entire site here if you wanted. 
```

> Again if you run `hugo serve` right now, you will see a blank screen as there is no content to show.

## \_index.md

content/\_index.md

```
This is markdown for the Homepage 
```

> I know this is getting a little frustrating! Again if you run `hugo serve` right now, you will see a blank screen as there is no content to show.

## Update Index.html

This will be the **first** page that will show anything in the browser!

layouts/index.html

```
 {{ .Content }} 
```

Now run the command `hugo serve` and you will see a page that has

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAJCAMAAAASPWyzAAAARVBMVEUrKytCQkL7+/ugoaLy9PScnZ43NTUnJyf///+nqKnT1NVJSUkwMDDc3d3ExMXKy8vu7u46VzRkZWXl5eWgfz5+RD6RkpIbakayAAAAbklEQVQYGX3BURLCIAwFwEdME0wI0Fa9/1Ft4ac6jrvQAd8UeoI8H+sKKe6e3HUSyCZ6gJ5QIINOQPGiBwyq5bV8uE3QpAWSNotWa7UwvkKafLn/gt6JiJmIiZmJKF+hW4RVs7Boe2u17vkC+a83lRoHUYYxNhsAAAAASUVORK5CYII=)![First markdown sample](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1544489438/ajonp-ajonp-com/4-lesson-hugo-ionic/orjghz4mteborfyrmdbr.png)

## Making a Point

Now I wanted to walk you through all of that to show 1. The steps really necessary to make a Hugo site 1. Prove that laying out a site from scratch is time consuming

# Start Using AJonP Template

## Theme Download Location

You can find the link on Hugo's Theme site [https://themes.gohugo.io/ajonp-hugo-ionic/](https://themes.gohugo.io/ajonp-hugo-ionic/)

Directly from [github](https://github.com/AJONPLLC/ajonp-hugo-ionic)

## Git integraiton

### Clone (Easy, not updated)

```
git clone https://github.com/AJONPLLC/ajonp-hugo-ionic themes/ajonp-hugo-ionic 
```

### Submodule (Better, updated)

```
git submodule add https://github.com/AJONPLLC/ajonp-hugo-ionic themes/ajonp-hugo-ionic 
```

Adding the submodule will allow you to receive all of the updates that you want, or lock into a specific commit to run your site from. Then later you are able to run

```
git submodule update --remote --merge 
```

## Theme Benefits

Now you should have a new folder in themes/ajonp-hugo-ionic. This has the full theme including an example site found in themes/ajonp-hugo-ionic/exampleSite

Features

- [Layouts](https://gohugo.io/templates/)
- [Shortcodes](https://gohugo.io/content-management/shortcodes/)
- [Sitemap](https://gohugo.io/templates/sitemap-template/#hugo-s-sitemap-xml)
- [Font Awesome](https://fontawesome.com/)
- [Ionic](https://ionicframework.com/)
- [Google Ads](https://ads.google.com/home/)
- [Google Analytics](https://marketingplatform.google.com/about/analytics/)
- [Disqus](https://disqus.com/)
- [AddThis](https://www.addthis.com/)
- [OpenGraph](https://developers.facebook.com/docs/sharing/opengraph/)
- [Twitter Cards](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/abouts-cards)

# Ionic Theming

Taking things a step further you can change any of the colors on the site by using Ionic's [Color Generator](https://beta.ionicframework.com/docs/theming/color-generator).

Here is a Hugo inspired look.

![](data:image/jpeg;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAVCAMAAABmKa5TAAAAqFBMVEX////x8fP5+/qbnJ309fb39/ecnZ/+/v77/Pzy8/Xm5ufr6+ve3+Dk7+v1o7z48vPz+vPtW4n+/Pr89/CRkpS0TG1KTE6RYXL15Of71ODJy8ycmJvb7eWYeISYmpv++Pl6jIb1r8WKi432xs3J5dnk9eb27e0fJizzmrVcrYqRS2Kxq67rT4D58+LAwcL87sLY9NqyeI31sMV5mo7U1djY3Mbyzs1Up4O6HAg8AAABJ0lEQVQoz22S53LDIBCE72gHqMtJ5F7j7vT2/m8WwJoRGnv5pfm0y91KINAIdEcYJ0QEADo3zZNT05zBCHeQIJI+VdWj0+VygjvSs/xwyD9Xq9UMNgV2gIbC5ehJnuejuljUHCxFwSS1xzyxVgKYbw5jRNbhVGqHlZSCiJjh8GxM5M6Mx9yio7T7ncDUvdlhof1oHKXH5Q+HjDHZYeYH0QpFwFsfjp1bY3BPRqPheJxNp3N4N/FiW5+uZ1X1sd9/HY9LKOPCSIfF5rLVHN56tbyEWnhZ0mBARaFgg/3Wwt6MQV3DYqFgB7fhKk0oSMFrVJpr7ep2nbY47U2ehLtVklyfFVDvk7Th1rLWrUUczq7haRLCM3X3d1AWtad/y3uY1Hr94MSX6h9sFRHx7DbK2AAAAABJRU5ErkJggg==)![Color Generator](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1544493969/ajonp-ajonp-com/4-lesson-hugo-ionic/dys1lqsodaxwaf8qbmo6.png)

Just copy the CSS Variables it produces into static/css/custom.css

```
:root {
  --ion-color-primary: #ff387d;
  --ion-color-primary-rgb: 255, 56, 125;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255, 255, 255;
  --ion-color-primary-shade: #e0316e;
  --ion-color-primary-tint: #ff4c8a;
  --ion-color-secondary: #0d171f;
  --ion-color-secondary-rgb: 13, 23, 31;
  --ion-color-secondary-contrast: #ffffff;
  --ion-color-secondary-contrast-rgb: 255, 255, 255;
  --ion-color-secondary-shade: #0b141b;
  --ion-color-secondary-tint: #252e35;
  --ion-color-tertiary: #2cb286;
  --ion-color-tertiary-rgb: 44, 178, 134;
  --ion-color-tertiary-contrast: #000000;
  --ion-color-tertiary-contrast-rgb: 0, 0, 0;
  --ion-color-tertiary-shade: #279d76;
  --ion-color-tertiary-tint: #41ba92;
  --ion-color-success: #10dc60;
  --ion-color-success-rgb: 16, 220, 96;
  --ion-color-success-contrast: #ffffff;
  --ion-color-success-contrast-rgb: 255, 255, 255;
  --ion-color-success-shade: #0ec254;
  --ion-color-success-tint: #28e070;
  --ion-color-warning: #ffce00;
  --ion-color-warning-rgb: 255, 206, 0;
  --ion-color-warning-contrast: #ffffff;
  --ion-color-warning-contrast-rgb: 255, 255, 255;
  --ion-color-warning-shade: #e0b500;
  --ion-color-warning-tint: #ffd31a;
  --ion-color-danger: #f04141;
  --ion-color-danger-rgb: 245, 61, 61;
  --ion-color-danger-contrast: #ffffff;
  --ion-color-danger-contrast-rgb: 255, 255, 255;
  --ion-color-danger-shade: #d33939;
  --ion-color-danger-tint: #f25454;
  --ion-color-dark: #222428;
  --ion-color-dark-rgb: 34, 34, 34;
  --ion-color-dark-contrast: #ffffff;
  --ion-color-dark-contrast-rgb: 255, 255, 255;
  --ion-color-dark-shade: #1e2023;
  --ion-color-dark-tint: #383a3e;
  --ion-color-medium: #989aa2;
  --ion-color-medium-rgb: 152, 154, 162;
  --ion-color-medium-contrast: #ffffff;
  --ion-color-medium-contrast-rgb: 255, 255, 255;
  --ion-color-medium-shade: #86888f;
  --ion-color-medium-tint: #a2a4ab;
  --ion-color-light: #f4f5f8;
  --ion-color-light-rgb: 244, 244, 244;
  --ion-color-light-contrast: #000000;
  --ion-color-light-contrast-rgb: 0, 0, 0;
  --ion-color-light-shade: #d7d8da;
  --ion-color-light-tint: #f5f6f9;
}

```

# Theme updates

I usee the theme for [AJonP](https://ajonp.com/) so it may change (you can always stay at a commit), but please contact me on [Slack](https://ajonp-com.slack.com/join/shared_invite/enQtNDk4NjMyNDUxMzM0LWQwMThkZDE3MDAzNzVmNWE3N2M1NzkwMzg1YWQ5NzIxZmIyYTM3ZjEyOGU3YjQ0NTFkYzRmZjMyYzExNDNlNTg) or Pull request on [Github](https://github.com/AJONPLLC/ajonp-hugo-ionic/pulls).
