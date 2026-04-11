'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, ToggleLeft, ToggleRight, Globe, Building2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { FileUpload } from '@/components/FileUpload';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface Client {
  id: number;
  nameEn: string;
  nameZh: string;
  logoUrl: string;
  website?: string;
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

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [logoFiles, setLogoFiles] = useState<UploadedFile[]>([]);
  const [formData, setFormData] = useState({
    nameEn: '',
    nameZh: '',
    logoUrl: '',
    website: '',
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch(`${API_URL}/api/clients`);
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingClient
        ? `${API_URL}/api/clients/${editingClient.id}`
        : `${API_URL}/api/clients`;
      const method = editingClient ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchClients();
        setShowModal(false);
        setEditingClient(null);
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save client:', error);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setLogoFiles([]);
    setFormData({
      nameEn: client.nameEn,
      nameZh: client.nameZh,
      logoUrl: client.logoUrl,
      website: client.website || '',
      order: client.order || 0,
      isActive: client.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('确定要删除这个合作伙伴吗？')) {
      try {
        const response = await fetch(`${API_URL}/api/clients/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchClients();
        }
      } catch (error) {
        console.error('Failed to delete client:', error);
      }
    }
  };

  const handleToggleActive = async (client: Client) => {
    try {
      const response = await fetch(`${API_URL}/api/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !client.isActive }),
      });
      if (response.ok) {
        fetchClients();
      }
    } catch (error) {
      console.error('Failed to toggle client:', error);
    }
  };

  const resetForm = () => {
    setLogoFiles([]);
    setFormData({
      nameEn: '',
      nameZh: '',
      logoUrl: '',
      website: '',
      order: 0,
      isActive: true,
    });
  };

  const filteredClients = clients.filter((c) =>
    c.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.nameZh.includes(searchQuery)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1628]">合作伙伴管理</h1>
            <p className="text-gray-600">管理客户Logo和合作伙伴</p>
          </div>
          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={() => {
              resetForm();
              setEditingClient(null);
              setShowModal(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            添加合作伙伴
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{clients.length}</p>
                  <p className="text-sm text-gray-600">全部合作伙伴</p>
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
                  <p className="text-2xl font-bold">{clients.filter(c => c.isActive).length}</p>
                  <p className="text-sm text-gray-600">已启用</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gray-100 rounded-lg">
                  <Globe className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{clients.filter(c => c.website).length}</p>
                  <p className="text-sm text-gray-600">有官网链接</p>
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
                placeholder="搜索合作伙伴名称..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Clients Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent"></div>
            <p className="mt-4 text-gray-600">加载中...</p>
          </div>
        ) : filteredClients.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无合作伙伴</h3>
              <p className="text-gray-600 mb-4">点击上方按钮添加第一个合作伙伴</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredClients.map((client) => (
              <Card key={client.id} className={!client.isActive ? 'opacity-60' : ''}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 flex items-center justify-center">
                      {client.logoUrl ? (
                        <img
                          src={client.logoUrl}
                          alt={client.nameEn}
                          className="h-16 max-w-full object-contain"
                        />
                      ) : (
                        <div className="h-16 w-full bg-gray-100 rounded flex items-center justify-center">
                          <Building2 className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => handleToggleActive(client)}
                      className={`p-1 rounded ${client.isActive ? 'text-green-600' : 'text-gray-400'}`}
                      title={client.isActive ? '已启用' : '已禁用'}
                    >
                      {client.isActive ? (
                        <ToggleRight className="h-6 w-6" />
                      ) : (
                        <ToggleLeft className="h-6 w-6" />
                      )}
                    </button>
                  </div>

                  <div className="text-center mb-3">
                    <h3 className="font-medium text-[#0A1628] text-sm truncate">
                      {client.nameEn}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{client.nameZh}</p>
                  </div>

                  {client.website && (
                    <div className="flex justify-center mb-3">
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent hover:underline flex items-center gap-1"
                      >
                        <Globe className="h-3 w-3" />
                        Visit Website
                      </a>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t">
                    <span className="text-xs text-gray-400">
                      #{client.order || client.id}
                    </span>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(client)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(client.id)}
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
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">
                {editingClient ? '编辑合作伙伴' : '添加合作伙伴'}
              </h2>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* English Fields */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">English</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Partner Name *
                  </label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    required
                    placeholder="ABC Corporation"
                  />
                </div>
              </div>

              {/* Chinese Fields */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">中文</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    合作伙伴名称 *
                  </label>
                  <Input
                    value={formData.nameZh}
                    onChange={(e) => setFormData({ ...formData, nameZh: e.target.value })}
                    required
                    placeholder="ABC公司"
                  />
                </div>
              </div>

              {/* Logo & Website */}
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Logo & Website</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logo Image / Logo图片 *
                  </label>
                  <FileUpload
                    type="image"
                    accept="image/*"
                    multiple={false}
                    maxFiles={1}
                    files={logoFiles}
                    onChange={(files) => {
                      setLogoFiles(files);
                      if (files.length > 0) {
                        setFormData({ ...formData, logoUrl: files[0].preview });
                      } else {
                        setFormData({ ...formData, logoUrl: '' });
                      }
                    }}
                    uploadType="client-logo"
                  />
                  <p className="text-xs text-gray-500 mt-1">建议: PNG透明背景, 200×80px (网页展示)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website URL
                  </label>
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
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
                    setEditingClient(null);
                    resetForm();
                  }}
                >
                  取消
                </Button>
                <Button type="submit" className="bg-accent hover:bg-accent/90">
                  {editingClient ? '保存更改' : '创建'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
