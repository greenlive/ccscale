'use client';

import { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, MessageCircle, Facebook, Linkedin, Youtube, Instagram, Twitter, Image, Video, FileText, ExternalLink, Heart } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface SiteSettings {
  // Basic
  siteNameEn: string;
  siteNameZh: string;
  siteDescriptionEn: string;
  siteDescriptionZh: string;
  // Company Media
  companyLogo: string;
  companyBanner: string;
  companyVideo: string;
  companyPhotos: string;
  // Contact
  contactEmail: string;
  contactPhone: string;
  contactWhatsApp: string;
  contactAddressEn: string;
  contactAddressZh: string;
  contactWorkingHoursEn: string;
  contactWorkingHoursZh: string;
  // Social Media
  socialFacebook: string;
  socialLinkedIn: string;
  socialYouTube: string;
  socialInstagram: string;
  socialTwitter: string;
  socialAlibaba: string;
  socialMadeInChina: string;
  // Social Media Content URLs (for frontend showcase)
  socialYoutubeContentUrl: string;
  socialFacebookContentUrl: string;
  socialLinkedInContentUrl: string;
  socialInstagramContentUrl: string;
  socialTikTokContentUrl: string;
}

const TABS = [
  { id: 'basic', label: 'Basic Settings', icon: Globe },
  { id: 'company', label: 'Company Media', icon: Image },
  { id: 'contact', label: 'Contact Info', icon: Phone },
  { id: 'social', label: 'Social Media', icon: MessageCircle },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [settings, setSettings] = useState<SiteSettings>({
    siteNameEn: '',
    siteNameZh: '',
    siteDescriptionEn: '',
    siteDescriptionZh: '',
    companyLogo: '',
    companyBanner: '',
    companyVideo: '',
    companyPhotos: '',
    contactEmail: '',
    contactPhone: '',
    contactWhatsApp: '',
    contactAddressEn: '',
    contactAddressZh: '',
    contactWorkingHoursEn: '',
    contactWorkingHoursZh: '',
    socialFacebook: '',
    socialLinkedIn: '',
    socialYouTube: '',
    socialInstagram: '',
    socialTwitter: '',
    socialAlibaba: '',
    socialMadeInChina: '',
    socialYoutubeContentUrl: '',
    socialFacebookContentUrl: '',
    socialLinkedInContentUrl: '',
    socialInstagramContentUrl: '',
    socialTikTokContentUrl: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => { document.title = 'CC Scale 管理后台 - 系统设置'; }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/site-settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      const settingsArray = Object.entries(settings).map(([key, value]) => ({
        key,
        value: String(value),
      }));

      const response = await fetch(`${API_URL}/api/site-settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsArray),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: 'Failed to save settings' });
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: keyof SiteSettings, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1628]">系统设置</h1>
            <p className="text-gray-600">管理网站配置</p>
          </div>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-accent border-t-transparent"></div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#0A1628]">系统设置</h1>
            <p className="text-gray-600">管理网站配置</p>
          </div>
          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? '保存中...' : '保存设置'}
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

        {/* Tabs */}
        <div className="border-b">
          <nav className="flex gap-4 overflow-x-auto">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-accent text-accent'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Basic Settings */}
        {activeTab === 'basic' && (
          <Card>
            <CardHeader>
              <CardTitle>Basic Settings / 基本设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">English</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Name
                  </label>
                  <Input
                    value={settings.siteNameEn}
                    onChange={(e) => handleChange('siteNameEn', e.target.value)}
                    placeholder="CC Scale"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Site Description
                  </label>
                  <textarea
                    value={settings.siteDescriptionEn}
                    onChange={(e) => handleChange('siteDescriptionEn', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    placeholder="Professional weighing scales manufacturer..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">中文</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    网站名称
                  </label>
                  <Input
                    value={settings.siteNameZh}
                    onChange={(e) => handleChange('siteNameZh', e.target.value)}
                    placeholder="CC衡器"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    网站描述
                  </label>
                  <textarea
                    value={settings.siteDescriptionZh}
                    onChange={(e) => handleChange('siteDescriptionZh', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    placeholder="专业衡器制造商..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Company Media */}
        {activeTab === 'company' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Company Logo & Banner / 公司Logo和横幅</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Company Logo URL
                  </label>
                  <Input
                    value={settings.companyLogo}
                    onChange={(e) => handleChange('companyLogo', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                  {settings.companyLogo && (
                    <div className="mt-2">
                      <img
                        src={settings.companyLogo}
                        alt="Company Logo Preview"
                        className="h-16 max-w-full object-contain border rounded p-2 bg-white"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Company Banner URL (Homepage Hero)
                  </label>
                  <Input
                    value={settings.companyBanner}
                    onChange={(e) => handleChange('companyBanner', e.target.value)}
                    placeholder="https://example.com/banner.jpg"
                  />
                  {settings.companyBanner && (
                    <div className="mt-2">
                      <img
                        src={settings.companyBanner}
                        alt="Company Banner Preview"
                        className="h-32 max-w-full object-cover border rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Video / 公司介绍视频</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Video className="h-4 w-4" />
                    Video URL (YouTube/Vimeo)
                  </label>
                  <Input
                    value={settings.companyVideo}
                    onChange={(e) => handleChange('companyVideo', e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Supports YouTube or Vimeo video links
                  </p>
                  {settings.companyVideo && (
                    <div className="mt-2 p-4 bg-gray-100 rounded-lg">
                      <p className="text-sm text-gray-600 mb-2">Video Preview:</p>
                      <a
                        href={settings.companyVideo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline flex items-center gap-1"
                      >
                        <Video className="h-4 w-4" />
                        Open Video
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Photos / 公司图片 (Multiple URLs)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Photo URLs (one per line)
                  </label>
                  <textarea
                    value={settings.companyPhotos}
                    onChange={(e) => handleChange('companyPhotos', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg&#10;https://example.com/photo3.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter one image URL per line. These will be displayed in a gallery.
                  </p>
                </div>
                {settings.companyPhotos && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {settings.companyPhotos.split('\n').filter(url => url.trim()).map((url, index) => (
                      <div key={index} className="border rounded p-2 bg-gray-50">
                        <img
                          src={url.trim()}
                          alt={`Company photo ${index + 1}`}
                          className="h-24 w-full object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder.png';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Contact Info */}
        {activeTab === 'contact' && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Information / 联系方式</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </label>
                  <Input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => handleChange('contactEmail', e.target.value)}
                    placeholder="sales@ccscale.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone
                  </label>
                  <Input
                    value={settings.contactPhone}
                    onChange={(e) => handleChange('contactPhone', e.target.value)}
                    placeholder="+86 123 4567 8900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    WhatsApp
                  </label>
                  <Input
                    value={settings.contactWhatsApp}
                    onChange={(e) => handleChange('contactWhatsApp', e.target.value)}
                    placeholder="+86 123 4567 8900"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Address / 地址</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address (English)
                  </label>
                  <Input
                    value={settings.contactAddressEn}
                    onChange={(e) => handleChange('contactAddressEn', e.target.value)}
                    placeholder="123 Industrial Park, Shenzhen, China"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    地址 (中文)
                  </label>
                  <Input
                    value={settings.contactAddressZh}
                    onChange={(e) => handleChange('contactAddressZh', e.target.value)}
                    placeholder="深圳市工业区123号"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Working Hours / 工作时间</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Working Hours (English)
                  </label>
                  <Input
                    value={settings.contactWorkingHoursEn}
                    onChange={(e) => handleChange('contactWorkingHoursEn', e.target.value)}
                    placeholder="Mon-Fri 9:00-18:00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    工作时间 (中文)
                  </label>
                  <Input
                    value={settings.contactWorkingHoursZh}
                    onChange={(e) => handleChange('contactWorkingHoursZh', e.target.value)}
                    placeholder="周一至周五 9:00-18:00"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Social Media */}
        {activeTab === 'social' && (
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links / 社交媒体链接</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Facebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </label>
                  <Input
                    value={settings.socialFacebook}
                    onChange={(e) => handleChange('socialFacebook', e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Linkedin className="h-4 w-4 text-blue-700" />
                    LinkedIn
                  </label>
                  <Input
                    value={settings.socialLinkedIn}
                    onChange={(e) => handleChange('socialLinkedIn', e.target.value)}
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Youtube className="h-4 w-4 text-red-600" />
                    YouTube
                  </label>
                  <Input
                    value={settings.socialYouTube}
                    onChange={(e) => handleChange('socialYouTube', e.target.value)}
                    placeholder="https://youtube.com/@yourchannel"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Instagram className="h-4 w-4 text-pink-600" />
                    Instagram
                  </label>
                  <Input
                    value={settings.socialInstagram}
                    onChange={(e) => handleChange('socialInstagram', e.target.value)}
                    placeholder="https://instagram.com/yourprofile"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                    <Twitter className="h-4 w-4 text-sky-500" />
                    Twitter / X
                  </label>
                  <Input
                    value={settings.socialTwitter}
                    onChange={(e) => handleChange('socialTwitter', e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="font-medium text-gray-900">B2B Platforms / B2B平台</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alibaba Store
                    </label>
                    <Input
                      value={settings.socialAlibaba}
                      onChange={(e) => handleChange('socialAlibaba', e.target.value)}
                      placeholder="https://yourcompany.alibaba.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Made-in-China
                    </label>
                    <Input
                      value={settings.socialMadeInChina}
                      onChange={(e) => handleChange('socialMadeInChina', e.target.value)}
                      placeholder="https://yourcompany.en.made-in-china.com"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Content Showcase Section */}
              <div className="border-t pt-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="h-5 w-5 text-red-500" />
                  <h3 className="font-medium text-gray-900">Social Media Content Showcase / 社交媒体内容展示</h3>
                </div>
                <p className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                  Add curated content URLs to showcase on the homepage. Only platforms with content URLs configured will be displayed. Leave empty to hide.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Youtube className="h-4 w-4 text-red-600" />
                      YouTube Content URL
                    </label>
                    <Input
                      value={settings.socialYoutubeContentUrl}
                      onChange={(e) => handleChange('socialYoutubeContentUrl', e.target.value)}
                      placeholder="https://youtube.com/@yourchannel"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Channel, playlist, or video URL
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Facebook className="h-4 w-4 text-blue-600" />
                      Facebook Content URL
                    </label>
                    <Input
                      value={settings.socialFacebookContentUrl}
                      onChange={(e) => handleChange('socialFacebookContentUrl', e.target.value)}
                      placeholder="https://facebook.com/yourpage"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Page, post, or video URL
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-700" />
                      LinkedIn Content URL
                    </label>
                    <Input
                      value={settings.socialLinkedInContentUrl}
                      onChange={(e) => handleChange('socialLinkedInContentUrl', e.target.value)}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Company page or post URL
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <Instagram className="h-4 w-4 text-pink-600" />
                      Instagram Content URL
                    </label>
                    <Input
                      value={settings.socialInstagramContentUrl}
                      onChange={(e) => handleChange('socialInstagramContentUrl', e.target.value)}
                      placeholder="https://instagram.com/yourprofile"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Profile or post URL
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-gray-800" />
                      TikTok Content URL
                    </label>
                    <Input
                      value={settings.socialTikTokContentUrl}
                      onChange={(e) => handleChange('socialTikTokContentUrl', e.target.value)}
                      placeholder="https://tiktok.com/@yourprofile"
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Profile or video URL
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
