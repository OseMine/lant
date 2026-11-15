import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lant.lol";

export const metadata: Metadata = {
  title: "Embed - lant",
  description: "Embed a music player widget from lant.",
  alternates: {
    canonical: `${BASE_URL}/embed`,
  },
  openGraph: {
    title: "Embed - lant",
    description: "Embed a music player widget from lant.",
    url: `${BASE_URL}/embed`,
    siteName: "lant",
    type: "website",
    images: [
      {
        url: "/api/og?title=Embed&artist=lant",
        width: 1200,
        height: 630,
        alt: "lant Embed",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Embed - lant",
    description: "Embed a music player widget from lant.",
    images: ["/api/og?title=Embed&artist=lant"],
  },
  robots: {
    index: false,
    follow: true,
  },
};

export default function EmbedPage() {
  return (
    <div style={{ padding: 40, textAlign: "center", color: "#a1a1a6", fontFamily: "sans-serif" }}>
      <p>This is an embeddable widget. Use it in an iframe:</p>
      <code style={{ fontSize: 12 }}><iframe src="..."></iframe></code>
    </div>
  );
}