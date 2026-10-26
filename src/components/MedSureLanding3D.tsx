'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Pill,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Volume2,
  Users,
  Cpu,
  Database,
  FileCode2,
  HeartPulse,
  Flame,
  Radio,
  ExternalLink
} from 'lucide-react';
import Globe3DDemo from '@/components/3d-globe-demo';
import AnimatedTestimonialsDemo from '@/components/animated-testimonials-demo';
import FAQSection from '@/components/FAQSection';
import ParticleBackground from '@/components/ParticleBackground';
import { BackgroundBeams } from '@/components/ui/background-beams';

interface MedSureLanding3DProps {
  onOpenApp: () => void;
}

export default function MedSureLanding3D({ onOpenApp }: MedSureLanding3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Intersection observer for section entry transitions
    const sections = Array.from(document.querySelectorAll('.story-section'));
    const parallaxEls = Array.from(document.querySelectorAll('[data-speed]'));

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
          }
        });
      },
      { threshold: 0.12 }
    );

    sections.forEach((sec) => revealObserver.observe(sec));

    function onScroll() {
      const innerH = window.innerHeight || 1;

      for (let i = 0; i < parallaxEls.length; i++) {
        const el = parallaxEls[i] as HTMLElement;
        const sec = el.closest('section');
        if (!sec) continue;
        const rect = sec.getBoundingClientRect();
        const p = -rect.top / innerH;
        const speed = parseFloat(el.getAttribute('data-speed') || '0');
        const rot = parseFloat(el.getAttribute('data-rot') || '0');
        el.style.transform = `translate3d(0, ${p * speed * innerH}px, 0) rotate(${p * rot}deg)`;
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    // 1. Three.js Scene Setup
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.05).texture;

    const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    // 2. Dynamic Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xecfdf5, 0x090d16, 1.6);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 3.0);
    dirLight1.position.set(4, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x34d399, 2.4);
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 3.5, 12);
    cyanPointLight.position.set(0, 2, 3);
    scene.add(cyanPointLight);

    // 3. 3D Capsule Pill (Balanced size: impactful, elegant, and moves cohesively with the narrative)
    const flight = new THREE.Group();
    scene.add(flight);

    const capsuleRoot = new THREE.Group();
    flight.add(capsuleRoot);

    const emeraldMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      roughness: 0.14,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      transmission: 0.25,
      ior: 1.52,
      thickness: 0.5
    });

    const whiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.14,
      metalness: 0.04,
      clearcoat: 0.95,
      clearcoatRoughness: 0.08
    });

    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.22,
      metalness: 0.88
    });

    // Compact, refined capsule geometry (scaled down so it never crowds content)
    const capsuleHalfLength = 0.28;
    const capsuleRadius = 0.28;

    // Top Dome & Cylinder (Emerald Green)
    const topGroup = new THREE.Group();
    const topCylGeom = new THREE.CylinderGeometry(capsuleRadius, capsuleRadius, capsuleHalfLength, 32, 1, true);
    topCylGeom.translate(0, capsuleHalfLength / 2, 0);
    const topCyl = new THREE.Mesh(topCylGeom, emeraldMat);
    topGroup.add(topCyl);

    const topDomeGeom = new THREE.SphereGeometry(capsuleRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    topDomeGeom.translate(0, capsuleHalfLength, 0);
    const topDome = new THREE.Mesh(topDomeGeom, emeraldMat);
    topGroup.add(topDome);
    capsuleRoot.add(topGroup);

    // Bottom Dome & Cylinder (White Porcelain)
    const botGroup = new THREE.Group();
    const botCylGeom = new THREE.CylinderGeometry(capsuleRadius, capsuleRadius, capsuleHalfLength, 32, 1, true);
    botCylGeom.translate(0, -capsuleHalfLength / 2, 0);
    const botCyl = new THREE.Mesh(botCylGeom, whiteMat);
    botGroup.add(botCyl);

    const botDomeGeom = new THREE.SphereGeometry(capsuleRadius, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    botDomeGeom.translate(0, -capsuleHalfLength, 0);
    const botDome = new THREE.Mesh(botDomeGeom, whiteMat);
    botGroup.add(botDome);
    capsuleRoot.add(botGroup);

    // Central Seam Ring
    const seamGeom = new THREE.TorusGeometry(capsuleRadius * 1.018, 0.02, 16, 48);
    seamGeom.rotateX(Math.PI / 2);
    const seamMesh = new THREE.Mesh(seamGeom, goldRingMat);
    capsuleRoot.add(seamMesh);

    // Clinical Cross Emblem on the face
    const crossGroup = new THREE.Group();
    const crossMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
    const barVGeom = new THREE.BoxGeometry(0.04, 0.15, 0.03);
    const barHGeom = new THREE.BoxGeometry(0.15, 0.04, 0.03);
    crossGroup.add(new THREE.Mesh(barVGeom, crossMat));
    crossGroup.add(new THREE.Mesh(barHGeom, crossMat));
    crossGroup.position.set(0, capsuleHalfLength * 0.5, capsuleRadius * 0.97);
    capsuleRoot.add(crossGroup);

    // Orbiting Medical Shield Rings (Compact)
    const ring1Geom = new THREE.TorusGeometry(0.72, 0.010, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    capsuleRoot.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(0.90, 0.008, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    capsuleRoot.add(ring2);

    // Subtle floating sparkles
    const particleCount = 30;
    const particleGeom = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 2.5;
      particlePos[i + 1] = (Math.random() - 0.5) * 2.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 2.0;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x6ee7b7,
      size: 0.04,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    capsuleRoot.add(particles);

    canvas.classList.add('ready');

    // 4. Safe Trajectory: Kept strictly on the right side gutter, never overlapping text lines
    // Crucially: keyframe 4 scales to 0.0 so the pill completely vanishes before the 3D globe!
    const K_DESKTOP = [
      { x: 0.38, y: -0.02, s: 0.85, yaw: 35, pitch: -10, roll: 20 },   // 0. Hero: open right margin
      { x: 0.40, y: -0.06, s: 0.80, yaw: -30, pitch: 15, roll: -15 },  // 1. Human Crisis: safe right gutter
      { x: 0.38, y: -0.04, s: 0.82, yaw: 90, pitch: -5, roll: 15 },   // 2. 3-Step Scan: safe right gutter
      { x: 0.40, y: 0.02, s: 0.78, yaw: 180, pitch: 15, roll: -10 },  // 3. Technical Architecture: safe right gutter
      { x: 0.45, y: -0.10, s: 0.0, yaw: 260, pitch: 0, roll: 0 },     // 4. Disappears completely before 3D Globe!
      { x: 0.0, y: 0.22, s: 0.70, yaw: 360, pitch: 0, roll: 10 }      // 5. Reappears at bottom CTA card
    ];

    const K_MOBILE = [
      { x: 0.0, y: 0.38, s: 0.35, yaw: 35, pitch: -10, roll: 20 },
      { x: 0.0, y: 0.38, s: 0.30, yaw: -30, pitch: 15, roll: -15 },
      { x: 0.0, y: 0.38, s: 0.30, yaw: 90, pitch: -5, roll: 15 },
      { x: 0.0, y: 0.38, s: 0.28, yaw: 180, pitch: 15, roll: -10 },
      { x: 0.0, y: 0.38, s: 0.0, yaw: 260, pitch: 0, roll: 0 },       // Disappears completely before 3D Globe!
      { x: 0.0, y: 0.35, s: 0.30, yaw: 360, pitch: 0, roll: 10 }
    ];

    function ease(t: number) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function lerp(a: number, b: number, t: number) {
      return a + (b - a) * t;
    }

    function lerpAngle(a: number, b: number, t: number) {
      const d = ((b - a + 540) % 360) - 180;
      return a + d * t;
    }

    function targetAt(p: number) {
      const isMobile = window.innerWidth < 768;
      const K = isMobile ? K_MOBILE : K_DESKTOP;
      if (!isFinite(p)) p = 0;
      p = Math.max(0, Math.min(K.length - 1, p));

      const i = Math.min(K.length - 2, Math.floor(p));
      const f = p - i;
      const t = ease(Math.max(0, Math.min(1, (f - 0.1) / 0.8)));
      const dive = Math.sin(t * Math.PI) * -0.06;

      const k0 = K[i];
      const k1 = K[i + 1];

      return {
        x: lerp(k0.x, k1.x, t),
        y: lerp(k0.y, k1.y, t) + dive,
        s: lerp(k0.s, k1.s, t),
        yaw: lerpAngle(k0.yaw, k1.yaw, t),
        pitch: lerp(k0.pitch, k1.pitch, t),
        roll: lerp(k0.roll, k1.roll, t)
      };
    }

    const clock = new THREE.Clock();
    const cur = { x: 0.38, y: -0.02, s: 0.85, yaw: 35, pitch: -10, roll: 20 };
    const mouse = { x: 0, y: 0, sx: 0, sy: 0 };

    const handlePointerMove = (e: MouseEvent) => {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('pointermove', handlePointerMove);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    };
    window.addEventListener('resize', handleResize);

    let reqId: number;
    function animate() {
      reqId = requestAnimationFrame(animate);

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();

      const scrollY = window.scrollY || window.pageYOffset;
      const innerH = window.innerHeight || 1;
      const p = scrollY / innerH;
      const target = targetAt(p);

      mouse.sx += (mouse.x - mouse.sx) * (1 - Math.exp(-dt * 2.8));
      mouse.sy += (mouse.y - mouse.sy) * (1 - Math.exp(-dt * 2.8));

      const k = 1 - Math.exp(-dt * 3.5);
      cur.x += (target.x - cur.x) * k;
      cur.y += (target.y - cur.y) * k;
      cur.s += (target.s - cur.s) * k;
      cur.pitch += (target.pitch - cur.pitch) * k;
      cur.roll += (target.roll - cur.roll) * k;
      cur.yaw = lerpAngle(cur.yaw, target.yaw, 1 - Math.exp(-dt * 2.8));

      const fovRad = (camera.fov * Math.PI) / 180;
      const halfH = Math.tan(fovRad / 2) * camera.position.z;
      const halfW = halfH * camera.aspect;
      const hover = Math.sin(t * 1.8) * 0.025 + Math.cos(t * 2.5) * 0.01;

      // Safe coordinate bounds to prevent text collision
      const safeX = Math.max(0.35, cur.x);

      flight.position.set(
        (window.innerWidth < 768 ? cur.x : safeX) * halfW + mouse.sx * 0.08,
        cur.y * halfH + hover * halfH * 0.3 + mouse.sy * 0.06,
        Math.sin(t * 0.8) * 0.06
      );

      // Check distance to the 3D globe section (#africa-impact)
      // When nearing or viewing the 3D globe, pill disappears completely!
      let globeProximityFade = 1.0;
      const globeSection = document.getElementById('africa-impact');
      if (globeSection) {
        const rect = globeSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 1.15 && rect.bottom > -80) {
          globeProximityFade = 0.0; // Completely hidden during globe & testimonials
        } else if (rect.top < window.innerHeight * 1.5 && rect.top >= window.innerHeight * 1.15) {
          globeProximityFade = (rect.top - window.innerHeight * 1.15) / (window.innerHeight * 0.35);
        }
      }

      const activeScale = Math.max(0, cur.s * globeProximityFade);

      if (activeScale < 0.03) {
        flight.visible = false;
      } else {
        flight.visible = true;
        flight.scale.setScalar(halfH * 2 * 0.17 * activeScale);
      }

      capsuleRoot.rotation.x = ((cur.pitch + mouse.sy * 8) * Math.PI) / 180 + Math.sin(t * 1.2) * 0.04;
      capsuleRoot.rotation.y = ((cur.yaw + mouse.sx * 12) * Math.PI) / 180 + t * 0.28;
      capsuleRoot.rotation.z = (cur.roll * Math.PI) / 180 + Math.cos(t * 1.5) * 0.04;

      ring1.rotation.z = t * 0.45;
      ring2.rotation.y = t * -0.35;
      particles.rotation.y = t * 0.1;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative z-0 text-white selection:bg-emerald-500 selection:text-slate-950 font-sans bg-slate-950">
      {/* 1. FLOATING PARTICLES CANVAS ACROSS SITE */}
      <ParticleBackground />

      {/* 2. THREE.JS 3D ACCENT CANVAS */}
      <canvas
        ref={canvasRef}
        id="bee"
        className="fixed inset-0 z-20 w-full h-full pointer-events-none opacity-0 transition-opacity duration-1000 [&.ready]:opacity-100"
      />

      {/* ========================================================================= */}
      {/* SECTION 0: HERO (Instant Clarity for Patients, Caregivers & Hackathon Judges) */}
      {/* ========================================================================= */}
      <section className="story-section hero min-h-[92vh] relative overflow-hidden z-10 flex flex-col justify-center px-4 sm:px-8 lg:px-16 pt-28 pb-16" id="hero">
        {/* Aceternity UI Background Beams for dynamic luminous aesthetics */}
        <BackgroundBeams className="opacity-75 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* OSCA Hacktoberfest Challenge Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OSCA Ile-Ife Hacktoberfest 2026 · AI Belongs To Everyone</span>
          </div>

          {/* Simple, Unambiguous Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Never Take The <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Wrong Medicine Again.
            </span>
          </h1>

          {/* Plain Human Value Proposition */}
          <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal">
            Take a 5-second photo of any medicine pack. We verify if it is genuine, unexpired, and safe for you — explained in plain <strong>English, Pidgin, Yorùbá, Hausa, or Igbo</strong> with spoken audio.
          </p>

          {/* Big Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenApp}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base sm:text-lg shadow-[0_0_40px_rgba(16,185,129,0.45)] transition-all flex items-center gap-3 active:scale-95 cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>Scan Medicine Free &rarr;</span>
            </button>
            <a
              href="#human-crisis"
              className="px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm sm:text-base font-bold transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <span>Why We Built This</span>
            </a>
          </div>

          {/* Universal Traffic-Light Visuals (Designed for instant low-literacy understanding) */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>🟢 Green = Safe to take</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>🟡 Yellow = Caution</span>
            </div>
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span>🔴 Red = Stop! See Pharmacist</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1: THE REAL HUMAN CRISIS (Product Background from projectbrief.md) */}
      {/* ========================================================================= */}
      <section id="human-crisis" className="story-section py-20 px-4 sm:px-8 lg:px-16 border-t border-slate-800/80 bg-slate-950/80 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-red-400 bg-red-950/60 px-3 py-1 rounded-full border border-red-500/30">
              The Reality in Nigeria
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              What Was Meant To Be A Cure Led To Tragedy
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Behind every preventable tragedy in our towns lies the same painful truth: safe medicine was available, but <strong>unreadable packaging, counterfeit batches, and panic dosage turned cure into crisis</strong>:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Case 1: Ajala Town */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 hover:border-red-500/40 transition-all space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-red-400 uppercase">
                <Flame className="w-4 h-4 text-red-400" />
                <span>Ajala Town · Northern Nigeria</span>
              </div>
              <h3 className="text-lg font-bold text-white">Substandard Chemist Drugs</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Residents routinely suffer chronic stomach ulcers and organ trauma after taking locally mixed, sub-standard medications sold by unlicensed patent medicine vendors ("chemists").
              </p>
            </div>

            {/* Case 2: Riverine Allergy Crisis */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 hover:border-amber-500/40 transition-all space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Riverine Delta · 18,000+ Cases</span>
              </div>
              <h3 className="text-lg font-bold text-white">Hidden Drug Allergens</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Thousands of documented cases of severe, irreversible skin and immunological mutations occurred because patients consumed drugs without knowing they contained Sulfa or NSAID allergens.
              </p>
            </div>

            {/* Case 3: Ondo State Overdose */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 hover:border-purple-500/40 transition-all space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-purple-400 uppercase">
                <HeartPulse className="w-4 h-4 text-purple-400" />
                <span>Ondo State · 19-Year-Old Student</span>
              </div>
              <h3 className="text-lg font-bold text-white">Panic Overdose in Agony</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                A promising student lost her life to acute liver failure. Desperate to relieve severe exam migraine, she repeatedly swallowed analgesic pills, completely unaware of toxic threshold limits.
              </p>
            </div>

            {/* Case 4: Southern Monarch */}
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/90 hover:border-cyan-500/40 transition-all space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span>Southern Nigeria · Community Monarch</span>
              </div>
              <h3 className="text-lg font-bold text-white">Fatal Drug-Drug Interaction</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                A community monarch lost his life after taking an uncoordinated combination of anti-diabetic and prescription drugs that triggered catastrophic, unmonitored hypoglycemia.
              </p>
            </div>
          </div>

          <div className="mt-8 p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm text-emerald-300 font-medium">
              Nigeria has <strong>less than 4 pharmacists per 10,000 people</strong>. MedSure gives every household an instant, clinical safety net in the palm of their hand.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 2: 3-STEP USER EXPERIENCE (Simple for Anyone & Low Literacy) */}
      {/* ========================================================================= */}
      <section id="how-it-works" className="story-section py-20 px-4 sm:px-8 lg:px-16 border-t border-slate-800/80 bg-slate-900/50 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
              Universal Simplicity
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              How MedSure Works in 3 Steps
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Designed for mothers, students, elderly relatives, and everyday shoppers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all bg-slate-900/70">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-3xl mb-6 shadow-lg shadow-emerald-950/40">
                📸
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                Step 1
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Point Phone &amp; Snap
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Take a quick photo of the box, foil blister strip, or syrup bottle. Or simply speak or type the name. Even with crinkled or reflective packaging, our multimodal OCR reads the fine print.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/40 transition-all bg-slate-900/70">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-3xl mb-6 shadow-lg shadow-cyan-950/40">
                🛡️
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                Step 2
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Code Checks Safety
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Deterministic code validates the Nigerian <strong>NAFDAC number</strong>, checks expiry dates, and flags drug clashes. If the pack is expired or counterfeit, dosage advice is immediately blocked.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-purple-500/40 transition-all bg-slate-900/70">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-3xl mb-6 shadow-lg shadow-purple-950/40">
                🗣️
              </div>
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block mb-1">
                Step 3
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Listen in Your Language
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Press Play to hear an audio voice note in <strong>English, Pidgin, Yorùbá, Hausa, or Igbo</strong> with adjustable playback speed (0.8x for elders) explaining what it does and how to stay safe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 3: TECHNICAL ARCHITECTURE & OPEN-WEIGHT RIGOR (from MODEL_CARD.md) */}
      {/* ========================================================================= */}
      <section id="safety-engine" className="story-section py-20 px-4 sm:px-8 lg:px-16 border-t border-slate-800/80 bg-slate-950 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400 bg-emerald-950/70 px-3 py-1 rounded-full border border-emerald-500/30">
              Engineering &amp; Model Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Deterministic Code vs. Open-Weight AI
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              In healthcare, <strong>AI hallucination can be fatal</strong>. MedSure enforces a strict two-tier architecture: medical safety is locked in verified code, while open-weight models handle human communication.
            </p>
          </div>

          {/* Two-Tier Architectural Breakdown Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tier 1: Deterministic Code Safety */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-slate-900/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <FileCode2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold">Tier 1 Engine</span>
                  <h3 className="text-xl font-bold text-white">Pure Deterministic Code (Zero Hallucination)</h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                The language model is <strong>strictly prohibited</strong> from determining if a drug is safe or generating dosages. All critical decisions are made by TypeScript code:
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>NAFDAC Regex Format Validation:</strong> Matches official Nigerian registration formats (<code className="text-emerald-300">04-1234</code>, <code className="text-emerald-300">A4-5678</code>, <code className="text-emerald-300">NR-0123</code>).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Expiry Date Math:</strong> Precise calendar calculation against extracted package expiry. Expired packs are blocked immediately.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>43 Nigerian Essential Medicines:</strong> Vetted database parsed from Federal Ministry of Health and WHO model lists.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>14 Cross-Drug Interaction Rules:</strong> Real-time matrix detecting fatal duplicate NSAID therapy, antimalarial clashes, and contraindications.</span>
                </li>
              </ul>
            </div>

            {/* Tier 2: Open-Weight AI Architecture */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-slate-900/80 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold">Tier 2 Foundation</span>
                  <h3 className="text-xl font-bold text-white">Open-Weight AI Pipeline (Hugging Face)</h3>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Open weights ensure technological sovereignty for Africa, enabling offline deployment in rural primary health clinics:
              </p>

              <ul className="space-y-2.5 text-xs text-slate-300 pt-1">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Google Gemma 2 (9B &amp; 2B):</strong> Translates pharmacological mechanisms into plain human terms (*"relaxes tight lung tubes so oxygen enters"*). Gemma 2 2B can run on local edge hardware with 4-bit quantization without internet.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Qwen2.5-VL &amp; SmolVLM-500M:</strong> Multimodal vision models extracting text from skewed, reflective blister packaging and curved bottles.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Whisper &amp; Meta MMS Speech:</strong> High-fidelity African language synthesis for Yoruba, Hausa, Igbo, and Nigerian Pidgin.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Pharmacist Queue Escalation:</strong> Suspect packs are routed to a clinician portal where licensed pharmacists review and sign off.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 4: 3D GLOBE (Pan-African & Global Health Impact) */}
      {/* ========================================================================= */}
      <div id="africa-impact">
        <Globe3DDemo />
      </div>

      {/* ========================================================================= */}
      {/* SECTION 5: AUTHENTIC AFRICAN TESTIMONIALS */}
      {/* ========================================================================= */}
      <AnimatedTestimonialsDemo />

      {/* ========================================================================= */}
      {/* SECTION 6: FREQUENTLY ASKED QUESTIONS */}
      {/* ========================================================================= */}
      <FAQSection />

      {/* ========================================================================= */}
      {/* SECTION 6: FINAL HIGH-IMPACT LAUNCH CTA */}
      {/* ========================================================================= */}
      <section className="story-section py-20 px-4 sm:px-8 border-t border-slate-800/80 bg-slate-950 relative z-10 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
            <Pill className="w-8 h-8 text-emerald-400" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Protect Yourself &amp; Your Loved Ones Today
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            Free, open source, and works in any mobile browser. Zero download required.
          </p>

          <div className="pt-2">
            <button
              onClick={onOpenApp}
              className="px-9 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base sm:text-lg shadow-[0_0_40px_rgba(16,185,129,0.45)] transition-all cursor-pointer active:scale-95"
            >
              Launch Live Medicine Scanner &rarr;
            </button>
          </div>

          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
            <span>MedSure Nigeria · OSCA Ile-Ife Hacktoberfest 2026</span>
            <span>43 Nigerian Essential Medicines · Zero AI Hallucination</span>
          </div>
        </div>
      </section>
    </div>
  );
}
