'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, X, Image as ImageIcon, Video } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { api } from '@/lib/apiClient';

interface ProductSpec {
  id: number;
  keyEn: string;
  keyZh: string;
  valueEn: string;
  valueZh: string;
  order: number;
}

interface ProductImage {
  id: number;
  imageUrl: string;
  altEn?: string;
  altZh?: string;
  isMain: boolean;
}

interface Product {
  id: number;
  sku: string;
  nameEn: string;
  nameZh: string;
  slug: string;
  category?: {
    id: number;
    nameEn: string;
    nameZh: string;
    slug: string;
  };
  descriptionEn?: string;
  descriptionZh?: string;
  shortDescEn?: string;
  shortDescZh?: string;
  mainImage?: string;
  images?: ProductImage[];
  videoUrl?: string;
  priceMin?: number;
  priceMax?: number;
  moq?: number;
  leadTime?: string;
  order?: number;
  isFeatured: boolean;
  isActive: boolean;
  specs?: ProductSpec[];
  seoTitleEn?: string;
  seoTitleZh?: string;
  seoDescEn?: string;
  seoDescZh?: string;
  seoKeywordsEn?: string;
  seoKeywordsZh?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'CC Scale 管理后台 - 产品详情';
    fetchProduct();
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ data: Product }>(`/products/${params.id}`);

      if (response.success && response.data) {
        const productData = (response.data as any).data || response.data;
        setProduct(productData);
      } else {
        setError(response.error?.message || '获取产品详情失败');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('获取产品详情失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-stone-gray">加载中...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !product) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-destructive mb-4">{error || '产品不存在'}</p>
              <Button asChild variant="accent">
                <Link href="/products">返回产品列表</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  const categoryName = product.category
    ? `${product.category.nameZh || ''} ${product.category.nameEn || ''}`.trim()
    : '-';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => router.push('/products')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
            <div>
              <h1 className="text-3xl font-serif font-medium text-foreground">
                {product.nameZh || product.nameEn}
              </h1>
              <p className="text-stone-gray">SKU: {product.sku}</p>
            </div>
          </div>
          <Button asChild variant="accent">
            <Link href={`/products/${product.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              编辑产品
            </Link>
          </Button>
        </div>

        {/* Status Badges */}
        <div className="flex gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.isActive
                ? 'bg-green-100 text-green-800'
                : 'bg-warm-sand text-charcoal-warm'
            }`}
          >
            {product.isActive ? '启用' : '禁用'}
          </span>
          {product.isFeatured && (
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-terracotta/10 text-terracotta">
              精选产品
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-gray">分类</label>
                    <p className="text-foreground">{categoryName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-gray">Slug</label>
                    <p className="text-foreground font-mono">{product.slug}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-gray">产品名称 (EN)</label>
                    <p className="text-foreground">{product.nameEn || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-gray">产品名称 (ZH)</label>
                    <p className="text-foreground">{product.nameZh || '-'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-stone-gray">短描述 (EN)</label>
                  <p className="text-foreground">{product.shortDescEn || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-gray">短描述 (ZH)</label>
                  <p className="text-foreground">{product.shortDescZh || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-gray">详细描述 (EN)</label>
                  <p className="text-foreground whitespace-pre-wrap">{product.descriptionEn || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-gray">详细描述 (ZH)</label>
                  <p className="text-foreground whitespace-pre-wrap">{product.descriptionZh || '-'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>价格与交期</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-gray">最低价</label>
                    <p className="text-2xl font-serif text-terracotta">
                      ${product.priceMin ?? '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-gray">最高价</label>
                    <p className="text-2xl font-serif text-terracotta">
                      ${product.priceMax ?? '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-gray">最小起订量</label>
                    <p className="text-2xl font-serif text-foreground">
                      {product.moq ?? '-'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-gray">交期</label>
                    <p className="text-lg font-medium text-foreground">
                      {product.leadTime || '-'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Specifications */}
            {product.specs && product.specs.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>产品规格</CardTitle>
                </CardHeader>
                <CardContent>
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-cream">
                        <th className="text-left py-2 text-stone-gray font-medium">规格名称 (EN)</th>
                        <th className="text-left py-2 text-stone-gray font-medium">规格名称 (ZH)</th>
                        <th className="text-left py-2 text-stone-gray font-medium">规格值 (EN)</th>
                        <th className="text-left py-2 text-stone-gray font-medium">规格值 (ZH)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.specs.map((spec) => (
                        <tr key={spec.id} className="border-b border-border-cream">
                          <td className="py-3">{spec.keyEn || '-'}</td>
                          <td className="py-3">{spec.keyZh || '-'}</td>
                          <td className="py-3">{spec.valueEn || '-'}</td>
                          <td className="py-3">{spec.valueZh || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            )}

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-gray">SEO标题 (EN)</label>
                    <p className="text-foreground">{product.seoTitleEn || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-gray">SEO标题 (ZH)</label>
                    <p className="text-foreground">{product.seoTitleZh || '-'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-gray">SEO描述 (EN)</label>
                  <p className="text-foreground">{product.seoDescEn || '-'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-gray">SEO描述 (ZH)</label>
                  <p className="text-foreground">{product.seoDescZh || '-'}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-stone-gray">SEO关键词 (EN)</label>
                    <p className="text-foreground">{product.seoKeywordsEn || '-'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-stone-gray">SEO关键词 (ZH)</label>
                    <p className="text-foreground">{product.seoKeywordsZh || '-'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  产品图库 (Gallery)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-stone-gray mb-3">封面图用于产品列表展示，其他图片可在详情页图库中浏览</p>
                {product.mainImage ? (
                  <div className="space-y-3">
                    <div
                      className="relative aspect-square rounded-lg overflow-hidden bg-warm-sand cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setPreviewImage(product.mainImage || null)}
                    >
                      <img
                        src={product.mainImage}
                        alt={product.nameEn}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 left-2 bg-accent text-white text-xs px-2 py-1 rounded">
                        主图
                      </span>
                    </div>
                    {product.images && product.images.length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {product.images
                          .filter((img) => !img.isMain)
                          .map((img) => (
                            <div
                              key={img.id}
                              className="aspect-square rounded overflow-hidden bg-warm-sand cursor-pointer hover:opacity-90 transition-opacity"
                              onClick={() => setPreviewImage(img.imageUrl)}
                            >
                              <img
                                src={img.imageUrl}
                                alt={img.altEn || ''}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-stone-gray text-center py-4">暂无图片</p>
                )}
              </CardContent>
            </Card>

            {/* Video */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  产品视频
                </CardTitle>
              </CardHeader>
              <CardContent>
                {product.videoUrl ? (
                  <div className="aspect-video rounded-lg overflow-hidden bg-warm-sand">
                    <video
                      src={product.videoUrl}
                      controls
                      className="w-full h-full"
                      title="Product Video"
                    />
                  </div>
                ) : (
                  <p className="text-stone-gray text-center py-4">暂无视频</p>
                )}
              </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>其他信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-stone-gray">排序</span>
                  <span className="text-foreground">{product.order ?? 0}</span>
                </div>
                {product.createdAt && (
                  <div className="flex justify-between">
                    <span className="text-stone-gray">创建时间</span>
                    <span className="text-foreground text-sm">
                      {new Date(product.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                )}
                {product.updatedAt && (
                  <div className="flex justify-between">
                    <span className="text-stone-gray">更新时间</span>
                    <span className="text-foreground text-sm">
                      {new Date(product.updatedAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
            onClick={() => setPreviewImage(null)}
          >
            <X className="h-6 w-6 text-white" />
          </button>
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full max-h-[85vh] mx-auto object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
)}

      {/* Website preview link */}
      <div className="fixed bottom-4 right-4">
        <a
          href={`/${product.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg shadow-lg hover:bg-accent/90 transition-colors"
        >
          <span>在网站上预览</span>
        </a>
      </div>
    </AdminLayout>
  );
}
