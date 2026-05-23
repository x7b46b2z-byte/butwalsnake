import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where = category && category !== 'ALL' ? { category } : {};

    const items = await db.galleryItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ success: true, data: items });
  } catch (error) {
    console.error('GET /api/gallery error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, caption, category, location } = body;

    if (!imageUrl || !caption || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const item = await db.galleryItem.create({
      data: {
        imageUrl,
        caption,
        category,
        location: location || '',
      },
    });

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('POST /api/gallery error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add gallery item' }, { status: 500 });
  }
}
