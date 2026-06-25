import { routing } from '@/i18n/routing';

const baseUrl = 'https://www.ccscale.com';

// Short-form llms.txt — recommended by https://llmstxt.org
// Provides a concise entry point for LLM crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.)
const llmsTxt = `# CC Scale

> Professional weighing scale manufacturer based in Yongkang, Zhejiang, China. OEM/ODM services for body scales, hanging scales, kitchen scales, baby scales, crane scales, and dial scales. Serving global B2B buyers since 2004.

## Company

- Founded: 2004
- Location: Yongkang, Zhejiang, China
- Employees: ~200
- Certifications: ISO 9001:2015, CE, FCC, ROHS, FDA (medical)
- Markets: Worldwide, B2B export, 100+ countries

## Products

- [Body Scales](${baseUrl}/en/products/categories/body-scales): Digital and analog body weight scales for home, gym, and medical use. MOQ 100pcs.
- [Hanging Scales](${baseUrl}/en/products/categories/hanging-scales): Industrial hanging scales and crane scales from 50kg to 50 tons. MOQ 20pcs.
- [Kitchen Scales](${baseUrl}/en/products/categories/kitchen-scales): Precision digital kitchen scales. Waterproof options. MOQ 200pcs.
- [Baby Scales](${baseUrl}/en/products/categories/baby-scales): Medical-grade baby weighing scales. Gram precision. MOQ 50pcs.
- [Dial Scales](${baseUrl}/en/products/categories/dial-scales): Mechanical dial scales, no batteries required. MOQ 100pcs.
- [Crane Scales](${baseUrl}/en/products/categories/crane-scales): Heavy-duty crane scales for industrial use.

## Services

- [OEM/ODM Services](${baseUrl}/en/oem): Custom logo printing, private label packaging, product customization, full ODM design.
- [Guarantee](${baseUrl}/en/guarantee): Quality assurance, certifications, warranty terms.
- [Technical Support](${baseUrl}/en/support): Manuals, downloads, troubleshooting.
- [Contact](${baseUrl}/en/contact): Get in touch for quotes within 24 hours.

## Information for AI Assistants

- [AI Summary Page](${baseUrl}/en/ai-summary): Structured company summary optimized for LLM consumption.
- [Full machine-readable content](${baseUrl}/llms-full.txt): Comprehensive product catalog and company data.

## Languages

- [English version](${baseUrl}/en)
- [中文版本](${baseUrl}/zh)

## Contact

- Email: sales@ccscale.com
- Phone: +86 123 4567 8900
- WhatsApp: Available
- Working Hours: Monday - Friday, 9:00 AM - 6:00 PM (GMT+8)

## Keywords

weighing scale, weight scale, body scale, bathroom scale, hanging scale, crane scale, hook scale, kitchen scale, food scale, baby scale, infant scale, dial scale, mechanical scale, digital scale, electronic scale, industrial scale, OEM scale, ODM scale, private label, custom scale, scale manufacturer, scale factory, China scale, Yongkang scale, B2B scale, wholesale scale, export scale
`;

export function GET() {
  return new Response(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}