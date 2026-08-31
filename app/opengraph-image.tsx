import { ImageResponse } from "next/og";

export const alt = "Subtech Ajo Solution — Digital Ajo Savings in Nigeria";
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
          background: "linear-gradient(145deg, #0D1A6E 0%, #1A35D4 58%, #0F766E 100%)",
          padding: "72px 80px",
          color: "white",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
            }}
          >
            S
          </div>
          Subtech Ajo Solution
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div
            style={{
              fontSize: 72,
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              fontWeight: 800,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span style={{ color: "#F5A623" }}>Ajo,</span>
            <span>automated.</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.72)",
              maxWidth: 760,
              lineHeight: 1.35,
            }}
          >
            Target and general savings plans for Nigeria — with a live passbook and payouts to your bank.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 20,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          <span>ajoflow.com</span>
          <span>Save together, grow together</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
