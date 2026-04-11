'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Download, FileText, File, X } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { useAuth } from '@/providers/AuthProvider';

interface Download {
  id: number;
  titleEn: string;
  titleZh: string;
  descriptionEn?: string;
  descriptionZh?: string;
  fileUrl: string;
  fileType: string;
  fileSize?: number;
  category?: string;
  order: number;
  isActive: boolean;
  downloadCount: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const FILE_CATEGORIES = [
  { value: 'manual', labelEn: 'User Manual', labelZh: '用户手册' },
  { value: 'specs', labelEn: 'Specifications', labelZh: '技术规格' },
  { value: 'software', labelEn: 'Software', labelZh: '软件' },
  { value: 'catalog', labelEn: 'Catalog', labelZh: '产品目录' },
  { value: 'cert', labelEn: 'Certificate', labelZh: '认证文件' },
  { value: 'video', labelEn: 'Video', labelZh: '视频教程' },
];

const FILE_TYPES = [
  { value: 'PDF', label: 'PDF' },
  { value: 'ZIP', label: 'ZIP' },
  { value: 'EXE', label: 'EXE' },
  { value: 'APK', label: 'APK' },
  { value: 'MP4', label: 'MP4' },
  { value: 'DOC', label: 'DOC' },
  { value: 'XLS', label: 'XLS' },
];

const fileTypeIcons: Record<string, typeof FileText> = {
  PDF: FileText,
  ZIP: File,
  EXE: File,
  APK: File,
  MP4: File,
  DOC: File,
  XLS: File,
};

export default function DownloadsPage() {
  const { token } = useAuth();
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDownload, setEditingDownload] = useState<Download | null>(null);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleZh: '',
    descriptionEn: '',
    descriptionZh: '',
    fileUrl: '',
    fileType: 'PDF',
    fileSize: 0,
    category: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const response = await fetch(`${API_URL}/api/downloads`);
      if (response.ok) {
        const data = await response.json();
        setDownloads(data);
      }
    } catch (err) {
      setError('Failed to fetch downloads');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fileUrl) {
      setError('Please enter a file URL');
      return;
    }

    const url = editingDownload
      ? `${API_URL}/api/downloads/${editingDownload.id}`
      : `${API_URL}/api/downloads`;

    try {
      const response = await fetch(url, {
        method: editingDownload ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddModal(false);
        setEditingDownload(null);
        resetForm();
        fetchDownloads();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to save download');
      }
    } catch (err) {
      setError('Failed to save download');
    }
  };

  const handleEdit = (download: Download) => {
    setEditingDownload(download);
    setFormData({
      titleEn: download.titleEn,
      titleZh: download.titleZh,
      descriptionEn: download.descriptionEn || '',
      descriptionZh: download.descriptionZh || '',
      fileUrl: download.fileUrl,
      fileType: download.fileType,
      fileSize: download.fileSize || 0,
      category: download.category || '',
      order: download.order,
      isActive: download.isActive,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个下载项吗？')) return;
    try {
      await fetch(`${API_URL}/api/downloads/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchDownloads();
    } catch (err) {
      setError('Failed to delete download');
    }
  };

  const resetForm = () => {
    setFormData({
      titleEn: '',
      titleZh: '',
      descriptionEn: '',
      descriptionZh: '',
      fileUrl: '',
      fileType: 'PDF',
      fileSize: 0,
      category: '',
      order: 0,
      isActive: true,
    });
  };

  const openAddModal = () => {
    resetForm();
    setEditingDownload(null);
    setShowAddModal(true);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getCategoryLabel = (category: string) => {
    const cat = FILE_CATEGORIES.find(c => c.value === category);
    return cat ? cat.labelZh : category || '-';
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
            <h1 className="text-3xl font-bold text-[#0A1628]">下载管理</h1>
            <p className="text-gray-600">管理产品手册、软件和证书下载</p>
          </div>
          <Button onClick={openAddModal} className="bg-accent hover:bg-accent/90">
            <Plus className="mr-2 h-4 w-4" />
            添加下载项
          </Button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError('')} className="text-red-500 hover:text-red-700">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              下载列表
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">排序</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">标题</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">类型</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">分类</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">状态</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {downloads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-gray-500">
                        暂无下载项，点击上方按钮添加
                      </td>
                    </tr>
                  ) : (
                    downloads.map((download) => {
                      const Icon = fileTypeIcons[download.fileType] || File;
                      return (
                        <tr key={download.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4 text-gray-600">{download.order}</td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-gray-400" />
                              <div>
                                <p className="font-medium text-[#0A1628]">{download.titleEn}</p>
                                <p className="text-sm text-gray-500">{download.titleZh}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-600">{download.fileType}</td>
                          <td className="py-4 px-4 text-gray-600">{getCategoryLabel(download.category || '')}</td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                download.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}
                            >
                              {download.isActive ? '启用' : '禁用'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(download)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(download.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
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
                <CardTitle>{editingDownload ? '编辑下载项' : '添加下载项'}</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">文件URL *</label>
                    <Input
                      value={formData.fileUrl}
                      onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                      required
                      placeholder="https://example.com/file.pdf"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">标题 (英文) *</label>
                      <Input
                        value={formData.titleEn}
                        onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                        required
                        placeholder="Product Catalog"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">标题 (中文) *</label>
                      <Input
                        value={formData.titleZh}
                        onChange={(e) => setFormData({ ...formData, titleZh: e.target.value })}
                        required
                        placeholder="产品目录"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">文件类型</label>
                      <select
                        value={formData.fileType}
                        onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                        className="w-full h-10 px-3 border border-input rounded-md bg-background text-sm"
                      >
                        {FILE_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full h-10 px-3 border border-input rounded-md bg-background text-sm"
                      >
                        <option value="">选择分类</option>
                        {FILE_CATEGORIES.map((cat) => (
                          <option key={cat.value} value={cat.value}>{cat.labelZh}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">排序</label>
                      <Input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        min={0}
                      />
                    </div>
                    <div className="flex items-center pt-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-4 h-4 text-accent border-gray-300 rounded focus:ring-accent"
                        />
                        <span className="text-sm text-gray-700">启用</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                      取消
                    </Button>
                    <Button type="submit" className="flex-1 bg-accent hover:bg-accent/90">
                      {editingDownload ? '保存' : '添加'}
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
