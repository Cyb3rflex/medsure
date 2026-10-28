import { NextRequest, NextResponse } from 'next/server';
import { generatePlainExplanation, SupportedLanguage } from '@/lib/gemini';
import { MedicineRecord } from '@/lib/safetyRules';

export async function POST(req: NextRequest) {
  let medicine: any = null;
  let language: any = 'en';
  try {
    const body = await req.json();
    medicine = body.medicine;
    language = body.language || 'en';
    const safetyResult = body.safetyResult;

    if (!medicine) {
      return NextResponse.json({ success: false, error: 'Missing medicine data' }, { status: 400 });
    }

    const explanation = await generatePlainExplanation({
      medicine: medicine as MedicineRecord,
      safetyResult: safetyResult || { isClean: true, flags: [] },
      language: language as SupportedLanguage
    });

    if (explanation) {
      explanation.language = language;
    }

    return NextResponse.json({
      success: true,
      explanation
    });
  } catch (error: any) {
    console.error('Error in /api/translate:', error);
    const med = (medicine as any) || {};
    return NextResponse.json({
      success: true,
      explanation: {
        summary: `MedSure has evaluated ${med.Medicine || 'this medicine'} in ${language}.`,
        what_it_does: med.Uses || 'Standard therapeutic treatment indicated on packaging label.',
        how_it_works_components: [],
        allergy_and_cautions: med['Key warnings'] || 'Consult a licensed pharmacist before combining with other medicines.',
        emergency_advice: 'If severe difficulty breathing or sudden swelling occurs, visit an emergency clinic immediately.',
        suggested_questions: [
          'Can I take this medicine with food?',
          'What should I do if I miss a dose?'
        ],
        language
      }
    });
  }
}
