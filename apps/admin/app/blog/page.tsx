'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { FileText, Plus, Edit, Trash2, Eye } from 'lucide-react';
import { api } from '@/lib/apiClient';

interface BlogPost {
  id: number;
  slug: string;
  titleEn: string;
  titleZh: string;
  isActive: boolean;
  isFeatured: boolean;
  publishedAt?: string | null;
  author?: string | null;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    document.title = 'CC Scale Admin - Blog';
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      setLoading(true);
      const res = await api.get<{ data: BlogPost[] }>('/blog');
      if (res.success && res.data) {
        const list = Array.isArray(res.data) ? res.data : res.data.data || [];
        setPosts(list);
      }
    } catch (err) {
      console.error('Failed to fetch blog posts:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = posts.filter((p) =>
    [p.titleEn, p.titleZh, p.slug].some((s) => s?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-primary" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Blog</h1>
              <p className="text-sm text-gray-500">Manage blog posts and articles</p>
            </div>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Search posts..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12 text-gray-500">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No blog posts found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-500 border-b">
                    <tr>
                      <th className="py-2 pr-4">Title</th>
                      <th className="py-2 pr-4">Slug</th>
                      <th className="py-2 pr-4">Status</th>
                      <th className="py-2 pr-4">Author</th>
                      <th className="py-2 pr-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="py-3 pr-4 font-medium">
                          {p.titleEn}
                          {p.isFeatured ? <span className="ml-2 text-xs text-amber-600">★ Featured</span> : null}
                        </td>
                        <td className="py-3 pr-4 text-gray-500">/{p.slug}</td>
                        <td className="py-3 pr-4">
                          <span className={p.isActive ? 'text-green-600' : 'text-gray-400'}>
                            {p.isActive ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-gray-500">{p.author || '—'}</td>
                        <td className="py-3 pr-4 text-right">
                          <button className="p-1 text-gray-500 hover:text-primary" aria-label="View">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-primary ml-2" aria-label="Edit">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-500 hover:text-red-600 ml-2" aria-label="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
