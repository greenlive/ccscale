import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { Factory, Award, Users, Globe, TrendingUp, Clock, Play } from 'lucide-react';
import { Card, CardContent } from '@cc-scale/ui';
import { AboutPageSchema, BreadcrumbSchema } from '@/components/SchemaOrg';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Props) {
  const t = await getTranslations({ locale, namespace: 'nav' });

  const title = locale === 'en'
    ? 'About Us - CC Scale | Professional Weighing Solutions'
    : '关于我们 - CC Scale | 专业衡器解决方案';

  const description = locale === 'en'
    ? 'Learn about CC Scale, your trusted partner for professional weighing solutions with over 20 years of manufacturing experience.'
    : '了解CC Scale，您值得信赖的专业衡器解决方案合作伙伴，拥有20多年的制造经验。';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'profile',
    },
  };
}

const milestones = [
  { year: '2004', titleEn: 'Founded', titleZh: '公司成立', descEn: 'Started with a small workshop', descZh: '从一个小车间起步' },
  { year: '2010', titleEn: 'ISO Certification', titleZh: 'ISO认证', descEn: 'Achieved ISO 9001 quality certification', descZh: '获得ISO 9001质量认证' },
  { year: '2015', titleEn: 'Global Expansion', titleZh: '全球拓展', descEn: 'Exported to 50+ countries', descZh: '出口到50多个国家' },
  { year: '2020', titleEn: 'Smart Factory', titleZh: '智能工厂', descEn: 'Automated production lines', descZh: '自动化生产线' },
];

const stats = [
  { number: '20+', labelEn: 'Years Experience', labelZh: '年经验' },
  { number: '100+', labelEn: 'Countries', labelZh: '个国家' },
  { number: '500K+', labelEn: 'Units/Year', labelZh: '年产量' },
  { number: '50+', labelEn: 'R&D Team', labelZh: '研发团队' },
];

function AboutPageContent({ locale }: { locale: 'en' | 'zh' }) {
  const t = useTranslations('nav');

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('about')}</h1>
          <p className="text-xl text-warm-silver max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Two decades of excellence in weighing solutions'
              : '二十年衡器解决方案的卓越经验'}
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-accent">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-accent-foreground/90">
                  {locale === 'en' ? stat.labelEn : stat.labelZh}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">
                {locale === 'en' ? 'Our Story' : '我们的故事'}
              </h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                {locale === 'en'
                  ? 'Founded in 2004, CC Scale has grown from a small workshop to a leading manufacturer of professional weighing equipment. Our commitment to quality and innovation has made us a trusted partner for businesses worldwide.'
                  : 'CC Scale成立于2004年，从一个小车间发展成为专业衡器设备的领先制造商。我们对质量和创新的承诺使我们成为全球企业值得信赖的合作伙伴。'}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {locale === 'en'
                  ? 'With state-of-the-art production facilities and a dedicated R&D team, we continue to push the boundaries of weighing technology, delivering precise, reliable, and innovative solutions to our customers.'
                  : '凭借先进的生产设施和专业的研发团队，我们不断突破衡器技术的边界，为客户提供精确、可靠和创新的解决方案。'}
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600"
                  alt="Factory"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Factory Video */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {locale === 'en' ? 'Take a Tour of Our Factory' : '参观我们的工厂'}
            </h2>
            <p className="text-warm-silver text-lg max-w-2xl mx-auto">
              {locale === 'en'
                ? 'See our state-of-the-art production facilities and quality control processes in action.'
                : '观看我们先进的生产设施和质量控制流程。'}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden group cursor-pointer">
              {/* Video Placeholder / Thumbnail */}
              <div className="absolute inset-0">
                <img
                  src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200"
                  alt={locale === 'en' ? 'CC Scale Factory Tour' : 'CC Scale 工厂参观'}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                />
              </div>

              {/* Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="h-8 w-8 text-white ml-1" />
                </div>
              </div>

              {/* Video Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-xl font-semibold text-white">
                  {locale === 'en' ? 'CC Scale Factory Tour' : 'CC Scale 工厂参观'}
                </h3>
                <p className="text-gray-300 text-sm">
                  {locale === 'en' ? '4:30 min' : '4分30秒'}
                </p>
              </div>
            </div>

            {/* Additional Video Thumbnails */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-accent transition-all">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400"
                  alt={locale === 'en' ? 'Production Line' : '生产线'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-accent transition-all">
                <img
                  src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400"
                  alt={locale === 'en' ? 'Quality Control' : '质量控制'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-accent transition-all">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
                  alt={locale === 'en' ? 'R&D Lab' : '研发实验室'}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-accent transition-all">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400"
                  alt={locale === 'en' ? 'Packaging & Shipping' : '包装与运输'}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-20 bg-warm-sand">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-primary">
            {locale === 'en' ? 'Our Journey' : '我们的历程'}
          </h2>
          <div className="relative">
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -translate-x-1/2"></div>
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex flex-col md:flex-row items-center ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="md:w-1/2 md:pr-12 pl-0 w-full">
                    <div className="relative flex items-start gap-4 md:block">
                      {/* Mobile timeline dot */}
                      <div className="md:hidden flex-shrink-0 w-10 h-10 bg-accent rounded-full items-center justify-center text-white font-bold z-10 flex">
                        {milestone.year.slice(-2)}
                      </div>
                      <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm border border-gray-100 flex-1">
                        <span className="text-accent font-bold text-lg">{milestone.year}</span>
                        <h3 className="text-lg md:text-xl font-semibold mt-2 text-primary">
                          {locale === 'en' ? milestone.titleEn : milestone.titleZh}
                        </h3>
                        <p className="text-gray-600 mt-2 text-sm md:text-base">
                          {locale === 'en' ? milestone.descEn : milestone.descZh}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:flex w-12 h-12 bg-accent rounded-full items-center justify-center text-white font-bold z-10 my-4 md:my-0">
                    {milestone.year.slice(-2)}
                  </div>
                  <div className="md:w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            {locale === 'en' ? 'Our Values' : '我们的价值观'}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-warm-sand rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">
                  {locale === 'en' ? 'Quality First' : '质量第一'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'en'
                    ? 'Every product undergoes rigorous testing to ensure precision and reliability.'
                    : '每一件产品都经过严格测试，确保精确和可靠。'}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-warm-sand rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">
                  {locale === 'en' ? 'Customer Focus' : '客户至上'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'en'
                    ? 'We listen to our customers and adapt our solutions to their needs.'
                    : '我们倾听客户意见，根据他们的需求调整我们的解决方案。'}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-warm-sand rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-primary">
                  {locale === 'en' ? 'Continuous Innovation' : '持续创新'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'en'
                    ? 'We invest in R&D to bring the latest weighing technology to market.'
                    : '我们投资研发，将最新的衡器技术推向市场。'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function AboutPage({ params: { locale } }: Props) {
  const baseUrl = 'https://www.ccscale.com';
  const breadcrumbItems = [
    { name: locale === 'en' ? 'Home' : '首页', url: `${baseUrl}/${locale}` },
    { name: locale === 'en' ? 'About Us' : '公司简介', url: `${baseUrl}/${locale}/about` },
  ];

  return (
    <>
      <AboutPageSchema locale={locale} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <AboutPageContent locale={locale as 'en' | 'zh'} />
    </>
  );
}
