import type { Metadata } from 'next';
import BlogPostContent from './BlogPostContent';

export async function generateMetadata({ params: { locale } }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const isZh = locale === 'zh';
  return {
    title: isZh ? '博客文章 - CC Scale' : 'Blog Post - CC Scale',
    description: isZh
      ? '阅读CC Scale博客文章，了解衡器行业洞察、产品知识和最新动态。'
      : 'Read the latest blog post from CC Scale about weighing scales, industry insights, and product knowledge.',
    openGraph: {
      title: isZh ? '博客文章 - CC Scale' : 'Blog Post - CC Scale',
      description: isZh
        ? '阅读CC Scale博客文章，了解衡器行业洞察、产品知识和最新动态。'
        : 'Read the latest blog post from CC Scale about weighing scales, industry insights, and product knowledge.',
      locale: isZh ? 'zh_CN' : 'en_US',
      type: 'article',
    },
  };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string; locale: string }
}) {
  return <BlogPostContent params={params} />;
}
