import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

// ONE-TIME USE: Delete this file after running!
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== 'init-bsr-2024') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const hash = await bcrypt.hash('rescue@99', 10);

  // Try to update the old admin
  const updated = await db.user.updateMany({
    where: { email: 'admin@butwalsnakerescue.org' },
    data: { email: 'bsr_admin', password: hash, name: 'BSR Admin' }
  });

  if (updated.count === 0) {
    // Create fresh if no old user
    await db.user.upsert({
      where: { email: 'bsr_admin' },
      update: { password: hash, name: 'BSR Admin' },
      create: { email: 'bsr_admin', password: hash, name: 'BSR Admin', role: 'SUPER_ADMIN' }
    });
    return NextResponse.json({ success: true, action: 'created', username: 'bsr_admin' });
  }

  return NextResponse.json({ success: true, action: 'updated', count: updated.count, username: 'bsr_admin' });
}
