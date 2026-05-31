import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

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
          background: "#020617",
        }}
      >
        <div
          style={{
            width: "126px",
            height: "126px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "32px",
            background: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)",
            color: "#020617",
            fontSize: "82px",
            fontWeight: 800,
            fontFamily: "Arial, sans-serif",
          }}
        >
          L
        </div>
      </div>
    ),
    size,
  );
}
