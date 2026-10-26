# MedSure Model Card & Open-Weight AI Architecture

## 1. Overview & Open-Weight Strategy
**OPEN//BUILD 2026 Mandate:** *"The model must be a meaningful part of the functionality. Explain which model you selected, what it does, and why it suits the task. Explore repositories such as Hugging Face, subject to availability and licence."*

MedSure utilizes a specialized, multi-stage open-weight AI pipeline tailored for resource-constrained healthcare environments in Sub-Saharan Africa. The architecture prioritizes **zero-hallucination patient safety**, **low-latency edge inference**, and **rich African linguistic accessibility**.

```
+-----------------------------------------------------------------------------------+
|                              MedSure Model Pipeline                               |
+-----------------------------------------------------------------------------------+
                                          │
                                          ▼
   [ Stage 1: Multimodal Vision OCR ]
   Model: Qwen2.5-VL-7B-Instruct / SmolVLM-500M / Florence-2-large
   Source: Hugging Face (`Qwen/Qwen2.5-VL-7B-Instruct`)
   Function: Optical extraction of drug name, strength, batch, expiry, NAFDAC #
                                          │
                                          ▼
   [ Stage 2: Code-Level Deterministic Guardrails (Non-LLM) ]
   Engine: TypeScript / Pure Code
   Function: NAFDAC regex validation, expiry date math, allergen classification,
             cross-drug interaction matrix. HALTS AI if critical red flags exist.
                                          │
                                          ▼
   [ Stage 3: Plain-Language Medical Reasoning & African Translation ]
   Model: Google Gemma 2 (Gemma-2-9B-It / Gemma-2-2B-It) / Llama-3.1-8B-Instruct
   Source: Hugging Face (`google/gemma-2-9b-it`)
   Function: Active ingredient mechanism breakdown, panic overdose warnings,
             multilingual generation (English, Nigerian Pidgin, Yorùbá, Hausa, Igbo)
                                          │
                                          ▼
   [ Stage 4: Voice Speech Synthesis & Emergency ASR ]
   Model: OpenAI Whisper (ASR) + Meta MMS / Web Speech Synthesis
   Function: Spoken patient voice notes with pitch/speed control for elderly users
```

---

## 2. Model Specifications & Selection Rationale

### A. Reasoning & Language Generation: Google Gemma 2 (9B & 2B)
* **Model ID:** `google/gemma-2-9b-it` (Hugging Face)
* **Parameters:** 9.24 Billion (Dense transformer)
* **License:** Gemma Open Model Terms of Use (Permits commercial and research deployment)
* **Why Selected for MedSure:**
  1. **Exceptional Parameter-to-Reasoning Efficiency:** Gemma 2 9B outperforms many larger models (such as Llama 3 70B in select MMLU and reasoning evaluations) while fitting within 18GB of VRAM (or ~5.5GB in 4-bit AWQ/GGUF quantization).
  2. **Gemma 2 2B Edge Variant (`google/gemma-2-2b-it`):** Can execute locally on laptops, edge servers, or mobile chips (via WebGPU / ONNX Runtime), making it viable for rural primary health clinics with intermittent internet connectivity.
  3. **Safety Alignment:** Gemma 2 underwent extensive RLHF specifically targeted at reducing toxicity and mitigating unsafe medical claims.

### B. Vision & Package OCR: Qwen2.5-VL-7B-Instruct
* **Model ID:** `Qwen/Qwen2.5-VL-7B-Instruct` (Hugging Face)
* **Parameters:** 7.61 Billion
* **License:** Apache 2.0
* **Why Selected for MedSure:**
  1. **Dynamic Resolution Handling:** Medicine boxes in Nigeria are frequently photographed in sub-optimal conditions (poor lighting, curved bottles, reflective aluminum blister foil). Qwen2.5-VL's native dynamic resolution handles skewed text without downsampling critical fine print.
  2. **Structured JSON Extraction:** Adheres strictly to JSON schemas for extracting specific entity keys: `medicine_name`, `strength`, `batch_number`, `expiry_date`, and `nafdac_number`.

### C. Ultra-Lightweight Edge Alternative: SmolVLM-500M
* **Model ID:** `HuggingFaceTB/SmolVLM-500M-Instruct`
* **Parameters:** 500 Million
* **License:** Apache 2.0
* **Purpose:** Allows instant, client-side or micro-container package reading on lower-tier hardware with sub-second response times.

---

## 3. Strict Safety Separation: AI vs. Deterministic Code

In clinical healthcare applications, **hallucination can be fatal**. A language model must never be allowed to "hallucinate" whether an expired antibiotic is safe to take, or invent an imaginary dosage for a child.

MedSure enforces a strict **two-tier architecture**:

| Responsibility | Handled By | Rationale |
|---|---|---|
| **Drug Expiry Verification** | **Deterministic Code** (`safetyRules.ts`) | Strict calendar math based on system time vs. extracted date. Zero probability of LLM temporal hallucinations. |
| **NAFDAC Registration Validation** | **Deterministic Code** (`safetyRules.ts`) | Regex validation (`^(?:NR|A\d|\d{2})[-/]?\d{4,6}$`) checked against official registered formats. |
| **Drug-Drug Clashes** | **Deterministic Code** (`safetyRules.ts`) | Hardcoded clinical interaction matrix (e.g. NSAID + NSAID, Artemether + Halofantrine). |
| **Emergency Triage Protocol** | **Deterministic Code** (`EmergencyBanner.tsx`) | Direct first-aid protocol (airway positioning, 112 emergency routing) before any generative text. |
| **Active Ingredient Explanation** | **Open-Weight LLM (Gemma 2)** | Translating pharmacological jargon (*"selective beta-2 adrenergic receptor agonist"*) into accessible human language (*"opens the tightened airway tubes so air can enter"*). |
| **Cultural & Linguistic Nuance** | **Open-Weight LLM (Gemma 2)** | Rendering warm, respectful translations in Nigerian Pidgin, Yorùbá, Hausa, and Igbo. |

---

## 4. Prompt Engineering & Contract Schemas

### Multilingual Explanation Schema (`generatePlainExplanation`)
```json
{
  "summary": "Core safety verdict in 1-2 compassionate sentences",
  "what_it_does": "Everyday explanation of primary therapeutic uses",
  "how_it_works_components": [
    {
      "component": "Chemical name of active molecule (e.g. Salbutamol)",
      "mechanism_plain": "Clear human explanation of how it relieves symptoms",
      "panic_warning": "Explicit warning against excessive use or panic redosing"
    }
  ],
  "allergy_and_cautions": "Class-based hypersensitivity warnings (NSAID, Sulfa, G6PD, Asthma)",
  "emergency_advice": "Clear criteria for when immediate hospital emergency care is mandatory",
  "suggested_questions": [
    "Contextual follow-up question 1",
    "Contextual follow-up question 2",
    "Contextual follow-up question 3"
  ]
}
```

---

## 5. Deployment Options for Open Weights

MedSure supports flexible deployment configurations to balance performance and accessibility:

1. **Option A: Hugging Face Inference Endpoints / Serverless API**
   - Connect via `HF_TOKEN` in `.env.local` to `https://api-inference.huggingface.co/models/google/gemma-2-9b-it`.
   - Ideal for cloud-hosted web app deployment.
2. **Option B: Local / Self-Hosted vLLM or Ollama Container**
   ```bash
   # Run Gemma 2 9B locally with Ollama
   ollama run gemma2:9b
   # Or run via vLLM with OpenAI-compatible API
   python -m vllm.entrypoints.openai.api_server --model google/gemma-2-9b-it --port 8000
   ```
3. **Option C: Development / Serverless Fallback Layer**
   - The repository includes seamless multi-provider abstraction supporting Gemini API for ultra-low latency prototyping during the hackathon evaluation window.

---

## 6. Known Model Limitations & Mitigations

1. **African Dialect Phonetics:**
   - *Limitation:* Text-to-speech synthesizers built into standard operating systems may mispronounce tonal accents in Yorùbá or Igbo.
   - *Mitigation:* Prompts format Yoruba and Igbo text with explicit diacritics and phonetic phrasing. A future integration with Meta MMS (Massively Multilingual Speech) will provide native African voice models.
2. **Reflective / Damaged Blister Packaging:**
   - *Limitation:* Silver foil blister packs reflect flash and obscure batch numbers.
   - *Mitigation:* The UI provides an interactive fallback allowing users to tap and edit any extracted text field or type the medicine name directly.
3. **Clinical Liability Disclaimer:**
   - *Limitation:* No AI can replace licensed medical diagnosis.
   - *Mitigation:* Prominent clinical disclaimers are rendered on every screen, and every flagged case triggers mandatory escalation to the Licensed Pharmacist Queue.
