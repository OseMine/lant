import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

// Preconnect to external domains for faster resource loading
const preconnectLinks = [
  { href: "https://cdn.jsdelivr.net", crossOrigin: "anonymous" as const },
  { href: "https://i.scdn.co", crossOrigin: "anonymous" as const },
  { href: "https://is1-ssl.mzstatic.com", crossOrigin: "anonymous" as const },
  { href: "https://e-cdns-images.dzcdn.net", crossOrigin: "anonymous" as const },
];

function PreconnectLinks() {
  return (
    <>
      {preconnectLinks.map((link, index) => (
        <link
          key={index}
          rel="preconnect"
          href={link.href}
          crossOrigin={link.crossOrigin}
        />
      ))}
      <link rel="dns-prefetch" href="https://api.deezer.com" />
      <link rel="dns-prefetch" href="https://api.music.apple.com" />
      <link rel="dns-prefetch" href="https://api.spotify.com" />
      <link rel="dns-prefetch" href="https://www.googleapis.com" />
    </>
  );
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lant.lol";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "lant - Share Music with Anyone",
    template: "%s | lant",
  },
  description: "Share your favorite music across any platform. One universal link that opens in Spotify, Apple Music, Deezer, Tidal, YouTube, and more. Works with lyrics, previews, and QR codes.",
  keywords: [
    "music sharing",
    "cross-platform music links",
    "universal music link",
    "song link converter",
    "music link shortener",
    "Spotify to Apple Music",
    "share music links",
    "music discovery",
  ],
  authors: [{ name: "OseMine" }],
  creator: "lant",
  publisher: "lant",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "lant",
    title: "lant - Share Music with Anyone",
    description: "One universal link for all music platforms. Share songs, albums, and artists across Spotify, Apple Music, Deezer, Tidal, YouTube, and more.",
    images: [
      {
        url: "/api/og?title=lant&artist=Share Music Anywhere",
        width: 1200,
        height: 630,
        alt: "lant - Universal Music Links",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "lant - Share Music with Anyone",
    description: "One universal link for all music platforms. Share songs, albums, and artists across Spotify, Apple Music, Deezer, Tidal, YouTube, and more.",
    images: ["/api/og?title=lant&artist=Share Music Anywhere"],
    creator: "@lantApp",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/icons/icon-192.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "p6LRL0t0w8LyGny133yLOLtrhqOPKCb9BEEcSYrmocY",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "lant",
  },
  alternates: {
    canonical: BASE_URL,
  },
  other: {
    "theme-color": "#6c5ce7",
  },
};

export const viewport: Viewport = {
  themeColor: "#6c5ce7",
  width: "device-width",
  initialScale: 1,
};

// JSON-LD Structured Data for Organization and Website
function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${BASE_URL}/#website`,
        url: BASE_URL,
        name: "lant",
        description: "Share your favorite music across any platform. One universal link that opens in Spotify, Apple Music, Deezer, Tidal, YouTube, and more.",
        publisher: {
          "@id": `${BASE_URL}/#organization`,
        },
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE_URL}/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Organization",
        "@id": `${BASE_URL}/#organization`,
        name: "lant",
        url: BASE_URL,
        logo: {
          "@type": "ImageObject",
          url: `${BASE_URL}/icons/icon-512.png`,
          width: 512,
          height: 512,
        },
        sameAs: [
          "https://github.com/OseMine/lant",
        ],
        description: "Music link unification service - one universal link for all music platforms.",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${BASE_URL}/#application`,
        name: "lant",
        applicationCategory: "MusicApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        description: "Universal music link converter. Paste any music link from Spotify, Apple Music, Deezer, Tidal, YouTube, Amazon Music, or Bandcamp and get a single link that works everywhere.",
        featureList: [
          "Cross-platform music linking",
          "Lyrics display",
          "Audio previews",
          "QR code generation",
          "Embed widgets",
          "Open Graph image generation",
          "oEmbed support",
        ],
        url: BASE_URL,
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
        <PreconnectLinks />
        <StructuredData />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').catch(function() {});
                });
              }
            `,
          }}
        />
        <I18nProvider>
          <Link href="https://github.com/OseMine/lant" aria-label="GitHub repository" className="github-link">
            <FaGithub size={20} />
          </Link>
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
