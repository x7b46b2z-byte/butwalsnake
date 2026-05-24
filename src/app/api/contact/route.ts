import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !message) {
      return NextResponse.json({ success: false, error: 'Name and message are required' }, { status: 400 });
    }

    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      const telegramMessage = `
📩 *NEW CONTACT FORM MESSAGE*

👤 *Name:* ${name}
📞 *Phone:* ${phone || 'Not provided'}
✉️ *Email:* ${email || 'Not provided'}
📌 *Subject:* ${subject || 'Not provided'}

💬 *Message:*
${message}
      `.trim();

      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: telegramMessage,
          parse_mode: 'Markdown',
        }),
      });
    }

    // You can also choose to save this to DB if a ContactMessage model is created later.
    // For now, we are just sending it to Telegram.

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('POST /api/contact error:', error);
    return NextResponse.json({ success: false, error: 'Failed to submit contact form' }, { status: 500 });
  }
}
