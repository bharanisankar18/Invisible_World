import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Float } from "@react-three/drei";

function Rotator({ children, speed = 0.15 }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * speed;
  });
  return <group ref={ref}>{children}</group>;
}

function AtomModel() {
  return (
    <Rotator>
      <mesh>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.4} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[i * 0.7, i * 0.9, 0]}>
          <torusGeometry args={[1.2 + i * 0.15, 0.015, 8, 64]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.4} />
        </mesh>
      ))}
      {/* Electron dots on orbits */}
      {[0, 1, 2].map((i) => (
        <Float key={`e${i}`} speed={2 + i} rotationIntensity={0}>
          <mesh position={[Math.cos(i * 2.1) * (1.2 + i * 0.15), Math.sin(i * 2.1) * 0.4, Math.sin(i * 2.1) * (1.2 + i * 0.15)]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.8} />
          </mesh>
        </Float>
      ))}
      <Html position={[0, 0.55, 0]} className="pointer-events-none">
        <span className="font-mono text-[10px] text-accent/80 bg-bg-deep/70 px-1.5 py-0.5 rounded">nucleus</span>
      </Html>
    </Rotator>
  );
}

function DnaModel() {
  const pairs = useMemo(
    () =>
      Array.from({ length: 18 }).map((_, i) => {
        const y = i * 0.22 - 2;
        const a = i * 0.45;
        return { y, a };
      }),
    []
  );
  return (
    <Rotator speed={0.2}>
      {pairs.map((p, i) => {
        const x1 = Math.cos(p.a) * 0.7;
        const z1 = Math.sin(p.a) * 0.7;
        const x2 = Math.cos(p.a + Math.PI) * 0.7;
        const z2 = Math.sin(p.a + Math.PI) * 0.7;
        return (
          <group key={i}>
            <mesh position={[x1, p.y, z1]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.3} />
            </mesh>
            <mesh position={[x2, p.y, z2]}>
              <sphereGeometry args={[0.08, 12, 12]} />
              <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.3} />
            </mesh>
          </group>
        );
      })}
      <Html position={[0.9, 1.6, 0]}>
        <span className="font-mono text-[10px] text-accent/80 bg-bg-deep/70 px-1.5 py-0.5 rounded">base pair</span>
      </Html>
    </Rotator>
  );
}

function NeuronModel() {
  return (
    <Rotator speed={0.08}>
      <mesh>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.2} roughness={0.4} />
      </mesh>
      <mesh position={[1.4, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.06, 2.2, 4, 8]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={0.15} />
      </mesh>
      {[-0.6, 0, 0.6].map((z) => (
        <mesh key={z} position={[-0.7, 0.4, z]} rotation={[0.4, 0, 0.8]}>
          <capsuleGeometry args={[0.03, 0.7, 4, 8]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.2} />
        </mesh>
      ))}
      <Html position={[0, 0.7, 0]}>
        <span className="font-mono text-[10px] text-accent/80 bg-bg-deep/70 px-1.5 py-0.5 rounded">soma</span>
      </Html>
    </Rotator>
  );
}

function VirusModel() {
  return (
    <Rotator>
      <mesh>
        <icosahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#060b18" emissive="#a78bfa" emissiveIntensity={0.2} wireframe />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.85, 0]} />
        <meshStandardMaterial color="#a78bfa" transparent opacity={0.15} />
      </mesh>
      {/* Spike proteins */}
      {Array.from({ length: 12 }).map((_, i) => {
        const phi = Math.acos(-1 + (2 * i) / 12);
        const theta = Math.sqrt(12 * Math.PI) * phi;
        const x = Math.sin(phi) * Math.cos(theta) * 1.15;
        const y = Math.sin(phi) * Math.sin(theta) * 1.15;
        const z = Math.cos(phi) * 1.15;
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.5} />
          </mesh>
        );
      })}
      <Html position={[0, 1.3, 0]}>
        <span className="font-mono text-[10px] text-accent/80 bg-bg-deep/70 px-1.5 py-0.5 rounded">capsid</span>
      </Html>
    </Rotator>
  );
}

function CellModel() {
  return (
    <Rotator speed={0.1}>
      <mesh>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshStandardMaterial color="#38bdf8" transparent opacity={0.08} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.38, 32, 32]} />
        <meshStandardMaterial color="#38bdf8" wireframe transparent opacity={0.05} />
      </mesh>
      <mesh position={[-0.2, 0.1, 0]}>
        <sphereGeometry args={[0.45, 24, 24]} />
        <meshStandardMaterial color="#818cf8" emissive="#818cf8" emissiveIntensity={0.2} />
      </mesh>
      {/* Mitochondria */}
      <mesh position={[0.6, -0.3, 0.4]} rotation={[0.5, 0.3, 0]}>
        <capsuleGeometry args={[0.12, 0.3, 4, 8]} />
        <meshStandardMaterial color="#34d399" emissive="#34d399" emissiveIntensity={0.15} />
      </mesh>
      <Html position={[-0.2, 0.7, 0]}>
        <span className="font-mono text-[10px] text-accent/80 bg-bg-deep/70 px-1.5 py-0.5 rounded">nucleus</span>
      </Html>
    </Rotator>
  );
}

function MoleculeModel() {
  return (
    <Rotator>
      <mesh position={[0, -0.2, 0]}>
        <sphereGeometry args={[0.5, 24, 24]} />
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[-0.7, 0.45, 0.2]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.15} />
      </mesh>
      <mesh position={[0.7, 0.45, 0.2]}>
        <sphereGeometry args={[0.28, 16, 16]} />
        <meshStandardMaterial color="#a78bfa" emissive="#a78bfa" emissiveIntensity={0.15} />
      </mesh>
      {/* Bonds */}
      <mesh position={[-0.35, 0.125, 0.1]} rotation={[0, 0, 0.55]}>
        <capsuleGeometry args={[0.03, 0.7, 4, 8]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.4} />
      </mesh>
      <mesh position={[0.35, 0.125, 0.1]} rotation={[0, 0, -0.55]}>
        <capsuleGeometry args={[0.03, 0.7, 4, 8]} />
        <meshStandardMaterial color="#94a3b8" transparent opacity={0.4} />
      </mesh>
    </Rotator>
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
  "human-cell": CellModel,
  "eukaryotic-cell": CellModel,
  blood: CellModel,
  molecule: MoleculeModel,
  protein: MoleculeModel,
};

export default function Scene3D({ object }) {
  const key = object?.viz || object?.id || "atom";
  const Model = MODELS[key] || MODELS[object?.id] || AtomModel;

  return (
    <div className="h-[min(70dvh,560px)] w-full rounded-2xl overflow-hidden" style={{ background: "#030712" }}>
      <Canvas camera={{ position: [0, 0, 4.2], fov: 45 }}>
        <color attach="background" args={["#030712"]} />
        <fog attach="fog" args={["#030712", 8, 18]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} color="#e2e8f0" />
        <pointLight position={[-3, -2, 4]} intensity={0.3} color="#38bdf8" />
        <pointLight position={[2, -3, -3]} intensity={0.2} color="#a78bfa" />
        <Model />
        <OrbitControls enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
