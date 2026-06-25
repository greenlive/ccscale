import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        message: 'No file uploaded',
        total: 0,
        imported: 0,
        updated: 0,
        failed: 0
      }, { status: 400 });
    }

    const content = await file.text();
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const uploadResponse = await fetch(`${apiUrl}/products/batch/import`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'text/csv',
      },
      body: content,
    });

    if (uploadResponse.ok) {
      const result = await uploadResponse.json();
      return NextResponse.json(result);
    } else {
      const errorText = await uploadResponse.text();
      return NextResponse.json({
        success: false,
        message: 'Backend API error: ' + errorText,
        total: 0,
        imported: 0,
        updated: 0,
        failed: 0
      }, { status: uploadResponse.status });
    }

  } catch (error) {
    console.error('Batch import error:', error);
    return NextResponse.json({
      success: false,
      message: 'Import failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
      total: 0,
      imported: 0,
      updated: 0,
      failed: 0
    }, { status: 500 });
  }
}
