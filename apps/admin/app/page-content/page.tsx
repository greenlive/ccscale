'use client';

import { useState, useEffect } from 'react';
import { Save, FileText, Globe, Users, Settings } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { Textarea } from '@cc-scale/ui';
import { ImageUploadField } from '@/components/ImageUploadField';
import { api } from '@/lib/apiClient';

interface PageContent {
  id: number;
  pageKey: string;
  titleEn: string;
  titleZh: string;
  contentEn?: string;
  contentZh?: string;
  metaEn?: string;
  metaZh?: string;
  updatedAt: string;
}

interface PageConfig {
  key: string;
  labelEn: string;
  labelZh: string;
  icon: any;
  description: string;
  descriptionZh: string;
}

const PAGES: PageConfig[] = [
  {
    key: 'about',
    labelEn: 'About Us',
    labelZh: '关于我们',
    icon: Users,
    description: 'Company story, milestones, and values',
    descriptionZh: '公司故事、发展历程和价值观',
  },
  {
    key: 'guarantee',
    labelEn: 'Guarantees',
    labelZh: '保障中心',
    icon: Settings,
    description: 'Quality assurance and delivery guarantees',
    descriptionZh: '质量保证和交付保障',
  },
  {
    key: 'contact',
    labelEn: 'Contact Us',
    labelZh: '联系我们',
    icon: Globe,
    description: 'Contact information and office hours',
    descriptionZh: '联系信息和工作时间',
  },
];

export default function PageContentPage() {
  const [activePage, setActivePage] = useState<string>('about');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [pageData, setPageData] = useState<PageContent | null>(null);
  const [formData, setFormData] = useState({
    titleEn: '',
    titleZh: '',
    contentEn: '',
    contentZh: '',
    metaEn: '',
    metaZh: '',
  });
  const [storyEn, setStoryEn] = useState('');
  const [storyZh, setStoryZh] = useState('');

  interface Thumbnail { src: string; altEn: string; altZh: string; }
  interface AboutMedia {
    storyImage: string; videoCover: string; videoUrl: string;
    videoTitleEn: string; videoTitleZh: string;
    videoDurationEn: string; videoDurationZh: string;
    sectionTitleEn: string; sectionTitleZh: string;
    sectionSubtitleEn: string; sectionSubtitleZh: string;
    thumbnails: Thumbnail[];
  }
  const defaultMedia: AboutMedia = {
    storyImage: '', videoCover: '', videoUrl: '',
    videoTitleEn: '', videoTitleZh: '',
    videoDurationEn: '', videoDurationZh: '',
    sectionTitleEn: '', sectionTitleZh: '',
    sectionSubtitleEn: '', sectionSubtitleZh: '',
    thumbnails: Array.from({ length: 4 }, () => ({ src: '', altEn: '', altZh: '' })),
  };
  const [media, setMedia] = useState<AboutMedia>(defaultMedia);

  useEffect(() => {
    fetchPageContent(activePage);
  }, [activePage]);

  useEffect(() => { document.title = 'CC Scale 管理后台 - 页面内容管理'; }, []);

  const fetchPageContent = async (pageKey: string) => {
    setLoading(true);
    try {
      const result = await api.get<PageContent>(`/page-content/${pageKey}`);
      if (result.success && result.data) {
        setPageData(result.data);
        setFormData({
          titleEn: result.data.titleEn || '',
          titleZh: result.data.titleZh || '',
          contentEn: result.data.contentEn || '',
          contentZh: result.data.contentZh || '',
          metaEn: result.data.metaEn || '',
          metaZh: result.data.metaZh || '',
        });
        // Extract story paragraphs from JSON content
        try {
          const parsedEn = result.data.contentEn ? JSON.parse(result.data.contentEn) : {};
          setStoryEn(parsedEn.storyParagraphs?.join('\n\n') || '');
          setMedia({
            ...defaultMedia,
            ...(parsedEn.media || {}),
          });
        } catch { setStoryEn(''); }
        try {
          const parsedZh = result.data.contentZh ? JSON.parse(result.data.contentZh) : {};
          setStoryZh(parsedZh.storyParagraphs?.join('\n\n') || '');
        } catch { setStoryZh(''); }
      } else {
        // Page doesn't exist yet, use defaults
        setPageData(null);
        const pageConfig = PAGES.find(p => p.key === pageKey);
        setFormData({
          titleEn: pageConfig?.labelEn || '',
          titleZh: pageConfig?.labelZh || '',
          contentEn: '',
          contentZh: '',
          metaEn: '',
          metaZh: '',
        });
      }
    } catch (error) {
      console.error('Failed to fetch page content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Merge story paragraphs and media into content JSON for about page
      let contentEn = formData.contentEn;
      let contentZh = formData.contentZh;
      if (activePage === 'about') {
        try {
          const parsedEn = contentEn ? JSON.parse(contentEn) : {};
          parsedEn.storyParagraphs = storyEn.split('\n\n').filter(Boolean);
          parsedEn.media = media;
          contentEn = JSON.stringify(parsedEn);
        } catch { /* keep original */ }
        try {
          const parsedZh = contentZh ? JSON.parse(contentZh) : {};
          parsedZh.storyParagraphs = storyZh.split('\n\n').filter(Boolean);
          contentZh = JSON.stringify(parsedZh);
        } catch { /* keep original */ }
      }

      const result = await api.post<PageContent>('/page-content/upsert', {
        pageKey: activePage,
        titleEn: formData.titleEn,
        titleZh: formData.titleZh,
        contentEn,
        contentZh,
        metaEn: formData.metaEn,
        metaZh: formData.metaZh,
      });

      if (result.success && result.data) {
        setPageData(result.data);
        setMessage({ type: 'success', text: 'Page content saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error?.message || 'Failed to save' });
      }
    } catch (error) {
      console.error('Failed to save page content:', error);
      setMessage({ type: 'error', text: 'Failed to save page content' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateMedia = (field: keyof AboutMedia, value: any) => {
    setMedia(prev => ({ ...prev, [field]: value }));
  };
  const updateThumbnail = (index: number, field: keyof Thumbnail, value: string) => {
    setMedia(prev => {
      const thumbnails = [...prev.thumbnails];
      thumbnails[index] = { ...thumbnails[index], [field]: value };
      return { ...prev, thumbnails };
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1628]">页面内容管理</h1>
            <p className="text-gray-600">管理网站各页面的文本内容</p>
          </div>
          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? '保存中...' : '保存内容'}
          </Button>
        </div>

        {message && (
          <div
            className={`p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800 border border-green-200'
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Page Selector */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PAGES.map((page) => {
            const Icon = page.icon;
            return (
              <Card
                key={page.key}
                className={`cursor-pointer transition-all ${
                  activePage === page.key
                    ? 'ring-2 ring-accent border-accent'
                    : 'hover:border-gray-400'
                }`}
                onClick={() => setActivePage(page.key)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${activePage === page.key ? 'bg-accent text-white' : 'bg-gray-100 text-gray-600'}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{page.labelZh}</p>
                      <p className="text-sm text-gray-500">{page.labelEn}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Content Editor */}
        {loading ? (
          <Card>
            <CardContent className="py-12">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent"></div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                编辑页面内容 - {PAGES.find(p => p.key === activePage)?.labelZh}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    页面标题 (English)
                  </label>
                  <Input
                    value={formData.titleEn}
                    onChange={(e) => handleChange('titleEn', e.target.value)}
                    placeholder="About Us"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    页面标题 (中文)
                  </label>
                  <Input
                    value={formData.titleZh}
                    onChange={(e) => handleChange('titleZh', e.target.value)}
                    placeholder="关于我们"
                  />
                </div>
              </div>

              {/* Meta/SEO Fields */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">SEO / 元信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description (English)
                    </label>
                    <Textarea
                      value={formData.metaEn}
                      onChange={(e) => handleChange('metaEn', e.target.value)}
                      rows={2}
                      placeholder="SEO meta description for English..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meta Description (中文)
                    </label>
                    <Textarea
                      value={formData.metaZh}
                      onChange={(e) => handleChange('metaZh', e.target.value)}
                      rows={2}
                      placeholder="SEO元描述..."
                    />
                  </div>
                </div>
              </div>

              {/* Content Fields */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">页面内容</h3>
                <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg mb-4">
                  关于页面：contentEn 用于存储统计数据 (JSON格式)，contentZh 用于存储里程碑数据 (JSON格式)
                  <br />
                  联系页面：contentEn 存储联系信息 (JSON格式)，包含 address、email、phone、hours 等字段
                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      内容 (English)
                    </label>
                    <Textarea
                      value={formData.contentEn}
                      onChange={(e) => handleChange('contentEn', e.target.value)}
                      rows={8}
                      placeholder='{"address": {"en": "123 Industrial Park...", "zh": "工业区123号..."}, "email": {"en": "sales@ccscale.com", "zh": "销售邮箱..."}}'
                      className="font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      内容 (中文)
                    </label>
                    <Textarea
                      value={formData.contentZh}
                      onChange={(e) => handleChange('contentZh', e.target.value)}
                      rows={8}
                      placeholder='[{"year": "2004", "titleEn": "Founded", "titleZh": "公司成立", ...}]'
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Story Editor - About page only */}
              {activePage === 'about' && (
                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">我们的故事 / Our Story</h3>
                  <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg mb-4">
                    每段之间用一个空行分隔。每段将分别显示在页面上。
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        故事内容 (English)
                      </label>
                      <Textarea
                        value={storyEn}
                        onChange={(e) => setStoryEn(e.target.value)}
                        rows={6}
                        placeholder="Paragraph 1&#10;&#10;Paragraph 2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        故事内容 (中文)
                      </label>
                      <Textarea
                        value={storyZh}
                        onChange={(e) => setStoryZh(e.target.value)}
                        rows={6}
                        placeholder="第一段&#10;&#10;第二段"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Media Editor - About page only */}
              {activePage === 'about' && (
                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">图片和视频 / Images & Video</h3>

                  {/* Story Image */}
                  <div className="mb-6">
                    <ImageUploadField
                      label="故事配图 (Story Image)"
                      value={media.storyImage}
                      onChange={(v) => updateMedia('storyImage', v)}
                      uploadType="factory-image"
                      hint="点击上传故事配图"
                    />
                  </div>

                  {/* Factory Video Section */}
                  <h4 className="font-medium text-gray-800 mb-3">工厂视频 / Factory Video</h4>
                  <div className="mb-4">
                    <ImageUploadField
                      label="视频封面 (Video Cover)"
                      value={media.videoCover}
                      onChange={(v) => updateMedia('videoCover', v)}
                      uploadType="factory-image"
                      hint="点击上传视频封面图"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">视频链接 URL</label>
                      <Input value={media.videoUrl} onChange={(e) => updateMedia('videoUrl', e.target.value)} placeholder="https://youtube.com/..." />
                      <p className="text-xs text-gray-400 mt-1">支持 YouTube / Vimeo 链接，或自托管视频 URL</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">视频标题 (EN)</label>
                      <Input value={media.videoTitleEn} onChange={(e) => updateMedia('videoTitleEn', e.target.value)} placeholder="CC Scale Factory Tour" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">视频标题 (ZH)</label>
                      <Input value={media.videoTitleZh} onChange={(e) => updateMedia('videoTitleZh', e.target.value)} placeholder="CC Scale 工厂参观" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">时长 (EN)</label>
                      <Input value={media.videoDurationEn} onChange={(e) => updateMedia('videoDurationEn', e.target.value)} placeholder="4:30 min" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">时长 (ZH)</label>
                      <Input value={media.videoDurationZh} onChange={(e) => updateMedia('videoDurationZh', e.target.value)} placeholder="4分30秒" />
                    </div>
                  </div>

                  {/* Video Section Text */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">区块标题 (EN)</label>
                      <Input value={media.sectionTitleEn} onChange={(e) => updateMedia('sectionTitleEn', e.target.value)} placeholder="Take a Tour of Our Factory" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">区块标题 (ZH)</label>
                      <Input value={media.sectionTitleZh} onChange={(e) => updateMedia('sectionTitleZh', e.target.value)} placeholder="参观我们的工厂" />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">区块副标题 (EN)</label>
                      <Textarea value={media.sectionSubtitleEn} onChange={(e) => updateMedia('sectionSubtitleEn', e.target.value)} rows={2} placeholder="See our state-of-the-art production facilities..." />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">区块副标题 (ZH)</label>
                      <Textarea value={media.sectionSubtitleZh} onChange={(e) => updateMedia('sectionSubtitleZh', e.target.value)} rows={2} placeholder="观看我们先进的生产设施..." />
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <h4 className="font-medium text-gray-800 mb-3 mt-6">缩略图 / Thumbnails</h4>
                  {media.thumbnails.map((thumb, i) => (
                    <div key={i} className="mb-6 p-4 border border-gray-100 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-3">缩略图 #{i + 1}</p>
                      <div className="space-y-3">
                        <ImageUploadField
                          label="图片"
                          value={thumb.src}
                          onChange={(v) => updateThumbnail(i, 'src', v)}
                          uploadType="factory-image"
                          hint="点击上传缩略图"
                          previewHeight="h-20"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alt 文本 (EN)</label>
                            <Input value={thumb.altEn} onChange={(e) => updateThumbnail(i, 'altEn', e.target.value)} placeholder="English alt text" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alt 文本 (ZH)</label>
                            <Input value={thumb.altZh} onChange={(e) => updateThumbnail(i, 'altZh', e.target.value)} placeholder="中文 alt 文本" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Last Updated Info */}
              {pageData?.updatedAt && (
                <div className="text-sm text-gray-500 border-t pt-4">
                  最后更新: {new Date(pageData.updatedAt).toLocaleString('zh-CN')}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}