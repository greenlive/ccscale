'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Textarea } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { FileUpload } from '@/components/FileUpload';
import { ProductSpecs } from '@/components/ProductSpecs';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  isMain?: boolean;
}

interface SpecItem {
  id: string;
  keyEn: string;
  keyZh: string;
  valueEn: string;
  valueZh: string;
  order: number;
}

// 模拟产品数据 - 实际项目中从API获取
const mockProducts = [
  {
    id: 1,
    sku: 'BS-200',
    nameEn: 'Digital Body Scale BS-200',
    nameZh: '数字体重秤 BS-200',
    slug: 'digital-body-scale-bs-200',
    categoryId: '1',
    shortDescEn: 'Professional digital body scale for home and commercial use',
    shortDescZh: '适用于家庭和商业用途的专业数字体重秤',
    descEn: 'High-precision digital body scale with advanced weighing technology. Features include step-on activation, auto-calibration, and large LCD display.',
    descZh: '高精度数字体重秤，采用先进的称重技术。功能包括即踩即称、自动校准和大液晶显示屏。',
    priceMin: 15,
    priceMax: 25,
    moq: 100,
    leadTime: '15-20 days',
    isActive: true,
    isFeatured: true,
    sortOrder: 0,
    seoTitleEn: 'Digital Body Scale BS-200 | CC Scale',
    seoTitleZh: '数字体重秤 BS-200 | CC Scale',
    seoDescEn: 'High-quality digital body scale with precision sensors. Perfect for B2B buyers and distributors.',
    seoDescZh: '采用精密传感器的高质量数字体重秤。完美适合B2B买家和经销商。',
    seoKeywordsEn: 'body scale, digital scale, weighing scale, bathroom scale',
    seoKeywordsZh: '体重秤, 电子秤, 衡器, 人体秤',
    specs: [
      { id: '1', keyEn: 'Capacity', keyZh: '最大称重', valueEn: '180kg / 400lb', valueZh: '180公斤 / 400磅', order: 0 },
      { id: '2', keyEn: 'Division', keyZh: '分度值', valueEn: '100g', valueZh: '100克', order: 1 },
      { id: '3', keyEn: 'Display', keyZh: '显示', valueEn: 'LCD, 3.5"', valueZh: '液晶显示屏, 3.5英寸', order: 2 },
      { id: '4', keyEn: 'Power', keyZh: '电源', valueEn: '2 x AAA batteries', valueZh: '2节AAA电池', order: 3 },
    ],
    images: [] as UploadedFile[],
    videos: [] as UploadedFile[],
  },
  {
    id: 2,
    sku: 'HS-500',
    nameEn: 'Industrial Hanging Scale HS-500',
    nameZh: '工业吊秤 HS-500',
    slug: 'industrial-hanging-scale-hs-500',
    categoryId: '2',
    shortDescEn: 'Heavy-duty hanging scale for industrial use',
    shortDescZh: '工业用重型吊秤',
    descEn: 'Heavy-duty industrial hanging scale designed for commercial and industrial applications.',
    descZh: '重型工业吊秤，专为商业和工业应用设计。',
    priceMin: 45,
    priceMax: 85,
    moq: 50,
    leadTime: '20-25 days',
    isActive: true,
    isFeatured: true,
    sortOrder: 1,
    seoTitleEn: '',
    seoTitleZh: '',
    seoDescEn: '',
    seoDescZh: '',
    seoKeywordsEn: '',
    seoKeywordsZh: '',
    specs: [],
    images: [] as UploadedFile[],
    videos: [] as UploadedFile[],
  },
  {
    id: 3,
    sku: 'KS-300',
    nameEn: 'Precision Kitchen Scale KS-300',
    nameZh: '精密厨房秤 KS-300',
    slug: 'precision-kitchen-scale-ks-300',
    categoryId: '3',
    shortDescEn: 'Accurate digital kitchen scale',
    shortDescZh: '精确的数字厨房秤',
    descEn: 'Professional precision kitchen scale for accurate food measurement.',
    descZh: '专业精密厨房秤，用于精确食物测量。',
    priceMin: 12,
    priceMax: 20,
    moq: 200,
    leadTime: '12-15 days',
    isActive: true,
    isFeatured: false,
    sortOrder: 2,
    seoTitleEn: '',
    seoTitleZh: '',
    seoDescEn: '',
    seoDescZh: '',
    seoKeywordsEn: '',
    seoKeywordsZh: '',
    specs: [],
    images: [] as UploadedFile[],
    videos: [] as UploadedFile[],
  },
  {
    id: 4,
    sku: 'BS-100',
    nameEn: 'Smart Body Composition Scale',
    nameZh: '智能体脂秤',
    slug: 'smart-body-composition-scale',
    categoryId: '1',
    shortDescEn: '',
    shortDescZh: '',
    descEn: '',
    descZh: '',
    priceMin: 25,
    priceMax: 45,
    moq: 80,
    leadTime: '',
    isActive: false,
    isFeatured: false,
    sortOrder: 3,
    seoTitleEn: '',
    seoTitleZh: '',
    seoDescEn: '',
    seoDescZh: '',
    seoKeywordsEn: '',
    seoKeywordsZh: '',
    specs: [],
    images: [] as UploadedFile[],
    videos: [] as UploadedFile[],
  },
];

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [images, setImages] = useState<UploadedFile[]>([]);
  const [videos, setVideos] = useState<UploadedFile[]>([]);
  const [specs, setSpecs] = useState<SpecItem[]>([]);

  const productId = parseInt(params.id);

  // 加载产品数据
  useEffect(() => {
    // 模拟API加载延迟
    const timer = setTimeout(() => {
      const foundProduct = mockProducts.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setSpecs(foundProduct.specs);
        // 图片和视频初始化为空（实际项目中从API获取）
        setImages([]);
        setVideos([]);
      }
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    // 模拟保存
    console.log('Updating product with:', { product, images, videos, specs });

    setTimeout(() => {
      setIsSaving(false);
      router.push('/products');
    }, 1500);
  };

  const handleFieldChange = (field: string, value: any) => {
    setProduct((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-gray-600">加载产品数据...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">产品未找到</h2>
          <p className="text-gray-600 mb-6">ID为 {productId} 的产品不存在</p>
          <Button asChild variant="outline">
            <button onClick={() => router.push('/products')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回产品列表
            </button>
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#0A1628]">编辑产品</h1>
            <p className="text-gray-600">编辑产品: {product.nameEn} (SKU: {product.sku})</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>产品信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU *
                      </label>
                      <Input
                        required
                        placeholder="e.g. BS-200"
                        value={product.sku}
                        onChange={(e) => handleFieldChange('sku', e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        分类 *
                      </label>
                      <select
                        required
                        className="h-10 w-full px-3 border border-gray-200 rounded-md"
                        value={product.categoryId}
                        onChange={(e) => handleFieldChange('categoryId', e.target.value)}
                      >
                        <option value="">选择分类</option>
                        <option value="1">Body Scales</option>
                        <option value="2">Hanging Scales</option>
                        <option value="3">Kitchen Scales</option>
                        <option value="4">Baby Scales</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      产品名称 (英文) *
                    </label>
                    <Input
                      required
                      placeholder="Enter product name"
                      value={product.nameEn}
                      onChange={(e) => handleFieldChange('nameEn', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      产品名称 (中文) *
                    </label>
                    <Input
                      required
                      placeholder="输入产品名称"
                      value={product.nameZh}
                      onChange={(e) => handleFieldChange('nameZh', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL别名 (Slug) *
                    </label>
                    <Input
                      required
                      placeholder="product-url-slug"
                      value={product.slug}
                      onChange={(e) => handleFieldChange('slug', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      简短描述 (英文)
                    </label>
                    <Input
                      placeholder="Brief description"
                      value={product.shortDescEn}
                      onChange={(e) => handleFieldChange('shortDescEn', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      简短描述 (中文)
                    </label>
                    <Input
                      placeholder="简短描述"
                      value={product.shortDescZh}
                      onChange={(e) => handleFieldChange('shortDescZh', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      详细描述 (英文)
                    </label>
                    <Textarea
                      rows={6}
                      placeholder="Full product description"
                      value={product.descEn}
                      onChange={(e) => handleFieldChange('descEn', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      详细描述 (中文)
                    </label>
                    <Textarea
                      rows={6}
                      placeholder="完整产品描述"
                      value={product.descZh}
                      onChange={(e) => handleFieldChange('descZh', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>产品规格</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductSpecs specs={specs} onChange={setSpecs} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>价格与库存</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最低价格
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={product.priceMin}
                        onChange={(e) => handleFieldChange('priceMin', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最高价格
                      </label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={product.priceMax}
                        onChange={(e) => handleFieldChange('priceMax', parseFloat(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最小起订量 (MOQ)
                      </label>
                      <Input
                        type="number"
                        placeholder="100"
                        value={product.moq}
                        onChange={(e) => handleFieldChange('moq', parseInt(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      交期
                    </label>
                    <Input
                      placeholder="15-20 days"
                      value={product.leadTime}
                      onChange={(e) => handleFieldChange('leadTime', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO 优化</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 标题 (英文)
                    </label>
                    <Input
                      placeholder="SEO title for search engines"
                      value={product.seoTitleEn}
                      onChange={(e) => handleFieldChange('seoTitleEn', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 标题 (中文)
                    </label>
                    <Input
                      placeholder="搜索引擎优化标题"
                      value={product.seoTitleZh}
                      onChange={(e) => handleFieldChange('seoTitleZh', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 描述 (英文)
                    </label>
                    <Textarea
                      rows={3}
                      placeholder="Meta description for search engines"
                      value={product.seoDescEn}
                      onChange={(e) => handleFieldChange('seoDescEn', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 描述 (中文)
                    </label>
                    <Textarea
                      rows={3}
                      placeholder="搜索引擎元描述"
                      value={product.seoDescZh}
                      onChange={(e) => handleFieldChange('seoDescZh', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 关键词 (英文)
                    </label>
                    <Input
                      placeholder="comma, separated, keywords"
                      value={product.seoKeywordsEn}
                      onChange={(e) => handleFieldChange('seoKeywordsEn', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 关键词 (中文)
                    </label>
                    <Input
                      placeholder="关键词，用逗号分隔"
                      value={product.seoKeywordsZh}
                      onChange={(e) => handleFieldChange('seoKeywordsZh', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>状态设置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={product.isActive}
                      onChange={(e) => handleFieldChange('isActive', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="isActive" className="text-sm text-gray-700">
                      启用
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={product.isFeatured}
                      onChange={(e) => handleFieldChange('isFeatured', e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="isFeatured" className="text-sm text-gray-700">
                      精选产品
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      排序
                    </label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={product.sortOrder}
                      onChange={(e) => handleFieldChange('sortOrder', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>产品图片</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    type="image"
                    accept="image/*"
                    multiple
                    maxFiles={10}
                    files={images}
                    onChange={setImages}
                    showMainImageToggle
                    label="图片"
                    hint="JPG, PNG, WebP up to 5MB each. First image will be the main image."
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>产品视频</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    type="video"
                    accept="video/*"
                    multiple
                    maxFiles={3}
                    files={videos}
                    onChange={setVideos}
                    label="视频"
                    hint="MP4, WebM up to 100MB each."
                  />
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-accent/90"
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? '保存中...' : '保存更改'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
