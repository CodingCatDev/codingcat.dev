# Easy Shopping Carts for your E-commerce Experience

season: 2
status: fail
streamyard: https://streamyard.com/v6unrcx3aq
calendarid: https://api.calendly.com/scheduled_events/5941db5b-14bb-450f-bd1f-5a6158acc214
chapters_done: false
cloudinary_convert: false
excerpt: Easy Shopping Carts for your E-commerce Experience
preview: https://codingcat.dev/api/preview?secret=7tjQhb1qQlS3FtyV3b0I&selectionType=podcast&selectionSlug=&_id=c4727c6743634022a1aa61f648d95f6f
youtube: https://youtu.be/sLx5qSTB7dk

![https://res.cloudinary.com/ajonp/image/upload/b_rgb:4B0A75,bo_5px_solid_rgb:4B0A75,c_fit,co_rgb:FBFBFB,g_north,l_text:Nunito_100_black_center_line_spacing_-10:Easy%20Shopping%20Carts%20for%20your%20E-commerce%20Experience,r_8:50,w_1200,x_0,y_60/c_limit,co_rgb:FBFBFB,g_south_west,l_text:Nunito_60_bold:With,x_45,y_577/b_rgb:D11663,bo_30px_solid_rgb:D11663,c_fit,co_rgb:D11663,g_south_west,l_text:Nunito_65_bold_left:Francois%20Lanthier%20Nadeau,r_8:50,x_0,y_410/b_rgb:4B0A75,bo_30px_solid_rgb:4B0A75,c_fit,co_rgb:FBFBFB,g_south_west,l_text:Nunito_65_bold_center:Francois%20Lanthier%20Nadeau,r_8:50,x_40,y_417/bo_5px_solid_rgb:FBFBFB,c_fill,g_south_west,h_400,l_main-codingcatdev-photo:podcast-guest:the_fln,w_400,x_0,y_0/f_jpg,q_auto/v1/main-codingcatdev-photo/Season2Background.png](https://res.cloudinary.com/ajonp/image/upload/b_rgb:4B0A75,bo_5px_solid_rgb:4B0A75,c_fit,co_rgb:FBFBFB,g_north,l_text:Nunito_100_black_center_line_spacing_-10:Easy%20Shopping%20Carts%20for%20your%20E-commerce%20Experience,r_8:50,w_1200,x_0,y_60/c_limit,co_rgb:FBFBFB,g_south_west,l_text:Nunito_60_bold:With,x_45,y_577/b_rgb:D11663,bo_30px_solid_rgb:D11663,c_fit,co_rgb:D11663,g_south_west,l_text:Nunito_65_bold_left:Francois%20Lanthier%20Nadeau,r_8:50,x_0,y_410/b_rgb:4B0A75,bo_30px_solid_rgb:4B0A75,c_fit,co_rgb:FBFBFB,g_south_west,l_text:Nunito_65_bold_center:Francois%20Lanthier%20Nadeau,r_8:50,x_40,y_417/bo_5px_solid_rgb:FBFBFB,c_fill,g_south_west,h_400,l_main-codingcatdev-photo:podcast-guest:the_fln,w_400,x_0,y_0/f_jpg,q_auto/v1/main-codingcatdev-photo/Season2Background.png)

## Join

GO Here on day of podcast -> [https://streamyard.com/v6unrcx3aq](https://streamyard.com/v6unrcx3aq)

## Francois Lanthier Nadeau

### Links

[https://twitter.com/the_fln](https://twitter.com/the_fln)

[https://www.flanthiernadeau.com/](https://www.flanthiernadeau.com/)

[https://www.linkedin.com/in/francoislanthiernadeau/](https://www.linkedin.com/in/francoislanthiernadeau/)

### Profile

Head of [Snipcart](https://snipcart.com/) 

Ultra transparent storyteller — startups & mental health.

## Questions

1. Can you tell me more about how you first started Snipcart?
    1. Dog-fooding inside an agency
    2. Client project turned SaaS product
    3. I first came in as marketing intern, 6 months after launch
    4. Early focus on developers
2. How does [Snipcart](https://snipcart.com/) compare to [Shopify](https://www.shopify.com/), [Square E-commerce](https://squareup.com/us/en/online-store) or [Bigcommerce](https://www.bigcommerce.com/)?
    1. Shopify, BigCommerce = all-in-one
    2. Square E-commerce = all-in-one, but within Square ecosystem
    3. Snipcart = kernel of e-comm. functionality (cart, checkout, product/store management)
    4. Snipcart = stack agnostic, use your fave tools, more dev-centric
    5. Snipcart = no plugins/apps, BYO
    6. Snipcart = QUICK < — > CUSTOM spectrum of usage
3. Could Snipcart work within [Next.js commerce](https://github.com/vercel/commerce), or would we consider it a competing product?
    1. Next.js commerce is basically a default **frontend** store template with a shopping cart built-in that can be plugged w/ different e-commerce platforms.
    2. So technically it could be adapted to work with Snipcart, but they have key functionalities in common (e.g.: buy buttons, side cart, checkout screen) that you *could* consider it a competitor.
        1. If paired with Snipcart: you’d have to use Next.js commerce for the site, strip out the shopping cart parts, add-in Snipcart cart/checkout, and use Snipcart merchant dashboard to manage the store/products.
        2. Note: the “checkout” with Next.js always seems to be happening “off-site”, i.e. via hosted checkout page from Shopify, BigCommerce, etc. With Snipcart, you stay on-site. With Commerce.js, too.
    3. The general decoupling in using Snipcart + [your chosen website stack] is different than using Next.js commerce + [your chosen e-commerce backend]
        1. Using Snipcart, you decouple **cart, checkout, store management, product management [SNIP]** from **content management, website design [XYZ CMS, frontend framework]**
        2. Using Next.js commerce, you decouple **website design, cart [NEXT]** from  **checkout, store management, product management [i.e. SHOPIFY]**
4. Is this the best integration method for Next.js (asking for a friend)?
[https://snipcart.com/blog/next-js-ecommerce-tutorial-example](https://snipcart.com/blog/next-js-ecommerce-tutorial-example)
    1. I’d go with this: [https://snipcart.com/blog/react-ecommerce-tutorial](https://snipcart.com/blog/react-ecommerce-tutorial)
5. We host all of our products in [Stripe](https://stripe.com/) is there an easy integration?
    1. We don't have anything built-in to sync the inventory w/ Stripe, but since the [product definition in Snipcart](https://docs.snipcart.com/v3/setup/products) lives in the markup of the website, it would be pretty straight forward to use Stripe as a backend/CMS for product management (products can be fetched from Stripe via API when rendering the website to generate a Snipcart compatible buy button).
6. DEMO: 
7. [Pricing](https://snipcart.com/pricing) Can people get started without the 2% charge?
    - Testing is forever free, but right now that’s the minimum pricing when you go Live.
    
    > ***For clients with monthly sales under $ 629 CAD, the 2% will be replaced by a $ 13 CAD monthly fee. *Note that you'll be charged in USD.***
    > 
8. As someone working in a Startup I am curious how hard it was to sell [Snipcart](https://snipcart.com/) to [Duda](https://www.duda.co/)?
    - Happy to go into more details — the process was hard for me, but overall went good, looking back. Also happy to talk about current situation post-acquisition.
    1. [https://www.flanthiernadeau.com/selling-snipcart-part-one/](https://www.flanthiernadeau.com/selling-snipcart-part-one/)
    2. [https://www.flanthiernadeau.com/selling-snipcart-part-two/](https://www.flanthiernadeau.com/selling-snipcart-part-two/)
    3. [https://www.flanthiernadeau.com/selling-snipcart-part-three/](https://www.flanthiernadeau.com/selling-snipcart-part-three/)
    4. [https://techcrunch.com/2021/09/01/web-building-platform-duda-snaps-up-e-commerce-cart-tool-snipcart/?guccounter=1](https://techcrunch.com/2021/09/01/web-building-platform-duda-snaps-up-e-commerce-cart-tool-snipcart/?guccounter=1)

## Purrfect Picks

These are fun picks of the week. Maybe something you bought online, a great show you are currently watching, or that last book that you thought was amazing.

### Francois Lanthier Nadeau

- [Elden Ring](https://en.bandainamcoent.eu/elden-ring/elden-ring) (video game)
- [jeen-yuhs](https://www.netflix.com/ca/title/81426972) (Kanye documentary)
- [Real Dictators](https://www.noiser.com/realdictators) (podcast)

### Brittney Postma

Jamstack E-commerce Colby Fayock - https://leveluptutorials.com/tutorials/ecommerce-on-the-jamstack-with-snipcart-next-js-and-wordpress/nextjs?ref=brittneypostma

### Alex Patterson

---

## Details

## Sponsorship

We are always looking for our next sponsor. If this is something that you are interested in please review our [sponsorship packet.](https://codingcat.dev/sponsorship)

### Code of Conduct

Please no swearing or drinking we think of our 10 year olds watching :D. Things will happen I slipped up the other day. I try to edit out anything that isn’t live.

### How do I connect for the recording?

Instructions: [https://streamyard.com/resources/docs/guest-instructions/index.html](https://streamyard.com/resources/docs/guest-instructions/index.html)

### What we do with the recording

We record using a streaming service that pushes an unlisted live-stream to YouTube. We then download the video and separate the audio. We then publish to two places

YouTube: [https://youtu.be/XWCOknS-d0s](https://youtu.be/XWCOknS-d0s)

Podcast: [https://codingcat.dev/podcasts/](https://codingcat.dev/podcasts/)

Twitch: [https://www.twitch.tv/codingcatdev](https://www.twitch.tv/codingcatdev)