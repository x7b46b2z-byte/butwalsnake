import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { db } from '@/lib/db';
import { getTelegramStatus, sendTelegramMessage } from '@/lib/telegram';

async function sendTelegramAlert(rescue: any) {
  if (!getTelegramStatus().enabled) {
    console.warn('Telegram credentials not set. Skipping volunteer alert.');
    return;
  }

  const mapLink = `https://www.google.com/maps/search/?api=1&query=${rescue.lat},${rescue.lng}`;
  const addressText = rescue.lat ? `[${rescue.address}](${mapLink})` : rescue.address;

  const message = `
🚨 *NEW SNAKE RESCUE EMERGENCY* 🚨

👤 *Reporter:* ${rescue.name}
📞 *Phone:* [${rescue.phone}](tel:${rescue.phone})
📍 *Municipality:* ${rescue.municipality}
🏠 *Address/Landmark:* ${addressText}
📝 *Notes:* ${rescue.notes || 'No extra notes provided.'}
⏱️ *Time:* ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Kathmandu' })}

⚠️ *Please reply in the group if you are responding to this incident!*
  `.trim();

  const result = await sendTelegramMessage(message, { parseMode: 'Markdown', disableWebPagePreview: false });
  if (!result.success) {
    console.error('Failed to send Telegram alert:', result.error);
  } else {
    console.log('Telegram alert sent successfully to group.');
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');

    let query = db.from('RescueRequest').select('*');
    if (status) query = query.eq('status', status);

    const { data: rescues, error } = await query.order('createdAt', { ascending: false }).limit(limit);

    if (error) {
      console.error('GET /api/rescue error:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch rescue requests' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: rescues ?? [] });
  } catch (error) {
    console.error('GET /api/rescue error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch rescue requests' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, municipality, address, lat, lng, notes, stillPresent } = body;

    if (!name || !phone || !address) {
      return NextResponse.json(
        { success: false, error: 'name, phone, and address are required' },
        { status: 400 }
      );
    }

    const { data: rescue, error } = await db
      .from('RescueRequest')
      .insert({
        id: randomUUID(),
        name,
        phone,
        municipality: municipality || 'Butwal',
        address,
        lat: lat ? parseFloat(lat) : 0,
        lng: lng ? parseFloat(lng) : 0,
        stillPresent: stillPresent || 'Yes',
        notes: notes || null,
        status: 'PENDING',
        priority: 'HIGH',
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (error || !rescue) {
      console.error('POST /api/rescue error:', error);
      return NextResponse.json({ success: false, error: error?.message || 'Failed to create rescue request' }, { status: 500 });
    }

    sendTelegramAlert(rescue);

    return NextResponse.json({ success: true, data: rescue }, { status: 201 });
  } catch (error) {
    console.error('POST /api/rescue error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create rescue request' }, { status: 500 });
  }
}
