import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const species = await db.snakeSpecies.findUnique({ where: { id } });
    if (!species) {
      return NextResponse.json({ success: false, error: 'Species not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: species });
  } catch (error) {
    console.error('GET /api/species/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch species' }, { status: 500 });
  }
}
