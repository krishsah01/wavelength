import { ImageResponse } from "next/og";
import { getInterestBySlug } from "@/lib/interests";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: Promise<{ interest: string }>;
}

export default async function OGImage({ params }: Props) {
  const { interest: slug } = await params;
  const interest = getInterestBySlug(slug);
  const name = interest?.name ?? "Your People";
  const category = interest?.category ?? "Community";

  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f0d0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "#f5a623",
            }}
          />
          <span style={{ color: "#f5a623", fontSize: "22px", fontWeight: "600" }}>
            Wavelength
          </span>
        </div>

        <div>
          <p style={{ color: "#6b5f4a", fontSize: "16px", marginBottom: "16px", textTransform: "uppercase", letterSpacing: "3px" }}>
            {category}
          </p>
          <h1 style={{ color: "#ede8d8", fontSize: "56px", fontWeight: "700", lineHeight: 1.1, margin: "0 0 24px 0" }}>
            Find your {name} people
          </h1>
          <p style={{ color: "#a09070", fontSize: "22px", margin: 0 }}>
            AI-powered matching for people with deep, specific interests
          </p>
        </div>
      </div>
    ),
    size
  );
}
