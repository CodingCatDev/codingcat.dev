---
title: 'Adding Web Component for Ionic Modals'
date: '2019-09-11'
---

# Adding dynamic features to a static site.

This is a multi part series covering all the different types of Web Components I am using on the [](https://ajonp.com/)[https://ajonp.com](https://ajonp.com) site currently. I just wanted to show how you can use each of them at a somewhat high level.

## Adding Web Component for Ionic Modals[](https://codingcat.dev/blog/adding-web-component-for-ionic-modals#adding-web-component-for-ionic-modals)

So for this Web Component we are going to code a [Custom Element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements) from scratch, not using Stencil, Polymer, or Angular.This just builds a simple search modal that allows for Algolia search searchResults:

![modal search](https://res.cloudinary.com/ajonp/image/upload/f_auto,q_auto/v1568151976/ajonp-ajonp-com/blog/Screen_Shot_2019-09-10_at_5.45.42_PM.png)

### Modal Code[](https://codingcat.dev/blog/adding-web-component-for-ionic-modals#modal-code)

I don't know if I can add much more than what Eric Bidelman wrote for [Custom Elements](https://developers.google.com/web/fundamentals/web-components/customelements). I would just say you can basically put anything in them, just make sure you have the `connectedCallback()` in place if you need to run code each iteration.

> connectedCallback: Called every time the element is inserted into the DOM. Useful for running setup code, such as fetching resources or rendering. Generally, you should try to delay work until this time.

```
customElements.define('modal-search', class extends HTMLElement {
    constructor() {
        super(); this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        const ionHeader = document.createElement('ion-header');
        const ionToolbar = document.createElement('ion-toolbar');
        const ionTitle = document.createElement('ion-title');
        ionTitle.innerHTML = <ion-label color='primary'>Search Purr-fectly</ion-label>
        const ionButtons = document.createElement('ion-buttons');
        ionButtons.setAttribute('slot', 'primary');
        const ionButton = document.createElement('ion-button');
        ionButton.addEventListener('click', async () => {
            const modalController = document.querySelector('ion-modal-controller'); await modalController.dismiss({ 'dismissed': true });
        })
        const ionIconClose = document.createElement('ion-icon'); ionIconClose.setAttribute('slot', 'icon-only');
        ionIconClose.setAttribute('name', 'close'); ionButton.appendChild(ionIconClose);
        ionButtons.appendChild(ionButton); ionToolbar.appendChild(ionButtons);
        ionToolbar.appendChild(ionTitle); ionHeader.appendChild(ionToolbar);
        const ionSearchbar = document.createElement('ion-searchbar');
        const searchContent = document.createElement('ion-content');
        ionSearchbar.addEventListener('ionChange', async ev => {
            try { const searchResults = await index.search({ query: ev.detail.value });
                const ionList = document.createElement('ion-list'); searchResults.hits.forEach(hit => {
                const ionItem = document.createElement('ion-item'); ionItem.setAttribute('href', hit.url);
                const ionLabel = document.createElement('ion-label');
                const title = document.createElement('h2'); title.innerHTML = hit._highlightResult.title.value; ionLabel.appendChild(title);
                const summary = document.createElement('p'); summary.innerHTML = hit._highlightResult.summary.value; ionLabel.appendChild(summary);
                ionItem.appendChild(ionLabel); ionList.appendChild(ionItem); }); searchContent.innerHTML = ionList.innerHTML
            }
            catch (err) {
                console.log(err); console.log(err.debugData);
            }
        });
        this.shadowRoot.appendChild(ionHeader);
        this.shadowRoot.appendChild(ionSearchbar);
        this.shadowRoot.appendChild(searchContent);
    }
});
```

### Event Listener for ????️[](https://codingcat.dev/blog/adding-web-component-for-ionic-modals#event-listener-for-%EF%B8%8F)

This is utilizing [Ionic's Modal](https://ionicframework.com/docs/api/modal). Please also not you *MUST* include the `<ion-modal-controller>` in your site or this will not work (trust me lost hours of my life on that one)!Notice in `modalController.create` we are passing a `component: 'modal-search'` property. This is the name of custom element that we created above.

```
mainSearch.forEach(b => {
    b.addEventListener('click', async (event) => {
        // initialize controller
        const modalController = document.querySelector('ion-modal-controller');
        await modalController.componentOnReady();
        // present the modal const modalElement =
        await modalController.create({
            animated: true,
            component: 'modal-search',
            componentProps: {
                search: event.currentTarget.getAttribute('search')
            } });
        await modalElement.present();
    });
});
```

## The BEST Part[](https://codingcat.dev/blog/adding-web-component-for-ionic-modals#the-best-part)

Now I could package this up and add it to NPM as a nice package. Better yet we could create it from a Stencil component next.Let me know what you think![](https://twitter.com/intent/tweet?url=https://codingcat.dev/blog/adding-web-component-for-ionic-modals&via=CodingCatDev&hashtags=CodingCatDevShares&text=Adding%20Web%20Component%20for%20Ionic%20Modals%0a)[](https://www.linkedin.com/shareArticle?mini=true&url=https://codingcat.dev/blog/adding-web-component-for-ionic-modals&title=Adding%20Web%20Component%20for%20Ionic%20Modals%0a&summary=%27#CodingCatDevShares'&source='codingcat.dev')[](https://www.facebook.com/sharer.php?u=https://codingcat.dev/blog/adding-web-component-for-ionic-modals)[](https://www.reddit.com/submit?url=https://codingcat.dev/blog/adding-web-component-for-ionic-modals&title=Adding%20Web%20Component%20for%20Ionic%20Modals%0a)[](https://news.ycombinator.com/submitlink?u=https://codingcat.dev/blog/adding-web-component-for-ionic-modals&t=Adding%20Web%20Component%20for%20Ionic%20Modals%0a)
