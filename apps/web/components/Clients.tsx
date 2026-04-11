'use client';

import { useTranslations } from 'next-intl';

const clients = ['Amazon', 'Walmart', 'Carrefour', 'Tesco', 'Aldi', 'Lidl'];

export default function Clients() {
  const t = useTranslations('home');

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-700">
          {t('trustedPartners')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center opacity-70">
          {clients.map((client, index) => (
            <div key={index} className="flex justify-center grayscale hover:grayscale-0 transition-all duration-300">
              <div className="h-12 bg-gray-200 rounded flex items-center justify-center px-6 font-semibold text-gray-500">
                {client}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
