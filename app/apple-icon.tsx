import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1B2F6B 0%, #0F766E 100%)",
          color: "white",
          fontSize: 88,
          fontWeight: 800,
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
