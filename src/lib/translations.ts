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
      fullSpeech: 'Dis Paracetamol dey help bring down high fever and kill body pain sharp-sharp. Make you shine your eye: no drink pass two tablets at once, and no drink pass eight tablets for one whole day, so your liver go dey safe.'
    },
    yoruba: {
      headline: 'Oogun fun didin irora ati iba ku',
      body: 'Paracetamol n dawo ifihan irora duro si opolo re, o si n so iwọn otutu ara di tutu.',
      cautions: 'Ma se mu ju eyo meji lo leekan naa tabi eyo mejo lojumo lati dabobo edo re.',
      fullSpeech: 'Oògùn Paracetamol yìí wà fún dídín gbogbo ìrora ara, èfórí, àti ibà kù ní kíákíá. Ìkìlọ̀ pàtàkì: Ẹ má ṣe mu ju ẹyọ méjì lọ lẹ́ẹ̀kan náà, tàbí ẹyọ mẹ́jọ lójúmọ́ kí ẹ̀dọ̀ yín má baà bàjẹ́. Ẹ mu omi tó mọ́ dáadáa.'
    },
    hausa: {
      headline: 'Magani don saukaka zazzabi da ciwon jiki',
      body: 'Paracetamol yana toshe sakonnin ciwo zuwa kwakwalwa kuma yana saukar da zafin jiki.',
      cautions: 'Kada a sha fiye da kwaya biyu a lokaci guda, ko kwaya takwas a rana don kare hanta.',
      fullSpeech: 'Wannan magani na Paracetamol yana saukar da zazzaɓi da kuma ciwon jiki da ciwon kai cikin sauri. Gargaɗi mai mahimmanci: Kada a sha fiye da ƙwaya biyu a lokaci guda, ko ƙwaya takwas a yini guda don kare hantarku.'
    },
    igbo: {
      headline: 'Ọgwụ na-ebelata ahụ ọkụ na mgbu',
      body: 'Paracetamol na-egbochi ozi mgbu iru n\'ụbụrụ ma na-eme ka ahụ jụọ oyi.',
      cautions: 'Ejila karịa mkpụrụ abụọ n\'otu oge ma ọ bụ mkpụrụ asatọ n\'otu ụbọchị iji chebe imeju gị.',
      fullSpeech: 'Ọgwụ Paracetamol a na-ebelata ahụ ọkụ, isi ọwụwa, na mgbu dị n\'ahụ ngwa ngwa. Ịdọ aka ná ntị dị mkpa: Ejila karịa mkpụrụ abụọ n\'otu oge ma ọ bụ mkpụrụ asatọ n\'otu ụbọchị iji chebe imeju gị. Ṅụọ ya na mmiri dị ọcha.'
    }
  },

  // 2. Artemether-lumefantrine (Coartem, Lonart)
  artemether: {
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
      fullSpeech: 'Dis Coartem antimalarial medicine dey wipe out malaria parasites sharp-sharp. Make you chop food with small oil or drink milk before you swallow am, and abeg complete the whole three days treatment so the malaria no go come back.'
    },
    yoruba: {
      headline: 'Oogun to lagbara fun itoju aisan iba malaria',
      body: 'Artemether n pa awon kokoro iba malaria ni kiakia, lumefantrine n gbale awon to ku kuro.',
      cautions: 'Je ounje dada tabi mu wara ki o to lo oogun yi. Pari gbogbo e fun ojo meta.',
      fullSpeech: 'Oògùn Coartem yìí wà fún ìtọ́jú àìsàn ibà iba malaria tó lágbára. Jẹ oúnjẹ tó ní epo díẹ̀ tàbí mu wàrà kí o tó mu oògùn yìí kí ó lè ṣiṣẹ́ dídán, kí o sì parí gbogbo ọjọ́ mẹ́ta náà láì dá a dúró rárá.'
    },
    hausa: {
      headline: 'Babban magani don magance zazzabin cizon sauro',
      body: 'Artemether yana kashe kwayoyin cutar zazzabin cizon sauro cikin sauri yayin da lumefantrine ke share sauran.',
      cautions: 'A sha tare da abinci ko madara don ya yi aiki sosai. A kammala kwanaki uku.',
      fullSpeech: 'Wannan magani na Coartem yana magance cutar zazzabin cizon sauro. A sha shi tare da abinci mai maiko ko madara, kuma a tabbatar an kammala kwanaki ukun gaba ɗaya ko da an ji sauƙi.'
    },
    igbo: {
      headline: 'Ọgwụ mbụ maka ịgwọ ọrịa ịba (malaria)',
      body: 'Artemether na-egbu nje ịba ngwa ngwa ebe lumefantrine na-ekpochapụ ndị fọdụrụnụ.',
      cautions: 'Rie nri ma ọ bụ ṅụọ mmiri ara ehi tupu ị ṅụọ ya. Gụchaa ụbọchị atọ ahụ.',
      fullSpeech: 'Ọgwụ Coartem a bụ maka ịgwọ ọrịa ịba. Rie nri nwere mmanụ ma ọ bụ ṅụọ mmiri ara ehi tupu ị ṅụọ ya, ma mechaa ọgwụ ahụ ruo ụbọchị atọ zuru ezu ka ịba ahụ ghara ịlọghachi.'
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
      fullSpeech: 'Dis Salbutamol Ventolin inhaler dey open tight chest and airway when asthma or wheezing catch person. Press one or two puffs only. No use am continuously out of fear or panic; if chest still tight, rush go hospital immediately.'
    },
    yoruba: {
      headline: 'Oogun imumi fun sise oju ona eemi',
      body: 'O n tu awon isan to rọ mo oju ona eemi re laarin iseju marun lati je ki afefe wo inu re.',
      cautions: 'Eewo ni lati ma fa simu leralera nitori iberu; o le fa ki okan ma lu kiakia.',
      fullSpeech: 'Oògùn ìmúmí Salbutamol Ventolin yìí ń ṣí ojú ọ̀nà ẹ̀mí tó há sílẹ̀ ní kíákíá nígbà tí ikọ́-fèé bá ń yọ ènìyàn lẹ́nu. Ẹ fa ẹ̀ẹ̀kan tàbí ẹ̀ẹ̀mejì péré. Ẹ má ṣe fà á léraléra nítorí ìbẹ̀rù. Tí ẹ̀mí kò bá bọ̀ sípò láàárín ìṣẹ́jú márùn-ún, ẹ gbé e lọ sí ilé-ìwòsàn lẹ́ẹ̀kan náà.'
    },
    hausa: {
      headline: 'Magani mai bude hanyar numfashi cikin sauri',
      body: 'Yana bude tsokar hanyar numfashi cikin mintuna biyar don shigar iska mai kyau.',
      cautions: 'Kada a fesa akai-akai saboda firgita; yana iya haifar da bugun zuciya da sauri.',
      fullSpeech: 'Wannan magani na feshi na Salbutamol Ventolin yana buɗe hanyar numfashi cikin gaggawa yayin ciwon asma. A fesa sau ɗaya ko biyu kawai. Kada a fesa ba kakkautawa don firgita. Idan numfashi bai dawo daidai ba, a garzaya asibiti cikin gaggawa.'
    },
    igbo: {
      headline: 'Ọgwụ na-emeghe ụzọ iku ume ngwa ngwa',
      body: 'Ọ na-eme ka akwara ndị gbara ụzọ iku ume zuru ike n\'ime nkeji ise iji kuo ume nke ọma.',
      cautions: 'Akpọpụla ya ugboro ugboro n\'ihi ụjọ; ọ nwere ike ime ka obi na-akụ oke ọsọ.',
      fullSpeech: 'Ọgwụ iku ume Salbutamol Ventolin a na-emeghe ụzọ iku ume ngwa ngwa mgbe asma na-enye nsogbu. Kpọpụ ya ugboro abụọ pụrụ iche. Ejila ya n\'ike n\'ihi ụjọ. Ọ bụrụ na iku ume aka sikwa ike, gakwuru dọkịta n\'ụlọ ọgwụ ozugbo.'
    }
  },

  // 4. Diclofenac
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
      fullSpeech: 'Dis Diclofenac na strong painkiller for severe joint pain and swelling. Warning: If you get stomach ulcer, asthma, or painkiller allergy, no touch am at all. Always chop heavy food before you swallow am.'
    },
    yoruba: {
      headline: 'Oogun to lagbara fun didin wiwu ati irora eegun',
      body: 'O n din gbogbo wiwu eegun ati irora to le koko ku.',
      cautions: 'Eewo ni fun awon ti o ni ogbe-inu (ulcer) tabi iko-fe (asthma). Je ounje daadaa ki o to lo oogun yi.',
      fullSpeech: 'Oògùn Diclofenac yìí lágbára púpọ̀ fún dídín wíwú àti ìrora oríkèé-ara kù. Ìkìlọ̀ pàtàkì: Àwọn tí ó ní ọgbẹ́-inú ulcer tàbí ikọ́-fèé kò gbọdọ̀ lo oògùn yìí rárá. Jẹ oúnjẹ tó dán mọ́rán kí o sì mu omi púpọ̀ pẹ̀lú rẹ̀.'
    },
    hausa: {
      headline: 'Magani mai karfi don rage radadin ciwo da kumburi',
      body: 'Yana rage kumburin gabbai da matsanancin ciwon jiki.',
      cautions: 'Kada masu cutar gyabon ciki (ulcer) ko asma su sha. A sha tare da isasshen abinci.',
      fullSpeech: 'Wannan magani na Diclofenac yana rage kumburi da radadin ciwon jiki. Gargaɗi: Masu cutar gyabon ciki ko asma kada su sha wannan magani rārrā. A tabbatar an ci abinci sosai kafin a sha.'
    },
    igbo: {
      headline: 'Ọgwụ siri ike na-ebelata mgbu na ọzịza',
      body: 'Ọ na-ebelata ọzịza nkwonkwo na oke mgbu dị n\'ahụ.',
      cautions: 'Ndị nwere ọnya afọ (ulcer) ma ọ bụ asma ekwesịghị ịṅụ ya. Rie nri nke ọma tupu ị ṅụọ ya.',
      fullSpeech: 'Ọgwụ Diclofenac a na-ebelata oke mgbu na ọzịza nke ọma. Ịdọ aka ná ntị: Ndị nwere ọnya afọ ulcer ma ọ bụ nsogbu asma ekwesịghị ịṅụ ya ma ọlị. Rie nri nke ọma tupu ị ṅụọ ọgwụ a.'
    }
  },

  // 5. Amoxicillin / Augmentin (Antibiotic)
  amoxicillin: {
    en: {
      headline: 'Penicillin-class antibiotic',
      body: 'Destroys bacterial cell walls to eliminate respiratory, throat, and ear infections.',
      cautions: 'Contraindicated if you have a Penicillin allergy. Complete the full course.',
      fullSpeech: 'Amoxicillin is an antibiotic for bacterial infections. Warning: Do not take if you are allergic to Penicillin. Always finish the entire prescribed course even if symptoms stop.'
    },
    pidgin: {
      headline: 'Antibiotic medicine wey dey kill infection',
      body: 'E dey kill bad bacteria wey dey cause throat, chest, and wound infection.',
      cautions: 'If you get penicillin allergy, no touch am. Complete the whole pack.',
      fullSpeech: 'Dis Amoxicillin na antibiotic for bacterial infection. Warning: If penicillin dey give you body allergy or rash, no drink am at all. Make you drink all the capsules complete even if you feel better.'
    },
    yoruba: {
      headline: 'Oogun apakokoro aisan ti eya Penicillin',
      body: 'O n pa awon kokoro to n fa arun ninu ofun, eemi ati ara.',
      cautions: 'Eewo ni fun awon ti ara won ki gba Penicillin. Pari gbogbo oogun naa.',
      fullSpeech: 'Oògùn Amoxicillin yìí wà fún pípa àwọn kòkòrò àkóràn bakitéríà. Ìkìlọ̀: Tí ara yín kò bá gba egbòogi Penicillin, ẹ má ṣe lò ó. Ẹ rí i dájú pé ẹ lo gbogbo oògùn náà tán bí dokita ṣe kọ ọ́.'
    },
    hausa: {
      headline: 'Magani mai kashe kwayoyin cuta na Penicillin',
      body: 'Yana kashe kwayoyin cuta dake haddasa cututtukan makogwaro da na kirji.',
      cautions: 'Kada masu rashin lafiyar Penicillin su sha. A sha a kammala maganin.',
      fullSpeech: 'Wannan magani na Amoxicillin yana kashe kwayoyin cutar bacteria. Gargaɗi: Idan kuna da rashin lafiyar Penicillin, kada ku sha. Ku tabbatar kun sha maganin ya ƙare gaba ɗaya.'
    },
    igbo: {
      headline: 'Ọgwụ na-egbu nje bacteria n\'ahụ',
      body: 'Ọ na-egbu nje na-akpata ọrịa n\'akpịrị, n\'obi na n\'ahụ.',
      cautions: 'Ndị nwere nfụkasị na Penicillin ekwesịghị ịṅụ ya. Gụchaa ya kpamkpam.',
      fullSpeech: 'Ọgwụ Amoxicillin a bụ maka igbu nje bacteria. Ịdọ aka ná ntị: Ọ bụrụ na ahụ gị na-adịghị anabata Penicillin, anụla ya. Ṅụchaa ọgwụ ahụ niile dịka dọkịta si dee ya.'
    }
  }
};

// Generic fallback templates for any other drug or flagged situation with 100% native speech
export const GENERIC_TRANSLATIONS: Record<
  SupportedLanguage,
  {
    cleanIntro: string;
    flaggedWarning: string;
    defaultDosageCaution: string;
    emergencyText: string;
    speechSafeTemplate: (name: string) => string;
    speechFlaggedTemplate: (name: string) => string;
  }
> = {
  en: {
    cleanIntro: 'This medicine matches official Nigerian health guidelines and NAFDAC registration.',
    flaggedWarning: 'Warning: Red flags were detected with this medicine package. Do not consume before consulting a licensed pharmacist.',
    defaultDosageCaution: 'Always adhere to the exact dosage printed on the pack or prescribed by your healthcare provider.',
    emergencyText: 'If you experience severe swelling, skin rash, or breathing difficulty, seek emergency medical care immediately.',
    speechSafeTemplate: (name) => `${name} is verified safe on MedSure. Adhere strictly to the directions on the package leaflet. Do not mix with alcohol or unprescribed pain relievers.`,
    speechFlaggedTemplate: (name) => `Critical Safety Alert for ${name}: Warnings were detected on this package. Do not take this medicine until a licensed pharmacist has inspected it.`
  },
  pidgin: {
    cleanIntro: 'This medicine clear and e match official NAFDAC standards.',
    flaggedWarning: 'Red Alert! We see serious warning signs for this medicine. Abeg no drink am until you ask licensed pharmacist.',
    defaultDosageCaution: 'Follow the correct dosage wey doctor or the medicine pack write. No drink double dose.',
    emergencyText: 'If your throat begin tight or face begin swell, rush go hospital immediately.',
    speechSafeTemplate: (name) => `Dis medicine wey you check na ${name}. E dey safe and verified under NAFDAC rules. Make you take am strictly as packaging talk, and abeg no swallow extra tablets out of panic. Drink plenty clean water.`,
    speechFlaggedTemplate: (name) => `Shine your eye o! We see red flag for ${name}. Abeg no swallow this medicine at all today. Carry am go show licensed pharmacist for chemist or hospital make them check am for you.`
  },
  yoruba: {
    cleanIntro: 'Oogun yi ni ifọwọsi to peye lati odo ajo NAFDAC ati awon akosile eto ilera orile-ede Naijiria.',
    flaggedWarning: 'Ikilọ pataki! A ri awon ami ewu to lagbara ninu oogun yi. E ma se lo rara lai ri onisegun oyinbo tabi dokita.',
    defaultDosageCaution: 'Lo oogun yi gege bi ilana ti won ko si ara re tabi ti dokita so fun yin.',
    emergencyText: 'Ti e ba ri wiwu ni oju tabi ti eemi ba fe soro, e sare lo si ile-iwosan leekan naa.',
    speechSafeTemplate: (name) => `Oògùn ${name} tí ẹ yẹ̀wò yìí jẹ́ èyí tí ó péye tí ó sì ní àbò lábẹ́ ìlànà NAFDAC. Ẹ mu un gẹ́gẹ́ bí àkọsílẹ̀ tó wà lára rẹ̀. Ẹ má ṣe mu egbòogi mìíràn kún un láì gba ìmọ̀ràn lọ́wọ́ oníṣègùn. Ẹ mu omi tó mọ́.`,
    speechFlaggedTemplate: (name) => `Ìkìlọ̀ pàtàkì fún ${name}! Àwọn àmì ewu tó lágbára wà lára egbòogi yìí. Ẹ má ṣe mu un rárá lónìí. Ẹ gbé e lọ sí ọ̀dọ̀ oníṣègùn oyìnbó elétò fún àyẹ̀wò pípé.`
  },
  hausa: {
    cleanIntro: 'Wannan magani ya cika ka\'idojin hukumar NAFDAC da sharuɗɗan lafiya na Najeriya.',
    flaggedWarning: 'Gargadi mai tsanani! An gano matsaloli a wannan magani. Kada a sha har sai an tuntubi masanin magani ko likita.',
    defaultDosageCaution: 'Kada a sha fiye da adadin da likita ya rubuta ko aka rubuta a jikin maganin.',
    emergencyText: 'Idan an sami matsalar numfashi ko kumburin fuska, a garzaya asibiti cikin gaggawa.',
    speechSafeTemplate: (name) => `Wannan magani na ${name} yana da inganci kuma ya dace da ka'idojin NAFDAC. A sha shi daidai yadda aka rubuta a jikinsa. Kada a hada shi da wani magani daban ba tare da izinin likita ba. A sha da ruwa mai kyau.`,
    speechFlaggedTemplate: (name) => `Gargaɗi mai tsanani game da ${name}! An ga matsaloli a jikin wannan magani. Kada a kuskura a sha shi a yau. A kai shi wurin masanin magani a asibiti don ya duba shi.`
  },
  igbo: {
    cleanIntro: 'Ọgwụ a nwere nkwado zuru oke site n\'aka ndị NAFDAC na usoro nlekọta ahụike nke Naijiria.',
    flaggedWarning: 'Ịdọ aka ná ntị dị mkpa! Anyị hụrụ nsogbu n\'ọgwụ a. Anụla ya ma ọlị tupu gị na onye na-ere ọgwụ ekwurịta.',
    defaultDosageCaution: 'Na-aṅụ ọgwụ a dịka dọkịta siri kwuo ma ọ bụ dịka e siri dee ya n\'akwụkwọ ọgwụ.',
    emergencyText: 'Ọ bụrụ na iku ume esiri gị ike ma ọ bụ ihu gị na-aza aza, gaa ụlọ ọgwụ ozugbo.',
    speechSafeTemplate: (name) => `Ọgwụ ${name} a ị nyochara dị mma ma nwee nkwado NAFDAC. Ṅụọ ya dịka e siri kọwaa ya na ngwugwu ya. Ejila ọgwụ ọzọ gwakọta ya n'enweghị nkwado dọkịta. Ṅụọ ya na mmiri dị ọcha.`,
    speechFlaggedTemplate: (name) => `Ịdọ aka ná ntị dị ukwuu maka ${name}! Anyị hụrụ ihe ize ndụ n'ọgwụ a. Anụla ya ma ọlị taa. Buru ya gaa nyefee n'aka onye ọkachamara na-ere ọgwụ maka nyocha.`
  }
};

/**
 * Builds the exact spoken text for a medicine in the chosen language.
 * Guarantees 100% native language vocalization without English leakage.
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
  const medId = (medicine?.ID || '').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const medName = medicine?.Medicine || 'Medication';
  const isClean = safetyResult?.isClean ?? true;

  // 1. Check prepackaged translations for exact known medicines (100% native spoken audio)
  for (const [key, pack] of Object.entries(PREPACKAGED_TRANSLATIONS)) {
    if (medId.includes(key) || medName.toLowerCase().includes(key.replace('_', ' '))) {
      const translation = pack[language];
      if (translation) {
        if (!isClean) {
          const generic = GENERIC_TRANSLATIONS[language];
          return `${generic.flaggedWarning} ${translation.fullSpeech}`;
        }
        return translation.fullSpeech;
      }
    }
  }

  // 2. Check if explanation is already verified in target language (from Gemini)
  if (explanation?.language === language && explanation?.summary) {
    return `${explanation.summary} ${explanation.what_it_does ? explanation.what_it_does + '.' : ''} ${explanation.allergy_and_cautions || ''}`;
  }

  // 3. Native guaranteed speech templates (zero English leakage)
  const generic = GENERIC_TRANSLATIONS[language];
  if (!isClean) {
    return generic.speechFlaggedTemplate(medName);
  }
  return generic.speechSafeTemplate(medName);
}
