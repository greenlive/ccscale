'use client';

import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

interface SiteSettingsMap {
  [key: string]: string;
}

function useSiteSettings(): SiteSettingsMap {
  const [settings, setSettings] = useState<SiteSettingsMap>({});
  useEffect(() => {
    fetch('/api/site-settings')
      .then(r => r.ok ? r.json() : {})
      .then(data => setSettings(data))
      .catch(() => {});
  }, []);
  return settings;
}

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
}

export function OrganizationSchema({
  name: propName,
  url = 'https://www.zzscale.com',
  logo = 'https://www.zzscale.com/logo.svg',
}: OrganizationSchemaProps) {
  const locale = useLocale();
  const settings = useSiteSettings();
  const name = propName || settings.companyNameEn || 'CC Scale';
  const phone = settings.contactPhone || '+86-123-4567-8900';
  const email = settings.contactEmail || 'sales@zzscale.com';
  const addressEn = settings.contactAddressEn || 'No. 88, Industrial Park, Yongkang, Zhejiang, China';

  // Parse address components
  const addressParts = addressEn.split(',').map(s => s.trim());
  const streetAddress = addressParts[0] || 'No. 88, Industrial Park';
  const addressLocality = addressParts[1] || 'Yongkang';
  const addressRegion = addressParts.length > 2 ? addressParts[addressParts.length - 2] : 'Zhejiang';
  const addressCountry = addressParts.length > 2 ? addressParts[addressParts.length - 1] : 'China';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}#organization`,
    name,
    url,
    logo,
    image: logo,
    sameAs: [
      settings.socialFacebook || 'https://www.facebook.com/zzscale',
      settings.socialTwitter || 'https://www.twitter.com/zzscale',
      settings.socialLinkedIn || 'https://www.linkedin.com/company/zzscale',
      settings.socialYouTube || 'https://www.youtube.com/@zzscale',
    ].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: phone,
      contactType: 'customer service',
      availableLanguage: ['English', 'Chinese'],
      email: email,
      hoursAvailable: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '18:00',
        },
      ],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality,
      addressRegion,
      addressCountry,
    },
    areaServed: ['Worldwide', 'North America', 'Europe', 'Asia'],
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: locale === 'en' ? 'Custom Weighing Scales' : '瀹氬埗琛″櫒',
        description: locale === 'en'
          ? 'OEM/ODM manufacturing services for weighing scales including body scales, hanging scales, kitchen scales, and more.'
          : '鎻愪緵浣撻噸绉ゃ€佸悐绉ゃ€佸帹鎴跨Г绛夎　鍣ㄧ殑OEM/ODM鍒堕€犳湇鍔°€?,
      },
    },
  };

  return (
    <script
      id="schema-organization"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductSchemaProps {
  name: string;
  description: string;
  image: string;
  sku?: string;
  brand?: string;
  category?: string;
  mpn?: string;
  aggregateRating?: {
    ratingValue: string;
    reviewCount: string;
    bestRating?: string;
  };
  offers?: {
    price?: string;
    priceCurrency?: string;
    availability?: string;
    url?: string;
    priceValidUntil?: string;
    minOrderQuantity?: number;
  };
  additionalProperty?: Array<{
    name: string;
    value: string;
  }>;
}

export function ProductSchema({
  name,
  description,
  image,
  sku,
  brand: propBrand,
  category,
  mpn,
  aggregateRating,
  offers,
  additionalProperty,
}: ProductSchemaProps) {
  const settings = useSiteSettings();
  const brand = propBrand || settings.companyNameEn || 'CC Scale';
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: Array.isArray(image) ? image : [image],
    brand: {
      '@type': 'Brand',
      name: brand,
      url: 'https://www.zzscale.com',
    },
    manufacturer: {
      '@type': 'Organization',
      name: brand,
    },
  };

  if (sku) schema.sku = sku;
  if (mpn) schema.mpn = mpn;
  if (category) schema.category = category;
  if (additionalProperty) schema.additionalProperty = additionalProperty;

  // Add aggregate rating for trust signals
  if (aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: aggregateRating.ratingValue,
      reviewCount: aggregateRating.reviewCount,
      bestRating: aggregateRating.bestRating || '5',
    };
  }

  if (offers) {
    schema.offers = {
      '@type': 'Offer',
      priceCurrency: offers.priceCurrency || 'USD',
      availability: offers.availability || 'https://schema.org/InStock',
      url: offers.url,
      priceValidUntil: offers.priceValidUntil,
      businessFunction: 'https://purl.org/goodrelations/v1#Sell',
      eligibleQuantity: offers.minOrderQuantity ? {
        '@type': 'QuantitativeValue',
        value: offers.minOrderQuantity,
        unitText: 'piece',
      } : undefined,
    };
    if (offers.price) schema.offers.price = offers.price;
  }

  return (
    <script
      id="schema-product"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      id="schema-breadcrumb"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebSiteSchemaProps {
  name?: string;
  url?: string;
  searchUrl?: string;
}

export function WebSiteSchema({
  name: propName,
  url = 'https://www.zzscale.com',
  searchUrl = 'https://www.zzscale.com/search?q={search_term_string}',
}: WebSiteSchemaProps) {
  const settings = useSiteSettings();
  const name = propName || settings.companyNameEn || 'CC Scale';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}#website`,
    name,
    url,
    publisher: {
      '@id': `${url}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrl,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: ['en', 'zh'],
  };

  return (
    <script
      id="schema-website"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface AboutPageSchemaProps {
  locale?: string;
}

export function AboutPageSchema({ locale = 'en' }: AboutPageSchemaProps) {
  const settings = useSiteSettings();
  const brandName = settings.companyNameEn || 'CC Scale';
  const brandNameZh = settings.companyNameZh || 'CC琛″櫒';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: locale === 'en' ? `About ${brandName}` : '鍏充簬鎴戜滑',
    description: locale === 'en'
      ? `Learn about ${brandName}, your trusted partner for professional weighing solutions with over 20 years of manufacturing experience.`
      : `浜嗚В${brandNameZh}锛屾偍鍊煎緱淇¤禆鐨勪笓涓氳　鍣ㄨВ鍐虫柟妗堝悎浣滀紮浼达紝鎷ユ湁20澶氬勾鐨勫埗閫犵粡楠屻€俙,
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://www.zzscale.com#organization',
    },
  };

  return (
    <script
      id="schema-about"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ContactPageSchemaProps {
  locale?: string;
}

export function ContactPageSchema({ locale = 'en' }: ContactPageSchemaProps) {
  const settings = useSiteSettings();
  const brandName = settings.companyNameEn || 'CC Scale';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: locale === 'en' ? `Contact ${brandName}` : '鑱旂郴鎴戜滑',
    description: locale === 'en'
      ? `Get in touch with ${brandName} for inquiries about our weighing scales and OEM/ODM services.`
      : `鑱旂郴${settings.companyNameZh || 'CC Scale'}锛屽挩璇㈡垜浠殑琛″櫒浜у搧鍜孫EM/ODM鏈嶅姟銆俙,
  };

  return (
    <script
      id="schema-contact"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface CollectionPageSchemaProps {
  name: string;
  description: string;
  locale?: string;
}

export function CollectionPageSchema({
  name,
  description,
  locale = 'en',
}: CollectionPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    description,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [],
    },
  };

  return (
    <script
      id="schema-collection"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface AISummarySchemaProps {
  locale?: string;
}

export function AISummarySchema({ locale = 'en' }: AISummarySchemaProps) {
  const settings = useSiteSettings();
  const brandName = settings.companyNameEn || 'CC Scale';
  const brandNameZh = settings.companyNameZh || 'CC琛″櫒';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: locale === 'en' ? `AI Summary - ${brandName}` : `AI鎽樿 - ${brandNameZh}`,
    description: locale === 'en'
      ? `Structured summary of ${brandName} for AI assistants and large language models.`
      : `涓篈I鍔╂墜鍜屽ぇ璇█妯″瀷鎻愪緵鐨?{brandNameZh}缁撴瀯鍖栨憳瑕併€俙,
    about: {
      '@type': 'Organization',
      name: brandName,
      description: locale === 'en'
        ? `${brandName} is a leading manufacturer of weighing scales based in Yongkang, Zhejiang, China. We specialize in body scales, hanging scales, kitchen scales, baby scales, crane scales, dial scales, and industrial weighing equipment. We offer OEM/ODM manufacturing services with MOQ flexibility, custom branding, and private labeling options.`
        : `${brandNameZh}鏄綅浜庝腑鍥芥禉姹熸案搴风殑棰嗗厛琛″櫒鍒堕€犲晢銆傛垜浠笓涓氱敓浜т綋閲嶇Г銆佸悐绉ゃ€佸帹鎴跨Г銆佸┐鍎跨Г銆佸悐閽╃Г銆佸害鐩樼Г鍜屽伐涓氱О閲嶈澶囥€傛垜浠彁渚汷EM/ODM鍒堕€犳湇鍔★紝鍏锋湁鐏垫椿鐨勮捣璁㈤噺銆佸畾鍒跺搧鐗屽拰绉佹湁鏍囩閫夐」銆俙,
      foundingDate: '2004',
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: '200',
        unitText: 'employees',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: locale === 'en' ? 'Weighing Scale Product Catalog' : '琛″櫒浜у搧鐩綍',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: locale === 'en' ? 'Body Scales' : '浣撻噸绉?,
              description: locale === 'en' ? 'Digital and analog body weight scales for home and professional use.' : '瀹剁敤鍜屼笓涓氱敤鏁板瓧鍜屾ā鎷熶綋閲嶇Г銆?,
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: locale === 'en' ? 'Hanging Scales' : '鍚婄Г',
              description: locale === 'en' ? 'Industrial hanging scales and crane scales for heavy duty weighing.' : '鐢ㄤ簬閲嶅瀷绉伴噸鐨勫伐涓氬悐绉ゅ拰鍚婇挬绉ゃ€?,
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: locale === 'en' ? 'Kitchen Scales' : '鍘ㄦ埧绉?,
              description: locale === 'en' ? 'Precision digital kitchen scales for cooking and food preparation.' : '鐢ㄤ簬鐑归オ鍜岄鐗╁埗澶囩殑绮惧瘑鏁板瓧鍘ㄦ埧绉ゃ€?,
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: locale === 'en' ? 'Baby Scales' : '濠村効绉?,
              description: locale === 'en' ? 'Accurate baby weighing scales for medical and home use.' : '鐢ㄤ簬鍖荤枟鍜屽搴娇鐢ㄧ殑绮剧‘濠村効绉ゃ€?,
            },
          },
        ],
      },
      knowsAbout: [
        'weighing scales',
        'body scales',
        'hanging scales',
        'kitchen scales',
        'baby scales',
        'crane scales',
        'dial scales',
        'OEM manufacturing',
        'ODM services',
        'private label',
        'custom branding',
        'B2B export',
        'international trade',
      ],
    },
  };

  return (
    <script
      id="schema-ai-summary"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Page Schema - Helps AI and search engines understand Q&A content
interface FAQItem {
  question: string;
  questionZh: string;
  answer: string;
  answerZh: string;
}

interface FAQPageSchemaProps {
  faqs: FAQItem[];
  locale?: string;
}

export function FAQPageSchema({ faqs, locale = 'en' }: FAQPageSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: locale === 'zh' ? faq.questionZh : faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: locale === 'zh' ? faq.answerZh : faq.answer,
      },
    })),
  };

  return (
    <script
      id="schema-faq"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// FAQ Schema for home/contact pages with default common questions
const defaultFAQs: FAQItem[] = [
  {
    question: 'What is your minimum order quantity (MOQ)?',
    questionZh: '浣犱滑鐨勬渶灏忚捣璁㈤噺鏄灏戯紵',
    answer: 'Our MOQ varies by product type. Generally, MOQ ranges from 50-200 pieces per model. For OEM/ODM orders, MOQ may be higher depending on customization requirements.',
    answerZh: '鎴戜滑鐨勮捣璁㈤噺鍥犱骇鍝佺被鍨嬭€屽紓銆備竴鑸瘡娆?0-200浠惰捣璁€傚浜嶰EM/ODM璁㈠崟锛屾牴鎹畾鍒惰姹傦紝璧疯閲忓彲鑳芥洿楂樸€?,
  },
  {
    question: 'Do you offer OEM/ODM services?',
    questionZh: '浣犱滑鎻愪緵OEM/ODM鏈嶅姟鍚楋紵',
    answer: 'Yes, we offer comprehensive OEM/ODM services including custom logo printing, private label packaging, and product design modifications. We have extensive experience serving global B2B buyers.',
    answerZh: '鏄殑锛屾垜浠彁渚涘叏闈㈢殑OEM/ODM鏈嶅姟锛屽寘鎷畾鍒禠ogo鍗板埛銆佺鏈夋爣绛惧寘瑁呭拰浜у搧璁捐淇敼銆傛垜浠湁涓板瘜鐨勬湇鍔″叏鐞傿2B涔板鐨勭粡楠屻€?,
  },
  {
    question: 'What are your payment terms?',
    questionZh: '浠樻鏂瑰紡鏄粈涔堬紵',
    answer: 'For first orders, we typically require 30% deposit and 70% balance before shipment. For established partners, we offer flexible payment terms including T/T, L/C, and PayPal.',
    answerZh: '棣栧崟瀹㈡埛锛岄€氬父闇€瑕?0%瀹氶噾鍜?0%鍙戣揣鍓嶅熬娆俱€傚浜庨暱鏈熷悎浣滀紮浼达紝鎴戜滑鎻愪緵鐏垫椿鐨勪粯娆炬潯娆撅紝鍖呮嫭T/T銆丩/C鍜孭ayPal銆?,
  },
  {
    question: 'What certifications do your products have?',
    questionZh: '浣犱滑鐨勪骇鍝佹湁鍝簺璁よ瘉锛?,
    answer: 'Our products are certified with ISO9001, CE, FCC, and ROHS. Medical scales have additional FDA registration. We can provide all relevant certifications for your market requirements.',
    answerZh: '鎴戜滑鐨勪骇鍝佸凡鑾峰緱ISO9001銆丆E銆丗CC鍜孯OHS璁よ瘉銆傚尰鐤楃Г鏈夐澶栫殑FDA娉ㄥ唽銆傛垜浠彲浠ユ彁渚涙偍甯傚満瑕佹眰鐨勬墍鏈夌浉鍏宠璇併€?,
  },
  {
    question: 'What is your production lead time?',
    questionZh: '鐢熶骇浜ゆ湡鏄闀挎椂闂达紵',
    answer: 'Standard orders typically ship within 15-25 days after deposit confirmation. OEM orders may take 25-35 days depending on customization requirements. Express production is available with additional fees.',
    answerZh: '鏍囧噯璁㈠崟閫氬父鍦ㄥ畾閲戠‘璁ゅ悗15-25澶╁唴鍙戣揣銆侽EM璁㈠崟鏍规嵁瀹氬埗瑕佹眰鍙兘闇€瑕?5-35澶┿€傛垜浠彁渚涘姞鎬ョ敓浜ф湇鍔★紙闇€棰濆璐圭敤锛夈€?,
  },
];

interface DefaultFAQSchemaProps {
  locale?: string;
}

export function DefaultFAQSchema({ locale = 'en' }: DefaultFAQSchemaProps) {
  return <FAQPageSchema faqs={defaultFAQs} locale={locale} />;
}
