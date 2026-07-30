import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/assets/favicon.png" />
        <link rel="shortcut icon" type="image/png" href="/assets/favicon.png" />
        <link rel="apple-touch-icon" href="/assets/favicon.png" />
        {/* Cloudflare Turnstile (CAPTCHA) widget script - loaded once globally */}
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
