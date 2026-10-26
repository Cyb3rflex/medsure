'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ShieldCheck, Sparkles, Stethoscope, ArrowRight, Pill, HeartPulse, CheckCircle2 } from 'lucide-react';

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

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        }
      });
    }, { threshold: 0.15 });

    sections.forEach(sec => revealObserver.observe(sec));

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

    // 2. Lighting Rig for Shiny Medical Sheen
    const hemiLight = new THREE.HemisphereLight(0xecfdf5, 0x0f172a, 1.4);
    scene.add(hemiLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.8);
    dirLight1.position.set(4, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x34d399, 2.2);
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 3.5, 12);
    cyanPointLight.position.set(0, 2, 3);
    scene.add(cyanPointLight);

    // 3. 3D Capsule Pill (💊) Construction
    const flight = new THREE.Group();
    scene.add(flight);

    const capsuleRoot = new THREE.Group();
    flight.add(capsuleRoot);

    // Materials: Emerald Green Glossy Half + Pristine White Half + Gold Seam Ring
    const emeraldMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x064e3b,
      emissiveIntensity: 0.35,
      roughness: 0.1,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95
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

    const capsuleHalfLength = 0.55;
    const capsuleRadius = 0.58;

    // Top Half (Emerald Green)
    const topGroup = new THREE.Group();
    const topCylGeom = new THREE.CylinderGeometry(capsuleRadius, capsuleRadius, capsuleHalfLength, 36, 1, true);
    topCylGeom.translate(0, capsuleHalfLength / 2, 0);
    const topCyl = new THREE.Mesh(topCylGeom, emeraldMat);
    topGroup.add(topCyl);

    const topDomeGeom = new THREE.SphereGeometry(capsuleRadius, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2);
    topDomeGeom.translate(0, capsuleHalfLength, 0);
    const topDome = new THREE.Mesh(topDomeGeom, emeraldMat);
    topGroup.add(topDome);
    capsuleRoot.add(topGroup);

    // Bottom Half (Porcelain White)
    const botGroup = new THREE.Group();
    const botCylGeom = new THREE.CylinderGeometry(capsuleRadius, capsuleRadius, capsuleHalfLength, 36, 1, true);
    botCylGeom.translate(0, -capsuleHalfLength / 2, 0);
    const botCyl = new THREE.Mesh(botCylGeom, whiteMat);
    botGroup.add(botCyl);

    const botDomeGeom = new THREE.SphereGeometry(capsuleRadius, 36, 18, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    botDomeGeom.translate(0, -capsuleHalfLength, 0);
    const botDome = new THREE.Mesh(botDomeGeom, whiteMat);
    botGroup.add(botDome);
    capsuleRoot.add(botGroup);

    // Golden Middle Joint Ring
    const seamGeom = new THREE.TorusGeometry(capsuleRadius * 1.015, 0.035, 16, 64);
    seamGeom.rotateX(Math.PI / 2);
    const seamMesh = new THREE.Mesh(seamGeom, goldRingMat);
    capsuleRoot.add(seamMesh);

    // Medical Cross Insignia on the Capsule Face
    const crossGroup = new THREE.Group();
    const crossMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
    const barVGeom = new THREE.BoxGeometry(0.08, 0.28, 0.04);
    const barHGeom = new THREE.BoxGeometry(0.28, 0.08, 0.04);
    crossGroup.add(new THREE.Mesh(barVGeom, crossMat));
    crossGroup.add(new THREE.Mesh(barHGeom, crossMat));
    crossGroup.position.set(0, capsuleHalfLength * 0.55, capsuleRadius * 0.98);
    capsuleRoot.add(crossGroup);

    // 4. Orbiting Holographic Rings
    const ring1Geom = new THREE.TorusGeometry(1.28, 0.015, 16, 80);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.65 });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    capsuleRoot.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(1.55, 0.012, 16, 80);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.45 });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 5;
    capsuleRoot.add(ring2);

    // 5. Floating Ambient Sparkles/Particles
    const particleCount = 45;
    const particleGeom = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 4.5;
      particlePos[i + 1] = (Math.random() - 0.5) * 4.5;
      particlePos[i + 2] = (Math.random() - 0.5) * 3.5;
    }
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x6ee7b7,
      size: 0.055,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeom, particleMat);
    capsuleRoot.add(particles);

    // Fade in canvas instantly
    canvas.classList.add('ready');

    // 6. Camera Trajectory Keyframes across Scroll
    const K_DESKTOP = [
      { x: 0.0, y: -0.05, s: 1.05, yaw: 45, pitch: -15, roll: 25 },     // Hero
      { x: -0.26, y: -0.02, s: 1.0, yaw: -35, pitch: 20, roll: -15 },   // 01 Ingredients
      { x: 0.28, y: -0.18, s: 1.05, yaw: 130, pitch: -10, roll: 20 },   // 02 Code Guardrails
      { x: -0.24, y: 0.05, s: 0.95, yaw: 210, pitch: 25, roll: -10 },   // 03 Multilingual Voice
      { x: 0.0, y: -0.05, s: 1.0, yaw: 360, pitch: 0, roll: 10 }        // Footer
    ];

    const K_MOBILE = [
      { x: 0.0, y: 0.08, s: 0.75, yaw: 45, pitch: -15, roll: 25 },
      { x: 0.0, y: 0.15, s: 0.72, yaw: -35, pitch: 20, roll: -15 },
      { x: 0.0, y: 0.15, s: 0.72, yaw: 130, pitch: -10, roll: 20 },
      { x: 0.0, y: 0.15, s: 0.70, yaw: 210, pitch: 25, roll: -10 },
      { x: 0.0, y: 0.08, s: 0.70, yaw: 360, pitch: 0, roll: 10 }
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
      const dive = Math.sin(t * Math.PI) * -0.15;

      const k0 = K[i];
      const k1 = K[i + 1];

      return {
        x: lerp(k0.x, k1.x, t),
        y: lerp(k0.y, k1.y, t) + dive,
        s: lerp(k0.s, k1.s, t) * (1 + Math.sin(t * Math.PI) * 0.08),
        yaw: lerpAngle(k0.yaw, k1.yaw, t),
        pitch: lerp(k0.pitch, k1.pitch, t),
        roll: lerp(k0.roll, k1.roll, t)
      };
    }

    const clock = new THREE.Clock();
    const cur = { x: 0.0, y: -0.05, s: 1.05, yaw: 45, pitch: -15, roll: 25 };
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
      const hover = Math.sin(t * 1.8) * 0.04 + Math.cos(t * 2.5) * 0.015;

      flight.position.set(
        cur.x * halfW + mouse.sx * 0.15,
        cur.y * halfH + hover * halfH * 0.45 + mouse.sy * 0.1,
        Math.sin(t * 0.8) * 0.12
      );

      flight.scale.setScalar(halfH * 2 * 0.38 * cur.s);

      // Smooth tumble and gentle continuous spin of the capsule
      capsuleRoot.rotation.x = ((cur.pitch + mouse.sy * 15) * Math.PI) / 180 + Math.sin(t * 1.2) * 0.08;
      capsuleRoot.rotation.y = ((cur.yaw + mouse.sx * 20) * Math.PI) / 180 + t * 0.35;
      capsuleRoot.rotation.z = ((cur.roll) * Math.PI) / 180 + Math.cos(t * 1.5) * 0.08;

      // Orbiting halo rings rotate dynamically
      ring1.rotation.z = t * 0.65;
      ring2.rotation.y = t * -0.5;

      // Particles float slowly
      particles.rotation.y = t * 0.15;

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
    <div ref={containerRef} className="relative z-0 text-white selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* 3D CAPSULE CANVAS OVERLAY */}
      <canvas
        ref={canvasRef}
        id="bee"
        className="fixed inset-0 z-20 w-full h-full pointer-events-none opacity-0 transition-opacity duration-1000 [&.ready]:opacity-100"
      />

      {/* STORY HERO SECTION */}
      <section className="story-section hero min-h-screen relative overflow-visible z-10 flex flex-col justify-between p-6 sm:p-12" id="top">
        {/* Top Header Badge */}
        <div className="pt-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-400">
              MedSure 3D Experience
            </span>
          </div>

          <button
            onClick={onOpenApp}
            className="px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <span>Skip to Clinical App</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Central Eye-Catching Title */}
        <div className="text-center max-w-4xl mx-auto my-auto py-12 space-y-4 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-emerald-500/30 text-xs text-emerald-300 font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive 3D Medicine Integrity Engine</span>
          </div>

          <h1
            data-speed="0.45"
            className="font-extrabold text-[clamp(42px,6.5vw,96px)] leading-[1.04] tracking-tight text-white drop-shadow-[0_4px_30px_rgba(0,0,0,0.8)]"
          >
            Imagine Medicine Safety<br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Built Just Like This.
            </span>
          </h1>

          <p className="text-slate-100 text-[clamp(16px,1.4vw,20px)] leading-relaxed max-w-2xl mx-auto font-medium drop-shadow-md">
            Photograph any Nigerian medicine pack to verify safety, understand active ingredients in plain language, and prevent crisis panic at home.
          </p>

          <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenApp}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-sm sm:text-base shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all flex items-center gap-3 cursor-pointer group"
            >
              <Pill className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Launch Live Scanner &rarr;</span>
            </button>
          </div>
        </div>

        {/* Bottom Scroll Cue */}
        <div className="text-center text-xs text-slate-400 pb-2 z-10">
          <span className="animate-bounce inline-block">&darr; Scroll down to explore the 3D safety story &darr;</span>
        </div>
      </section>

      {/* SECTION 01: PLAIN LANGUAGE ACTIVE INGREDIENTS */}
      <section className="story-section s1 min-h-screen relative overflow-hidden z-[2] flex items-center px-6 sm:px-12 lg:px-20" id="about">
        <div className="num reveal text-purple-400/20 font-black text-[clamp(120px,18vw,260px)] absolute left-[4vw] top-[30vh] leading-none tracking-tighter select-none pointer-events-none">
          01
        </div>

        <div className="relative z-10 max-w-xl ml-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300 font-bold uppercase tracking-wider">
              Pillar 1 • Transparent Chemistry
            </div>

            <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white leading-[1.12] tracking-tight">
              Demystify What Every Active Component Does
            </h2>

            <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-normal">
              Every blister pack contains active chemicals that relieve pain, kill parasites, or open restricted airways. MedSure translates complex pharmacological jargon into everyday, plain language.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-slate-200">
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Salbutamol:</strong> Relaxes and widens constricted bronchial tubes to allow oxygen in.</span>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Paracetamol:</strong> Blocks chemical messengers in the central nervous system that signal pain and fever.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 02: CODE GUARDRAILS */}
      <section className="story-section s2 min-h-screen relative overflow-hidden z-[3] flex items-center px-6 sm:px-12 lg:px-20" id="access">
        <div className="num reveal text-emerald-400/20 font-black text-[clamp(120px,18vw,260px)] absolute right-[4vw] top-[26vh] leading-none tracking-tighter select-none pointer-events-none">
          02
        </div>

        <div className="relative z-10 max-w-xl mr-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-xs text-emerald-300 font-bold uppercase tracking-wider">
              Pillar 2 • Zero Hallucination
            </div>

            <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white leading-[1.12] tracking-tight">
              Deterministic Code-Based Safety Guardrails
            </h2>

            <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-normal">
              AI only extracts text and translates. All clinical safety decisions are 100% deterministic code. We cross-reference against 43 Nigerian Essential Medicines, official NAFDAC regex standards, and 14 cross-drug interaction rules.
            </p>

            <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>If an expiry date has passed or a NAFDAC number is suspect, dosage instructions are halted immediately.</span>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenApp}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg transition-all inline-flex items-center gap-2 cursor-pointer"
              >
                <span>Test Code Guardrails Live &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 03: MULTILINGUAL VOICE & PHARMACIST ESCALATION */}
      <section className="story-section s3 min-h-screen relative overflow-hidden z-[1] flex items-center px-6 sm:px-12 lg:px-20">
        <div className="num reveal text-cyan-400/20 font-black text-[clamp(120px,18vw,260px)] absolute left-[4vw] top-[28vh] leading-none tracking-tighter select-none pointer-events-none">
          03
        </div>

        <div className="relative z-10 max-w-xl ml-auto">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-xs text-cyan-300 font-bold uppercase tracking-wider">
              Pillar 3 • Inclusive &amp; Clinician-Backed
            </div>

            <h2 className="text-[clamp(28px,3.5vw,48px)] font-extrabold text-white leading-[1.12] tracking-tight">
              Multilingual Voice Notes &amp; Pharmacist Escalation
            </h2>

            <p className="text-slate-100 text-base sm:text-lg leading-relaxed font-normal">
              Built for every Nigerian household regardless of literacy. Listen to spoken safety instructions in English, Nigerian Pidgin, Yorùbá, Hausa, or Igbo. Flagged packages route straight to our licensed Pharmacist Review Portal.
            </p>

            <div className="flex flex-wrap gap-2 pt-1 text-xs">
              {['🇬🇧 English', '🇳🇬 Naija Pidgin', '🇳🇬 Yorùbá', '🇳🇬 Hausa', '🇳🇬 Igbo'].map((lang) => (
                <span key={lang} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 font-semibold">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CALL TO ACTION */}
      <section className="story-section foot min-h-screen relative overflow-hidden z-[1] flex flex-col justify-between p-6 sm:p-12" id="contact">
        <div className="my-auto text-center max-w-2xl mx-auto space-y-6 z-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
            <Pill className="w-7 h-7 text-emerald-400" />
          </div>

          <h2 className="text-[clamp(32px,4.5vw,64px)] font-extrabold text-white leading-tight">
            Ready to Protect Your Family?
          </h2>

          <p className="text-slate-200 text-base sm:text-lg max-w-lg mx-auto font-normal">
            Take a photo of any medicine pack, test our cross-drug cabinet interactions, or test-drive the clinician review queue now.
          </p>

          <div className="pt-4">
            <button
              onClick={onOpenApp}
              className="px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base shadow-[0_0_50px_rgba(16,185,129,0.45)] transition-all inline-flex items-center gap-3 cursor-pointer"
            >
              <span>Launch Live MedSure App &rarr;</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between border-t border-slate-800/80 pt-6 gap-4 z-10 text-xs text-slate-400">
          <div>
            <strong className="text-base font-bold text-white block">MedSure Nigeria</strong>
            <span>AI Vision • Deterministic Code Guardrails • Multilingual Audio</span>
          </div>
          <div>
            <span>OPEN//BUILD Hackathon Prototype • 43 Nigerian Essential Medicines</span>
          </div>
        </div>
      </section>
    </div>
  );
}
