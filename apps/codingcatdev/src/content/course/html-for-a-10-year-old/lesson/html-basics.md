---
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1654934534/main-codingcatdev-photo/courses/ForA10YearOld/ForA10YearOldHTMLBasics.png
excerpt: HTML for a 10 Year Old Basics
published: published
slug: html-basics
start: June 1, 2022
title: HTML Basics
weight: 1
---
Hey there Purr-fect Peep, so you have decided to start learning Web Development. That is AWESOME! In HTML Basics we will cover some of the history of the Web and many of the basiscs you will need to get started. We are continuously looking for feedback on how to improve the page so please feel free to jump on our [Discord](https://discord.gg/fRJTRjR) for any help or suggestions.

## History of the Web

In the very begining the Web did not require as much interactiveness as it has today. When Tim Berners-Lee created it in 1989 working at CERN it was to help link together several disparate systems that did not "talk" with each other. You can still see the original design [here](http://info.cern.ch/Proposal.html).

> By October of 1990, Tim had written the three fundamental technologies that remain the foundation of today’s web:HTML: 1. HyperText Markup Language. The markup (formatting) language for the web. 2. URI: Uniform Resource Identifier. A kind of “address” that is unique and used to identify to each resource on the web. It is also commonly called a URL. 3. HTTP: Hypertext Transfer Protocol. Allows for the retrieval of linked resources from across the web. [https://webfoundation.org/about/vision/history-of-the-web/](https://webfoundation.org/about/vision/history-of-the-web/)
> 

Even today you can write web pages with only these 3 basic technologies. Often people will jump right into learning CSS, JavaScript or a large Framework. It is best to know what those technologies do by building up your level of understanding “block by block”!

## HTML Documents

There are three key items that make up an HTML Document. 1. All HTML documents must start with a document type declaration: ``. 2. The HTML document itself begins with `<html>` and ends with `</html>`. 3. The visible part of the HTML document is between `<body>` and `</body>`.

The simplest page you can write is the most legendary “Hello World” example. As you can see in this below sample it just has the worlds within the body of a document.

[https://codesandbox.io/embed/html-for-a-10-year-old-basics-hello-world-vhigc](https://codesandbox.io/embed/html-for-a-10-year-old-basics-hello-world-vhigc)

### Tags

In order for the browser to understand and process the markup we need to place what we call opening `<>` and closing `</>` tags around content. Anything between the two tags will be represented by that markup. So in the case of our “Hello World” example there is no styling the browser just knows it belongs within the body, which belongs to the html. It does not however belong to the head, because as you can see in the code above the head was already closed with `</head>`.

When you use a tag with the content in the middle like `<h1>Hello World</h1>`, this represents an entire html element. You can also nest elements, for example we would place this h1 tag into our body element.

```html
<body>
  <h1>Hello</h1>
</body>
```

### Attributes

Anything that exists within the starting tag name is what we call an attribute like `<h1 id='hello'>Hello</h1>`. Attributes allow for us to place additional information into and about the tag. There are two types of Some of the most popular global HTML attributes are `id`, `css`, and `style`. In the link section below you will begin to see how we can use id. In our CSS for a 10 year old we will dive further into the css and style attribute.

### HTML Headings

HTML headings are defined with the `<h1>` to `<h6>` tags.`<h1>` defines the most important heading. `<h6>` defines the least important heading.In the example below you will notice that the text is between our opening and closing tag which makes the text look differently. Browsers come with predefined styles which allow for the difference visually, otherwise this would only be represented in the markup.

[https://codesandbox.io/embed/html-for-a-10-year-old-basics-jfej6](https://codesandbox.io/embed/html-for-a-10-year-old-basics-jfej6)

### HTML Paragraphs

Thinking back to the time when Tim created the first version of HTML, he was trying to link up documents between computers. So the paragraph was pretty important and is still one of the most commonly used html tags today. Paragraphs represent a change in the text, but again don’t be fooled each browser can implement the styling differently.

[https://codesandbox.io/embed/html-for-a-10-year-old-basics-hello-world-paragraphs-kmdgh](https://codesandbox.io/embed/html-for-a-10-year-old-basics-hello-world-paragraphs-kmdgh)

The first example of using a link is something called an anchor tag to reference within themselves. In order to do this we give a `div` and identifier using `id=` this way a link can be used so that the browser can reference the location of that id within the current page. This anchor is used in the a tag’s attribute href by placing a `#` (for you young kids a hashtag) in front of the identifier. See below where we use `<a href="#divBtm">Link to Bottom Div</a>` to anchor to the div with id divBtm `<div id="divBtm">Bottom Div</div>`.You can think of links as the webs version of house addresses. URI (Uniform Resource Identifier) is one of Tim’s best ideas and unbelieveably forward thinking. Instead of just having a set of random numbers like `104.198.14.52` you can specify an address that has meaning like [https://ajonp.com](https://ajonp.com/), this is used in the a tag’s attribute href. The ajonp.com version is called a URL (Uniform Resource Locator) and is more commonly known as a web address. This allows us to say AJ’s house instead of the number.

[https://codesandbox.io/embed/html-for-a-10-year-old-links-b1nzd](https://codesandbox.io/embed/html-for-a-10-year-old-links-b1nzd)

### HTML Images

Images make up a large portion of the web and have had significant updates in more modern browsers. Keeping things very simple to start you only need the tag `<img>` and a single attribute `src`.

[https://codesandbox.io/embed/html-for-a-10-year-old-basics-img-glnek](https://codesandbox.io/embed/html-for-a-10-year-old-basics-img-glnek)

### HTML Buttons

Button tags are fairly simple but yet very powerful. They can be combined with forms (something we will cover in another module) which take user input data and then the button will submit this data. This is done through the button attribute `type.` The type attribute will allow the button to represent `button`, `submit`, and `reset`.

[https://codesandbox.io/embed/html-for-a-10-year-old-basics-button-kjgj0](https://codesandbox.io/embed/html-for-a-10-year-old-basics-button-kjgj0)

### HTML Lists

When you are writing you often will want to use lists of items. HTML5 offers us two different types of lists **u**nordered list `<ul>` and **o**rdered list `<ol>`. You can use many different styles for both of these lists using css. For ordered lists you have an HTML attribute `type` that can be used. For unordered lists you must use styles only to change the look, for example `style="list-style-type:circle;"` will create an item with a circle at the front.For both list types you will have items that exist in that list represented with the tag `<li>`. This tag will have the actual content for each item in the list.

[https://codesandbox.io/embed/html-for-a-10-year-old-basics-lists-rqnq6](https://codesandbox.io/embed/html-for-a-10-year-old-basics-lists-rqnq6)

> Please see [https://www.w3schools.com/html/html_basic.asp](https://www.w3schools.com/html/html_basic.asp) as I used that as a reference for much of this tutorial.
>