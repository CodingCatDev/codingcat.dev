import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link rel="canonical" href="https://codingcat.dev/" />
          <link rel="shortlink" href="https://codingcat.dev/" />
          <meta name="application-name" content="CodingCatDev" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="CodingCatDev" />
          <meta name="description" content="Purrfect Web Tutorials" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />

          <link rel="manifest" href="/manifest.json" />

          {/* Icons */}
          <link
            rel="apple-touch-icon"
            sizes="57x57"
            href="/static/icons/apple-icon-57x57.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="60x60"
            href="/static/icons/apple-icon-60x60.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="72x72"
            href="/static/icons/apple-icon-72x72.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href="/static/icons/apple-icon-76x76.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="114x114"
            href="/static/icons/apple-icon-114x114.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="120x120"
            href="/static/icons/apple-icon-120x120.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="144x144"
            href="/static/icons/apple-icon-144x144.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="152x152"
            href="/static/icons/apple-icon-152x152.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/static/icons/apple-icon-180x180.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/static/icons/android-icon-192x192.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/static/icons/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="96x96"
            href="/static/icons/favicon-96x96.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/static/icons/favicon-16x16.png"
          />
          <link rel="icon" href="/favicon.ico" />

          {/* Socials */}
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:url" content="https://codingcat.dev" />
          <meta
            name="twitter:title"
            content="CodingCatDev | Purrfect Web Tutorials"
          />
          <meta
            name="twitter:description"
            content="codingcat.dev is where you can find all the Purrfect Web Tutorials that you will ever need!"
          />
          <meta
            name="twitter:image"
            content="https://yourdomain.com/static/icons/android-chrome-192x192.png"
          />
          <meta name="twitter:creator" content="@CodingCatDev" />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="CodingCatDev | Purrfect Web Tutorials"
          />
          <meta
            property="og:description"
            content="codingcat.dev is where you can find all the Purrfect Web Tutorials that you will ever need!"
          />
          <meta property="og:site_name" content="CodingCatDev" />
          <meta property="og:url" content="https://codingcat.dev" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
