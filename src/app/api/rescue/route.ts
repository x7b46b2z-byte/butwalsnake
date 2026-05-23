import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const where = status ? { status } : {};
    const rescues = await db.rescueRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return NextResponse.json({ success: true, data: rescues });
  } catch (error) {
    console.error('GET /api/rescue error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch rescue requests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, municipality, address, lat, lng, notes, stillPresent } = body;

    if (!name || !phone || !address) {
      return NextResponse.json(
        { success: false, error: 'name, phone, and address are required' },
        { status: 400 }
      );
    }

    const rescue = await db.rescueRequest.create({
      data: {
        name,
        phone,
        municipality: municipality || 'Butwal',
        address,
        lat: lat ? parseFloat(lat) : 0,
        lng: lng ? parseFloat(lng) : 0,
        stillPresent: stillPresent || 'Yes',
        notes: notes || null,
        status: 'PENDING',
        priority: 'HIGH',
      },
    });

    return NextResponse.json({ success: true, data: rescue }, { status: 201 });
  } catch (error) {
    console.error('POST /api/rescue error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create rescue request' }, { status: 500 });
  }
}
