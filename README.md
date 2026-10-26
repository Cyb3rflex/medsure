# MedSure 🛡️💊
> **AI-Powered Medicine Safety, Active Ingredient Breakdown & Emergency Voice Triage for Africa**  
> *Built for the OSCA Ile-Ife Hacktoberfest Challenge: OPEN//BUILD 2026*  
> **Theme:** *"AI belongs to everyone. Build for a world you understand. Make it open."*

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black.svg?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![Open-Weight AI](https://img.shields.io/badge/Open--Weight-Gemma%202%20%7C%20Qwen2.5--VL-8b5cf6.svg)](MODEL_CARD.md)
[![Status: Hackathon Submission](https://img.shields.io/badge/OSCA--Ile--Ife-OPEN%2F%2FBUILD%202026-orange.svg)](SUBMISSION.md)

---

## 📖 Table of Contents
1. [The Real-World Crisis](#-the-real-world-crisis)
2. [What MedSure Does](#-what-medsure-does)
3. [Key Features](#-key-features)
4. [Two-Tier Safety Architecture](#-two-tier-safety-architecture)
5. [Open-Weight Model Strategy](#-open-weight-model-strategy)
6. [Supported Languages](#-supported-languages)
7. [Getting Started (Reproducibility Guide)](#-getting-started-reproducibility-guide)
8. [Project Structure](#-project-structure)
9. [Submission & Pitch Guide](#-submission--pitch-guide)
10. [Licence & Acknowledgements](#-licence--acknowledgements)

---

## 🌍 The Real-World Crisis

In Nigeria and across West Africa, preventable medicine tragedies happen every single day due to illiteracy, confusing packaging, counterfeit drugs, and acute panic at home:

* **Substandard Drugs in Local Chemists:** In Ajala town (Northern Nigeria), residents suffer organ injury after buying sub-standard medicines from unverified chemists.
* **18,000+ Drug Allergy Cases:** In the riverine regions of Nigeria, over 18,000 cases of severe allergic reactions have caused permanent skin and organ mutations because patients took drugs without knowing they contained allergens (e.g. Sulfas or NSAIDs).
* **Panic Overdose in Students:** In Ondo State, a 19-year-old university student lost her life to accidental analgesic overdose. Suffering from severe exam-related migraine, she repeatedly took pills out of desperation to end the pain.
* **Fatal Drug-Drug Combinations:** A revered community monarch in southern Nigeria passed away after taking an uncoordinated combination of anti-diabetic and prescription drugs.
* **Emergency Panic at Home:** When a family member suffers an acute asthma attack or anaphylaxis, families panic. They stare at drug boxes with complex Latin names (*Salbutamol, Artemether-Lumefantrine*), have no idea which active component does what, and risk giving dangerous doses.

**MedSure was built to solve this.**

---

## 💡 What MedSure Does

MedSure is an open-source, mobile-first digital health guardian designed specifically for everyday African families:

1. **Snap & Read:** Take a picture of any medicine pack or bottle, or type its name. Multimodal vision AI extracts the medicine name, strength, batch number, expiry date, and official **NAFDAC Registration Number**.
2. **Deterministic Safety Verification:** The app runs deterministic code checks against 43 Nigerian Essential Medicines and 14 clinical drug interaction rules—validating NAFDAC formats and calculating expiration days.
3. **Active Ingredient Breakdown:** Explains what the active chemical molecules actually do in plain human terms, and explicitly warns against panic overdosing.
4. **Multilingual Voice Notes:** Speaks to the user in **English, Nigerian Pidgin, Yorùbá, Hausa, or Igbo** with sound-wave visualization and adjustable playback speeds.
5. **Home Emergency Mode:** Immediate one-tap crisis triage for asthma and allergic emergencies, giving airway positioning first aid and calling **112 / 199**.
6. **Cross-Drug Interaction Cabinet:** Alerts households if two medicines in their home clash (e.g. taking two NSAIDs together).
7. **Licensed Pharmacist-in-the-Loop:** Red-flagged medications are routed to a clinical queue where registered pharmacists can review, add notes, and Approve or Reject.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 📸 **Multimodal OCR Scanner** | Reads blister strips, packaging boxes, and syrup bottles. Includes 1-click demo presets for judging. |
| 🛡️ **Zero-Hallucination Safety** | Pure code handles expiry math, NAFDAC pattern validation, and allergy badges. AI never invents dosages. |
| 🧪 **Mechanism of Action Cards** | Breaks down chemical names into everyday language (e.g. how Salbutamol widens narrowed airways). |
| ⚠️ **Allergy Class Badges** | Instant visual warning badges for NSAIDs (Ibuprofen, Diclofenac) and Sulfas (Septrin, Fansidar). |
| 🎓 **Coursera-Style Follow-Up Q&A** | Contextual question chips (e.g. *"Can I take this with food?"*) with mandatory pharmacist referral advice. |
| 💊 **My Medicine Cabinet** | Matrix-based cross-drug clash detection across all stored home medications. |
| 🗣️ **Multilingual Audio Player** | Voice synthesis in 5 local languages with 0.8x / 0.9x / 1.0x playback speed controls for elderly users. |
| 👨‍⚕️ **Pharmacist Portal** | Dedicated clinical queue for licensed pharmacists to audit flagged medications. |

---

## 🏛️ Two-Tier Safety Architecture

In healthcare, **AI hallucination can be fatal**. MedSure solves this by strictly separating clinical safety from linguistic translation:

```
+─────────────────────────────────────────────────────────────+
|                     User Inputs Medicine                    |
|             (Camera Photo / Text Input / Preset)            |
+─────────────────────────────────────────────────────────────+
                               │
                               ▼
+─────────────────────────────────────────────────────────────+
|               TIER 1: Deterministic Code Engine              |
|        - NAFDAC Regex Format Check (04-1234 / A4-5678)      |
|        - Expiry Calculation (Current Date vs Expiry)        |
|        - Allergy Classification (NSAIDs, Sulfas, etc.)      |
|        - 14 Drug-Drug Interaction Rules                     |
+─────────────────────────────────────────────────────────────+
                               │
            ┌──────────────────┴──────────────────┐
     [ RED FLAGS FOUND ]                   [ CLEAN RESULT ]
            │                                     │
            ▼                                     ▼
 ❌ Halts dosage advice                 ✅ Tier 2: Open-Weight AI
 🚨 Shows warning badges                📝 Generates plain explanation
 📋 Routes to Pharmacist Queue          🎙️ Generates audio voice note
                                        🎓 Generates Coursera-style Q&A
```

---

## 🤖 Open-Weight Model Strategy

MedSure aligns with the **OPEN//BUILD 2026** requirement to meaningfully employ open-weight foundation models:

* **Reasoning & Multilingual Generation:** **Google Gemma 2 (9B & 2B)** (`google/gemma-2-9b-it`). Gemma 2 provides state-of-the-art parameter efficiency, with the 2B model capable of running on edge hardware in low-connectivity rural health centers.
* **Multimodal Vision OCR:** **Qwen2.5-VL-7B-Instruct** (`Qwen/Qwen2.5-VL-7B-Instruct`) and **SmolVLM-500M** for lightweight document and blister strip text extraction.
* **Speech & Audio:** **OpenAI Whisper** and **Meta MMS** (Massively Multilingual Speech) for West African language support.

For comprehensive architectural specifications, prompt schemas, and benchmarks, read [`MODEL_CARD.md`](file:///c:/Users/Cyberflex/Documents/medsure/MODEL_CARD.md).

---

## 🗣️ Supported Languages

MedSure communicates in the languages spoken across Nigerian households:
* 🇬🇧 **English:** Clear, compassionate everyday English without clinical jargon.
* 🇳🇬 **Nigerian Pidgin:** Relatable, warm street vernacular (*"Wetina this medicine dey do", "How you go take am safely", "Wetin you must shine your eye for"*).
* 🇳🇬 **Yorùbá:** Natural Yoruba health phrasing for Southwestern communities.
* 🇳🇬 **Hausa:** Accessible Hausa phrasing for Northern communities.
* 🇳🇬 **Igbo:** Accessible Igbo phrasing for Southeastern communities.

---

## 🚀 Getting Started (Reproducibility Guide)

### Prerequisites
* **Node.js** v18.0.0 or higher
* **npm** or **yarn**
* An API Key for AI inference (Google AI Studio Gemini API or Hugging Face Inference Token)

### 1. Clone the Repository
```bash
git clone https://github.com/[YOUR-USERNAME]/medsure.git
cd medsure
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
# Optional for direct Hugging Face open-weight endpoint:
# HF_TOKEN=your_huggingface_token_here
```

### 4. Run the Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 5. Running the Build Test
Verify TypeScript compilation and Next.js bundle production:
```bash
npm run build
```

---

## 📂 Project Structure

```
medsure/
├── data/
│   ├── medicines.json          # 43 Curated Nigerian Essential Medicines
│   └── interactions.json       # 14 Clinical Drug-Drug Clash Rules
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── explain/route.ts    # Multilingual explanation endpoint
│   │   │   ├── follow-up/route.ts  # Coursera-style Q&A endpoint
│   │   │   └── scan/route.ts       # Multimodal OCR vision endpoint
│   │   ├── globals.css         # Glassmorphism & dark healthcare theme
│   │   ├── layout.tsx          # Root layout & Plus Jakarta Sans typography
│   │   └── page.tsx            # Master application orchestration
│   ├── components/
│   │   ├── CabinetView.tsx         # My Medicines & Drug Clash Matrix
│   │   ├── EmergencyBanner.tsx     # Home Emergency Voice Triage & 112
│   │   ├── FollowUpQuestions.tsx   # Interactive clinical follow-up chips
│   │   ├── Header.tsx              # Brand bar, language switch, live badge
│   │   ├── PharmacistPortal.tsx    # Licensed Pharmacist review queue
│   │   ├── SafetyResultView.tsx    # Active component cards & warnings
│   │   ├── Scanner.tsx             # Camera viewfinder & demo presets
│   │   └── VoicePlayer.tsx         # Audio wave player & speed selector
│   └── lib/
│       ├── gemini.ts           # Multimodal AI prompt engine & schemas
│       └── safetyRules.ts      # Deterministic code safety rules & NAFDAC
├── MODEL_CARD.md               # Open-weight model analysis & Hugging Face links
├── TECHNICAL_DECISIONS.md      # Engineering trade-offs, architecture & security
├── SUBMISSION.md               # Official OPEN//BUILD 2026 submission form
├── DEMO_PITCH_SCRIPT.md        # 3-min slides + 5-min demo presentation playbook
└── SLIDES.md                   # Slide deck content for Virtual Demo Day
```

---

## 🏆 Submission & Pitch Guide

For the **OPEN//BUILD 2026 Virtual Demo Day** (Top 7 Teams):
* **Pitch Time:** 3 minutes slides + 5 minutes live prototype demo.
* Refer to [`DEMO_PITCH_SCRIPT.md`](file:///c:/Users/Cyberflex/Documents/medsure/DEMO_PITCH_SCRIPT.md) for the exact script, demo order, and judge Q&A strategies.
* Refer to [`SLIDES.md`](file:///c:/Users/Cyberflex/Documents/medsure/SLIDES.md) for slide templates.

---

## 📄 Licence & Acknowledgements

* **Licence:** This project is open-source under the [MIT Licence](LICENSE).
* **Data Sources:** World Health Organization (WHO), Federal Ministry of Health Nigeria, British National Formulary (BNF).
* **Acknowledgements:** Open Source Community Africa (OSCA) Ile-Ife chapter, Hacktoberfest 2026.
