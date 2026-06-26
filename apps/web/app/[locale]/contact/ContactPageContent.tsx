'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { MapPin, Mail, Phone, Clock, Globe, ArrowRight, MessageSquare } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import { Link } from '@/i18n/routing';
import { ContactForm } from '@/components/ContactForm';
import { usePageContent } from '@/lib/api/queries';

export default function ContactPageContent() {
  const tInquiry = useTranslations('inquiry');
  const locale = useLocale() as 'en' | 'zh';
  const { data: pageData } = usePageContent('contact');

  // Use database content if available, otherwise use defaults
  const contactInfo = pageData?.contentEn ? JSON.parse(pageData.contentEn) : null;

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {locale === 'en' ? (pageData?.titleEn || 'Contact Us') : (pageData?.titleZh || '鑱旂郴鎴戜滑')}
          </h1>
          <p className="text-xl text-warm-silver max-w-2xl mx-auto">
            {contactInfo?.heroSubtitle?.[locale] || (locale === 'en'
              ? 'Get in touch with us for inquiries, quotes, or technical support'
              : '涓庢垜浠仈绯讳互鑾峰彇璇㈢洏銆佹姤浠锋垨鎶€鏈敮鎸?)}
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <h2 className="text-2xl font-bold mb-8 text-primary">
                {locale === 'en' ? 'Contact Information' : '鑱旂郴淇℃伅'}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-warm-sand rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-primary mb-1">
                      {locale === 'en' ? 'Address' : '鍦板潃'}
                    </h3>
                    <p className="text-gray-600">
                      {contactInfo?.address?.[locale] || (
                        <>
                          No. 88, Industrial Park<br />
                          Yongkang, Zhejiang<br />
                          China
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-warm-sand rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-primary mb-1">
                      {locale === 'en' ? 'Email' : '閭'}
                    </h3>
                    <p className="text-gray-600">
                      {contactInfo?.email?.[locale] || (
                        <>
                          sales@zzscale.com<br />
                          support@zzscale.com
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-warm-sand rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-primary mb-1">
                      {locale === 'en' ? 'Phone' : '鐢佃瘽'}
                    </h3>
                    <p className="text-gray-600">
                      {contactInfo?.phone?.[locale] || (
                        <>
                          +86 123 4567 8900<br />
                          +86 123 4567 8901
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-warm-sand rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-primary mb-1">
                      {locale === 'en' ? 'Business Hours' : '宸ヤ綔鏃堕棿'}
                    </h3>
                    <p className="text-gray-600">
                      {contactInfo?.hours?.[locale] || (
                        <>
                          {locale === 'en' ? 'Monday - Friday' : '鍛ㄤ竴 - 鍛ㄤ簲'}<br />
                          9:00 - 18:00 (GMT+8)
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8">
                <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Globe className="h-12 w-12 mx-auto mb-2" />
                    <p>{locale === 'en' ? 'Interactive Map' : '浜や簰寮忓湴鍥?}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Inquiry CTA */}
            <div className="lg:col-span-2">
              <div className="bg-primary rounded-lg p-6 md:p-8 text-white">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold mb-2">
                      {tInquiry('title')}
                    </h2>
                    <p className="text-warm-silver">
                      {tInquiry('subtitle')}
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 rounded-lg p-6 mb-6">
                  <p className="text-sm text-muted mb-4">
                    {locale === 'en'
                      ? 'Use our Request Quote feature to select products and submit an inquiry with your requirements. Our team will respond within 24 hours.'
                      : '浣跨敤鎴戜滑鐨?Request Quote"鍔熻兘閫夋嫨浜у搧骞舵彁浜よ鐩樸€傛垜浠殑鍥㈤槦灏嗗湪24灏忔椂鍐呭洖澶嶃€?}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button asChild className="bg-accent hover:bg-accent/90">
                      <Link href="/inquiry">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        {locale === 'en' ? 'Go to Inquiry Cart' : '鍓嶅線璇环杞?}
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="border-2 border-warm-sand text-primary hover:bg-white hover:text-primary">
                      <Link href="/products">
                        {locale === 'en' ? 'Browse Products' : '娴忚浜у搧'}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-warm-silver">
                  {tInquiry('responseTime')}
                </p>
              </div>

              {/* Direct Contact Form */}
              <div className="bg-primary rounded-lg p-6 mt-6 border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-4">
                  {locale === 'en' ? 'Send a Direct Message' : '鐩存帴鍙戦€佺暀瑷€'}
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
