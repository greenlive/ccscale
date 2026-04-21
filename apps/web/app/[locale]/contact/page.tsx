import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { MapPin, Mail, Phone, Clock, Globe, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import { ContactPageSchema, BreadcrumbSchema, DefaultFAQSchema } from '@/components/SchemaOrg';
import { Link } from '@/i18n/routing';
import { ContactForm } from '@/components/ContactForm';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Props) {
  const t = await getTranslations({ locale, namespace: 'nav' });

  const title = locale === 'en'
    ? 'Contact Us - CC Scale | Get a Quote for Weighing Scales'
    : '联系我们 - CC Scale | 获取衡器报价';

  const description = locale === 'en'
    ? 'Contact CC Scale for inquiries about our weighing scales, OEM services, and custom solutions. Get a free quote today.'
    : '联系CC Scale，咨询我们的衡器产品、OEM服务和定制解决方案。立即获取免费报价。';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

function ContactPageContent() {
  const t = useTranslations('nav');
  const tInquiry = useTranslations('inquiry');
  const locale = useLocale() as 'en' | 'zh';

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0A1628] to-[#1e3a5f] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('contact')}</h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Get in touch with us for inquiries, quotes, or technical support'
              : '与我们联系以获取询盘、报价或技术支持'}
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-8 text-[#0A1628]">
                {locale === 'en' ? 'Contact Information' : '联系信息'}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-[#0A1628]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-[#0A1628] mb-1">
                      {locale === 'en' ? 'Address' : '地址'}
                    </h3>
                    <p className="text-gray-600">
                      No. 88, Industrial Park<br />
                      Yongkang, Zhejiang<br />
                      China
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-[#0A1628]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-[#0A1628] mb-1">
                      {locale === 'en' ? 'Email' : '邮箱'}
                    </h3>
                    <p className="text-gray-600">
                      sales@ccscale.com<br />
                      support@ccscale.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-[#0A1628]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-[#0A1628] mb-1">
                      {locale === 'en' ? 'Phone' : '电话'}
                    </h3>
                    <p className="text-gray-600">
                      +86 123 4567 8900<br />
                      +86 123 4567 8901
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-[#0A1628]" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-[#0A1628] mb-1">
                      {locale === 'en' ? 'Business Hours' : '工作时间'}
                    </h3>
                    <p className="text-gray-600">
                      {locale === 'en' ? 'Monday - Friday' : '周一 - 周五'}<br />
                      9:00 - 18:00 (GMT+8)
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Globe className="h-12 w-12 mx-auto mb-2" />
                    <p>{locale === 'en' ? 'Interactive Map' : '交互式地图'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry CTA */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-[#0A1628] to-[#1e3a5f] rounded-lg p-6 md:p-8 text-white">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {tInquiry('title')}
                    </h2>
                    <p className="text-blue-200">
                      {tInquiry('subtitle')}
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-6 mb-6">
                  <p className="text-sm text-blue-100 mb-4">
                    {locale === 'en'
                      ? 'Use our Request Quote feature to select products and submit an inquiry with your requirements. Our team will respond within 24 hours.'
                      : '使用我们的"Request Quote"功能选择产品并提交询盘。我们的团队将在24小时内回复。'}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="bg-accent hover:bg-accent/90">
                      <Link href="/inquiry">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {locale === 'en' ? 'Go to Inquiry Cart' : '前往询价车'}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-2 border-blue-200 text-[#0A1628] hover:bg-white hover:text-[#0A1628]">
                      <Link href="/products">
                        {locale === 'en' ? 'Browse Products' : '浏览产品'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-blue-200">
                  {tInquiry('responseTime')}
                </p>
              </div>

              {/* Direct Contact Form */}
              <div className="bg-gradient-to-br from-[#0A1628] to-[#1e3a5f] rounded-lg p-6 mt-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {locale === 'en' ? 'Send a Direct Message' : '直接发送留言'}
                </h3>
                <ContactForm locale={locale} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage({ params: { locale } }: Props) {
  const baseUrl = 'https://www.ccscale.com';
  const breadcrumbItems = [
    { name: locale === 'en' ? 'Home' : '首页', url: `${baseUrl}/${locale}` },
    { name: locale === 'en' ? 'Contact' : '联系我们', url: `${baseUrl}/${locale}/contact` },
  ];

  return (
    <>
      <ContactPageSchema locale={locale} />
      <DefaultFAQSchema locale={locale} />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ContactPageContent />
    </>
  );
}
