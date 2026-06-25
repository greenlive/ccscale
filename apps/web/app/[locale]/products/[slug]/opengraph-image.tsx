import { ImageResponse } from "next/og";
import { prisma } from "@cc-scale/database";

// Use Edge runtime for fastest cold start
// Prisma cannot run in edge runtime. Use nodejs runtime for
// product OG image generation (still very fast on Vercel).
export const runtime = "nodejs";
export const alt = "CC Scale Product";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface Props {
  params: { locale: string; slug: string };
}

export default async function ProductOpenGraphImage({ params }: Props) {
  const { locale, slug } = params;
  const isZh = locale === "zh";

  const product = await prisma.product.findFirst({
    where: { slug, isActive: true },
    select: {
      nameEn: true,
      nameZh: true,
      shortDescEn: true,
      shortDescZh: true,
      priceMin: true,
      priceMax: true,
      moq: true,
      mainImages: true,
    },
  });

  const title = product
    ? isZh
      ? product.nameZh
      : product.nameEn
    : "CC Scale";

  const subtitle = product
    ? isZh
      ? product.shortDescZh || "专业称重产品,源头工厂"
      : product.shortDescEn || "Professional weighing scale, OEM/ODM factory direct"
    : "Professional weighing scale manufacturer";

  const price =
    product?.priceMin && product?.priceMax
      ? `$${product.priceMin} - $${product.priceMax}`
      : null;

  const moq = product?.moq ? `MOQ: ${product.moq} pcs` : null;

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
          CC Scale — Professional Weighing Scale Manufacturer
        </div>

        {/* Spacer */}
        <div style={{ height: 40 }} />

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            lineHeight: 1.1,
            maxWidth: 1040,
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </div>

        {/* Spacer */}
        <div style={{ height: 24 }} />

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: 32,
            color: "#cbd5e1",
            lineHeight: 1.4,
            maxWidth: 1040,
          }}
        >
          {subtitle}
        </div>

        {/* Bottom row */}
        <div style={{ flex: 1 }} />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            width: "100%",
            fontSize: 28,
          }}
        >
          <div style={{ display: "flex", gap: 32, color: "#93c5fd" }}>
            {price ? (
              <div style={{ display: "flex" }}>Price: {price}</div>
            ) : null}
            {moq ? <div style={{ display: "flex" }}>{moq}</div> : null}
            <div style={{ display: "flex" }}>20+ Years | 100+ Countries</div>
          </div>
          <div style={{ display: "flex", color: "#60a5fa", fontSize: 24 }}>
            ccscale.com/{locale}/products/{slug}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}