'use client';

import { useState, useEffect } from 'react';
import { Download, FileText, File, Search, BookOpen, Smartphone, MonitorPlay, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@cc-scale/ui';
import { Input, Button } from '@cc-scale/ui';

interface DownloadItem {
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

const categories = [
  { value: 'all', labelEn: 'All Files', labelZh: '全部文件' },
  { value: 'manual', labelEn: 'User Manuals', labelZh: '用户手册' },
  { value: 'specs', labelEn: 'Specifications', labelZh: '技术规格' },
  { value: 'software', labelEn: 'Software', labelZh: '软件' },
  { value: 'catalog', labelEn: 'Catalogs', labelZh: '产品目录' },
  { value: 'cert', labelEn: 'Certificates', labelZh: '认证文件' },
  { value: 'video', labelEn: 'Videos', labelZh: '视频教程' },
];

const defaultDownloads: DownloadItem[] = [
  { id: 1, titleEn: 'Body Scale BS-200 User Manual', titleZh: '体重秤 BS-200 用户手册', fileUrl: '#', fileType: 'PDF', category: 'manual', order: 1, isActive: true, downloadCount: 0 },
  { id: 2, titleEn: 'Product Catalog 2024', titleZh: '2024年产品目录', fileUrl: '#', fileType: 'PDF', category: 'catalog', order: 2, isActive: true, downloadCount: 0 },
  { id: 3, titleEn: 'CE Certificate', titleZh: 'CE认证文件', fileUrl: '#', fileType: 'PDF', category: 'cert', order: 3, isActive: true, downloadCount: 0 },
];

interface DownloadsPageContentProps {
  locale: 'en' | 'zh';
}

export function DownloadsPageContent({ locale }: DownloadsPageContentProps) {
  const [downloads, setDownloads] = useState<DownloadItem[]>(defaultDownloads);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDownloads = async () => {
      try {
        const response = await fetch(`/api/downloads`);
        if (response.ok) {
          const data = await response.json();
          const active = data.filter((d: DownloadItem) => d.isActive);
          if (active.length > 0) setDownloads(active);
        }
      } catch {
        // use defaults
      }
    };
    fetchDownloads();
  }, []);

  const filtered = downloads.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const title = locale === 'en' ? item.titleEn : item.titleZh;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getIcon = (fileType: string) => {
    if (fileType === 'PDF') return <FileText className="h-6 w-6 text-red-500" />;
    if (fileType === 'APK') return <Smartphone className="h-6 w-6 text-green-500" />;
    if (fileType === 'MP4') return <MonitorPlay className="h-6 w-6 text-dark-surface" />;
    if (fileType === 'JPG' || fileType === 'PNG') return <ImageIcon className="h-6 w-6 text-purple-500" />;
    return <BookOpen className="h-6 w-6 text-gray-500" />;
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return '';
    const mb = bytes / (1024 * 1024);
    return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {locale === 'en' ? 'Download Center' : '下载中心'}
          </h1>
          <p className="text-xl text-warm-silver max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Download manuals, catalogs, certifications, and software'
              : '下载产品手册、目录、认证文件和软件'}
          </p>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Search & Filter */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={locale === 'en' ? 'Search files...' : '搜索文件...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedCategory(cat.value)}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors ${
                    selectedCategory === cat.value
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {locale === 'en' ? cat.labelEn : cat.labelZh}
                </button>
              ))}
            </div>
          </div>

          {/* Downloads Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{locale === 'en' ? 'No downloads found' : '暂无下载内容'}</p>
              </div>
            ) : (
              filtered.map((item) => {
                const title = locale === 'en' ? item.titleEn : item.titleZh;
                return (
                  <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">{getIcon(item.fileType)}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-primary mb-1 truncate">{title}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{item.fileType}</span>
                            {item.fileSize && (
                              <>
                                <span>•</span>
                                <span>{formatSize(item.fileSize)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full mt-4">
                          <Download className="mr-2 h-4 w-4" />
                          {locale === 'en' ? 'Download' : '下载'}
                        </Button>
                      </a>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
