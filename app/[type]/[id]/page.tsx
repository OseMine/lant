import type { EntityData } from "@/lib/songlink";
import { decodelantId } from "@/lib/lant-id";
import { getMusicDataCached } from "@/lib/songlink";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import EntityHero from "@/components/EntityHero";
import UnsupportedContent from "@/components/UnsupportedContent";
import type { Viewport } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://lant.lol";

export const instant = false;

interface PageProps {
  params: Promise<{ type: string; id: string }>;
}

export const viewport: Viewport = {
  themeColor: '#11DD66', // Replace with your exact brand/accent color hex
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { type, id } = await params;
  const decoded = decodelantId(id, type);

  if (!decoded || decoded.type !== type) {
    return {
      title: "Not Found",
      description: "The requested music entity was not found.",
      robots: { index: false, follow: true },
    };
  }

  // Podcast/audiobook types are not fully supported
  if (type === "podcast" || type === "audiobook") {
    return {
      title: "Content Not Available",
      description: "This content type is not yet fully supported.",
      robots: { index: false, follow: true },
    };
  }

  try {
    const data = await getMusicDataCached(decoded.platform, decoded.type, decoded.platformId);
    const title = decoded.type === "artist" ? data.name : `${data.name} - ${data.artist}`;
    const canonicalUrl = `${BASE_URL}/${type}/${id}`;
    const imageSrc = data.image || "/images.svg";
    const ogImageUrl = `${BASE_URL}/api/og?title=${encodeURIComponent(data.name)}&artist=${encodeURIComponent(data.artist || '')}&image=${encodeURIComponent(data.image || '')}`;
    const description = `Listen to ${data.name}${data.artist ? ` by ${data.artist}` : ""} on any platform - Spotify, Apple Music, Deezer, Tidal, YouTube, and more.`;

    const openGraph: Metadata["openGraph"] = {
      title,
      description,
      url: canonicalUrl,
      siteName: "lant",
      images: [
        {
          url: imageSrc,
          width: 400,
          height: 400,
          alt: `${data.name}${data.artist ? ` by ${data.artist}` : ""} - lant`,
          type: "image/png",
        },
      ],
      ...(type === "artist"
        ? {
            type: "profile",
            username: data.name,
          }
        : type === "album"
        ? {
            type: "music.album",
            musicians: data.artist ? [data.artist] : undefined,
            releaseDate: data.year ? data.year.toString() : undefined,
          }
        : {
            type: "music.song",
            musicians: data.artist ? [data.artist] : undefined,
            duration: data.tracks?.[0]?.duration,
          }),
    };

    return {
      title,
      description,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph,
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImageUrl],
      },
      robots: {
        index: true,
        follow: true,
      },
      other: {
        "theme-color": "#11DD66",
        "music:duration": data.tracks?.[0]?.duration?.toString() || "",
      },
    };
  } catch {
    return {
      title: "lant",
      description: "Share music across any platform with one universal link.",
      robots: { index: false, follow: true },
    };
  }
}

// Generate JSON-LD structured data for music entities
function MusicEntityJsonLd({ data, type, id }: { data: any; type: string; id: string }) {
  const canonicalUrl = `${BASE_URL}/${type}/${id}`;

  let jsonLd: any = {
    "@context": "https://schema.org",
    "@type": type === "artist" ? "MusicGroup" : type === "album" ? "MusicAlbum" : "MusicRecording",
    "@id": canonicalUrl,
    name: data.name,
    url: canonicalUrl,
    image: data.image,
    description: `Listen to ${data.name}${data.artist ? ` by ${data.artist}` : ""} on any music platform.`,
    publisher: {
      "@type": "Organization",
      name: "lant",
      url: BASE_URL,
    },
  };

  if (type === "song") {
    const trackDuration = data.tracks?.[0]?.duration;
    jsonLd = {
      ...jsonLd,
      "@type": "MusicRecording",
      byArtist: data.artist ? {
        "@type": "MusicGroup",
        name: data.artist,
      } : undefined,
      duration: trackDuration ? `PT${Math.floor(trackDuration / 60)}M${trackDuration % 60}S` : undefined,
      subjectOf: {
        "@type": "WebPage",
        url: canonicalUrl,
        name: `${data.name} - lant`,
      },
    };
  } else if (type === "album") {
    jsonLd = {
      ...jsonLd,
      "@type": "MusicAlbum",
      byArtist: data.artist ? {
        "@type": "MusicGroup",
        name: data.artist,
      } : undefined,
      datePublished: data.year ? data.year.toString() : undefined,
      numTracks: data.tracks?.length,
      track: data.tracks?.map((track: any, index: number) => ({
        "@type": "MusicRecording",
        name: track.name,
        duration: track.duration ? `PT${Math.floor(track.duration / 60)}M${track.duration % 60}S` : undefined,
        position: index + 1,
      })),
    };
  } else if (type === "artist") {
    jsonLd = {
      ...jsonLd,
      "@type": "MusicGroup",
      genre: data.genres,
      sameAs: Object.values(data.links || {}).filter(Boolean),
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default async function EntityPage({ params }: PageProps) {
  const { type, id } = await params;
  const decoded = decodelantId(id, type);

  if (!decoded || decoded.type !== type) {
    notFound();
  }

  // Handle podcast/audiobook types with unsupported message early
  if (type === "podcast" || type === "audiobook") {
    return <UnsupportedContent type={type} />;
  }

  let data: EntityData;
  try {
    data = await getMusicDataCached(decoded.platform, decoded.type, decoded.platformId);
  } catch (error) {
    console.error('Error fetching music data:', error);
    return (
      <div className="error-page">
        <h1>Error</h1>
        <p>Failed to load music data. Please try again.</p>
        <p className="error-details">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        <Link href="/">← Go home</Link>
      </div>
    );
  }

  return (
    <>
      <MusicEntityJsonLd data={data} type={decoded.type} id={id} />
      <EntityHero data={data} type={decoded.type} />
    </>
  );
}