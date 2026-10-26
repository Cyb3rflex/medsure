"use client";
import React, { useRef, useMemo, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";

export interface GlobeMarker {
  lat: number;
  lng: number;
  src: string;
  label?: string;
  size?: number;
  city?: string;
  country?: string;
  details?: string;
  tag?: string;
  language?: string;
}

export interface Globe3DConfig {
  radius?: number;
  globeColor?: string;
  textureUrl?: string;
  bumpMapUrl?: string;
  showAtmosphere?: boolean;
  atmosphereColor?: string;
  atmosphereIntensity?: number;
  atmosphereBlur?: number;
  bumpScale?: number;
  autoRotateSpeed?: number;
  enableZoom?: boolean;
  enablePan?: boolean;
  minDistance?: number;
  maxDistance?: number;
  initialRotation?: { x: number; y: number };
  markerSize?: number;
  showWireframe?: boolean;
  wireframeColor?: string;
  ambientIntensity?: number;
  pointLightIntensity?: number;
  backgroundColor?: string | null;
}

interface Globe3DProps {
  markers?: GlobeMarker[];
  config?: Globe3DConfig;
  className?: string;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

const DEFAULT_EARTH_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg";
const DEFAULT_BUMP_TEXTURE =
  "https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png";

function latLngToVector3(
  lat: number,
  lng: number,
  radius: number
): THREE.Vector3 {
  // Convert standard latitude / longitude to 3D spherical coordinates matching Earth texture
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

interface MarkerProps {
  marker: GlobeMarker;
  radius: number;
  defaultSize: number;
  onClick?: (marker: GlobeMarker) => void;
  onHover?: (marker: GlobeMarker | null) => void;
}

function Marker({
  marker,
  radius,
  defaultSize,
  onClick,
  onHover,
}: MarkerProps) {
  const [hovered, setHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  const surfacePosition = useMemo(() => {
    return latLngToVector3(marker.lat, marker.lng, radius * 1.002);
  }, [marker.lat, marker.lng, radius]);

  const topPosition = useMemo(() => {
    return latLngToVector3(marker.lat, marker.lng, radius * 1.14);
  }, [marker.lat, marker.lng, radius]);

  const lineHeight = topPosition.distanceTo(surfacePosition);

  useFrame(() => {
    if (!groupRef.current) return;
    const worldPos = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPos);

    // Front-facing occlusion test
    const markerDirection = worldPos.clone().normalize();
    const cameraDirection = camera.position.clone().normalize();
    const dot = markerDirection.dot(cameraDirection);

    setIsVisible(dot > -0.05);
  });

  const handlePointerEnter = useCallback((e?: any) => {
    e?.stopPropagation?.();
    setHovered(true);
    onHover?.(marker);
  }, [marker, onHover]);

  const handlePointerLeave = useCallback((e?: any) => {
    e?.stopPropagation?.();
    setHovered(false);
  }, []);

  const handleClick = useCallback((e?: any) => {
    e?.stopPropagation?.();
    setHovered(true);
    onClick?.(marker);
  }, [marker, onClick]);

  const { lineCenter, lineQuaternion } = useMemo(() => {
    const center = surfacePosition.clone().lerp(topPosition, 0.5);
    const direction = topPosition.clone().sub(surfacePosition).normalize();
    const quaternion = new THREE.Quaternion();
    quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);

    return { lineCenter: center, lineQuaternion: quaternion };
  }, [surfacePosition, topPosition]);

  return (
    <group ref={groupRef} visible={isVisible}>
      {/* 1. Generous Invisible Raycast Hitbox Sphere for effortless mobile tap and desktop click */}
      <mesh
        position={topPosition}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        onPointerDown={handleClick}
      >
        <sphereGeometry args={[0.16, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* 2. Pin Stem Line */}
      <mesh
        position={lineCenter}
        quaternion={lineQuaternion}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        onPointerDown={handleClick}
      >
        <cylinderGeometry args={[0.008, 0.008, lineHeight, 8]} />
        <meshBasicMaterial
          color={hovered ? "#34d399" : "#10b981"}
          transparent
          opacity={hovered ? 1.0 : 0.85}
        />
      </mesh>

      {/* 3. Surface Anchor Pin */}
      <mesh
        position={surfacePosition}
        quaternion={lineQuaternion}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        onPointerDown={handleClick}
      >
        <coneGeometry args={[0.035, 0.08, 8]} />
        <meshBasicMaterial color={hovered ? "#6ee7b7" : "#059669"} />
      </mesh>

      {/* 4. Glowing 3D Orb at the head */}
      <mesh
        position={topPosition}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        onPointerDown={handleClick}
      >
        <sphereGeometry args={[hovered ? 0.055 : 0.04, 16, 16]} />
        <meshBasicMaterial color={hovered ? "#6ee7b7" : "#10b981"} />
      </mesh>

      {/* 5. 2D Html Badge overlay */}
      <Html
        position={topPosition}
        center
        distanceFactor={9}
        zIndexRange={[100, 0]}
        style={{
          pointerEvents: isVisible ? "auto" : "none",
          opacity: isVisible ? 1 : 0,
          transition: "all 0.15s ease-out",
          transform: "translate3d(-50%, -50%, 0)",
        }}
      >
        <div
          className="cursor-pointer select-none group p-2 -m-2 touch-manipulation"
          onMouseEnter={handlePointerEnter}
          onMouseLeave={handlePointerLeave}
          onClick={handleClick}
          onTouchStart={handleClick}
          onPointerDown={handleClick}
        >
          <div
            className={cn(
              "relative overflow-hidden rounded-full bg-slate-950 shadow-2xl transition-all duration-200 border-2",
              hovered
                ? "scale-135 border-emerald-300 ring-4 ring-emerald-400/50 shadow-emerald-500/60"
                : "border-emerald-400/90 hover:border-emerald-300 hover:scale-120"
            )}
            style={{ width: "24px", height: "24px" }}
          >
            <img
              src={marker.src}
              alt={marker.city || "Marker"}
              className="h-full w-full object-cover pointer-events-none"
              draggable={false}
            />
            <span className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />
          </div>

          {/* Micro City Pill */}
          {marker.city && (
            <div
              className={cn(
                "absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-0.5 rounded-md text-[11px] font-bold whitespace-nowrap shadow-xl border pointer-events-none transition-all",
                hovered
                  ? "bg-slate-900 border-emerald-400 text-emerald-300 scale-105 z-50 opacity-100"
                  : "bg-slate-950/80 border-slate-700/60 text-slate-300 opacity-0 group-hover:opacity-100"
              )}
            >
              {marker.city}
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}

interface RotatingGlobeProps {
  config: Required<Globe3DConfig>;
  markers: GlobeMarker[];
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function RotatingGlobe({
  config,
  markers,
  onMarkerClick,
  onMarkerHover,
}: RotatingGlobeProps) {
  const groupRef = useRef<THREE.Group>(null);

  const [earthTexture, bumpTexture] = useTexture([
    config.textureUrl,
    config.bumpMapUrl,
  ]);

  useMemo(() => {
    if (earthTexture) {
      earthTexture.colorSpace = THREE.SRGBColorSpace;
      earthTexture.anisotropy = 4;
    }
    if (bumpTexture) {
      bumpTexture.anisotropy = 4;
    }
  }, [earthTexture, bumpTexture]);

  const geometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius, 48, 48);
  }, [config.radius]);

  const wireframeGeometry = useMemo(() => {
    return new THREE.SphereGeometry(config.radius * 1.002, 32, 16);
  }, [config.radius]);

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpTexture}
          bumpScale={config.bumpScale * 0.05}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>

      {config.showWireframe && (
        <mesh geometry={wireframeGeometry}>
          <meshBasicMaterial
            color={config.wireframeColor}
            wireframe
            transparent
            opacity={0.08}
          />
        </mesh>
      )}

      {markers.map((marker, index) => (
        <Marker
          key={`marker-${index}-${marker.lat}-${marker.lng}`}
          marker={marker}
          radius={config.radius}
          defaultSize={config.markerSize}
          onClick={onMarkerClick}
          onHover={onMarkerHover}
        />
      ))}
    </group>
  );
}

interface AtmosphereProps {
  radius: number;
  color: string;
  intensity: number;
  blur: number;
}

function Atmosphere({ radius, color, intensity, blur }: AtmosphereProps) {
  const fresnelPower = Math.max(0.5, 5 - blur);

  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        atmosphereColor: { value: new THREE.Color(color) },
        intensity: { value: intensity },
        fresnelPower: { value: fresnelPower },
      },
      vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 atmosphereColor;
        uniform float intensity;
        uniform float fresnelPower;
        varying vec3 vNormal;
        varying vec3 vPosition;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, normalize(-vPosition))), fresnelPower);
          gl_FragColor = vec4(atmosphereColor, fresnel * intensity);
        }
      `,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
  }, [color, intensity, fresnelPower]);

  return (
    <mesh scale={[1.12, 1.12, 1.12]}>
      <sphereGeometry args={[radius, 64, 32]} />
      <primitive object={atmosphereMaterial} attach="material" />
    </mesh>
  );
}

interface SceneProps {
  markers: GlobeMarker[];
  config: Required<Globe3DConfig>;
  onMarkerClick?: (marker: GlobeMarker) => void;
  onMarkerHover?: (marker: GlobeMarker | null) => void;
}

function Scene({ markers, config, onMarkerClick, onMarkerHover }: SceneProps) {
  const { camera } = useThree();

  React.useEffect(() => {
    camera.position.set(0, 0, config.radius * 3.0);
    camera.lookAt(0, 0, 0);
  }, [camera, config.radius]);

  return (
    <>
      <ambientLight intensity={config.ambientIntensity} />
      <directionalLight
        position={[config.radius * 5, config.radius * 2, config.radius * 5]}
        intensity={config.pointLightIntensity}
        color="#ffffff"
      />
      <directionalLight
        position={[-config.radius * 3, config.radius, -config.radius * 2]}
        intensity={config.pointLightIntensity * 0.3}
        color="#88ccff"
      />

      <RotatingGlobe
        config={config}
        markers={markers}
        onMarkerClick={onMarkerClick}
        onMarkerHover={onMarkerHover}
      />

      {config.showAtmosphere && (
        <Atmosphere
          radius={config.radius}
          color={config.atmosphereColor}
          intensity={config.atmosphereIntensity}
          blur={config.atmosphereBlur}
        />
      )}

      <OrbitControls
        makeDefault
        enablePan={config.enablePan}
        enableZoom={config.enableZoom}
        minDistance={config.minDistance}
        maxDistance={config.maxDistance}
        rotateSpeed={0.4}
        autoRotate={config.autoRotateSpeed > 0}
        autoRotateSpeed={config.autoRotateSpeed}
        enableDamping
        dampingFactor={0.1}
      />
    </>
  );
}

function LoadingFallback() {
  return (
    <Html center>
      <div className="flex shrink-0 flex-col items-center gap-3">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-400 border-t-transparent" />
        <span className="inline-block shrink-0 text-xs text-emerald-400/80 font-mono">
          Loading 3D Health Globe...
        </span>
      </div>
    </Html>
  );
}

const defaultConfig: Required<Globe3DConfig> = {
  radius: 2.35,
  globeColor: "#090d16",
  textureUrl: DEFAULT_EARTH_TEXTURE,
  bumpMapUrl: DEFAULT_BUMP_TEXTURE,
  showAtmosphere: true,
  atmosphereColor: "#10b981",
  atmosphereIntensity: 0.75,
  atmosphereBlur: 2,
  bumpScale: 1.8,
  autoRotateSpeed: 0.85,
  enableZoom: false,
  enablePan: false,
  minDistance: 5,
  maxDistance: 15,
  initialRotation: { x: 0, y: 0 },
  markerSize: 0.07,
  showWireframe: false,
  wireframeColor: "#34d399",
  ambientIntensity: 0.75,
  pointLightIntensity: 1.8,
  backgroundColor: null,
};

export function Globe3D({
  markers = [],
  config = {},
  className,
  onMarkerClick,
  onMarkerHover,
}: Globe3DProps) {
  const mergedConfig = useMemo(
    () => ({ ...defaultConfig, ...config }),
    [config]
  );

  return (
    <div className={cn("relative w-full h-[380px] sm:h-[480px] md:h-[600px]", className)}>
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, 0, mergedConfig.radius * 3.4],
        }}
        style={{
          background: mergedConfig.backgroundColor || "transparent",
          pointerEvents: "auto",
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene
            markers={markers}
            config={mergedConfig}
            onMarkerClick={onMarkerClick}
            onMarkerHover={onMarkerHover}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default Globe3D;
