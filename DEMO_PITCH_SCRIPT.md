# MedSure — Demo Day Pitch Playbook & Live Demo Script

**Event:** OPEN//BUILD 2026 Virtual Demo Day (OSCA Ile-Ife)  
**Total Time Slot:** **8 Minutes Total** (Strictly timed: 3 Minutes Slides + 5 Minutes Live Demo)  
**Judges Profile:** AI Engineers, Product Managers, Open-Source Advocates, and Healthcare Founders.

---

## PART 1: The 3-Minute Slide Pitch (0:00 – 3:00)

### ⏱️ 0:00 – 0:45 | Slide 1: The Human Problem
**Speaker:** Member 1  
> *"Good day judges and fellow builders. Across Nigeria today, preventable medicine tragedies happen not because a cure doesn't exist, but because of ignorance and language barriers.*  
> *In Ajala town, Northern Nigeria, families suffer severe organ damage from sub-standard chemist drugs. In our riverine areas, over 18,000 people have developed irreversible allergic complications from hidden drug ingredients. In Ondo State, a 19-year-old student tragically died from liver failure—not because she wanted to end her life, but because in the agony of an exam migraine, she panicked and overdosed on analgesics. And in the south, a community monarch died from a lethal mix of diabetes medications.*  
> *With fewer than 4 pharmacists per 10,000 citizens in Nigeria, everyday families are forced to self-medicate using leaflets filled with intimidating Latin jargon they cannot understand. We built **MedSure** to change that."*

---

### ⏱️ 0:45 – 1:30 | Slides 2 & 3: The User & The Solution
**Speaker:** Member 2  
> *"Who is MedSure for? It is for Amaka, a panicked mother awake at 2 AM with a wheezing child. It is for Tunde, standing in an OTC pharmacy checking if a medicine is genuine. And it is for chronic patients juggling multiple prescriptions.*  
> *MedSure is a mobile-first digital health companion that turns confusing medicine packs into clear, life-saving guidance.*  
> *Users simply snap a photo or type a name. Our vision model extracts the packaging text and NAFDAC number. But crucially, before any AI speaks, our **deterministic code safety engine** checks the expiry date, validates the NAFDAC registration pattern, and cross-checks allergen classes. If a drug is expired or suspect, dosage guidance is halted instantly and routed to a licensed pharmacist queue.*  
> *If clean, MedSure explains what the active ingredients actually do in plain human terms, warns against panic overdosing, and speaks the explanation aloud in English, Nigerian Pidgin, Yorùbá, Hausa, or Igbo."*

---

### ⏱️ 1:30 – 2:15 | Slide 4: Open-Weight AI Architecture
**Speaker:** Member 1  
> *"In line with the OPEN//BUILD 2026 ethos, MedSure is architected around leading open-weight foundation models.*  
> *For optical packaging extraction from reflective blister packs and syrup bottles, we leverage **Qwen2.5-VL-7B** and the ultra-lightweight **SmolVLM-500M**.*  
> *For medical reasoning and cultural translation, we utilize **Google Gemma 2 (9B and 2B)** under the Gemma Open License. Gemma 2 offers unmatched reasoning-to-weight efficiency. The 2B model is especially significant: it can run directly on edge devices in rural primary health clinics without continuous internet access.*  
> *For voice accessibility, we integrate **Whisper** and **Meta MMS**.*  
> *Most importantly: **we never let the language model guess clinical safety**. Dosages and contraindications are locked in verified code; the LLM is dedicated strictly to empathetic, plain-language patient communication."*

---

### ⏱️ 2:15 – 3:00 | Slides 5–8: Technical Decisions, Open Source & Impact
**Speaker:** Member 2  
> *"Technically, we chose Next.js 14 and a mobile PWA architecture over a 60MB native app because Nigerian users face severe phone storage constraints and high data costs. MedSure opens instantly in any mobile browser.*  
> *Our project is 100% open-source under the MIT license on GitHub, complete with model cards, clean environment isolation, and full reproduction documentation.*  
> *Now, let us switch directly to the live prototype."*

---

## PART 2: The 5-Minute Live Prototype Demo (3:00 – 8:00)

**Demo URL:** `http://localhost:3000` (or your live deployed Vercel URL)  
**Device:** Laptop screen sharing or mobile view in Chrome DevTools (390px mobile view recommended).

---

### 🎬 Scene 1: The Panic Attack & Emergency Voice Triage (3:00 – 4:00)
1. **Show the Top Banner:** Point to the high-contrast **Emergency Mode** button (`EmergencyBanner.tsx`).
2. **Click "Voice What You Are Going Through":**
   * Demonstrate typing or clicking a simulated acute scenario: *"My child is gasping for breath and cannot breathe properly at home."*
3. **Show the Instant Emergency Protocol:**
   * Point out the immediate triage response:
     * *🚨 "EMERGENCY PROTOCOL: Sit the patient upright immediately. Do not force solid pills down their throat while choking. Loosen tight neck clothing and call 112 / 199 immediately."*
4. **Speaker Commentary:**
   > *"Notice how MedSure handles acute panic. In an emergency, the biggest mistake people make is forcing pills into a breathless patient's mouth. MedSure intervenes with immediate first-aid airway protocol before anything else."*

---

### 🎬 Scene 2: 5-Second Scan & Active Component Breakdown (4:00 – 5:30)
1. **Navigate to Scanner:**
   * Click the quick demo preset: **"🫁 Salbutamol / Ventolin (Respiratory)"** (or snap a live photo).
2. **Observe the Results Screen (`SafetyResultView.tsx`):**
   * Show the green **"Verified Clean"** badge and valid **NAFDAC Number** (`04-1234`).
   * Show the **Active Component Card**:
     * Chemical: *Salbutamol Sulfate*
     * How it works: *"Relaxes and widens the tightened bronchial muscle tubes in your lungs so air and oxygen can rush back in."*
     * Panic Overdose Alert: *"Do not take continuous puffs out of panic. Excessive doses can cause rapid heart palpitations."*
3. **Language Switch & Voice Player (`VoicePlayer.tsx`):**
   * Change language to **Nigerian Pidgin** or **Yorùbá**.
   * Click **Play Voice Note**.
   * Show the animated sound wave and adjust the speed to **0.8x** (explaining this is for elderly relatives and low-literacy users).
4. **Interactive Patient Question Chips (`FollowUpQuestions.tsx`):**
   * Click the chip: *"Can I take this medicine with food or on an empty stomach?"*
   * Show the instant clinical response and point out the mandatory section: *"🩺 What to verify with your Pharmacist"*.

---

### 🎬 Scene 3: Red Flags, Zero Hallucination & Pharmacist Queue (5:30 – 6:45)
1. **Back to Scanner:**
   * Click the preset: **"🔴 Expired Antimalarial (Artemether-Lumefantrine)"** or **"⚠️ Diclofenac (NSAID Allergy Alert)"**.
2. **Point out the Safety Guardrail:**
   * The app shows a red alert: **"CRITICAL SAFETY WARNING: This pack expired 45 days ago. Chemical breakdown may cause acute toxicity."**
   * Show that **dosing guidance is completely blocked**.
   * Notice the status: **"Escalated to Licensed Pharmacist Queue"**.
3. **Switch to Pharmacist Queue Tab (`PharmacistPortal.tsx`):**
   * Show the flagged case in the clinician dashboard.
   * Type a clinical pharmacist note: *"Pack expired. Advise patient to dispose and obtain fresh Artemether-Lumefantrine blister pack from an accredited pharmacy."*
   * Click **Reject Medication**.
4. **Speaker Commentary:**
   > *"This is where MedSure sets a new standard for AI in healthcare. We never let an LLM hallucinate medical safety. Flagged cases are stopped by code and handed to human pharmacists."*

---

### 🎬 Scene 4: "My Medicine Cabinet" Cross-Drug Interaction (6:45 – 7:30)
1. **Switch to Cabinet Tab (`CabinetView.tsx`):**
   * Show the household cabinet containing:
     * *Ibuprofen 400mg*
     * *Diclofenac 50mg*
2. **Show the High-Risk Interaction Alert:**
   * ⚠️ *"FATAL/HIGH RISK CLASH: Duplicate NSAID Therapy. Taking Ibuprofen and Diclofenac simultaneously drastically spikes the risk of internal gastric bleeding and acute kidney injury."*
3. **Speaker Commentary:**
   > *"This prevents the exact tragedy that claimed the life of the monarch in Southern Nigeria—uncoordinated drug mixing right in the home medicine drawer."*

---

### 🎬 Scene 5: Wrap-Up & Closing Call (7:30 – 8:00)
**Speaker:** Both Members  
> *"Judges, MedSure proves that open-source AI can solve real, raw problems in the communities we live in. By combining open-weight models like Gemma 2 with strict deterministic code guardrails and multilingual voice accessibility, we ensure that AI truly belongs to everyone.*  
> *MedSure is live, fully documented, and ready for your evaluation. Thank you!"*

---

## PART 3: Judges' Anticipated Q&A Defense

### Q1: "How do you prevent the AI from hallucinating incorrect medical advice?"
**Answer:**  
> *"We enforce a strict two-tier architecture. All clinical verification—expiry date calculation, NAFDAC pattern validation, allergen flagging, and drug-drug interactions—is executed by deterministic TypeScript code against vetted BNF and WHO datasets. The LLM is strictly prohibited from deciding safety or generating dosages. The model's role is solely communication: translating the chemical mechanism of action into compassionate, plain everyday language in Nigerian dialects."*

### Q2: "Why did you choose Google Gemma 2 and Qwen2.5-VL over proprietary APIs?"
**Answer:**  
> *"OPEN//BUILD is about open AI. Gemma 2 offers best-in-class reasoning for medical translation. More importantly, Gemma 2 2B and SmolVLM can be quantized to INT4 and run directly on local edge hardware or basic laptops in rural primary healthcare centers where internet connectivity is unstable or unaffordable. That technological sovereignty is essential for Africa."*

### Q3: "What if a camera photo is blurry or the NAFDAC number is scratched off?"
**Answer:**  
> *"Our UI is built defensively. If optical confidence is low or text is obscured by foil glare, the app immediately flags the ambiguity, lets the user tap and edit any field or type the drug name manually, and defaults to the Pharmacist Escalation Queue rather than guessing."*

### Q4: "How does the Pharmacist Portal scale if there are thousands of patients?"
**Answer:**  
> *"Clean medications that pass all checks require zero pharmacist intervention—freeing up scarce clinician time. Only red-flagged cases (expired drugs, suspect NAFDAC numbers, or severe drug interactions) enter the triage queue, allowing a single community pharmacist to safeguard hundreds of vulnerable households remotely."*
