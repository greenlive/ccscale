'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Download, FileText, HelpCircle, Mail, Phone, Search, ChevronRight, BookOpen, Smartphone, MonitorPlay, File, Image as ImageIcon } from 'lucide-react';
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

const faqs = [
  {
    questionEn: 'How do I calibrate my scale?',
    questionZh: '濡備綍鏍″噯鎴戠殑绉わ紵',
    answerEn: 'Please refer to the user manual for detailed calibration instructions specific to your model. Most scales can be calibrated using standard weights following the step-by-step guide provided.',
    answerZh: '璇峰弬鑰冪敤鎴锋墜鍐岃幏鍙栭拡瀵规偍鍨嬪彿鐨勮缁嗘牎鍑嗚鏄庛€傚ぇ澶氭暟绉ゅ彲浠ヤ娇鐢ㄦ爣鍑嗙牆鐮佹寜鐓ф彁渚涚殑鍒嗘鎸囧崡杩涜鏍″噯銆?,
  },
  {
    questionEn: 'What is the warranty period?',
    questionZh: '淇濅慨鏈熸槸澶氶暱锛?,
    answerEn: 'Our standard warranty is 2 years from the date of purchase. Extended warranty options are available for commercial users.',
    answerZh: '鎴戜滑鐨勬爣鍑嗕繚淇湡涓鸿嚜璐拱涔嬫棩璧?骞淬€傚晢涓氱敤鎴峰彲閫夋嫨寤堕暱淇濅慨鏈熴€?,
  },
  {
    questionEn: 'How do I get technical support?',
    questionZh: '濡備綍鑾峰緱鎶€鏈敮鎸侊紵',
    answerEn: 'You can reach our technical support team via email at support@zzscale.com or by phone during business hours. We typically respond within 24 hours.',
    answerZh: '鎮ㄥ彲浠ラ€氳繃鐢靛瓙閭欢support@zzscale.com鎴栧湪宸ヤ綔鏃堕棿鑷寸數鑱旂郴鎴戜滑鐨勬妧鏈敮鎸佸洟闃熴€傛垜浠€氬父鍦?4灏忔椂鍐呭洖澶嶃€?,
  },
  {
    questionEn: 'Can I download the user manual?',
    questionZh: '鎴戝彲浠ヤ笅杞界敤鎴锋墜鍐屽悧锛?,
    answerEn: 'Yes! All our user manuals are available for download in the Downloads section below. Simply find your product model and click the download button.',
    answerZh: '鏄殑锛佹垜浠墍鏈夌殑鐢ㄦ埛鎵嬪唽閮藉彲浠ュ湪涓嬮潰鐨勪笅杞介儴鍒嗕笅杞姐€傚彧闇€鎵惧埌鎮ㄧ殑浜у搧鍨嬪彿骞剁偣鍑讳笅杞芥寜閽€?,
  },
];

const categories = [
  { value: 'all', labelEn: 'All Files', labelZh: '鍏ㄩ儴鏂囦欢' },
  { value: 'manual', labelEn: 'User Manuals', labelZh: '鐢ㄦ埛鎵嬪唽' },
  { value: 'specs', labelEn: 'Specifications', labelZh: '鎶€鏈鏍? },
  { value: 'software', labelEn: 'Software', labelZh: '杞欢' },
  { value: 'catalog', labelEn: 'Catalogs', labelZh: '浜у搧鐩綍' },
  { value: 'cert', labelEn: 'Certificates', labelZh: '璁よ瘉鏂囦欢' },
  { value: 'video', labelEn: 'Videos', labelZh: '瑙嗛鏁欑▼' },
];

// Default downloads when API is not available
const defaultDownloads: DownloadItem[] = [
  {
    id: 1,
    titleEn: 'Body Scale BS-200 User Manual',
    titleZh: '浣撻噸绉?BS-200 鐢ㄦ埛鎵嬪唽',
    fileUrl: '#',
    fileType: 'PDF',
    category: 'manual',
    order: 1,
    isActive: true,
    downloadCount: 0,
  },
  {
    id: 2,
    titleEn: 'Product Catalog 2024',
    titleZh: '2024骞翠骇鍝佺洰褰?,
    fileUrl: '#',
    fileType: 'PDF',
    category: 'catalog',
    order: 2,
    isActive: true,
    downloadCount: 0,
  },
];

interface SupportPageContentProps {
  locale: 'en' | 'zh';
}

export function SupportPageContent({ locale }: SupportPageContentProps) {
  const t = useTranslations('nav');
  const [downloads, setDownloads] = useState<DownloadItem[]>(defaultDownloads);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
    try {
      const response = await fetch(`/api/downloads`);
      if (response.ok) {
        const data = await response.json();
        const activeDownloads = data.filter((d: DownloadItem) => d.isActive);
        if (activeDownloads.length > 0) {
          setDownloads(activeDownloads);
        }
      }
    } catch (error) {
      console.error('Failed to fetch downloads:', error);
    }
  };

  const filteredDownloads = downloads.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const title = locale === 'en' ? item.titleEn : item.titleZh;
    const matchesSearch = title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('support')}</h1>
          <p className="text-xl text-warm-silver max-w-2xl mx-auto">
            {locale === 'en'
              ? 'Find manuals, software, and answers to your questions'
              : '鏌ユ壘鎵嬪唽銆佽蒋浠跺拰鎮ㄩ棶棰樼殑绛旀'}
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center border-none">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-warm-sand rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-primary">
                  {locale === 'en' ? 'Call Us' : '鑷寸數鎴戜滑'}
                </h3>
                <p className="text-gray-600">+86 123 4567 8900</p>
                <p className="text-sm text-gray-500 mt-2">
                  {locale === 'en' ? 'Mon-Fri: 9:00-18:00' : '鍛ㄤ竴鑷冲懆浜? 9:00-18:00'}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-none">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-warm-sand rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-primary">
                  {locale === 'en' ? 'Email Us' : '鍙戦€侀偖浠?}
                </h3>
                <p className="text-gray-600">support@zzscale.com</p>
                <p className="text-sm text-gray-500 mt-2">
                  {locale === 'en' ? 'Response within 24 hours' : '24灏忔椂鍐呭洖澶?}
                </p>
              </CardContent>
            </Card>
            <Card className="text-center border-none">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-warm-sand rounded-full flex items-center justify-center mx-auto mb-4">
                  <HelpCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2 text-primary">
                  {locale === 'en' ? 'FAQ' : '甯歌闂'}
                </h3>
                <p className="text-gray-600">
                  {locale === 'en' ? 'Check our FAQ section' : '鏌ョ湅鎴戜滑鐨勫父瑙侀棶棰?}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  {locale === 'en' ? 'Instant answers' : '鍗虫椂绛旀'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Downloads */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-primary flex items-center">
            <Download className="mr-3 h-8 w-8" />
            {locale === 'en' ? 'Download Center' : '涓嬭浇涓績'}
          </h2>

          {/* Search & Filter */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder={locale === 'en' ? 'Search files...' : '鎼滅储鏂囦欢...'}
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
            {filteredDownloads.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>{locale === 'en' ? 'No downloads available' : '鏆傛棤涓嬭浇鍐呭'}</p>
              </div>
            ) : (
              filteredDownloads.map((item) => {
                const title = locale === 'en' ? item.titleEn : item.titleZh;
                const getIcon = () => {
                  if (item.fileType === 'PDF') return <FileText className="h-6 w-6 text-red-500" />;
                  if (item.fileType === 'APK') return <Smartphone className="h-6 w-6 text-green-500" />;
                  if (item.fileType === 'MP4') return <MonitorPlay className="h-6 w-6 text-dark-surface" />;
                  if (item.fileType === 'JPG' || item.fileType === 'PNG') return <ImageIcon className="h-6 w-6 text-purple-500" />;
                  return <BookOpen className="h-6 w-6 text-gray-500" />;
                };
                const formatSize = (bytes?: number) => {
                  if (!bytes) return '';
                  const mb = bytes / (1024 * 1024);
                  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
                };
                return (
                  <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">{getIcon()}</div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-primary mb-1 truncate">{title}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>{item.fileType}</span>
                            {item.fileSize && (
                              <>
                                <span>鈥?/span>
                                <span>{formatSize(item.fileSize)}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <a href={item.fileUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" className="w-full mt-4">
                          <Download className="mr-2 h-4 w-4" />
                          {locale === 'en' ? 'Download' : '涓嬭浇'}
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

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-primary">
            {locale === 'en' ? 'Frequently Asked Questions' : '甯歌闂'}
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => {
              const question = locale === 'en' ? faq.questionEn : faq.questionZh;
              const answer = locale === 'en' ? faq.answerEn : faq.answerZh;
              const isOpen = openFaq === index;
              const buttonId = `faq-button-${index}`;
              const panelId = `faq-panel-${index}`;
              return (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
                  <button
                    id={buttonId}
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="font-medium text-primary">{question}</span>
                    <ChevronRight
                      className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                  {isOpen && (
                    <div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      className="px-6 pb-4 text-gray-600"
                    >
                      {answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
