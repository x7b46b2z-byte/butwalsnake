import { NextRequest, NextResponse } from 'next/server';

const HF_TOKEN = process.env.HF_TOKEN;

// Known snake species with detailed info for Rupandehi / Nepal region
const SNAKE_DATABASE: Record<string, any> = {
  'king cobra': {
    name: 'King Cobra',
    scientificName: 'Ophiophagus hannah',
    dangerLevel: 'HIGHLY VENOMOUS',
    dangerScore: 10,
    description: 'The world\'s longest venomous snake, reaching up to 5.5m. Recognized by its hood and olive-brown scales. Found in forests and agricultural areas of Rupandehi.',
    firstAidSteps: [
      'Call emergency immediately — 112 or Butwal Snake Rescuers',
      'Keep the victim completely still — movement spreads venom faster',
      'Immobilize and keep the bitten limb at or below heart level',
      'Remove watches, rings, tight clothing near the bite area',
      'Rush to nearest hospital with anti-venom (BP Koirala, Lumbini Zone)',
    ],
    doNots: ['Do NOT cut the wound or suck venom', 'Do NOT apply tourniquet', 'Do NOT give alcohol or medication', 'Do NOT use ice or cold water'],
    localPresence: 'Rare in Rupandehi',
  },
  'cobra': {
    name: 'Indian Cobra (Nag)',
    scientificName: 'Naja naja',
    dangerLevel: 'HIGHLY VENOMOUS',
    dangerScore: 9,
    description: 'Iconic spectacled cobra common across Nepal\'s terai including Rupandehi. Identifiable by its spectacle hood marking. Highly venomous neurotoxic venom.',
    firstAidSteps: [
      'Call 112 or Butwal Snake Rescuers immediately',
      'Keep victim calm and completely still',
      'Immobilize the bitten limb — splint if possible',
      'Mark swelling boundary with pen to track spread',
      'Transport urgently to hospital — anti-venom available',
    ],
    doNots: ['Do NOT cut wound or suck venom', 'Do NOT apply tourniquet', 'Do NOT apply herbs or home remedies', 'Do NOT let victim walk'],
    localPresence: 'Very Common in Rupandehi',
  },
  'krait': {
    name: 'Common Krait',
    scientificName: 'Bungarus caeruleus',
    dangerLevel: 'HIGHLY VENOMOUS',
    dangerScore: 9,
    description: 'Extremely dangerous nocturnal snake. Black and white banded pattern. Bite is often painless, making it deceptively dangerous. Causes respiratory failure.',
    firstAidSteps: [
      'Treat as extreme emergency even if bite feels painless',
      'Call 112 immediately — respiratory failure can occur in hours',
      'Keep victim lying down, do not allow walking',
      'Monitor breathing continuously',
      'Rush to hospital — anti-venom is critical',
    ],
    doNots: ['Do NOT ignore painless bites at night', 'Do NOT let victim sleep untreated', 'Do NOT apply tourniquet', 'Do NOT cut wound'],
    localPresence: 'Common in Rupandehi',
  },
  'rat snake': {
    name: 'Oriental Rat Snake (Dhaman)',
    scientificName: 'Ptyas mucosa',
    dangerLevel: 'NON-VENOMOUS',
    dangerScore: 1,
    description: 'Large, fast-moving non-venomous snake. Very common in Rupandehi. Excellent rodent predator and beneficial to farmers. Can grow up to 2m.',
    firstAidSteps: [
      'Wash bite area thoroughly with soap and water for 10 minutes',
      'Apply antiseptic to prevent infection',
      'Get tetanus shot if not updated in 5 years',
      'Monitor for any allergic reaction',
      'Contact Butwal Snake Rescuers for safe relocation',
    ],
    doNots: ['Do NOT kill the snake — it is beneficial', 'Do NOT panic — bite is non-venomous', 'Do NOT apply herbs or mud on wound'],
    localPresence: 'Very Common in Rupandehi',
  },
  'python': {
    name: 'Indian Rock Python',
    scientificName: 'Python molurus',
    dangerLevel: 'NON-VENOMOUS',
    dangerScore: 2,
    description: 'Protected species. Non-venomous but powerful constrictor. Large heavy-bodied snake found near water bodies and forests in Rupandehi.',
    firstAidSteps: [
      'Do NOT try to remove python by pulling — relax the body',
      'Unwind from the tail end if constricting',
      'Wash bite wound with soap and water',
      'Seek tetanus shot',
      'Call Butwal Snake Rescuers for relocation — it is a protected species',
    ],
    doNots: ['Do NOT kill — protected by Wildlife Act', 'Do NOT pull python away — may cause injury', 'Do NOT keep as pet'],
    localPresence: 'Occasional in Rupandehi',
  },
  'green snake': {
    name: 'Green Vine Snake',
    scientificName: 'Ahaetulla nasuta',
    dangerLevel: 'MILDLY VENOMOUS',
    dangerScore: 3,
    description: 'Slender bright green snake. Rear-fanged with mild venom — not considered dangerous to healthy adults. Common in shrubs and trees.',
    firstAidSteps: [
      'Wash bite with soap and water',
      'Apply antiseptic',
      'Monitor for swelling or allergic reaction',
      'Seek medical advice if symptoms worsen',
    ],
    doNots: ['Do NOT apply tourniquet', 'Do NOT cut wound', 'Do NOT ignore if allergic reaction develops'],
    localPresence: 'Common in Rupandehi',
  },
  'default': {
    name: 'Unidentified Snake',
    scientificName: 'Unknown species',
    dangerLevel: 'HIGHLY VENOMOUS',
    dangerScore: 7,
    description: 'Species could not be precisely identified. Treat all unknown snakebites as potentially venomous until confirmed by a medical professional.',
    firstAidSteps: [
      'Treat as VENOMOUS until proven otherwise',
      'Call Butwal Snake Rescuers or 112 immediately',
      'Keep victim calm and still',
      'Immobilize bitten limb below heart level',
      'Rush to nearest hospital with anti-venom',
    ],
    doNots: ['Do NOT wait for symptoms to appear', 'Do NOT cut wound or suck venom', 'Do NOT apply tourniquet', 'Do NOT ignore bite'],
    localPresence: 'Unknown',
  },
};

function matchSnake(caption: string): any {
  const lower = caption.toLowerCase();

  if (lower.includes('king cobra')) return SNAKE_DATABASE['king cobra'];
  if (lower.includes('cobra') || lower.includes('naja') || lower.includes('hooded')) return SNAKE_DATABASE['cobra'];
  if (lower.includes('krait') || lower.includes('banded black white')) return SNAKE_DATABASE['krait'];
  if (lower.includes('python') || lower.includes('boa') || lower.includes('constrictor')) return SNAKE_DATABASE['python'];
  if (lower.includes('rat snake') || lower.includes('dhaman') || lower.includes('racer')) return SNAKE_DATABASE['rat snake'];
  if (lower.includes('green') && lower.includes('snake')) return SNAKE_DATABASE['green snake'];
  if (lower.includes('vine')) return SNAKE_DATABASE['green snake'];
  if (lower.includes('snake') || lower.includes('serpent') || lower.includes('reptile')) return SNAKE_DATABASE['default'];

  return null; // Not a snake
}

import axios from 'axios';

// ... existing code down to the POST method ...

export async function POST(req: NextRequest) {
  console.log('HF_TOKEN present:', !!HF_TOKEN, 'prefix:', HF_TOKEN?.substring(0, 6));

  if (!HF_TOKEN || HF_TOKEN === 'YOUR_HF_TOKEN_HERE') {
    return NextResponse.json(
      { success: false, error: 'HF_TOKEN is not configured in environment variables.' },
      { status: 500 }
    );
  }

  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ success: false, error: 'No image provided.' }, { status: 400 });
    }

    // Convert base64 to binary buffer
    const imageBuffer = Buffer.from(imageBase64, 'base64');

    console.log('Calling HF ViT with image size:', imageBuffer.length);

    // Use axios instead of native fetch for reliable buffer uploading
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/google/vit-base-patch16-224',
      imageBuffer,
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/octet-stream',
        },
      }
    );

    const hfData = response.data;
    
    // ViT returns an array of { label: string, score: number }
    // Let's get the top labels
    const labels = Array.isArray(hfData) ? hfData.map((item: any) => item.label).join(', ') : '';
    console.log('Image labels from ViT:', labels);

    const caption = labels; // Use labels as caption for matchSnake

    const snakeInfo = matchSnake(caption);

    if (!snakeInfo) {
      return NextResponse.json({
        success: true,
        result: {
          identified: false,
          name: 'Not a Snake',
          scientificName: '',
          dangerLevel: 'NON-VENOMOUS',
          dangerScore: 0,
          description: `The AI described this image as: "${caption}". It does not appear to contain a snake. Please upload a clear photo of a snake.`,
          firstAidSteps: [],
          doNots: [],
          localPresence: 'N/A',
          confidence: 'High',
        },
      });
    }

    return NextResponse.json({
      success: true,
      result: {
        identified: true,
        ...snakeInfo,
        aiCaption: caption,
        confidence: 'Medium',
      },
    });
  } catch (err: any) {
    console.error('AI Identifier error:', err.response?.data || err.message || err);
    return NextResponse.json(
      { success: false, error: `Server error: ${err.response?.data?.error || err.message || String(err)}` },
      { status: 500 }
    );
  }
}
