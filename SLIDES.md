# MedSure — Virtual Demo Day Presentation Slides

**Event:** OPEN//BUILD 2026 (OSCA Ile-Ife Hacktoberfest Challenge)  
**Slot Allocation:** 3 Minutes Slides Presentation (followed by 5 Minutes Live Demo)  
**Rule Checklist:** Covers all 8 required points specified in Section 11 of the Challenge Brief.

---

## Slide 1: Title & The Human Problem
**Title:** MedSure — AI-Powered Medicine Safety & Emergency Voice Triage  
**Subtitle:** *Building for a world where no mother, student, or patient dies from preventable medicine ignorance.*  
**Presenters:** Gospel Arinze & Abdulmuheez Quazeem

### Key Content & Visuals:
* **The Reality in Nigeria:**
  * **Ajala Town:** Recurring organ injury from unverified chemist concoctions.
  * **Riverine Delta:** 18,000+ cases of drug allergies causing irreversible skin and systemic mutations.
  * **Ondo State:** A 19-year-old student who died of an accidental analgesic overdose trying to cure an exam migraine.
  * **Southern Nigeria:** A monarch who died from uncoordinated diabetic drug interactions.
* **The Core Gap:** In Nigeria, there are fewer than **4 pharmacists per 10,000 citizens**. Patients self-medicate in the dark with Latin-filled leaflets they cannot decipher.

---

## Slide 2: The Intended Users & Context
**Title:** Who We Built MedSure For

| User Persona | Context of Need | Critical Feature |
|---|---|---|
| **The Caregiver / Mother (e.g. Amaka)** | Panicked at 2 AM with a feverish or wheezing child. Low medical literacy. | One-touch Emergency Voice Triage + Voice notes in Nigerian Pidgin & Yorùbá. |
| **The Everyday Shopper (e.g. Tunde)** | Standing inside an OTC chemist shop verifying if a medicine is genuine and safe. | Instant Camera Scan + NAFDAC Registration Pattern Checker (`04-1234`). |
| **The Chronic Patient (e.g. Baba Segun)** | Taking multiple hypertension, diabetes, and pain medications simultaneously. | "My Medicine Cabinet" Cross-Drug Interaction Clash Matrix. |

---

## Slide 3: Our Solution & What Makes It Distinctive
**Title:** MedSure: The Two-Tier Healthcare Companion

* **Instant Multimodal Camera Scan:** Snaps any drug pack, blister strip, or bottle to extract name, strength, batch, expiry, and NAFDAC number.
* **Deterministic Code Safety Engine (Tier 1):** Halts dosage advice if drugs are expired, suspect, or duplicate classes. **Zero Hallucination.**
* **Active Ingredient Breakdown (Tier 2):** Translates complex chemicals into human terms:
  * *Salbutamol:* *"Opens tightened airway tubes so oxygen can enter."*
* **Panic Overdose & Allergy Alerts:** Warns against taking extra doses out of panic, with prominent NSAID and Sulfa allergy badges.
* **African Language Voice Notes:** Spoken audio in English, Pidgin, Yorùbá, Hausa, and Igbo.
* **Pharmacist Escalation Portal:** Suspect drugs are queued for remote licensed pharmacist audit.

---

## Slide 4: The Open-Weight AI Architecture
**Title:** Meaningful Open-Weight AI Built for African Constraints

* **Multimodal OCR & Vision:** **Qwen2.5-VL-7B-Instruct** / **SmolVLM-500M**
  * Reads skewed, reflective blister packaging and curved bottles.
  * Extracts structured JSON entities directly.
* **Reasoning & Multilingual Generation:** **Google Gemma 2 (9B & 2B)**
  * Gemma 2 9B offers world-class reasoning for medical mechanism translation.
  * Gemma 2 2B edge footprint can execute locally in rural health clinics without continuous internet.
* **Voice & Speech:** **OpenAI Whisper** + **Meta MMS** (Massively Multilingual Speech)
* **Crucial Limitation Handled:** Generative models must *never* invent dosages. MedSure uses pure code for clinical rules and the LLM strictly for patient communication.

---

## Slide 5: The Working Prototype & Live Architecture
**Title:** A Production-Grade Stack Running Live Today

* **Frontend:** Next.js 14 App Router, TypeScript, Tailwind CSS, Lucide React.
* **Mobile-First PWA:** Zero-install web experience that works on any Android/iOS smartphone camera without app store downloads.
* **Curated Nigerian Datasets:**
  * 43 Nigerian Essential Medicines vetted from WHO/FMOH lists.
  * 14 Critical Drug-Drug Interaction Rules (e.g. duplicate NSAID toxicity).
* **Interactive Educational Chips:** Coursera-style follow-up questions with mandatory pharmacist referral guidance.

---

## Slide 6: Technical Decisions & Engineering Trade-offs
**Title:** Engineering for High Trust & Low Connectivity

1. **Why Separate Code Safety from AI?** To guarantee 100% deterministic safety against expired or unregistered drugs.
2. **PWA over 60MB Native App:** Millions of Nigerian users have low-storage phones and high mobile data costs; instant browser scanning maximizes adoption.
3. **Client-Side Speech Optimization:** Visual sound-wave animation with Web Speech API audio eliminates server audio streaming latency on slow 3G networks.
4. **Data Sovereignty:** Zero user login required; medicine cabinet data stays private on the user's device.

---

## Slide 7: Open-Source Practices & Reproducibility
**Title:** Open, Reproducible, and Community-Ready

* **Repository Quality:** Full open-source code on GitHub with clean commit history, zero leaked secrets, and MIT License.
* **Clear Documentation:** Comprehensive `README.md`, `MODEL_CARD.md`, `TECHNICAL_DECISIONS.md`, and `SUBMISSION.md`.
* **5-Minute Setup:** Single command `npm install && npm run dev` with immediate mock demo presets for zero-friction evaluation.
* **Contributing Guide:** Open for Nigerian developers and pharmacists to add more drug records and dialect translations.

---

## Slide 8: Potential, Impact & Next Steps
**Title:** The Road Ahead for MedSure

* **Immediate Impact:** Reduces accidental home overdoses and alerts patients to dangerous drug combinations before swallowing a pill.
* **Partnership Potential:** Integration with the **Pharmacists Council of Nigeria (PCN)** and **NAFDAC Green Book API** for real-time counterfeit database synchronization.
* **WhatsApp / USSD Bot Extension:** Deploying the Gemma 2 / Whisper pipeline to WhatsApp for low-data rural community health workers.
* **Closing Vision:** *“AI belongs to everyone. With MedSure, life-saving medicine safety is in the palm of every Nigerian.”*
