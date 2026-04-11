'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Image, Building, Users, Cog } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { FileUpload } from '@/components/FileUpload';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  isMain?: boolean;
}

interface FactoryImage {
  id: number;
  titleEn: string;
  titleZh: string;
  imageUrl: string;
  category: 'exterior' | 'production' | 'office' | 'team';
  order: number;
}

// Mock data for demo
const mockImages: FactoryImage[] = [
  {
    id: 1,
    titleEn: 'Factory Exterior',
    titleZh: '工厂外观',
    imageUrl: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=800',
    category: 'exterior',
    order: 1,
  },
  {
    id: 2,
    titleEn: 'Production Line',
    titleZh: '生产线',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800',
    category: 'production',
    order: 2,
  },
  {
    id: 3,
    titleEn: 'R&D Laboratory',
    titleZh: '研发实验室',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    category: 'production',
    order: 3,
  },
];

const categories = [
  { value: 'exterior', labelEn: 'Exterior', labelZh: '外观', icon: Building },
  { value: 'production', labelEn: 'Production', labelZh: '生产', icon: Cog },
  { value: 'office', labelEn: 'Office', labelZh: '办公', icon: Users },
];

export default function AboutPage() {
  const [images, setImages] = useState<FactoryImage[]>(mockImages);
  const [showModal, setShowModal] = useState(false);
  const [uploadFiles, setUploadFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleZh: '',
    category: 'exterior' as FactoryImage['category'],
    order: 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, would upload to API
    console.log('Submitting:', { ...formData, files: uploadFiles });
    setShowModal(false);
    setUploadFiles([]);
    setFormData({ titleEn: '', titleZh: '', category: 'exterior', order: 0 });
  };

  const handleDelete = (id: number) => {
    if (confirm('确定要删除这张图片吗？')) {
      setImages(images.filter(img => img.id !== id));
    }
  };

  const groupedImages = categories.map(cat => ({
    ...cat,
    images: images.filter(img => img.category === cat.value).sort((a, b) => a.order - b.order),
  }));

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1628]">公司简介管理</h1>
            <p className="text-gray-600">管理公司介绍图片和内容</p>
          </div>
          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={() => setShowModal(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            上传图片
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {groupedImages.map((group) => (
            <Card key={group.value}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg ${group.value === 'exterior' ? 'bg-blue-100' : group.value === 'production' ? 'bg-green-100' : 'bg-purple-100'}`}>
                    <group.icon className={`h-6 w-6 ${group.value === 'exterior' ? 'text-blue-600' : group.value === 'production' ? 'text-green-600' : 'text-purple-600'}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{group.images.length}</p>
                    <p className="text-sm text-gray-600">{group.labelZh}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Image className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{images.length}</p>
                  <p className="text-sm text-gray-600">总计图片</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Image Sections */}
        {groupedImages.map((group) => (
          <Card key={group.value}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <group.icon className="h-5 w-5" />
                {group.labelEn} / {group.labelZh}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {group.images.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Image className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>暂无图片</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {group.images.map((img) => (
                    <div key={img.id} className="relative group">
                      <div className="aspect-video rounded-lg overflow-hidden border">
                        <img
                          src={img.imageUrl}
                          alt={img.titleEn}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(img.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {img.titleEn}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">上传公司简介图片</h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image / 图片 *
                </label>
                <FileUpload
                  type="image"
                  accept="image/*"
                  multiple={false}
                  maxFiles={1}
                  files={uploadFiles}
                  onChange={setUploadFiles}
                  uploadType="factory-image"
                />
                <p className="text-xs text-gray-500 mt-1">建议: 1920×1080px (16:9), JPG/PNG, ≤10MB</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title (English) *
                  </label>
                  <Input
                    value={formData.titleEn}
                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                    required
                    placeholder="Factory Exterior"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    标题 (中文) *
                  </label>
                  <Input
                    value={formData.titleZh}
                    onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                    required
                    placeholder="工厂外观"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category / 分类 *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as FactoryImage['category'] })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.labelEn} / {cat.labelZh}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Display Order / 显示顺序
                </label>
                <Input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                  min={0}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    setUploadFiles([]);
                  }}
                >
                  取消
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90">
                  上传
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
