---
type: post
authors:
  - alex-patterson
cloudinary_convert: false
cover: >-
  https://media.codingcat.dev/image/upload/v1683910220/main-codingcatdev-photo/Firebase-App-Check.png
devto: 'https://dev.to/codingcatdev/firebase-app-check-1meb-temp-slug-7012666'
excerpt: >-
  Learn how to add Firebase App Check using reCAPTCHA v3, to your next website
  and block those malicious requests!
hashnode: null
published: published
slug: firebase-app-check-web
start: 'May 12, 2023'
title: Firebase App Check
youtube: 'https://youtu.be/bpTw4aMxCU8'
---

## Adding App Check

With just a few lines of code you can include app check into your website

```ts
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

if (import.meta.env.DEV) {
	// @ts-ignore
	self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

initializeAppCheck(app, {
	provider: new ReCaptchaV3Provider('6LdAIqQlAAAAAC4kq-bag4J-HmAAVe_pu7T75QOf'),
	isTokenAutoRefreshEnabled: true
});
```

## Full Repo

You can clone the full repo from [GitHub](https://github.com/CodingCatDev/firebase-app-check).

<section class=" aspect-video">
  <iframe
    title="stackblitz for firebase app check"
    src="https://stackblitz.com/github/CodingCatDev/firebase-app-check?embed=1&file=src/App.svelte"
    frameborder="0"
    height="100%"
    width="100%"
    loading="lazy"
  />
</section>
