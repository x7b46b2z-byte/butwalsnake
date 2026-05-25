import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const venomous = searchParams.get('venomous');
    const search = searchParams.get('search');

    let query = db.from('SnakeSpecies').select('*');
    if (venomous === 'true') query = query.eq('venomous', true);
    if (venomous === 'false') query = query.eq('venomous', false);
    if (search) {
      const searchValue = `%${search}%`;
      query = query.or(
        `name.ilike.${searchValue},scientificName.ilike.${searchValue},nepaliName.ilike.${searchValue}`
      );
    }

    const { data: species, error } = await query.order('venomous', { ascending: false }).order('name', { ascending: true });
    if (error) {
      console.error('GET /api/species error:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch species' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: species ?? [] });
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

    const { data: species, error } = await db
      .from('SnakeSpecies')
      .insert({
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
      })
      .select()
      .single();

    if (error || !species) {
      console.error('POST /api/species error:', error);
      return NextResponse.json({ success: false, error: 'Failed to create species' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: species }, { status: 201 });
  } catch (error) {
    console.error('POST /api/species error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create species' }, { status: 500 });
  }
}
