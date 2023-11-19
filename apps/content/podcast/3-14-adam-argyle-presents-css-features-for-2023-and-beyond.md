---
type: podcast
authors:
  - alex-patterson
  - brittney-postma
episode: 14
recording_date: April 26, 2023 2:15 PM
season: 3
published: published
podcast: CodingCat.dev
chapters_done: true
cloudinary_convert: false
cover: https://media.codingcat.dev/image/upload/v1682536815/main-codingcatdev-photo/Adam-Argyle-Presents-CSS-Features-for-2023-and-beyond%21.jpg
devto: 'https://dev.to/codingcatdev/314-adam-argyle-presents-css-features-for-2023-and-beyond-1pal'
excerpt: 'Adam helps reveal some CSS features that will elevate your code and help you push forward.'
guests:
  - adam-argyle
hashnode: 'https://hashnode.codingcat.dev/podcast-Adam-Argyle-Presents-CSS-Features-for-2023-and-beyond!'
picks:
  [
    { author: 'adam-argyle', name: 'gradient.style', site: 'https://gradient.style/' },
    { author: 'alex-patterson', name: 'SST', site: 'https://sst.dev/' },
    { author: 'brittney-postma', name: 'Svelte Lab', site: 'https://www.sveltelab.dev/' },
    { author: 'brittney-postma', name: 'Elk Zone', site: 'https://elk.zone/home' },
    {
      author: 'brittney-postma',
      name: 'Intrinsic CSS with Container Queries and Units with Miriam Suzanne',
      site: 'https://www.youtube.com/watch?v=uumZV98zHt8'
    }
  ]
slug: 3-14-adam-argyle-presents-css-features-for-2023-and-beyond
sponsors:
  - storyblok
spotify: https://open.spotify.com/episode/2bhJfSymEtb9KHpSVVPOVf?si=fTlzCVMiRumuns93u-0lGQ
start: May 31, 2023
title: 'Adam Argyle Presents CSS Features for 2023 and beyond!'
youtube: https://youtu.be/RxVJ2Oj1IWk
---

## Questions

1. Can you tell us more about yourself?
2. Last time we talked was December 2021, how is [Open Props](https://open-props.style/) doing?
3. What will you be doing for Google I/O this year?
4. Next Gen Color?
5. Tell us about [gradient.style](http://gradient.style)

## Links

- [Card Stacks](https://gui-challenges.web.app/card-stack/dist/)
- [Nerdy.dev](https://nerdy.dev/)
- [6 CSS snippets every front-end developer should know in 2023](https://web.dev/6-css-snippets-every-front-end-developer-should-know-in-2023/)

### At Container Query

`@container` is a new css selector

```css
.panel {
	container: layers-panel / inline-size;
}

.card {
	padding: 1rem;
}

@container layers-panel (min-width: 20rem) {
	.card {
		padding: 2rem;
	}
}
```

## Scroll Snap

Well orchestrated scroll experiences set your experience apart from the rest, and [scroll snap](https://developer.mozilla.org/docs/Web/CSS/scroll-snap-type)
 is the perfect way to match system scroll UX while providing meaningful stopping points.

```css
.snaps {
	overflow-x: scroll;
	scroll-snap-type: x mandatory;
	overscroll-behavior-x: contain;
}

.snap-target {
	scroll-snap-align: center;
}

.snap-force-stop {
	scroll-snap-stop: always;
}
```

## Grid Pile

[Grid Pile](https://web.dev/shows/gui-challenges/m4DKhRJeYx4/)

```css
.pile {
	display: grid;
	place-content: center;
}

.pile > * {
	grid-area: 1/1;
}
```

## Easy Circle

```css
.circle {
	inline-size: 25ch;
	aspect-ratio: 1;
	border-radius: 50%;
}
```

## Control variants with @layer

You probably have seen this if you are using TailwindCSS

```css
/* file buttons.css */
@layer components.buttons {
  .btn.primary {
    …
  }
}
```

## Memorize less and reach more with logical properties

Memorize this [one new box model](notion://www.notion.so/learn/css/logical-properties/) and [never have to worry](https://css-tricks.com/late-to-logical/) about changing left and right padding or margin for international [writing modes](https://developer.mozilla.org/docs/Web/CSS/writing-mode) and [document directions](https://developer.mozilla.org/docs/Web/CSS/direction) again. Adjust your styles from physical properties to logical ones like [padding-inline](https://developer.mozilla.org/docs/Web/CSS/padding-inline), [margin-inline](https://developer.mozilla.org/docs/Web/CSS/margin-inline), [inset-inline](https://developer.mozilla.org/docs/Web/CSS/inset-inline), and now the browser will do the adjusting work.

```css
button {
	padding-inline: 2ch;
	padding-block: 1ch;
}

article > p {
	text-align: start;
	margin-block: 2ch;
}

.something::before {
	inset-inline: auto 0;
}
```
