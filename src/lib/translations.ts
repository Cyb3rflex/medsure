import { SupportedLanguage } from './gemini';
import { MedicineRecord, SafetyCheckResult } from './safetyRules';

export interface SpokenExplanationText {
  headline: string;
  body: string;
  cautions: string;
  fullSpeech: string;
}

// Pre-packaged authentic native clinical summaries for Nigerian Essential Medicines
export const PREPACKAGED_TRANSLATIONS: Record<
  string,
  Record<SupportedLanguage, SpokenExplanationText>
> = {
  // 1. Paracetamol / Panadol Extra
  paracetamol: {
    en: {
      headline: 'Pain relief and fever reducer',
      body: 'Paracetamol stops pain signals from reaching your brain and cools down body temperature.',
      cautions: 'Do not take more than 2 tablets at once or 8 tablets in 24 hours to protect your liver.',
      fullSpeech: 'Paracetamol provides fast relief from pains, headaches, and fever. Caution: Do not exceed 8 tablets in 24 hours to protect your liver. Do not drink alcohol while taking this medicine.'
    },
    pidgin: {
      headline: 'E dey cool fever and kill body pain',
      body: 'Paracetamol dey block pain signals wey dey go your brain and e dey cool hot body temperature.',
      cautions: 'No drink pass 2 tablets at once or 8 for one whole day so e no go hurt your liver.',
      fullSpeech: 'This Paracetamol dey help bring down high fever and kill body pain sharp-sharp. Make you shine your eye: no drink pass two tablets at once, and no drink pass eight tablets for one whole day, so your liver go dey safe.'
    },
    yoruba: {
      headline: 'Oogun fun didin irora ati iba ku',
      body: 'Paracetamol n dawo ifihan irora duro si opolo re, o si n so iwọn otutu ara di tutu.',
      cautions: 'Ma se mu ju eyo meji lo leekan naa tabi eyo mejo lojumo lati dabobo edo re.',
      fullSpeech: 'Oogun Paracetamol yi wa fun didin gbogbo irora ara, efori, ati iba ku. Ikilọ pataki: E ma se mu ju eyo meji lo leekan naa, tabi eyo mejo lojumo lati dabobo edo yin kuro ninu ewu.'
    },
    hausa: {
      headline: 'Magani don saukaka zazzabi da ciwon jiki',
      body: 'Paracetamol yana toshe sakonnin ciwo zuwa kwakwalwa kuma yana saukar da zafin jiki.',
      cautions: 'Kada a sha fiye da kwaya biyu a lokaci guda, ko kwaya takwas a rana don kare hanta.',
      fullSpeech: 'Wannan magani na Paracetamol yana saukaka zazzabi, ciwon kai, da ciwon jiki cikin sauri. Gargadi: Kada a sha fiye da kwaya biyu a lokaci guda, ko kwaya takwas a yini guda don kare hantarku.'
    },
    igbo: {
      headline: 'Ọgwụ na-ebelata ahụ ọkụ na mgbu',
      body: 'Paracetamol na-egbochi ozi mgbu iru n\'ụbụrụ ma na-eme ka ahụ jụọ oyi.',
      cautions: 'Ejila karịa mkpụrụ abụọ n\'otu oge ma ọ bụ mkpụrụ asatọ n\'otu ụbọchị iji chebe imeju gị.',
      fullSpeech: 'Ọgwụ Paracetamol a na-ebelata ahụ ọkụ, isi ọwụwa, na mgbu dị n\'ahụ ngwa ngwa. Ịdọ aka ná ntị: Ejila karịa mkpụrụ abụọ n\'otu oge ma ọ bụ mkpụrụ asatọ n\'otu ụbọchị iji chebe imeju gị.'
    }
  },

  // 2. Artemether-lumefantrine (Coartem)
  artemether_lumefantrine: {
    en: {
      headline: 'First-line Artemisinin antimalarial',
      body: 'Artemether rapidly kills malaria parasites while lumefantrine clears remaining parasites to prevent return.',
      cautions: 'Always take with a fatty meal or milk for proper absorption. Complete all 3 days.',
      fullSpeech: 'Artemether-lumefantrine is a verified treatment for acute malaria. Take with food or milk for full absorption, and make sure to finish the full three-day course even if you feel better.'
    },
    pidgin: {
      headline: 'First-line medicine wey dey clear malaria',
      body: 'Artemether dey kill malaria parasites quick-quick while lumefantrine dey wipe out the remaining ones.',
      cautions: 'Chop food or drink milk before you take am. Complete all 3 days.',
      fullSpeech: 'This Coartem antimalarial medicine dey wipe out malaria parasites sharp-sharp. Make you chop food with small oil or drink milk before you swallow am, and abeg complete the whole three days treatment so the malaria no go come back.'
    },
    yoruba: {
      headline: 'Oogun to lagbara fun itoju aisan iba malaria',
      body: 'Artemether n pa awon kokoro iba malaria ni kiakia, lumefantrine n gbale awon to ku kuro.',
      cautions: 'Je ounje dada tabi mu wara ki o to lo oogun yi. Pari gbogbo e fun ojo meta.',
      fullSpeech: 'Oogun Coartem yi wa fun itoju aisan iba malaria to lagbara. Je ounje to ni epo die tabi mu wara ki o to lo oogun yi ki o le sise daadaa, ki o si pari gbogbo ojo meta naa laida duro.'
    },
    hausa: {
      headline: 'Babban magani don magance zazzabin cizon sauro',
      body: 'Artemether yana kashe kwayoyin cutar zazzabin cizon sauro cikin sauri yayin da lumefantrine ke share sauran.',
      cautions: 'A sha tare da abinci ko madara don ya yi aiki sosai. A kammala kwanaki uku.',
      fullSpeech: 'Wannan magani na Coartem yana magance cutar zazzabin cizon sauro. A sha shi tare da abinci ko madara, kuma a tabbatar an kammala kwanaki ukun gaba daya ko da an ji sauki.'
    },
    igbo: {
      headline: 'Ọgwụ mbụ maka ịgwọ ọrịa ịba (malaria)',
      body: 'Artemether na-egbu nje ịba ngwa ngwa ebe lumefantrine na-ekpochapụ ndị fọdụrụnụ.',
      cautions: 'Rie nri ma ọ bụ ṅụọ mmiri ara ehi tupu ị ṅụọ ya. Gụchaa ụbọchị atọ ahụ.',
      fullSpeech: 'Ọgwụ Coartem a bụ maka ịgwọ ọrịa ịba. Rie nri nke ọma tupu ị ṅụọ ya, ma mechaa ọgwụ ahụ ruo ụbọchị atọ zuru ezu ka ịba ahụ wee ghara ịlọghachi.'
    }
  },

  // 3. Salbutamol / Ventolin (Inhaler)
  salbutamol: {
    en: {
      headline: 'Fast-acting bronchodilator for airways',
      body: 'Relaxes and opens the tightened muscles around your bronchial airways within 5 minutes.',
      cautions: 'Never take excessive puffs during panic attacks; it can cause rapid heart palpitations.',
      fullSpeech: 'Salbutamol opens up tightened breathing airways rapidly during asthma or wheezing. Take 1 to 2 puffs. Caution: Do not take continuous puffs out of panic; if breathing remains tight, seek emergency medical care immediately.'
    },
    pidgin: {
      headline: 'Inhaler wey dey open tight chest and lungs',
      body: 'E dey relax the tightened muscles around your airway within five minutes so you fit breathe well.',
      cautions: 'No puff am too much when panic catch you; e fit make your heart dey beat too fast.',
      fullSpeech: 'This Salbutamol inhaler dey open tight chest and airway when asthma or wheezing catch person. Press one or two puffs only. No use am continuously out of fear or panic; if chest still tight, rush go hospital immediately.'
    },
    yoruba: {
      headline: 'Oogun imumi fun sise oju ona eemi',
      body: 'O n tu awon isan to rọ mo oju ona eemi re laarin iseju marun lati je ki afefe wo inu re.',
      cautions: 'Ma se fa ju eyo meji lo ninu idamu; o le mu ki okan re maa lu gidigidi.',
      fullSpeech: 'Oogun Salbutamol yi n si oju ona eemi fun awon ti o ni iko-fe tabi iṣoro eemi. Fa eyo kan si meji pere. Ikilọ: E ma se fa ju eyo meji lo nitori ipaya; ti eemi ko ba tete ro yin, e kan si ile-iwosan leekan naa.'
    },
    hausa: {
      headline: 'Magani na shaka don bude hanyoyin numfashi',
      body: 'Yana bude hanyoyin numfashi da suka toshe cikin mintuna biyar don samun iska.',
      cautions: 'Kada a shaka fiye da kima a lokacin tsoro ko firgita; zai iya sa bugun zuciya ya karu.',
      fullSpeech: 'Wannan magani na Salbutamol yana taimakawa wajen bude hanyar numfashi ga masu fama da asma. A shaka sau daya ko biyu kawai. Idan numfashi bai dawo daidai ba, a tafi asibiti cikin gaggawa.'
    },
    igbo: {
      headline: 'Ọgwụ na-emeghe ụzọ iku ume ngwa ngwa',
      body: 'Ọ na-eme ka akwara ndị gbara ụzọ iku ume gị ghara ịka njo n\'ime nkeji ise.',
      cautions: 'Ejila ya mee ihe karịrị akarị n\'ihi ụjọ; ọ nwere ike ime ka obi na-akụ gabiga ókè.',
      fullSpeech: 'Ọgwụ Salbutamol a na-emeghe ụzọ iku ume mgbe asma ma ọ bụ mkpụkpo obi na-enye nsogbu. Kpọọ ya ugboro abụọ nani. Ịdọ aka ná ntị: Ejila ya gabiga ókè n\'ihi ụjọ; ọ bụrụ na iku ume ka na-esiri ike, gaa ụlọ ọgwụ ozugbo.'
    }
  },

  // 4. Diclofenac (NSAID)
  diclofenac: {
    en: {
      headline: 'Non-steroidal anti-inflammatory pain reliever',
      body: 'Reduces inflammation and severe joint or muscular swelling.',
      cautions: 'Contraindicated in stomach ulcers, severe asthma, and NSAID allergy. Always take with food.',
      fullSpeech: 'Diclofenac is a strong anti-inflammatory pain reliever. Caution: Avoid if you have active stomach ulcers, severe asthma, or an NSAID allergy. Always swallow with a full meal and water.'
    },
    pidgin: {
      headline: 'Heavy pain killer for body joint and swelling',
      body: 'E dey reduce heavy swelling and joint pain well-well.',
      cautions: 'No drink am if you get stomach ulcer or asthma allergy. Chop heavy food before taking.',
      fullSpeech: 'This Diclofenac na strong painkiller for severe joint pain and swelling. Warning: If you get stomach ulcer, asthma, or painkiller allergy, no touch am at all. Always chop heavy food before you swallow am.'
    },
    yoruba: {
      headline: 'Oogun to lagbara fun didin wiwu ati irora eegun',
      body: 'O n din gbogbo wiwu eegun ati irora to le koko ku.',
      cautions: 'Eewo ni fun awon ti o ni ogbe-inu (ulcer) tabi iko-fe (asthma). Je ounje daadaa ki o to lo oogun yi.',
      fullSpeech: 'Oogun Diclofenac yi lagbara pupo fun didin wiwu ati irora eegun ku. Ikilọ pataki: Awon ti o ni ogbe inu tabi iko-fe ko gbodo lo oogun yi rara. Je ounje to dara ki o si mu omi pupo pelu re.'
    },
    hausa: {
      headline: 'Magani mai karfi don rage radadin ciwo da kumburi',
      body: 'Yana rage kumburin gabbai da matsanancin ciwon jiki.',
      cautions: 'Kada masu cutar gyabon ciki (ulcer) ko asma su sha. A sha tare da isasshen abinci.',
      fullSpeech: 'Wannan magani na Diclofenac yana rage kumburi da radadin ciwon jiki. Gargadi: Masu cutar gyabon ciki ko asma kada su sha wannan magani. A tabbatar an ci abinci sosai kafin a sha.'
    },
    igbo: {
      headline: 'Ọgwụ siri ike na-ebelata mgbu na ọzịza',
      body: 'Ọ na-ebelata ọzịza nkwonkwo na oke mgbu dị n\'ahụ.',
      cautions: 'Ndị nwere ọnya afọ (ulcer) ma ọ bụ asma ekwesịghị ịṅụ ya. Rie nri nke ọma tupu ị ṅụọ ya.',
      fullSpeech: 'Ọgwụ Diclofenac a na-ebelata oke mgbu na ọzịza nke ọma. Ịdọ aka ná ntị: Ndị nwere ọnya afọ ma ọ bụ nsogbu asma ekwesịghị ịṅụ ya ma ọlị. Rie nri nke ọma tupu ị ṅụọ ọgwụ a.'
    }
  }
};

// Generic fallback templates for any other drug or flagged situation
export const GENERIC_TRANSLATIONS: Record<
  SupportedLanguage,
  {
    cleanIntro: string;
    flaggedWarning: string;
    defaultDosageCaution: string;
    emergencyText: string;
  }
> = {
  en: {
    cleanIntro: 'This medicine matches official Nigerian health guidelines and NAFDAC registration.',
    flaggedWarning: 'Warning: Red flags were detected with this medicine package. Do not consume before consulting a licensed pharmacist.',
    defaultDosageCaution: 'Always adhere to the exact dosage printed on the pack or prescribed by your healthcare provider.',
    emergencyText: 'If you experience severe swelling, skin rash, or breathing difficulty, seek emergency medical care immediately.'
  },
  pidgin: {
    cleanIntro: 'This medicine clear and e match official NAFDAC standards.',
    flaggedWarning: 'Red Alert! We see serious warning signs for this medicine. Abeg no drink am until you ask licensed pharmacist.',
    defaultDosageCaution: 'Follow the correct dosage wey doctor or the medicine pack write. No drink double dose.',
    emergencyText: 'If your throat begin tight or face begin swell, rush go hospital immediately.'
  },
  yoruba: {
    cleanIntro: 'Oogun yi ni ifọwọsi to peye lati odo ajo NAFDAC ati awon akosile eto ilera orile-ede Naijiria.',
    flaggedWarning: 'Ikilọ pataki! A ri awon ami ewu to lagbara ninu oogun yi. E ma se lo rara lai ri onisegun oyinbo tabi dokita.',
    defaultDosageCaution: 'Lo oogun yi gege bi ilana ti won ko si ara re tabi ti dokita so fun yin.',
    emergencyText: 'Ti e ba ri wiwu ni oju tabi ti eemi ba fe soro, e sare lo si ile-iwosan leekan naa.'
  },
  hausa: {
    cleanIntro: 'Wannan magani ya cika ka\'idojin hukumar NAFDAC da sharuɗɗan lafiya na Najeriya.',
    flaggedWarning: 'Gargadi mai tsanani! An gano matsaloli a wannan magani. Kada a sha har sai an tuntubi masanin magani ko likita.',
    defaultDosageCaution: 'Kada a sha fiye da adadin da likita ya rubuta ko aka rubuta a jikin maganin.',
    emergencyText: 'Idan an sami matsalar numfashi ko kumburin fuska, a garzaya asibiti cikin gaggawa.'
  },
  igbo: {
    cleanIntro: 'Ọgwụ a nwere nkwado zuru oke site n\'aka ndị NAFDAC na usoro nlekọta ahụike nke Naijiria.',
    flaggedWarning: 'Ịdọ aka ná ntị dị mkpa! Anyị hụrụ nsogbu n\'ọgwụ a. Anụla ya ma ọlị tupu gị na onye na-ere ọgwụ ekwurịta.',
    defaultDosageCaution: 'Na-aṅụ ọgwụ a dịka dọkịta siri kwuo ma ọ bụ dịka e siri dee ya n\'akwụkwọ ọgwụ.',
    emergencyText: 'Ọ bụrụ na iku ume esiri gị ike ma ọ bụ ihu gị na-aza aza, gaa ụlọ ọgwụ ozugbo.'
  }
};

/**
 * Builds the exact spoken text for a medicine in the chosen language.
 */
export function buildSpokenExplanation({
  medicine,
  safetyResult,
  explanation,
  language
}: {
  medicine: MedicineRecord;
  safetyResult?: SafetyCheckResult;
  explanation?: any;
  language: SupportedLanguage;
}): string {
  const medId = medicine?.ID?.toLowerCase().replace(/[^a-z0-9]/g, '_') || '';

  // Check prepackaged translations first for instant pristine clinical audio
  for (const [key, pack] of Object.entries(PREPACKAGED_TRANSLATIONS)) {
    if (medId.includes(key) || medicine?.Medicine?.toLowerCase().includes(key.replace('_', ' '))) {
      const translation = pack[language];
      if (translation) {
        // If there are red flags (like expired or fake NAFDAC), prepend warning
        if (safetyResult && !safetyResult.isClean) {
          const generic = GENERIC_TRANSLATIONS[language];
          return `${generic.flaggedWarning} ${translation.fullSpeech}`;
        }
        return translation.fullSpeech;
      }
    }
  }

  // If explanation is already in the target language (from Gemini)
  if (explanation?.summary && language !== 'en') {
    return `${explanation.summary} ${explanation.what_it_does ? explanation.what_it_does + '.' : ''} ${explanation.allergy_and_cautions || ''}`;
  }

  // Fallback template in the target language
  const generic = GENERIC_TRANSLATIONS[language];
  const medName = medicine?.Medicine || 'Medication';
  const isClean = safetyResult?.isClean ?? true;

  if (language === 'pidgin') {
    return isClean
      ? `This medicine na ${medName}. ${generic.cleanIntro} ${medicine?.Uses || ''}. Caution: ${medicine?.['Key warnings'] || generic.defaultDosageCaution}`
      : `${generic.flaggedWarning} Medicine name na ${medName}. ${generic.emergencyText}`;
  } else if (language === 'yoruba') {
    return isClean
      ? `Oogun yi ni ${medName}. ${generic.cleanIntro} O wa fun: ${medicine?.Uses || ''}. Ikilọ: ${medicine?.['Key warnings'] || generic.defaultDosageCaution}`
      : `${generic.flaggedWarning} Oogun ti a yewo ni ${medName}. ${generic.emergencyText}`;
  } else if (language === 'hausa') {
    return isClean
      ? `Wannan magani shine ${medName}. ${generic.cleanIntro} Yana aiki don: ${medicine?.Uses || ''}. Gargadi: ${medicine?.['Key warnings'] || generic.defaultDosageCaution}`
      : `${generic.flaggedWarning} Sunan maganin shine ${medName}. ${generic.emergencyText}`;
  } else if (language === 'igbo') {
    return isClean
      ? `Ọgwụ a bụ ${medName}. ${generic.cleanIntro} Ọ na-arụ ọrụ maka: ${medicine?.Uses || ''}. Ịdọ aka ná ntị: ${medicine?.['Key warnings'] || generic.defaultDosageCaution}`
      : `${generic.flaggedWarning} Aha ọgwụ a bụ ${medName}. ${generic.emergencyText}`;
  }

  // Default English
  return isClean
    ? `${medName}: ${explanation?.summary || medicine?.Uses || ''}. Caution: ${explanation?.allergy_and_cautions || medicine?.['Key warnings'] || generic.defaultDosageCaution}`
    : `${generic.flaggedWarning} ${medName}. Caution: ${explanation?.allergy_and_cautions || medicine?.['Key warnings'] || generic.defaultDosageCaution}`;
}
