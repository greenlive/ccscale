'use client';

import { useState } from 'react';
import { Send, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Textarea } from '@cc-scale/ui';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ContactFormProps {
  locale: 'en' | 'zh';
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm({ locale }: ContactFormProps) {
  const t = (en: string, zh: string) => (locale === 'en' ? en : zh);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', company: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.fullName.trim()) e.fullName = t('Name is required', '请输入姓名');
    if (!formData.email.trim() || !EMAIL_REGEX.test(formData.email)) e.email = t('Valid email is required', '请输入有效邮箱');
    if (!formData.message.trim() || formData.message.length < 10) e.message = t('Message is too short', '留言过短');
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
      const response = await fetch(`${API_URL}/api/inquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, source: 'Contact Page' }),
      });
      if (!response.ok) throw new Error('Failed');
      setStatus('success');
      setFormData({ fullName: '', email: '', phone: '', company: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-[#0A1628] mb-2">
          {t('Message sent!', '留言已发送！')}
        </h3>
        <p className="text-gray-600">
          {t('We will respond within 24 hours.', '我们将在24小时内回复您。')}
        </p>
        <Button onClick={() => setStatus('idle')} variant="outline" className="mt-4">
          {t('Send another', '再次发送')}
        </Button>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center py-12">
        <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <p className="text-gray-600 mb-4">{t('Something went wrong. Please try again.', '提交失败，请重试。')}</p>
        <Button onClick={() => setStatus('idle')} variant="outline">{t('Try Again', '重试')}</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">{t('Name', '姓名')} *</label>
          <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder={t('John Smith', '张三')} className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30" />
          {errors.fullName && <p className="text-xs text-red-300 mt-1">{errors.fullName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">{t('Email', '邮箱')} *</label>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@company.com" className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30" />
          {errors.email && <p className="text-xs text-red-300 mt-1">{errors.email}</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">{t('Phone', '电话')}</label>
          <Input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+1 234 567 8900" className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30" />
        </div>
        <div>
          <label className="block text-sm font-medium text-white/90 mb-1">{t('Company', '公司')}</label>
          <Input name="company" value={formData.company} onChange={handleChange} placeholder={t('Your Company', '您的公司')} className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-white/90 mb-1">{t('Message', '留言')} *</label>
        <Textarea name="message" value={formData.message} onChange={handleChange} rows={4} placeholder={t('Tell us about your needs...', '请告诉我们您的需求...')} className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-white/30" />
        {errors.message && <p className="text-xs text-red-300 mt-1">{errors.message}</p>}
      </div>
      <Button type="submit" disabled={status === 'submitting'} className="w-full bg-white text-[#0A1628] hover:bg-white/90 font-semibold">
        {status === 'submitting' ? (
          t('Sending...', '发送中...')
        ) : (
          <><Send className="mr-2 h-4 w-4" />{t('Send Message', '发送留言')}</>
        )}
      </Button>
    </form>
  );
}
