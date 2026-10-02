import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social share image. Uses system fonts so the build never needs the network. */
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#142A57",
        color: "#FFFFFF",
        padding: 80,
        position: "relative",
        fontFamily: "serif",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
        <div
          style={{
            fontSize: 28,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: "#C9A35E",
            fontFamily: "sans-serif",
          }}
        >
          {site.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 92, lineHeight: 1.02 }}>
          <span>Everyday jewelry,</span>
          <span style={{ color: "#C9A35E", fontStyle: "italic" }}>under $35.</span>
        </div>
        <div style={{ fontSize: 28, color: "#B9C4DC", fontFamily: "sans-serif" }}>Free shipping · 30-day returns</div>
      </div>
      {/* hang tag */}
      <div
        style={{
          position: "absolute",
          right: 120,
          top: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ width: 2, height: 120, background: "#E9DCC0", opacity: 0.8 }} />
        <div
          style={{
            width: 210,
            height: 300,
            background: "#FBF8F1",
            border: "2px solid #C9A35E",
            borderRadius: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 26,
            boxShadow: "0 20px 40px rgba(31,27,24,0.15)",
          }}
        >
          <div
            style={{ width: 26, height: 26, borderRadius: 13, border: "5px solid #C9A35E", background: "#0F1D3A" }}
          />
          <div style={{ marginTop: 40, fontSize: 20, letterSpacing: 5, color: "#56617A", fontFamily: "sans-serif" }}>
            UNDER
          </div>
          <div style={{ fontSize: 96, lineHeight: 1, color: "#0F1D3A" }}>$35</div>
        </div>
      </div>
    </div>,
    size,
  );
}
