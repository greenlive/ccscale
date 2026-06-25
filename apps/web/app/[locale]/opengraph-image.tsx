import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "CC Scale - Professional Weighing Scale Manufacturer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { locale: string };
}

export default function HomeOpenGraphImage({ params }: Props) {
  const { locale } = params;
  const isZh = locale === "zh";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
          color: "white",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            fontSize: 28,
            fontWeight: 600,
            color: "#93c5fd",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
            }}
          >
            C
          </div>
          CC Scale
        </div>

        {/* Spacer */}
        <div style={{ height: 80 }} />

        {/* Headline */}
        <div
          style={{
            display: "flex",
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.05,
            maxWidth: 1040,
            letterSpacing: "-0.025em",
          }}
        >
          {isZh ? "专业称重产品源头工厂" : "Professional Weighing Scale Manufacturer"}
        </div>

        {/* Subhead */}
        <div style={{ height: 32 }} />
        <div
          style={{
            display: "flex",
            fontSize: 36,
            color: "#cbd5e1",
            lineHeight: 1.4,
            maxWidth: 1040,
          }}
        >
          {isZh
            ? "20+ 年出口经验 · 100+ 国家 · CE/FCC/ROHS 认证 · OEM/ODM 一站式"
            : "20+ years export experience · 100+ countries · CE/FCC/ROHS certified · OEM/ODM one-stop"}
        </div>

        {/* Bottom row */}
        <div style={{ flex: 1 }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            fontSize: 24,
            color: "#93c5fd",
          }}
        >
          <div style={{ display: "flex", gap: 32 }}>
            <div>Body Scales</div>
            <div>Kitchen Scales</div>
            <div>Baby Scales</div>
            <div>Crane Scales</div>
          </div>
          <div style={{ display: "flex" }}>ccscale.com</div>
        </div>
      </div>
    ),
    { ...size },
  );
}