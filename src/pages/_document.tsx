import Document, { Head, Html, Main, NextScript } from "next/document"

class MyDocument extends Document {
  render() {
    return (
      <Html lang="ja">
        <Head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#0099D9" />
          <link
            rel="icon"
            href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text x=%2250%%22 y=%2250%%22 style=%22dominant-baseline:central;text-anchor:middle;font-size:90px;%22>💡</text></svg>"
          />
          <link
            rel="icon alternate"
            type="image/png"
            href="https://cdn.jsdelivr.net/gh/twitter/twemoji@v14.0.2/assets/72x72/1f4a1.png"
          />
        </Head>
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
     const shouldUseTwemoji = !/(macintosh|macintel|macppc|mac68k|macos|iphone|ipad)/i.test(window.navigator.userAgent);
     if(shouldUseTwemoji) document.body.setAttribute("data-use-twemoji", "true");
   `,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
