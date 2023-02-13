---
cloudinary_convert: false
cover: htts://media.codingcat.dev/image/upload/v1629384711/main-codingcatdev-photo/n299y699xo7tjwlctlav.png
devto: https://dev.to/brittneypostma/accessibility-best-practices-for-html-css-d51
excerpt: Accessibility is an ongoing, ever-evolving process that is an extremely important aspect for inclusion and usability. These are some of the best practices you can follow in HTML and CSS to improve the user's experience on your site.
hashnode: https://hashnode.codingcat.dev/post-accessibility-best-practices-for-html-and-css
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=post&selectionSlug=accessibility-best-practices-for-html-and-css&_id=7aa2d1f678924b1a8a3a305bb22a2c2b
published: published
slug: accessibility-best-practices-for-html-and-css
start: August 19, 2021
title: Accessibility Best Practices for HTML & CSS
---
## Accessibility Best Practices for HTML & CSS

Great accessibility is not always an easy task and goes much more in depth than what is listed here. I still recommend having experienced screen readers and accessibility experts test your site and run your site through the [WebAIM Web Accessibility Evaluation Tool](https://wave.webaim.org/), WAVE. If you see anything that should be added, updated, or removed, please get in touch with me either in the comments or [@brittneypostma on Twitter](https://twitter.com/BrittneyPostma). This article is here to serve as a starting point to summarize and guide your way to better accessibility. Having better accessibility isn't only the right thing to do, it also increases your Search Engine Optimization, SEO, which can rank you higher in Google's algorithm. Here are some links to provide more information on web accessibility.

## Additional Links

## Foundation

Everything should start with a good foundation and with Hypertext Markup Language, HTML, that is the structure of your page. A huge part of web accessibility is just making sure the HTML elements are used correctly. A web page may be styled in many different ways to organize information visually, especially with different viewport sizes, but a blind user only hears the order defined in the HTML of a page. In my opinion, using [semantic HTML](https://codingcat.dev/post/accessibility-best-practices-for-html-and-css#semantic-html) along with [mobile-first design](https://codingcat.dev/post/accessibility-best-practices-for-html-and-css#mobile-first-design) allows you to see the layout of a page *linearized* into one column and the order of the markup to see if it makes sense.

## Semantic HTML

The word semantic relates to the meaning of something in a language or logic. In semantic HTML the HTML element used gives meaning to define its content and how it is classified. There are currently over one hundred different [elements in HTML](https://developer.mozilla.org/en-US/docs/Web/HTML/Element), but not all of them have a semantic meaning. The layout of the page defines the [page regions](https://www.w3.org/WAI/tutorials/page-structure/regions/) that are identified by web browsers and assistive technologies.

### Structural

- Use the `header` and `footer` elements to define the top and bottom of a page, but also can define the top and bottom of an article or section.
- Use the `nav` element for major blocks of links to allow assistive technologies to quickly and easily navigate through the site. The`nav` element can be used around unordered lists, `ul`, or around a block of content referring to multiple links. You can use the `aria-label` property to identify different navigation areas.
- Use the `main` tag to define the main content of the page and `aside` to define anything related to the main content.
- Only use `div`s and `span`s for styling purposes. Use the `section` tag to group related elements with a heading and the `article` tag to group a self-contained item that is independent or reusable. The `article` element can be posts, news articles, product cards, comments, or any other form of independent items or content. Here is a great Smashing Magazine article on [Why You Should Choose HTML5 article Over section](https://www.smashingmagazine.com/2020/01/html5-article-section/) explaining that `article` can be used in almost all instances, but a `section` with an [aria-label](https://codingcat.dev/post/accessibility-best-practices-for-html-and-css#aria-label) can be helpful.
- Use the correct levels for headings, from the most important as an `h1` down through `h6` and do not skip heading levels. Each page should have a heading level 1, `h1` , that represents the most important idea on the page. Any sub-headings should be an `h2` , sub-sections can then be divided into `h3`s and on down to `h6` s based on the nested structure.
- Use the paragraph, `p`, element to wrap self-contained blocks of text that focus on a single topic or theme. Also, the `strong` and emphasized, `em`, elements have semantic meaning where bold, `b`, and italic, `i`, are simply style differences.
- Use an `alt` attribute on images **if** the image is important to the content, such as information to understanding or interacting with something. Otherwise, if an image is decorative and adds no value to the content, the attribute can be declared `alt=""` and it will not be read by assistive technologies.
- Try to provide alternative to audio and video content, such as captions or transcripts for those that are hard of hearing or using screen readers.
- Use the anchor, `a`, tag for links that go somewhere else and the `button` tag for an action like submitting a form or a click event.
- Don't use dashes if you can avoid it. Instead of writing 5–7, write 5 to 7.
- Expand abbreviations — instead of writing Jan, write January.
- Expand acronyms, at least once or twice. Instead of writing HTML in the first instance, write Hypertext Markup Language.

### Forms

- Forms are one of the most common problems for accessibility on sites. Make sure not to disable any of the default keyboard functionalities or tab order and use the proper markup. Also, consider keeping forms short and only ask users for the minimal information needed to complete the process. [https://www.w3.org/WAI/tutorials/forms/](https://www.w3.org/WAI/tutorials/forms/)
- Use the `label` element with a `for` attribute that matches an `id` attribute on the accompanying `input` or wrap the `label` around the `input`. [https://www.w3.org/WAI/tutorials/forms/labels/](https://www.w3.org/WAI/tutorials/forms/labels/)
- Make sure instructions needed to complete an input are listed before the input area and make clear if an input is required and any validation requirements. Make any errors that prevent completing a form known to the user.

## Styling

Styling, whether with CSS or JavaScript, can cause accessibility issues to occur when some browser defaults are removed or incorrectly changed. Including heading and text sizes, outline styling, color contrast, and more. The best practice is to leave the browser defaults if you don't know how to correctly restyle them. I've listed some of the most common issues below. [https://developer.mozilla.org/en-US/docs/Learn/Accessibility/CSS_and_JavaScript](https://developer.mozilla.org/en-US/docs/Learn/Accessibility/CSS_and_JavaScript)

- There should be sufficient contrast between any foreground text and the background color behind it. The minimum contrast ratio for normal sized text is **4:5:1** and **3:1** for larger text. These as **AA** minimum contrast criteria.
- There are enhanced **AAA** criteria at **7:1** for regular text and **4:5:1** for larger text. There are many extensions and plugins that check for contrast issues, but they can be inaccurate and inconsistent. The WebAIM provides a contrast checker at [https://webaim.org/resources/contrastchecker/](https://webaim.org/resources/contrastchecker/).
- For non-text items the contrast ratio should be a minimum of **3:1**.

### States

- The **focus** state shows when a user is focused, either by click, keyboard, or voice, on an element. Only interactive elements need to have a focus state. A common practice is to remove the default outline for focus states with CSS, **never** do this without replacing it. A background should be **3:1** contrast ratio for buttons and inputs and a minimum **1.4.3** underline for links. More information and examples are listed here [https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html](https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html).
- The **hover** and **active** states are sometimes styled similarly. The active state shows when something is activated, usually a button or a link, and the hover shows when it is being hovered on. The styles are not the important part for accessibility on these elements, but telling assistive technologies when an element is active is important. Using the correct **aria-pressed** attribute based on the state will tell a user whether the element is active or not. More info on states can be found here [https://www.w3.org/WAI/tutorials/menus/styling/#hover-and-focus-states](https://www.w3.org/WAI/tutorials/menus/styling/#hover-and-focus-states).

### Animations

- Users should be able to control any moving, flashing, or blinking content on a page. Examples include ads, videos, auto-updating visuals, moving backgrounds, and more. Basically, anything that is initiated by the page without the user interacting with it. A good practice is to use a **prefers-reduced-motion** media feature to turn off animations. If the animation is critical to understanding something, add it back in with a selector after turning down all animations. [https://css-tricks.com/revisiting-prefers-reduced-motion-the-reduced-motion-media-query/](https://css-tricks.com/revisiting-prefers-reduced-motion-the-reduced-motion-media-query/)

```css
@media screen and
  (prefers-reduced-motion: reduce),
  (update: slow) {
  * {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important; /* Hat tip Nick/cssremedy (https://css-tricks.com/revisiting-prefers-reduced-motion-the-reduced-motion-media-query/#comment-1700170) */
    transition-duration: 0.001ms !important;
  }
}

```

- Make sure all animated content has pause, stop and hide capabilities and check the tab order to ensure it works correctly. [The Dark Side of the Grid](https://www.matuzo.at/blog/the-dark-side-of-the-grid-part-2/) is a good post on how changing visual order can mess with the order in the Document Object Model, DOM. The [Accessible Web Animation Explained](https://css-tricks.com/accessible-web-animation-the-wcag-on-animation-explained/) post from CSS Tricks has some good tips as well.
- Do **NOT** have anything that flashes more than three times in a one second period as this is known to cause seizures. If you can't avoid flashing animations, see the [W3C's detailed guide on how to meet the safe thresholds](https://www.w3.org/TR/2008/REC-WCAG20-20081211/#general-thresholddef).

By no means is this the be all, end all of things that should be done for accessibility. It is an ongoing, ever-evolving process that is an extremely important aspect for inclusion and usability. These are some of the core fundamentals of good User Experience, UX, and helping others understand, navigate, and interact with your site. At a bare minimum, follow these best practices and run your site through the [WebAIM Web Accessibility Evaluation Tool](https://wave.webaim.org/), WAVE. If you see anything that should be added, updated, or removed, please get in touch with me either in the comments or [@brittneypostma on Twitter](https://twitter.com/BrittneyPostma).