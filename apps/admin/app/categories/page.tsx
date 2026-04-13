'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Folder } from 'lucide-react';
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
  descriptionEn?: string;
  descriptionZh?: string;
  order: number;
  isActive: boolean;
  products?: { id: number }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function CategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameZh: '',
    slug: '',
    descriptionEn: '',
    descriptionZh: '',
    imageUrl: '',
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => { document.title = 'CC Scale 管理后台 - 分类管理'; }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/api/products/categories`);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingCategory
      ? `${API_URL}/api/products/categories/${editingCategory.id}`
      : `${API_URL}/api/products/categories`;

    try {
      const response = await fetch(url, {
        method: editingCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddModal(false);
        setEditingCategory(null);
        resetForm();
        fetchCategories();
      }
    } catch (err) {
      setError('Failed to save category');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nameEn: category.nameEn,
      nameZh: category.nameZh,
      slug: category.slug,
      descriptionEn: category.descriptionEn || '',
      descriptionZh: category.descriptionZh || '',
      imageUrl: category.imageUrl || '',
      order: category.order,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个分类吗？')) return;
    try {
      await fetch(`${API_URL}/api/products/categories/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCategories();
    } catch (err) {
      setError('Failed to delete category');
    }
  };

  const resetForm = () => {
    setFormData({
      nameEn: '',
      nameZh: '',
      slug: '',
      descriptionEn: '',
      descriptionZh: '',
      imageUrl: '',
      order: 0,
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingCategory(null);
    setShowAddModal(true);
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
                      <label className="block text-sm font-medium text-gray-700 mb-1">名称 (英文)</label>
                      <Input
                        value={formData.nameEn}
                        onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                        required
                        placeholder="Body Scales"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">名称 (中文)</label>
                      <Input
                        value={formData.nameZh}
                        onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                        required
                        placeholder="体重秤"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                    <Input
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      placeholder="body-scales"
                      pattern="[a-z0-9-]+"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">描述 (英文)</label>
                      <Input
                        value={formData.descriptionEn}
                        onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                        placeholder="Optional description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">描述 (中文)</label>
                      <Input
                        value={formData.descriptionZh}
                        onChange={(e) => setFormData({ ...formData, descriptionZh: e.target.value })}
                        placeholder="可选描述"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">图片 URL</label>
                    <Input
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      min={0}
                    />
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