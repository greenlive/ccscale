'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';
import { Textarea } from '@cc-scale/ui';

export interface FAQItem {
  id: string;
  questionEn: string;
  questionZh: string;
  answerEn: string;
  answerZh: string;
}

interface ProductFAQProps {
  faqs: FAQItem[];
  onChange: (faqs: FAQItem[]) => void;
}

export function ProductFAQ({ faqs, onChange }: ProductFAQProps) {
  const addFAQ = () => {
    const newFAQ: FAQItem = {
      id: Math.random().toString(36).substr(2, 9),
      questionEn: '',
      questionZh: '',
      answerEn: '',
      answerZh: '',
    };
    onChange([...faqs, newFAQ]);
  };

  const removeFAQ = (id: string) => {
    onChange(faqs.filter(f => f.id !== id));
  };

  const updateFAQ = (id: string, field: keyof FAQItem, value: string) => {
    onChange(faqs.map(f =>
      f.id === id ? { ...f, [field]: value } : f
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          FAQ (Frequently Asked Questions)
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addFAQ}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add FAQ
        </Button>
      </div>

      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <p>No FAQs yet</p>
            <p className="text-sm mt-1">Click &quot;Add FAQ&quot; to add frequently asked questions</p>
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq.id}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Question (English)
                      </label>
                      <Input
                        value={faq.questionEn}
                        onChange={(e) => updateFAQ(faq.id, 'questionEn', e.target.value)}
                        placeholder="e.g. What is the warranty period?"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Question (中文)
                      </label>
                      <Input
                        value={faq.questionZh}
                        onChange={(e) => updateFAQ(faq.id, 'questionZh', e.target.value)}
                        placeholder="例如：保修期是多久？"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Answer (English)
                      </label>
                      <Textarea
                        value={faq.answerEn}
                        onChange={(e) => updateFAQ(faq.id, 'answerEn', e.target.value)}
                        placeholder="Detailed answer..."
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Answer (中文)
                      </label>
                      <Textarea
                        value={faq.answerZh}
                        onChange={(e) => updateFAQ(faq.id, 'answerZh', e.target.value)}
                        placeholder="详细回答..."
                        rows={2}
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFAQ(faq.id)}
                  className="text-red-500 hover:text-red-600 transition-colors mt-6"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
