import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.galleryItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/gallery/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
