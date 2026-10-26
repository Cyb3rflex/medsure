"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
  navItems,
  className,
  onLaunchApp,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: React.ReactNode;
  }[];
  className?: string;
  onLaunchApp?: () => void;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const prev = scrollYProgress.getPrevious() ?? 0;
      const direction = current - prev;

      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.25,
          ease: "easeOut",
        }}
        className={cn(
          "flex max-w-fit fixed top-5 inset-x-0 mx-auto z-[5000] items-center justify-center px-2",
          className
        )}
      >
        <div className="flex items-center justify-center gap-1.5 sm:gap-3 rounded-full border border-emerald-500/25 bg-slate-950/85 px-3 py-2 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl ring-1 ring-white/10">
          {/* Logo Chip */}
          <a
            href="#hero"
            className="flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-white font-bold text-xs sm:text-sm tracking-tight hover:bg-emerald-500/25 transition-colors"
          >
            <span className="text-base sm:text-lg">🛡️</span>
            <span className="text-emerald-400 font-extrabold">MedSure</span>
          </a>

          {/* Nav items */}
          <div className="flex items-center gap-1">
            {navItems.map((navItem, idx: number) => (
              <a
                key={`link-${idx}`}
                href={navItem.link}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-emerald-300"
                )}
              >
                <span className="block sm:hidden text-slate-400">{navItem.icon}</span>
                <span className="hidden sm:block">{navItem.name}</span>
              </a>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-800" />

          {/* Launch Scanner CTA */}
          <button
            onClick={onLaunchApp}
            className="relative rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3.5 sm:px-4 py-1.5 text-xs sm:text-sm font-bold transition-all shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95 flex items-center gap-1.5"
          >
            <span>Scan Medicine</span>
            <span className="text-xs">📸</span>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
