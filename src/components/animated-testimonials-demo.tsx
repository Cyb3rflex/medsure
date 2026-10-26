"use client";
import React from "react";
import { AnimatedTestimonials, Testimonial } from "@/components/ui/animated-testimonials";
import { HeartHandshake } from "lucide-react";

export default function AnimatedTestimonialsDemo() {
  const testimonials: Testimonial[] = [
    {
      quote:
        "At 2 AM when my daughter had an acute breathless episode, panic gripped my house. I didn't know which inhaler was safe. MedSure's voice spoke in Nigerian Pidgin, told me to sit her upright and keep her calm while explaining what the active ingredient does. It prevented pure tragedy.",
      name: "Amaka Okafor",
      designation: "Mother & Caregiver in Agege, Lagos",
      src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
    },
    {
      quote:
        "In our community pharmacy here in Osun, over 30% of medicines brought in from patent stores have dubious NAFDAC numbers or faded expiry dates. MedSure's code-level guardrail catches expired packs instantly, and the clinical queue lets me review flagged drugs remotely.",
      name: "Pharm. Tunde Balogun",
      designation: "Registered Community Pharmacist, Ile-Ife",
      src: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=1000&auto=format&fit=crop",
    },
    {
      quote:
        "I cannot read the tiny English writing on medicine packages. When I got malaria, MedSure read the pack and explained the exact dosage in Hausa. It warned me not to mix it with another painkiller that my local chemist recommended.",
      name: "Mallam Musa Ibrahim",
      designation: "Small Business Trader, Kano",
      src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
    },
    {
      quote:
        "In the riverine delta, we deal with severe allergic skin eruptions because patients don't realize generic brands contain Sulfas or NSAIDs. MedSure's prominent allergy warning badge is a breakthrough for preventative medicine in Africa.",
      name: "Dr. Ngozi Eze",
      designation: "Clinical Medical Officer, Delta State",
      src: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1000&auto=format&fit=crop",
    },
  ];

  return (
    <section id="testimonials" className="relative w-full py-16 px-4 border-t border-slate-800/80 bg-slate-950/90">
      <div className="max-w-4xl mx-auto text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Real Voices. Real Safety.</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          Why Families & Pharmacists Trust <span className="text-emerald-400">MedSure</span>
        </h2>
        <p className="mt-2 text-sm md:text-base text-slate-300 max-w-xl mx-auto">
          Hear from mothers, patients, and healthcare providers who avoid counterfeit risks and dangerous drug clashes every day.
        </p>
      </div>

      <AnimatedTestimonials testimonials={testimonials} autoplay={true} />
    </section>
  );
}
