"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function BackgroundBeamsDemo() {
  return (
    <div className="h-[40rem] w-full rounded-md bg-slate-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4 text-center">
        <h1 className="relative z-10 text-lg md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-sans font-bold">
          MedSure Safety Beams
        </h1>
        <p className="text-neutral-400 max-w-lg mx-auto my-2 text-sm relative z-10">
          Deterministic AI medicine verification across Nigeria and Pan-Africa.
        </p>
      </div>
      <BackgroundBeams />
    </div>
  );
}
