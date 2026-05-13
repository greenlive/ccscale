'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogCategories } from '@/components/blog/BlogCategories';
import { getApiUrl } from '@/lib/config/api';
import { Suspense } from 'react';
import type { BlogPost } from '@/types/blog';

function BlogListContent() {
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';
  const t = useTranslations('blog');
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const activeCategory = searchParams.get('category');

  useEffect(() => {
    fetchPosts();
  }, [activeCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ isActive: 'true', pageSize: '50' });
      if (activeCategory) params.set('category', activeCategory);
      const response = await fetch(getApiUrl(`blog?${params}`));
      if (response.ok) {
        const result = await response.json();
        setPosts(result.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {isZh ? '博客与资讯' : 'Blog & Insights'}
          </h1>
          <p className="text-xl text-warm-silver max-w-2xl mx-auto">
            {isZh
              ? '行业动态、产品资讯和技术知识'
              : 'Industry news, product updates, and technical knowledge'}
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <BlogCategories currentCategory={activeCategory ?? undefined} />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                  <div className="h-48 bg-gray-200 rounded mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          )}

          {!loading && posts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              {isZh ? '暂无博客文章' : 'No blog posts yet'}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function BlogPage() {
  return (
    <Suspense fallback={null}>
      <BlogListContent />
    </Suspense>
  );
}
