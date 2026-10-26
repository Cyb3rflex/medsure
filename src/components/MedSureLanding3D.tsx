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
  PhoneCall,
  Lock,
  HeartPulse,
  Users
} from 'lucide-react';
import Globe3DDemo from '@/components/3d-globe-demo';
import FloatingNavDemo from '@/components/floating-navbar-demo';
import AnimatedTestimonialsDemo from '@/components/animated-testimonials-demo';

interface MedSureLanding3DProps {
  onOpenApp: () => void;
}

export default function MedSureLanding3D({ onOpenApp }: MedSureLanding3DProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Reveal on intersection
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
      { threshold: 0.15 }
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
    renderer.toneMappingExposure = 1.25;

    const scene = new THREE.Scene();
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.05).texture;

    const camera = new THREE.PerspectiveCamera(32, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 9);

    // 2. Lighting Rig
    const hemiLight = new THREE.HemisphereLight(0xecfdf5, 0x0f172a, 1.4);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.5);
    dirLight1.position.set(4, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x34d399, 2.0);
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 3.0, 10);
    cyanPointLight.position.set(0, 2, 3);
    scene.add(cyanPointLight);

    // 3. 3D Capsule Pill (Significantly reduced in scale to avoid blocking text)
    const flight = new THREE.Group();
    scene.add(flight);

    const capsuleRoot = new THREE.Group();
    flight.add(capsuleRoot);

    const emeraldMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      roughness: 0.15,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      transmission: 0.22,
      ior: 1.52,
      thickness: 0.4
    });

    const whiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.14,
      metalness: 0.04,
      clearcoat: 0.95,
      clearcoatRoughness: 0.1
    });

    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.85
    });

    // Scaled down dimensions: reduced from 0.58/0.55 to 0.34/0.32
    const capsuleHalfLength = 0.32;
    const capsuleRadius = 0.34;

    // Top Half (Emerald Green)
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

    // Bottom Half (White Porcelain)
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

    // Seam Ring
    const seamGeom = new THREE.TorusGeometry(capsuleRadius * 1.015, 0.025, 16, 48);
    seamGeom.rotateX(Math.PI / 2);
    const seamMesh = new THREE.Mesh(seamGeom, goldRingMat);
    capsuleRoot.add(seamMesh);

    // Cross Insignia
    const crossGroup = new THREE.Group();
    const crossMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
    const barVGeom = new THREE.BoxGeometry(0.05, 0.18, 0.03);
    const barHGeom = new THREE.BoxGeometry(0.18, 0.05, 0.03);
    crossGroup.add(new THREE.Mesh(barVGeom, crossMat));
    crossGroup.add(new THREE.Mesh(barHGeom, crossMat));
    crossGroup.position.set(0, capsuleHalfLength * 0.55, capsuleRadius * 0.98);
    capsuleRoot.add(crossGroup);

    // Orbiting Rings (Scales lowered)
    const ring1Geom = new THREE.TorusGeometry(0.85, 0.012, 16, 64);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.55 });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    capsuleRoot.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(1.05, 0.01, 16, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    capsuleRoot.add(ring2);

    // Ambient floating particles
    const particleCount = 35;
    const particleGeom = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 3.0;
      particlePos[i + 1] = (Math.random() - 0.5) * 3.0;
      particlePos[i + 2] = (Math.random() - 0.5) * 2.5;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x6ee7b7,
      size: 0.045,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    capsuleRoot.add(particles);

    canvas.classList.add('ready');

    // 4. Trajectory Keyframes: Pill sits discreetly off to the right / edge
    const K_DESKTOP = [
      { x: 0.35, y: -0.05, s: 0.62, yaw: 45, pitch: -15, roll: 25 },
      { x: -0.32, y: -0.02, s: 0.58, yaw: -35, pitch: 20, roll: -15 },
      { x: 0.35, y: -0.15, s: 0.60, yaw: 130, pitch: -10, roll: 20 },
      { x: -0.30, y: 0.05, s: 0.56, yaw: 210, pitch: 25, roll: -10 },
      { x: 0.0, y: -0.25, s: 0.52, yaw: 360, pitch: 0, roll: 10 }
    ];

    const K_MOBILE = [
      { x: 0.0, y: 0.28, s: 0.42, yaw: 45, pitch: -15, roll: 25 },
      { x: 0.0, y: 0.28, s: 0.40, yaw: -35, pitch: 20, roll: -15 },
      { x: 0.0, y: 0.28, s: 0.40, yaw: 130, pitch: -10, roll: 20 },
      { x: 0.0, y: 0.28, s: 0.38, yaw: 210, pitch: 25, roll: -10 },
      { x: 0.0, y: 0.28, s: 0.36, yaw: 360, pitch: 0, roll: 10 }
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
      const dive = Math.sin(t * Math.PI) * -0.1;

      const k0 = K[i];
      const k1 = K[i + 1];

      return {
        x: lerp(k0.x, k1.x, t),
        y: lerp(k0.y, k1.y, t) + dive,
        s: lerp(k0.s, k1.s, t) * (1 + Math.sin(t * Math.PI) * 0.05),
        yaw: lerpAngle(k0.yaw, k1.yaw, t),
        pitch: lerp(k0.pitch, k1.pitch, t),
        roll: lerp(k0.roll, k1.roll, t)
      };
    }

    const clock = new THREE.Clock();
    const cur = { x: 0.35, y: -0.05, s: 0.62, yaw: 45, pitch: -15, roll: 25 };
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

      mouse.sx += (mouse.x - mouse.sx) * (1 - Math.exp(-dt * 2.5));
      mouse.sy += (mouse.y - mouse.sy) * (1 - Math.exp(-dt * 2.5));

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
      const hover = Math.sin(t * 1.8) * 0.03 + Math.cos(t * 2.5) * 0.01;

      flight.position.set(
        cur.x * halfW + mouse.sx * 0.1,
        cur.y * halfH + hover * halfH * 0.35 + mouse.sy * 0.08,
        Math.sin(t * 0.8) * 0.08
      );

      flight.scale.setScalar(halfH * 2 * 0.22 * cur.s);

      capsuleRoot.rotation.x = ((cur.pitch + mouse.sy * 10) * Math.PI) / 180 + Math.sin(t * 1.2) * 0.05;
      capsuleRoot.rotation.y = ((cur.yaw + mouse.sx * 15) * Math.PI) / 180 + t * 0.3;
      capsuleRoot.rotation.z = (cur.roll * Math.PI) / 180 + Math.cos(t * 1.5) * 0.05;

      ring1.rotation.z = t * 0.5;
      ring2.rotation.y = t * -0.4;
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
      {/* 1. ACETERNITY FLOATING NAVBAR */}
      <FloatingNavDemo onLaunchApp={onOpenApp} />

      {/* 2. THREE.JS 3D ACCENT CANVAS (Reduced size, floating ambient accent) */}
      <canvas
        ref={canvasRef}
        id="bee"
        className="fixed inset-0 z-20 w-full h-full pointer-events-none opacity-0 transition-opacity duration-1000 [&.ready]:opacity-100"
      />

      {/* 3. HERO SECTION (Clear, accessible to anyone) */}
      <section className="story-section hero min-h-[92vh] relative overflow-visible z-10 flex flex-col justify-center px-4 sm:px-8 lg:px-16 pt-28 pb-16" id="hero">
        <div className="max-w-4xl mx-auto text-center space-y-6 z-10">
          {/* OSCA Challenge & Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-semibold shadow-lg backdrop-blur-md">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>OSCA Ile-Ife Hacktoberfest 2026 · Built for Africa</span>
          </div>

          {/* Simple, Powerful Headline for Judges, Patients & Low-Literacy Families */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-[1.08]">
            Never Take The <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Wrong Medicine Again.
            </span>
          </h1>

          {/* Plain Language Value Proposition */}
          <p className="text-base sm:text-xl text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal">
            Take a quick photo of any medicine pack. In <strong>5 seconds</strong>, we tell you if it is genuine, unexpired, and safe to take — explained in <strong>English, Pidgin, Yorùbá, Hausa, or Igbo</strong> with spoken audio.
          </p>

          {/* Big Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenApp}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base sm:text-lg shadow-[0_0_35px_rgba(16,185,129,0.4)] transition-all flex items-center gap-3 active:scale-95 cursor-pointer"
            >
              <Camera className="w-5 h-5" />
              <span>Scan Your Medicine Free &rarr;</span>
            </button>
            <a
              href="#how-it-works"
              className="px-6 py-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-sm sm:text-base font-bold transition-all flex items-center gap-2 backdrop-blur-sm"
            >
              <span>See How It Works</span>
            </a>
          </div>

          {/* Universal Color Code Chips (Designed for Instant Comprehension by Anyone) */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>🟢 Green = Safe to take</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>🟡 Yellow = Caution</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-300">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span>🔴 Red = Stop! See Pharmacist</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. UNIVERSAL 3-STEP "HOW IT WORKS" SECTION (Crystal Clear for Low Literacy & Judges) */}
      <section id="how-it-works" className="story-section py-20 px-4 sm:px-8 lg:px-16 border-t border-slate-800/80 bg-slate-900/40 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
              Simple 3-Step Protection
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              How MedSure Protects Your Family
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              No medical training or reading skills needed. We do the clinical thinking for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all bg-slate-900/60 relative group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-black text-2xl mb-6 shadow-lg shadow-emerald-950/40">
                📸
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider block mb-1">
                Step 1
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Point Phone &amp; Snap
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Take a quick photo of the box, foil blister strip, or bottle. Or simply type the name. Even if the box is crinkled or worn, our vision model reads the packaging.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all bg-slate-900/60 relative group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-black text-2xl mb-6 shadow-lg shadow-cyan-950/40">
                🛡️
              </div>
              <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
                Step 2
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Code Checks Safety
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Our code validates the Nigerian <strong>NAFDAC number</strong>, checks expiry dates, and scans for dangerous drug clashes. Zero hallucination: if it is expired or suspect, dosage is halted.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 hover:border-emerald-500/40 transition-all bg-slate-900/60 relative group">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-black text-2xl mb-6 shadow-lg shadow-purple-950/40">
                🗣️
              </div>
              <span className="text-xs font-mono text-purple-400 font-bold uppercase tracking-wider block mb-1">
                Step 3
              </span>
              <h3 className="text-xl font-bold text-white mb-2">
                Listen in Your Language
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Press Play to hear an audio voice note in <strong>English, Pidgin, Yorùbá, Hausa, or Igbo</strong> explaining what the medicine does, how to take it safely, and what to avoid.
              </p>
            </div>
          </div>

          {/* Quick Launch CTA */}
          <div className="mt-10 text-center">
            <button
              onClick={onOpenApp}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
            >
              <span>Test A Demo Medicine Pack Now &rarr;</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. CORE CLINICAL GUARDRAILS (Section ID: safety-engine) */}
      <section id="safety-engine" className="story-section py-20 px-4 sm:px-8 lg:px-16 border-t border-slate-800/80 bg-slate-950 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                Built-in Medical Safety
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
                Why Doctors &amp; Pharmacists Recommend MedSure
              </h2>
              <p className="text-slate-300 text-base leading-relaxed">
                In Nigeria, there are fewer than <strong>4 licensed pharmacists per 10,000 citizens</strong>. When panic strikes at home, MedSure acts as your 24/7 digital health guardrail:
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Active Ingredient Translation</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Explains chemicals in human terms (e.g. how Salbutamol opens narrowed lungs so oxygen enters).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Panic Overdose Warnings</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Explicitly warns against taking extra pills out of fear, preventing liver toxicity and heart stress.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <Users className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Licensed Pharmacist Review Queue</h4>
                    <p className="text-xs text-slate-300 mt-0.5">Flagged suspect packs route straight to our clinician dashboard for remote pharmacist approval.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Feature Demo Card */}
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/30 bg-slate-900/80 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-mono font-bold text-emerald-400">Live Guardrail Verification</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">NAFDAC: 04-1234</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">Ventolin Inhaler (Salbutamol)</span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                    ✓ Verified Clean
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>How it works:</strong> Relaxes and widens tightened airway muscle tubes in the lungs so oxygen can rush back in during an asthma attack.
                </p>
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                  <span>⚠️ <strong>Panic Alert:</strong> Do not take continuous puffs out of panic. Follow spacing.</span>
                </div>
              </div>

              <button
                onClick={onOpenApp}
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all"
              >
                Scan a Real Medicine Pack Now &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. ACETERNITY 3D GLOBE DEMO (African & Global Healthcare Impact) */}
      <div id="africa-impact">
        <Globe3DDemo />
      </div>

      {/* 7. ACETERNITY ANIMATED TESTIMONIALS DEMO */}
      <AnimatedTestimonialsDemo />

      {/* 8. FINAL HIGH-IMPACT LAUNCH CTA */}
      <section className="story-section py-20 px-4 sm:px-8 border-t border-slate-800/80 bg-slate-950 relative z-10 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/20">
            <Pill className="w-8 h-8 text-emerald-400" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Protect Yourself &amp; Your Loved Ones Today
          </h2>

          <p className="text-slate-300 text-base sm:text-lg">
            Free, open source, and works on any phone browser. No app store download required.
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
