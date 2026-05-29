import { NextResponse } from 'next/server';
import { getTelegramStatus } from '@/lib/telegram';

export async function GET() {
  const status = getTelegramStatus();
  return NextResponse.json({ success: true, data: status });
}
