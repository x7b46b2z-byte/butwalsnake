import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, contact, address, municipality, experience, vehicle, availableTime, skills, emergencyAvailability } = body;

    if (!name || !contact) {
      return NextResponse.json({ success: false, error: 'name and contact are required' }, { status: 400 });
    }

    const volunteer = await db.volunteer.create({
      data: {
        name,
        contact,
        address: address || '',
        municipality: municipality || 'Butwal',
        experience: experience || 'Beginner',
        vehicle: vehicle || 'None',
        availableTime: availableTime || 'Anytime',
        skills: skills || '',
        emergencyAvailability: emergencyAvailability || 'Yes',
        status: 'PENDING',
      },
    });

    return NextResponse.json({ success: true, data: volunteer }, { status: 201 });
  } catch (error) {
    console.error('POST /api/volunteer error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit volunteer application' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const where = status ? { status } : {};
    const volunteers = await db.volunteer.findMany({ where, orderBy: { createdAt: 'desc' } });
    return NextResponse.json({ success: true, data: volunteers });
  } catch (error) {
    console.error('GET /api/volunteer error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch volunteers' }, { status: 500 });
  }
}
