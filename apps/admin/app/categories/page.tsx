'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Folder, Image as ImageIcon, X, Upload } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { useAuth } from '@/providers/AuthProvider';

interface Category {
  id: number;
  nameEn: string;
  nameZh: string;
  slug: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
  products?: { id: number }[];
}

export default function CategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameZh: '',
    slug: '',
    imageUrl: '',
    order: 0,
  });

  const toSlug = (name: string) =>
    name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => { document.title = 'CC Scale 管理后台 - 分类管理'; }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`/api/products/categories`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      setError('Failed to fetch categories');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    if (!token) {
      setError('请先登录后再上传图片');
      setTimeout(() => setError(''), 5000);
      return;
    }
    setIsUploading(true);
    setError('');
    try {
      const uploadForm = new FormData();
      uploadForm.append('file', file);

      // 后端路由为 POST /api/upload/:uploadType（multipart 字段名固定为 file）
      const response = await fetch(`/api/upload/category-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: uploadForm,
       credentials: 'include'});

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, imageUrl: data.url }));
        setImagePreview(data.url);
      } else {
        let message = `上传失败 (${response.status})`;
        try {
          const errBody = await response.json();
          message = errBody.message || errBody.error || message;
        } catch {
          /* ignore */
        }
        setError(message);
        setTimeout(() => setError(''), 8000);
      }
    } catch (err) {
      setError('图片上传失败，请检查网络或 API 是否运行');
      setTimeout(() => setError(''), 8000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCategory
      ? `/api/products/categories/${editingCategory.id}`
      : `/api/products/categories`;

    try {
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nameEn: formData.nameEn,
          nameZh: formData.nameZh,
          slug: formData.slug,
          imageUrl: formData.imageUrl,
          order: formData.order,
        }),
       credentials: 'include'});

      if (response.ok) {
        setShowAddModal(false);
        setEditingCategory(null);
        resetForm();
        setSuccessMessage(editingCategory ? '分类更新成功' : '分类添加成功');
        setTimeout(() => setSuccessMessage(''), 3000);
        fetchCategories();
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || `保存失败 (${response.status})`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存失败，请重试');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nameEn: category.nameEn,
      nameZh: category.nameZh,
      slug: category.slug,
      imageUrl: category.imageUrl || '',
      order: category.order,
    });
    setImagePreview(category.imageUrl || null);
    setSlugManuallyEdited(true);
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个分类吗？')) return;
    try {
      await fetch(`/api/products/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
       credentials: 'include'});
      setSuccessMessage('分类已删除');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchCategories();
    } catch (err) {
      setError('删除失败');
      setTimeout(() => setError(''), 5000);
    }
  };

  const resetForm = () => {
    setFormData({
      nameEn: '',
      nameZh: '',
      slug: '',
      imageUrl: '',
      order: 0,
    });
    setImagePreview(null);
    setSlugManuallyEdited(false);
  };

  const openAddModal = () => {
    resetForm();
    setEditingCategory(null);
    setShowAddModal(true);
  };

  const handleNameEnChange = (value: string) => {
    setFormData(prev => ({ ...prev, nameEn: value }));
    if (!slugManuallyEdited) {
      setFormData(prev => ({ ...prev, slug: toSlug(value) }));
    }
  };

  const handleSlugChange = (value: string) => {
    setFormData(prev => ({ ...prev, slug: value }));
    setSlugManuallyEdited(true);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1628]">分类管理</h1>
            <p className="text-gray-600">管理产品分类</p>
          </div>
          <Button onClick={openAddModal} className="bg-accent hover:bg-accent/90">
            <Plus className="mr-2 h-4 w-4" />
            添加分类
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {successMessage}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              分类列表
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">排序</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">名称 (EN)</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">名称 (中文)</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Slug</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">产品数</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">状态</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 text-gray-600">{category.order}</td>
                      <td className="py-4 px-4 font-medium text-[#0A1628]">{category.nameEn}</td>
                      <td className="py-4 px-4 text-gray-600">{category.nameZh}</td>
                      <td className="py-4 px-4 text-gray-600 font-mono text-sm">{category.slug}</td>
                      <td className="py-4 px-4 text-gray-600">{category.products?.length || 0}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            category.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {category.isActive ? '启用' : '禁用'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEdit(category)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(category.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto">
            <Card className="w-full max-w-lg mx-4 my-8">
              <CardHeader>
                <CardTitle>{editingCategory ? '编辑分类' : '添加分类'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">名称 (英文) *</label>
                      <Input
                        value={formData.nameEn}
                        onChange={(e) => handleNameEnChange(e.target.value)}
                        required
                        placeholder="Body Scales"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">名称 (中文) *</label>
                      <Input
                        value={formData.nameZh}
                        onChange={(e) => setFormData(prev => ({ ...prev, nameZh: e.target.value }))}
                        required
                        placeholder="体重秤"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      required
                      placeholder="body-scales"
                      pattern="[a-z0-9-]+"
                    />
                    <p className="text-xs text-gray-400 mt-1">自动从英文名生成，可手动修改</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">分类图片</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      {imagePreview || formData.imageUrl ? (
                        <div className="relative inline-block">
                          <img
                            src={imagePreview || formData.imageUrl}
                            alt="Category"
                            className="max-h-32 mx-auto rounded"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, imageUrl: '' }));
                              setImagePreview(null);
                            }}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                            id="category-image-upload"
                            disabled={isUploading}
                          />
                          <label htmlFor="category-image-upload" className="cursor-pointer">
                            {isUploading ? (
                              <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
                            ) : (
                              <>
                                <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                                <p className="text-sm text-gray-600">点击上传图片</p>
                                <p className="text-xs text-gray-400 mt-1">PNG、JPG、WebP，最大 2MB</p>
                              </>
                            )}
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      min={0}
                    />
                    <p className="text-xs text-gray-400 mt-1">数字越小排序越靠前</p>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                      取消
                    </Button>
                    <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90">
                      {editingCategory ? '保存' : '添加'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}