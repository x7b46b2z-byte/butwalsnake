import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status');

    let query = db.from('BlogPost').select('*', { count: 'exact' });
    if (status) query = query.eq('status', status);

    const { data: blogs, count, error } = await query
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('GET /api/blog error:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: blogs ?? [], total: count ?? 0 });
  } catch (error) {
    console.error('GET /api/blog error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, slug, content, category, author, tags, status, imageUrl } = body;

    if (!title || !slug || !content) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const { data: blog, error } = await db
      .from('BlogPost')
      .insert({
        title,
        slug,
        content,
        category: category || 'News',
        author: author || 'Admin',
        tags: tags || '',
        status: status || 'PUBLISHED',
        imageUrl: imageUrl || null,
      })
      .select()
      .single();

    if (error || !blog) {
      console.error('POST /api/blog error:', error);
      return NextResponse.json({ success: false, error: 'Failed to create blog post' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    console.error('POST /api/blog error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create blog post' }, { status: 500 });
  }
}
