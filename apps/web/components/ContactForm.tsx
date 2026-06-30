'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Send, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Textarea } from '@cc-scale/ui';
import { Turnstile } from './Turnstile';

interface ContactFormProps {
  locale: 'en' | 'zh';
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ locale }: ContactFormProps) {
  // Use next-intl standard single-key API (NOT the prior t('en','zh') dual-arg pattern)
  const t = useTranslations('contact');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', company: '', message: '' });
  const [turnstileToken, setTurnstileToken] = useState('');
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.fullName.trim()) e.fullName = t('errNameRequired');
    if (!formData.email.trim() || !EMAIL_REGEX.test(formData.email)) e.email = t('errEmailRequired');
    if (!formData.message.trim() || formData.message.length < 10) e.message = t('errMessageShort');
    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setStatus('submitting');
    try {
      const response = await fetch(`/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'Contact Page', turnstileToken: turnstileToken || undefined }),
      });
      if (!response.ok) throw new Error('Failed');
      setStatus('success');
      setFormData({ fullName: '', email: '', phone: '', company: '', message: '' });
      setTurnstileToken('');
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-primary mb-2">{t('success')}</h3>
        <p className="text-gray-600">{t('successDesc')}</p>
        <Button onClick={() => setStatus('idle')} variant="outline" className="mt-4">
          {t('sendAnother')}
        </Button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">{t('error')}</p>
        <Button onClick={() => setStatus('idle')} variant="outline">{t('tryAgain')}</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-name" className="block text-sm font-medium text-white/90 mb-1">
            {t('name')} *
          </label>
          <Input
            id="cf-name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder={t('namePlaceholder')}
            aria-invalid={!!errors.fullName}
            aria-describedby={errors.fullName ? 'cf-name-err' : undefined}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
          />
          {errors.fullName && (
            <p id="cf-name-err" className="text-xs text-red-300 mt-1">{errors.fullName}</p>
          )}
        </div>
        <div>
          <label htmlFor="cf-email" className="block text-sm font-medium text-white/90 mb-1">
            {t('email')} *
          </label>
          <Input
            id="cf-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'cf-email-err' : undefined}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
          />
          {errors.email && (
            <p id="cf-email-err" className="text-xs text-red-300 mt-1">{errors.email}</p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="cf-phone" className="block text-sm font-medium text-white/90 mb-1">
            {t('phone')}
          </label>
          <Input
            id="cf-phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+1 234 567 8900"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
          />
        </div>
        <div>
          <label htmlFor="cf-company" className="block text-sm font-medium text-white/90 mb-1">
            {t('company')}
          </label>
          <Input
            id="cf-company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder={t('companyPlaceholder')}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
          />
        </div>
      </div>
      <div>
        <label htmlFor="cf-message" className="block text-sm font-medium text-white/90 mb-1">
          {t('message')} *
        </label>
        <Textarea
          id="cf-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={4}
          placeholder={t('messagePlaceholder')}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'cf-message-err' : undefined}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30"
        />
        {errors.message && (
          <p id="cf-message-err" className="text-xs text-red-300 mt-1">{errors.message}</p>
        )}
      </div>
      <Turnstile siteKey={turnstileSiteKey} onVerify={setTurnstileToken} onExpire={() => setTurnstileToken('')} />
      <Button type="submit" disabled={status === 'submitting'} className="w-full bg-white text-primary hover:bg-white/90 font-semibold">
        {status === 'submitting' ? (
          t('sending')
        ) : (
          <><Send className="mr-2 h-4 w-4" />{t('send')}</>
        )}
      </Button>
    </form>
  );
}