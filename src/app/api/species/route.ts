import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const venomous = searchParams.get('venomous');
    const search = searchParams.get('search');

    const where: Record<string, unknown> = {};
    if (venomous === 'true') where.venomous = true;
    if (venomous === 'false') where.venomous = false;
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { scientificName: { contains: search } },
        { nepaliName: { contains: search } },
      ];
    }

    const species = await db.snakeSpecies.findMany({
      where,
      orderBy: [{ venomous: 'desc' }, { name: 'asc' }],
    });

    return NextResponse.json({ success: true, data: species });
  } catch (error) {
    console.error('GET /api/species error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch species' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, scientificName, nepaliName, venomous, habitat, identificationGuide, behavior, safetyTips, emergencyAdvice, imageUrl } = body;

    if (!name || !scientificName || !nepaliName) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const species = await db.snakeSpecies.create({
      data: {
        name,
        scientificName,
        nepaliName,
        venomous: !!venomous,
        habitat: habitat || '',
        identificationGuide: identificationGuide || '',
        behavior: behavior || '',
        safetyTips: safetyTips || '',
        emergencyAdvice: emergencyAdvice || '',
        imageUrl: imageUrl || '',
      },
    });

    return NextResponse.json({ success: true, data: species }, { status: 201 });
  } catch (error) {
    console.error('POST /api/species error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create species' }, { status: 500 });
  }
}
