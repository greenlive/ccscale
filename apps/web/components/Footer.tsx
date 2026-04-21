'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, Instagram, CheckCircle, MessageCircle, ExternalLink } from 'lucide-react';
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
  icpNumber?: string;
}

interface FooterLink {
  label: string;
  labelZh: string;
  href: string;
  external?: boolean;
}

const footerLinks: FooterLink[][] = [
  [
    { label: 'Home', labelZh: '首页', href: '/' },
    { label: 'About Us', labelZh: '关于我们', href: '/about' },
    { label: 'Products', labelZh: '产品中心', href: '/products' },
  ],
  [
    { label: 'OEM/ODM', labelZh: 'OEM定制', href: '/oem' },
    { label: 'Support', labelZh: '技术支持', href: '/support' },
    { label: 'Downloads', labelZh: '下载中心', href: '/downloads' },
  ],
  [
    { label: 'Contact', labelZh: '联系我们', href: '/contact' },
    { label: 'Blog', labelZh: '博客资讯', href: '/blog' },
    { label: 'Guarantees', labelZh: '保障中心', href: '/guarantee' },
  ],
];

export default function Footer({ locale }: { locale?: string }) {
  const t = useTranslations('footer');
  const tNav = useTranslations('nav');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loadError, setLoadError] = useState(false);
  const isZh = locale === 'zh';

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

  const address = isZh ? (settings.contactAddressZh || '中国浙江省永康市工业区88号') : (settings.contactAddressEn || 'No. 88, Industrial Park, Yongkang, Zhejiang, China');

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* Multi-level Links Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand & Description */}
            <div className="col-span-1">
              <h3 className="text-2xl font-bold mb-4">CC Scale</h3>
              <p className="text-gray-400 mb-4 text-sm">
                {isZh ? '专业衡器解决方案，服务全球市场' : 'Professional weighing solutions for global markets.'}
              </p>
              {/* Social Media Icons */}
              <div className="flex flex-wrap gap-3">
                {settings.socialFacebook && (
                  <a href={settings.socialFacebook} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors" aria-label="Facebook">
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
                {settings.socialTwitter && (
                  <a href={settings.socialTwitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors" aria-label="Twitter">
                    <Twitter className="h-4 w-4" />
                  </a>
                )}
                {settings.socialLinkedIn && (
                  <a href={settings.socialLinkedIn} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors" aria-label="LinkedIn">
                    <Linkedin className="h-4 w-4" />
                  </a>
                )}
                {settings.socialYouTube && (
                  <a href={settings.socialYouTube} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors" aria-label="YouTube">
                    <Youtube className="h-4 w-4" />
                  </a>
                )}
                {settings.socialInstagram && (
                  <a href={settings.socialInstagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors" aria-label="Instagram">
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {settings.socialAlibaba && (
                  <a href={settings.socialAlibaba} target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors" aria-label="Alibaba" title="Alibaba">
                    <span className="text-xs font-bold">A</span>
                  </a>
                )}
              </div>
            </div>

            {/* Link Columns */}
            {footerLinks.map((column, colIndex) => (
              <div key={colIndex}>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider text-gray-400">
                  {colIndex === 0 ? (isZh ? '快速链接' : 'Quick Links') : ''}
                  {colIndex === 1 ? (isZh ? '产品服务' : 'Products') : ''}
                  {colIndex === 2 ? (isZh ? '更多内容' : 'More') : ''}
                </h4>
                <ul className="space-y-2">
                  {column.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors text-sm flex items-center gap-1"
                      >
                        {link.label}
                        {link.external && <ExternalLink className="h-3 w-3 opacity-50" />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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
                <li className="text-gray-400 text-sm mt-2 pt-2 border-t border-gray-800">
                  {isZh ? '工作时间' : 'Working Hours'}: {settings.contactWorkingHoursEn}
                </li>
              )}
            </ul>
          </div>

          {/* Quick Links - Duplicate for mobile */}
          <div className="lg:hidden">
            <h4 className="font-semibold mb-4">{t('quickLinks')}</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm">{tNav('home')}</Link></li>
              <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">{tNav('about')}</Link></li>
              <li><Link href="/products" className="text-gray-400 hover:text-white transition-colors text-sm">{tNav('products')}</Link></li>
              <li><Link href="/oem" className="text-gray-400 hover:text-white transition-colors text-sm">{tNav('oem')}</Link></li>
              <li><Link href="/support" className="text-gray-400 hover:text-white transition-colors text-sm">{tNav('support')}</Link></li>
              <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">{tNav('contact')}</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-2">
            <h4 className="font-semibold mb-4">{t('followUs')}</h4>
            <p className="text-gray-400 mb-4 text-sm">
              {isZh ? '订阅我们的新闻通讯，获取最新产品更新和促销信息' : 'Subscribe to our newsletter for updates on new products and promotions.'}
            </p>
            {status === 'success' ? (
              <div className="flex items-center gap-2 text-green-400 bg-green-900/30 px-4 py-3 rounded-md">
                <CheckCircle className="h-5 w-5" />
                <span className="text-sm">{isZh ? '订阅成功！' : 'Subscribed successfully!'}</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                <label htmlFor="newsletter-email" className="sr-only">Your email</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder={isZh ? '您的邮箱' : 'Your email'}
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
                  {status === 'submitting' ? '...' : (isZh ? '订阅' : 'Subscribe')}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Copyright & Legal */}
        <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} CC Scale. {isZh ? '保留所有权利。' : 'All rights reserved.'}
          </p>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 md:gap-6">
            <Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">{t('privacy')}</Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">{t('terms')}</Link>
            {settings.icpNumber ? (
              <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white text-sm transition-colors flex items-center gap-1">
                {t('icp')}: {settings.icpNumber}
              </a>
            ) : (
              <span className="text-gray-400 text-sm">{t('icp')}: 浙ICP备XXXXXXXX号</span>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
