import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const SYSTEM_PROMPT = `You are an expert herpetologist specializing in snakes found in Nepal, particularly in the Rupandehi district (Butwal, Tilottama, Siddharthanagar, Devdaha areas). 
Analyze the uploaded image and respond ONLY with a valid JSON object (no markdown, no code fences).

If it IS a snake image, respond with:
{
  "identified": true,
  "name": "Common Name",
  "scientificName": "Scientific Name",
  "dangerLevel": "HIGHLY VENOMOUS" | "MILDLY VENOMOUS" | "NON-VENOMOUS",
  "dangerScore": <number 0-10>,
  "description": "2-3 sentence description including physical characteristics and behavior.",
  "firstAidSteps": ["step 1", "step 2", "step 3", "step 4", "step 5"],
  "doNots": ["don't do this 1", "don't do this 2", "don't do this 3"],
  "localPresence": "Common / Rare / Occasional in Rupandehi",
  "confidence": "High / Medium / Low"
}

If it is NOT a snake image, respond with:
{
  "identified": false,
  "name": "Not a Snake",
  "scientificName": "",
  "dangerLevel": "UNKNOWN",
  "dangerScore": 0,
  "description": "The uploaded image does not appear to contain a snake. Please upload a clear photo of a snake.",
  "firstAidSteps": [],
  "doNots": [],
  "localPresence": "N/A",
  "confidence": "N/A"
}`;

export async function POST(req: NextRequest) {
  if (!GEMINI_API_KEY) {
    return NextResponse.json({ success: false, error: 'AI service not configured. Please add GEMINI_API_KEY to .env.' }, { status: 500 });
  }

  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ success: false, error: 'No image provided.' }, { status: 400 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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
            temperature: 0.2,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      console.error('Gemini API error:', errData);
      return NextResponse.json({ success: false, error: 'AI service error. Please try again.' }, { status: 500 });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Strip markdown code fences if Gemini adds them
    const cleaned = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const parsed = JSON.parse(cleaned);

    return NextResponse.json({ success: true, result: parsed });
  } catch (err) {
    console.error('AI Identifier error:', err);
    return NextResponse.json({ success: false, error: 'Failed to analyze image. Please try again.' }, { status: 500 });
  }
}
