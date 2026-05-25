import { NextRequest, NextResponse } from 'next/server';
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

    if (!imageUrl || !caption || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { data: item, error } = await db
      .from('GalleryItem')
      .insert({
        imageUrl,
        caption,
        category,
        location: location || '',
      })
      .select()
      .single();

    if (error || !item) {
      console.error('POST /api/gallery error:', error);
      return NextResponse.json({ success: false, error: 'Failed to add gallery item' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error('POST /api/gallery error:', error);
    return NextResponse.json({ success: false, error: 'Failed to add gallery item' }, { status: 500 });
  }
}
