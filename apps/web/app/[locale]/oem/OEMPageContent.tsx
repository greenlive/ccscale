'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { MessageSquare, PenTool, Settings, Layout, CheckCircle, Truck, Package, Star } from 'lucide-react';
import { Card, CardContent } from '@cc-scale/ui';
import { Button } from '@cc-scale/ui';

const oemSteps = [
  {
    icon: MessageSquare,
    titleEn: '1. Consultation',
    titleZh: '1. 需求沟通',
    descEn: 'Discuss your requirements and specifications',
    descZh: '讨论您的需求和规格要求',
  },
  {
    icon: PenTool,
    titleEn: '2. Design',
    titleZh: '2. 设计方案',
    descEn: 'Create custom designs and prototypes',
    descZh: '创建定制设计和原型',
  },
  {
    icon: Settings,
    titleEn: '3. Sample',
    titleZh: '3. 样品制作',
    descEn: 'Produce and approve samples',
    descZh: '生产并确认样品',
  },
  {
    icon: Layout,
    titleEn: '4. Mold',
    titleZh: '4. 开模生产',
    descEn: 'Create molds for mass production',
    descZh: '创建量产模具',
  },
  {
    icon: CheckCircle,
    titleEn: '5. QC',
    titleZh: '5. 质量检验',
    descEn: 'Rigorous quality control inspection',
    descZh: '严格的质量控制检验',
  },
  {
    icon: Truck,
    titleEn: '6. Delivery',
    titleZh: '6. 物流配送',
    descEn: 'Ship to your destination',
    descZh: '配送到您指定的目的地',
  },
];

const benefits = [
  {
    icon: Package,
    titleEn: 'Custom Packaging',
    titleZh: '定制包装',
    descEn: 'Branded packaging with your logo',
    descZh: '带有您品牌标识的定制包装',
  },
  {
    icon: PenTool,
    titleEn: 'Design Flexibility',
    titleZh: '灵活设计',
    descEn: 'Modify designs to match your brand',
    descZh: '根据您的品牌修改设计',
  },
  {
    icon: Settings,
    titleEn: 'Spec Customization',
    titleZh: '规格定制',
    descEn: 'Adjust specifications to your needs',
    descZh: '根据您的需求调整规格',
  },
  {
    icon: Star,
    titleEn: 'Quality Assurance',
    titleZh: '质量保证',
    descEn: 'Same quality standards for all products',
    descZh: '所有产品遵循相同的质量标准',
  },
];

interface OEMPageContentProps {
  locale: 'en' | 'zh';
}

export function OEMPageContent({ locale }: OEMPageContentProps) {
  const t = useTranslations('nav');
  const tHome = useTranslations('home');

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('oem')}</h1>
          <p className="text-xl text-warm-silver max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Custom weighing solutions tailored to your brand and specifications'
              : '根据您的品牌和规格定制的衡器解决方案'}
          </p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">
            {locale === 'en' ? 'Why Choose Our OEM Service' : '为什么选择我们的OEM服务'}
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="text-center border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-warm-sand rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2 text-primary">
                      {locale === 'en' ? benefit.titleEn : benefit.titleZh}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {locale === 'en' ? benefit.descEn : benefit.descZh}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-warm-sand rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-4 text-primary">
            {tHome('oemProcess')}
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Our streamlined OEM process ensures a smooth journey from concept to delivery'
              : '我们简化的OEM流程确保从概念到交付的顺利过程'}
          </p>

          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-20 left-[8%] right-[8%] h-1 bg-gradient-to-r from-warm-sand via-stone-gray to-warm-sand -z-10"></div>

            {/* Animated Flow Container */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
              {oemSteps.map((step, index) => {
                const Icon = step.icon;
                const stepNumber = index + 1;

                return (
                  <div key={index} className="relative">
                    {/* Step Number Badge */}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                        index < oemSteps.length - 1
                          ? 'bg-gradient-to-br from-accent to-accent/80'
                          : 'bg-gradient-to-br from-green-500 to-green-600'
                      }`}>
                        {index < oemSteps.length - 1 ? stepNumber : '✓'}
                      </div>
                    </div>

                    <Card className="text-center border-none shadow-sm h-full relative overflow-hidden group hover:shadow-xl transition-all duration-500">
                      {/* Progress indicator */}
                      <div className="absolute top-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r from-accent to-accent/80 transition-all duration-700"></div>

                      <CardContent className="p-6 pt-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-warm-sand to-muted rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-muted group-hover:to-warm-sand transition-colors">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2 text-primary">
                          {locale === 'en' ? step.titleEn : step.titleZh}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {locale === 'en' ? step.descEn : step.descZh}
                        </p>
                      </CardContent>

                      {/* Connector Arrow (except last) */}
                      {index < oemSteps.length - 1 && (
                        <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10">
                          <div className="w-6 h-6 bg-white rounded-full shadow-md items-center justify-center flex">
                            <svg className="w-3 h-3 text-dark-surface" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>
                );
              })}
            </div>

            {/* Timeline Bottom Bar */}
            <div className="hidden lg:flex justify-between mt-8 px-[8%]">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">1-3</div>
                <div className="text-xs text-gray-500">{locale === 'en' ? 'Days' : '天'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">7-14</div>
                <div className="text-xs text-gray-500">{locale === 'en' ? 'Days' : '天'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">14-30</div>
                <div className="text-xs text-gray-500">{locale === 'en' ? 'Days' : '天'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">30-45</div>
                <div className="text-xs text-gray-500">{locale === 'en' ? 'Days' : '天'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">45-60</div>
                <div className="text-xs text-gray-500">{locale === 'en' ? 'Days' : '天'}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">60+</div>
                <div className="text-xs text-gray-500">{locale === 'en' ? 'Days' : '天'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 text-primary">
                {locale === 'en' ? 'Our Customization Capabilities' : '我们的定制能力'}
              </h2>
              <ul className="space-y-4">
                {[
                  { en: 'Logo printing and engraving', zh: 'Logo印刷和雕刻' },
                  { en: 'Custom color options', zh: '定制颜色选择' },
                  { en: 'Private labeling and packaging', zh: '自有品牌和包装' },
                  { en: 'Custom specifications and features', zh: '定制规格和功能' },
                  { en: 'Software and app customization', zh: '软件和应用定制' },
                  { en: 'Certification support (CE, FDA, etc.)', zh: '认证支持（CE、FDA等）' },
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-accent mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{locale === 'en' ? item.en : item.zh}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=600"
                  alt="OEM"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {locale === 'en' ? 'Ready to Start Your OEM Project?' : '准备好开始您的OEM项目了吗？'}
          </h2>
          <p className="text-warm-silver text-lg mb-8 max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Contact our OEM specialists today to discuss your custom requirements and get a quote.'
              : '立即联系我们的OEM专家，讨论您的定制需求并获取报价。'}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
            <Link href="/contact">
              {locale === 'en' ? 'Contact Our Team' : '联系我们的团队'}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
