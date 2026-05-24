import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  async function sendVolunteerApprovedAlert(volunteer: any) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

    const message = `
✅ *NEW VOLUNTEER APPROVED*

👤 *Name:* ${volunteer.name}
📍 *Zone:* ${volunteer.assignedZone || volunteer.municipality}
🏍️ *Vehicle:* ${volunteer.vehicle}
📞 *Contact:* [${volunteer.contact}](tel:${volunteer.contact})
    `.trim();

    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
    } catch (error) {
      console.error('Error sending Telegram alert:', error);
    }
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, imageUrl, isAvailableNow, assignedZone } = body;

    const dataToUpdate: any = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (imageUrl !== undefined) dataToUpdate.imageUrl = imageUrl;
    if (isAvailableNow !== undefined) dataToUpdate.isAvailableNow = isAvailableNow;
    if (assignedZone !== undefined) dataToUpdate.assignedZone = assignedZone;

    const updated = await db.volunteer.update({
      where: { id },
      data: dataToUpdate,
    });

    if (status === 'APPROVED') {
      sendVolunteerApprovedAlert(updated);
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/volunteer/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update volunteer' }, { status: 500 });
  }
}
