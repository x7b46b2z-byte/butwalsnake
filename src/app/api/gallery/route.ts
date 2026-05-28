import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = db.from('GalleryItem').select('*');
    if (category && category !== 'ALL') query = query.eq('category', category);

    const { data: items, error } = await query.order('createdAt', { ascending: false }).limit(limit);
    if (error) {
      console.error('GET /api/gallery error:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch gallery items' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: items ?? [] });
  } catch (error) {
    console.error('GET /api/gallery error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, caption, category, location } = body;
    const trimmedImageUrl = typeof imageUrl === 'string' ? imageUrl.trim() : '';
    const trimmedCaption = typeof caption === 'string' ? caption.trim() : '';
    const categoryValue = typeof category === 'string' && category.trim() ? category.trim() : 'RESCUE';
    const trimmedLocation = typeof location === 'string' ? location.trim() : '';

    if (!trimmedImageUrl || !trimmedCaption) {
      return NextResponse.json({ success: false, error: 'Image URL and caption are required.' }, { status: 400 });
    }

    const insertPayload: Record<string, unknown> = {
      imageUrl: trimmedImageUrl,
      caption: trimmedCaption,
      category: categoryValue,
    };

    if (trimmedLocation) insertPayload.location = trimmedLocation;

    const { data: item, error } = await db
      .from('GalleryItem')
      .insert({
        id: randomUUID(),
        ...insertPayload,
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !item) {
      console.error('POST /api/gallery error:', error);
      return NextResponse.json({ success: false, error: error?.message || 'Failed to add gallery item' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('POST /api/gallery error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add gallery item' }, { status: 500 });
  }
}
