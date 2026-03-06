import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const PEST_PROMPT = `You are an expert agricultural entomologist AI. Analyze this plant/crop image and identify any pests.

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "predictions": [
    {
      "pest": "Common pest name",
      "scientificName": "Scientific name",
      "confidence": 0.90,
      "severity": "Low|Moderate|High|Critical",
      "spreadRisk": "Low|Medium|High",
      "damage": [
        "Type of damage 1",
        "Type of damage 2",
        "Economic impact description"
      ],
      "treatments": [
        "Chemical insecticide with dosage and timing",
        "Second chemical option",
        "Application frequency"
      ],
      "organicControl": [
        "Organic/biological control method 1",
        "Organic/biological control method 2"
      ],
      "prevention": [
        "Prevention strategy 1",
        "Prevention strategy 2"
      ],
      "naturalEnemies": ["Natural predator 1", "Natural predator 2"]
    }
  ]
}

Provide top 1-3 most likely pests ordered by confidence. If no pest is detected or image is not a plant, return confidence < 0.3 with pest "No Pest Detected / Healthy Plant". Be specific and practical.`;

const MOCK_PESTS = [
  {
    pest: "Fall Armyworm",
    scientificName: "Spodoptera frugiperda",
    confidence: 0.93,
    severity: "Critical",
    spreadRisk: "High",
    damage: [
      "Severe feeding on leaves causing 'window paning' then holes",
      "Attacks growing point causing 'dead heart' in young plants",
      "Can destroy 20–73% of maize yield if untreated",
      "Frass (droppings) visible in leaf whorls"
    ],
    treatments: [
      "Spinetoram 11.7% SC @ 0.5ml/liter spray in leaf whorls",
      "Emamectin benzoate 5% SG @ 0.4g/liter, 2 sprays at 7-day intervals",
      "Chlorpyrifos 20 EC @ 2ml/liter at early instar stage (1st–3rd)"
    ],
    organicControl: [
      "NPV (Nuclear Polyhedrosis Virus) biopesticide spray",
      "Bacillus thuringiensis (Bt) spray @ 1.5kg/ha",
      "Neem seed kernel extract (5%) spray"
    ],
    prevention: [
      "Early planting to avoid peak pest pressure period",
      "Use pheromone traps (1 per acre) for monitoring",
      "Push-pull intercropping (Desmodium + Napier grass)"
    ],
    naturalEnemies: ["Telenomus remus (parasitic wasp)", "Earwigs", "Ground beetles"]
  },
  {
    pest: "Aphids (Green Peach Aphid)",
    scientificName: "Myzus persicae",
    confidence: 0.88,
    severity: "Moderate",
    spreadRisk: "High",
    damage: [
      "Sap sucking causes leaf curl and yellowing",
      "Secretes honeydew causing sooty mold growth",
      "Transmits over 100 plant viruses (vector pest)",
      "Young shoots distorted and stunted"
    ],
    treatments: [
      "Imidacloprid 17.8 SL @ 0.5ml/liter (systemic, long-lasting)",
      "Dimethoate 30 EC @ 1.5ml/liter spray on undersides of leaves",
      "Thiamethoxam 25 WG @ 0.5g/liter every 10–14 days"
    ],
    organicControl: [
      "Insecticidal soap spray (2–3% solution) directly on colonies",
      "Neem oil (3ml/liter) + dish soap spray weekly",
      "Release of Aphidius colemani parasitoid wasps"
    ],
    prevention: [
      "Install reflective silver mulch to repel winged aphids",
      "Yellow sticky traps @ 10 per acre for monitoring",
      "Avoid excessive nitrogen application"
    ],
    naturalEnemies: ["Ladybugs (Coccinella)", "Lacewing larvae", "Hoverfly larvae"]
  },
  {
    pest: "Whitefly",
    scientificName: "Bemisia tabaci / Trialeurodes vaporariorum",
    confidence: 0.86,
    severity: "High",
    spreadRisk: "High",
    damage: [
      "Nymphs and adults suck phloem sap weakening plant",
      "Honeydew excretion leads to sooty mold blocking photosynthesis",
      "Transmits Tomato Yellow Leaf Curl Virus (TYLCV)",
      "Can cause 50–100% crop loss in severe infestations"
    ],
    treatments: [
      "Spiromesifen 22.9 SC @ 1ml/liter (IGR — disrupts molting)",
      "Acetamiprid 20 SP @ 0.5g/liter systemic spray",
      "Pymetrozine 50 WG @ 0.6g/liter, alternate with other modes of action"
    ],
    organicControl: [
      "Beauveria bassiana (entomopathogenic fungus) spray",
      "Yellow sticky traps mass trapping",
      "Reflective mulch to disorient adults"
    ],
    prevention: [
      "Use virus-resistant tomato/crop varieties",
      "Avoid planting near heavily infested older crops",
      "Install 50-mesh insect-proof nets in nurseries"
    ],
    naturalEnemies: ["Encarsia formosa (parasitoid wasp)", "Delphastus catalinae beetle", "Amblyseius swirskii mite"]
  },
  {
    pest: "Thrips",
    scientificName: "Frankliniella occidentalis / Thrips tabaci",
    confidence: 0.81,
    severity: "Moderate",
    spreadRisk: "Medium",
    damage: [
      "Silvery streaking and stippling on leaves",
      "Flower and fruit scarring reducing market value",
      "Transmits Tomato Spotted Wilt Virus (TSWV)",
      "Leaf curling and distortion in high populations"
    ],
    treatments: [
      "Spinosad 45 SC @ 0.3ml/liter (effective against all life stages)",
      "Fipronil 5% SC @ 1.5ml/liter soil drench for pupae",
      "Abamectin 1.8 EC @ 1ml/liter, 2 sprays 7 days apart"
    ],
    organicControl: [
      "Blue sticky traps for monitoring and mass trapping",
      "Predatory mites (Amblyseius cucumeris) release",
      "Kaolin clay spray as physical barrier"
    ],
    prevention: [
      "Avoid monocultures; intercrop with repellent plants",
      "Mulching to prevent soil-borne pupae from emerging",
      "Regular scouting — 1 blue trap per 250 sq meters"
    ],
    naturalEnemies: ["Orius insidiosus (pirate bug)", "Predatory mites", "Lacewings"]
  },
  {
    pest: "Red Spider Mite",
    scientificName: "Tetranychus urticae",
    confidence: 0.84,
    severity: "High",
    spreadRisk: "Medium",
    damage: [
      "Fine stippling on upper leaf surface (bronzing effect)",
      "Webbing on leaf undersides in heavy infestations",
      "Leaf yellowing, drying, and premature drop",
      "Thrives in hot dry conditions — can devastate crops rapidly"
    ],
    treatments: [
      "Abamectin 1.8 EC @ 0.5ml/liter (highly effective acaricide)",
      "Hexythiazox 5% EC @ 1ml/liter for egg and nymphal stages",
      "Bifenazate 43% SC @ 1.5ml/liter, spray leaf undersides thoroughly"
    ],
    organicControl: [
      "Sulfur dust or wettable sulfur (80% WP) @ 3g/liter",
      "Release of Phytoseiulus persimilis predatory mites",
      "Strong water spray to dislodge mites from leaves"
    ],
    prevention: [
      "Maintain adequate soil moisture — mites thrive in dry conditions",
      "Avoid excessive nitrogen which favors mite reproduction",
      "Quarantine new plants before introducing to field"
    ],
    naturalEnemies: ["Phytoseiulus persimilis", "Neoseiulus californicus", "Stethorus (small black beetles)"]
  }
];

async function callGemini(apiKey: string, imageBuffer: ArrayBuffer, mimeType: string) {
  const b64 = Buffer.from(imageBuffer).toString('base64');

  const body = {
    contents: [
      {
        parts: [
          { text: PEST_PROMPT },
          { inline_data: { mime_type: mimeType, data: b64 } }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2000,
    }
  };

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Gemini API error ${res.status}: ${text}`);
  }

  const json = await res.json();
  const text = json?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

function getSmartMock(imageBuffer: ArrayBuffer) {
  const seed = (imageBuffer.byteLength % MOCK_PESTS.length);
  const primary = MOCK_PESTS[seed];
  const secondary = MOCK_PESTS[(seed + 1) % MOCK_PESTS.length];

  return {
    predictions: [
      primary,
      {
        ...secondary,
        confidence: Math.round((secondary.confidence - 0.12) * 100) / 100,
      }
    ]
  };
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const buffer = await image.arrayBuffer();
    const b64 = Buffer.from(buffer).toString('base64');
    const imageUrl = `data:${image.type};base64,${b64}`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const result = await callGemini(apiKey, buffer, image.type || 'image/jpeg');
        return NextResponse.json({ ...result, imageUrl, aiPowered: true });
      } catch (err) {
        console.error('Gemini pest error:', err);
      }
    }

    const mock = getSmartMock(buffer);
    return NextResponse.json({ ...mock, imageUrl, aiPowered: false });

  } catch (error) {
    console.error('Pest prediction error:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}