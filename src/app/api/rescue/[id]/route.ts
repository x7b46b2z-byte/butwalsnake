import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  async function sendRescueUpdateAlert(rescue: any, oldRescue: any) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

    const changes = [];
    if (oldRescue.status !== rescue.status) {
      changes.push(`*Status:* ${oldRescue.status} ➡️ ${rescue.status}`);
    }
    if (oldRescue.assignedToName !== rescue.assignedToName) {
      changes.push(`*Rescuer Assigned:* ${rescue.assignedToName || 'None'}`);
    }
    if (oldRescue.priority !== rescue.priority) {
      changes.push(`*Priority:* ${oldRescue.priority} ➡️ ${rescue.priority}`);
    }

    const message = `
🔄 *RESCUE UPDATE — ${rescue.municipality}*

${changes.length > 0 ? changes.join('\n') : '*Rescue details updated.*'}
*Reporter:* ${rescue.name}
*Address:* ${rescue.address}
`.trim();

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Failed to send Telegram rescue update alert:', errText);
      }
    } catch (error) {
      console.error('Error sending Telegram alert:', error);
    }
  }
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, assignedToName, rescueNotes, priority } = body;

    const { data: existing, error: fetchError } = await db.from('RescueRequest').select('*').eq('id', id).single();
    if (fetchError) {
      console.error('PATCH /api/rescue/[id] error:', fetchError);
      if (!existing) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    }
    if (!existing) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });

    const dataToUpdate: any = {};
    if (status !== undefined) dataToUpdate.status = status;
    if (assignedToName !== undefined) dataToUpdate.assignedToName = assignedToName;
    if (rescueNotes !== undefined) dataToUpdate.rescueNotes = rescueNotes;
    if (priority !== undefined) dataToUpdate.priority = priority;
    dataToUpdate.updatedAt = new Date().toISOString();

    const { data: updated, error } = await db
      .from('RescueRequest')
      .update(dataToUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error || !updated) {
      console.error('PATCH /api/rescue/[id] error:', error);
      return NextResponse.json({ success: false, error: 'Failed to update rescue request' }, { status: 500 });
    }

    if (status !== undefined || assignedToName !== undefined || priority !== undefined) {
      sendRescueUpdateAlert(updated, existing);
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
    const { data: rescue, error } = await db.from('RescueRequest').select('*').eq('id', id).single();
    if (error) {
      console.error('GET /api/rescue/[id] error:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch rescue request' }, { status: 500 });
    }
    if (!rescue) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: rescue });
  } catch (error) {
    console.error('GET /api/rescue/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch rescue request' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  async function sendRescueDeleteAlert(rescue: any) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

    const message = `
🗑️ *RESCUE REQUEST REMOVED — ${rescue.municipality}*

*Reporter:* ${rescue.name}
*Address:* ${rescue.address}
*Status:* ${rescue.status}
`.trim();

    try {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown',
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error('Failed to send Telegram rescue delete alert:', errText);
      }
    } catch (error) {
      console.error('Error sending Telegram alert:', error);
    }
  }

  try {
    const { id } = await params;
    const { data: rescue, error } = await db.from('RescueRequest').select('*').eq('id', id).single();
    if (error || !rescue) {
      console.error('DELETE /api/rescue/[id] error:', error);
      return NextResponse.json({ success: false, error: 'Rescue request not found' }, { status: 404 });
    }

    const { error: deleteError } = await db.from('RescueRequest').delete().eq('id', id);
    if (deleteError) {
      console.error('DELETE /api/rescue/[id] error:', deleteError);
      return NextResponse.json({ success: false, error: 'Failed to delete rescue request' }, { status: 500 });
    }

    sendRescueDeleteAlert(rescue);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/rescue/[id] error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete rescue request' }, { status: 500 });
  }
}
