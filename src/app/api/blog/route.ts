import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

function normalizeSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

async function ensureUniqueSlug(baseSlug: string) {
  let slug = baseSlug;
  let suffix = 1;

  while (true) {
    const { data, error } = await db.from('BlogPost').select('id').eq('slug', slug);
    if (error) {
      console.error('Slug uniqueness check failed:', error);
      return slug;
    }
    if (!data || data.length === 0) {
      return slug;
    }
    slug = `${baseSlug}-${suffix++}`;
  }
}

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

    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const normalizedSlug = normalizeSlug((slug || title || '').toString()) || `${Date.now()}`;
    const uniqueSlug = await ensureUniqueSlug(normalizedSlug);

    const { data: blog, error } = await db
      .from('BlogPost')
      .insert({
        title,
        slug: uniqueSlug,
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
