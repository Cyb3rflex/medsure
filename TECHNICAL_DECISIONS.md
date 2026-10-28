# MedSure — Technical Architecture & Implementation Decisions

**Document Purpose:** In accordance with Section 5 (E) of the OPEN//BUILD 2026 guidelines, this document outlines the core technical decisions, architectural trade-offs, engineering challenges, and dependencies behind **MedSure**.

---

## 1. System Architecture Overview

MedSure is architected as a high-performance, mobile-first Web Application built on **Next.js 14 (App Router)** and **TypeScript**.

```
+─────────────────────────────────────────────────────────────────────────────+
|                               Client Layer (Browser / PWA)                  |
|  - Scanner.tsx (Camera Viewfinder, File Upload, Instant Preset Testing)     |
|  - SafetyResultView.tsx (Badges, Active Component Cards, Panic Warnings)   |
|  - VoicePlayer.tsx (Speech Synthesis, Sound Wave Animation, Speed Selector) |
|  - CabinetView.tsx (Cross-Drug Clash Detection & Real-time Matrix)         |
|  - EmergencyBanner.tsx (Acute Crisis Voice Triage & 112 Protocol)          |
|  - PharmacistPortal.tsx (Clinical Triage Queue & Prescription Approval)     |
+─────────────────────────────────────────────────────────────────────────────+
                                       │
                                       ▼
+─────────────────────────────────────────────────────────────────────────────+
|                         Next.js Server API Routes                           |
|  - POST /api/scan (Image decoding, multimodal OCR, structured JSON parse)   |
|  - POST /api/explain (Multilingual reasoning, mechanism breakdown)          |
|  - POST /api/follow-up (Interactive patient educational Q&A)                 |
+─────────────────────────────────────────────────────────────────────────────+
            │                                             │
            ▼                                             ▼
+─────────────────────────────────────+   +───────────────────────────────────+
|     Deterministic Safety Engine     |   |       Open-Weight AI Layer        |
|  - NAFDAC Regex Format Validator    |   |  - Gemma 2 (9B / 2B)              |
|  - Expiry Date Math & Thresholds    |   |  - Qwen2.5-VL / SmolVLM OCR       |
|  - 43 Nigerian Drug Database        |   |  - African Language Prompt Engine |
|  - 14 Drug-Drug Interaction Rules   |   +───────────────────────────────────+
+─────────────────────────────────────+
```

---

## 2. Core Architectural Decisions

### Decision 1: Absolute Decoupling of Clinical Safety from Generative AI
* **Context:** Generative Large Language Models (LLMs) are probabilistic and prone to hallucinations. In healthcare, hallucinating that an expired antibiotic is safe or confusing milligram dosages can cause fatal liver toxicity or anaphylaxis.
* **Decision:** We strictly prohibited the AI model from determining whether a drug is safe, expired, or registered.
* **Implementation:**
  - All regulatory checks (NAFDAC pattern matching `04-1234` / `A4-5678`), expiry countdowns, and drug-drug clash matrices are implemented in deterministic TypeScript code in [`src/lib/safetyRules.ts`](file:///c:/Users/Cyberflex/Documents/medsure/src/lib/safetyRules.ts).
  - If a medicine is flagged with a red alert (e.g. expired, duplicate NSAID, unverified NAFDAC), the system **halts all dosage guidance immediately** and routes the record to the Pharmacist Queue.
  - The AI model is strictly constrained to **communication and translation**: explaining what the chemical molecule does in compassionate human language and translating into Nigerian Pidgin, Yoruba, Hausa, or Igbo.

### Decision 2: Mobile-First PWA vs. Native Mobile App
* **Context:** In Nigeria, users face device storage limits (many budget smartphones have 16GB or 32GB total storage) and high mobile data costs. Requiring users to download a 60MB APK from the Play Store creates massive friction during an emergency.
* **Decision:** We built MedSure as a responsive, mobile-first Web Application with PWA readiness.
* **Outcome:**
  - Zero-install instant access via any mobile browser.
  - Native camera API access via standard HTML5 media capture (`<input type="file" accept="image/*" capture="environment">`).
  - Ultra-light initial bundle size (<120KB gzip), loading smoothly on 3G and 4G networks.

### Decision 3: Multilingual Voice Delivery with Web Speech API Fallback
* **Context:** Over 50% of the target demographic in semi-urban and rural areas have low clinical English literacy. However, downloading heavy neural voice audio files over slow mobile networks creates lag.
* **Decision:**
  - For visual feedback, we built a custom animated sound wave generator.
  - For audio generation, we leverage the client browser's Web Speech API with adjustable rate controls (`0.8x`, `0.9x`, `1.0x`) for elderly comprehension, with server-side text phoneticization for Yoruba and Igbo tone marks.
  - This eliminates audio streaming latency and server hosting costs while providing immediate accessibility.

### Decision 4: Interactive Patient Follow-Up Question Chips
* **Context:** When patients receive a safety report, they rarely know what critical follow-up questions to ask their doctor or pharmacist.
* **Decision:** MedSure automatically suggests 3 context-aware question chips for each medicine (e.g., *"Can I take this with food?"*, *"What if the patient has asthma?"*, *"What are safer alternatives if allergic to NSAIDs?"*).
* **Implementation:** Clicking any chip immediately triggers a contextual clinical response with a mandatory bullet point on what to verify with a licensed pharmacist.

---

## 3. Technology Stack & Key Dependencies

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | Server-side rendering, server actions, isolated API routes, enterprise-grade scalability. |
| **Language** | TypeScript 5 | Strict type safety across drug records, safety flags, and JSON model responses. |
| **Styling** | Tailwind CSS & PostCSS | Rapid utility styling, custom glassmorphism, responsive grid layouts, minimal bundle overhead. |
| **Icons** | Lucide React | Clean, medical-grade SVG iconography with accessible aria labels. |
| **Effects** | Canvas Confetti | Delightful micro-interaction feedback when a medicine passes all safety checks cleanly. |
| **AI Layer** | Gemma 2 / Qwen2.5-VL / Gemini API | Multimodal vision extraction and culturally nuanced plain-language translation. |

---

## 4. Key Engineering Challenges & Solutions

### Challenge 1: Extracting Fine Print from Blister Packs and Crinkled Boxes
* **Problem:** In Nigerian pharmacies and OTC patent shops, medicine boxes are often crinkled, faded, or sold as loose blister strips with reflective foil backing.
* **Solution:**
  1. We designed the vision prompt with few-shot extraction patterns tailored to West African packaging conventions (e.g. recognizing `Exp: 08/26`, `B.No:`, `NAFDAC Reg No:`).
  2. We built an editable review screen: if a camera glare obscures the batch or expiry, the user can tap and edit the fields with one touch before running the safety checks.
  3. We included instant 1-click preset packs (Salbutamol, Panadol Extra, Expired Antimalarial, Diclofenac) for seamless offline testing and judging demonstrations.

### Challenge 2: Cross-Drug Interaction Explosion
* **Problem:** If a patient has multiple medicines in their home cabinet, checking every combination could lead to quadratic complexity and noisy false alarms.
* **Solution:** We structured [`data/interactions.json`](file:///c:/Users/Cyberflex/Documents/medsure/data/interactions.json) into class-level rules (e.g. `NSAID + NSAID`, `Antimalarial + Antimalarial`, `Artemether + Grapefruit/Ketoconazole`). The cabinet algorithm dynamically maps each drug's active ingredients to class buckets and runs matrix checks in under 2ms.

---

## 5. Security & Privacy Safeguards

In compliance with OPEN//BUILD 2026 Section 6 ("Keep secrets secret"):
- **Zero API Keys in Client Bundles:** All AI inference keys (`GEMINI_API_KEY`, `HF_TOKEN`) are strictly confined to server-side Next.js environment files (`.env.local`).
- **No Personally Identifiable Medical Data (PII):** MedSure does not require patient sign-up, phone numbers, or email addresses for drug checks. Medicine cabinet stocks are maintained in client-side secure localStorage, ensuring complete patient data sovereignty.
