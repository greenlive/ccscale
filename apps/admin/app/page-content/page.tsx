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
    labelZh: '鍏充簬鎴戜滑',
    icon: Users,
    description: 'Company story, milestones, and values',
    descriptionZh: '鍏徃鏁呬簨銆佸彂灞曞巻绋嬪拰浠峰€艰',
  },
  {
    key: 'guarantee',
    labelEn: 'Guarantees',
    labelZh: '淇濋殰涓績',
    icon: Settings,
    description: 'Quality assurance and delivery guarantees',
    descriptionZh: '璐ㄩ噺淇濊瘉鍜屼氦浠樹繚闅?,
  },
  {
    key: 'contact',
    labelEn: 'Contact Us',
    labelZh: '鑱旂郴鎴戜滑',
    icon: Globe,
    description: 'Contact information and office hours',
    descriptionZh: '鑱旂郴淇℃伅鍜屽伐浣滄椂闂?,
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

  useEffect(() => { document.title = 'CC Scale 绠＄悊鍚庡彴 - 椤甸潰鍐呭绠＄悊'; }, []);

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
            <h1 className="text-3xl font-bold text-[#0A1628]">椤甸潰鍐呭绠＄悊</h1>
            <p className="text-gray-600">绠＄悊缃戠珯鍚勯〉闈㈢殑鏂囨湰鍐呭</p>
          </div>
          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? '淇濆瓨涓?..' : '淇濆瓨鍐呭'}
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
                缂栬緫椤甸潰鍐呭 - {PAGES.find(p => p.key === activePage)?.labelZh}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    椤甸潰鏍囬 (English)
                  </label>
                  <Input
                    value={formData.titleEn}
                    onChange={(e) => handleChange('titleEn', e.target.value)}
                    placeholder="About Us"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    椤甸潰鏍囬 (涓枃)
                  </label>
                  <Input
                    value={formData.titleZh}
                    onChange={(e) => handleChange('titleZh', e.target.value)}
                    placeholder="鍏充簬鎴戜滑"
                  />
                </div>
              </div>

              {/* Meta/SEO Fields */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">SEO / 鍏冧俊鎭?/h3>
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
                      Meta Description (涓枃)
                    </label>
                    <Textarea
                      value={formData.metaZh}
                      onChange={(e) => handleChange('metaZh', e.target.value)}
                      rows={2}
                      placeholder="SEO鍏冩弿杩?.."
                    />
                  </div>
                </div>
              </div>

              {/* Content Fields */}
              <div className="border-t pt-6">
                <h3 className="font-medium text-gray-900 mb-4">椤甸潰鍐呭</h3>
                <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg mb-4">
                  鍏充簬椤甸潰锛歝ontentEn 鐢ㄤ簬瀛樺偍缁熻鏁版嵁 (JSON鏍煎紡)锛宑ontentZh 鐢ㄤ簬瀛樺偍閲岀▼纰戞暟鎹?(JSON鏍煎紡)
                  <br />
                  鑱旂郴椤甸潰锛歝ontentEn 瀛樺偍鑱旂郴淇℃伅 (JSON鏍煎紡)锛屽寘鍚?address銆乪mail銆乸hone銆乭ours 绛夊瓧娈?                </p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      鍐呭 (English)
                    </label>
                    <Textarea
                      value={formData.contentEn}
                      onChange={(e) => handleChange('contentEn', e.target.value)}
                      rows={8}
                      placeholder='{"address": {"en": "123 Industrial Park...", "zh": "宸ヤ笟鍖?23鍙?.."}, "email": {"en": "sales@zzscale.com", "zh": "閿€鍞偖绠?.."}}'
                      className="font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      鍐呭 (涓枃)
                    </label>
                    <Textarea
                      value={formData.contentZh}
                      onChange={(e) => handleChange('contentZh', e.target.value)}
                      rows={8}
                      placeholder='[{"year": "2004", "titleEn": "Founded", "titleZh": "鍏徃鎴愮珛", ...}]'
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Story Editor - About page only */}
              {activePage === 'about' && (
                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">鎴戜滑鐨勬晠浜?/ Our Story</h3>
                  <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg mb-4">
                    姣忔涔嬮棿鐢ㄤ竴涓┖琛屽垎闅斻€傛瘡娈靛皢鍒嗗埆鏄剧ず鍦ㄩ〉闈笂銆?                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        鏁呬簨鍐呭 (English)
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
                        鏁呬簨鍐呭 (涓枃)
                      </label>
                      <Textarea
                        value={storyZh}
                        onChange={(e) => setStoryZh(e.target.value)}
                        rows={6}
                        placeholder="绗竴娈?#10;&#10;绗簩娈?
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Media Editor - About page only */}
              {activePage === 'about' && (
                <div className="border-t pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">鍥剧墖鍜岃棰?/ Images & Video</h3>

                  {/* Story Image */}
                  <div className="mb-6">
                    <ImageUploadField
                      label="鏁呬簨閰嶅浘 (Story Image)"
                      value={media.storyImage}
                      onChange={(v) => updateMedia('storyImage', v)}
                      uploadType="factory-image"
                      hint="鐐瑰嚮涓婁紶鏁呬簨閰嶅浘"
                    />
                  </div>

                  {/* Factory Video Section */}
                  <h4 className="font-medium text-gray-800 mb-3">宸ュ巶瑙嗛 / Factory Video</h4>
                  <div className="mb-4">
                    <ImageUploadField
                      label="瑙嗛灏侀潰 (Video Cover)"
                      value={media.videoCover}
                      onChange={(v) => updateMedia('videoCover', v)}
                      uploadType="factory-image"
                      hint="鐐瑰嚮涓婁紶瑙嗛灏侀潰鍥?
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">瑙嗛閾炬帴 URL</label>
                      <Input value={media.videoUrl} onChange={(e) => updateMedia('videoUrl', e.target.value)} placeholder="https://youtube.com/..." />
                      <p className="text-xs text-gray-400 mt-1">鏀寔 YouTube / Vimeo 閾炬帴锛屾垨鑷墭绠¤棰?URL</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">瑙嗛鏍囬 (EN)</label>
                      <Input value={media.videoTitleEn} onChange={(e) => updateMedia('videoTitleEn', e.target.value)} placeholder="CC Scale Factory Tour" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">瑙嗛鏍囬 (ZH)</label>
                      <Input value={media.videoTitleZh} onChange={(e) => updateMedia('videoTitleZh', e.target.value)} placeholder="CC Scale 宸ュ巶鍙傝" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">鏃堕暱 (EN)</label>
                      <Input value={media.videoDurationEn} onChange={(e) => updateMedia('videoDurationEn', e.target.value)} placeholder="4:30 min" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">鏃堕暱 (ZH)</label>
                      <Input value={media.videoDurationZh} onChange={(e) => updateMedia('videoDurationZh', e.target.value)} placeholder="4鍒?0绉? />
                    </div>
                  </div>

                  {/* Video Section Text */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">鍖哄潡鏍囬 (EN)</label>
                      <Input value={media.sectionTitleEn} onChange={(e) => updateMedia('sectionTitleEn', e.target.value)} placeholder="Take a Tour of Our Factory" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">鍖哄潡鏍囬 (ZH)</label>
                      <Input value={media.sectionTitleZh} onChange={(e) => updateMedia('sectionTitleZh', e.target.value)} placeholder="鍙傝鎴戜滑鐨勫伐鍘? />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">鍖哄潡鍓爣棰?(EN)</label>
                      <Textarea value={media.sectionSubtitleEn} onChange={(e) => updateMedia('sectionSubtitleEn', e.target.value)} rows={2} placeholder="See our state-of-the-art production facilities..." />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">鍖哄潡鍓爣棰?(ZH)</label>
                      <Textarea value={media.sectionSubtitleZh} onChange={(e) => updateMedia('sectionSubtitleZh', e.target.value)} rows={2} placeholder="瑙傜湅鎴戜滑鍏堣繘鐨勭敓浜ц鏂?.." />
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <h4 className="font-medium text-gray-800 mb-3 mt-6">缂╃暐鍥?/ Thumbnails</h4>
                  {media.thumbnails.map((thumb, i) => (
                    <div key={i} className="mb-6 p-4 border border-gray-100 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-3">缂╃暐鍥?#{i + 1}</p>
                      <div className="space-y-3">
                        <ImageUploadField
                          label="鍥剧墖"
                          value={thumb.src}
                          onChange={(v) => updateThumbnail(i, 'src', v)}
                          uploadType="factory-image"
                          hint="鐐瑰嚮涓婁紶缂╃暐鍥?
                          previewHeight="h-20"
                        />
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alt 鏂囨湰 (EN)</label>
                            <Input value={thumb.altEn} onChange={(e) => updateThumbnail(i, 'altEn', e.target.value)} placeholder="English alt text" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Alt 鏂囨湰 (ZH)</label>
                            <Input value={thumb.altZh} onChange={(e) => updateThumbnail(i, 'altZh', e.target.value)} placeholder="涓枃 alt 鏂囨湰" />
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
                  鏈€鍚庢洿鏂? {new Date(pageData.updatedAt).toLocaleString('zh-CN')}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}