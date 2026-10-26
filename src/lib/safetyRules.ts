import medicinesData from '../../data/medicines.json';
import interactionsData from '../../data/interactions.json';

export interface MedicineRecord {
  ID: string;
  Medicine: string;
  'Other names (for matching)': string;
  'Active ingredients': string;
  Class: string;
  Groups: string;
  'Prescription only': string;
  Uses: string;
  'Key warnings': string;
  Children: string;
  'Pregnancy / breastfeeding': string;
  'Example brands (verify)': string;
  'NAFDAC numbers': string;
  Checkedby?: string;
  Referenceused?: string;
  Verified?: string;
  Notes?: string;
}

export interface InteractionRule {
  'Medicine or group A': string;
  'Medicine or group B': string;
  Severity: 'avoid' | 'caution' | 'separate' | string;
  'Message shown to user': string;
  Verified: string;
  Notes?: string;
}

export interface SafetyCheckResult {
  isClean: boolean;
  flags: {
    type: 'expired' | 'expiring_soon' | 'invalid_nafdac' | 'unregistered_nafdac' | 'not_in_dataset' | 'interaction' | 'prescription_warning' | 'allergy_warning';
    severity: 'red' | 'amber';
    title: string;
    message: string;
  }[];
  matchedMedicine: MedicineRecord | null;
  detectedGroups: string[];
  allergensDetected: string[];
}

export const MEDICINES: MedicineRecord[] = medicinesData as MedicineRecord[];
export const INTERACTIONS: InteractionRule[] = interactionsData as InteractionRule[];

// Official NAFDAC registration pattern: e.g. A4-0123, 04-1234, B4-5678, NR-01234
export const NAFDAC_REGEX = /^([A-Z0-9]{2}-?[0-9]{4,6}|NR-?[0-9]{4,6})$/i;

// Match extracted name to dataset
export function matchMedicine(extractedName: string): MedicineRecord | null {
  if (!extractedName) return null;
  const cleaned = extractedName.trim().toLowerCase();

  // 0. Emergency / Symptom keyword shortcuts
  if (cleaned.includes('asthma') || cleaned.includes('wheezing') || cleaned.includes('respiratory')) {
    const salb = MEDICINES.find(m => m.ID === 'salbutamol');
    if (salb) return salb;
  }

  // 1. Direct ID match
  const directId = MEDICINES.find(m => m.ID.toLowerCase() === cleaned);
  if (directId) return directId;

  // 2. Direct name match
  const directName = MEDICINES.find(m => m.Medicine.toLowerCase() === cleaned);
  if (directName) return directName;

  // 3. Exact alias / brand match (highest priority before partial matching)
  for (const med of MEDICINES) {
    const otherNames = (med['Other names (for matching)'] || '').toLowerCase().split(';').map(s => s.trim());
    const brands = (med['Example brands (verify)'] || '').toLowerCase().split(';').map(s => s.trim());
    const active = (med['Active ingredients'] || '').toLowerCase().split(';').map(s => s.trim());
    if ([...otherNames, ...brands, ...active].includes(cleaned)) {
      return med;
    }
  }

  // 4. Substring alias match prioritized by longest matching token
  let bestMatch: MedicineRecord | null = null;
  let longestMatchLength = 0;

  for (const med of MEDICINES) {
    const otherNames = (med['Other names (for matching)'] || '').toLowerCase().split(';');
    const brands = (med['Example brands (verify)'] || '').toLowerCase().split(';');
    const active = (med['Active ingredients'] || '').toLowerCase().split(';');
    const allAliases = [...otherNames, ...brands, ...active].map(s => s.trim()).filter(Boolean);

    for (const alias of allAliases) {
      if (cleaned.includes(alias) || alias.includes(cleaned)) {
        if (alias.length > longestMatchLength) {
          longestMatchLength = alias.length;
          bestMatch = med;
        }
      }
    }
  }

  if (bestMatch) return bestMatch;

  // 5. Word-level overlap match
  const words = cleaned.split(/[\s,/-]+/).filter(w => w.length > 3);
  for (const med of MEDICINES) {
    for (const word of words) {
      if (med.Medicine.toLowerCase().includes(word) ||
         (med['Active ingredients'] || '').toLowerCase().includes(word) ||
         (med['Example brands (verify)'] || '').toLowerCase().includes(word)) {
        return med;
      }
    }
  }

  return null;
}

// 100% Deterministic Safety Evaluation
export function evaluateSafety({
  extractedName,
  expiryDate,
  nafdacNumber,
  isPhotoScan = false,
  cabinet = []
}: {
  extractedName: string;
  expiryDate?: string;
  nafdacNumber?: string;
  isPhotoScan?: boolean;
  cabinet?: MedicineRecord[];
}): SafetyCheckResult {
  const flags: SafetyCheckResult['flags'] = [];
  const matched = matchMedicine(extractedName);
  const detectedGroups: string[] = [];
  const allergensDetected: string[] = [];

  // 1. Database Catalogue Check
  if (!matched) {
    flags.push({
      type: 'not_in_dataset',
      severity: 'amber',
      title: 'Unverified in National Formulary',
      message: `"${extractedName}" was not found in the verified Nigerian Essential Medicines dataset. Please confirm with a licensed pharmacist.`
    });
  } else {
    if (matched.Groups) {
      matched.Groups.split(',').map(g => g.trim().toLowerCase()).forEach(g => {
        if (g && !detectedGroups.includes(g)) detectedGroups.push(g);
      });
    }

    // Allergy alerts (NSAIDs, Sulfas, Penicillins)
    if (detectedGroups.includes('nsaid')) {
      allergensDetected.push('NSAID (Non-Steroidal Anti-Inflammatory)');
      flags.push({
        type: 'allergy_warning',
        severity: 'amber',
        title: 'NSAID Allergy Warning',
        message: 'This medicine contains an NSAID. Do NOT take if you have a known allergy to Aspirin, Ibuprofen, or other pain relievers, or a history of stomach ulcers.'
      });
    }
    if (detectedGroups.includes('sulfonamide')) {
      allergensDetected.push('Sulfa / Sulfonamide');
      flags.push({
        type: 'allergy_warning',
        severity: 'amber',
        title: 'Sulfa Allergy Warning',
        message: 'Contains a sulfonamide (sulfa). Dangerous for individuals with sulfa allergies (G6PD deficiency alert).'
      });
    }

    // Prescription Only Check
    if (matched['Prescription only']?.toLowerCase() === 'yes') {
      flags.push({
        type: 'prescription_warning',
        severity: 'amber',
        title: 'Prescription-Only Medicine',
        message: 'This drug is classified as Prescription-Only in Nigeria. It must only be used under medical supervision.'
      });
    }
  }

  // 2. Expiry Date Check
  if (expiryDate) {
    const today = new Date();
    // Parse common formats YYYY-MM, MM/YY, MM/YYYY, DD/MM/YYYY
    let expYear = 0;
    let expMonth = 0;

    const parts = expiryDate.match(/(\d{4})[-/](\d{1,2})/) || expiryDate.match(/(\d{1,2})[-/](\d{2,4})/);
    if (parts) {
      if (parts[1].length === 4) {
        expYear = parseInt(parts[1], 10);
        expMonth = parseInt(parts[2], 10);
      } else {
        expMonth = parseInt(parts[1], 10);
        expYear = parseInt(parts[2], 10);
        if (expYear < 100) expYear += 2000;
      }

      if (expYear && expMonth) {
        const expDate = new Date(expYear, expMonth, 0); // Last day of expiry month
        const diffDays = Math.ceil((expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          flags.push({
            type: 'expired',
            severity: 'red',
            title: 'EXPIRED MEDICINE DETECTED',
            message: `This package expired in ${expiryDate}. Expired medication can degrade into toxic byproducts or fail during life-threatening episodes. Do NOT consume.`
          });
        } else if (diffDays <= 60) {
          flags.push({
            type: 'expiring_soon',
            severity: 'amber',
            title: 'Expiring Soon',
            message: `Expires within ${diffDays} days (${expiryDate}). Do not stock long-term.`
          });
        }
      }
    }
  }

  // 3. NAFDAC Verification
  if (nafdacNumber && nafdacNumber.trim()) {
    const cleanNafdac = nafdacNumber.trim().replace(/\s+/g, '');
    if (!NAFDAC_REGEX.test(cleanNafdac)) {
      flags.push({
        type: 'invalid_nafdac',
        severity: 'red',
        title: 'Suspect NAFDAC Number Format',
        message: `The scanned number "${nafdacNumber}" does not match standard Nigerian NAFDAC registration formatting (e.g. 04-1234 or A4-5678). High counterfeit risk.`
      });
    }
  } else if (isPhotoScan) {
    flags.push({
      type: 'unregistered_nafdac',
      severity: 'amber',
      title: 'Missing NAFDAC Registration Number',
      message: 'No NAFDAC number was clearly visible on the pack. Verify the label manually before ingestion.'
    });
  }

  // 4. Multi-Drug Interaction Check against Cabinet
  if (matched && cabinet.length > 0) {
    for (const item of cabinet) {
      if (item.ID === matched.ID) continue;

      // Group-based collisions
      for (const group of detectedGroups) {
        const itemGroups = (item.Groups || '').split(',').map(g => g.trim().toLowerCase());
        if (itemGroups.includes(group)) {
          // Check interaction table
          const groupRule = INTERACTIONS.find(i => 
            (i['Medicine or group A'] === `group:${group}` && i['Medicine or group B'] === `group:${group}`)
          );

          if (groupRule) {
            flags.push({
              type: 'interaction',
              severity: groupRule.Severity === 'avoid' ? 'red' : 'amber',
              title: `Dangerous Combination: Multiple ${group.toUpperCase()}s`,
              message: `You already have ${item.Medicine} in your cabinet. ${groupRule['Message shown to user']}`
            });
          }
        }
      }

      // Direct medicine collisions
      const directRule = INTERACTIONS.find(i => 
        (i['Medicine or group A'] === matched.ID && i['Medicine or group B'] === item.ID) ||
        (i['Medicine or group A'] === item.ID && i['Medicine or group B'] === matched.ID)
      );

      if (directRule) {
        flags.push({
          type: 'interaction',
          severity: directRule.Severity === 'avoid' ? 'red' : 'amber',
          title: `Direct Interaction with ${item.Medicine}`,
          message: directRule['Message shown to user']
        });
      }
    }
  }

  const isClean = !flags.some(f => f.severity === 'red');

  return {
    isClean,
    flags,
    matchedMedicine: matched,
    detectedGroups,
    allergensDetected
  };
}
