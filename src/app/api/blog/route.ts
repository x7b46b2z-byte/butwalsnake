import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // On admin, we might want to fetch all regardless of status, but for now we'll allow an admin param or just fetch all if no status is specified
    const status = searchParams.get('status') || undefined;
    const where = status ? { status } : {};

    const [blogs, total] = await Promise.all([
      db.blogPost.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.blogPost.count({ where }),
    ]);

    return NextResponse.json({ success: true, data: blogs, total });
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

    const blog = await db.blogPost.create({
      data: {
        title,
        slug,
        content,
        category: category || 'News',
        author: author || 'Admin',
        tags: tags || '',
        status: status || 'PUBLISHED',
        imageUrl: imageUrl || null,
      },
    });

    return NextResponse.json({ success: true, data: blog }, { status: 201 });
  } catch (error) {
    console.error('POST /api/blog error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create blog post' }, { status: 500 });
  }
}
