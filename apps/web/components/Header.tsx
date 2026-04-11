'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { Menu, X, Globe, ChevronDown } from 'lucide-react';
import { Button, cn } from '@cc-scale/ui';
import { InquiryCartButton } from '@/components/inquiry/InquiryCartButton';
import { InquiryCartDrawer } from '@/components/inquiry/InquiryCartDrawer';

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
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll position

    return () => window.removeEventListener('scroll', handleScroll);
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
            <span className="text-2xl font-bold text-primary">CC Scale</span>
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
                aria-label="Switch language"
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
                    English
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
                    中文
                  </Link>
                </div>
              )}
            </div>

            <InquiryCartButton onClick={() => setCartOpen(true)} />

            <Button asChild variant="accent">
              <Link href="/contact">{t('contact')}</Link>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <InquiryCartButton className="h-10 w-10 p-0" onClick={() => setCartOpen(true)} />
            <button
              type="button"
              className="text-gray-600 p-2 -mr-2 rounded-md hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? t('closeMenu') : t('openMenu')}
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
              <p className="text-sm text-gray-500 mb-3">{t('language')}</p>
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
                  English
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
                  中文
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
