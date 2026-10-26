"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import { IconHome, IconInfoCircle, IconWorld, IconMessage2, IconCamera } from "@tabler/icons-react";

export default function FloatingNavDemo({ onLaunchApp }: { onLaunchApp: () => void }) {
  const navItems = [
    {
      name: "The Crisis",
      link: "#human-crisis",
      icon: <IconInfoCircle className="h-4 w-4" />,
    },
    {
      name: "How It Works",
      link: "#how-it-works",
      icon: <IconHome className="h-4 w-4" />,
    },
    {
      name: "Architecture",
      link: "#safety-engine",
      icon: <IconHome className="h-4 w-4" />,
    },
    {
      name: "Africa Impact",
      link: "#africa-impact",
      icon: <IconWorld className="h-4 w-4" />,
    },
    {
      name: "Stories",
      link: "#testimonials",
      icon: <IconMessage2 className="h-4 w-4" />,
    },
  ];

  return <FloatingNav navItems={navItems} onLaunchApp={onLaunchApp} />;
}
