import { getTranslations } from 'next-intl/server';
import { AISummarySchema, OrganizationSchema } from '@/components/SchemaOrg';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: locale === 'en' ? 'AI Summary - CC Scale' : 'AI摘要 - CC Scale',
    description: locale === 'en'
      ? 'Structured information about CC Scale for AI assistants and large language models.'
      : '为AI助手和大语言模型提供的CC Scale结构化信息。',
    robots: {
      index: true,
      follow: false,
    },
  };
}

const productCategories = [
  {
    id: 'body-scales',
    nameEn: 'Body Scales',
    nameZh: '体重秤',
    descEn: 'Digital and analog body weight scales for home, gym, and medical use. Features include BMI calculation, body composition analysis, app connectivity.',
    descZh: '适用于家庭、健身房和医疗用途的数字和模拟体重秤。功能包括BMI计算、身体成分分析、应用程序连接。',
    typicalMoq: 100,
  },
  {
    id: 'hanging-scales',
    nameEn: 'Hanging Scales',
    nameZh: '吊秤',
    descEn: 'Industrial hanging scales, crane scales, and hook scales for heavy-duty weighing. Capacities from 50kg to 50 tons.',
    descZh: '用于重型称重的工业吊秤、吊钩秤。量程从50kg到50吨。',
    typicalMoq: 20,
  },
  {
    id: 'kitchen-scales',
    nameEn: 'Kitchen Scales',
    nameZh: '厨房秤',
    descEn: 'Precision digital kitchen scales for cooking and food preparation. Waterproof options available.',
    descZh: '用于烹饪和食物制备的精密数字厨房秤。提供防水选项。',
    typicalMoq: 200,
  },
  {
    id: 'baby-scales',
    nameEn: 'Baby Scales',
    nameZh: '婴儿秤',
    descEn: 'Accurate baby weighing scales for pediatric clinics and home use. Measures in grams precision.',
    descZh: '用于儿科诊所和家庭的精确婴儿秤。克级精度测量。',
    typicalMoq: 50,
  },
  {
    id: 'dial-scales',
    nameEn: 'Dial Scales',
    nameZh: '度盘秤',
    descEn: 'Mechanical dial scales with analog display. Reliable and no batteries required.',
    descZh: '带模拟显示的机械度盘秤。可靠，无需电池。',
    typicalMoq: 100,
  },
];

const oemServices = [
  {
    nameEn: 'Custom Logo Printing',
    nameZh: '定制Logo印刷',
    descEn: 'Print your brand logo on products and packaging',
    descZh: '在产品和包装上印刷您的品牌Logo',
  },
  {
    nameEn: 'Private Label Packaging',
    nameZh: '私有标签包装',
    descEn: 'Custom packaging design with your brand identity',
    descZh: '带有您品牌标识的定制包装设计',
  },
  {
    nameEn: 'Product Customization',
    nameZh: '产品定制',
    descEn: 'Modify colors, features, and specifications',
    descZh: '修改颜色、功能和规格',
  },
  {
    nameEn: 'ODM Design Service',
    nameZh: 'ODM设计服务',
    descEn: 'Complete product design from concept to manufacturing',
    descZh: '从概念到制造的完整产品设计',
  },
];

const certifications = [
  'ISO 9001:2015',
  'CE Certification',
  'FCC Certification',
  'ROHS Compliance',
  'FDA Registration (for medical scales)',
];

export default async function AISummaryPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const isZh = locale === 'zh';

  return (
    <div>
      <AISummarySchema locale={locale} />
      <OrganizationSchema />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-lg max-w-none">
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              {isZh ? 'CC Scale - 企业信息摘要' : 'CC Scale - Company Information Summary'}
            </h1>
            <p className="text-base sm:text-xl text-gray-600">
              {isZh
                ? '本文档提供关于CC Scale的结构化信息，专为AI助手、搜索引擎和大语言模型设计。'
                : 'This document provides structured information about CC Scale, designed for AI assistants, search engines, and large language models.'}
            </p>
          </header>

          <section aria-labelledby="company-overview" className="mb-12">
            <h2 id="company-overview" className="text-xl sm:text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="text-accent mr-2">#</span>
              {isZh ? '公司概述' : 'Company Overview'}
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <dt className="font-semibold text-gray-700">{isZh ? '公司名称' : 'Company Name'}</dt>
                <dd>CC Scale</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <dt className="font-semibold text-gray-700">{isZh ? '成立年份' : 'Founded'}</dt>
                <dd>2004</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <dt className="font-semibold text-gray-700">{isZh ? '所在地' : 'Location'}</dt>
                <dd>Yongkang, Zhejiang, China</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <dt className="font-semibold text-gray-700">{isZh ? '员工人数' : 'Employees'}</dt>
                <dd>~200</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded md:col-span-2">
                <dt className="font-semibold text-gray-700">{isZh ? '业务类型' : 'Business Type'}</dt>
                <dd>{isZh ? '制造商、OEM/ODM、B2B出口' : 'Manufacturer, OEM/ODM, B2B Export'}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="product-categories" className="mb-12">
            <h2 id="product-categories" className="text-xl sm:text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="text-accent mr-2">#</span>
              {isZh ? '产品类别' : 'Product Categories'}
            </h2>
            <div className="space-y-6">
              {productCategories.map((category) => (
                <article key={category.id} className="border-l-4 border-accent pl-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-primary">
                    {isZh ? category.nameZh : category.nameEn}
                  </h3>
                  <p className="text-gray-600 mt-2">
                    {isZh ? category.descZh : category.descEn}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    <span className="font-medium">{isZh ? '典型起订量:' : 'Typical MOQ:'}</span> {category.typicalMoq} {isZh ? '件' : 'pcs'}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="oem-services" className="mb-12">
            <h2 id="oem-services" className="text-xl sm:text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="text-accent mr-2">#</span>
              {isZh ? 'OEM/ODM服务' : 'OEM/ODM Services'}
            </h2>
            <ul className="space-y-3">
              {oemServices.map((service, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-accent mr-2 mt-1">•</span>
                  <div>
                    <h4 className="font-semibold">{isZh ? service.nameZh : service.nameEn}</h4>
                    <p className="text-gray-600 text-sm">{isZh ? service.descZh : service.descEn}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="certifications" className="mb-12">
            <h2 id="certifications" className="text-xl sm:text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="text-accent mr-2">#</span>
              {isZh ? '认证资质' : 'Certifications'}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {certifications.map((cert, idx) => (
                <li key={idx} className="flex items-center bg-gray-50 px-4 py-2 rounded">
                  <span className="text-green-600 mr-2">✓</span>
                  {cert}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="contact-info" className="mb-12">
            <h2 id="contact-info" className="text-xl sm:text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="text-accent mr-2">#</span>
              {isZh ? '联系信息' : 'Contact Information'}
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <dt className="font-semibold text-gray-700">{isZh ? '电子邮箱' : 'Email'}</dt>
                <dd>sales@ccscale.com</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <dt className="font-semibold text-gray-700">{isZh ? '电话' : 'Phone'}</dt>
                <dd>+86 123 4567 8900</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded md:col-span-2">
                <dt className="font-semibold text-gray-700">{isZh ? '工厂地址' : 'Factory Address'}</dt>
                <dd>No. 88, Industrial Park, Yongkang, Zhejiang, China</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded md:col-span-2">
                <dt className="font-semibold text-gray-700">{isZh ? '工作时间' : 'Business Hours'}</dt>
                <dd>Monday - Friday, 9:00 AM - 6:00 PM (GMT+8)</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="keywords" className="mb-12 bg-primary text-white p-6 sm:p-8 rounded-lg">
            <h2 id="keywords" className="text-xl sm:text-2xl font-bold mb-4 flex items-center">
              <span className="text-accent mr-2">#</span>
              {isZh ? '关键词' : 'Keywords'}
            </h2>
            <div className="flex flex-wrap gap-2">
              {[
                'weighing scale',
                'weight scale',
                'body scale',
                'bathroom scale',
                'hanging scale',
                'crane scale',
                'hook scale',
                'kitchen scale',
                'food scale',
                'baby scale',
                'infant scale',
                'dial scale',
                'mechanical scale',
                'digital scale',
                'electronic scale',
                'industrial scale',
                'OEM scale',
                'ODM scale',
                'private label',
                'custom scale',
                'scale manufacturer',
                'scale factory',
                'China scale',
                'Yongkang scale',
                'B2B scale',
                'wholesale scale',
                'export scale',
              ].map((kw, idx) => (
                <span key={idx} className="bg-white/10 px-3 py-1 rounded-full text-sm">
                  {kw}
                </span>
              ))}
            </div>
          </section>

          <footer className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              {isZh
                ? '最后更新: 2026-04-03 | 本页面专为AI助手设计'
                : 'Last Updated: 2026-04-03 | This page is designed for AI assistants'}
            </p>
          </footer>
        </article>
      </main>
    </div>
  );
}
