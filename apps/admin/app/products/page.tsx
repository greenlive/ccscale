'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { api } from '@/lib/apiClient';

interface Product {
  id: number;
  sku: string;
  nameEn: string;
  nameZh: string;
  categoryName?: string;
  priceMin: number;
  priceMax: number;
  isActive: boolean;
  isFeatured: boolean;
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    document.title = 'CC Scale 管理后台 - 产品管理';
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get<{ data: Product[] }>('/products?isActive=true');
      if (response.success && response.data) {
        const productsData = Array.isArray(response.data)
          ? response.data
          : response.data.data || [];
        setProducts(productsData);
      } else {
        console.error('Failed to fetch products:', response.error);
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (product: Product) => {
    setDeleteConfirm({ open: true, product });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.product) return;

    try {
      setDeleting(true);
      const response = await api.delete(`/products/${deleteConfirm.product.id}`);

      if (response.success) {
        // Remove from local state
        setProducts((prev) => prev.filter((p) => p.id !== deleteConfirm.product!.id));
        setDeleteConfirm({ open: false, product: null });
      } else {
        console.error('Delete failed:', response.error);
        alert(`删除失败: ${response.error?.message || '未知错误'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('删除失败，请重试');
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.nameZh.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );


  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-medium text-foreground">产品管理</h1>
            <p className="text-stone-gray">管理您的产品目录</p>
          </div>
          <Button asChild variant="accent">
            <Link href="/products/new">
              <Plus className="mr-2 h-4 w-4" />
              添加产品
            </Link>
          </Button>
        </div>

        {/* Search - Warm parchment theme */}
        <Card>
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-gray" />
              <Input
                type="text"
                placeholder="搜索产品..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Table - Warm parchment theme */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border-cream bg-warm-sand/50">
                    <th className="text-left py-3 px-4 font-medium text-stone-gray">SKU</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-gray">产品</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-gray">分类</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-gray">价格区间</th>
                    <th className="text-left py-3 px-4 font-medium text-stone-gray">状态</th>
                    <th className="text-right py-3 px-4 font-medium text-stone-gray">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-gray">
                        加载中...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-stone-gray">
                        {searchQuery ? '未找到匹配的产品' : '暂无产品'}
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-border-cream hover:bg-warm-sand/30 transition-colors"
                      >
                        <td className="py-4 px-4 font-mono text-sm text-olive-gray">{product.sku}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center">
                            <span className="font-medium text-foreground">
                              {product.nameZh || product.nameEn}
                            </span>
                            {product.isFeatured && (
                              <span className="ml-2 bg-terracotta/10 text-terracotta text-xs px-2 py-0.5 rounded-lg">
                                推荐
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-olive-gray">
                          {product.categoryName || '-'}
                        </td>
                        <td className="py-4 px-4 text-olive-gray">
                          ${product.priceMin} - ${product.priceMax}
                        </td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              product.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-warm-sand text-charcoal-warm'
                            }`}
                          >
                            {product.isActive ? '启用' : '禁用'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/products/${product.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/products/${product.id}/edit`}>
                                <Edit className="h-4 w-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteClick(product)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => !open && setDeleteConfirm({ open: false, product: null })}
        title="确认删除产品"
        description={`确定要删除产品 "${deleteConfirm.product?.nameZh || deleteConfirm.product?.nameEn}" 吗？此操作不可撤销。`}
        confirmText="删除"
        cancelText="取消"
        onConfirm={handleDeleteConfirm}
        variant="destructive"
        isLoading={deleting}
      />
    </AdminLayout>
  );
}
