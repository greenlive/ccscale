'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getApiUrl } from '@/lib/config/api';

interface Client {
  id: number;
  name: string;
  logoUrl: string;
  website?: string;
  isActive: boolean;
}

export default function Clients() {
  const t = useTranslations('home');
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch(getApiUrl('clients?isActive=true'));
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const defaultClients = ['Amazon', 'Walmart', 'Carrefour', 'Tesco', 'Aldi', 'Lidl'];
  const displayClients = clients.length > 0 ? clients : [];

  return (
    <section className="py-12 bg-gradient-to-r from-gray-50 to-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-10 text-gray-700">
          {t('trustedPartners')}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {loading ? (
            // Skeleton loading
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="flex justify-center">
                <div className="h-12 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))
          ) : displayClients.length > 0 ? (
            // Real clients from database
            displayClients.map((client, index) => (
              <a
                key={client.id}
                href={client.website || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center grayscale hover:grayscale-0 transition-all duration-500 hover:scale-110 p-2"
                title={client.name}
              >
                {client.logoUrl ? (
                  <Image
                    src={client.logoUrl}
                    alt={client.name}
                    width={100}
                    height={50}
                    className="h-12 w-auto object-contain"
                  />
                ) : (
                  <div className="h-12 flex items-center justify-center px-4 font-semibold text-gray-500">
                    {client.name}
                  </div>
                )}
              </a>
            ))
          ) : (
            // Default clients
            defaultClients.map((client, index) => (
              <div
                key={index}
                className="flex justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
              >
                <div className="h-12 bg-gray-200 rounded flex items-center justify-center px-6 font-semibold text-gray-500">
                  {client}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
