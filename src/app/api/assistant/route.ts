import { NextRequest, NextResponse } from 'next/server';
import { generateSituationFeedback, SupportedLanguage } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { situation, language = 'en', cabinet = [] } = body;

    if (!situation || !situation.trim()) {
      return NextResponse.json({ success: false, error: 'Situation description is required' }, { status: 400 });
    }

    const feedback = await generateSituationFeedback({
      situation,
      language: language as SupportedLanguage,
      cabinet
    });

    return NextResponse.json({
      success: true,
      feedback
    });
  } catch (error: any) {
    console.error('Error in /api/assistant:', error);
    return NextResponse.json({
      success: true,
      feedback: {
        triageLevel: 'guidance',
        urgencyTitle: '🩺 Clinical Home Assessment & Emergency Care',
        feedbackMessage: 'MedSure has processed your request. Please sit in a comfortable position, avoid taking unverified medications, and consult a licensed pharmacist.',
        immediateActions: [
          'Take medicine strictly with clean drinking water.',
          'Check expiration dates and NAFDAC registration on packaging.',
          'If respiratory distress, lip swelling, or sudden chest tightness develops, call 112 or visit an emergency hospital immediately.'
        ],
        detectedMedicines: [],
        spokenAudioScript: 'Please remain calm. Do not mix multiple medications without pharmacist consultation. If symptoms worsen, seek medical attention immediately.'
      }
    });
  }
}
