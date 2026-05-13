'use client';

import { Search, X } from 'lucide-react';
import { Input } from '@cc-scale/ui';

interface CategoryItem {
  id: string;
  nameEn: string;
  nameZh: string;
  slug?: string;
  productCount?: number;
}

interface CategorySidebarProps {
  categories: CategoryItem[];
  selectedCategory: string;
  searchQuery: string;
  resultCount: number;
  locale: 'en' | 'zh';
  onCategoryChange: (id: string) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export default function CategorySidebar({
  categories,
  selectedCategory,
  searchQuery,
  resultCount,
  locale,
  onCategoryChange,
  onSearchChange,
  onClearFilters,
  hasActiveFilters,
}: CategorySidebarProps) {
  return (
    <aside className="w-72 flex-shrink-0 hidden lg:block">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-gray" />
        <Input
          type="text"
          placeholder={locale === 'en' ? 'Search products...' : '搜索产品...'}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
          aria-label={locale === 'en' ? 'Search products' : '搜索产品'}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-gray hover:text-charcoal-warm"
            aria-label={locale === 'en' ? 'Clear search' : '清除搜索'}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Categories list */}
      <nav className="mt-6 space-y-1" aria-label="Product categories">
        {categories.map((cat) => {
          const name = locale === 'en' ? cat.nameEn : cat.nameZh;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-all flex items-center justify-between group ${
                isSelected
                  ? 'bg-terracotta/10 text-terracotta font-medium'
                  : 'text-charcoal-warm hover:bg-warm-sand hover:text-foreground'
              }`}
              aria-current={isSelected ? 'true' : undefined}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'border-terracotta bg-terracotta'
                      : 'border-warm-silver group-hover:border-stone-gray'
                  }`}
                >
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>
                {name}
              </span>
              {cat.productCount !== undefined && (
                <span className={`text-xs ${isSelected ? 'text-terracotta' : 'text-stone-gray'}`}>
                  ({cat.productCount})
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Filter summary and clear */}
      {hasActiveFilters && (
        <div className="mt-6 pt-4 border-t border-border-cream">
          <div className="flex items-center justify-between">
            <span className="text-sm text-stone-gray">
              {locale === 'zh'
                ? `${resultCount} 个产品`
                : `${resultCount} products`}
            </span>
            <button
              onClick={onClearFilters}
              className="text-sm text-terracotta hover:text-coral flex items-center gap-1"
            >
              <X className="h-3 w-3" />
              {locale === 'zh' ? '清除筛选' : 'Clear filters'}
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
