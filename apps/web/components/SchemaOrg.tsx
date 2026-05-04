'use client';

import { useLocale } from 'next-intl';

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
}

export function OrganizationSchema({
  name = 'CC Scale',
  url = 'https://www.ccscale.com',
  logo = 'https://www.ccscale.com/logo.png',
}: OrganizationSchemaProps) {
  const locale = useLocale();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}#organization`,
    name,
    alternateName: locale === 'zh' ? '永康衡器' : undefined,
    url,
    logo,
    image: logo,
    sameAs: [
      'https://www.facebook.com/ccscale',
      'https://www.twitter.com/ccscale',
      'https://www.linkedin.com/company/ccscale',
      'https://www.youtube.com/@ccscale',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+86-123-4567-8900',
      contactType: 'customer service',
      availableLanguage: ['English', 'Chinese'],
      email: 'sales@ccscale.com',
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
      streetAddress: 'No. 88, Industrial Park',
      addressLocality: 'Yongkang',
      addressRegion: 'Zhejiang',
      postalCode: '321300',
      addressCountry: 'CN',
    },
    areaServed: ['Worldwide', 'North America', 'Europe', 'Asia'],
    makesOffer: {
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Product',
        name: locale === 'en' ? 'Custom Weighing Scales' : '定制衡器',
        description: locale === 'en'
          ? 'OEM/ODM manufacturing services for weighing scales including body scales, hanging scales, kitchen scales, and more.'
          : '提供体重秤、吊秤、厨房秤等衡器的OEM/ODM制造服务。',
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
  brand = 'CC Scale',
  category,
  mpn,
  aggregateRating,
  offers,
  additionalProperty,
}: ProductSchemaProps) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image: Array.isArray(image) ? image : [image],
    brand: {
      '@type': 'Brand',
      name: brand,
      url: 'https://www.ccscale.com',
    },
    manufacturer: {
      '@type': 'Organization',
      name: 'CC Scale',
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
  name = 'CC Scale',
  url = 'https://www.ccscale.com',
  searchUrl = 'https://www.ccscale.com/search?q={search_term_string}',
}: WebSiteSchemaProps) {
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
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: locale === 'en' ? 'About CC Scale' : '关于我们',
    description: locale === 'en'
      ? 'Learn about CC Scale, your trusted partner for professional weighing solutions with over 20 years of manufacturing experience.'
      : '了解CC Scale，您值得信赖的专业衡器解决方案合作伙伴，拥有20多年的制造经验。',
    mainEntity: {
      '@type': 'Organization',
      '@id': 'https://www.ccscale.com#organization',
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
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: locale === 'en' ? 'Contact CC Scale' : '联系我们',
    description: locale === 'en'
      ? 'Get in touch with CC Scale for inquiries about our weighing scales and OEM/ODM services.'
      : '联系CC Scale，咨询我们的衡器产品和OEM/ODM服务。',
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
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: locale === 'en' ? 'AI Summary - CC Scale' : 'AI摘要 - CC Scale',
    description: locale === 'en'
      ? 'Structured summary of CC Scale for AI assistants and large language models.'
      : '为AI助手和大语言模型提供的CC Scale结构化摘要。',
    about: {
      '@type': 'Organization',
      name: 'CC Scale',
      description: locale === 'en'
        ? 'CC Scale is a leading manufacturer of weighing scales based in Yongkang, Zhejiang, China. We specialize in body scales, hanging scales, kitchen scales, baby scales, crane scales, dial scales, and industrial weighing equipment. We offer OEM/ODM manufacturing services with MOQ flexibility, custom branding, and private labeling options.'
        : 'CC Scale是位于中国浙江永康的领先衡器制造商。我们专业生产体重秤、吊秤、厨房秤、婴儿秤、吊钩秤、度盘秤和工业称重设备。我们提供OEM/ODM制造服务，具有灵活的起订量、定制品牌和私有标签选项。',
      foundingDate: '2004',
      numberOfEmployees: {
        '@type': 'QuantitativeValue',
        value: '200',
        unitText: 'employees',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: locale === 'en' ? 'Weighing Scale Product Catalog' : '衡器产品目录',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: locale === 'en' ? 'Body Scales' : '体重秤',
              description: locale === 'en' ? 'Digital and analog body weight scales for home and professional use.' : '家用和专业用数字和模拟体重秤。',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: locale === 'en' ? 'Hanging Scales' : '吊秤',
              description: locale === 'en' ? 'Industrial hanging scales and crane scales for heavy duty weighing.' : '用于重型称重的工业吊秤和吊钩秤。',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: locale === 'en' ? 'Kitchen Scales' : '厨房秤',
              description: locale === 'en' ? 'Precision digital kitchen scales for cooking and food preparation.' : '用于烹饪和食物制备的精密数字厨房秤。',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Product',
              name: locale === 'en' ? 'Baby Scales' : '婴儿秤',
              description: locale === 'en' ? 'Accurate baby weighing scales for medical and home use.' : '用于医疗和家庭使用的精确婴儿秤。',
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
    questionZh: '你们的最小起订量是多少？',
    answer: 'Our MOQ varies by product type. Generally, MOQ ranges from 50-200 pieces per model. For OEM/ODM orders, MOQ may be higher depending on customization requirements.',
    answerZh: '我们的起订量因产品类型而异。一般每款50-200件起订。对于OEM/ODM订单，根据定制要求，起订量可能更高。',
  },
  {
    question: 'Do you offer OEM/ODM services?',
    questionZh: '你们提供OEM/ODM服务吗？',
    answer: 'Yes, we offer comprehensive OEM/ODM services including custom logo printing, private label packaging, and product design modifications. We have extensive experience serving global B2B buyers.',
    answerZh: '是的，我们提供全面的OEM/ODM服务，包括定制Logo印刷、私有标签包装和产品设计修改。我们有丰富的服务全球B2B买家的经验。',
  },
  {
    question: 'What are your payment terms?',
    questionZh: '付款方式是什么？',
    answer: 'For first orders, we typically require 30% deposit and 70% balance before shipment. For established partners, we offer flexible payment terms including T/T, L/C, and PayPal.',
    answerZh: '首单客户，通常需要30%定金和70%发货前尾款。对于长期合作伙伴，我们提供灵活的付款条款，包括T/T、L/C和PayPal。',
  },
  {
    question: 'What certifications do your products have?',
    questionZh: '你们的产品有哪些认证？',
    answer: 'Our products are certified with ISO9001, CE, FCC, and ROHS. Medical scales have additional FDA registration. We can provide all relevant certifications for your market requirements.',
    answerZh: '我们的产品已获得ISO9001、CE、FCC和ROHS认证。医疗秤有额外的FDA注册。我们可以提供您市场要求的所有相关认证。',
  },
  {
    question: 'What is your production lead time?',
    questionZh: '生产交期是多长时间？',
    answer: 'Standard orders typically ship within 15-25 days after deposit confirmation. OEM orders may take 25-35 days depending on customization requirements. Express production is available with additional fees.',
    answerZh: '标准订单通常在定金确认后15-25天内发货。OEM订单根据定制要求可能需要25-35天。我们提供加急生产服务（需额外费用）。',
  },
];

interface DefaultFAQSchemaProps {
  locale?: string;
}

export function DefaultFAQSchema({ locale = 'en' }: DefaultFAQSchemaProps) {
  return <FAQPageSchema faqs={defaultFAQs} locale={locale} />;
}
