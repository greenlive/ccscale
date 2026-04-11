import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Button } from '@cc-scale/ui';
import { Home } from 'lucide-react';

export default function NotFound() {
  const t = useTranslations('notFound');
  const tNav = useTranslations('nav');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-9xl font-bold text-accent mb-4">404</div>
          <h2 className="text-3xl font-bold text-[#0A1628] mb-4">
            {t('pageNotFound')}
          </h2>
          <p className="text-gray-600 mb-8">
            {t('pageNotFoundDesc')}
          </p>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              {tNav('home')}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
