'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Button, cn } from '@cc-scale/ui';
import { InquiryCartButton } from '@/components/inquiry/InquiryCartButton';
import { InquiryCartDrawer } from '@/components/inquiry/InquiryCartDrawer';
import { ThemeToggle } from '@/components/ThemeToggle';
import { getApiUrl } from '@/lib/config/api';

const navLinks = [
  { href: '/', key: 'home' },
  { href: '/about', key: 'about' },
  { href: '/products', key: 'products' },
  { href: '/guarantee', key: 'guarantee' },
  { href: '/oem', key: 'oem' },
  { href: '/support', key: 'support' },
  { href: '/blog', key: 'blog' },
  { href: '/contact', key: 'contact' },
];

export default function Header({ locale }: { locale: string }) {
  const t = useTranslations('nav');
  const tA11y = useTranslations('a11y');
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [brandName, setBrandName] = useState('CC Scale');

  // Handle scroll effect — throttled with rAF to avoid scroll jank
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch site settings for dynamic brand name
  useEffect(() => {
    const fetchBrandName = async () => {
      try {
        const res = await fetch(getApiUrl('site-settings/companyNameEn'));
        if (res.ok) {
          const data = await res.json();
          if (data.value) setBrandName(data.value);
        }
      } catch {}
    };
    fetchBrandName();
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-white shadow-md border-b border-gray-200'
          : 'bg-white/85 backdrop-blur-md border-b border-border/80'
      )}
    >
      <div className="container mx-auto px-4 max-w-[1400px]">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">{brandName}</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-x-5 xl:gap-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === link.href ? 'text-primary' : 'text-gray-600'
                )}
              >
                {t(link.key)}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-primary"
                aria-label={tA11y('switchLanguage')}
                aria-expanded={langMenuOpen}
                aria-haspopup="true"
              >
                <Globe className="h-4 w-4" />
                <span>{locale === 'en' ? 'EN' : '中文'}</span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg py-1">
                  <Link
                    href={pathname}
                    locale="en"
                    onClick={() => setLangMenuOpen(false)}
                    className={cn(
                      'block px-4 py-2 text-sm',
                      locale === 'en' ? 'bg-gray-100 text-primary' : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {tA11y('englishOption')}
                  </Link>
                  <Link
                    href={pathname}
                    locale="zh"
                    onClick={() => setLangMenuOpen(false)}
                    className={cn(
                      'block px-4 py-2 text-sm',
                      locale === 'zh' ? 'bg-gray-100 text-primary' : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    {tA11y('chineseOption')}
                  </Link>
                </div>
              )}
            </div>

            <InquiryCartButton onClick={() => setCartOpen(true)} />

            <ThemeToggle />

            <Button asChild variant="accent">
              <Link href="/contact">{t('contact')}</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-1 md:hidden">
            <InquiryCartButton className="h-10 w-10 p-0" onClick={() => setCartOpen(true)} />
            <ThemeToggle />
            <button
              type="button"
              className="text-gray-600 dark:text-gray-200 p-2 -mr-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? tA11y('closeMenu') : tA11y('openMenu')}
            >
              {menuOpen ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div id="mobile-nav" className="lg:hidden bg-white/95 backdrop-blur-md border-t border-gray-200 max-h-[min(70vh,calc(100dvh-4rem))] overflow-y-auto">
          <div className="container mx-auto px-4 py-4 space-y-1 max-w-[1400px]">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={cn(
                  'block py-3 px-2 rounded-lg text-base font-medium',
                  pathname === link.href ? 'text-primary bg-primary/5' : 'text-gray-600 active:bg-gray-50'
                )}
              >
                <span className="inline-flex items-center gap-2">
                  {t(link.key)}
                </span>
              </Link>
            ))}

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-3">{tA11y('languageLabel')}</p>
              <div className="flex gap-2">
                <Link
                  href={pathname}
                  locale="en"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex-1 py-3 text-center text-base border rounded',
                    locale === 'en' ? 'bg-primary text-white border-primary' : 'text-gray-600'
                  )}
                >
                  {tA11y('englishOption')}
                </Link>
                <Link
                  href={pathname}
                  locale="zh"
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'flex-1 py-3 text-center text-base border rounded',
                    locale === 'zh' ? 'bg-primary text-white border-primary' : 'text-gray-600'
                  )}
                >
                  {tA11y('chineseOption')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Cart Drawer */}
      <InquiryCartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  );
}
