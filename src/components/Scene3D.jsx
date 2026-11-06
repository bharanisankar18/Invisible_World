import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";
import { OrbitControls as OrbitControlsImpl } from "three/examples/jsm/controls/OrbitControls.js";
import { useReducedMotion } from "framer-motion";

/*
 * No drei: its 3.8 MB pre-bundle failed to land in Vite's dev cache on Windows,
 * and we only needed orbit controls plus DOM labels. Both are small enough here.
 */
const OverlayContext = createContext(null);

function Controls({ autoRotate }) {
  const { camera, gl } = useThree();
  const controls = useMemo(() => new OrbitControlsImpl(camera, gl.domElement), [camera, gl]);
  useEffect(() => {
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minDistance = 2.5;
    controls.maxDistance = 8;
    controls.autoRotateSpeed = 0.6;
    return () => controls.dispose();
  }, [controls]);
  useEffect(() => {
    controls.autoRotate = autoRotate;
  }, [controls, autoRotate]);
  useFrame(() => controls.update());
  return null;
}

/* One hue (DESIGN.md): azure, a pale azure tint, and the muted slate. */
const AZURE = "#4DB2FF";
const PALE = "#A9D6FF";
const SLATE = "#9AA9C2";
const BG = "#071034";

/** A DOM label pinned to a 3D point: projected to screen space every frame. */
function Label({ position, children }) {
  const overlay = useContext(OverlayContext);
  const anchor = useRef();
  const el = useRef(null);
  const v = useMemo(() => new Vector3(), []);
  const { camera, size } = useThree();

  useEffect(() => {
    if (!overlay?.current) return;
    const span = document.createElement("span");
    span.className =
      "pointer-events-none absolute left-0 top-0 select-none whitespace-nowrap rounded-sm border border-line bg-bg px-1.5 py-0.5 font-mono text-[10px] text-muted";
    span.textContent = children;
    overlay.current.appendChild(span);
    el.current = span;
    return () => span.remove();
  }, [overlay, children]);

  useFrame(() => {
    const span = el.current;
    if (!span || !anchor.current) return;
    anchor.current.getWorldPosition(v);
    v.project(camera);
    const behind = v.z > 1;
    const x = (v.x * 0.5 + 0.5) * size.width;
    const y = (-v.y * 0.5 + 0.5) * size.height;
    span.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    span.style.opacity = behind ? "0" : "1";
  });

  return <group ref={anchor} position={position} />;
}

function Mat({ color = AZURE, glow = 0.15, ...rest }) {
  return <meshStandardMaterial color={color} emissive={color} emissiveIntensity={glow} roughness={0.55} {...rest} />;
}

function AtomModel() {
  const electrons = useRef();
  useFrame((_, dt) => {
    if (electrons.current) electrons.current.children.forEach((g, i) => (g.rotation.z += dt * (0.6 + i * 0.25)));
  });
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.26, 32, 32]} />
        <Mat glow={0.35} />
      </mesh>
      <group ref={electrons}>
        {[0, 1, 2].map((i) => (
          <group key={i} rotation={[i * 1.05, i * 0.6, 0]}>
            <mesh>
              <torusGeometry args={[1.25, 0.008, 8, 96]} />
              <meshBasicMaterial color={SLATE} transparent opacity={0.35} />
            </mesh>
            <mesh position={[1.25, 0, 0]}>
              <sphereGeometry args={[0.06, 12, 12]} />
              <Mat color={PALE} glow={0.6} />
            </mesh>
          </group>
        ))}
      </group>
      <Label position={[0, 0.5, 0]}>nucleus</Label>
    </group>
  );
}

function DnaModel() {
  const pairs = useMemo(() => Array.from({ length: 20 }, (_, i) => ({ y: i * 0.2 - 1.9, a: i * 0.5 })), []);
  return (
    <group>
      {pairs.map((p, i) => {
        const x1 = Math.cos(p.a) * 0.7;
        const z1 = Math.sin(p.a) * 0.7;
        return (
          <group key={i}>
            <mesh position={[x1, p.y, z1]}>
              <sphereGeometry args={[0.075, 12, 12]} />
              <Mat />
            </mesh>
            <mesh position={[-x1, p.y, -z1]}>
              <sphereGeometry args={[0.075, 12, 12]} />
              <Mat color={PALE} />
            </mesh>
            <mesh position={[0, p.y, 0]} rotation={[0, -p.a, Math.PI / 2]}>
              <cylinderGeometry args={[0.015, 0.015, 1.4, 6]} />
              <meshBasicMaterial color={SLATE} transparent opacity={0.4} />
            </mesh>
          </group>
        );
      })}
      <Label position={[1.05, 1.5, 0]}>base pair</Label>
    </group>
  );
}

function NeuronModel() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.42, 24, 24]} />
        <Mat />
      </mesh>
      <mesh position={[1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.05, 2.2, 4, 8]} />
        <Mat color={PALE} glow={0.1} />
      </mesh>
      {[-0.6, 0, 0.6].map((z) => (
        <mesh key={z} position={[-0.7, 0.4, z]} rotation={[0.4, 0, 0.8]}>
          <capsuleGeometry args={[0.03, 0.7, 4, 8]} />
          <Mat color={SLATE} glow={0.05} />
        </mesh>
      ))}
      <Label position={[0, 0.7, 0]}>soma</Label>
      <Label position={[2.0, 0.25, 0]}>axon</Label>
    </group>
  );
}

function VirusModel() {
  const spikes = useMemo(
    () =>
      Array.from({ length: 24 }, (_, i) => {
        const phi = Math.acos(-1 + (2 * (i + 0.5)) / 24);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        return [Math.sin(phi) * Math.cos(theta), Math.sin(phi) * Math.sin(theta), Math.cos(phi)].map((v) => v * 1.12);
      }),
    []
  );
  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={AZURE} wireframe transparent opacity={0.6} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.96, 0]} />
        <meshStandardMaterial color={AZURE} transparent opacity={0.12} />
      </mesh>
      {spikes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.055, 8, 8]} />
          <Mat color={PALE} glow={0.4} />
        </mesh>
      ))}
      <Label position={[0, 1.4, 0]}>capsid</Label>
    </group>
  );
}

function CellModel() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[1.4, 48, 48]} />
        <meshStandardMaterial color={AZURE} transparent opacity={0.08} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.4, 24, 16]} />
        <meshBasicMaterial color={AZURE} wireframe transparent opacity={0.08} />
      </mesh>
      <mesh position={[-0.2, 0.1, 0]}>
        <sphereGeometry args={[0.45, 24, 24]} />
        <Mat />
      </mesh>
      <mesh position={[0.6, -0.3, 0.4]} rotation={[0.5, 0.3, 0]}>
        <capsuleGeometry args={[0.11, 0.3, 4, 8]} />
        <Mat color={PALE} glow={0.1} />
      </mesh>
      <mesh position={[0.3, 0.6, -0.5]} rotation={[0.2, 0.8, 1]}>
        <capsuleGeometry args={[0.09, 0.25, 4, 8]} />
        <Mat color={PALE} glow={0.1} />
      </mesh>
      <Label position={[-0.2, 0.72, 0]}>nucleus</Label>
      <Label position={[0.9, -0.55, 0.4]}>mitochondrion</Label>
    </group>
  );
}

function BacteriaModel() {
  return (
    <group rotation={[0, 0, 0.3]}>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.42, 1.6, 8, 24]} />
        <meshStandardMaterial color={AZURE} transparent opacity={0.22} />
      </mesh>
      <mesh position={[-0.3, 0, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <Mat color={PALE} glow={0.2} />
      </mesh>
      <mesh position={[1.6, -0.1, 0]} rotation={[0, 0, -0.4]}>
        <torusGeometry args={[0.35, 0.012, 6, 32, Math.PI * 1.3]} />
        <meshBasicMaterial color={SLATE} />
      </mesh>
      <Label position={[-0.3, 0.6, 0]}>nucleoid</Label>
      <Label position={[1.9, 0.35, 0]}>flagellum</Label>
    </group>
  );
}

function MoleculeModel() {
  return (
    <group>
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <Mat />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[0.7 * s, 0.45, 0.2]}>
            <sphereGeometry args={[0.28, 16, 16]} />
            <Mat color={PALE} />
          </mesh>
          <mesh position={[0.35 * s, 0.125, 0.1]} rotation={[0, 0, 0.55 * s]}>
            <capsuleGeometry args={[0.03, 0.7, 4, 8]} />
            <meshStandardMaterial color={SLATE} transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
      <Label position={[0, -0.9, 0]}>O</Label>
      <Label position={[-0.7, 0.9, 0.2]}>H</Label>
      <Label position={[0.7, 0.9, 0.2]}>H</Label>
    </group>
  );
}

/** Dipole field: bar plus nested loops. Used for magnetism and electric fields. */
function FieldModel() {
  return (
    <group>
      <mesh>
        <boxGeometry args={[0.3, 1.0, 0.3]} />
        <Mat glow={0.25} />
      </mesh>
      {[0.55, 0.85, 1.2, 1.6].map((r, i) =>
        [-1, 1].map((s) => (
          <mesh key={`${i}${s}`} position={[r * s, 0, 0]} scale={[1, 1.6, 1]}>
            <torusGeometry args={[r, 0.007, 6, 96]} />
            <meshBasicMaterial color={i % 2 ? SLATE : AZURE} transparent opacity={0.55 - i * 0.1} />
          </mesh>
        ))
      )}
      <Label position={[0, 0.75, 0]}>N</Label>
      <Label position={[0, -0.75, 0]}>S</Label>
    </group>
  );
}

/** Travelling transverse wave. Used for EM, sound (as a pressure trace) and radiation. */
function WaveModel({ reduce }) {
  const ref = useRef();
  const N = 64;
  useFrame((state) => {
    if (!ref.current || reduce) return;
    const t = state.clock.elapsedTime;
    ref.current.children.forEach((m, i) => {
      const x = i / (N - 1);
      m.position.y = Math.sin(x * Math.PI * 4 - t * 2) * 0.6;
    });
  });
  return (
    <group>
      <group ref={ref}>
        {Array.from({ length: N }, (_, i) => {
          const x = i / (N - 1);
          return (
            <mesh key={i} position={[x * 4 - 2, Math.sin(x * Math.PI * 4) * 0.6, 0]}>
              <sphereGeometry args={[0.035, 8, 8]} />
              <Mat color={i % 8 === 0 ? PALE : AZURE} glow={0.4} />
            </mesh>
          );
        })}
      </group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 4.2, 4]} />
        <meshBasicMaterial color={SLATE} transparent opacity={0.4} />
      </mesh>
      <Label position={[0, 0.95, 0]}>wavelength λ</Label>
    </group>
  );
}

function NetworkModel() {
  const nodes = useMemo(() => {
    const pts = [];
    for (let i = 0; i < 14; i++) {
      const phi = Math.acos(-1 + (2 * (i + 0.5)) / 14);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      pts.push([Math.sin(phi) * Math.cos(theta) * 1.3, Math.cos(phi) * 1.1, Math.sin(phi) * Math.sin(theta) * 1.3]);
    }
    return pts;
  }, []);
  const edges = useMemo(() => {
    const e = [];
    nodes.forEach((a, i) =>
      nodes.forEach((b, j) => {
        if (j <= i) return;
        const d = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
        if (d < 1.15) e.push([a, b, d]);
      })
    );
    return e;
  }, [nodes]);
  return (
    <group>
      {nodes.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <Mat color={i % 3 ? AZURE : PALE} glow={0.3} />
        </mesh>
      ))}
      {edges.map(([a, b, d], i) => {
        const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2];
        return (
          // lookAt aims the group's +Z at `b`; the cylinder (Y-axis) is tipped onto Z.
          <group key={i} position={mid} onUpdate={(g) => g.lookAt(...b)}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.008, d, 4]} />
              <meshBasicMaterial color={SLATE} transparent opacity={0.4} />
            </mesh>
          </group>
        );
      })}
      <Label position={[0, 1.45, 0]}>neurons · synapses</Label>
    </group>
  );
}

const MODELS = {
  atom: AtomModel,
  electron: AtomModel,
  proton: AtomModel,
  neutron: AtomModel,
  dna: DnaModel,
  rna: DnaModel,
  neuron: NeuronModel,
  synapse: NeuronModel,
  virus: VirusModel,
  cell: CellModel,
  blood: CellModel,
  bacteria: BacteriaModel,
  microbe: BacteriaModel,
  molecule: MoleculeModel,
  protein: MoleculeModel,
  complex: MoleculeModel,
  magnet: FieldModel,
  efield: FieldModel,
  em: WaveModel,
  sound: WaveModel,
  radiation: WaveModel,
  signal: WaveModel,
  network: NetworkModel,
  talk: NetworkModel,
};

export default function Scene3D({ object }) {
  const reduce = useReducedMotion();
  const Model = MODELS[object?.viz] || AtomModel;
  const overlay = useRef(null);

  return (
    <div className="relative h-[min(70dvh,560px)] w-full overflow-hidden" style={{ background: BG }}>
      <OverlayContext.Provider value={overlay}>
        <Canvas camera={{ position: [0, 0, 4.4], fov: 45 }} dpr={[1, 2]}>
          <color attach="background" args={[BG]} />
          <fog attach="fog" args={[BG, 7, 16]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[3, 4, 2]} intensity={1.1} color="#E8EEF8" />
          <pointLight position={[-3, -2, 4]} intensity={0.4} color={AZURE} />
          <Model key={object?.id} reduce={reduce} />
          <Controls autoRotate={!reduce} />
        </Canvas>
      </OverlayContext.Provider>
      <div ref={overlay} className="pointer-events-none absolute inset-0" aria-hidden="true" />
    </div>
  );
}
