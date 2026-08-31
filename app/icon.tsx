import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 8,
          color: "white",
          fontSize: 18,
          fontWeight: 800,
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
