import { getTranslations } from 'next-intl/server';
import { Shield, ExternalLink, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@cc-scale/ui';
import { Button } from '@cc-scale/ui';

const ALIBABA_URL = 'https://zzscale.en.alibaba.com/index.html?spm=a2700.shop_plgr.88.10.643d71213FpJji';

// Server Component — static content, no client JS needed.
export default async function AlibabaTrustBadge({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'alibaba' });
  const isZh = locale === 'zh';

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="container mx-auto px-4">
        <Card className="overflow-hidden border-none shadow-xl max-w-4xl mx-auto">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-5">
              {/* Left - Alibaba Brand */}
              <div className="md:col-span-2 bg-gradient-to-br from-orange-500 to-orange-600 p-8 text-white flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <span className="text-2xl font-black text-orange-600">Alibaba</span>
                </div>
                <Shield className="h-12 w-12 mb-4 text-orange-100" />
                <h3 className="text-xl font-bold mb-2">
                  {isZh ? 'Alibaba金品诚企' : 'Alibaba Gold Supplier'}
                </h3>
                <p className="text-orange-100 text-sm">
                  {isZh ? ' Verified & Trusted' : ' Verified & Trusted'}
                </p>
              </div>

              {/* Right - Content */}
              <div className="md:col-span-3 p-8">
                <h2 className="text-2xl font-bold text-primary mb-4">
                  {isZh ? '通过Alibaba平台交易，更安全有保障' : 'Trade via Alibaba Platform for Extra Security'}
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-primary">
                        {isZh ? 'Trade Assurance保障' : 'Trade Assurance Covered'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {isZh
                          ? '付款安全、发货保障、质量保障'
                          : 'Payment protection, shipping guarantee, quality assurance'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-primary">
                        {isZh ? '第三方验厂认证' : 'Third-party Factory Audit'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {isZh
                          ? '已通过Alibaba指定机构现场审核'
                          : 'On-site audit by Alibaba designated agencies'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-primary">
                        {isZh ? '争议在线处理' : 'Online Dispute Resolution'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {isZh
                          ? 'Alibaba平台官方介入，快速解决问题'
                          : 'Alibaba official mediation for quick resolution'}
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  size="lg"
                  asChild
                  className="w-full md:w-auto bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <a href={ALIBABA_URL} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-5 w-5" />
                    {isZh ? '访问我们的Alibaba店铺' : 'Visit Our Alibaba Store'}
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
