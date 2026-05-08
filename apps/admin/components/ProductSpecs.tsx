'use client';

import { useState, useCallback } from 'react';
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp, Wand } from 'lucide-react';
import { Button } from '@cc-scale/ui';
import { Input } from '@cc-scale/ui';

interface SpecItem {
  id: string;
  keyEn: string;
  keyZh: string;
  valueEn: string;
  valueZh: string;
  order: number;
}

interface ProductSpecsProps {
  specs: SpecItem[];
  onChange: (specs: SpecItem[]) => void;
}

// SEO-friendly placeholder values for key specs
function getSeoPlaceholder(keyEn: string): { valueEn: string; valueZh: string } {
  const placeholders: Record<string, { valueEn: string; valueZh: string }> = {
    'Capacity': { valueEn: '50kg Heavy Duty Industrial Scale', valueZh: '50公斤 工业级重载型' },
    'Division': { valueEn: '20g High Precision Digital', valueZh: '20克 高精度数字式' },
    'Platform Size': { valueEn: '400×400mm Stainless Steel', valueZh: '400×400毫米 不锈钢' },
    'Power': { valueEn: 'Rechargeable Li-ion Battery', valueZh: '可充电锂电池' },
  };
  return placeholders[keyEn] || { valueEn: '', valueZh: '' };
}

// Quick-add suggestions for common B2B spec keys
const COMMON_SPEC_KEYS = [
  { keyEn: 'Capacity', keyZh: '最大称重' },
  { keyEn: 'Division', keyZh: '分度值' },
  { keyEn: 'Platform Size', keyZh: '秤盘尺寸' },
  { keyEn: 'Power', keyZh: '电源' },
  { keyEn: 'Material', keyZh: '材质' },
  { keyEn: 'Display', keyZh: '显示类型' },
  { keyEn: 'Certificates', keyZh: '认证' },
  { keyEn: 'Battery', keyZh: '电池' },
];

export function ProductSpecs({ specs, onChange }: ProductSpecsProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());
  const [showSuggestions, setShowSuggestions] = useState<string | null>(null);

  const toggleCollapse = (id: string) => {
    setCollapsedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const addSpec = (preset?: { keyEn: string; keyZh: string }) => {
    const newSpec: SpecItem = {
      id: Math.random().toString(36).substr(2, 9),
      keyEn: preset?.keyEn || '',
      keyZh: preset?.keyZh || '',
      valueEn: preset ? getSeoPlaceholder(preset.keyEn).valueEn : '',
      valueZh: preset ? getSeoPlaceholder(preset.keyEn).valueZh : '',
      order: specs.length,
    };
    onChange([...specs, newSpec]);
    setShowSuggestions(null);
  };

  const removeSpec = (id: string) => {
    onChange(specs.filter(s => s.id !== id));
  };

  const updateSpec = (id: string, field: keyof SpecItem, value: string) => {
    onChange(specs.map(s =>
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  const moveSpec = (id: string, direction: 'up' | 'down') => {
    const index = specs.findIndex(s => s.id === id);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === specs.length - 1)) {
      return;
    }
    const newSpecs = [...specs];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSpecs[index], newSpecs[targetIndex]] = [newSpecs[targetIndex], newSpecs[index]];
    newSpecs.forEach((spec, i) => { spec.order = i; });
    onChange(newSpecs);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-charcoal-warm">
          Specifications
        </label>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSuggestions(showSuggestions ? null : 'add')}
              className="text-olive-gray border-olive-gray/30 hover:bg-warm-sand/50"
            >
              <Wand className="h-4 w-4 mr-2" />
              Quick Add
            </Button>
            {showSuggestions === 'add' && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-border-warm rounded-xl shadow-lg z-10 p-2">
                {COMMON_SPEC_KEYS.map(({ keyEn, keyZh }) => (
                  <button
                    key={keyEn}
                    type="button"
                    onClick={() => addSpec({ keyEn, keyZh })}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-warm-sand/50 rounded-lg transition-colors"
                  >
                    <span className="font-medium text-charcoal-warm">{keyEn}</span>
                    <span className="text-olive-gray ml-2">{keyZh}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addSpec()}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {specs.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-border-warm rounded-xl bg-warm-sand/20">
            <div className="w-12 h-12 mx-auto mb-4 bg-warm-sand rounded-full flex items-center justify-center">
              <Plus className="h-6 w-6 text-olive-gray" />
            </div>
            <p className="text-charcoal-warm font-medium">No specifications yet</p>
            <p className="text-sm text-stone-gray mt-1">Click &quot;Add&quot; or &quot;Quick Add&quot; to add product specifications</p>
          </div>
        ) : (
          specs.map((spec, index) => {
            const isCollapsed = collapsedIds.has(spec.id);
            return (
              <div
                key={spec.id}
                className="border border-border-warm rounded-xl bg-white overflow-hidden transition-all hover:border-olive-gray/40"
              >
                {/* Header Row */}
                <div
                  className="flex items-center gap-3 px-4 py-3 bg-warm-sand/30 cursor-pointer"
                  onClick={() => toggleCollapse(spec.id)}
                >
                  <div className="text-stone-gray cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-charcoal-warm truncate">
                      {spec.keyEn || <span className="text-stone-gray italic">Unnamed spec</span>}
                      {spec.keyZh && <span className="text-stone-gray ml-2">/ {spec.keyZh}</span>}
                    </p>
                    {spec.valueEn && (
                      <p className="text-sm text-olive-gray truncate mt-0.5">
                        {spec.valueEn}
                        {spec.valueZh && <span className="ml-1">/ {spec.valueZh}</span>}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveSpec(spec.id, 'up'); }}
                      disabled={index === 0}
                      className="p-1.5 hover:bg-warm-sand rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move up"
                    >
                      <ChevronUp className="h-4 w-4 text-olive-gray" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); moveSpec(spec.id, 'down'); }}
                      disabled={index === specs.length - 1}
                      className="p-1.5 hover:bg-warm-sand rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move down"
                    >
                      <ChevronDown className="h-4 w-4 text-olive-gray" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeSpec(spec.id); }}
                      className="p-1.5 hover:bg-destructive/10 rounded-lg text-destructive transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <ChevronDown className={`h-4 w-4 text-stone-gray transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
                  </div>
                </div>

                {/* Expanded Content */}
                {!isCollapsed && (
                  <div className="px-4 pb-4 pt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-stone-gray mb-1.5">
                          Key (English) <span className="text-terracotta">*</span>
                        </label>
                        <Input
                          value={spec.keyEn}
                          onChange={(e) => updateSpec(spec.id, 'keyEn', e.target.value)}
                          placeholder="e.g. Capacity"
                          className="border-olive-gray/20 focus:border-olive-gray"
                        />
                        {spec.keyEn && ['Capacity', 'Division', 'Platform Size', 'Power'].includes(spec.keyEn) && (
                          <p className="text-xs text-olive-gray mt-1.5 flex items-center gap-1">
                            <Wand className="h-3 w-3" />
                            SEO tip: Use value like &quot;{getSeoPlaceholder(spec.keyEn).valueEn}&quot;
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-gray mb-1.5">
                          Key (中文)
                        </label>
                        <Input
                          value={spec.keyZh}
                          onChange={(e) => updateSpec(spec.id, 'keyZh', e.target.value)}
                          placeholder="例如：最大称重"
                          className="border-olive-gray/20 focus:border-olive-gray"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-gray mb-1.5">
                          Value (English) <span className="text-terracotta">*</span>
                        </label>
                        <Input
                          value={spec.valueEn}
                          onChange={(e) => updateSpec(spec.id, 'valueEn', e.target.value)}
                          placeholder={getSeoPlaceholder(spec.keyEn).valueEn}
                          className="border-olive-gray/20 focus:border-olive-gray"
                        />
                        {spec.valueEn && spec.keyEn && (
                          <p className="text-xs text-stone-gray mt-1.5">
                            Include unit: kg, mm, V, etc.
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-stone-gray mb-1.5">
                          Value (中文)
                        </label>
                        <Input
                          value={spec.valueZh}
                          onChange={(e) => updateSpec(spec.id, 'valueZh', e.target.value)}
                          placeholder={getSeoPlaceholder(spec.keyEn).valueZh}
                          className="border-olive-gray/20 focus:border-olive-gray"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* SEO Helper for Key Specs */}
      {(specs.some(s => ['Capacity', 'Division', 'Platform Size', 'Power'].includes(s.keyEn))) && (
        <div className="mt-4 p-4 bg-terracotta/5 border border-terracotta/20 rounded-xl">
          <p className="text-xs text-terracotta font-semibold mb-2 flex items-center gap-1">
            <Wand className="h-3.5 w-3.5" />
            SEO Tip for Key Specs:
          </p>
          <ul className="text-xs text-charcoal-warm/80 space-y-1.5">
            <li>• <strong>Capacity:</strong> Include weight and application, e.g. &quot;50kg Heavy Duty Industrial Scale&quot;</li>
            <li>• <strong>Division:</strong> Include precision unit, e.g. &quot;20g High Precision Digital&quot;</li>
            <li>• <strong>Platform Size:</strong> Include material, e.g. &quot;400×400mm Stainless Steel&quot;</li>
            <li>• <strong>Power:</strong> Include battery type, e.g. &quot;Rechargeable Li-ion Battery&quot;</li>
          </ul>
        </div>
      )}
    </div>
  );
}
