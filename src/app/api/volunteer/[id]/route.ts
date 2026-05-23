import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, imageUrl, isAvailableNow, assignedZone } = body;

    const dataToUpdate: any = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;
    if (isAvailableNow !== undefined) dataToUpdate.isAvailableNow = isAvailableNow;
    if (assignedZone !== undefined) dataToUpdate.assignedZone = assignedZone;

    const updated = await db.volunteer.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/volunteer/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update volunteer' }, { status: 500 });
  }
}
