'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Star, ToggleLeft, ToggleRight, MessageSquareQuote, Globe, Image } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { FileUpload } from '@/components/FileUpload';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Testimonial {
  id: number;
  nameEn: string;
  nameZh: string;
  companyEn?: string;
  companyZh?: string;
  countryEn?: string;
  countryZh?: string;
  avatarUrl?: string;
  contentEn: string;
  contentZh: string;
  rating?: number;
  order: number;
  isActive: boolean;
  createdAt: string;
}

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
  isMain?: boolean;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [avatarFiles, setAvatarFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameZh: '',
    companyEn: '',
    companyZh: '',
    countryEn: '',
    countryZh: '',
    avatarUrl: '',
    contentEn: '',
    contentZh: '',
    rating: 5,
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${API_URL}/api/testimonials`);
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingTestimonial
        ? `${API_URL}/api/testimonials/${editingTestimonial.id}`
        : `${API_URL}/api/testimonials`;
      const method = editingTestimonial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchTestimonials();
        setShowModal(false);
        setEditingTestimonial(null);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save testimonial:', error);
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      nameEn: testimonial.nameEn,
      nameZh: testimonial.nameZh,
      companyEn: testimonial.companyEn || '',
      companyZh: testimonial.companyZh || '',
      countryEn: testimonial.countryEn || '',
      countryZh: testimonial.countryZh || '',
      avatarUrl: testimonial.avatarUrl || '',
      contentEn: testimonial.contentEn,
      contentZh: testimonial.contentZh,
      rating: testimonial.rating || 5,
      order: testimonial.order || 0,
      isActive: testimonial.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这条客户评价吗？')) {
      try {
        const response = await fetch(`${API_URL}/api/testimonials/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchTestimonials();
        }
      } catch (error) {
        console.error('Failed to delete testimonial:', error);
      }
    }
  };

  const handleToggleActive = async (testimonial: Testimonial) => {
    try {
      const response = await fetch(`${API_URL}/api/testimonials/${testimonial.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !testimonial.isActive }),
      });
      if (response.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Failed to toggle testimonial:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      nameEn: '',
      nameZh: '',
      companyEn: '',
      companyZh: '',
      countryEn: '',
      countryZh: '',
      avatarUrl: '',
      contentEn: '',
      contentZh: '',
      rating: 5,
      order: 0,
      isActive: true,
    });
  };

  const filteredTestimonials = testimonials.filter((t) =>
    t.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.nameZh.includes(searchQuery) ||
    t.companyEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.companyZh?.includes(searchQuery)
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1628]">客户心声管理</h1>
            <p className="text-gray-600">管理客户评价和推荐</p>
          </div>
          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={() => {
              resetForm();
              setEditingTestimonial(null);
              setShowModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            添加评价
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <MessageSquareQuote className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{testimonials.length}</p>
                  <p className="text-sm text-gray-600">全部评价</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <ToggleRight className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{testimonials.filter(t => t.isActive).length}</p>
                  <p className="text-sm text-gray-600">已启用</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {testimonials.length > 0
                      ? (testimonials.reduce((sum, t) => sum + (t.rating || 0), 0) / testimonials.length).toFixed(1)
                      : '0.0'}
                  </p>
                  <p className="text-sm text-gray-600">平均评分</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="搜索客户姓名、公司..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Testimonials List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquareQuote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无客户评价</h3>
              <p className="text-gray-600 mb-4">点击上方按钮添加第一条客户评价</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className={!testimonial.isActive ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {testimonial.avatarUrl ? (
                        <img
                          src={testimonial.avatarUrl}
                          alt={testimonial.nameEn}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center">
                          <span className="text-accent font-semibold text-lg">
                            {testimonial.nameEn.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-[#0A1628]">{testimonial.nameEn}</h3>
                        <p className="text-sm text-gray-600">{testimonial.nameZh}</p>
                        {testimonial.companyEn && (
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {testimonial.companyEn}
                          </p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleActive(testimonial)}
                      className={`p-1 rounded ${testimonial.isActive ? 'text-green-600' : 'text-gray-400'}`}
                      title={testimonial.isActive ? '已启用' : '已禁用'}
                    >
                      {testimonial.isActive ? (
                        <ToggleRight className="h-6 w-6" />
                      ) : (
                        <ToggleLeft className="h-6 w-6" />
                      )}
                    </button>
                  </div>

                  {testimonial.rating && (
                    <div className="mb-3">{renderStars(testimonial.rating)}</div>
                  )}

                  <p className="text-sm text-gray-700 line-clamp-3 mb-3">
                    &ldquo;{testimonial.contentEn}&rdquo;
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                    {testimonial.contentZh}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs text-gray-400">
                      #{testimonial.order || testimonial.id}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(testimonial)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(testimonial.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingTestimonial ? '编辑评价' : '添加评价'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* English Fields */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">English</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name *
                    </label>
                    <Input
                      value={formData.nameEn}
                      onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                      required
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <Input
                      value={formData.companyEn}
                      onChange={(e) => setFormData({ ...formData, companyEn: e.target.value })}
                      placeholder="ABC Trading Co."
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Testimonial Content *
                  </label>
                  <textarea
                    value={formData.contentEn}
                    onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    placeholder="Great products and excellent service..."
                  />
                </div>
              </div>

              {/* Chinese Fields */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">中文</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      客户姓名 *
                    </label>
                    <Input
                      value={formData.nameZh}
                      onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                      required
                      placeholder="约翰·史密斯"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      公司名称
                    </label>
                    <Input
                      value={formData.companyZh}
                      onChange={(e) => setFormData({ ...formData, companyZh: e.target.value })}
                      placeholder="ABC贸易公司"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    评价内容 *
                  </label>
                  <textarea
                    value={formData.contentZh}
                    onChange={(e) => setFormData({ ...formData, contentZh: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    placeholder="产品非常棒，服务也很出色..."
                  />
                </div>
              </div>

              {/* Additional Fields */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">其他信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country (EN)
                    </label>
                    <Input
                      value={formData.countryEn}
                      onChange={(e) => setFormData({ ...formData, countryEn: e.target.value })}
                      placeholder="United States"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      国家 (中文)
                    </label>
                    <Input
                      value={formData.countryZh}
                      onChange={(e) => setFormData({ ...formData, countryZh: e.target.value })}
                      placeholder="美国"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Avatar / 头像
                  </label>
                  <FileUpload
                    type="image"
                    accept="image/*"
                    multiple={false}
                    maxFiles={1}
                    files={avatarFiles}
                    onChange={(files) => {
                      setAvatarFiles(files);
                      if (files.length > 0) {
                        setFormData({ ...formData, avatarUrl: files[0].preview });
                      } else {
                        setFormData({ ...formData, avatarUrl: '' });
                      }
                    }}
                    uploadType="testimonial"
                  />
                  <p className="text-xs text-gray-500 mt-1">建议: 200×200px 圆形头像</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rating (1-5)
                    </label>
                    <select
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    >
                      {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>
                          {r} Star{r !== 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Display Order
                    </label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                      min={0}
                    />
                  </div>
                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                        className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                      />
                      <span className="text-sm text-gray-700">Active / 启用</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowModal(false);
                    setEditingTestimonial(null);
                    resetForm();
                  }}
                >
                  取消
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90">
                  {editingTestimonial ? '保存更改' : '创建'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
