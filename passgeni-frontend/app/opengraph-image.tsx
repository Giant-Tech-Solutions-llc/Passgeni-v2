import { ImageResponse } from "next/og";
import { hashGrid } from "@/lib/hashgrid";

export const alt = "PassGeni — Passwords your auditor won't question";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CELL = 34;
const COLS = Math.ceil(1200 / CELL);
const ROWS = Math.ceil(630 / CELL);

export default function OgImage() {
  const cells = hashGrid("passgeni:v3:og", COLS, ROWS, 0.38);
  const alpha = [0.06, 0.11, 0.2];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0A102E",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* the commitment grid — the brand texture */}
        {cells
          .filter((c) => c.tier > 0)
          .map((c) => (
            <div
              key={`${c.col}-${c.row}`}
              style={{
                position: "absolute",
                left: c.col * CELL + 8,
                top: c.row * CELL + 8,
                width: CELL - 16,
                height: CELL - 16,
                borderRadius: 4,
                background: `rgba(143, 163, 255, ${alpha[c.tier - 1]})`,
              }}
            />
          ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            color: "#8FA3FF",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: "0.09em",
          }}
        >
          CREDENTIAL COMPLIANCE INFRASTRUCTURE
        </div>
        <div
          style={{
            marginTop: 28,
            color: "#EDF0FB",
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            maxWidth: 900,
          }}
        >
          Passwords your auditor won&rsquo;t question.
        </div>
        <div
          style={{
            marginTop: 32,
            display: "flex",
            alignItems: "center",
            gap: 14,
            color: "#B4BCDD",
            fontSize: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 40,
              height: 40,
              borderRadius: 9,
              background: "#0320FF",
            }}
          />
          PassGeni · evidence, not intentions
        </div>
      </div>
    ),
    size,
  );
}
