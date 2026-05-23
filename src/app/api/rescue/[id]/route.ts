import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, assignedToName, rescueNotes, priority } = body;

    const updated = await db.rescueRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(assignedToName !== undefined && { assignedToName }),
        ...(rescueNotes !== undefined && { rescueNotes }),
        ...(priority && { priority }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/rescue/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update rescue request' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rescue = await db.rescueRequest.findUnique({ where: { id } });
    if (!rescue) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: rescue });
  } catch (error) {
    console.error('GET /api/rescue/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch rescue request' }, { status: 500 });
  }
}
