import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://medsure-africa.vercel.app'),
  title: {
    default: 'MedSure Nigeria — Open AI Medicine Verification & Multilingual Voice Safety',
    template: '%s | MedSure Africa'
  },
  description:
    'Protect your family from counterfeit medication, unreadable packaging, and dangerous drug clashes. MedSure combines deterministic code guardrails, 43 Nigerian Essential Medicines, and open-weight AI (Gemma 2) with plain-language voice audio in Yorùbá, Hausa, Igbo, Pidgin, Swahili, and French.',
  applicationName: 'MedSure',
  authors: [{ name: 'MedSure Team - OSCA Ile-Ife Hacktoberfest 2026' }],
  generator: 'Next.js',
  keywords: [
    'MedSure',
    'MedSure Nigeria',
    'NAFDAC verification',
    'counterfeit medicine detector',
    'drug clash checker Nigeria',
    'Nigerian essential medicines',
    'Ajala town counterfeit antibiotics',
    'open-weight medical AI',
    'Google Gemma 2 Nigeria healthcare',
    'Yoruba medicine voice audio',
    'Hausa health translation',
    'Igbo medicine safety',
    'Pidgin medicine scanner',
    'Pharmacist in the loop portal',
    'OPEN BUILD 2026',
    'OSCA Ile-Ife Hacktoberfest'
  ],
  creator: 'MedSure Team',
  publisher: 'Open Source Community Africa (OSCA)',
  category: 'Healthcare & Artificial Intelligence',
  openGraph: {
    title: 'MedSure — Zero-Hallucination Medicine Verification & Multilingual Audio for Africa',
    description:
      'Never take the wrong medicine again. 5-second camera scan checks NAFDAC registration, expiry dates, and cross-drug reactions with spoken audio explanations in Nigerian indigenous languages.',
    url: 'https://medsure-africa.vercel.app',
    siteName: 'MedSure Nigeria',
    locale: 'en_NG',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedSure — AI Belongs to Everyone. Open Medicine Safety for Africa',
    description:
      'Deterministic code guardrails + Open-weight AI protecting African families against fake drugs and fatal drug clashes. Spoken in Yoruba, Hausa, Igbo & Pidgin.',
    creator: '@cyb3rflex',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://medsure-africa.vercel.app',
    languages: {
      'en-NG': 'https://medsure-africa.vercel.app',
      'yo-NG': 'https://medsure-africa.vercel.app?lang=yo',
      'ha-NG': 'https://medsure-africa.vercel.app?lang=ha',
      'ig-NG': 'https://medsure-africa.vercel.app?lang=ig',
      'pcm-NG': 'https://medsure-africa.vercel.app?lang=pcm',
      'sw-KE': 'https://medsure-africa.vercel.app?lang=sw',
      'fr-SN': 'https://medsure-africa.vercel.app?lang=fr',
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Structured Data (JSON-LD) for Search Engines (SEO) and Generative AI Answer Engines (AEO: ChatGPT Search, Perplexity, Gemini, Claude)
  const jsonLdWebsite = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    name: 'MedSure Nigeria — Medicine Safety & Multilingual Verification',
    url: 'https://medsure-africa.vercel.app',
    description:
      'Open-source AI-assisted medicine verification system built with deterministic safety guardrails, NAFDAC verification, and indigenous language voice synthesis for Africa.',
    inLanguage: ['en', 'yo', 'ha', 'ig', 'pcm', 'sw', 'fr'],
    about: {
      '@type': 'MedicalCondition',
      name: 'Adverse Drug Reaction and Counterfeit Medicine Ingestion Prevention',
      possibleTreatment: [
        {
          '@type': 'MedicalTherapy',
          name: 'Essential Medicine Verification & Pharmacist Escalation'
        }
      ]
    },
    audience: {
      '@type': 'PeopleAudience',
      geographicArea: {
        '@type': 'AdministrativeArea',
        name: 'Nigeria and Sub-Saharan Africa'
      }
    },
    publisher: {
      '@type': 'Organization',
      name: 'MedSure Initiative · OSCA Ile-Ife',
      url: 'https://github.com/Cyb3rflex/medsure'
    }
  };

  const jsonLdSoftwareApp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'MedSure Mobile Scanner',
    applicationCategory: 'HealthApplication',
    operatingSystem: 'All modern web browsers (iOS, Android, Windows, macOS)',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD'
    },
    featureList: [
      'Deterministic NAFDAC Registration Number Regex Validation',
      'Real-time Expiry Date Mathematical Verification',
      '43 Nigerian Essential Medicines Drug Interaction Matrix',
      'Multilingual Audio Explanations in Yorùbá, Hausa, Igbo, and Pidgin',
      'Licensed Pharmacist-in-the-Loop Review Queue'
    ]
  };

  const jsonLdFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How does MedSure ensure it never hallucinates safe dosages?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'MedSure enforces a strict two-tier architectural boundary: deterministic TypeScript code makes 100% of the safety, expiry, NAFDAC registration, and cross-drug interaction decisions. The AI (Google Gemma 2 & Vision models) is strictly restricted to plain-language explanation and OCR text extraction.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is the Ajala tragedy and how does MedSure prevent it?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'In rural Ajala town, counterfeit antibiotics with fake NAFDAC numbers led to tragic fatalities. MedSure cross-checks official Nigerian Green Book regex formats (e.g. 04-1234, A4-5678, NR-0123) and matches active compounds against 43 vetted Nigerian Essential Medicines to block fake packs immediately.'
        }
      },
      {
        '@type': 'Question',
        name: 'Does MedSure work for users who cannot read English?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! MedSure features native voice synthesis and plain-language explanations in Yorùbá, Hausa, Igbo, Nigerian Pidgin, Swahili, and French. Complex pharmacological terms are translated into natural body terms anyone can understand.'
        }
      },
      {
        '@type': 'Question',
        name: 'What happens when a suspicious or flagged drug is detected?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The user receives an immediate clear red warning. Concurrently, the suspect medicine package is automatically queued for our licensed Pharmacist-in-the-Loop review portal, enabling verification and regulatory reporting before consumption.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is patient medical data sold or stored on centralized cloud servers?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Never. MedSure stores patient medicine cabinets locally in browser localStorage. MedSure is 100% open source under the MIT License for the OSCA Ile-Ife Hacktoberfest Challenge (OPEN//BUILD 2026).'
        }
      },
      {
        '@type': 'Question',
        name: 'Can MedSure be used outside Nigeria?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. While optimized for Nigeria essential medicines and regulatory standards, MedSure modular open-weight architecture connects 18 regional hubs across West, East, North, and Southern Africa.'
        }
      }
    ]
  };

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#022c22" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
        {/* AEO & Search Engine Knowledge Graphs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebsite) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSoftwareApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />
      </head>
      <body className="antialiased bg-[#0b1120] text-slate-100 min-h-screen flex flex-col selection:bg-emerald-500 selection:text-white">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Ambient lighting glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-[130px]" />
          <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[150px]" />
          <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[140px]" />
        </div>
        <div className="relative z-10 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
