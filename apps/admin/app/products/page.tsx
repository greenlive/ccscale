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
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-border-cream hover:bg-warm-sand/30 transition-colors">
                      <td className="py-4 px-4 font-mono text-sm text-olive-gray">{product.sku}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center">
                          <span className="font-medium text-foreground">{product.name}</span>
                          {product.isFeatured && (
                            <span className="ml-2 bg-terracotta/10 text-terracotta text-xs px-2 py-0.5 rounded-lg">
                              推荐
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-olive-gray">{product.category}</td>
                      <td className="py-4 px-4 text-olive-gray">${product.priceMin} - ${product.priceMax}</td>
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
                          <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
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