import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Music";
  const artist = searchParams.get("artist") || "";
  const image = searchParams.get("image") || "";

  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#0a0a0a",
            padding: "60px 80px",
          }}
        >
          {image ? (
            <img
              src={image}
              alt=""
              width="320"
              height="320"
              style={{
                borderRadius: "24px",
                objectFit: "cover",
                marginRight: "50px",
              }}
            />
          ) : (
            <div
              style={{
                width: "320px",
                height: "320px",
                borderRadius: "24px",
                backgroundColor: "#161618",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "50px",
                border: "2px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  fontSize: "80px",
                  color: "#11DD66",
                  fontWeight: "bold",
                }}
              >
                lant
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 1,
              maxWidth: image ? "670px" : "1000px",
            }}
          >
            <div
              style={{
                fontSize: title.length > 30 ? "46px" : "56px",
                fontWeight: "bold",
                color: "#ffffff",
                lineHeight: 1.15,
                marginBottom: "16px",
              }}
            >
              {title.length > 50 ? title.slice(0, 47) + "..." : title}
            </div>

            {artist ? (
              <div
                style={{
                  fontSize: "30px",
                  color: "#a1a1a6",
                  marginBottom: "36px",
                }}
              >
                {artist.length > 50 ? artist.slice(0, 47) + "..." : artist}
              </div>
            ) : null}

            <div
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  backgroundColor: "#11DD66",
                  color: "#000000",
                  padding: "12px 28px",
                  borderRadius: "999px",
                  fontSize: "20px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Open in lant
              </div>
              <div
                style={{
                  marginLeft: "24px",
                  color: "#666672",
                  fontSize: "20px",
                  fontWeight: 500,
                  display: "flex",
                }}
              >
                lant.lol
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=86400, s-maxage=86400",
        },
      }
    );
  } catch {
    // Graceful fallback without image if external image fails to fetch
    try {
      return new ImageResponse(
        (
          <div
            style={{
              height: "100%",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: "#0a0a0a",
              padding: "60px 80px",
            }}
          >
            <div
              style={{
                fontSize: "56px",
                fontWeight: "bold",
                color: "#ffffff",
                marginBottom: "16px",
              }}
            >
              {title}
            </div>
            {artist ? (
              <div
                style={{
                  fontSize: "30px",
                  color: "#a1a1a6",
                  marginBottom: "36px",
                }}
              >
                {artist}
              </div>
            ) : null}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  backgroundColor: "#11DD66",
                  color: "#000000",
                  padding: "12px 28px",
                  borderRadius: "999px",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Open in lant
              </div>
              <div
                style={{
                  marginLeft: "24px",
                  color: "#666672",
                  fontSize: "20px",
                }}
              >
                lant.lol
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
          headers: {
            "Cache-Control": "public, max-age=86400, s-maxage=86400",
          },
        }
      );
    } catch {
      return new Response("Failed to generate image", { status: 500 });
    }
  }
}
