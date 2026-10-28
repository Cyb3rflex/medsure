import { NextRequest, NextResponse } from 'next/server';
import { generatePlainExplanation, SupportedLanguage } from '@/lib/gemini';
import { MedicineRecord } from '@/lib/safetyRules';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medicine, safetyResult, language = 'en' } = body;

    if (!medicine) {
      return NextResponse.json({ success: false, error: 'Missing medicine data' }, { status: 400 });
    }

    const explanation = await generatePlainExplanation({
      medicine: medicine as MedicineRecord,
      safetyResult: safetyResult || { isClean: true, flags: [] },
      language: language as SupportedLanguage
    });

    return NextResponse.json({
      success: true,
      explanation
    });
  } catch (error: any) {
    console.error('Error in /api/translate:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Translation failed' },
      { status: 500 }
    );
  }
}
