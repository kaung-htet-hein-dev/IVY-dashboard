import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>IVY Dashboard</title>
        <meta
          name="description"
          content="IVY Dashboard - Administrative panel for managing bookings, services, branches, and users"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="IVY Dashboard" />
        <meta
          property="og:description"
          content="Administrative panel for managing bookings, services, branches, and users"
        />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IVY Dashboard" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="IVY Dashboard" />
        <meta
          name="twitter:description"
          content="Administrative panel for managing bookings, services, branches, and users"
        />

        {/* Theme and App Meta Tags */}
        <meta name="theme-color" content="#1976d2" />
        <meta name="application-name" content="IVY Dashboard" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="IVY Dashboard" />

        {/* Security Headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />

        <link rel="icon" href="/favicon.ico" />
        <meta name="emotion-insertion-point" content="" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
