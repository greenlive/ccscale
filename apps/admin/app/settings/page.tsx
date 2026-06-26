'use client';

import { useState, useEffect } from 'react';
import { Save, Globe, Mail, Phone, MessageCircle, Facebook, Linkedin, Youtube, Instagram, Twitter, Image, Video, Heart, Building, Shield } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Card, CardContent, CardHeader, CardTitle } from '@cc-scale/ui';
import { api } from '@/lib/apiClient';
import { ImageUploadField } from '@/components/ImageUploadField';
import { MultiImageUpload } from '@/components/MultiImageUpload';

// Backend field mapping - frontend name -> backend key
// Only entries where frontend field name differs from backend key
const FIELD_MAPPING: Record<string, string> = {
  // Basic Settings (frontend uses user-friendly names, backend stores SEO-specific keys)
  siteNameEn: 'seoTitleEn',
  siteNameZh: 'seoTitleZh',
  siteDescriptionEn: 'seoDescriptionEn',
  siteDescriptionZh: 'seoDescriptionZh',
  // Company Info
  companyNameEn: 'companyNameEn',
  companyNameZh: 'companyNameZh',
  // Contact (frontend names match backend keys - listed for clarity)
  contactEmail: 'contactEmail',
  contactPhone: 'contactPhone',
  contactWhatsApp: 'contactWhatsApp',
  contactAddressEn: 'contactAddressEn',
  contactAddressZh: 'contactAddressZh',
  contactWorkingHoursEn: 'contactWorkingHoursEn',
  contactWorkingHoursZh: 'contactWorkingHoursZh',
  // Legal
  icpNumber: 'icpNumber',
};

// Reverse mapping for saving
const REVERSE_FIELD_MAPPING: Record<string, string> = Object.fromEntries(
  Object.entries(FIELD_MAPPING).map(([frontend, backend]) => [backend, frontend])
);

// All fields that should be saved to backend
interface SiteSettings {
  // Basic
  siteNameEn: string;
  siteNameZh: string;
  siteDescriptionEn: string;
  siteDescriptionZh: string;
  // Company Info
  companyNameEn: string;
  companyNameZh: string;
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
  // Social Media Content URLs
  socialYoutubeContentUrl: string;
  socialFacebookContentUrl: string;
  socialLinkedInContentUrl: string;
  socialInstagramContentUrl: string;
  socialTikTokContentUrl: string;
  // Legal
  icpNumber: string;
}

const TABS = [
  { id: 'basic', label: 'Basic Settings', icon: Globe },
  { id: 'company', label: 'Company Info & Media', icon: Building },
  { id: 'contact', label: 'Contact Info', icon: Phone },
  { id: 'social', label: 'Social Media', icon: MessageCircle },
  { id: 'legal', label: 'Legal', icon: Shield },
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
    companyNameEn: '',
    companyNameZh: '',
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
    icpNumber: '',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => { document.title = 'CC Scale 绠＄悊鍚庡彴 - 绯荤粺璁剧疆'; }, []);

  const fetchSettings = async () => {
    try {
      const result = await api.get<Record<string, string>>('/site-settings');
      if (result.success && result.data) {
        // Map backend keys to frontend field names
        const mappedData: Partial<SiteSettings> = {};
        Object.entries(result.data).forEach(([backendKey, value]) => {
          const frontendKey = REVERSE_FIELD_MAPPING[backendKey];
          if (frontendKey) {
            (mappedData as Record<string, string>)[frontendKey] = value;
          } else {
            // For keys not in mapping, use as-is (camelCase)
            (mappedData as Record<string, string>)[backendKey] = value;
          }
        });
        setSettings((prev) => ({ ...prev, ...mappedData }));
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
      // Convert frontend field names to backend keys for saving
      const settingsArray = Object.entries(settings).map(([frontendKey, value]) => {
        const backendKey = FIELD_MAPPING[frontendKey] || frontendKey;
        return {
          key: backendKey,
          value: String(value),
        };
      });

      const result = await api.put('/site-settings', settingsArray);

      if (result.success) {
        setMessage({ type: 'success', text: 'Settings saved successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: result.error?.message || 'Failed to save settings' });
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
            <h1 className="text-3xl font-bold text-[#0A1628]">绯荤粺璁剧疆</h1>
            <p className="text-gray-600">绠＄悊缃戠珯閰嶇疆</p>
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
            <h1 className="text-3xl font-bold text-[#0A1628]">绯荤粺璁剧疆</h1>
            <p className="text-gray-600">绠＄悊缃戠珯閰嶇疆</p>
          </div>
          <Button
            className="bg-accent hover:bg-accent/90"
            onClick={handleSave}
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? '淇濆瓨涓?..' : '淇濆瓨璁剧疆'}
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
              <CardTitle>Basic Settings / 鍩烘湰璁剧疆</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Company Name / 鍏徃鍚嶇О</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name (English)
                  </label>
                  <Input
                    value={settings.companyNameEn}
                    onChange={(e) => handleChange('companyNameEn', e.target.value)}
                    placeholder="CC Scale Co., Ltd."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    鍏徃鍚嶇О
                  </label>
                  <Input
                    value={settings.companyNameZh}
                    onChange={(e) => handleChange('companyNameZh', e.target.value)}
                    placeholder="CC琛″櫒鏈夐檺鍏徃"
                  />
                </div>
              </div>

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
                <h3 className="font-medium text-gray-900 border-b pb-2">涓枃</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    缃戠珯鍚嶇О
                  </label>
                  <Input
                    value={settings.siteNameZh}
                    onChange={(e) => handleChange('siteNameZh', e.target.value)}
                    placeholder="CC琛″櫒"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    缃戠珯鎻忚堪
                  </label>
                  <textarea
                    value={settings.siteDescriptionZh}
                    onChange={(e) => handleChange('siteDescriptionZh', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent"
                    placeholder="涓撲笟琛″櫒鍒堕€犲晢..."
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
                <CardTitle>Company Logo & Banner / 鍏徃Logo鍜屾í骞?/CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <ImageUploadField
                  label="Company Logo"
                  value={settings.companyLogo}
                  onChange={(url) => handleChange('companyLogo', url)}
                  uploadType="company-logo"
                  hint="Upload company logo (PNG, JPG, WebP)"
                  previewHeight="h-16"
                />

                <ImageUploadField
                  label="Company Banner URL (Homepage Hero)"
                  value={settings.companyBanner}
                  onChange={(url) => handleChange('companyBanner', url)}
                  uploadType="company-banner"
                  hint="Upload banner image for homepage hero section"
                  previewHeight="h-32"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Company Video / 鍏徃浠嬬粛瑙嗛</CardTitle>
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
                <CardTitle>Company Photos / 鍏徃鍥剧墖</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <MultiImageUpload
                  label="Company Photos Gallery"
                  value={settings.companyPhotos}
                  onChange={(urls) => handleChange('companyPhotos', urls)}
                  uploadType="company-photos"
                  hint="Add more photos"
                  maxImages={10}
                />
              </CardContent>
            </Card>
          </>
        )}

        {/* Contact Info */}
        {activeTab === 'contact' && (
          <Card>
            <CardHeader>
              <CardTitle>Contact Information / 鑱旂郴鏂瑰紡</CardTitle>
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
                    placeholder="sales@zzscale.com"
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
                <h3 className="font-medium text-gray-900 border-b pb-2">Address / 鍦板潃</h3>
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
                    鍦板潃 (涓枃)
                  </label>
                  <Input
                    value={settings.contactAddressZh}
                    onChange={(e) => handleChange('contactAddressZh', e.target.value)}
                    placeholder="娣卞湷甯傚伐涓氬尯123鍙?
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-medium text-gray-900 border-b pb-2">Working Hours / 宸ヤ綔鏃堕棿</h3>
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
                    宸ヤ綔鏃堕棿 (涓枃)
                  </label>
                  <Input
                    value={settings.contactWorkingHoursZh}
                    onChange={(e) => handleChange('contactWorkingHoursZh', e.target.value)}
                    placeholder="鍛ㄤ竴鑷冲懆浜?9:00-18:00"
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
              <CardTitle>Social Media Links / 绀句氦濯掍綋閾炬帴</CardTitle>
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
                <h3 className="font-medium text-gray-900">B2B Platforms / B2B骞冲彴</h3>
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
                  <h3 className="font-medium text-gray-900">Social Media Content Showcase / 绀句氦濯掍綋鍐呭灞曠ず</h3>
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

        {/* Legal */}
        {activeTab === 'legal' && (
          <Card>
            <CardHeader>
              <CardTitle>Legal Settings / 娉曞緥淇℃伅</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ICP Filing Number / ICP澶囨鍙?                </label>
                <Input
                  value={settings.icpNumber}
                  onChange={(e) => handleChange('icpNumber', e.target.value)}
                  placeholder="娴橧CP澶嘪XXXXXXX鍙?
                />
                <p className="text-xs text-gray-500 mt-1">
                  Shown in the website footer. Chinese website ICP filing number.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
