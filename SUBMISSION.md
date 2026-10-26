# OPEN//BUILD 2026 — Official Submission Document
**Challenge:** OSCA Ile-Ife Hacktoberfest Challenge 2026  
**Theme:** *AI belongs to everyone. Build for a world you understand. Make it open.*  
**Submission Deadline:** Thursday, October 29, 2026 · 11:59 PM WAT  

---

## 1. Project Name
**MedSure**  
*AI-Powered Medicine Safety, Active Ingredient Breakdown & Emergency Voice Triage for Africa*

---

## 2. Team Details

| Member | Full Name | University | Role / Contribution |
|---|---|---|---|
| **Member 1 (Lead)** | *[Enter Full Name, e.g., Abdulqudus Abubakar]* | *[Enter University, e.g., Obafemi Awolowo University (OAU), Ile-Ife]* | Frontend Architecture, Voice Assistant, Clinical Safety Rule Engine, Design System |
| **Member 2 (Co-Lead)** | *[Enter Teammate Full Name]* | *[Enter University, e.g., University of Ibadan / OAU]* | Open-Weight Model Pipeline, NAFDAC & Drug Dataset Curation, Pharmacist Portal & Testing |

> *Note: Both team members are currently enrolled university students as required by OPEN//BUILD 2026 rules.*

---

## 3. Problem Statement

### The Reality in Nigeria & West Africa
Across communities in Nigeria, preventable medicine tragedies happen daily due to sheer ignorance, literacy barriers, and counterfeit drug influx:
1. **Substandard & Counterfeit Drugs in Local Chemists:** In suburban towns like Ajala (Northern Nigeria), residents routinely suffer severe gastric upset and organ damage after purchasing unverified medications from unlicensed patent medicine vendors ("chemists").
2. **Hidden Allergens & Fatal Sensitivities:** In coastal and riverine regions, over 18,000 cases of severe drug allergies have been recorded, causing life-altering skin and immunological mutations because patients consumed medications without knowing they contained ingredients they were hypersensitive to (such as Sulfonamides or NSAIDs).
3. **Panic Overdosing:** In Ondo State, a 19-year-old university student succumbed to acute liver failure from an accidental overdose of analgesics. She had no intention of self-harm; in the agony and panic of a persistent migraine, she repeatedly took pills, completely unaware of the toxic cumulative threshold.
4. **Lethal Drug Combinations:** In southern Nigeria, a prominent community monarch died after taking a lethal combination of uncoordinated anti-diabetic and prescription drugs, suffering catastrophic hypoglycemia.
5. **Home Emergency Paralysis:** When an acute respiratory attack (such as asthma) or sudden allergic reaction strikes at home, families panic. They look at drug boxes with complicated names (*Salbutamol, Diclofenac, Artemether-Lumefantrine*), have no idea what each active component does, and risk forcing pills down the throat of someone in respiratory distress.

### Why This Problem Matters
Medical leaflets are written in dense, intimidating clinical jargon in English—a language that over 60% of rural and semi-urban patients cannot fluently decipher. In a healthcare system with less than **4 pharmacists per 10,000 citizens**, everyday people are forced to self-medicate in the dark.

---

## 4. Solution Description

**MedSure** is a mobile-first digital medicine safety companion built specifically for the Nigerian and African context. It transforms confusing medicine packaging into plain-language, culturally resonant safety guidance with zero hallucinations.

### Core Capabilities:
1. **Instant Vision Extraction & Regulation Check:**
   - Users snap a picture of a medicine pack, blister strip, or bottle, or type the name.
   - An open multimodal vision model extracts the brand name, active ingredients, batch number, expiry date, and official **NAFDAC Registration Number** (`04-1234`, `A4-5678`).
2. **Deterministic Code-Based Safety Engine (Zero Hallucination):**
   - Clinical safety is never left to LLM guesswork. Pure code runs deterministically against our curated 43 Nigerian Essential Medicines database:
     - Flags expired or soon-to-expire medication.
     - Validates NAFDAC format and flags unregistered/suspect drugs.
     - Detects allergen classes (NSAIDs, Sulfas, Penicillins).
     - Halts dosage instructions immediately if red flags exist.
3. **Plain-Language Active Ingredient Breakdown:**
   - Translates complex pharmaceutical chemistry into intuitive human terms:
     - *e.g., Ventolin (Salbutamol):* *"Relaxes and widens the tightened bronchial muscle tubes in your lungs so air and oxygen can rush back in."*
     - *e.g., Paracetamol:* *"Blocks pain messengers in your central nervous system and resets your brain's internal thermostat to break fever."*
   - Explicitly warns against panic overdosing.
4. **Multilingual Audio Voice Notes:**
   - Generates culturally tailored safety summaries in **English, Nigerian Pidgin, Yorùbá, Hausa, and Igbo**, with animated audio wave playback and adjustable speech rates for low-literacy and elderly users.
5. **Home Emergency Voice Assistant & Triage:**
   - A high-visibility emergency mode for acute attacks (respiratory distress, choking, allergic swelling).
   - Provides immediate first-aid positioning instructions and emergency routing to Nigeria's national lines (**112 / 199**).
6. **Cross-Drug Interaction Medicine Cabinet:**
   - A digital cabinet where households track their medicines.
   - Real-time interaction matrix checks across 14 clinical rules (e.g., duplicate NSAID toxicity, dangerous antimalarial combinations).
7. **Licensed Pharmacist-in-the-Loop Escalation Portal:**
   - Flagged suspect medicines are routed to a clinical queue where registered pharmacists can review the patient's case, add notes, and Approve or Reject the drug.

---

## 5. GitHub Repository & Live Deployment

- **GitHub Repository:** `https://github.com/[YOUR-USERNAME]/medsure` *(Public, includes complete source code, tests, and reproduction scripts)*
- **Live Demo Link:** `https://medsure.vercel.app` *(or custom Vercel / Netlify URL)*
- **Demo Video:** `[YouTube / Loom link to 3-min walkthrough]`

---

## 6. Model Information (Open-Weight Model Strategy)

To comply with the OPEN//BUILD 2026 mandate for open-weight models and ensure technological sovereignty:

### Selected Open-Weight Foundation Models:
1. **Google Gemma 2 (Gemma-2-9B-It & Gemma-2-2B-It):**
   - **Role:** Generates plain-language medical translations, active ingredient breakdowns, and multilingual patient guidance (Pidgin, Yoruba, Hausa, Igbo).
   - **Why Selected:** Gemma 2 offers state-of-the-art reasoning-to-weight efficiency. The 2B and 9B variants can be quantized (4-bit INT4) and executed on accessible consumer hardware or edge devices in low-connectivity primary healthcare centers.
   - **Licence:** Gemma Open Model Licence (Permits commercial and research use).
2. **Qwen2.5-VL-7B-Instruct / SmolVLM-500M:**
   - **Role:** Optical character recognition (OCR) and document understanding from degraded medicine pack images, foil blister strips, and curved syrup bottles.
   - **Why Selected:** Excels at multilingual text transcription and structured JSON extraction from skewed, reflective packaging. SmolVLM provides an ultra-lightweight 500M parameter alternative for edge deployment.
   - **Licence:** Apache 2.0.
3. **OpenAI Whisper & Meta MMS (Massively Multilingual Speech):**
   - **Role:** Speech recognition for voice symptoms and African language synthesis (Yoruba, Hausa, Igbo).
   - **Licence:** MIT / CC-BY-NC 4.0.

### Model Limitations & Clinical Safety Measures:
- **Hallucination Risk:** Generative language models can fabricate dosages. **MedSure mitigates this architecturally:** the model is strictly forbidden from generating dosages; all drug safety checks, contraindications, and expiry verifications are executed deterministically by TypeScript code against vetted NAFDAC/BNF datasets.
- **African Dialect Pronunciation:** Browser speech synthesis sometimes approximates tone marks in Yorùbá and Igbo. We incorporate phonetic Nigerian transliteration in prompts to improve cadence.

---

## 7. Documentation & Reproducibility

MedSure is fully open-source and reproducible:
- Detailed setup instructions are in [`README.md`](file:///c:/Users/Cyberflex/Documents/medsure/README.md).
- Quickstart locally:
  ```bash
  git clone https://github.com/[YOUR-USERNAME]/medsure.git
  cd medsure
  npm install
  npm run dev
  # Open http://localhost:3000
  ```
- Environment variables: Configured via `.env.local` supporting either local/remote Hugging Face Inference Endpoints or Google Gemini API.

---

## 8. Acknowledgements & AI-Assisted Work Disclosure

In compliance with Sections 6 & 13 of the OPEN//BUILD 2026 Guidelines:
1. **Data Sources:**
   - Nigerian Essential Medicines List (Federal Ministry of Health / WHO).
   - National Agency for Food and Drug Administration and Control (NAFDAC) drug registration patterns.
   - British National Formulary (BNF) clinical interaction matrix.
2. **Open-Source Libraries:**
   - Next.js 14, React 18, Tailwind CSS, Lucide React, Canvas Confetti.
3. **AI Coding Assistance Disclosure:**
   - AI coding assistants (Google Antigravity IDE, Claude, Gemini) were utilized for scaffolding boilerplate TypeScript interfaces, styling prototypes, and generating multilingual translation prompts.
   - All core architectural decisions, code-based safety rules, clinical validation guardrails, and project documentation were designed, verified, and debugged by the team.
