import { NextRequest, NextResponse } from 'next/server';
import { getTelegramStatus, sendTelegramMessage } from '@/lib/telegram';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !message) {
      return NextResponse.json({ success: false, error: 'Name and message are required' }, { status: 400 });
    }

    if (getTelegramStatus().enabled) {
      const telegramMessage = `
📩 *NEW CONTACT FORM MESSAGE*

👤 *Name:* ${name}
📞 *Phone:* ${phone || 'Not provided'}
✉️ *Email:* ${email || 'Not provided'}
📌 *Subject:* ${subject || 'Not provided'}

💬 *Message:*
${message}
      `.trim();

      const result = await sendTelegramMessage(telegramMessage, { parseMode: 'Markdown' });
      if (!result.success) {
        console.error('Failed to send Telegram contact alert:', result.error);
      }
    }

    // You can also choose to save this to DB if a ContactMessage model is created later.
    // For now, we are just sending it to Telegram.

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit contact form' }, { status: 500 });
  }
}
