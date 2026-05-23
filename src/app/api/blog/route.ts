import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const [blogs, total] = await Promise.all([
      db.blogPost.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      db.blogPost.count({ where: { status: 'PUBLISHED' } }),
    ]);

    return NextResponse.json({ success: true, data: blogs, total });
  } catch (error) {
    console.error('GET /api/blog error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 });
  }
}
