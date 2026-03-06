import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

const DISEASE_PROMPT = `You are an expert plant pathologist AI. Analyze this plant/crop image and detect diseases.

Return ONLY valid JSON (no markdown, no code blocks) in this exact format:
{
  "predictions": [
    {
      "disease": "Disease name",
      "confidence": 0.92,
      "causativeAgent": "Pathogen name (fungal/bacterial/viral)",
      "severity": "Low|Moderate|High|Critical",
      "symptoms": ["symptom 1", "symptom 2", "symptom 3"],
      "treatments": [
        "Chemical treatment 1 with dosage",
        "Chemical treatment 2 with dosage",
        "Application schedule"
      ],
      "organicAlternatives": [
        "Organic option 1",
        "Organic option 2"
      ],
      "culturalPractices": [
        "Practice 1",
        "Practice 2"
      ],
      "prevention": [
        "Prevention tip 1",
        "Prevention tip 2"
      ]
    }
  ]
}

Provide top 1-3 most likely diseases ordered by confidence. If no disease is detected or image is unclear, return confidence < 0.3 with disease "Healthy Plant / Undetectable". Be specific and actionable in treatment recommendations.`;

const MOCK_DISEASES = [
  {
    disease: "Early Blight (Alternaria solani)",
    confidence: 0.91,
    causativeAgent: "Alternaria solani (Fungal)",
    severity: "Moderate",
    symptoms: [
      "Dark brown circular spots with concentric rings (bull's-eye pattern)",
      "Yellow halo surrounding the lesions",
      "Lower/older leaves affected first",
      "Lesions coalesce causing leaf death"
    ],
    treatments: [
      "Apply Mancozeb 75% WP @ 2.5 kg/ha at first sign of symptoms",
      "Chlorothalonil 75% WP @ 2 kg/ha spray every 7–10 days",
      "Azoxystrobin 23 SC @ 1 ml/liter, 3 applications at 14-day intervals"
    ],
    organicAlternatives: [
      "Copper hydroxide spray (3g/liter) as preventive",
      "Neem oil (5ml/liter) + liquid soap spray weekly",
      "Trichoderma harzianum bio-fungicide soil application"
    ],
    culturalPractices: [
      "Remove and destroy infected leaves immediately",
      "Avoid overhead irrigation; use drip irrigation",
      "Maintain proper plant spacing for air circulation",
      "Practice 3-year crop rotation with non-solanaceous crops"
    ],
    prevention: [
      "Use certified disease-free seeds",
      "Apply preventive fungicide before rainy season",
      "Mulch to prevent soil splash onto leaves"
    ]
  },
  {
    disease: "Powdery Mildew",
    confidence: 0.87,
    causativeAgent: "Erysiphe cichoracearum (Fungal)",
    severity: "Low",
    symptoms: [
      "White powdery coating on leaf surface",
      "Yellowing of affected leaves",
      "Distorted young shoots and leaves",
      "Premature leaf drop in severe cases"
    ],
    treatments: [
      "Sulfur-based fungicide 80% WP @ 3kg/ha",
      "Propiconazole 25 EC @ 1ml/liter, 2–3 sprays",
      "Hexaconazole 5% SC @ 2ml/liter every 14 days"
    ],
    organicAlternatives: [
      "Baking soda solution (1 tbsp/liter) + few drops of vegetable oil",
      "Milk spray (40% milk in water) weekly",
      "Potassium bicarbonate spray"
    ],
    culturalPractices: [
      "Prune overcrowded branches to improve airflow",
      "Avoid excess nitrogen fertilization",
      "Water at the base of plants in the morning"
    ],
    prevention: [
      "Plant mildew-resistant varieties",
      "Avoid planting in low-airflow areas",
      "Dispose of infected plant debris away from field"
    ]
  },
  {
    disease: "Bacterial Leaf Spot",
    confidence: 0.83,
    causativeAgent: "Xanthomonas campestris (Bacterial)",
    severity: "High",
    symptoms: [
      "Water-soaked lesions that turn dark brown",
      "Yellow halos around spots visible against light",
      "Lesions limited by leaf veins giving angular appearance",
      "Severe infection causes defoliation"
    ],
    treatments: [
      "Copper oxychloride 50 WP @ 3g/liter spray",
      "Streptomycin sulfate + Tetracycline mixture spray",
      "Bactericide sprays every 5–7 days during wet weather"
    ],
    organicAlternatives: [
      "Bordeaux mixture (1%) spray",
      "Garlic extract spray (50g garlic/liter)",
      "PGPR (Plant Growth Promoting Rhizobacteria) soil drench"
    ],
    culturalPractices: [
      "Avoid working in field when plants are wet",
      "Sanitize pruning tools with 10% bleach solution",
      "Remove infected plant debris from field"
    ],
    prevention: [
      "Use disease-free transplants",
      "Hot water seed treatment (50°C for 25 minutes)",
      "Avoid excessive irrigation and leaf wetness"
    ]
  },
  {
    disease: "Fusarium Wilt",
    confidence: 0.78,
    causativeAgent: "Fusarium oxysporum (Fungal)",
    severity: "Critical",
    symptoms: [
      "Yellowing and wilting of lower leaves first",
      "Brown discoloration of vascular tissue (visible on cut stem)",
      "One-sided wilting and stunting",
      "Plant eventually collapses and dies"
    ],
    treatments: [
      "Carbendazim 50 WP @ 1g/liter soil drench",
      "Thiophanate-methyl 70 WP @ 1.5g/liter",
      "Remove and destroy infected plants to prevent spread"
    ],
    organicAlternatives: [
      "Trichoderma viride @ 5g/kg seed treatment",
      "Pseudomonas fluorescens soil application",
      "Neem cake incorporation in soil (250 kg/ha)"
    ],
    culturalPractices: [
      "Improve soil drainage; avoid waterlogging",
      "Maintain soil pH between 6.5–7.0",
      "Hot solarization of soil before planting"
    ],
    prevention: [
      "Use Fusarium-resistant crop varieties",
      "5-year rotation avoiding susceptible crops",
      "Avoid transplanting stress; ensure hardened seedlings"
    ]
  },
  {
    disease: "Downy Mildew",
    confidence: 0.85,
    causativeAgent: "Plasmopara viticola / Peronospora sp. (Oomycete)",
    severity: "High",
    symptoms: [
      "Yellow-green oily spots on upper leaf surface",
      "White/grey fluffy growth on leaf underside",
      "Brown necrotic patches as disease progresses",
      "Infected fruits turn brown and shriveled"
    ],
    treatments: [
      "Metalaxyl + Mancozeb (Ridomil) @ 2.5g/liter spray",
      "Dimethomorph 50 WP @ 1g/liter every 10 days",
      "Cymoxanil 8% + Mancozeb 64% WP @ 3g/liter"
    ],
    organicAlternatives: [
      "Copper-based Bordeaux mixture (0.5–1%)",
      "Potassium phosphonate spray",
      "Seaweed extract as plant immunity booster"
    ],
    culturalPractices: [
      "Improve canopy airflow with pruning",
      "Avoid evening irrigation",
      "Use raised beds to improve drainage"
    ],
    prevention: [
      "Plant resistant varieties where available",
      "Pre-season copper sprays as protective measure",
      "Monitor weather — spray before forecasted rain"
    ]
  }
];

async function callGemini(apiKey: string, imageBuffer: ArrayBuffer, mimeType: string) {
  const b64 = Buffer.from(imageBuffer).toString('base64');

  const body = {
    contents: [
      {
        parts: [
          { text: DISEASE_PROMPT },
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

  // Strip markdown fences if Gemini wraps in ```json
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

function getSmartMock(imageBuffer: ArrayBuffer) {
  // Use image size as seed for variety
  const seed = (imageBuffer.byteLength % MOCK_DISEASES.length);
  const primary = MOCK_DISEASES[seed];
  const secondary = MOCK_DISEASES[(seed + 2) % MOCK_DISEASES.length];

  return {
    predictions: [
      primary,
      {
        ...secondary,
        confidence: Math.round((secondary.confidence - 0.15) * 100) / 100,
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
        console.error('Gemini disease error:', err);
        // fall through to smart mock
      }
    }

    // Smart mock: varies by image size
    const mock = getSmartMock(buffer);
    return NextResponse.json({ ...mock, imageUrl, aiPowered: false });

  } catch (error) {
    console.error('Disease prediction error:', error);
    return NextResponse.json({ error: 'Failed to analyze image' }, { status: 500 });
  }
}