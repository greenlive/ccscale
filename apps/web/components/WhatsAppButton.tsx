'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { useLocale } from 'next-intl';

/**
 * Floating WhatsApp click-to-chat button.
 *
 * Reads the configured phone number from `NEXT_PUBLIC_WHATSAPP_NUMBER`
 * (international format, no '+' or spaces, e.g. "8613800000000").
 * If the env var is missing, the button is hidden.
 *
 * Locale-aware default message; for B2B, leads with "I'd like a quote".
 */
export function WhatsAppButton() {
  const locale = useLocale();
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!phone || !mounted) return null;

  const message = locale === 'zh'
    ? '你好，我想咨询你们的产品和报价。'
    : 'Hi, I would like a quote for your weighing scales.';
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 print:hidden">
      {open ? (
        <div
          role="dialog"
          aria-label="WhatsApp"
          className="bg-white rounded-2xl shadow-xl border border-border-cream p-4 w-72 text-sm"
        >
          <div className="flex items-start justify-between mb-2">
            <p className="font-medium text-foreground">
              {locale === 'zh' ? '需要报价?' : 'Need a quote?'}
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-stone-gray hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="text-stone-gray mb-3">
            {locale === 'zh'
              ? '点击下方按钮,通过 WhatsApp 与我们联系,我们会在工作时间(周一至周五 9:00-18:00)内回复。'
              : 'Tap the button to chat with us on WhatsApp. We reply within business hours (Mon-Fri 9:00-18:00 GMT+8).'}
          </p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] text-white px-4 py-2 font-medium hover:bg-[#25D366]/90"
          >
            <MessageCircle className="h-4 w-4" />
            {locale === 'zh' ? '开始聊天' : 'Start chat'}
          </a>
        </div>
      ) : null}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open WhatsApp chat"
        className="rounded-full bg-[#25D366] text-white p-4 shadow-lg hover:bg-[#25D366]/90 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30"
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
}