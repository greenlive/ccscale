'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search, Eye } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';

const products = [
  {
    id: 1,
    sku: 'BS-200',
    name: '数字人体秤 BS-200',
    category: '人体秤',
    priceMin: 15,
    priceMax: 25,
    isActive: true,
    isFeatured: true,
  },
  {
    id: 2,
    sku: 'HS-500',
    name: '工业吊秤 HS-500',
    category: '吊秤',
    priceMin: 45,
    priceMax: 85,
    isActive: true,
    isFeatured: true,
  },
  {
    id: 3,
    sku: 'KS-300',
    name: '精密厨房秤 KS-300',
    category: '厨房秤',
    priceMin: 12,
    priceMax: 20,
    isActive: true,
    isFeatured: false,
  },
  {
    id: 4,
    sku: 'BS-100',
    name: '智能体脂秤',
    category: '人体秤',
    priceMin: 25,
    priceMax: 45,
    isActive: false,
    isFeatured: false,
  },
];

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1628]">产品管理</h1>
            <p className="text-gray-600">管理您的产品目录</p>
          </div>
          <Button asChild className="bg-accent hover:bg-accent/90">
            <Link href="/products/new">
              <Plus className="mr-2 h-4 w-4" />
              添加产品
            </Link>
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="p-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">SKU</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">产品</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">分类</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">价格区间</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">状态</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4 font-mono text-sm text-gray-600">{product.sku}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <span className="font-medium text-[#0A1628]">{product.name}</span>
                          {product.isFeatured && (
                            <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded">
                              推荐
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{product.category}</td>
                      <td className="py-4 px-4 text-gray-600">${product.priceMin} - ${product.priceMax}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            product.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
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
                          <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
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
      </div>
    </AdminLayout>
  );
}
