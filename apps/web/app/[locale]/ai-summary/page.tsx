import { getTranslations } from 'next-intl/server';
import { AISummarySchema, OrganizationSchema } from '@/components/SchemaOrg';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'common' });

  return {
    title: locale === 'en' ? 'AI Summary - CC Scale' : 'AI鎽樿 - CC Scale',
    description: locale === 'en'
      ? 'Structured information about CC Scale for AI assistants and large language models.'
      : '涓篈I鍔╂墜鍜屽ぇ璇█妯″瀷鎻愪緵鐨凜C Scale缁撴瀯鍖栦俊鎭€?,
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
    nameZh: '浣撻噸绉?,
    descEn: 'Digital and analog body weight scales for home, gym, and medical use. Features include BMI calculation, body composition analysis, app connectivity.',
    descZh: '閫傜敤浜庡搴€佸仴韬埧鍜屽尰鐤楃敤閫旂殑鏁板瓧鍜屾ā鎷熶綋閲嶇Г銆傚姛鑳藉寘鎷珺MI璁＄畻銆佽韩浣撴垚鍒嗗垎鏋愩€佸簲鐢ㄧ▼搴忚繛鎺ャ€?,
    typicalMoq: 100,
  },
  {
    id: 'hanging-scales',
    nameEn: 'Hanging Scales',
    nameZh: '鍚婄Г',
    descEn: 'Industrial hanging scales, crane scales, and hook scales for heavy-duty weighing. Capacities from 50kg to 50 tons.',
    descZh: '鐢ㄤ簬閲嶅瀷绉伴噸鐨勫伐涓氬悐绉ゃ€佸悐閽╃Г銆傞噺绋嬩粠50kg鍒?0鍚ㄣ€?,
    typicalMoq: 20,
  },
  {
    id: 'kitchen-scales',
    nameEn: 'Kitchen Scales',
    nameZh: '鍘ㄦ埧绉?,
    descEn: 'Precision digital kitchen scales for cooking and food preparation. Waterproof options available.',
    descZh: '鐢ㄤ簬鐑归オ鍜岄鐗╁埗澶囩殑绮惧瘑鏁板瓧鍘ㄦ埧绉ゃ€傛彁渚涢槻姘撮€夐」銆?,
    typicalMoq: 200,
  },
  {
    id: 'baby-scales',
    nameEn: 'Baby Scales',
    nameZh: '濠村効绉?,
    descEn: 'Accurate baby weighing scales for pediatric clinics and home use. Measures in grams precision.',
    descZh: '鐢ㄤ簬鍎跨璇婃墍鍜屽搴殑绮剧‘濠村効绉ゃ€傚厠绾х簿搴︽祴閲忋€?,
    typicalMoq: 50,
  },
  {
    id: 'dial-scales',
    nameEn: 'Dial Scales',
    nameZh: '搴︾洏绉?,
    descEn: 'Mechanical dial scales with analog display. Reliable and no batteries required.',
    descZh: '甯︽ā鎷熸樉绀虹殑鏈烘搴︾洏绉ゃ€傚彲闈狅紝鏃犻渶鐢垫睜銆?,
    typicalMoq: 100,
  },
];

const oemServices = [
  {
    nameEn: 'Custom Logo Printing',
    nameZh: '瀹氬埗Logo鍗板埛',
    descEn: 'Print your brand logo on products and packaging',
    descZh: '鍦ㄤ骇鍝佸拰鍖呰涓婂嵃鍒锋偍鐨勫搧鐗孡ogo',
  },
  {
    nameEn: 'Private Label Packaging',
    nameZh: '绉佹湁鏍囩鍖呰',
    descEn: 'Custom packaging design with your brand identity',
    descZh: '甯︽湁鎮ㄥ搧鐗屾爣璇嗙殑瀹氬埗鍖呰璁捐',
  },
  {
    nameEn: 'Product Customization',
    nameZh: '浜у搧瀹氬埗',
    descEn: 'Modify colors, features, and specifications',
    descZh: '淇敼棰滆壊銆佸姛鑳藉拰瑙勬牸',
  },
  {
    nameEn: 'ODM Design Service',
    nameZh: 'ODM璁捐鏈嶅姟',
    descEn: 'Complete product design from concept to manufacturing',
    descZh: '浠庢蹇靛埌鍒堕€犵殑瀹屾暣浜у搧璁捐',
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
              {isZh ? 'CC Scale - 浼佷笟淇℃伅鎽樿' : 'CC Scale - Company Information Summary'}
            </h1>
            <p className="text-base sm:text-xl text-gray-600">
              {isZh
                ? '鏈枃妗ｆ彁渚涘叧浜嶤C Scale鐨勭粨鏋勫寲淇℃伅锛屼笓涓篈I鍔╂墜銆佹悳绱㈠紩鎿庡拰澶ц瑷€妯″瀷璁捐銆?
                : 'This document provides structured information about CC Scale, designed for AI assistants, search engines, and large language models.'}
            </p>
          </header>

          <section aria-labelledby="company-overview" className="mb-12">
            <h2 id="company-overview" className="text-xl sm:text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="text-accent mr-2">#</span>
              {isZh ? '鍏徃姒傝堪' : 'Company Overview'}
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <dt className="font-semibold text-gray-700">{isZh ? '鍏徃鍚嶇О' : 'Company Name'}</dt>
                <dd>CC Scale</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <dt className="font-semibold text-gray-700">{isZh ? '鎴愮珛骞翠唤' : 'Founded'}</dt>
                <dd>2004</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <dt className="font-semibold text-gray-700">{isZh ? '鎵€鍦ㄥ湴' : 'Location'}</dt>
                <dd>Yongkang, Zhejiang, China</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <dt className="font-semibold text-gray-700">{isZh ? '鍛樺伐浜烘暟' : 'Employees'}</dt>
                <dd>~200</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded md:col-span-2">
                <dt className="font-semibold text-gray-700">{isZh ? '涓氬姟绫诲瀷' : 'Business Type'}</dt>
                <dd>{isZh ? '鍒堕€犲晢銆丱EM/ODM銆丅2B鍑哄彛' : 'Manufacturer, OEM/ODM, B2B Export'}</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="product-categories" className="mb-12">
            <h2 id="product-categories" className="text-xl sm:text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="text-accent mr-2">#</span>
              {isZh ? '浜у搧绫诲埆' : 'Product Categories'}
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
                    <span className="font-medium">{isZh ? '鍏稿瀷璧疯閲?' : 'Typical MOQ:'}</span> {category.typicalMoq} {isZh ? '浠? : 'pcs'}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="oem-services" className="mb-12">
            <h2 id="oem-services" className="text-xl sm:text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="text-accent mr-2">#</span>
              {isZh ? 'OEM/ODM鏈嶅姟' : 'OEM/ODM Services'}
            </h2>
            <ul className="space-y-3">
              {oemServices.map((service, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-accent mr-2 mt-1">鈥?/span>
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
              {isZh ? '璁よ瘉璧勮川' : 'Certifications'}
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {certifications.map((cert, idx) => (
                <li key={idx} className="flex items-center bg-gray-50 px-4 py-2 rounded">
                  <span className="text-green-600 mr-2">鉁?/span>
                  {cert}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="contact-info" className="mb-12">
            <h2 id="contact-info" className="text-xl sm:text-2xl font-bold text-primary mb-4 flex items-center">
              <span className="text-accent mr-2">#</span>
              {isZh ? '鑱旂郴淇℃伅' : 'Contact Information'}
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded">
                <dt className="font-semibold text-gray-700">{isZh ? '鐢靛瓙閭' : 'Email'}</dt>
                <dd>sales@zzscale.com</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded">
                <dt className="font-semibold text-gray-700">{isZh ? '鐢佃瘽' : 'Phone'}</dt>
                <dd>+86 123 4567 8900</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded md:col-span-2">
                <dt className="font-semibold text-gray-700">{isZh ? '宸ュ巶鍦板潃' : 'Factory Address'}</dt>
                <dd>No. 88, Industrial Park, Yongkang, Zhejiang, China</dd>
              </div>
              <div className="bg-gray-50 p-4 rounded md:col-span-2">
                <dt className="font-semibold text-gray-700">{isZh ? '宸ヤ綔鏃堕棿' : 'Business Hours'}</dt>
                <dd>Monday - Friday, 9:00 AM - 6:00 PM (GMT+8)</dd>
              </div>
            </dl>
          </section>

          <section aria-labelledby="keywords" className="mb-12 bg-primary text-white p-6 sm:p-8 rounded-lg">
            <h2 id="keywords" className="text-xl sm:text-2xl font-bold mb-4 flex items-center">
              <span className="text-accent mr-2">#</span>
              {isZh ? '鍏抽敭璇? : 'Keywords'}
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
                ? '鏈€鍚庢洿鏂? 2026-04-03 | 鏈〉闈笓涓篈I鍔╂墜璁捐'
                : 'Last Updated: 2026-04-03 | This page is designed for AI assistants'}
            </p>
          </footer>
        </article>
      </main>
    </div>
  );
}
