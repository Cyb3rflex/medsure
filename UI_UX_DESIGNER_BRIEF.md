# MedSure — UI/UX Design Specification & Deliverables Brief
**Project:** MedSure (AI-Powered Medicine Safety & Emergency Voice Assistant for Africa)  
**Target Platform:** Mobile-First Web Application (PWA / Responsive: Mobile 375×812px, Tablet 768×1024px, Desktop 1440×900px)  
**Target Audience:** Patients, Home Caregivers, and Licensed Community Pharmacists in Nigeria / West Africa  
**Primary Design Tool:** Figma / Penpot  

---

## 1. Executive Summary & Product Vision

### 1.1 The Core Problem & Emotional Hook
In moments of acute medical crisis at home (e.g., a sudden pediatric asthma attack, severe breathlessness, fever, or allergic reaction), panic strikes. Families frequently struggle with:
1. **Unreadable or Confusing Drug Packs:** Complex chemical names (*Salbutamol, Artemether-Lumefantrine, Diclofenac*) that do not explain what the medicine does.
2. **Panic Overdosing & Lethal Combinations:** Giving extra doses or mixing duplicate drug classes (e.g., Ibuprofen + Diclofenac) out of desperation.
3. **Counterfeits & Expired Stock:** Over 30% of medicines in developing markets may be substandard or falsified, with forged or missing NAFDAC (Nigerian food & drug regulatory) numbers.
4. **Language & Literacy Barriers:** Warnings written in dense clinical English rather than accessible native languages (*Nigerian Pidgin, Yorùbá, Hausa, Igbo*).

### 1.2 What MedSure Does
MedSure is a life-saving digital safety companion:
* **Instant Camera Scanner:** Uses multimodal vision OCR to read medicine packs, extract batch numbers, expiration dates, and verify official NAFDAC registration numbers.
* **Deterministic Code Safety Guardrails:** Hard-coded medical rules that instantly flag expired medicines, duplicate drug classes, and high-risk allergies (NSAIDs, Sulfas).
* **Plain-Language Explanations & Multilingual Voice Notes:** Explains active ingredients and safe usage in English, Pidgin, Yoruba, Hausa, and Igbo with voice playback.
* **Home Emergency Voice Triage:** An urgent, high-visibility "Voice What You Are Going Through" assistant providing step-by-step triage (e.g., respiratory positioning, call 112 emergency line).
* **Cross-Drug Interaction Cabinet:** Real-time drug-drug clash detection across home medicine stocks.
* **Licensed Pharmacist-in-the-Loop Portal:** Flagged suspect medications are routed to a clinician portal for remote approval or rejection.

---

## 2. Design Persona Profiles

| Persona | Role | Context & Pain Points | Key Design Priorities |
|---|---|---|---|
| **Amaka (Caregiver)** | Mother / Family Caregiver | Panicked at 2 AM with a sick child; low clinical literacy; needs reassurance and simplicity. | Ultra-clear color coding, large touch targets, emergency voice button, audio notes in Nigerian Pidgin/Yorùbá. |
| **Tunde (Patient / Shopper)** | Everyday Consumer | Standing in an OTC chemist/pharmacy checking if a medicine is genuine and unexpired. | Fast camera viewfinder, scanline animation, high-contrast NAFDAC badge, clear green/amber/red indicators. |
| **Dr. Ibrahim (Pharmacist)** | Community Pharmacist | Busy behind the pharmacy counter; needs to quickly review escalated suspect cases. | Clean, high-density desktop/tablet clinical queue, quick approve/reject actions, patient note editor. |

---

## 3. Brand Identity & Visual Language Guidelines

### 3.1 Design Aesthetic: "Clinical Cyber-Safety"
* **Style:** High-trust modern healthcare with dark-mode glassmorphism (`glass-panel`), subtle neon glow accents, rounded corners (`rounded-2xl` / `rounded-3xl`), and crisp micro-animations.
* **Feeling:** Authoritative, calming, ultra-modern, reliable, and accessible.

### 3.2 Color System (Design Tokens)

```
Primary Pharmacy Emerald (Safety & Trust)
├── 50:  #ecfdf5
├── 400: #34d399 (Glow borders, secondary accents)
├── 500: #10b981 (Primary CTA, Verified clean state)
└── 950: #022c22 (Panel background accents)

Alert Crimson (Red Flags, Fatal Clashes, Expired)
├── 400: #f87171
├── 500: #ef4444 (Critical alerts, Reject button)
└── 950: #450a0a (Danger card background)

Warning Amber (Caution, Prescription-only, Pregnancy caution)
├── 400: #fbbf24
├── 500: #f59e0b (Warning badges, Escalated status)
└── 950: #451a03 (Warning card background)

Brand Dark Navy (Background & Surface)
├── 800: #1e293b (Border highlights & cards)
├── 900: #0f172a (Primary elevated cards / headers)
└── 950: #090d16 (Deep app background canvas)
```

### 3.3 Typography
* **Primary Font:** **Plus Jakarta Sans** or **Inter** (Google Fonts — Modern, legible, geometric numerals for dosages).
* **Display / Accent Font:** **Outfit** or **Plus Jakarta Sans** (Semi-bold / Bold for headings & alerts).
* **Monospace Font:** **JetBrains Mono** or **Roboto Mono** (for NAFDAC numbers, Batch IDs, and timestamps).
* **Scale:**
  * Hero Display: 32px – 48px (Bold, Line Height: 1.1)
  * Section Headers (H2/H3): 18px – 24px (Semi-Bold)
  * Body Text: 14px – 16px (Regular / Medium, High contrast)
  * Micro-copy / Badges: 10px – 12px (Bold / Monospace)

### 3.4 Accessibility Standards
* **WCAG 2.1 AA Compliance:** Minimum contrast ratio 4.5:1 for all text.
* **Touch Targets:** Minimum 44×44px on all interactive mobile buttons and chips.
* **Dual-Coding:** Never rely on color alone — always accompany Red/Green/Amber with explicit icons (CheckCircle, AlertTriangle, XCircle) and clear textual labels.

---

## 4. Master Screen Inventory & Deliverables Checklist

The designer must deliver the following **8 Core Screens/Flows**, optimized for **Mobile (375px/390px)** and **Desktop (1440px)**:

```
[Flow 0: Story & 3D Interactive Landing Page]
       │
       ▼
[Global Navigation & Language Bar] (English, Pidgin, Yorùbá, Hausa, Igbo)
       │
       ├─────────────────────────────────┬─────────────────────────────────┐
       ▼                                 ▼                                 ▼
[Flow 1: Home Emergency Voice]   [Flow 2: Camera Scanner]         [Flow 3: Medicine Cabinet]
(Acute Panic / 112 Triage)       (OCR Viewfinder / Upload)        (Cross-Drug Interaction Matrix)
                                         │
                                         ▼
                                 [Flow 4: Safety Result View]
                                 ├── 4A: Clean Verified (Green)
                                 ├── 4B: Warning / Caution (Amber)
                                 └── 4C: Danger / Red Flag (Red)
                                         │
                                 ┌───────┴───────┐
                                 ▼               ▼
                        [Flow 5: Audio Player] [Flow 6: Coursera Q&A]
                        (Multilingual Voice)   (Contextual chips)
                                         │
                                         ▼
                                 [Flow 7: Pharmacist Portal]
                                 (Clinical Escalation Queue)
```

---

## 5. Detailed Screen-by-Screen Specifications

### Screen 1: Storytelling & Hero Landing Page
* **Purpose:** Introduce MedSure’s mission, emotional hook (preventing home crisis panic), and technology pillars.
* **Key Components:**
  * **Interactive Hero:** 3D medicine pack / capsule visual (or isometric card) with active floating pulse indicators.
  * **Live Problem Statement Card:** Real family respiratory attack crisis scenario highlighting the danger of panic overdosing and unverified pills.
  * **Quick Metric Badges:** 43 Nigerian Essential Medicines, 100% Deterministic Code Safety Rules, 5 African Languages Supported.
  * **Primary Call to Action:** "Launch MedSure Scanner" (Emerald glowing CTA button) + "Test Emergency Voice Assistant".

### Screen 2: Global Header & Native Language Switcher
* **Key Components:**
  * **Logo & Shield Badge:** MedSure logo with a glowing clinical cross/pill icon and "Nigeria Edition" badge.
  * **Language Switcher Dropdown/Pills:** Quick toggle between 🇬🇧 English, 🇳🇬 Nigerian Pidgin, 🇳🇬 Yorùbá, 🇳🇬 Hausa, and 🇳🇬 Igbo.
  * **Tab Navigation Bar:**
    * 📖 Story & Mission
    * 🔍 Check Medicine
    * 🗄️ My Cabinet *(with real-time item counter pill)*
    * 👨‍⚕️ Pharmacist Portal *(with pulsing red notification badge when items are flagged)*

### Screen 3: Acute Emergency Voice & Panic Triage Banner
* **Purpose:** Provide immediate life-saving support during sudden medical emergencies (respiratory attack, severe allergy, choking).
* **Key Components:**
  * **Urgent Action Trigger:** Glowing crimson/emerald gradient banner with a prominent **"Voice What You Are Going Through"** microphone button.
  * **Voice Input State:** Pulsing audio recording modal with live waveform visualizer and cancel/done buttons.
  * **Emergency Action Cards:**
    * 🫁 *Respiratory / Asthma Attack:* Upright positioning guide, loosen tight neckwear, avoid forced swallowing.
    * ⚠️ *Emergency Hotline Quick-Dial:* Direct tap-to-call button for Nigerian Emergency Lines (**112 / 199**).
    * 🚫 *Anti-Panic Dosing Warning:* High-visibility alert against swallowing extra pills out of fear.

### Screen 4: Medicine Pack Camera Scanner & Search
* **Key Components:**
  * **Camera Viewfinder:** Simulated mobile camera aperture with animated emerald laser scanline, corner bracket guides, and "Align medicine pack label" tooltip.
  * **Alternative Input:** Drag-and-drop file upload zone + manual search bar with live auto-complete.
  * **Quick-Demo Simulation Chips:** Horizontal scrolling pills to immediately test pre-configured scenarios:
    1. 🫁 *Salbutamol / Ventolin (Acute Respiratory Inhaler)*
    2. 🟢 *Panadol Extra (Paracetamol + Caffeine)*
    3. 🔴 *Expired Coartem (Severe Red Flag Alert)*
    4. ⚠️ *Diclofenac (High-Risk NSAID Allergy Trigger)*
    5. 🟡 *Fansidar / SP (Sulfa Drug Allergy Warning)*
  * **Scanning / Loading Skeleton State:** Glowing pulse card with spinner, reading: *"Analyzing pack with Gemini Flash Vision & executing safety guardrails..."*

### Screen 5: Clinical Safety Result & Breakdown (The Core Screen)
*This is the most critical screen of the app. It must be designed in **3 distinct visual variants**:*

#### Variant 5A: Clean / Verified Safe (Green Theme)
* Emerald status header: *"SAFETY GUARDRAIL: VERIFIED CLEAN"*
* NAFDAC registration badge verified (`NAFDAC Reg No: 04-1234 — Validated`).
* Expiry date countdown pill (`Valid: 18 months remaining`).

#### Variant 5B: Warning / Caution Attached (Amber Theme)
* Amber banner: *"CAUTION: PRESCRIPTION RESTRICTIONS OR WARNINGS"*
* Prescription-only (POM) notice, pregnancy warning, or child dosage caution.

#### Variant 5C: Red Flag Detected — Do Not Take (Crimson Theme)
* Crimson emergency banner: *"RED FLAGS DETECTED — DO NOT TAKE"*
* Reason highlight cards: e.g., *"MEDICINE EXPIRED (14 days ago)"* or *"UNVERIFIED NAFDAC NUMBER"*.
* Dosage instructions are **strictly locked/hidden**, replaced by an **"Escalate to Pharmacist"** button.

#### Common Sub-Components on Screen 5:
1. **Plain-Language Molecule Breakdown Card:**
   * Active Ingredient name + phonetic pronunciation.
   * "What it does inside your body" (layman's biological explanation).
   * "Why it relieves your symptoms".
   * "Panic Overdose Alert" (explicit warning against taking extra doses).
2. **Allergy & Drug Class Badges:**
   * High-contrast warning tags for **NSAIDs**, **Sulfas/Sulfonamides**, and **Penicillins**.
3. **Primary Action Bar:**
   * `[+ Save to Medicine Cabinet]` (with celebration micro-interaction / confetti)
   * `[Share Safety Report]` (generates clean shareable card/PDF)
   * `[Escalate to Pharmacist]` (pulsing red button when red flags are caught)

### Screen 6: Multilingual Audio Voice Note Player
* **Key Components:**
  * Language flag & native title (*"Listen in Nigerian Pidgin" / "Gbo ni Yorùbá"*).
  * Audio Waveform Visualizer (animated sound bars responsive to play/pause).
  * Play / Pause circular primary button.
  * Progress timeline scrubber with elapsed / total duration.
  * Playback Speed Selector pills (`0.8x`, `0.9x`, `1.0x`) designed for elderly and low-literacy clarity.

### Screen 7: Interactive Follow-Up Questions (Coursera-Style)
* **Key Components:**
  * Section Title: *"Interactive Questions & Clarifications"*
  * Contextual Prompt Chips (3 suggested clickable questions):
    * *"Can I take this with food or on an empty stomach?"*
    * *"What if the patient has high blood pressure or asthma?"*
    * *"What are safer alternatives if I have an NSAID allergy?"*
  * Custom Doubt Input Box: Text input field with microphone icon and "Ask Question" submit button.
  * Answer Expansion Drawer/Card: Clear, friendly response with clinical safety caveat.

### Screen 8: "My Medicine Cabinet" & Cross-Drug Interaction Matrix
* **Key Components:**
  * **Cabinet Inventory Grid/List:** Cards showing all saved medicines at home with thumbnail, dosage form, and expiration indicator.
  * **Real-Time Cross-Drug Interaction Alert Box:**
    * Automatically highlights severe drug-drug clashes (e.g., taking *Ibuprofen + Diclofenac* simultaneously).
    * Clear explanation of the biological clash (e.g., *"Doubling NSAID active agents increases stomach bleeding and ulcer risk"*).
  * **Remove / Manage Actions:** Quick swipe-to-delete or remove button.
  * **Add New Medicine FAB / Button:** Fast shortcut back to the scanner.

### Screen 9: Licensed Pharmacist-in-the-Loop Portal (Desktop & Tablet)
* **Purpose:** Clinical triage dashboard for registered healthcare professionals.
* **Key Components:**
  * **Flagged Queue Table / Kanban:**
    * Case ID (`#RX-4821`), Timestamp, Medicine Name, Detected Flag (`Expired`, `Invalid NAFDAC`, `Allergy Clash`), Patient Status (`Pending Review`).
  * **Audit Detail Inspection Drawer:**
    * Photo of the scanned physical pack.
    * OCR extracted data vs. verified national database comparison.
    * Safety engine red-flag logs.
  * **Pharmacist Disposition Actions:**
    * Pharmacist Clinical Notes text area.
    * Green `[Approve with Notes]` button.
    * Red `[Reject & Issue Warning]` button.
    * Digital stamp / Pharmacist license sign-off seal.

---

## 6. UI Component Kit & Micro-Interactions Checklist

The designer should provide a Figma Component Library containing:

- [ ] **Status Badges & Tags:**
  - `Verified Clean` (Emerald)
  - `Caution / Warning` (Amber)
  - `Critical Red Flag` (Crimson)
  - `Prescription Only (POM)`
  - `NAFDAC Verified / Unverified`
  - `Allergy Alert: NSAID / Sulfa / Penicillin`
- [ ] **Interactive Buttons:**
  - Primary Glowing Emerald CTA (`glow-emerald`)
  - Danger Action Button (`glow-crimson`)
  - Emergency Microphone Record Button (with idle, recording, and processing states)
  - Ghost / Outline button
- [ ] **Audio Waveform Player Component:**
  - Idle state, Playing animated state, Speed toggle buttons (`0.8x`, `1.0x`)
- [ ] **Camera Viewfinder Graphic:**
  - Frame brackets, scanning laser line overlay, pack alignment guidelines
- [ ] **Cards & Glassmorphism Surfaces:**
  - `glass-panel` background styles (Dark Navy with 60% opacity and subtle 1px border)
- [ ] **Modal & Drawer Overlays:**
  - Emergency Triage overlay
  - Pharmacist Clinical Review inspection drawer

---

## 7. Deliverables & Handoff Requirements

Please provide the final handoff via **Figma** with:
1. **Figma Design File (.fig or shared link):**
   * Auto-Layout enabled on all buttons, cards, and list items.
   * Responsive constraints set for Mobile (375px/390px) and Desktop (1440px).
   * Figma Variables / Design Tokens for all colors, typography, and spacing.
2. **Interactive Clickable Prototype:**
   * Flow 1: Scanner → Scan Simulation → Safety Result View → Add to Cabinet.
   * Flow 2: Red Flag Scan → Pharmacist Escalation → Pharmacist Approval.
   * Flow 3: Tap Emergency Banner → Voice recording modal → Triage recommendation.
3. **Exportable Assets:**
   * SVG icons (custom medical badges, NAFDAC shield, audio wave, emergency siren).
   * 3D or 2.5D Medicine Illustration assets (PNG/SVG transparent).
