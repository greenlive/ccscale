'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { Send, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Textarea } from '@cc-scale/ui';
import { useInquiryCart } from '@/stores/inquiry-cart';
import { getStoredTrackingData } from '@/lib/utils/tracking';
import { useSubmitInquiry } from '@/lib/api/queries';

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation - accepts various formats
const PHONE_REGEX = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

export default function InquiryForm() {
  const t = useTranslations('inquiry');
  const locale = useLocale() as 'en' | 'zh';
  const cart = useInquiryCart((state) => state.cart);
  const clearCart = useInquiryCart((state) => state.clearCart);
  const [formStatus, setFormStatus] = useState<FormStatus>('idle');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    city: '',
    whatsapp: '',
    message: '',
  });

  const submitInquiry = useSubmitInquiry();

  // Validation function with locale context
  const validateForm = (data: typeof formData): FormErrors => {
    const errors: FormErrors = {};

    if (!data.fullName.trim()) {
      errors.fullName = locale === 'en' ? 'Full name is required' : '请输入您的姓名';
    } else if (data.fullName.trim().length < 2) {
      errors.fullName = locale === 'en' ? 'Name is too short' : '姓名太短';
    }

    if (!data.email.trim()) {
      errors.email = locale === 'en' ? 'Email is required' : '请输入邮箱';
    } else if (!EMAIL_REGEX.test(data.email)) {
      errors.email = locale === 'en' ? 'Invalid email format' : '邮箱格式不正确';
    }

    if (data.phone && !PHONE_REGEX.test(data.phone)) {
      errors.phone = locale === 'en' ? 'Invalid phone format' : '电话格式不正确';
    }

    if (!data.message.trim()) {
      errors.message = locale === 'en' ? 'Message is required' : '请输入留言';
    } else if (data.message.trim().length < 10) {
      errors.message = locale === 'en' ? 'Message is too short' : '留言太短';
    }

    return errors;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name as keyof FormErrors]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormStatus('submitting');
    setFormErrors({});

    try {
      // Prepare inquiry items from cart
      const items = cart.items.map((item) => ({
        productId: item.productId,
        productNameEn: item.productName.en,
        productNameZh: item.productName.zh,
        quantity: item.quantity || 1,
        unitPrice: item.priceMin,
      }));

      // Get tracking data, strip landingPage (not in DTO) and whitelist only accepted fields
      const { landingPage: _landingPage, ...trackingData } = getStoredTrackingData();
      const { trafficSource, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, referrer } = trackingData;

      // Prepare the inquiry data
      const inquiryData = {
        ...formData,
        message: formData.message || cart.message || '',
        source: 'Website',
        items: items.length > 0 ? items : undefined,
        // Only whitelist tracking fields the backend DTO accepts
        ...(trafficSource ? { trafficSource } : {}),
        ...(utmSource ? { utmSource } : {}),
        ...(utmMedium ? { utmMedium } : {}),
        ...(utmCampaign ? { utmCampaign } : {}),
        ...(utmContent ? { utmContent } : {}),
        ...(utmTerm ? { utmTerm } : {}),
        ...(referrer ? { referrer } : {}),
      };

      // Submit using React Query mutation
      await submitInquiry.mutateAsync(inquiryData);

      setFormStatus('success');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        company: '',
        country: '',
        city: '',
        whatsapp: '',
        message: '',
      });
      clearCart();

      // Reset after 5 seconds
      setTimeout(() => setFormStatus('idle'), 5000);
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      setFormStatus('error');
    }
  };

  return (
    <div className="bg-ivory rounded-xl shadow-whisper border border-border-cream p-6 md:p-8">
      {formStatus === 'success' ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-terracotta" />
          </div>
          <h3 className="text-2xl font-serif font-medium text-foreground mb-2">
            {t('submitSuccess')}
          </h3>
          <p className="text-stone-gray">
            {locale === 'en'
              ? 'We will get back to you within 24 hours.'
              : '我们将在24小时内回复您。'}
          </p>
        </div>
      ) : formStatus === 'error' ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="h-10 w-10 text-destructive" />
          </div>
          <h3 className="text-2xl font-serif font-medium text-foreground mb-2">
            {t('submitError')}
          </h3>
          <p className="text-stone-gray mb-6">
            {locale === 'en'
              ? 'Please try again or contact us directly.'
              : '请重试或直接联系我们。'}
          </p>
          <Button onClick={() => setFormStatus('idle')} variant="outline">
            {locale === 'en' ? 'Try Again' : '重试'}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-charcoal-warm mb-2">
                {t('fullName')} *
              </label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder={locale === 'en' ? 'John Smith' : '张三'}
                className={formErrors.fullName ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {formErrors.fullName && (
                <p className="text-xs text-destructive mt-1">{formErrors.fullName}</p>
              )}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal-warm mb-2">
                {t('email')} *
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className={formErrors.email ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {formErrors.email && (
                <p className="text-xs text-destructive mt-1">{formErrors.email}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-charcoal-warm mb-2">
                {t('phone')}
              </label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+1 234 567 8900"
                className={formErrors.phone ? 'border-destructive focus-visible:ring-destructive' : ''}
              />
              {formErrors.phone && (
                <p className="text-xs text-destructive mt-1">{formErrors.phone}</p>
              )}
            </div>
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-charcoal-warm mb-2">
                {t('company')}
              </label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                placeholder={locale === 'en' ? 'Your Company' : '您的公司'}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-charcoal-warm mb-2">
                {t('country')}
              </label>
              <Input
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                placeholder={locale === 'en' ? 'United States' : '美国'}
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-charcoal-warm mb-2">
                {t('city')}
              </label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder={locale === 'en' ? 'New York' : '纽约'}
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-charcoal-warm mb-2">
              {t('message')} *
            </label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={6}
              placeholder={t('tellUsNeeds')}
              className={formErrors.message ? 'border-destructive focus-visible:ring-destructive' : ''}
            />
            {formErrors.message && (
              <p className="text-xs text-destructive mt-1">{formErrors.message}</p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            variant="accent"
            className="w-full md:w-auto"
            disabled={formStatus === 'submitting'}
          >
            {formStatus === 'submitting' ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-ivory"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {locale === 'en' ? 'Sending...' : '发送中...'}
              </span>
            ) : (
              <span className="flex items-center">
                <Send className="mr-2 h-4 w-4" />
                {t('submit')}
              </span>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
