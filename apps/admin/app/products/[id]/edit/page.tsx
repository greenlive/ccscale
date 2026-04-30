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
  isServerUrl?: boolean;
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

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const productId = parseInt(params.id);

  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
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
  });
  const [factoryInfo, setFactoryInfo] = useState({
    manufacturerName: '',
    factoryLocation: '',
    productionCapacity: '',
  });

  const [formData, setFormData] = useState({
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
    packagingInfoEn: '',
    packagingInfoZh: '',
  });

  useEffect(() => {
    document.title = 'CC Scale 管理后台 - 编辑产品';
    fetchProduct();
    fetchCategories();
  }, [productId]);

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

  const fetchProduct = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<{ data: any }>(`/products/${productId}`);
      if (response.success && response.data) {
        const product = response.data.data || response.data;

        setFormData({
          sku: product.sku || '',
          categoryId: product.categoryId?.toString() || '',
          nameEn: product.nameEn || '',
          nameZh: product.nameZh || '',
          slug: product.slug || '',
          shortDescEn: product.shortDescEn || '',
          shortDescZh: product.shortDescZh || '',
          descriptionEn: product.descriptionEn || '',
          descriptionZh: product.descriptionZh || '',
          priceMin: product.priceMin?.toString() || '',
          priceMax: product.priceMax?.toString() || '',
          moq: product.moq?.toString() || '',
          leadTime: product.leadTime || '',
          seoTitleEn: product.seoTitleEn || '',
          seoTitleZh: product.seoTitleZh || '',
          seoDescEn: product.seoDescEn || '',
          seoDescZh: product.seoDescZh || '',
          seoKeywordsEn: product.seoKeywordsEn || '',
          seoKeywordsZh: product.seoKeywordsZh || '',
          isActive: product.isActive ?? true,
          isFeatured: product.isFeatured ?? false,
          order: product.order?.toString() || '0',
          applicationScenariosEn: product.applicationScenariosEn || '',
          applicationScenariosZh: product.applicationScenariosZh || '',
          packagingInfoEn: product.packagingInfoEn || '',
          packagingInfoZh: product.packagingInfoZh || '',
        });

        // Load B2B certifications
        if (product.certifications) {
          try {
            setCertifications(JSON.parse(product.certifications));
          } catch {
            setCertifications([]);
          }
        }

        // Load B2B FAQs
        if (product.faqEn) {
          try {
            const faqEnData = JSON.parse(product.faqEn);
            setFaqs(faqEnData.map((f: any, idx: number) => ({
              id: `faq-${idx}`,
              questionEn: f.q || '',
              questionZh: f.a || '',
              answerEn: f.a || '',
              answerZh: '',
            })));
          } catch {
            setFaqs([]);
          }
        }

        // Load B2B selling points
        if (product.coreSellingPointsEn) {
          try {
            const pointsEn = JSON.parse(product.coreSellingPointsEn);
            const pointsZh = product.coreSellingPointsZh ? JSON.parse(product.coreSellingPointsZh) : [];
            setSellingPoints(pointsEn.map((p: string, idx: number) => ({
              id: `point-${idx}`,
              pointEn: p,
              pointZh: pointsZh[idx] || '',
            })));
          } catch {
            setSellingPoints([]);
          }
        }

        // Load B2B trade info
        setTradeInfo({
          hsCode: product.hsCode || '',
          paymentTerms: product.paymentTerms || '',
          shippingTerms: product.shippingTerms || '',
          warrantyInfo: product.warrantyInfo || '',
        });

        // Load B2B factory info
        setFactoryInfo({
          manufacturerName: product.manufacturerName || '',
          factoryLocation: product.factoryLocation || '',
          productionCapacity: product.productionCapacity || '',
        });

        // Load existing images - separate main image from detail images
        const mainImgs: UploadedFile[] = [];
        const detailImgs: UploadedFile[] = [];

        // First, add mainImage as the main image
        if (product.mainImage) {
          mainImgs.push({
            id: `main-${Date.now()}`,
            file: new File([], product.mainImage, { type: 'image/jpeg' }),
            preview: product.mainImage,
            type: 'image',
            isMain: true,
            uploadedUrl: product.mainImage,
            isServerUrl: true,
          });
        }

        // Then add images from the images array (excluding the mainImage URL)
        if (product.images && Array.isArray(product.images)) {
          product.images.forEach((img: any, idx: number) => {
            if (img.imageUrl && img.imageUrl !== product.mainImage) {
              detailImgs.push({
                id: `detail-${Date.now()}-${idx}`,
                file: new File([], img.imageUrl, { type: 'image/jpeg' }),
                preview: img.imageUrl,
                type: 'image',
                isMain: false,
                uploadedUrl: img.imageUrl,
                isServerUrl: true,
              });
            }
          });
        }

        setMainImages(mainImgs);
        setDetailImages(detailImgs);

        // Load existing videos
        if (product.videoUrl) {
          setVideos([{
            id: 'video-0',
            file: new File([], product.videoUrl, { type: 'video/mp4' }),
            preview: product.videoUrl,
            type: 'video' as const,
            uploadedUrl: product.videoUrl,
          }]);
        }

        // Load specs
        if (product.specs && Array.isArray(product.specs)) {
          setSpecs(product.specs.map((spec: any, idx: number) => ({
            id: `spec-${idx}`,
            keyEn: spec.labelEn || spec.keyEn || '',
            keyZh: spec.labelZh || spec.keyZh || '',
            valueEn: spec.valueEn || spec.value || '',
            valueZh: spec.valueZh || spec.value || '',
            order: spec.order ?? idx,
          })));
        }
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('加载产品数据失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const uploadFiles = async (files: UploadedFile[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (file.uploadedUrl) {
        uploadedUrls.push(file.uploadedUrl);
      } else if (file.file && file.file.size > 0) {
        const uploadType = file.type === 'image' ? 'product-image' : 'product-video';
        try {
          const result = await api.upload<{ url: string }>(
            `/upload/${uploadType}`,
            file.file,
            uploadType
          );
          if (result.success && result.data) {
            const url = (result.data as any).url || result.data;
            uploadedUrls.push(url);
          }
        } catch (err) {
          console.error('Upload failed for file:', file.file.name, err);
        }
      }
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaveSuccess(false);
    setIsSaving(true);

    try {
      // Simple validation
      if (!formData.sku.trim() || !formData.nameEn.trim() || !formData.categoryId) {
        throw new Error('请填写必填项');
      }

      // Upload files
      const uploadedMainImageUrls = await uploadFiles(mainImages);
      const uploadedDetailImageUrls = await uploadFiles(detailImages);
      const uploadedVideoUrls = await uploadFiles(videos);

      // Combine images (without type field to avoid enum validation issues)
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

      // Product data
      const productData = {
        sku: formData.sku.trim(),
        categoryId: parseInt(formData.categoryId),
        nameEn: formData.nameEn.trim(),
        nameZh: formData.nameZh.trim() || formData.nameEn.trim(),
        slug: formData.slug.trim() || formData.nameEn.toLowerCase().replace(/\s+/g, '-'),
        shortDescEn: formData.shortDescEn.trim(),
        shortDescZh: formData.shortDescZh.trim(),
        descriptionEn: formData.descriptionEn.trim(),
        descriptionZh: formData.descriptionZh.trim(),
        priceMin: formData.priceMin ? parseFloat(formData.priceMin) : undefined,
        priceMax: formData.priceMax ? parseFloat(formData.priceMax) : undefined,
        moq: formData.moq ? parseInt(formData.moq) : undefined,
        leadTime: formData.leadTime.trim() || undefined,
        seoTitleEn: formData.seoTitleEn.trim(),
        seoTitleZh: formData.seoTitleZh.trim(),
        seoDescEn: formData.seoDescEn.trim(),
        seoDescZh: formData.seoDescZh.trim(),
        seoKeywordsEn: formData.seoKeywordsEn.trim(),
        seoKeywordsZh: formData.seoKeywordsZh.trim(),
        isActive: formData.isActive,
        isFeatured: formData.isFeatured,
        order: parseInt(formData.order) || 0,
        mainImage: uploadedMainImageUrls[0],
        videoUrl: uploadedVideoUrls[0],
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
        paymentTerms: tradeInfo.paymentTerms.trim() || undefined,
        shippingTerms: tradeInfo.shippingTerms.trim() || undefined,
        warrantyInfo: tradeInfo.warrantyInfo.trim() || undefined,
        packagingInfoEn: formData.packagingInfoEn.trim() || undefined,
        packagingInfoZh: formData.packagingInfoZh.trim() || undefined,
        manufacturerName: factoryInfo.manufacturerName.trim() || undefined,
        factoryLocation: factoryInfo.factoryLocation.trim() || undefined,
        productionCapacity: factoryInfo.productionCapacity.trim() || undefined,
      };

      const response = await api.put(`/products/${productId}`, productData);

      if (response.success) {
        setSaveSuccess(true);
        setIsSaving(false);
        setTimeout(() => {
          router.push('/products');
        }, 1500);
      } else {
        throw new Error(response.error?.message || '保存失败');
      }
    } catch (err: any) {
      setError(err.message || '保存失败');
      setIsSaving(false);
    }
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

  if (error && !formData.nameEn) {
    return (
      <AdminLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">加载失败</h2>
          <p className="text-gray-600 mb-6">{error}</p>
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
            <p className="text-gray-600">编辑产品: {formData.nameEn || '加载中...'}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-red-500 hover:text-red-700">×</button>
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
                  <CardTitle>产品信息</CardTitle>
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
                        placeholder="e.g. BS-200"
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
                          <option key={cat.id} value={cat.id.toString()}>
                            {cat.nameEn} / {cat.nameZh}
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
                      URL别名 (Slug)
                    </label>
                    <Input
                      name="slug"
                      placeholder="product-url-slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      简短描述 (英文)
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
                      简短描述 (中文)
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
                  <CardTitle>价格与库存</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最低价格
                      </label>
                      <Input
                        name="priceMin"
                        type="number"
                        placeholder="0.00"
                        value={formData.priceMin}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最高价格
                      </label>
                      <Input
                        name="priceMax"
                        type="number"
                        placeholder="0.00"
                        value={formData.priceMax}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        最小起订量 (MOQ)
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
                  <CardTitle>SEO 优化</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 标题 (英文)
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
                      SEO 标题 (中文)
                    </label>
                    <Input
                      name="seoTitleZh"
                      placeholder="搜索引擎优化标题"
                      value={formData.seoTitleZh}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 描述 (英文)
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
                      SEO 描述 (中文)
                    </label>
                    <Textarea
                      name="seoDescZh"
                      rows={3}
                      placeholder="搜索引擎元描述"
                      value={formData.seoDescZh}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO 关键词 (英文)
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
                      SEO 关键词 (中文)
                    </label>
                    <Input
                      name="seoKeywordsZh"
                      placeholder="关键词，用逗号分隔"
                      value={formData.seoKeywordsZh}
                      onChange={handleInputChange}
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
