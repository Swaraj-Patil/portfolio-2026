import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

/* Real-WebGL replacements for the three Hello facet boxes. One shared component;
   `kind` picks the object + accent. Idle spin is OrbitControls.autoRotate (camera
   orbit) ONLY — never a second group rotation — so dragging never fights the spin.
   useFrame is reserved for internal motion (edge pulse / helix shimmer). */

const ACCENTS = { ai: "#6d28e8", fs: "#14b8a6", re: "#f59e0b" };

// cylinder spanning a→b: unit-height cylinder (along +Y) positioned at the midpoint,
// rotated to the a→b direction, then scaled on Y to the segment length.
function tube(a, b) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const mid = new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize()
  );
  return { position: mid.toArray(), quaternion: [quat.x, quat.y, quat.z, quat.w], len, mid };
}

function Lights({ accent }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 5]} intensity={1.25} />
      <directionalLight position={[-5, 1, 2]} intensity={0.45} />
      <directionalLight position={[0, 2, -6]} intensity={0.9} color={accent} />
    </>
  );
}

/* ai — faceted crystalline "model core": a glossy low-poly icosahedron lit in the
   accent, wrapped in a wireframe shell. Internal motion is an emissive + scale
   "breath"; the rotation you see is the camera orbit, never a group spin. */
function FacetedCore({ accent, reduce }) {
  const coreMat = useRef(null);
  const shell = useRef(null);

  useFrame((state) => {
    if (reduce) return;
    const b = 0.5 + 0.5 * Math.sin(state.clock.getElapsedTime() * 1.4);
    if (coreMat.current) coreMat.current.emissiveIntensity = 0.22 + b * 0.5;
    if (shell.current) shell.current.scale.setScalar(1 + b * 0.05);
  });

  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[1.15, 0]} />
        <meshStandardMaterial ref={coreMat} color="#f1eeff" metalness={0.4} roughness={0.18} flatShading emissive={accent} emissiveIntensity={0.24} />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color={accent} wireframe transparent opacity={0.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* fs — floating 3x3 grid of stacked rounded-cube columns: white center, teal edges,
   blue corners (the "stack" of a full stack). No internal motion; it just orbits. */
function ColumnGrid() {
  const { cols, gap, baseY } = useMemo(() => {
    const SP = 0.74, gap = 0.3, cols = [];
    for (let gx = -1; gx <= 1; gx++) {
      for (let gz = -1; gz <= 1; gz++) {
        const center = gx === 0 && gz === 0;
        const corner = gx !== 0 && gz !== 0;
        cols.push({
          x: gx * SP, z: gz * SP,
          n: center ? 3 : 4,
          color: center ? "#eef0f3" : corner ? "#2f6df6" : "#14b8a6",
        });
      }
    }
    return { cols, gap, baseY: -((4 - 1) * gap) / 2 };
  }, []);

  return (
    <group position={[0, baseY, 0]}>
      {cols.map((c, ci) =>
        Array.from({ length: c.n }).map((_, i) => (
          <RoundedBox key={`${ci}-${i}`} args={[0.58, 0.24, 0.58]} radius={0.06} smoothness={4} position={[c.x, i * gap, c.z]}>
            <meshStandardMaterial color={c.color} metalness={0.35} roughness={0.28} emissive={c.color} emissiveIntensity={0.08} />
          </RoundedBox>
        ))
      )}
    </group>
  );
}

/* re — DNA double helix: two opposed strands of small spheres winding up Y, with
   rungs every other step; an emissive shimmer travels up the rungs. */
function Helix({ accent, reduce }) {
  const { strand, rungs } = useMemo(() => {
    const N = 14, turns = 2.4, R = 0.62, H = 2.4;
    const strand = [];
    const rungs = [];
    for (let i = 0; i < N; i++) {
      const f = i / (N - 1);
      const ang = f * turns * Math.PI * 2;
      const y = (f - 0.5) * H;
      const a = new THREE.Vector3(Math.cos(ang) * R, y, Math.sin(ang) * R);
      const b = new THREE.Vector3(Math.cos(ang + Math.PI) * R, y, Math.sin(ang + Math.PI) * R);
      strand.push(a.toArray(), b.toArray());
      if (i % 2 === 0) rungs.push({ ...tube(a, b), yf: f });
    }
    return { strand, rungs };
  }, []);

  const beadGeo = useMemo(() => new THREE.SphereGeometry(0.12, 16, 16), []);
  const rungGeo = useMemo(() => new THREE.CylinderGeometry(0.022, 0.022, 1, 6), []);
  const rungMats = useRef([]);

  useFrame((state) => {
    if (reduce) return;
    const t = state.clock.getElapsedTime();
    for (let i = 0; i < rungs.length; i++) {
      const m = rungMats.current[i];
      if (!m) continue;
      const k = 0.5 + 0.5 * Math.sin(rungs[i].yf * Math.PI * 2 * 1.5 - t * 2.2);
      m.emissiveIntensity = 0.14 + k * 0.7;
    }
  });

  return (
    <group>
      {strand.map((p, i) => (
        <mesh key={i} geometry={beadGeo} position={p}>
          <meshStandardMaterial color="#f4f4f7" metalness={0.4} roughness={0.24} emissive={accent} emissiveIntensity={0.16} />
        </mesh>
      ))}
      {rungs.map((r, i) => (
        <mesh key={i} geometry={rungGeo} position={r.position} quaternion={r.quaternion} scale={[1, r.len, 1]}>
          <meshStandardMaterial
            ref={(m) => (rungMats.current[i] = m)}
            color="#ffffff" metalness={0.3} roughness={0.3}
            emissive={accent} emissiveIntensity={0.14} toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene({ kind, accent, reduce }) {
  if (kind === "fs") return <ColumnGrid />;
  if (kind === "re") return <Helix accent={accent} reduce={reduce} />;
  return <FacetedCore accent={accent} reduce={reduce} />;
}

export default function Facet3D({ kind }) {
  const wrap = useRef(null);
  const [inView, setInView] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [reduce, setReduce] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const accent = ACCENTS[kind] || ACCENTS.ai;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  useEffect(() => {
    const el = wrap.current;
    if (!el || !("IntersectionObserver" in window)) { setInView(true); return; }
    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: "80px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // off-screen → don't render at all; reduced-motion → render only on interaction; else continuous.
  const frameloop = !inView ? "never" : reduce ? "demand" : "always";

  return (
    <div className="facet-canvas" ref={wrap}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
        frameloop={frameloop}
        camera={{ position: [2.3, 1.45, 4.1], fov: 40 }}
        style={{ background: "transparent" }}
      >
        <Lights accent={accent} />
        <Scene kind={kind} accent={accent} reduce={reduce} />
        <OrbitControls
          makeDefault
          enableZoom={false}
          enablePan={false}
          autoRotate={!dragging && !reduce}
          autoRotateSpeed={1.2}
          onStart={() => setDragging(true)}
          onEnd={() => setTimeout(() => setDragging(false), 1500)}
        />
      </Canvas>
    </div>
  );
}
