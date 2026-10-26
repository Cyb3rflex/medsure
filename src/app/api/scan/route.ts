import { NextRequest, NextResponse } from 'next/server';
import { extractMedicineFromPhoto, generatePlainExplanation, SupportedLanguage } from '@/lib/gemini';
import { evaluateSafety, matchMedicine } from '@/lib/safetyRules';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, mimeType, medicineName, language = 'en', cabinet = [], mockExpiry, mockNafdac } = body;

    let extractedData = {
      medicine_name: medicineName || '',
      strength: '',
      batch_number: '',
      expiry_date: mockExpiry || '',
      nafdac_number: mockNafdac || '',
      confidence: 'high' as 'high' | 'medium' | 'low',
    };

    // 1. If photo is uploaded, run Gemini Vision OCR
    if (image) {
      const visionResult = await extractMedicineFromPhoto(image, mimeType || 'image/jpeg');
      extractedData = {
        medicine_name: visionResult.medicine_name || medicineName || 'Unknown Medicine',
        strength: visionResult.strength || '',
        batch_number: visionResult.batch_number || '',
        expiry_date: visionResult.expiry_date || mockExpiry || '',
        nafdac_number: visionResult.nafdac_number || mockNafdac || '',
        confidence: visionResult.confidence || 'medium',
      };
    }

    // 2. Deterministic Code-Based Safety Rules
    const safetyResult = evaluateSafety({
      extractedName: extractedData.medicine_name,
      expiryDate: extractedData.expiry_date,
      nafdacNumber: extractedData.nafdac_number,
      isPhotoScan: Boolean(image),
      cabinet
    });

    const medicineRecord = safetyResult.matchedMedicine || {
      ID: 'unknown',
      Medicine: extractedData.medicine_name,
      'Other names (for matching)': '',
      'Active ingredients': 'Unknown / Unverified',
      Class: 'Unregistered Medication',
      Groups: '',
      'Prescription only': 'Unknown',
      Uses: 'Details not found in the verified Nigerian formulary.',
      'Key warnings': 'Check with a licensed pharmacist before use.',
      Children: 'Do not administer without professional advice.',
      'Pregnancy / breastfeeding': 'Consult a medical doctor.',
      'Example brands (verify)': '',
      'NAFDAC numbers': extractedData.nafdac_number
    };

    // 3. AI Plain-Language Explanation (Multilingual + Component Breakdown)
    let explanation = null;
    try {
      explanation = await generatePlainExplanation({
        medicine: medicineRecord,
        safetyResult,
        language: language as SupportedLanguage
      });
    } catch (aiErr: any) {
      console.error('Explanation generation error:', aiErr);
      explanation = {
        summary: `Explanation in ${language} currently taking longer than usual.`,
        what_it_does: medicineRecord.Uses,
        how_it_works_components: [
          {
            component: medicineRecord['Active ingredients'],
            mechanism_plain: 'Acts on receptors to relieve symptoms.',
            panic_warning: 'Take strictly according to leaflet instructions.'
          }
        ],
        allergy_and_cautions: medicineRecord['Key warnings'],
        emergency_advice: 'If severe reaction occurs, call emergency services immediately.',
        suggested_questions: [
          'What are the common side effects?',
          'Can I take this with food?',
          'What happens if I take a double dose by accident?'
        ]
      };
    }

    return NextResponse.json({
      success: true,
      extractedData,
      safetyResult,
      medicineRecord,
      explanation
    });

  } catch (error: any) {
    console.error('Error in /api/scan:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to scan medicine' },
      { status: 500 }
    );
  }
}
