import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Wavelength — Find Your People";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0f0d0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f5a623, #e8853a)",
            }}
          />
          <span
            style={{
              fontSize: "48px",
              fontWeight: "700",
              color: "#f5a623",
              letterSpacing: "-1px",
            }}
          >
            Wavelength
          </span>
        </div>
        <p
          style={{
            fontSize: "28px",
            color: "#ede8d8",
            textAlign: "center",
            maxWidth: "760px",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          Find your people through the power of shared interests
        </p>
        <p
          style={{
            fontSize: "18px",
            color: "#a09070",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          AI-powered matching for people with niche, specific, and unusual interests
        </p>
      </div>
    ),
    size
  );
}
