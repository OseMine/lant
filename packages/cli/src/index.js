#!/usr/bin/env node

const BASE_URL = "https://lant.lol";

const MUSIC_PATTERNS = [
  { platform: "Spotify", pattern: /open\.spotify\.com\/(track|artist|album)\// },
  { platform: "Apple Music", pattern: /music\.apple\.com\/.*\/(album|artist|song)\// },
  { platform: "Deezer", pattern: /deezer\.com\/.*\/(track|artist|album)\// },
  { platform: "Tidal", pattern: /tidal\.com\/(browse\/)?(track|artist|album)\// },
  { platform: "YouTube", pattern: /youtube\.com\/watch\?v=|youtu\.be\// },
  { platform: "Amazon Music", pattern: /music\.amazon\.com\/(albums|artists)\// },
  { platform: "Bandcamp", pattern: /bandcamp\.com\/(album|track)\// },
];

function detectPlatform(url) {
  for (const { platform, pattern } of MUSIC_PATTERNS) {
    if (pattern.test(url)) return platform;
  }
  return null;
}

function printHelp() {
  console.log(`
  \x1b[35mlant CLI\x1b[0m - Music Link Unifier

  Usage:
    lant resolve <url>     Resolve a music URL to a universal lant URL
    lant detect <url>      Detect the platform of a music URL
    lant open <url>        Resolve and open in browser
    lant help              Show this help message

  Examples:
    lant resolve https://open.spotify.com/track/4cOdK2wGEL8SetjwfNnPKc
    lant detect https://music.apple.com/us/album/bohemian-rhapsody/1440806041
    lant open https://tidal.com/browse/track/12345678

  Supported platforms:
    Spotify, Apple Music, Deezer, Tidal, YouTube, Amazon Music, Bandcamp
  `);
}

async function resolveUrl(url) {
  const platform = detectPlatform(url);
  if (!platform) {
    console.error(`\x1b[31mError:\x1b[0m Not a supported music URL.`);
    console.error(`Supported: Spotify, Apple Music, Deezer, Tidal, YouTube, Amazon Music, Bandcamp`);
    process.exit(1);
  }

  console.log(`\x1b[90mDetected:\x1b[0m ${platform}`);
  console.log(`\x1b[90mResolving...\x1b[0m`);

  try {
    const response = await fetch(`${BASE_URL}/api/resolve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (data.error) {
      console.error(`\x1b[31mError:\x1b[0m ${data.error}`);
      process.exit(1);
    }

    const entity = data.entity;
    const lantUrl = `${BASE_URL}${data.lantUrl}`;

    console.log("");
    console.log(`  \x1b[1m${entity.name}\x1b[0m`);
    if (entity.artist) console.log(`  \x1b[90mby ${entity.artist}\x1b[0m`);
    if (entity.year) console.log(`  \x1b[90m${entity.year}\x1b[0m`);
    console.log("");
    console.log(`  \x1b[35mlant URL:\x1b[0m ${lantUrl}`);
    console.log("");

    if (Object.keys(entity.links).length > 0) {
      console.log("  \x1b[1mAvailable on:\x1b[0m");
      for (const [key, link] of Object.entries(entity.links)) {
        const name = key.charAt(0).toUpperCase() + key.slice(1).replace(/music/, " Music");
        console.log(`    \x1b[36m${name}\x1b[0m ${link}`);
      }
    }

    return { lantUrl, entity };
  } catch (error) {
    console.error(`\x1b[31mError:\x1b[0m Failed to resolve. ${error.message}`);
    process.exit(1);
  }
}

async function detectUrl(url) {
  const platform = detectPlatform(url);
  if (platform) {
    console.log(`\x1b[36m${platform}\x1b[0m`);
  } else {
    console.log(`\x1b[31mUnknown\x1b[0m`);
    process.exit(1);
  }
}

async function openUrl(url) {
  const { lantUrl } = await resolveUrl(url);
  const { exec } = await import("child_process");
  const platform = process.platform;
  const cmd =
    platform === "darwin"
      ? `open "${lantUrl}"`
      : platform === "win32"
        ? `start "${lantUrl}"`
        : `xdg-open "${lantUrl}"`;
  exec(cmd);
}

// Parse arguments
const args = process.argv.slice(2);
const command = args[0];
const url = args[1];

switch (command) {
  case "resolve":
  case "r":
    if (!url) {
      console.error(`\x1b[31mError:\x1b[0m Please provide a URL.`);
      console.error(`Usage: lant resolve <url>`);
      process.exit(1);
    }
    resolveUrl(url);
    break;

  case "detect":
  case "d":
    if (!url) {
      console.error(`\x1b[31mError:\x1b[0m Please provide a URL.`);
      process.exit(1);
    }
    detectUrl(url);
    break;

  case "open":
  case "o":
    if (!url) {
      console.error(`\x1b[31mError:\x1b[0m Please provide a URL.`);
      process.exit(1);
    }
    openUrl(url);
    break;

  case "help":
  case "--help":
  case "-h":
    printHelp();
    break;

  default:
    if (command && command.includes("http")) {
      // If a URL is provided without a command, default to resolve
      resolveUrl(command);
    } else {
      printHelp();
    }
    break;
}
