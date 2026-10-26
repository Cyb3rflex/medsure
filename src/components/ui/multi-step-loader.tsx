"use client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useState, useEffect } from "react";

const CheckIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={cn("w-6 h-6", className)}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  );
};

const CheckFilled = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("w-6 h-6", className)}
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z"
        clipRule="evenodd"
      />
    </svg>
  );
};

export type LoadingState = {
  text: string;
};

const LoaderCore = ({
  loadingStates,
  value = 0,
}: {
  loadingStates: LoadingState[];
  value?: number;
}) => {
  return (
    <div className="flex relative justify-start max-w-xl mx-auto flex-col px-4">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value);
        const opacity = Math.max(1 - distance * 0.25, 0.15);

        return (
          <motion.div
            key={index}
            className={cn("text-left flex items-center gap-3 mb-4")}
            initial={{ opacity: 0, y: -(value * 32) }}
            animate={{ opacity: opacity, y: -(value * 32) }}
            transition={{ duration: 0.4 }}
          >
            <div>
              {index > value && (
                <CheckIcon className="text-slate-600" />
              )}
              {index <= value && (
                <CheckFilled
                  className={cn(
                    "text-slate-500",
                    value === index
                      ? "text-emerald-400 scale-110 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                      : "text-emerald-500"
                  )}
                />
              )}
            </div>
            <span
              className={cn(
                "text-sm md:text-base font-medium transition-colors",
                index > value && "text-slate-500",
                index < value && "text-slate-300",
                value === index && "text-emerald-300 font-bold text-base md:text-lg"
              )}
            >
              {loadingState.text}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
};

export const MultiStepLoader = ({
  loadingStates,
  loading,
  duration = 1800,
  loop = false,
}: {
  loadingStates: LoadingState[];
  loading?: boolean;
  duration?: number;
  loop?: boolean;
}) => {
  const [currentState, setCurrentState] = useState(0);

  useEffect(() => {
    if (!loading) {
      setCurrentState(0);
      return;
    }
    const timeout = setTimeout(() => {
      setCurrentState((prevState) =>
        loop
          ? prevState === loadingStates.length - 1
            ? 0
            : prevState + 1
          : Math.min(prevState + 1, loadingStates.length - 1)
      );
    }, duration);

    return () => clearTimeout(timeout);
  }, [currentState, loading, loop, loadingStates.length, duration]);

  return (
    <AnimatePresence mode="wait">
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-full h-full fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/85 backdrop-blur-xl px-4"
        >
          <div className="relative w-full max-w-md p-6 rounded-3xl border border-emerald-500/30 bg-slate-900/90 shadow-2xl shadow-emerald-950/60 overflow-hidden">
            {/* Top scanning HUD indicator */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-xs uppercase font-mono tracking-widest text-emerald-400 font-bold">
                  MedSure AI Analysis Engine
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {Math.round(((currentState + 1) / loadingStates.length) * 100)}%
              </span>
            </div>

            <div className="h-64 relative flex items-center justify-center overflow-hidden">
              <LoaderCore value={currentState} loadingStates={loadingStates} />
            </div>

            {/* Subtext */}
            <p className="mt-4 text-center text-xs text-slate-400 font-mono">
              Verifying active ingredients against Nigerian essential medicines database...
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
