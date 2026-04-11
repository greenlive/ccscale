'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import { ExternalLink, Youtube, Facebook, Linkedin, Instagram, MessageCircle } from 'lucide-react';
import { getApiUrl } from '@/lib/config/api';

interface SocialPlatform {
  key: string;
  name: string;
  nameZh: string;
  icon: typeof Youtube;
  color: string;
  bgColor: string;
  contentUrl: string;
  placeholder: string;
  placeholderZh: string;
}

const PLATFORMS: SocialPlatform[] = [
  {
    key: 'socialYoutubeContentUrl',
    name: 'YouTube',
    nameZh: 'YouTube',
    icon: Youtube,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    contentUrl: '',
    placeholder: 'Enter YouTube channel or video URL',
    placeholderZh: '输入YouTube频道或视频链接',
  },
  {
    key: 'socialFacebookContentUrl',
    name: 'Facebook',
    nameZh: 'Facebook',
    icon: Facebook,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    contentUrl: '',
    placeholder: 'Enter Facebook page or post URL',
    placeholderZh: '输入Facebook主页或帖子链接',
  },
  {
    key: 'socialLinkedInContentUrl',
    name: 'LinkedIn',
    nameZh: 'LinkedIn',
    icon: Linkedin,
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    contentUrl: '',
    placeholder: 'Enter LinkedIn company page URL',
    placeholderZh: '输入LinkedIn公司主页链接',
  },
  {
    key: 'socialInstagramContentUrl',
    name: 'Instagram',
    nameZh: 'Instagram',
    icon: Instagram,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    contentUrl: '',
    placeholder: 'Enter Instagram profile or post URL',
    placeholderZh: '输入Instagram主页或帖子链接',
  },
  {
    key: 'socialTikTokContentUrl',
    name: 'TikTok',
    nameZh: 'TikTok',
    icon: MessageCircle,
    color: 'text-gray-800',
    bgColor: 'bg-gray-100',
    contentUrl: '',
    placeholder: 'Enter TikTok profile or video URL',
    placeholderZh: '输入TikTok主页或视频链接',
  },
];

export default function SocialMediaShowcase({ locale }: { locale: string }) {
  const t = useTranslations('home');
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setHasError(false);
      const response = await fetch(getApiUrl('site-settings'));
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        setHasError(true);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  // Filter platforms that have content URLs configured
  const configuredPlatforms = PLATFORMS.filter((platform) => {
    const url = settings[platform.key];
    return url && url.trim() !== '';
  });

  // Don't render if has error
  if (hasError) {
    return null;
  }

  // Show skeleton while loading or if no social content is configured
  if (loading || configuredPlatforms.length === 0) {
    return (
      <section className="py-16 bg-white overflow-hidden">
        <div className="container mx-auto px-4">
          {/* Section Header Skeleton */}
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded w-48 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-96 max-w-full mx-auto animate-pulse"></div>
          </div>
          {/* Social Media Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white border-2 border-gray-100 rounded-2xl p-6 animate-pulse">
                <div className={`w-14 h-14 rounded-2xl bg-gray-200 mb-4`}></div>
                <div className="h-5 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const getPlatformTitle = (platform: SocialPlatform) => {
    return locale === 'en'
      ? `Follow us on ${platform.name}`
      : `关注我们的${platform.nameZh}`;
  };

  const getPlatformDescription = (platform: SocialPlatform) => {
    const url = settings[platform.key];
    if (!url) return '';

    // Extract useful info from URL
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname.replace('www.', '');

      if (platform.key === 'socialYoutubeContentUrl') {
        if (url.includes('/channel/') || url.includes('/c/') || url.includes('/@')) {
          return locale === 'en' ? 'Watch our latest videos' : '观看我们的最新视频';
        }
        return locale === 'en' ? 'Watch this video' : '观看此视频';
      }
      if (platform.key === 'socialFacebookContentUrl') {
        if (url.includes('/pages/') || url.includes('/profile/') || url.includes('/groups/')) {
          return locale === 'en' ? 'Visit our Facebook page' : '访问我们的Facebook主页';
        }
        return locale === 'en' ? 'View on Facebook' : '在Facebook上查看';
      }
      if (platform.key === 'socialLinkedInContentUrl') {
        return locale === 'en' ? 'Connect on LinkedIn' : '在LinkedIn上联系我们';
      }
      if (platform.key === 'socialInstagramContentUrl') {
        return locale === 'en' ? 'Follow us on Instagram' : '在Instagram上关注我们';
      }
      if (platform.key === 'socialTikTokContentUrl') {
        return locale === 'en' ? 'Follow us on TikTok' : '在TikTok上关注我们';
      }
    } catch {
      // Invalid URL, use default
    }

    return locale === 'en' ? `Visit our ${platform.name}` : `访问我们的${platform.nameZh}`;
  };

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary mb-4">
            {t('socialTitle')}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {t('socialDesc')}
          </p>
        </div>

        {/* Social Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 max-w-5xl mx-auto">
          {configuredPlatforms.map((platform) => {
            const Icon = platform.icon;
            const url = settings[platform.key];

            return (
              <a
                key={platform.key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white border-2 border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Platform Icon */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl ${platform.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-7 w-7 ${platform.color}`} />
                </div>

                {/* Platform Name */}
                <h3 className="font-semibold text-primary mb-2">
                  {platform.name}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {getPlatformDescription(platform)}
                </p>

                {/* Link Indicator */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ExternalLink className={`h-5 w-5 ${platform.color}`} />
                </div>
              </a>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground text-sm">
            {t('socialCta')}
          </p>
        </div>
      </div>
    </section>
  );
}
