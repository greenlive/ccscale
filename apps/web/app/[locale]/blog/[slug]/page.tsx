'use client';

import { notFound } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Calendar, Clock, Share2, Tag } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import Image from 'next/image';
import { getApiUrl } from '@/lib/config/api';

interface BlogPost {
  id: number;
  slug: string;
  titleEn: string;
  titleZh: string;
  excerptEn?: string;
  excerptZh?: string;
  contentEn?: string;
  contentZh?: string;
  coverImage?: string;
  category?: string;
  tags: string[];
  isFeatured: boolean;
  publishedAt?: string;
  createdAt: string;
}

function BlogPostContent({ params }: { params: { slug: string; locale: string } }) {
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFound] = useState(false);

  useEffect(() => {
    fetchPost();
  }, [params.slug]);

  const fetchPost = async () => {
    try {
      const response = await fetch(getApiUrl(`blog/slug/${params.slug}`));
      if (response.ok) {
        const data = await response.json();
        setPost(data);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Failed to fetch blog post:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <section className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="h-4 bg-gray-200 rounded w-24 mb-6 animate-pulse" />
          </div>
        </section>
        <section className="py-12">
          <div className="container mx-auto px-4 max-w-4xl animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/3 mb-8" />
            <div className="aspect-[16/9] bg-gray-200 rounded mb-8" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (notFoundState || !post) {
    notFound();
  }

  const title = isZh ? post.titleZh : post.titleEn;
  const content = isZh ? post.contentZh : post.contentEn;
  const date = post.publishedAt || post.createdAt;
  const formattedDate = new Date(date).toLocaleDateString(
    isZh ? 'zh-CN' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );
  const readingTime = Math.max(1, Math.ceil((content?.length || 0) / 500));

  return (
    <article>
      <section className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-600 hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isZh ? '返回博客' : 'Back to Blog'}
          </Link>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              {title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6">
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formattedDate}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {readingTime} {isZh ? '分钟阅读' : 'min read'}
              </span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 text-sm font-medium bg-gray-100 text-gray-600 rounded-full"
                  >
                    <Tag className="h-3 w-3 mr-1" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {post.coverImage && (
            <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8">
              <Image
                src={post.coverImage}
                alt={title}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content || '' }}
          />

          <div className="mt-12 pt-8 border-t">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                {isZh ? '分享这篇文章' : 'Share this article'}
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  {isZh ? '分享' : 'Share'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string; locale: string }
}) {
  return <BlogPostContent params={params} />;
}
