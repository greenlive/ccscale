import type { Metadata } from 'next';
import { Suspense } from 'react';
import BlogListContent from './BlogListContent';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isZh = locale === 'zh';
  return {
    title: isZh ? '博客与资讯 - CC Scale | 行业动态和产品资讯' : 'Blog & Insights - CC Scale | Industry News & Product Updates',
    description: isZh
      ? '了解CC Scale最新的行业动态、产品资讯和衡器技术知识。探索专业称重解决方案的前沿信息。'
      : 'Stay updated with CC Scale\'s latest industry news, product updates, and technical knowledge about weighing solutions.',
    openGraph: {
      title: isZh ? '博客与资讯 - CC Scale | 行业动态和产品资讯' : 'Blog & Insights - CC Scale | Industry News & Product Updates',
      description: isZh
        ? '了解CC Scale最新的行业动态、产品资讯和衡器技术知识。探索专业称重解决方案的前沿信息。'
        : 'Stay updated with CC Scale\'s latest industry news, product updates, and technical knowledge about weighing solutions.',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'website',
    },
  };
}

export default function BlogPage() {
  return (
    <Suspense fallback={null}>
      <BlogListContent />
    </Suspense>
  );
}
