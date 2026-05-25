import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { data: species, error } = await db.from('SnakeSpecies').select('*').eq('id', id).single();
    if (error) {
      console.error('GET /api/species/[id] error:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch species' }, { status: 500 });
    }
    if (!species) {
      return NextResponse.json({ success: false, error: 'Species not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: species });
  } catch (error) {
    console.error('GET /api/species/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch species' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const {
      name,
      scientificName,
      nepaliName,
      venomous,
      habitat,
      identificationGuide,
      behavior,
      safetyTips,
      emergencyAdvice,
      imageUrl,
    } = body;

    const dataToUpdate: any = {};
    if (name !== undefined) dataToUpdate.name = name;
    if (scientificName !== undefined) dataToUpdate.scientificName = scientificName;
    if (nepaliName !== undefined) dataToUpdate.nepaliName = nepaliName;
    if (venomous !== undefined) dataToUpdate.venomous = venomous;
    if (habitat !== undefined) dataToUpdate.habitat = habitat;
    if (identificationGuide !== undefined) dataToUpdate.identificationGuide = identificationGuide;
    if (behavior !== undefined) dataToUpdate.behavior = behavior;
    if (safetyTips !== undefined) dataToUpdate.safetyTips = safetyTips;
    if (emergencyAdvice !== undefined) dataToUpdate.emergencyAdvice = emergencyAdvice;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;

    const { data: updated, error } = await db
      .from('SnakeSpecies')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      console.error('PATCH /api/species/[id] error:', error);
      return NextResponse.json({ success: false, error: 'Failed to update species' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/species/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update species' }, { status: 500 });
  }
}
