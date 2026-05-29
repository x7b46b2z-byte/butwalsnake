type TelegramOptions = {
  parseMode?: 'Markdown' | 'MarkdownV2' | 'HTML';
  disableWebPagePreview?: boolean;
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export function isTelegramEnabled() {
  return Boolean(TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID);
}

export function getTelegramStatus() {
  return {
    enabled: isTelegramEnabled(),
    botTokenSet: Boolean(TELEGRAM_BOT_TOKEN),
    chatIdSet: Boolean(TELEGRAM_CHAT_ID),
  };
}

export async function sendTelegramMessage(text: string, options: TelegramOptions = {}) {
  if (!isTelegramEnabled()) {
    return { success: false, error: 'Telegram is not configured.' };
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: options.parseMode ?? 'Markdown',
        disable_web_page_preview: options.disableWebPagePreview ?? false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return { success: false, error: `Telegram API error: ${errorText}` };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message || 'Unknown Telegram error' };
  }
}
