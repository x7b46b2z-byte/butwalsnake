import { NextRequest, NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are an expert herpetologist specializing in snakes found in Nepal, particularly in the Rupandehi district (Butwal, Tilottama, Siddharthanagar, Devdaha areas). 
Analyze the uploaded image and respond ONLY with a valid JSON object (no markdown, no code fences, no explanation).

If it IS a snake image, respond with exactly this structure:
{"identified":true,"name":"Common Name","scientificName":"Scientific Name","dangerLevel":"HIGHLY VENOMOUS","dangerScore":9,"description":"Description here.","firstAidSteps":["Step 1","Step 2","Step 3"],"doNots":["Do not 1","Do not 2"],"localPresence":"Common in Rupandehi","confidence":"High"}

dangerLevel must be exactly one of: HIGHLY VENOMOUS, MILDLY VENOMOUS, NON-VENOMOUS

If it is NOT a snake image:
{"identified":false,"name":"Not a Snake","scientificName":"","dangerLevel":"NON-VENOMOUS","dangerScore":0,"description":"The uploaded image does not appear to contain a snake.","firstAidSteps":[],"doNots":[],"localPresence":"N/A","confidence":"N/A"}`;

export async function POST(req: NextRequest) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  // Debug: log whether key exists
  console.log('GEMINI_API_KEY present:', !!GEMINI_API_KEY);
  console.log('GEMINI_API_KEY prefix:', GEMINI_API_KEY?.substring(0, 8));

  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_KEY_HERE') {
    return NextResponse.json(
      { success: false, error: 'GEMINI_API_KEY is not set in environment variables.' },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ success: false, error: 'No image provided.' }, { status: 400 });
    }

    console.log('Calling Gemini API with mimeType:', mimeType, 'imageBase64 length:', imageBase64.length);

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: SYSTEM_PROMPT },
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: imageBase64,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1024,
            responseMimeType: 'application/json',
          },
        }),
      }
    );

    const responseText = await geminiRes.text();
    console.log('Gemini HTTP status:', geminiRes.status);
    console.log('Gemini raw response (first 500 chars):', responseText.substring(0, 500));

    if (!geminiRes.ok) {
      let errDetail = responseText;
      try { errDetail = JSON.parse(responseText)?.error?.message || responseText; } catch {}
      console.error('Gemini API error detail:', errDetail);
      return NextResponse.json(
        { success: false, error: `Gemini API Error: ${errDetail}` },
        { status: 500 }
      );
    }

    const data = JSON.parse(responseText);
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    console.log('Raw Gemini text:', rawText.substring(0, 300));

    // Clean markdown code fences if present
    const cleaned = rawText
      .replace(/```json\n?/gi, '')
      .replace(/```\n?/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseErr) {
      console.error('JSON parse failed. Raw text was:', rawText);
      return NextResponse.json(
        { success: false, error: `AI returned invalid JSON. Raw: ${rawText.substring(0, 200)}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, result: parsed });
  } catch (err: any) {
    console.error('Unhandled AI Identifier error:', err);
    return NextResponse.json(
      { success: false, error: `Server error: ${err?.message || String(err)}` },
      { status: 500 }
    );
  }
}
