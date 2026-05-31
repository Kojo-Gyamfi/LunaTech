import { ImageResponse } from "next/og";

export const size = {
  width: 64,
  height: 64,
};

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
          background: "#020617",
          borderRadius: "16px",
        }}
      >
        <div
          style={{
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #fcd34d 0%, #f59e0b 100%)",
            color: "#020617",
            fontSize: "28px",
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
