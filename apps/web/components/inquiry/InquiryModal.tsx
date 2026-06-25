'use client';

import { useState, useEffect } from 'react';
import { X, Send } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Button, Input, Textarea } from '@cc-scale/ui';
import { useInquiryCart } from '@/stores/inquiry-cart';
import { useSubmitInquiry } from '@/lib/api/queries';
import { getStoredTrackingData } from '@/lib/utils/tracking';
import { getApiUrl } from '@/lib/config/api';
import { toast } from '@/stores/toast';

interface InquiryModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * InquiryModal — alternative layout for the inquiry flow.
 * A/B test variant: modal centered on screen instead of right-side drawer.
 * Tracks conversion via the inquiry_submitted event.
 */
export function InquiryModal({ open, onClose }: InquiryModalProps) {
  const locale = useLocale() as 'en' | 'zh';
  const isZh = locale === 'zh';
  const cart = useInquiryCart((s) => s.cart);
  const clearCart = useInquiryCart((s) => s.clearCart);
  const submitInquiry = useSubmitInquiry();
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    city: '',
    message: cart.message || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Esc
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = isZh ? '请输入姓名' : 'Name required';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = isZh ? '请输入有效邮箱' : 'Valid email required';
    if (form.message.trim().length < 10)
      errs.message = isZh ? '请输入至少10个字符' : 'Message must be 10+ chars';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('submitting');

    try {
      const items = cart.items.map((item) => ({
        productId: item.productId,
        productNameEn: item.productName.en,
        productNameZh: item.productName.zh,
        quantity: item.quantity,
        unitPrice: item.priceMin,
      }));

      const { landingPage: _lp, ...trackingData } = getStoredTrackingData();

      const payload = {
        ...form,
        source: 'Website-Modal',
        items: items.length > 0 ? items : undefined,
        ...(trackingData.trafficSource ? { trafficSource: trackingData.trafficSource } : {}),
        ...(trackingData.utmSource ? { utmSource: trackingData.utmSource } : {}),
        ...(trackingData.utmMedium ? { utmMedium: trackingData.utmMedium } : {}),
        ...(trackingData.utmCampaign ? { utmCampaign: trackingData.utmCampaign } : {}),
      };

      const res = await fetch(getApiUrl('inquiries'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        clearCart();
        toast.success(
          isZh ? '询盘提交成功！' : 'Inquiry submitted!',
          isZh ? '我们将在24小时内回复您。' : 'We will respond within 24 hours.'
        );
        window.dataLayer?.push({ event: 'inquiry_submitted', variant: 'modal' });
        setTimeout(onClose, 1500);
      } else {
        throw new Error('submit_failed');
      }
    } catch (err) {
      toast.error(isZh ? '提交失败，请重试' : 'Submission failed, please retry');
      window.dataLayer?.push({ event: 'inquiry_failed', variant: 'modal' });
      setStatus('idle');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inquiry-modal-title"
    >
      <div className="relative bg-white dark:bg-[#1f1d1a] rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <h2 id="inquiry-modal-title" className="text-xl font-bold text-primary">
            {isZh ? '提交询盘' : 'Submit Inquiry'}
            {cart.items.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({cart.items.length} {isZh ? '件商品' : 'items'})
              </span>
            )}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input
                placeholder={isZh ? '姓名 *' : 'Name *'}
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
            </div>
            <div>
              <Input
                type="email"
                placeholder="Email *"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder={isZh ? '电话' : 'Phone'}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Input
              placeholder={isZh ? '公司' : 'Company'}
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              placeholder={isZh ? '国家' : 'Country'}
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            />
            <Input
              placeholder={isZh ? '城市' : 'City'}
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
          </div>
          <div>
            <Textarea
              placeholder={isZh ? '告诉我们您的需求... *' : 'Tell us your requirements... *'}
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className={errors.message ? 'border-red-500' : ''}
            />
            {errors.message && <p className="text-xs text-red-500 mt-1">{errors.message}</p>}
          </div>
          <Button type="submit" disabled={status === 'submitting'} className="w-full bg-accent hover:bg-accent/90">
            {status === 'submitting' ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                {isZh ? '提交中...' : 'Submitting...'}
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                {isZh ? '提交询盘' : 'Submit Inquiry'}
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}