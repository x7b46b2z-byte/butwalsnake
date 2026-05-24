import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

// ONE-TIME USE: Delete this file after running!
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== 'init-bsr-2024') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const hash = await bcrypt.hash('mnbvcxzas', 10);

  // Try to update any existing admin (old email or old username)
  const updated1 = await db.user.updateMany({
    where: { email: 'admin@butwalsnakerescue.org' },
    data: { email: 'kaati', password: hash, name: 'BSR Admin' }
  });

  const updated2 = await db.user.updateMany({
    where: { email: 'bsr_admin' },
    data: { email: 'kaati', password: hash, name: 'BSR Admin' }
  });

  const totalUpdated = updated1.count + updated2.count;

  if (totalUpdated === 0) {
    // No existing user found, create fresh
    await db.user.upsert({
      where: { email: 'kaati' },
      update: { password: hash, name: 'BSR Admin' },
      create: { email: 'kaati', password: hash, name: 'BSR Admin', role: 'SUPER_ADMIN' }
    });
    return NextResponse.json({ success: true, action: 'created', username: 'kaati' });
  }

  return NextResponse.json({ success: true, action: 'updated', count: totalUpdated, username: 'kaati' });
}
