import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three/examples/jsm/controls/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { configuration, orbitals, shellCounts } from "../../data/elements.js";
import { cloudExtent, sampleOrbital } from "../../lib/orbitals.js";

/* Charge colours: the same hues the rest of the site uses for these particles. */
export const PROTON = "#FF5D73";
export const NEUTRON = "#D5DCF2";
export const ELECTRON = "#4FE3FF";
const RING = "#AEBBE6";

/* Orbital colours by type, with a second shade for the opposite wave phase. */
export const CLOUD = {
  s: ["#4FE3FF", "#3D6BFF"],
  p: ["#FFC23D", "#FF6A3D"],
  d: ["#9BFF5C", "#34C46A"],
};

const NUCLEON_R = 0.3;
const POINTS_PER_ELECTRON = 5200;
export const ringRadius = (n) => 1.3 + (n - 1) * 0.9;

/* ── Shared helpers ─────────────────────────────────────────── */

let glowTexture = null;
function getGlow() {
  if (glowTexture) return glowTexture;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.18, "rgba(255,255,255,0.6)");
  grd.addColorStop(0.45, "rgba(255,255,255,0.14)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  glowTexture = new THREE.CanvasTexture(c);
  glowTexture.colorSpace = THREE.SRGBColorSpace;
  return glowTexture;
}

const glowMaterial = (color, opacity = 1) =>
  new THREE.SpriteMaterial({
    map: getGlow(),
    color,
    opacity,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
  });

const OverlayContext = createContext(null);

/** A DOM label pinned to a 3D point, re-projected every frame. */
function Label({ position, show = true, children }) {
  const overlay = useContext(OverlayContext);
  const anchor = useRef();
  const el = useRef(null);
  const v = useMemo(() => new THREE.Vector3(), []);
  const { camera, size } = useThree();

  useEffect(() => {
    if (!overlay?.current) return;
    const span = document.createElement("span");
    span.className =
      "pointer-events-none absolute left-0 top-0 select-none whitespace-nowrap rounded-full bg-[#071034]/85 px-3 py-1 text-[13px] text-ink shadow-[0_0_0_1px_rgba(174,187,230,0.25)] transition-opacity duration-300";
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
    const x = (v.x * 0.5 + 0.5) * size.width;
    const y = (-v.y * 0.5 + 0.5) * size.height;
    span.style.transform = `translate(-50%, -100%) translate(${x}px, ${y - 6}px)`;
    span.style.opacity = show && v.z < 1 ? "1" : "0";
  });

  return <group ref={anchor} position={position} />;
}

/** The stage gradient, drawn by WebGL so additive glows never punch holes in a transparent canvas. */
function Backdrop() {
  const { scene } = useThree();
  useEffect(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(256, 230, 0, 256, 256, 380);
    grd.addColorStop(0, "#162b7e");
    grd.addColorStop(0.42, "#0c1b58");
    grd.addColorStop(1, "#060d2c");
    g.fillStyle = grd;
    g.fillRect(0, 0, 512, 512);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    scene.background = tex;
    return () => {
      scene.background = null;
      tex.dispose();
    };
  }, [scene]);
  return null;
}

function Environment() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const tex = pmrem.fromScene(room, 0.04).texture;
    scene.environment = tex;
    scene.environmentIntensity = 0.38;
    return () => {
      scene.environment = null;
      tex.dispose();
      pmrem.dispose();
      room.dispose?.();
    };
  }, [gl, scene]);
  return null;
}

/* ── Nucleus ────────────────────────────────────────────────── */

/** Close-packs A nucleons: the A lattice sites of an fcc grid nearest the centre. */
export function packNucleons(a) {
  const s = 0.58 / Math.SQRT2;
  const R = Math.ceil(Math.cbrt(a)) + 2;
  const pts = [];
  for (let i = -R; i <= R; i++)
    for (let j = -R; j <= R; j++)
      for (let k = -R; k <= R; k++) {
        if ((i + j + k) & 1) continue;
        pts.push([i * s + 0.021, j * s + 0.013, k * s + 0.007]);
      }
  pts.sort((p, q) => p[0] ** 2 + p[1] ** 2 + p[2] ** 2 - (q[0] ** 2 + q[1] ** 2 + q[2] ** 2));
  const chosen = pts.slice(0, Math.max(a, 1));
  const c = [0, 1, 2].map((d) => chosen.reduce((sum, p) => sum + p[d], 0) / chosen.length);
  const points = chosen.map((p) => [p[0] - c[0], p[1] - c[1], p[2] - c[2]]);
  const radius = Math.max(...points.map((p) => Math.hypot(p[0], p[1], p[2]))) + NUCLEON_R;
  return { points, radius };
}

function Nucleus({ z, pack, view, trueScale, reduce }) {
  const group = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const meshes = useMemo(() => {
    const geo = new THREE.SphereGeometry(NUCLEON_R, 40, 28);
    const pMat = new THREE.MeshPhysicalMaterial({
      color: PROTON,
      roughness: 0.34,
      clearcoat: 0.7,
      clearcoatRoughness: 0.16,
      emissive: PROTON,
      emissiveIntensity: 0.2,
    });
    const nMat = new THREE.MeshPhysicalMaterial({
      color: NEUTRON,
      roughness: 0.36,
      clearcoat: 0.8,
      clearcoatRoughness: 0.18,
      emissive: "#7C8CC0",
      emissiveIntensity: 0.08,
    });
    const p = new THREE.InstancedMesh(geo, pMat, 100);
    const n = new THREE.InstancedMesh(geo, nMat, 100);
    p.frustumCulled = n.frustumCulled = false;
    p.count = n.count = 0;
    return { geo, p, n };
  }, []);

  useEffect(
    () => () => {
      meshes.geo.dispose();
      meshes.p.material.dispose();
      meshes.n.material.dispose();
    },
    [meshes]
  );

  // Spread protons evenly through the packing, centre to surface.
  const layout = useMemo(() => {
    const a = pack.points.length;
    const P = [];
    const N = [];
    pack.points.forEach((p, i) => {
      const isProton = Math.floor(((i + 1) * z) / a) > Math.floor((i * z) / a);
      (isProton ? P : N).push({ p, i });
    });
    return { P, N };
  }, [pack, z]);

  const time = useRef(0);
  useFrame((_, dt) => {
    const g = group.current;
    if (!g) return;
    if (!reduce) time.current += dt;
    const t = time.current;
    const target =
      view === "nucleus"
        ? 1
        : view === "shells"
          ? trueScale
            ? 0.00012
            : Math.min(1.1, 0.5 / pack.radius)
          : Math.min(0.5, 0.17 / pack.radius);
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, target, 4.5, dt));
    const amp = view === "nucleus" && !reduce ? 0.028 : 0;
    const write = (mesh, list) => {
      list.forEach(({ p, i }, k) => {
        dummy.position.set(
          p[0] + amp * Math.sin(t * 3.3 + i * 1.7),
          p[1] + amp * Math.sin(t * 2.9 + i * 2.3),
          p[2] + amp * Math.sin(t * 3.7 + i * 0.9)
        );
        dummy.updateMatrix();
        mesh.setMatrixAt(k, dummy.matrix);
      });
      mesh.count = list.length;
      mesh.instanceMatrix.needsUpdate = true;
    };
    write(meshes.p, layout.P);
    write(meshes.n, layout.N);
  });

  return (
    <group ref={group} scale={0.0001}>
      <primitive object={meshes.p} />
      <primitive object={meshes.n} />
    </group>
  );
}

/* ── Shells (Bohr picture) ──────────────────────────────────── */

function trailGeometry(r) {
  const L = Math.min(1.1, 1.6 / r);
  class Arc extends THREE.Curve {
    getPoint(u, target = new THREE.Vector3()) {
      const phi = L * (1 - u);
      return target.set(r * Math.cos(phi), 0, r * Math.sin(phi));
    }
  }
  const T = 48;
  const RS = 6;
  const g = new THREE.TubeGeometry(new Arc(), T, 0.022, RS, false);
  const n = g.attributes.position.count;
  const colors = new Float32Array(n * 3);
  const c = new THREE.Color(ELECTRON);
  for (let v = 0; v < n; v++) {
    const k = Math.pow(Math.floor(v / (RS + 1)) / T, 1.8);
    colors[v * 3] = c.r * k;
    colors[v * 3 + 1] = c.g * k;
    colors[v * 3 + 2] = c.b * k;
  }
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  return g;
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const PHOTON_DOTS = 30;

function Shells({ counts, visible, reduce, exciteToken, photonHex, onEmit }) {
  const maxN = counts.length;
  const group = useRef();
  const time = useRef(0);
  const groups = useRef([]);
  const heads = useRef([]);
  const trails = useRef([]);
  const halos = useRef([]);
  const ghost = useRef();
  const photon = useRef();
  const ex = useRef({ active: false });
  const ph = useRef({ active: false });

  const shared = useMemo(
    () => ({
      eGeo: new THREE.SphereGeometry(0.085, 24, 16),
      eMat: new THREE.MeshStandardMaterial({
        color: "#C9F7FF",
        emissive: ELECTRON,
        emissiveIntensity: 1.3,
        toneMapped: false,
      }),
      trailMat: new THREE.MeshBasicMaterial({
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      }),
      halo: glowMaterial(ELECTRON, 0.85),
      ring: new THREE.MeshBasicMaterial({ color: RING, transparent: true, opacity: 0.32, depthWrite: false }),
    }),
    []
  );

  const trailsByShell = useMemo(() => Array.from({ length: 5 }, (_, i) => trailGeometry(ringRadius(i + 1))), []);
  const ringGeos = useMemo(
    () => Array.from({ length: 5 }, (_, i) => new THREE.TorusGeometry(ringRadius(i + 1), 0.007, 8, 220)),
    []
  );

  const ghostLine = useMemo(() => {
    const pts = Array.from({ length: 161 }, (_, i) => {
      const a = (i / 160) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a), 0, Math.sin(a));
    });
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineDashedMaterial({ color: "#FFFFFF", dashSize: 0.035, gapSize: 0.03, transparent: true, opacity: 0 })
    );
    line.computeLineDistances();
    return line;
  }, []);

  const photonMats = useMemo(
    () => Array.from({ length: PHOTON_DOTS }, () => glowMaterial("#FFFFFF", 0)),
    []
  );

  useEffect(
    () => () => {
      Object.values(shared).forEach((m) => m.dispose?.());
      trailsByShell.forEach((g) => g.dispose());
      ringGeos.forEach((g) => g.dispose());
      ghostLine.geometry.dispose();
      ghostLine.material.dispose();
      photonMats.forEach((m) => m.dispose());
    },
    [shared, trailsByShell, ringGeos, ghostLine, photonMats]
  );

  useEffect(() => {
    photonMats.forEach((m) => m.color.set(photonHex));
  }, [photonHex, photonMats]);

  // Start a jump each time the token changes (never on mount).
  const lastToken = useRef(exciteToken);
  useEffect(() => {
    if (exciteToken === lastToken.current) return;
    lastToken.current = exciteToken;
    if (!maxN) return;
    ex.current = { active: true, start: null, shell: maxN - 1, emitted: false };
  }, [exciteToken, maxN]);

  const electrons = useMemo(() => {
    const list = [];
    counts.forEach((count, s) => {
      for (let k = 0; k < count; k++) list.push({ shell: s, k, count });
    });
    return list;
  }, [counts]);

  const v = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);
  const perp = useMemo(() => new THREE.Vector3(), []);
  const up = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    g.visible = visible || g.scale.x > 0.86;
    g.scale.setScalar(THREE.MathUtils.damp(g.scale.x, visible ? 1 : 0.85, 6, dt));
    if (!visible) return;
    if (!reduce) time.current += dt;
    const t = time.current;
    const now = state.clock.elapsedTime;

    // Which electron (if any) is mid-jump, and where is it?
    const e = ex.current;
    let exIdx = -1;
    let exR = 0;
    let ghostOpacity = 0;
    if (e.active) {
      if (e.start === null) e.start = now;
      const et = now - e.start;
      const r0 = ringRadius(e.shell + 1);
      const r1 = ringRadius(e.shell + 2);
      exIdx = electrons.findIndex((x) => x.shell === e.shell);
      if (et < 0.5) exR = r0 + (r1 - r0) * ease(et / 0.5);
      else if (et < 1.7) exR = r1;
      else if (et < 2.1) exR = r1 + (r0 - r1) * ease((et - 1.7) / 0.4);
      else exR = r0;
      ghostOpacity = Math.min(1, et / 0.3) * Math.max(0, Math.min(1, (2.4 - et) / 0.4)) * 0.8;
      ghost.current.scale.setScalar(r1);
      if (et >= 2.05 && !e.emitted && exIdx >= 0) {
        e.emitted = true;
        heads.current[exIdx].getWorldPosition(v);
        dir.copy(v).setY(0).normalize();
        dir.y = 0.35;
        dir.normalize();
        ph.current = { active: true, start: now, origin: v.clone(), dir: dir.clone() };
        onEmit?.();
      }
      if (et > 2.4) e.active = false;
    }
    ghostLine.material.opacity = ghostOpacity;

    electrons.forEach((el, i) => {
      const grp = groups.current[i];
      if (!grp) return;
      const n = el.shell + 1;
      const omega = 0.95 / Math.pow(n, 1.35);
      grp.rotation.y = el.shell * 1.3 + (Math.PI * 2 * el.k) / el.count + omega * t;
      const base = ringRadius(n);
      const r = i === exIdx ? exR : base;
      heads.current[i].position.x = r;
      trails.current[i].scale.set(r / base, 1, r / base);
      halos.current[i].scale.setScalar(i === exIdx ? 1.25 : 0.6);
    });

    // Photon: a wave packet of glowing dots travelling outward.
    const p = ph.current;
    const pg = photon.current;
    if (p.active && pg) {
      const pt = now - p.start;
      const head = pt * 3.4;
      perp.crossVectors(p.dir, up).normalize();
      const fade = Math.max(0, 1 - Math.max(0, pt - 1.6) / 0.8);
      pg.children.forEach((sprite, k) => {
        const s = head - k * 0.07;
        if (s < 0) {
          sprite.visible = false;
          return;
        }
        sprite.visible = true;
        const wave = Math.sin(s * 11) * 0.13;
        sprite.position.copy(p.origin).addScaledVector(p.dir, s).addScaledVector(perp, wave);
        sprite.material.opacity = (1 - k / PHOTON_DOTS) * fade;
      });
      if (pt > 2.4) {
        p.active = false;
        pg.children.forEach((s) => (s.visible = false));
      }
    }
  });

  return (
    <group ref={group}>
      {counts.map((_, s) => (
        <mesh key={`ring${s}`} geometry={ringGeos[s]} material={shared.ring} rotation={[Math.PI / 2, 0, 0]} />
      ))}
      <primitive object={ghostLine} ref={ghost} />
      {electrons.map((el, i) => (
        <group key={`${el.shell}-${el.k}-${el.count}`} ref={(o) => (groups.current[i] = o)}>
          <mesh
            ref={(o) => (trails.current[i] = o)}
            geometry={trailsByShell[el.shell]}
            material={shared.trailMat}
          />
          <group ref={(o) => (heads.current[i] = o)} position={[ringRadius(el.shell + 1), 0, 0]}>
            <mesh geometry={shared.eGeo} material={shared.eMat} />
            <sprite ref={(o) => (halos.current[i] = o)} material={shared.halo} scale={0.6} />
          </group>
        </group>
      ))}
      <group ref={photon}>
        {photonMats.map((m, k) => (
          <sprite key={k} material={m} scale={0.32} visible={false} />
        ))}
      </group>
    </group>
  );
}

/* ── Clouds (quantum picture) ───────────────────────────────── */

const cloudVertex = /* glsl */ `
attribute float aSign;
attribute float aSeed;
uniform float uTime;
uniform float uSize;
uniform float uScale;
uniform float uTwinkle;
uniform float uGrow;
varying float vSign;
varying float vTw;
void main() {
  vec4 mv = modelViewMatrix * vec4(position * uGrow, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.55 + 0.45 * (0.5 + 0.5 * sin(uTime * (0.7 + aSeed * 2.6) + aSeed * 61.0));
  vTw = mix(1.0, tw, uTwinkle);
  vSign = aSign;
  // uSize is in world units, so dots keep their size relative to the atom at any zoom.
  gl_PointSize = max(1.5, uSize * uScale / -mv.z);
}`;

const cloudFragment = /* glsl */ `
uniform vec3 uA;
uniform vec3 uB;
uniform float uOpacity;
varying float vSign;
varying float vTw;
void main() {
  float d = length(gl_PointCoord - 0.5);
  if (d > 0.5) discard;
  float a = exp(-d * d * 14.0) - 0.03; // soft gaussian dot: overlapping dots read as haze
  vec3 col = vSign > 0.0 ? uA : uB;
  gl_FragColor = vec4(col, a * vTw * uOpacity);
  #include <colorspace_fragment>
}`;

function Clouds({ orbs, focus, visible, reduce }) {
  const { gl } = useThree();
  const maxN = orbs.reduce((m, o) => Math.max(m, o.n), 1);

  const items = useMemo(() => {
    return orbs.map((o) => {
      const data = sampleOrbital(o.n, o.l, o.shape, POINTS_PER_ELECTRON * o.electrons);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(data.positions, 3));
      geo.setAttribute("aSign", new THREE.BufferAttribute(data.signs, 1));
      geo.setAttribute("aSeed", new THREE.BufferAttribute(data.seeds, 1));
      const [a, b] = CLOUD[o.type];
      const mat = new THREE.ShaderMaterial({
        vertexShader: cloudVertex,
        fragmentShader: cloudFragment,
        uniforms: {
          uTime: { value: 0 },
          uSize: { value: 0.03 * cloudExtent(maxN) },
          uScale: { value: 1000 },
          uTwinkle: { value: reduce ? 0 : 1 },
          uGrow: { value: 0.55 },
          uA: { value: new THREE.Color(a) },
          uB: { value: new THREE.Color(b) },
          uOpacity: { value: 0 },
        },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        toneMapped: false,
      });
      // Inner shells are compressed into less space, so they would blow out to white.
      // s clouds are round haze; dim them so p and d lobes stand out from them.
      const weight = o.type === "s" ? 0.42 : o.type === "p" ? 1 : 1.1;
      const base = 0.36 * weight * Math.pow(cloudExtent(o.n) / cloudExtent(maxN), 1.5);
      return { o, geo, mat, base: Math.max(0.03, base) };
    });
  }, [orbs, maxN, reduce]);

  useEffect(
    () => () =>
      items.forEach(({ geo, mat }) => {
        geo.dispose();
        mat.dispose();
      }),
    [items]
  );

  const group = useRef();
  useFrame((state, dt) => {
    if (group.current) group.current.visible = visible || items.some((x) => x.mat.uniforms.uOpacity.value > 0.01);
    const scale = (state.size.height * gl.getPixelRatio()) / (2 * Math.tan(THREE.MathUtils.degToRad(state.camera.fov / 2)));
    items.forEach(({ o, mat, base }) => {
      const u = mat.uniforms;
      u.uTime.value = state.clock.elapsedTime;
      u.uScale.value = scale;
      const lit = focus != null && (o.sub === focus || o.key === focus);
      const target = !visible ? 0 : focus == null ? base : lit ? Math.min(0.62, Math.max(base * 1.8, 0.34)) : base * 0.02;
      u.uOpacity.value = THREE.MathUtils.damp(u.uOpacity.value, target, 5, dt);
      u.uGrow.value = THREE.MathUtils.damp(u.uGrow.value, visible ? 1 : 0.8, 3.5, dt);
    });
  });

  return (
    <group ref={group}>
      {items.map(({ o, geo, mat }) => (
        <points key={o.key} geometry={geo} material={mat} />
      ))}
    </group>
  );
}

/* ── Camera rig ─────────────────────────────────────────────── */

function Rig({ distance: framed, interactive, autoRotate }) {
  const { camera, gl, size } = useThree();
  // Frame by width too: on a tall phone stage the atom must fit side to side.
  const aspect = size.width / Math.max(1, size.height);
  const distance = framed * Math.max(1, 1.08 / aspect);
  const controls = useMemo(
    () => (interactive ? new OrbitControlsImpl(camera, gl.domElement) : null),
    [camera, gl, interactive]
  );
  const fly = useRef(1.6);

  useEffect(() => {
    if (!controls) return;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.65;
    controls.minDistance = 1.6;
    controls.maxDistance = 30;
    controls.autoRotateSpeed = 0.55;
    return () => controls.dispose();
  }, [controls]);

  useEffect(() => {
    if (controls) controls.autoRotate = autoRotate;
  }, [controls, autoRotate]);

  useEffect(() => {
    fly.current = 1.6;
  }, [distance]);

  useFrame((_, dt) => {
    if (fly.current > 0) {
      fly.current -= dt;
      camera.position.setLength(THREE.MathUtils.damp(camera.position.length(), distance, 3.4, dt));
      camera.lookAt(0, 0, 0);
    }
    if (controls) controls.update();
  });
  return null;
}

/** Slow turntable for the non-interactive preview. */
function Spin({ enabled, children }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (enabled && ref.current) ref.current.rotation.y += dt * 0.18;
  });
  return <group ref={ref}>{children}</group>;
}

/* ── Stage ──────────────────────────────────────────────────── */

export function framingDistance(view, counts, orbs, pack) {
  if (view === "nucleus") return Math.max(3.4, pack.radius * 3.3 + 1.4);
  if (view === "clouds" && orbs.length) {
    const maxN = orbs.reduce((m, o) => Math.max(m, o.n), 1);
    return Math.max(5, cloudExtent(maxN) * 3.15);
  }
  const maxN = Math.max(1, counts.length);
  return Math.max(6.2, ringRadius(maxN) * 2.75 + 1.4);
}

export default function AtomStage({
  z,
  neutrons,
  electrons,
  view = "shells",
  focus = null,
  trueScale = false,
  exciteToken = 0,
  photonHex = "#FFFFFF",
  onEmit,
  interactive = true,
  labels = true,
  paused = false,
  reduce = false,
}) {
  const overlay = useRef(null);
  const config = useMemo(() => configuration(electrons, z), [electrons, z]);
  const counts = useMemo(() => shellCounts(config), [config]);
  const orbs = useMemo(() => orbitals(config), [config]);
  const pack = useMemo(() => packNucleons(z + neutrons), [z, neutrons]);
  const distance = framingDistance(view, counts, orbs, pack);

  return (
    <div className="absolute inset-0">
      <OverlayContext.Provider value={overlay}>
        <Canvas
          camera={{ position: [0, 2.9, 7.4], fov: 40 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: false }}
          frameloop={paused ? "never" : "always"}
          aria-hidden="true"
        >
          <Backdrop />
          <Environment />
          <ambientLight intensity={0.3} />
          <directionalLight position={[4, 6, 5]} intensity={2.4} />
          <directionalLight position={[-5, -3, -4]} intensity={1.4} color={ELECTRON} />
          <Spin enabled={!interactive && !reduce}>
            <Nucleus z={z} pack={pack} view={view} trueScale={trueScale} reduce={reduce} />
            <Shells
              counts={counts}
              visible={view === "shells"}
              reduce={reduce}
              exciteToken={exciteToken}
              photonHex={photonHex}
              onEmit={onEmit}
            />
            <Clouds orbs={orbs} focus={focus} visible={view === "clouds"} reduce={reduce} />
          </Spin>
          {labels && (
            <>
              <Label position={[0, 0.62, 0]} show={view === "shells" && !trueScale && electrons > 0}>
                Nucleus
              </Label>
              <Label position={[0, 0.12, 0]} show={view === "shells" && trueScale}>
                The nucleus is here, too small to draw
              </Label>
            </>
          )}
          <Rig distance={distance} interactive={interactive} autoRotate={!reduce} />
        </Canvas>
      </OverlayContext.Provider>
      <div ref={overlay} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true" />
    </div>
  );
}
