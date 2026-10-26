import { NextRequest, NextResponse } from 'next/server';
import { answerFollowUpQuestion, SupportedLanguage } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medicine, question, language = 'en' } = body;

    if (!question) {
      return NextResponse.json({ success: false, error: 'Question is required' }, { status: 400 });
    }

    const answer = await answerFollowUpQuestion({
      medicine,
      question,
      language: language as SupportedLanguage
    });

    return NextResponse.json({
      success: true,
      answer
    });
  } catch (error: any) {
    console.error('Error in /api/ask:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to answer question' },
      { status: 500 }
    );
  }
}
