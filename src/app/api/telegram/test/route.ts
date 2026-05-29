import { NextResponse } from 'next/server';
import { getTelegramStatus, sendTelegramMessage } from '@/lib/telegram';

export async function POST() {
  const status = getTelegramStatus();
  if (!status.enabled) {
    return NextResponse.json({ success: false, error: 'Telegram is not configured.' }, { status: 400 });
  }

  const result = await sendTelegramMessage('✅ *Telegram test message from Butwal Snake Rescue app.*\n\nThis confirms that Telegram alerts are working.');
  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
