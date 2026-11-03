import { createContext, useContext } from "react";

const LabelOverride = createContext(null);

function Svg({ children, label }) {
  const override = useContext(LabelOverride);
  return (
    <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label={override || label}>
      {children}
    </svg>
  );
}

/** `label` overrides the accessible name (e.g. to hide the answer in Mystery). */
export default function ObjectViz({ type, className = "", label = null }) {
  const stroke = "#4DB2FF";
  const dim = "#9AA9C2";
  const fill = "rgba(77,178,255,0.12)";

  const map = {
    bacteria: (
      <Svg label="Schematic rod-shaped bacterium">
        <ellipse cx="100" cy="100" rx="72" ry="28" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <ellipse cx="70" cy="100" rx="10" ry="8" fill="none" stroke={dim} />
        <path d="M172 100 C190 90 198 110 188 118" fill="none" stroke={stroke} />
      </Svg>
    ),
    virus: (
      <Svg label="Schematic icosahedral virus">
        <polygon
          points="100,28 148,56 148,144 100,172 52,144 52,56"
          fill={fill}
          stroke={stroke}
          strokeWidth="1.5"
        />
        {[0, 60, 120, 180, 240, 300].map((a) => {
          const r = 82;
          const x = 100 + r * Math.cos((a * Math.PI) / 180);
          const y = 100 + r * Math.sin((a * Math.PI) / 180);
          return <line key={a} x1="100" y1="100" x2={x} y2={y} stroke={dim} strokeWidth="0.75" />;
        })}
        <circle cx="100" cy="100" r="18" fill="none" stroke={stroke} />
      </Svg>
    ),
    cell: (
      <Svg label="Schematic eukaryotic cell">
        <ellipse cx="100" cy="100" rx="78" ry="62" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <circle cx="88" cy="96" r="22" fill="none" stroke={stroke} />
        <circle cx="88" cy="96" r="8" fill={stroke} opacity="0.4" />
        <ellipse cx="140" cy="120" rx="14" ry="8" fill="none" stroke={dim} />
        <ellipse cx="130" cy="70" rx="10" ry="6" fill="none" stroke={dim} />
      </Svg>
    ),
    blood: (
      <Svg label="Schematic red blood cell">
        <ellipse cx="100" cy="100" rx="70" ry="28" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <ellipse cx="100" cy="100" rx="28" ry="10" fill="none" stroke={dim} />
      </Svg>
    ),
    microbe: (
      <Svg label="Schematic ciliate">
        <ellipse cx="100" cy="108" rx="54" ry="36" fill={fill} stroke={stroke} strokeWidth="1.5" />
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI * 2;
          const x1 = 100 + 54 * Math.cos(a);
          const y1 = 108 + 36 * Math.sin(a);
          const x2 = 100 + 70 * Math.cos(a);
          const y2 = 108 + 50 * Math.sin(a);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth="1" />;
        })}
      </Svg>
    ),
    atom: (
      <Svg label="Schematic atom with nucleus and orbital rings">
        <circle cx="100" cy="100" r="8" fill={stroke} />
        <ellipse cx="100" cy="100" rx="70" ry="24" fill="none" stroke={stroke} transform="rotate(0 100 100)" />
        <ellipse cx="100" cy="100" rx="70" ry="24" fill="none" stroke={dim} transform="rotate(60 100 100)" />
        <ellipse cx="100" cy="100" rx="70" ry="24" fill="none" stroke={dim} transform="rotate(120 100 100)" />
      </Svg>
    ),
    electron: (
      <Svg label="Schematic electron cloud">
        <circle cx="100" cy="100" r="50" fill={fill} stroke={stroke} strokeDasharray="3 4" />
        <circle cx="148" cy="78" r="6" fill={stroke} />
      </Svg>
    ),
    proton: (
      <Svg label="Schematic proton as three quarks">
        <circle cx="100" cy="100" r="48" fill={fill} stroke={stroke} />
        <circle cx="86" cy="92" r="10" fill="none" stroke={stroke} />
        <circle cx="114" cy="92" r="10" fill="none" stroke={stroke} />
        <circle cx="100" cy="118" r="10" fill="none" stroke={dim} />
      </Svg>
    ),
    neutron: (
      <Svg label="Schematic neutron">
        <circle cx="100" cy="100" r="48" fill={fill} stroke={dim} />
        <circle cx="100" cy="100" r="12" fill="none" stroke={stroke} />
      </Svg>
    ),
    molecule: (
      <Svg label="Schematic water molecule">
        <circle cx="100" cy="118" r="22" fill={fill} stroke={stroke} strokeWidth="1.5" />
        <circle cx="64" cy="72" r="12" fill="none" stroke={dim} />
        <circle cx="136" cy="72" r="12" fill="none" stroke={dim} />
        <line x1="88" y1="104" x2="70" y2="82" stroke={stroke} />
        <line x1="112" y1="104" x2="130" y2="82" stroke={stroke} />
      </Svg>
    ),
    dna: (
      <Svg label="Schematic DNA double helix">
        {Array.from({ length: 8 }).map((_, i) => {
          const y = 20 + i * 20;
          const x1 = 70 + Math.sin(i) * 18;
          const x2 = 130 - Math.sin(i) * 18;
          return (
            <g key={i}>
              <line x1={x1} y1={y} x2={x2} y2={y} stroke={dim} />
              <circle cx={x1} cy={y} r="4" fill={stroke} />
              <circle cx={x2} cy={y} r="4" fill="none" stroke={stroke} />
            </g>
          );
        })}
      </Svg>
    ),
    rna: (
      <Svg label="Schematic folded RNA strand">
        <path
          d="M40 140 C60 40, 90 40, 100 100 S150 160, 170 60"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
        />
        <circle cx="100" cy="100" r="6" fill={stroke} />
      </Svg>
    ),
    protein: (
      <Svg label="Schematic folded protein ribbon">
        <path
          d="M40 120 C70 40, 90 160, 120 70 S170 40, 160 130"
          fill="none"
          stroke={stroke}
          strokeWidth="3"
        />
        <circle cx="120" cy="70" r="8" fill={fill} stroke={dim} />
      </Svg>
    ),
    complex: (
      <Svg label="Schematic molecular complex">
        <rect x="50" y="50" width="100" height="100" fill={fill} stroke={stroke} />
        <circle cx="100" cy="100" r="22" fill="none" stroke={dim} />
        <rect x="88" y="40" width="24" height="20" fill="none" stroke={stroke} />
      </Svg>
    ),
    magnet: (
      <Svg label="Schematic magnetic field lines">
        <path d="M70 40 C20 100, 20 100, 70 160" fill="none" stroke={stroke} />
        <path d="M130 40 C180 100, 180 100, 130 160" fill="none" stroke={stroke} />
        <rect x="70" y="70" width="60" height="60" fill={fill} stroke={dim} />
      </Svg>
    ),
    sound: (
      <Svg label="Schematic sound pressure waves">
        {[20, 40, 60, 80].map((r) => (
          <circle key={r} cx="70" cy="100" r={r} fill="none" stroke={stroke} opacity={1 - r / 100} />
        ))}
        <circle cx="70" cy="100" r="6" fill={stroke} />
      </Svg>
    ),
    em: (
      <Svg label="Schematic electromagnetic wave">
        <path d="M20 100 Q45 40 70 100 T120 100 T170 100" fill="none" stroke={stroke} />
        <path d="M20 100 Q45 160 70 100 T120 100 T170 100" fill="none" stroke={dim} />
        <line x1="20" y1="100" x2="180" y2="100" stroke={dim} strokeDasharray="2 4" />
      </Svg>
    ),
    radiation: (
      <Svg label="Schematic radiating source">
        <circle cx="100" cy="100" r="14" fill={stroke} />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const rad = (a * Math.PI) / 180;
          return (
            <line
              key={a}
              x1={100 + Math.cos(rad) * 24}
              y1={100 + Math.sin(rad) * 24}
              x2={100 + Math.cos(rad) * 70}
              y2={100 + Math.sin(rad) * 70}
              stroke={stroke}
            />
          );
        })}
      </Svg>
    ),
    efield: (
      <Svg label="Schematic electric field lines">
        <circle cx="70" cy="100" r="10" fill={stroke} />
        <circle cx="130" cy="100" r="10" fill="none" stroke={dim} />
        {[ -30, 0, 30].map((dy) => (
          <line key={dy} x1="82" y1={100 + dy / 3} x2="118" y2={100 - dy / 3} stroke={stroke} />
        ))}
      </Svg>
    ),
    neuron: (
      <Svg label="Schematic neuron">
        <circle cx="70" cy="100" r="18" fill={fill} stroke={stroke} />
        <line x1="88" y1="100" x2="170" y2="100" stroke={stroke} strokeWidth="2" />
        <line x1="70" y1="82" x2="40" y2="50" stroke={dim} />
        <line x1="70" y1="118" x2="40" y2="150" stroke={dim} />
        <line x1="58" y1="88" x2="28" y2="80" stroke={dim} />
      </Svg>
    ),
    synapse: (
      <Svg label="Schematic synapse">
        <path d="M30 80 H90 V120 H30" fill="none" stroke={stroke} />
        <path d="M110 70 H170 V130 H110" fill="none" stroke={dim} />
        <circle cx="100" cy="90" r="4" fill={stroke} />
        <circle cx="96" cy="110" r="4" fill={stroke} />
      </Svg>
    ),
    signal: (
      <Svg label="Schematic action potential">
        <polyline
          points="20,140 70,140 82,40 100,160 112,120 180,120"
          fill="none"
          stroke={stroke}
          strokeWidth="2"
        />
      </Svg>
    ),
    network: (
      <Svg label="Schematic neural network">
        {[
          [50, 50],
          [150, 50],
          [100, 100],
          [50, 150],
          [150, 150],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="6" fill={stroke} />
        ))}
        <line x1="50" y1="50" x2="100" y2="100" stroke={dim} />
        <line x1="150" y1="50" x2="100" y2="100" stroke={dim} />
        <line x1="100" y1="100" x2="50" y2="150" stroke={dim} />
        <line x1="100" y1="100" x2="150" y2="150" stroke={dim} />
        <line x1="50" y1="50" x2="150" y2="50" stroke={dim} />
      </Svg>
    ),
    talk: (
      <Svg label="Schematic two cells communicating">
        <circle cx="60" cy="100" r="28" fill={fill} stroke={stroke} />
        <circle cx="140" cy="100" r="28" fill={fill} stroke={dim} />
        <line x1="88" y1="100" x2="112" y2="100" stroke={stroke} />
        <circle cx="100" cy="100" r="4" fill={stroke} />
      </Svg>
    ),
    "hair-ref": (
      <Svg label="Schematic hair cross-section">
        <circle cx="100" cy="100" r="60" fill={fill} stroke={stroke} />
        <circle cx="100" cy="100" r="28" fill="none" stroke={dim} />
      </Svg>
    ),
  };

  return (
    <LabelOverride.Provider value={label}>
      <div className={className}>{map[type] || map.atom}</div>
    </LabelOverride.Provider>
  );
}
