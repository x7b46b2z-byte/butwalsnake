This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, create a local environment file from the example and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

If you are using Windows CMD or PowerShell, use:

```powershell
Copy-Item .env.example .env.local
```

Then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### AI identifier

If you use the AI identifier feature, set `GEMINI_API_KEY` in `.env.local`. Without that key, `/api/ai-identify` returns:

`GEMINI_API_KEY is not configured in environment variables.`

Important: `.env.local` overrides `.env`. If `.env.local` contains `GEMINI_API_KEY=` with no value, the app will treat it as missing even if `.env` has a value.

This is separate from Supabase and only required for the AI image recognition feature.

### Telegram setup

If you want app alerts via Telegram, set both `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env.local`.

1. Create a bot with [@BotFather](https://t.me/BotFather) and copy the bot token.
2. Add the bot to the chat or group where you want alerts.
3. Send a message in that chat.
4. Open this URL in your browser:

```bash
https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
```

5. Find the `chat.id` value in the JSON response. That is your `TELEGRAM_CHAT_ID`.

- For private chats, it is usually a positive number.
- For groups, it is usually a negative number.

Alternatively, use a Telegram bot such as [@getidsbot](https://t.me/getidsbot) or [@userinfobot](https://t.me/userinfobot) to retrieve the chat ID.

After configuration, the admin dashboard includes a Telegram alert panel where you can verify the integration and send a test alert directly from the app.

Then restart the dev server.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
