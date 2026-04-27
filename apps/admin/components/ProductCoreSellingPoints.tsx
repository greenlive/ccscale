'use client';

import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@cc-scale/ui';

export interface CoreSellingPoint {
  id: string;
  pointEn: string;
  pointZh: string;
}

interface ProductCoreSellingPointsProps {
  points: CoreSellingPoint[];
  onChange: (points: CoreSellingPoint[]) => void;
}

export function ProductCoreSellingPoints({ points, onChange }: ProductCoreSellingPointsProps) {
  const addPoint = () => {
    const newPoint: CoreSellingPoint = {
      id: Math.random().toString(36).substr(2, 9),
      pointEn: '',
      pointZh: '',
    };
    onChange([...points, newPoint]);
  };

  const removePoint = (id: string) => {
    onChange(points.filter(p => p.id !== id));
  };

  const updatePoint = (id: string, field: keyof CoreSellingPoint, value: string) => {
    onChange(points.map(p =>
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Core Selling Points (3-5 key benefits)
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addPoint}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Point
        </Button>
      </div>

      <div className="space-y-3">
        {points.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
            <p>No selling points yet</p>
            <p className="text-sm mt-1">Add 3-5 key product benefits</p>
          </div>
        ) : (
          points.map((point, index) => (
            <div
              key={point.id}
              className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Point {index + 1} (English)
                  </label>
                  <input
                    type="text"
                    value={point.pointEn}
                    onChange={(e) => updatePoint(point.id, 'pointEn', e.target.value)}
                    placeholder="e.g. High precision sensors for accurate weighing"
                    className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Point {index + 1} (中文)
                  </label>
                  <input
                    type="text"
                    value={point.pointZh}
                    onChange={(e) => updatePoint(point.id, 'pointZh', e.target.value)}
                    placeholder="例如：高精度传感器，准确称重"
                    className="w-full h-10 px-3 border border-gray-200 rounded-md text-sm"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removePoint(point.id)}
                className="text-red-500 hover:text-red-600 transition-colors mt-6"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {points.length > 0 && points.length < 3 && (
        <p className="text-xs text-primary">
          Tip: Add at least 3 selling points for better conversion
        </p>
      )}
    </div>
  );
}
