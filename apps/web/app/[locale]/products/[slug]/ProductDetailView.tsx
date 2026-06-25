// Server-rendered product detail view.
// Uses Prisma include data passed by the page.tsx loader.
import { Link } from "@/i18n/routing";

type ProductImage = { id: number; imageUrl: string; altEn?: string | null; altZh?: string | null; order: number; type: string; isMain: boolean };
type ProductSpec = { id: number; keyEn: string; keyZh: string; valueEn: string; valueZh: string; order: number };
type CustomerCase = { id: number; companyName: string; quote?: string | null; productName?: string | null; region?: string | null; logoUrl?: string | null };
type Category = { id: number; nameEn: string; nameZh: string; slug: string };
type Product = {
  id: number; sku: string; slug: string;
  nameEn: string; nameZh: string;
  descriptionEn?: string | null; descriptionZh?: string | null;
  shortDescEn?: string | null; shortDescZh?: string | null;
  mainImages?: string | null; detailImages?: string | null;
  priceMin?: number | null; priceMax?: number | null;
  moq?: number | null; leadTime?: string | null;
  certifications?: string | null;
  fobPort?: string | null;
  packagingInfoEn?: string | null; packagingInfoZh?: string | null;
  category: Category;
  images: ProductImage[];
  specs: ProductSpec[];
  customerCases: CustomerCase[];
};

function parseStringArray(json: string | null | undefined): string[] {
  if (!json) return [];
  try { const arr = JSON.parse(json); return Array.isArray(arr) ? arr.filter((s) => typeof s === "string") : []; } catch { return []; }
}
function parseCerts(json: string | null | undefined): string[] {
  if (!json) return [];
  try { const arr = JSON.parse(json); return Array.isArray(arr) ? arr.filter((s) => typeof s === "string") : []; } catch { return json.split(",").map((s) => s.trim()).filter(Boolean); }
}

export default function ProductDetailView({ product, locale }: { product: Product; locale: string }) {
  const isZh = locale === "zh";
  const t = (en, zh) => (isZh ? (zh || en || "") : (en || zh || ""));
  const name = t(product.nameEn, product.nameZh);
  const description = t(product.descriptionEn, product.descriptionZh);
  const shortDesc = t(product.shortDescEn, product.shortDescZh);
  const packaging = t(product.packagingInfoEn, product.packagingInfoZh);
  const galleryImgs = product.images.length ? product.images.map((i) => i.imageUrl) : parseStringArray(product.mainImages);
  const detailImgs = parseStringArray(product.detailImages);
  const certs = parseCerts(product.certifications);

  return (
    <main className="container mx-auto px-4 py-8 max-w-[1400px]">
      <nav className="text-sm text-stone-gray mb-6" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-primary">{isZh ? "首页" : "Home"}</Link>
        <span className="mx-2">/</span>
        <Link href="/products" className="hover:text-primary">{isZh ? "产品" : "Products"}</Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        <section>
          {galleryImgs[0] ? (
            <div className="aspect-square bg-ivory rounded-2xl overflow-hidden border border-border-cream">
              <img src={galleryImgs[0]} alt={name} width={800} height={800} loading="eager" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="aspect-square bg-ivory rounded-2xl border border-border-cream flex items-center justify-center text-stone-gray">No image available</div>
          )}
          {galleryImgs.length > 1 ? (
            <ul className="mt-4 grid grid-cols-4 gap-2" aria-label="Gallery thumbnails">
              {galleryImgs.slice(1, 5).map((src, i) => (
                <li key={i} className="aspect-square bg-ivory rounded-lg overflow-hidden border border-border-cream">
                  <img src={src} alt={name + " " + (i + 2)} loading="lazy" className="w-full h-full object-cover" />
                </li>
              ))}
            </ul>
          ) : null}
        </section>

        <section>
          <h1 className="text-3xl md:text-4xl font-serif font-medium text-foreground mb-3">{name}</h1>
          <p className="text-sm text-stone-gray mb-4">SKU: {product.sku}</p>
          {shortDesc ? <p className="text-lg text-charcoal-warm mb-6 leading-relaxed">{shortDesc}</p> : null}
          <dl className="grid grid-cols-2 gap-4 mb-6">
            {product.moq ? <div><dt className="text-xs uppercase text-stone-gray">MOQ</dt><dd className="text-lg font-medium">{product.moq} pcs</dd></div> : null}
            {product.leadTime ? <div><dt className="text-xs uppercase text-stone-gray">{isZh ? "交期" : "Lead time"}</dt><dd className="text-lg font-medium">{product.leadTime}</dd></div> : null}
            {product.priceMin != null ? <div><dt className="text-xs uppercase text-stone-gray">{isZh ? "价格区间" : "Price range"}</dt><dd className="text-lg font-medium">USD {product.priceMin}{product.priceMax && product.priceMax !== product.priceMin ? " - " + product.priceMax : ""}</dd></div> : null}
            {product.fobPort ? <div><dt className="text-xs uppercase text-stone-gray">FOB Port</dt><dd className="text-lg font-medium">{product.fobPort}</dd></div> : null}
          </dl>
          {certs.length > 0 ? (
            <div className="mb-6">
              <p className="text-xs uppercase text-stone-gray mb-2">{isZh ? "认证" : "Certifications"}</p>
              <ul className="flex flex-wrap gap-2">
                {certs.map((c) => <li key={c} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{c}</li>)}
              </ul>
            </div>
          ) : null}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <a href={"/inquiry?product=" + product.id} className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-terracotta text-ivory font-medium hover:bg-terracotta/90">{isZh ? "立即询价" : "Request a Quote"}</a>
            <Link href="/contact" className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-ivory">{isZh ? "联系我们" : "Contact Us"}</Link>
          </div>
        </section>
      </div>

      {description ? (
        <section className="mt-12">
          <h2 className="text-2xl font-serif font-medium mb-4">{isZh ? "产品描述" : "Description"}</h2>
          <p className="text-charcoal-warm leading-relaxed whitespace-pre-line">{description}</p>
        </section>
      ) : null}

      {product.specs.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-serif font-medium mb-4">{isZh ? "规格" : "Specifications"}</h2>
          <table className="w-full text-left border-collapse">
            <tbody>
              {product.specs.map((s) => (
                <tr key={s.id} className="border-b border-border-cream">
                  <th className="py-3 pr-4 font-medium text-foreground w-1/3">{t(s.keyEn, s.keyZh)}</th>
                  <td className="py-3 text-charcoal-warm">{t(s.valueEn, s.valueZh)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}

      {detailImgs.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-serif font-medium mb-4">{isZh ? "详情图片" : "Detail Images"}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {detailImgs.map((src, i) => (
              <li key={i} className="rounded-xl overflow-hidden border border-border-cream">
                <img src={src} alt={name + " detail " + (i + 1)} loading="lazy" className="w-full h-auto" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {packaging ? (
        <section className="mt-12">
          <h2 className="text-2xl font-serif font-medium mb-4">{isZh ? "包装信息" : "Packaging"}</h2>
          <p className="text-charcoal-warm leading-relaxed whitespace-pre-line">{packaging}</p>
        </section>
      ) : null}

      {product.customerCases.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-2xl font-serif font-medium mb-4">{isZh ? "客户案例" : "Customer Cases"}</h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {product.customerCases.map((c) => (
              <li key={c.id} className="rounded-xl border border-border-cream bg-ivory p-5">
                {c.logoUrl ? <img src={c.logoUrl} alt={c.companyName} className="h-10 w-auto mb-3" loading="lazy" /> : null}
                <p className="font-medium text-foreground mb-1">{c.companyName}</p>
                {c.region ? <p className="text-xs text-stone-gray mb-2">{c.region}</p> : null}
                {c.quote ? <p className="text-sm text-charcoal-warm italic">&quot;{c.quote}&quot;</p> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}