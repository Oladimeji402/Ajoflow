import { ImageResponse } from "next/og";

export const alt = "AjoFlow | Digital Ajo & Automated Savings in Nigeria";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F7F3EC",
          padding: "72px 80px",
          color: "#0D1A6E",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "#0D1A6E",
              color: "#F5A623",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              fontWeight: 800,
            }}
          >
            A
          </div>
          AjoFlow
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(13,26,110,0.45)",
            }}
          >
            Digital Ajo · Savings · Payouts
          </div>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.08,
              letterSpacing: "-0.04em",
              fontWeight: 800,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Your Ajo,</span>
            <span style={{ color: "#F5A623" }}>finally organized.</span>
          </div>
          <div
            style={{
              fontSize: 26,
              color: "rgba(13,26,110,0.62)",
              maxWidth: 780,
              lineHeight: 1.35,
            }}
          >
            Automate contributions, track every naira, and stay on top of payouts in Nigeria.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "rgba(13,26,110,0.48)",
          }}
        >
          <span>ajoflow.com</span>
          <span>Digital Ajo & automated savings</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
