'use client';

import { useState } from 'react';
import { Download, FileSpreadsheet, AlertCircle, CheckCircle, Upload, Loader2, X } from 'lucide-react';

interface ImportResult {
  success: boolean;
  message: string;
  total: number;
  imported: number;
  updated: number;
  failed: number;
  errors?: Array<{ row: number; field: string; message: string }>;
}

export default function BatchProductsPage() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setResult({
        success: false,
        message: 'Please upload a CSV file',
        total: 0,
        imported: 0,
        updated: 0,
        failed: 0
      });
      return;
    }

    setUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/products/batch/import', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
        total: 0,
        imported: 0,
        updated: 0,
        failed: 0
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-6xl mx-auto'>
        <div className='mb-8'>
          <h1 className='text-2xl font-bold text-gray-900'>Batch Product Management</h1>
          <p className='text-gray-600 mt-1'>Import, export and manage products in bulk</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          <div className='bg-white rounded-xl shadow-sm p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-3 bg-green-100 rounded-lg'>
                <FileSpreadsheet className='w-6 h-6 text-green-600' />
              </div>
              <h3 className='text-lg font-semibold'>Download Product Template</h3>
            </div>
            <p className='text-gray-600 text-sm mb-4'>
              Download the standard product import template, fill in the data according to the format and upload.
            </p>
            <a
              href='/templates/product_import_template.csv'
              download='product_import_template.csv'
              className='inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors'
            >
              <Download className='w-4 h-4' />
              Download CSV Template
            </a>
          </div>

          <div className='bg-white rounded-xl shadow-sm p-6'>
            <div className='flex items-center gap-3 mb-4'>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <Upload className='w-6 h-6 text-blue-600' />
              </div>
              <h3 className='text-lg font-semibold'>Upload Products</h3>
            </div>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                type='file'
                accept='.csv'
                onChange={handleInputChange}
                className='hidden'
                id='file-upload'
                disabled={uploading}
              />
              <label htmlFor='file-upload' className='cursor-pointer'>
                {uploading ? (
                  <div className='flex flex-col items-center'>
                    <Loader2 className='w-8 h-8 text-blue-600 animate-spin mb-2' />
                    <span className='text-sm text-gray-600'>Processing...</span>
                  </div>
                ) : (
                  <div className='flex flex-col items-center'>
                    <Upload className='w-8 h-8 text-gray-400 mb-2' />
                    <span className='text-sm text-gray-600'>
                      Drag and drop your CSV file here, or <span className='text-blue-600'>click to browse</span>
                    </span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {result && (
          <div className={`rounded-xl p-6 mb-8 ${result.success ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className='flex items-start gap-3'>
              {result.success ? (
                <CheckCircle className='w-6 h-6 text-green-600 flex-shrink-0 mt-0.5' />
              ) : (
                <AlertCircle className='w-6 h-6 text-red-600 flex-shrink-0 mt-0.5' />
              )}
              <div className='flex-1'>
                <h3 className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                  {result.message}
                </h3>
                {result.total > 0 && (
                  <div className='mt-4 grid grid-cols-4 gap-4 text-sm'>
                    <div className='bg-white rounded-lg p-3 text-center'>
                      <div className='text-2xl font-bold text-gray-900'>{result.total}</div>
                      <div className='text-gray-500'>Total</div>
                    </div>
                    <div className='bg-white rounded-lg p-3 text-center'>
                      <div className='text-2xl font-bold text-green-600'>{result.imported}</div>
                      <div className='text-gray-500'>Imported</div>
                    </div>
                    <div className='bg-white rounded-lg p-3 text-center'>
                      <div className='text-2xl font-bold text-blue-600'>{result.updated}</div>
                      <div className='text-gray-500'>Updated</div>
                    </div>
                    <div className='bg-white rounded-lg p-3 text-center'>
                      <div className='text-2xl font-bold text-red-600'>{result.failed}</div>
                      <div className='text-gray-500'>Failed</div>
                    </div>
                  </div>
                )}
                {result.errors && result.errors.length > 0 && (
                  <div className='mt-4'>
                    <h4 className='font-medium text-red-800 mb-2'>Errors:</h4>
                    <div className='bg-white rounded-lg p-3 max-h-60 overflow-auto'>
                      {result.errors.map((error, index) => (
                        <div key={index} className='text-sm text-red-600 py-1'>
                          Row {error.row}: {error.field} - {error.message}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setResult(null)}
                className='text-gray-400 hover:text-gray-600'
              >
                <X className='w-5 h-5' />
              </button>
            </div>
          </div>
        )}

        <div className='bg-white rounded-xl shadow-sm p-6'>
          <h3 className='text-lg font-semibold mb-4'>Template Field Description</h3>
          <div className='overflow-x-auto'>
            <table className='w-full text-sm'>
              <thead>
                <tr className='bg-gray-50'>
                  <th className='px-4 py-2 text-left font-medium'>Field Name</th>
                  <th className='px-4 py-2 text-left font-medium'>Required</th>
                  <th className='px-4 py-2 text-left font-medium'>Description</th>
                  <th className='px-4 py-2 text-left font-medium'>Example</th>
                </tr>
              </thead>
              <tbody className='divide-y'>
                <tr><td className='px-4 py-2 font-mono'>sku</td><td className='px-4 py-2'><span className='text-red-500'>*</span></td><td className='px-4 py-2'>Product SKU</td><td className='px-4 py-2'>BS-200</td></tr>
                <tr><td className='px-4 py-2 font-mono'>name_en</td><td className='px-4 py-2'><span className='text-red-500'>*</span></td><td className='px-4 py-2'>English name</td><td className='px-4 py-2'>Digital Body Scale</td></tr>
                <tr><td className='px-4 py-2 font-mono'>name_zh</td><td className='px-4 py-2'><span className='text-red-500'>*</span></td><td className='px-4 py-2'>Chinese name</td><td className='px-4 py-2'>数字体重秤</td></tr>
                <tr><td className='px-4 py-2 font-mono'>slug</td><td className='px-4 py-2'><span className='text-red-500'>*</span></td><td className='px-4 py-2'>URL slug</td><td className='px-4 py-2'>digital-body-scale</td></tr>
                <tr><td className='px-4 py-2 font-mono'>category_slug</td><td className='px-4 py-2'><span className='text-red-500'>*</span></td><td className='px-4 py-2'>Category slug</td><td className='px-4 py-2'>body-scales</td></tr>
                <tr><td className='px-4 py-2 font-mono'>price_min</td><td className='px-4 py-2'>No</td><td className='px-4 py-2'>Minimum price (USD)</td><td className='px-4 py-2'>25.00</td></tr>
                <tr><td className='px-4 py-2 font-mono'>price_max</td><td className='px-4 py-2'>No</td><td className='px-4 py-2'>Maximum price (USD)</td><td className='px-4 py-2'>35.00</td></tr>
                <tr><td className='px-4 py-2 font-mono'>moq</td><td className='px-4 py-2'>No</td><td className='px-4 py-2'>Minimum order quantity</td><td className='px-4 py-2'>100</td></tr>
                <tr><td className='px-4 py-2 font-mono'>lead_time</td><td className='px-4 py-2'>No</td><td className='px-4 py-2'>Lead time</td><td className='px-4 py-2'>15-25 days</td></tr>
                <tr><td className='px-4 py-2 font-mono'>is_active</td><td className='px-4 py-2'>No</td><td className='px-4 py-2'>Active status (1/0)</td><td className='px-4 py-2'>1</td></tr>
                <tr><td className='px-4 py-2 font-mono'>main_images</td><td className='px-4 py-2'>No</td><td className='px-4 py-2'>Main images (comma separated URLs)</td><td className='px-4 py-2'>https://.../img1.jpg,https://.../img2.jpg</td></tr>
                <tr><td className='px-4 py-2 font-mono'>detail_images</td><td className='px-4 py-2'>No</td><td className='px-4 py-2'>Detail images (comma separated URLs)</td><td className='px-4 py-2'>https://.../d1.jpg,https://.../d2.jpg</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className='mt-6 bg-blue-50 rounded-lg p-4'>
          <h4 className='font-medium text-blue-900 mb-2'>Notes:</h4>
          <ul className='text-sm text-blue-700 space-y-1'>
            <li>• Category slugs: body-scales, hanging-scales, kitchen-scales, baby-scales, platform-scales, counting-scales</li>
            <li>• SKU and slug must be unique; the system will automatically update existing products</li>
            <li>• Image URLs can be multiple, separated by commas</li>
            <li>• For best results, use UTF-8 encoded CSV files</li>
          </ul>
        </div>
      </div>
    </div>
  );
}