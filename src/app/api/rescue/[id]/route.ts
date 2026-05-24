import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  async function sendRescueUpdateAlert(rescue: any, oldStatus: string) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

    const message = `
🔄 *RESCUE UPDATE — ${rescue.municipality}*

*Status:* ${oldStatus} ➡️ ${rescue.status}
*Reporter:* ${rescue.name}
*Rescuer Assigned:* ${rescue.assignedToName || 'None'}
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
    const { status, assignedToName, rescueNotes, priority } = body;

    const existing = await db.rescueRequest.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    const updated = await db.rescueRequest.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(assignedToName !== undefined && { assignedToName }),
        ...(rescueNotes !== undefined && { rescueNotes }),
        ...(priority && { priority }),
        updatedAt: new Date(),
      },
    });

    if (status && status !== existing.status) {
      sendRescueUpdateAlert(updated, existing.status);
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('PATCH /api/rescue/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update rescue request' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rescue = await db.rescueRequest.findUnique({ where: { id } });
    if (!rescue) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: rescue });
  } catch (error) {
    console.error('GET /api/rescue/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch rescue request' }, { status: 500 });
  }
}
