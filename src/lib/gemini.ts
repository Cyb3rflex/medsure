export interface ExtractedMedicine {
  medicine_name: string;
  strength: string;
  batch_number: string;
  expiry_date: string;
  nafdac_number: string;
  confidence: 'high' | 'medium' | 'low';
  raw_text_detected?: string;
}

export type SupportedLanguage = 'en' | 'pidgin' | 'yoruba' | 'hausa' | 'igbo';

const GEMINI_MODEL = 'gemini-2.5-flash';

export async function callGemini(contents: any[], systemInstruction?: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in the environment.');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const payload: any = {
    contents,
    generationConfig: {
      temperature: 0.2,
      maxOutputTokens: 2048,
    }
  };

  if (systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('No response returned from Gemini.');
  }
  return text;
}

// 1. Vision Extraction from Photo
export async function extractMedicineFromPhoto(base64Image: string, mimeType: string = 'image/jpeg'): Promise<ExtractedMedicine> {
  const systemPrompt = `You are an expert pharmaceutical vision OCR model specializing in reading medicine packaging, strips, blister packs, and bottles sold in Nigeria and West Africa.
Your task is to extract exact text from the image into a valid JSON object.
Do not guess or assume. Only return valid JSON with no markdown wrapping or extra text.

JSON format:
{
  "medicine_name": "string (brand or generic name as written)",
  "strength": "string (e.g. 500mg, 100mg/5ml)",
  "batch_number": "string (or empty if not found)",
  "expiry_date": "string in YYYY-MM or MM/YY or as found",
  "nafdac_number": "string (Nigerian NAFDAC registration, usually formatted like 04-1234 or A4-5678 or NR-0123)",
  "confidence": "high|medium|low",
  "raw_text_detected": "summary of key text visible"
}`;

  const imagePart = {
    inline_data: {
      mime_type: mimeType,
      data: base64Image.replace(/^data:image\/[a-z]+;base64,/, '')
    }
  };

  const userPromptPart = {
    text: "Extract the medicine name, strength, batch number, expiry date, and Nigerian NAFDAC number from this medicine package."
  };

  const raw = await callGemini([{ parts: [imagePart, userPromptPart] }], systemPrompt);
  
  // Clean JSON response (strip markdown fences if any)
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(cleaned) as ExtractedMedicine;
  } catch (err) {
    console.error('Failed to parse Gemini JSON:', raw);
    return {
      medicine_name: 'Unknown Medicine',
      strength: '',
      batch_number: '',
      expiry_date: '',
      nafdac_number: '',
      confidence: 'low',
      raw_text_detected: raw
    };
  }
}

// 2. Multilingual Plain-Language Explanation with Component Breakdown
export async function generatePlainExplanation({
  medicine,
  safetyResult,
  language = 'en'
}: {
  medicine: any;
  safetyResult: any;
  language: SupportedLanguage;
}) {
  const languageInstructions: Record<SupportedLanguage, string> = {
    en: 'Explain in simple, compassionate everyday English that anyone without a medical background can understand.',
    pidgin: 'Explain in warm, natural Nigerian Pidgin English (e.g. "Wetina this medicine dey do", "How you go take am safely", "Wetin you must shine your eye for"). Make it friendly, clear, and easy to follow.',
    yoruba: 'Explain in clear, respectful, natural Yoruba suitable for patient health awareness.',
    hausa: 'Explain in clear, respectful, natural Hausa suitable for patient health awareness.',
    igbo: 'Explain in clear, respectful, natural Igbo suitable for patient health awareness.'
  };

  const systemPrompt = `You are MedSure's Chief Patient Advocate and Pharmacist Communicator in Nigeria.
Your mission is to help everyday families safely understand medicines, especially when they are confused or anxious at home.

CRITICAL MEDICAL RULES:
1. Break down the ACTIVE INGREDIENTS in simple human terms:
   - What is the chemical component?
   - How does it actually relieve symptoms or help the body? (e.g., "It stops the brain from sending pain signals" or "It opens the tightened air tubes so oxygen can enter").
2. Explicitly warn about OVERDOSING and PANIC:
   - Emphasize never taking extra doses out of panic (e.g., taking too many puffs of an inhaler or too many pain pills can cause dangerous heart palpitations or liver failure).
3. ALLERGIES:
   - Mention key allergies (like NSAID allergy, Sulfa allergy, Aspirin sensitivity) if relevant to this drug class.
4. If there are RED FLAGS (e.g. Expired, invalid NAFDAC, dangerous drug-drug interaction):
   - Firmly advise NOT to consume the medicine and to see a licensed pharmacist immediately.
5. Provide 3 thoughtful COURSERA-STYLE follow-up questions the patient can click to learn more.

Output strictly formatted JSON:
{
  "summary": "1-2 sentence core message",
  "what_it_does": "Plain language explanation of uses",
  "how_it_works_components": [
    {
      "component": "Active ingredient name",
      "mechanism_plain": "How this ingredient works in the body to help you",
      "panic_warning": "Warning against overdosing or improper rapid use"
    }
  ],
  "allergy_and_cautions": "Crucial allergy warnings (NSAID, Sulfa, Asthmatics, Ulcers)",
  "emergency_advice": "When to rush to a hospital or emergency clinic immediately",
  "suggested_questions": [
    "Suggested question 1",
    "Suggested question 2",
    "Suggested question 3"
  ]
}`;

  const userQuery = `
Language: ${languageInstructions[language]}
Medicine Name: ${medicine?.Medicine || 'Scanned Drug'}
Active Ingredients: ${medicine?.['Active ingredients'] || 'Not specified'}
Class: ${medicine?.Class || 'General'}
Groups: ${medicine?.Groups || 'None'}
Uses: ${medicine?.Uses || 'General relief'}
Warnings: ${medicine?.['Key warnings'] || 'See package'}
Safety Guardrail Status: ${safetyResult.isClean ? 'CLEAN (Passed safety rules)' : 'FLAGGED (Warning flags detected: ' + safetyResult.flags.map((f: any) => f.title).join(', ') + ')'}
Allergens: ${safetyResult.allergensDetected?.join(', ') || 'None identified'}
`;

  const raw = await callGemini([{ parts: [{ text: userQuery }] }], systemPrompt);
  const cleaned = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return {
      summary: raw,
      what_it_does: raw,
      how_it_works_components: [],
      allergy_and_cautions: 'Consult a licensed pharmacist.',
      emergency_advice: 'If severe difficulty breathing or sudden swelling occurs, visit an emergency room immediately.',
      suggested_questions: [
        'Can I take this medicine with food?',
        'What should I do if I miss a dose?',
        'Are there safer alternatives if I am allergic?'
      ]
    };
  }
}

// 3. Coursera-Style Interactive Follow-Up Questions & Symptom Clarifier
export async function answerFollowUpQuestion({
  medicine,
  question,
  language = 'en'
}: {
  medicine: any;
  question: string;
  language: SupportedLanguage;
}) {
  const systemPrompt = `You are MedSure's interactive medical helper. 
A patient or family member is asking a specific follow-up question about their medicine or health concern.

SAFETY DIRECTIVE:
1. If the question mentions severe emergency symptoms (such as "cannot breathe", "respiratory attack", "severe chest pain", "blue lips", "collapsed"), you MUST immediately provide emergency triage advice: Call 112 / 199 or rush to the nearest emergency department, followed by immediate positioning first-aid (sit upright, loosen tight clothing, stay calm).
2. Never diagnose disease or prescribe medications.
3. Answer the question compassionately, clearly, and in plain language.
4. MANDATORY PHARMACIST REFERRAL:
   Every answer MUST conclude with a distinct, prominent referral section advising them to speak with a licensed pharmacist before making any changes. Include a specific bullet point:
   "🩺 What to verify with your Pharmacist: [Give 1 or 2 specific things to check, e.g. checking liver health, child's exact weight dose, or reviewing other medicines]."`;

  const userQuery = `
Medicine: ${medicine?.Medicine || 'General Medicine'}
Active Ingredients: ${medicine?.['Active ingredients'] || 'Unknown'}
Class: ${medicine?.Class || 'General'}
Key Warnings: ${medicine?.['Key warnings'] || 'Standard precautions'}
User's Question/Situation: "${question}"
Respond in language: ${language}
`;

  return await callGemini([{ parts: [{ text: userQuery }] }], systemPrompt);
}
