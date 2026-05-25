import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, contact, address, municipality, experience, vehicle, availableTime, skills, emergencyAvailability, imageUrl, assignedZone, isAvailableNow, status, description } = body;

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!name || !contact) {
      return NextResponse.json({ success: false, error: 'name and contact are required' }, { status: 400 });
    }

    const { data: volunteer, error } = await db
      .from('Volunteer')
      .insert({
        name,
        contact,
        address: address || '',
        municipality: municipality || 'Butwal',
        experience: experience || 'Beginner',
        vehicle: vehicle || 'None',
        availableTime: availableTime || 'Anytime',
        skills: skills || '',
        emergencyAvailability: emergencyAvailability || 'Yes',
        status: status || 'PENDING',
        imageUrl: imageUrl || null,
        assignedZone: assignedZone || null,
        isAvailableNow: isAvailableNow || false,
        description: description || null,
      })
      .select()
      .single();

    if (error || !volunteer) {
      console.error('POST /api/volunteer error:', error);
      return NextResponse.json({ success: false, error: 'Failed to submit volunteer application' }, { status: 500 });
    }

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const telegramMessage = `
🆕 *NEW VOLUNTEER APPLICATION*

👤 *Name:* ${volunteer.name}
📍 *Address:* ${volunteer.address}, ${volunteer.municipality}
📞 *Contact:* [${volunteer.contact}](tel:${volunteer.contact})
🚗 *Vehicle:* ${volunteer.vehicle}
⏱️ *Available:* ${volunteer.availableTime}

Please review this application in the Admin Dashboard.
      `.trim();

      try {
        const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: telegramMessage,
            parse_mode: 'Markdown',
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Failed to send Telegram volunteer alert:', errorText);
        }
      } catch (error) {
        console.error('Error sending Telegram volunteer alert:', error);
      }
    }

    return NextResponse.json({ success: true, data: volunteer }, { status: 201 });
  } catch (error) {
    console.error('POST /api/volunteer error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit volunteer application' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const isAvailableNow = searchParams.get('isAvailableNow');

    let query = db.from('Volunteer').select('*');
    if (status) query = query.eq('status', status);
    if (isAvailableNow === 'true') query = query.eq('isAvailableNow', true);

    const { data: volunteers, error } = await query.order('createdAt', { ascending: false });
    if (error) {
      console.error('GET /api/volunteer error:', error);
      return NextResponse.json({ success: false, error: 'Failed to fetch volunteers' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data: volunteers ?? [] });
  } catch (error) {
    console.error('GET /api/volunteer error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch volunteers' }, { status: 500 });
  }
}
