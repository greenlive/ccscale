'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle, Plus, X } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Textarea } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { FileUpload } from '@/components/FileUpload';
import { ProductSpecs } from '@/components/ProductSpecs';
import { ProductCertifications } from '@/components/ProductCertifications';
import { ProductFAQ } from '@/components/ProductFAQ';
import { ProductCoreSellingPoints } from '@/components/ProductCoreSellingPoints';
import { ProductTradeInfo } from '@/components/ProductTradeInfo';
import { ProductFactoryInfo } from '@/components/ProductFactoryInfo';
import { api } from '@/lib/apiClient';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  isMain?: boolean;
  uploadedUrl?: string;
}

interface SpecItem {
  id: string;
  keyEn: string;
  keyZh: string;
  valueEn: string;
  valueZh: string;
  order: number;
}

interface FAQItem {
  id: string;
  questionEn: string;
  questionZh: string;
  answerEn: string;
  answerZh: string;
}

interface CoreSellingPoint {
  id: string;
  pointEn: string;
  pointZh: string;
}

interface Category {
  id: number;
  nameEn: string;
  nameZh: string;
  slug: string;
}

interface ProductFormData {
  sku: string;
  categoryId: string;
  nameEn: string;
  nameZh: string;
  slug: string;
  shortDescEn: string;
  shortDescZh: string;
  descriptionEn: string;
  descriptionZh: string;
  priceMin: string;
  priceMax: string;
  moq: string;
  leadTime: string;
  seoTitleEn: string;
  seoTitleZh: string;
  seoDescEn: string;
  seoDescZh: string;
  seoKeywordsEn: string;
  seoKeywordsZh: string;
  isActive: boolean;
  isFeatured: boolean;
  order: string;
  // B2B fields
  applicationScenariosEn: string;
  applicationScenariosZh: string;
  hsCode: string;
  paymentTerms: string;
  shippingTerms: string;
  warrantyInfo: string;
  packagingInfoEn: string;
  packagingInfoZh: string;
  manufacturerName: string;
  factoryLocation: string;
  productionCapacity: string;
  // New B2B fields
  tradeKeywords: string[];
  targetMarkets: string[];
  exportExperience: string;
}

const initialFormData: ProductFormData = {
  sku: '',
  categoryId: '',
  nameEn: '',
  nameZh: '',
  slug: '',
  shortDescEn: '',
  shortDescZh: '',
  descriptionEn: '',
  descriptionZh: '',
  priceMin: '',
  priceMax: '',
  moq: '',
  leadTime: '',
  seoTitleEn: '',
  seoTitleZh: '',
  seoDescEn: '',
  seoDescZh: '',
  seoKeywordsEn: '',
  seoKeywordsZh: '',
  isActive: true,
  isFeatured: false,
  order: '0',
  // B2B fields
  applicationScenariosEn: '',
  applicationScenariosZh: '',
  hsCode: '',
  paymentTerms: '',
  shippingTerms: '',
  warrantyInfo: '',
  packagingInfoEn: '',
  packagingInfoZh: '',
  manufacturerName: '',
  factoryLocation: '',
  productionCapacity: '',
  // New B2B fields
  tradeKeywords: [],
  targetMarkets: [],
  exportExperience: '',
};

export default function NewProductPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [mainImages, setMainImages] = useState<UploadedFile[]>([]);
  const [detailImages, setDetailImages] = useState<UploadedFile[]>([]);
  const [videos, setVideos] = useState<UploadedFile[]>([]);
  const [specs, setSpecs] = useState<SpecItem[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [sellingPoints, setSellingPoints] = useState<CoreSellingPoint[]>([]);
  const [tradeInfo, setTradeInfo] = useState({
    hsCode: '',
    paymentTerms: '',
    shippingTerms: '',
    warrantyInfo: '',
    fobPort: '',
    leadTime: '',
  });
  const [factoryInfo, setFactoryInfo] = useState({
    manufacturerName: '',
    factoryLocation: '',
    productionCapacity: '',
    productionCapacityUnit: 'pcs/month',
  });
  const [tradeKeywords, setTradeKeywords] = useState<string[]>([]);
  const [targetMarkets, setTargetMarkets] = useState<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    document.title = 'CC Scale 管理后台 - 添加产品';
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await api.get<{ data: Category[] }>('/products/categories');
      if (response.success && response.data) {
        const categoriesData = Array.isArray(response.data)
          ? response.data
          : (response.data as any).data || [];
        setCategories(categoriesData);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    } finally {
      setLoadingCategories(false);
    }
  };

  const toSlug = (name: string) =>
    name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));

    if (name === 'nameEn' && !slugManuallyEdited) {
      setFormData((prev) => ({ ...prev, slug: toSlug(value) }));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, slug: e.target.value }));
    setSlugManuallyEdited(true);
  };

  const uploadFiles = async (files: UploadedFile[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file.uploadedUrl) {
        uploadedUrls.push(file.uploadedUrl);
      } else if (file.file) {
        const uploadType = file.type === 'image' ? 'product-image' : 'product-video';
        const result = await api.upload<{ url: string }>(
          `/upload/${uploadType}`,
          file.file,
          uploadType
        );
        if (result.success && result.data) {
          const url = (result.data as any).url || result.data;
          uploadedUrls.push(url);
        }
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      // Validate required fields
      if (!formData.sku.trim()) {
        throw new Error('SKU不能为空');
      }
      if (!formData.nameEn.trim()) {
        throw new Error('产品英文名称不能为空');
      }
      if (!formData.categoryId) {
        throw new Error('请选择产品分类');
      }

      // Upload images and videos first
      const uploadedMainImageUrls = await uploadFiles(mainImages);
      const uploadedDetailImageUrls = await uploadFiles(detailImages);
      const uploadedVideoUrls = await uploadFiles(videos);

      // Combine all images (without type field to avoid enum validation issues)
      const allImages = [
        ...uploadedMainImageUrls.map((url, idx) => ({
          imageUrl: url,
          order: idx,
          isMain: idx === 0,
        })),
        ...uploadedDetailImageUrls.map((url, idx) => ({
          imageUrl: url,
          order: idx,
          isMain: false,
        })),
      ];

      // Prepare product data
      const productData = {
        sku: formData.sku.trim(),
        categoryId: parseInt(formData.categoryId),
        nameEn: formData.nameEn.trim(),
        nameZh: formData.nameZh.trim() || formData.nameEn.trim(),
        slug: formData.slug.trim() || toSlug(formData.nameEn),
        shortDescEn: formData.shortDescEn.trim(),
        shortDescZh: formData.shortDescZh.trim(),
        descriptionEn: formData.descriptionEn.trim(),
        descriptionZh: formData.descriptionZh.trim(),
        priceMin: formData.priceMin ? parseFloat(formData.priceMin) : undefined,
        priceMax: formData.priceMax ? parseFloat(formData.priceMax) : undefined,
        moq: formData.moq ? parseInt(formData.moq) : undefined,
        seoTitleEn: formData.seoTitleEn.trim(),
        seoTitleZh: formData.seoTitleZh.trim(),
        seoDescEn: formData.seoDescEn.trim(),
        seoDescZh: formData.seoDescZh.trim(),
        seoKeywordsEn: formData.seoKeywordsEn.trim(),
        seoKeywordsZh: formData.seoKeywordsZh.trim(),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        order: parseInt(formData.order) || 0,
        mainImage: uploadedMainImageUrls[0] || undefined,
        videoUrl: uploadedVideoUrls[0] || undefined,
        images: allImages,
        specs: specs.map((spec, index) => ({
          keyEn: spec.keyEn,
          keyZh: spec.keyZh,
          valueEn: spec.valueEn,
          valueZh: spec.valueZh,
          order: index,
        })),
        // B2B fields
        coreSellingPointsEn: sellingPoints.length > 0 ? JSON.stringify(sellingPoints.map(p => p.pointEn)) : undefined,
        coreSellingPointsZh: sellingPoints.length > 0 ? JSON.stringify(sellingPoints.map(p => p.pointZh)) : undefined,
        applicationScenariosEn: formData.applicationScenariosEn.trim() || undefined,
        applicationScenariosZh: formData.applicationScenariosZh.trim() || undefined,
        faqEn: faqs.length > 0 ? JSON.stringify(faqs.map(f => ({ q: f.questionEn, a: f.answerEn }))) : undefined,
        faqZh: faqs.length > 0 ? JSON.stringify(faqs.map(f => ({ q: f.questionZh, a: f.answerZh }))) : undefined,
        certifications: certifications.length > 0 ? JSON.stringify(certifications) : undefined,
        hsCode: tradeInfo.hsCode.trim() || undefined,
        fobPort: tradeInfo.fobPort.trim() || undefined,
        paymentTerms: tradeInfo.paymentTerms.trim() || undefined,
        shippingTerms: tradeInfo.shippingTerms.trim() || undefined,
        warrantyInfo: tradeInfo.warrantyInfo.trim() || undefined,
        leadTime: tradeInfo.leadTime.trim() || undefined,
        packagingInfoEn: formData.packagingInfoEn.trim() || undefined,
        packagingInfoZh: formData.packagingInfoZh.trim() || undefined,
        manufacturerName: factoryInfo.manufacturerName.trim() || undefined,
        factoryLocation: factoryInfo.factoryLocation.trim() || undefined,
        productionCapacity: factoryInfo.productionCapacity.trim() ? `${factoryInfo.productionCapacity.trim()} ${factoryInfo.productionCapacityUnit || 'pcs/month'}` : undefined,
        tradeKeywords: tradeKeywords.length > 0 ? JSON.stringify(tradeKeywords) : undefined,
        targetMarkets: targetMarkets.length > 0 ? JSON.stringify(targetMarkets) : undefined,
        exportExperience: formData.exportExperience || undefined,
      };

      // Submit to API
      const response = await api.post<{ data: { id: number } }>('/products', productData);

      if (response.success) {
        setSaveSuccess(true);
        setIsSaving(false);
        setTimeout(() => {
          router.push('/products');
        }, 1500);
      } else {
        throw new Error(response.error?.message || '保存失败');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError(err instanceof Error ? err.message : '保存失败，请重试');
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            返回
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-[#0A1628]">添加产品</h1>
            <p className="text-gray-600">创建新产品</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}

        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <span>保存成功！</span>
            <button onClick={() => setSaveSuccess(false)} className="ml-auto text-green-500 hover:text-green-700">×</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU *
                      </label>
                      <Input
                        name="sku"
                        required
                        placeholder="例如: BS-200"
                        value={formData.sku}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        分类 *
                      </label>
                      <select
                        name="categoryId"
                        required
                        className="h-10 w-full px-3 border border-gray-200 rounded-md"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        disabled={loadingCategories}
                      >
                        <option value="">选择分类</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.nameZh || cat.nameEn} ({cat.nameEn})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      产品名称 (英文) *
                    </label>
                    <Input
                      name="nameEn"
                      required
                      placeholder="Enter product name"
                      value={formData.nameEn}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      产品名称 (中文)
                    </label>
                    <Input
                      name="nameZh"
                      placeholder="输入产品名称"
                      value={formData.nameZh}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Slug *
                    </label>
                    <Input
                      name="slug"
                      required
                      placeholder="product-url-slug"
                      value={formData.slug}
                      onChange={handleSlugChange}
                    />
                    <p className="text-xs text-gray-400 mt-1">自动从英文名生成，可手动修改</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      短描述 (英文)
                    </label>
                    <Input
                      name="shortDescEn"
                      placeholder="Brief description"
                      value={formData.shortDescEn}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      短描述 (中文)
                    </label>
                    <Input
                      name="shortDescZh"
                      placeholder="简短描述"
                      value={formData.shortDescZh}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      详细描述 (英文)
                    </label>
                    <Textarea
                      name="descriptionEn"
                      rows={6}
                      placeholder="Full product description"
                      value={formData.descriptionEn}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      详细描述 (中文)
                    </label>
                    <Textarea
                      name="descriptionZh"
                      rows={6}
                      placeholder="完整产品描述"
                      value={formData.descriptionZh}
                      onChange={handleInputChange}
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
                  <CardTitle>价格与交期</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最低价
                      </label>
                      <Input
                        name="priceMin"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.priceMin}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最高价
                      </label>
                      <Input
                        name="priceMax"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={formData.priceMax}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最小起订量
                      </label>
                      <Input
                        name="moq"
                        type="number"
                        placeholder="100"
                        value={formData.moq}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      交期
                    </label>
                    <Input
                      name="leadTime"
                      placeholder="15-20 days"
                      value={formData.leadTime}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>B2B 核心卖点</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductCoreSellingPoints points={sellingPoints} onChange={setSellingPoints} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>B2B 贸易关键词</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-stone-gray">Add keywords to improve B2B search visibility (press Enter to add)</p>
                  <div className="flex flex-wrap gap-2 min-h-[44px] p-3 border border-border-warm rounded-lg bg-warm-sand/20">
                    {tradeKeywords.map((keyword, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-terracotta/10 text-terracotta rounded-full text-sm">
                        {keyword}
                        <button
                          type="button"
                          onClick={() => setTradeKeywords(prev => prev.filter((_, i) => i !== idx))}
                          className="hover:text-terracotta/70"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add keyword..."
                      className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-stone-gray"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (!tradeKeywords.includes(val)) {
                            setTradeKeywords(prev => [...prev, val]);
                          }
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>B2B 目标市场</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-stone-gray">Select countries where the product is popular</p>
                  <div className="flex flex-wrap gap-2 min-h-[44px] p-3 border border-border-warm rounded-lg bg-warm-sand/20">
                    {targetMarkets.map((market, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-3 py-1.5 bg-olive-gray/10 text-olive-gray rounded-full text-sm">
                        {market}
                        <button
                          type="button"
                          onClick={() => setTargetMarkets(prev => prev.filter((_, i) => i !== idx))}
                          className="hover:text-olive-gray/70"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add market..."
                      className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-stone-gray"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          e.preventDefault();
                          const val = e.currentTarget.value.trim();
                          if (!targetMarkets.includes(val)) {
                            setTargetMarkets(prev => [...prev, val]);
                          }
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>B2B 出口经验</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-charcoal-warm mb-2">
                        Export Years (出口年限)
                      </label>
                      <select
                        name="exportExperience"
                        className="h-10 w-full px-3 border border-border-warm rounded-md text-sm bg-white focus:border-olive-gray focus:ring-1 focus:ring-olive-gray"
                        value={formData.exportExperience}
                        onChange={handleInputChange}
                      >
                        <option value="">Select years</option>
                        <option value="0-1 years">0-1 years</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="5-10 years">5-10 years</option>
                        <option value="10+ years">10+ years</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>B2B 应用场景</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Application Scenarios (English)
                    </label>
                    <Textarea
                      name="applicationScenariosEn"
                      rows={4}
                      placeholder="Describe where and how the product is used..."
                      value={formData.applicationScenariosEn}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      应用场景 (中文)
                    </label>
                    <Textarea
                      name="applicationScenariosZh"
                      rows={4}
                      placeholder="描述产品使用场景..."
                      value={formData.applicationScenariosZh}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>B2B 认证</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductCertifications certifications={certifications} onChange={setCertifications} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>B2B FAQ</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductFAQ faqs={faqs} onChange={setFaqs} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SEO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO标题 (英文)
                      </label>
                      <Input
                        name="seoTitleEn"
                        placeholder="SEO title for search engines"
                        value={formData.seoTitleEn}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO标题 (中文)
                      </label>
                      <Input
                        name="seoTitleZh"
                        placeholder="搜索引擎优化标题"
                        value={formData.seoTitleZh}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO描述 (英文)
                    </label>
                    <Textarea
                      name="seoDescEn"
                      rows={3}
                      placeholder="Meta description for search engines"
                      value={formData.seoDescEn}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO描述 (中文)
                    </label>
                    <Textarea
                      name="seoDescZh"
                      rows={3}
                      placeholder="搜索引擎元描述"
                      value={formData.seoDescZh}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO关键词 (英文)
                      </label>
                      <Input
                        name="seoKeywordsEn"
                        placeholder="comma, separated, keywords"
                        value={formData.seoKeywordsEn}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SEO关键词 (中文)
                      </label>
                      <Input
                        name="seoKeywordsZh"
                        placeholder="关键词，用逗号分隔"
                        value={formData.seoKeywordsZh}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>状态</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
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
                      name="isFeatured"
                      checked={formData.isFeatured}
                      onChange={handleInputChange}
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
                      name="order"
                      type="number"
                      placeholder="0"
                      value={formData.order}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>产品图库 (1-5张) *</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    type="image"
                    accept="image/*"
                    multiple
                    maxFiles={5}
                    files={mainImages}
                    onChange={setMainImages}
                    showMainImageToggle
                    label="主图"
                    hint="白色背景正面图，1200×1200px，JPG/WebP，≤500KB/张，第一张为封面"
                    uploadType="product-image"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>详情图 (0-8张)</CardTitle>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    type="image"
                    accept="image/*"
                    multiple
                    maxFiles={8}
                    files={detailImages}
                    onChange={setDetailImages}
                    label="详情图"
                    hint="产品详情页图库图片，场景图/细节图，1600×1200px，JPG/WebP，≤800KB/张"
                    uploadType="product-image"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>B2B 贸易信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductTradeInfo
                    formData={tradeInfo}
                    onChange={setTradeInfo}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>B2B 包装信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Packaging Info (English)
                    </label>
                    <Textarea
                      name="packagingInfoEn"
                      rows={3}
                      placeholder="e.g. 10 pcs/carton, 42x38x28 cm, G.W. 12kg"
                      value={formData.packagingInfoEn}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      包装信息 (中文)
                    </label>
                    <Textarea
                      name="packagingInfoZh"
                      rows={3}
                      placeholder="例如：10个/箱，42x38x28厘米，毛重12公斤"
                      value={formData.packagingInfoZh}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>B2B 工厂信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProductFactoryInfo
                    formData={factoryInfo}
                    onChange={setFactoryInfo}
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
                    maxFiles={1}
                    files={videos}
                    onChange={setVideos}
                    label="视频"
                    hint="MP4格式，最大100MB，时长30-60秒"
                    uploadType="product-video"
                  />
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.back()}
                  disabled={isSaving}
                >
                  取消
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-accent hover:bg-accent/90"
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? '保存中...' : '保存产品'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
