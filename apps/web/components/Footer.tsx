'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, Instagram, CheckCircle, MessageCircle } from 'lucide-react';
import { getApiUrl } from '@/lib/config/api';

interface SiteSettings {
  contactEmail?: string;
  contactPhone?: string;
  contactWhatsApp?: string;
  contactAddressEn?: string;
  contactAddressZh?: string;
  contactWorkingHoursEn?: string;
  socialFacebook?: string;
  socialLinkedIn?: string;
  socialYouTube?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  socialAlibaba?: string;
}

export default function Footer({ locale }: { locale?: string }) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoadError(false);
      const response = await fetch(getApiUrl('site-settings'));
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        setLoadError(true);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setLoadError(true);
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('submitting');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    }, 1000);
  };

  const address = locale === 'zh' ? (settings.contactAddressZh || '中国浙江省永康市工业区88号') : (settings.contactAddressEn || 'No. 88, Industrial Park, Yongkang, Zhejiang, China');

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">CC Scale</h3>
            <p className="text-gray-400 mb-4">
              {locale === 'zh' ? '专业衡器解决方案，服务全球市场' : 'Professional weighing solutions for global markets.'}
            </p>
            <div className="flex space-x-4">
              {settings.socialFacebook && (
                <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings.socialTwitter && (
                <a href={settings.socialTwitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {settings.socialLinkedIn && (
                <a href={settings.socialLinkedIn} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              )}
              {settings.socialYouTube && (
                <a href={settings.socialYouTube} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a>
              )}
              {settings.socialInstagram && (
                <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings.socialAlibaba && (
                <a href={settings.socialAlibaba} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Alibaba" title="Alibaba">
                  <span className="text-xs font-bold">A</span>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors">{tNav('home')}</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">{tNav('about')}</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors">{tNav('products')}</Link></li>
              <li><Link href="/blog" className="text-gray-400 hover:text-white transition-colors">{tNav('blog')}</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors">{tNav('support')}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">{tNav('contact')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">{t('contactInfo')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-gray-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-gray-400 text-sm">{address}</span>
              </li>
              {settings.contactEmail && (
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" aria-hidden="true" />
                  <a href={`mailto:${settings.contactEmail}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {settings.contactEmail}
                  </a>
                </li>
              )}
              {settings.contactPhone && (
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-3 text-gray-400 flex-shrink-0" aria-hidden="true" />
                  <a href={`tel:${settings.contactPhone}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {settings.contactPhone}
                  </a>
                </li>
              )}
              {settings.contactWhatsApp && (
                <li className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-3 text-green-400 flex-shrink-0" aria-hidden="true" />
                  <a href={`https://wa.me/${settings.contactWhatsApp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors text-sm">
                    WhatsApp
                  </a>
                </li>
              )}
              {settings.contactWorkingHoursEn && (
                <li className="text-gray-400 text-sm mt-2 pt-2 border-t border-gray-700">
                  {locale === 'zh' ? '工作时间' : 'Working Hours'}: {settings.contactWorkingHoursEn}
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">{t('followUs')}</h4>
            <p className="text-gray-400 mb-4 text-sm">
              {locale === 'zh' ? '订阅我们的新闻通讯，获取最新产品更新和促销信息' : 'Subscribe to our newsletter for updates on new products and promotions.'}
            </p>
            {status === 'success' ? (
              <div className="flex items-center gap-2 text-green-400 bg-green-900/30 px-4 py-3 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">{locale === 'zh' ? '订阅成功！' : 'Subscribed successfully!'}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <label htmlFor="newsletter-email" className="sr-only">Your email</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder={locale === 'zh' ? '您的邮箱' : 'Your email'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="px-3 py-3 bg-gray-800 border border-gray-700 rounded-md sm:rounded-r-none flex-1 text-sm focus:outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="bg-accent px-4 py-3 rounded-md sm:rounded-l-none text-sm font-medium hover:bg-accent/90 transition-colors whitespace-nowrap disabled:opacity-50"
                >
                  {status === 'submitting' ? '...' : (locale === 'zh' ? '订阅' : 'Subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            {t('copyright')}
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{t('privacy')}</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{t('terms')}</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">{t('icp')}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
