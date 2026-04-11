import { useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from '@cc-scale/ui';
import Hero from '@/components/Hero';
import RiskReversal from '@/components/RiskReversal';
import AlibabaTrustBadge from '@/components/AlibabaTrustBadge';
import AdvantagesWithData from '@/components/AdvantagesWithData';
import ProductCategories from '@/components/ProductCategories';
import SupplierComparison from '@/components/SupplierComparison';
import Testimonials from '@/components/Testimonials';
import Clients from '@/components/Clients';
import SocialMediaShowcase from '@/components/SocialMediaShowcase';
import { CollectionPageSchema } from '@/components/SchemaOrg';

function HomePageContent() {
  const locale = useLocale() as 'en' | 'zh';
  const t = useTranslations('home');

  return (
    <div>
      <Hero />
      <RiskReversal />
      <AlibabaTrustBadge />
      <ProductCategories locale={locale} />
      <AdvantagesWithData />
      <SupplierComparison />
      <Testimonials locale={locale} />
      <SocialMediaShowcase locale={locale} />
      <Clients />

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('ctaTitle')}
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-2xl mx-auto">
            {t('ctaDesc')}
          </p>
          <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
            <Link href="/contact">
              {t('getFreeQuote')}
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  const locale = useLocale() as 'en' | 'zh';

  const schemaName = locale === 'en'
    ? 'CC Scale - Professional Weighing Solutions'
    : 'CC Scale - 专业衡器解决方案';

  const schemaDesc = locale === 'en'
    ? 'Leading manufacturer of high-quality weighing scales. Body scales, hanging scales, kitchen scales, baby scales, and more.'
    : '高品质衡器的领先制造商。体重秤、吊秤、厨房秤、婴儿秤等产品。';

  return (
    <>
      <CollectionPageSchema name={schemaName} description={schemaDesc} locale={locale} />
      <HomePageContent />
    </>
  );
}
