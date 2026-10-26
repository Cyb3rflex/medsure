"use client";

import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

export type Testimonial = {
  quote: string;
  name: string;
  designation: string;
  src: string;
};

export const AnimatedTestimonials = ({
  testimonials,
  autoplay = true,
}: {
  testimonials: Testimonial[];
  autoplay?: boolean;
}) => {
  const [active, setActive] = useState(0);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const isActive = (index: number) => {
    return index === active;
  };

  useEffect(() => {
    if (autoplay) {
      const interval = setInterval(handleNext, 6500);
      return () => clearInterval(interval);
    }
  }, [autoplay, testimonials.length]);

  const randomRotateY = () => {
    return Math.floor(Math.random() * 17) - 8;
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-16 font-sans antialiased md:max-w-4xl md:px-8 lg:px-12">
      <div className="relative grid grid-cols-1 gap-12 md:grid-cols-2 items-center">
        <div>
          <div className="relative h-80 w-full">
            <AnimatePresence>
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.src}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                    z: -100,
                    rotate: randomRotateY(),
                  }}
                  animate={{
                    opacity: isActive(index) ? 1 : 0.7,
                    scale: isActive(index) ? 1 : 0.95,
                    z: isActive(index) ? 0 : -100,
                    rotate: isActive(index) ? 0 : randomRotateY(),
                    zIndex: isActive(index)
                      ? 40
                      : testimonials.length + 2 - index,
                    y: isActive(index) ? [0, -40, 0] : 0,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                    z: 100,
                    rotate: randomRotateY(),
                  }}
                  transition={{
                    duration: 0.4,
                    ease: "easeInOut",
                  }}
                  className="absolute inset-0 origin-bottom"
                >
                  <img
                    src={testimonial.src}
                    alt={testimonial.name}
                    width={500}
                    height={500}
                    draggable={false}
                    className="h-full w-full rounded-3xl object-cover object-center border border-emerald-500/30 shadow-2xl shadow-emerald-950/50"
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex flex-col justify-between py-2">
          <motion.div
            key={active}
            initial={{
              y: 20,
              opacity: 0,
            }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              y: -20,
              opacity: 0,
            }}
            transition={{
              duration: 0.25,
              ease: "easeInOut",
            }}
          >
            <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-3">
              Verified Real Story
            </div>
            <h3 className="text-2xl font-black text-white">
              {testimonials[active].name}
            </h3>
            <p className="text-sm font-medium text-emerald-400/90 mt-0.5">
              {testimonials[active].designation}
            </p>
            <motion.p className="mt-6 text-base md:text-lg text-slate-300 leading-relaxed font-normal">
              &ldquo;
              {testimonials[active].quote.split(" ").map((word, index) => (
                <motion.span
                  key={index}
                  initial={{
                    filter: "blur(6px)",
                    opacity: 0,
                    y: 4,
                  }}
                  animate={{
                    filter: "blur(0px)",
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.015 * index,
                  }}
                  className="inline-block"
                >
                  {word}&nbsp;
                </motion.span>
              ))}
              &rdquo;
            </motion.p>
          </motion.div>

          <div className="flex gap-3 pt-8">
            <button
              onClick={handlePrev}
              aria-label="Previous story"
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white transition-all hover:scale-105 active:scale-95"
            >
              <IconArrowLeft className="h-5 w-5 text-slate-300 transition-transform duration-300 group-hover/button:-translate-x-0.5" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next story"
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 border border-slate-700 hover:border-emerald-500 text-white transition-all hover:scale-105 active:scale-95"
            >
              <IconArrowRight className="h-5 w-5 text-slate-300 transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
