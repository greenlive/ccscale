import { getTranslations } from 'next-intl/server';
import { useTranslations, useLocale } from 'next-intl';
import { Shield, CheckCircle, Clock, MessageSquare, Building2, FileText, Factory, Calendar, Ship, Phone, Languages } from 'lucide-react';
import { Card, CardContent } from '@cc-scale/ui';
import { Button } from '@cc-scale/ui';
import { Link } from '@/i18n/routing';
import type { Metadata } from 'next';

const fundSecurityItems = [
  { icon: Building2, titleKey: 'bankAccount', descKey: 'bankAccountDesc' },
  { icon: CheckCircle, titleKey: 'paymentTerms', descKey: 'paymentTermsDesc' },
  { icon: FileText, titleKey: 'letterOfCredit', descKey: 'letterOfCreditDesc' },
  { icon: Shield, titleKey: 'tradeAssurance', descKey: 'tradeAssuranceDesc' },
];

const qualityAssuranceItems = [
  { icon: FileText, titleKey: 'certReports', descKey: 'certReportsDesc' },
  { icon: Factory, titleKey: 'factoryAudit', descKey: 'factoryAuditDesc' },
  { icon: CheckCircle, titleKey: 'sampleGuarantee', descKey: 'sampleGuaranteeDesc' },
  { icon: Shield, titleKey: 'retainSample', descKey: 'retainSampleDesc' },
];

const deliveryReliabilityItems = [
  { icon: Factory, titleKey: 'capacityTransparent', descKey: 'capacityTransparentDesc' },
  { icon: Calendar, titleKey: 'productionSchedule', descKey: 'productionScheduleDesc' },
  { icon: Ship, titleKey: 'logisticsGuarantee', descKey: 'logisticsGuaranteeDesc' },
  { icon: Clock, titleKey: 'delayCompensation', descKey: 'delayCompensationDesc', highlight: true },
];

const communicationItems = [
  { icon: MessageSquare, titleKey: 'online247', descKey: 'online247Desc' },
  { icon: Clock, titleKey: 'response24h', descKey: 'response24hDesc' },
  { icon: Phone, titleKey: 'dedicatedManager', descKey: 'dedicatedManagerDesc' },
  { icon: Languages, titleKey: 'multilingualTeam', descKey: 'multilingualTeamDesc' },
];

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'guarantee' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

function GuaranteeSection({
  icon: Icon,
  titleKey,
  subtitleKey,
  items,
  accentColor = 'blue',
}: {
  icon: any;
  titleKey: string;
  subtitleKey: string;
  items: Array<{ icon: any; titleKey: string; descKey: string; highlight?: boolean }>;
  accentColor?: 'blue' | 'green' | 'orange';
}) {
  const t = useTranslations('guarantee');
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';

  const accentClasses = {
    blue: 'from-accent to-accent/80',
    green: 'from-green-500 to-green-600',
    orange: 'from-orange-500 to-orange-600',
  };

  const bgClasses = {
    blue: 'bg-warm-sand',
    green: 'bg-green-50',
    orange: 'bg-orange-50',
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className={`mx-auto w-20 h-20 bg-gradient-to-br ${accentClasses[accentColor]} rounded-2xl flex items-center justify-center mb-6`}>
            <Icon className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            {t(titleKey)}
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t(subtitleKey)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, index) => {
            const ItemIcon = item.icon;
            return (
              <Card
                key={index}
                className={`group hover:shadow-xl transition-all duration-300 border-none ${
                  item.highlight ? 'ring-2 ring-accent' : ''
                }`}
              >
                <CardContent className="p-8 text-center">
                  <div className={`mx-auto w-16 h-16 ${bgClasses[accentColor]} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4`}>
                    <ItemIcon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg text-primary mb-2">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {t(item.descKey)}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GuaranteePageContent() {
  const t = useTranslations('guarantee');
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <Shield className="h-16 w-16 mx-auto mb-6 text-warm-silver" />
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t('title')}
          </h1>
          <p className="text-xl text-warm-silver max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Subtitle */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            {t('subtitle')}
          </h2>
        </div>
      </section>

      {/* Fund Security */}
      <GuaranteeSection
        icon={Shield}
        titleKey="fundSecurity"
        subtitleKey="fundSecurityDesc"
        items={fundSecurityItems}
        accentColor="blue"
      />

      {/* Quality Assurance */}
      <div className="bg-gray-50">
        <GuaranteeSection
          icon={CheckCircle}
          titleKey="qualityAssurance"
          subtitleKey="qualityAssuranceDesc"
          items={qualityAssuranceItems}
          accentColor="green"
        />
      </div>

      {/* Delivery Reliability */}
      <GuaranteeSection
        icon={Clock}
        titleKey="deliveryReliability"
        subtitleKey="deliveryReliabilityDesc"
        items={deliveryReliabilityItems}
        accentColor="orange"
      />

      {/* Communication Efficiency */}
      <div className="bg-gray-50">
        <GuaranteeSection
          icon={MessageSquare}
          titleKey="communicationEfficiency"
          subtitleKey="communicationEfficiencyDesc"
          items={communicationItems}
          accentColor="blue"
        />
      </div>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-warm-silver text-lg mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="outline" className="border-warm-sand text-primary hover:bg-white hover:text-primary">
              <Link href="/about">
                {t('cta.bookFactoryVisit')}
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-accent hover:bg-accent/90">
              <Link href="/contact">
                {t('cta.requestQuote')}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function GuaranteePage() {
  return <GuaranteePageContent />;
}
