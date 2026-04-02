// =============================================================
// PASSGENI — BRANDED BLOG HERO SVG GENERATOR
// Generates unique, on-brand SVG hero images for every blog post.
// No external images. No Unsplash. Pure vector, perfectly branded.
// =============================================================

// Deterministic hash from a string (0–1 range for seeding)
function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h;
}

function seeded(seed, index) {
  return ((hash(seed + index) % 1000) / 1000);
}

// Category visual configs
const CATEGORY_CONFIGS = {
  SECURITY: {
    accent:  "#C8FF00",
    pattern: "shield",
    label:   "SECURITY",
  },
  COMPLIANCE: {
    accent:  "#C8FF00",
    pattern: "grid",
    label:   "COMPLIANCE",
  },
  RESEARCH: {
    accent:  "#C8FF00",
    pattern: "scatter",
    label:   "RESEARCH",
  },
  "HOW-TO": {
    accent:  "#C8FF00",
    pattern: "steps",
    label:   "HOW-TO",
  },
  DEVELOPER: {
    accent:  "#C8FF00",
    pattern: "code",
    label:   "DEVELOPER",
  },
  TOOLS: {
    accent:  "#C8FF00",
    pattern: "circuit",
    label:   "TOOLS",
  },
  PRODUCT: {
    accent:  "#C8FF00",
    pattern: "brand",
    label:   "PRODUCT",
  },
};

// ─── PATTERN RENDERERS ────────────────────────────────────────

function ShieldPattern({ slug }) {
  const pts = Array.from({ length: 12 }, (_, i) => ({
    x: 20 + seeded(slug, i)     * 1160,
    y: 20 + seeded(slug, i + 50) * 460,
    r: 2 + seeded(slug, i + 100) * 4,
    o: 0.08 + seeded(slug, i + 150) * 0.18,
  }));
  const lines = Array.from({ length: 8 }, (_, i) => ({
    x1: seeded(slug, i + 200) * 1200,
    y1: seeded(slug, i + 250) * 500,
    x2: seeded(slug, i + 300) * 1200,
    y2: seeded(slug, i + 350) * 500,
    o:  0.04 + seeded(slug, i + 400) * 0.08,
  }));
  const cx = 600 + (seeded(slug, "cx") - 0.5) * 200;
  const cy = 250 + (seeded(slug, "cy") - 0.5) * 80;
  return (
    <g>
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke="#C8FF00" strokeWidth={0.5} opacity={l.o} />
      ))}
      {/* Shield center icon */}
      <path
        d={`M${cx},${cy - 60} C${cx - 50},${cy - 60} ${cx - 70},${cy - 30} ${cx - 70},${cy + 10} C${cx - 70},${cy + 60} ${cx},${cy + 80} ${cx},${cy + 80} C${cx},${cy + 80} ${cx + 70},${cy + 60} ${cx + 70},${cy + 10} C${cx + 70},${cy - 30} ${cx + 50},${cy - 60} ${cx},${cy - 60} Z`}
        fill="none" stroke="#C8FF00" strokeWidth={1.5} opacity={0.25}
      />
      {/* Inner lock */}
      <rect x={cx - 16} y={cy - 8} width={32} height={26} rx={4}
        fill="none" stroke="#C8FF00" strokeWidth={1} opacity={0.35} />
      <path d={`M${cx - 10},${cy - 8} V${cy - 20} A10,10 0 0,1 ${cx + 10},${cy - 20} V${cy - 8}`}
        fill="none" stroke="#C8FF00" strokeWidth={1} opacity={0.35} />
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#C8FF00" opacity={p.o} />
      ))}
    </g>
  );
}

function GridPattern({ slug }) {
  const cols = 16, rows = 9;
  const cw = 75, rh = 55;
  const highlights = new Set(
    Array.from({ length: 18 }, (_, i) => `${Math.floor(seeded(slug, i) * cols)},${Math.floor(seeded(slug, i + 20) * rows)}`)
  );
  return (
    <g>
      {Array.from({ length: cols + 1 }, (_, c) => (
        <line key={`v${c}`} x1={c * cw} y1={0} x2={c * cw} y2={500}
          stroke="#C8FF00" strokeWidth={0.4} opacity={0.06} />
      ))}
      {Array.from({ length: rows + 1 }, (_, r) => (
        <line key={`h${r}`} x1={0} y1={r * rh} x2={1200} y2={r * rh}
          stroke="#C8FF00" strokeWidth={0.4} opacity={0.06} />
      ))}
      {Array.from({ length: cols }, (_, c) =>
        Array.from({ length: rows }, (_, r) => {
          const key = `${c},${r}`;
          if (!highlights.has(key)) return null;
          return (
            <rect key={key} x={c * cw + 1} y={r * rh + 1} width={cw - 2} height={rh - 2}
              fill="#C8FF00" opacity={0.04 + seeded(slug, c + r * 100) * 0.06} />
          );
        })
      )}
      {/* Check mark */}
      <path d="M570,210 L590,240 L640,185" fill="none" stroke="#C8FF00" strokeWidth={3} strokeLinecap="round" opacity={0.3} />
      <rect x={540} y={165} width={140} height={100} rx={8}
        fill="none" stroke="#C8FF00" strokeWidth={1.5} opacity={0.2} />
    </g>
  );
}

function ScatterPattern({ slug }) {
  const pts = Array.from({ length: 40 }, (_, i) => ({
    x: 40 + seeded(slug, i)     * 1120,
    y: 40 + seeded(slug, i + 60) * 420,
    r: 1.5 + seeded(slug, i + 120) * 5,
    o: 0.06 + seeded(slug, i + 180) * 0.2,
  }));
  // Connect nearby points
  const edges = [];
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < 180) edges.push({ ...pts[i], x2: pts[j].x, y2: pts[j].y, o: (1 - d / 180) * 0.08 });
    }
  }
  return (
    <g>
      {edges.map((e, i) => (
        <line key={i} x1={e.x} y1={e.y} x2={e.x2} y2={e.y2}
          stroke="#C8FF00" strokeWidth={0.5} opacity={e.o} />
      ))}
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="#C8FF00" opacity={p.o} />
      ))}
    </g>
  );
}

function StepsPattern({ slug }) {
  const steps = 5;
  const sw = 140, gap = 60;
  const totalW = steps * sw + (steps - 1) * gap;
  const startX = (1200 - totalW) / 2;
  const y = 230;
  const activeStep = 1 + Math.floor(seeded(slug, "step") * (steps - 1));
  return (
    <g>
      {Array.from({ length: steps }, (_, i) => {
        const x = startX + i * (sw + gap);
        const active = i <= activeStep;
        return (
          <g key={i}>
            <rect x={x} y={y - 32} width={sw} height={64} rx={8}
              fill={active ? "rgba(200,255,0,0.07)" : "rgba(200,255,0,0.02)"}
              stroke="#C8FF00" strokeWidth={active ? 1 : 0.5}
              opacity={active ? 0.9 : 0.3} />
            <text x={x + sw / 2} y={y + 6} textAnchor="middle"
              fontFamily="monospace" fontSize={13} fill="#C8FF00" opacity={active ? 0.7 : 0.2}>
              {String(i + 1).padStart(2, "0")}
            </text>
            {i < steps - 1 && (
              <line x1={x + sw} y1={y} x2={x + sw + gap} y2={y}
                stroke="#C8FF00" strokeWidth={1} opacity={active ? 0.25 : 0.1}
                strokeDasharray={active ? "none" : "4,4"} />
            )}
          </g>
        );
      })}
      {/* Background grid lines */}
      {Array.from({ length: 8 }, (_, i) => (
        <line key={i} x1={0} y1={i * 65} x2={1200} y2={i * 65}
          stroke="#C8FF00" strokeWidth={0.3} opacity={0.04} />
      ))}
    </g>
  );
}

function CodePattern({ slug }) {
  const lines = [
    `const key = process.env.PASSGENI_KEY;`,
    `const { passwords } = await passgeni.generate({`,
    `  profession: "developer",`,
    `  count: 10,  length: 20,`,
    `  compliance: "nist",`,
    `});`,
  ];
  const offsetY = 10 + seeded(slug, "codeY") * 40;
  return (
    <g>
      {/* Terminal window */}
      <rect x={240} y={120 + offsetY} width={720} height={220} rx={10}
        fill="rgba(0,0,0,0.6)" stroke="#C8FF00" strokeWidth={0.8} opacity={0.5} />
      <rect x={240} y={120 + offsetY} width={720} height={28} rx={10}
        fill="rgba(200,255,0,0.06)" />
      {/* Dots */}
      {[260, 280, 300].map((x, i) => (
        <circle key={i} cx={x} cy={134 + offsetY} r={5}
          fill={["#ff5f56", "#ffbd2e", "#27c93f"][i]} opacity={0.6} />
      ))}
      {lines.map((line, i) => (
        <text key={i} x={262} y={170 + offsetY + i * 22}
          fontFamily="monospace" fontSize={11}
          fill={i === 0 ? "#C8FF00" : i < 2 ? "#88aaff" : "#aaa"}
          opacity={0.7}>
          {line}
        </text>
      ))}
      {/* Background dots */}
      {Array.from({ length: 20 }, (_, i) => (
        <circle key={i} cx={seeded(slug, i + 500) * 1200} cy={seeded(slug, i + 600) * 500}
          r={1.5} fill="#C8FF00" opacity={0.06 + seeded(slug, i + 700) * 0.08} />
      ))}
    </g>
  );
}

function CircuitPattern({ slug }) {
  const nodes = Array.from({ length: 16 }, (_, i) => ({
    x: 80 + seeded(slug, i)     * 1040,
    y: 60 + seeded(slug, i + 20) * 380,
  }));
  return (
    <g>
      {/* Circuit board traces */}
      {nodes.slice(0, -1).map((n, i) => {
        const next = nodes[i + 1];
        const mx = (n.x + next.x) / 2;
        return (
          <path key={i} d={`M${n.x},${n.y} L${mx},${n.y} L${mx},${next.y} L${next.x},${next.y}`}
            fill="none" stroke="#C8FF00" strokeWidth={0.8}
            opacity={0.08 + seeded(slug, i + 300) * 0.1} />
        );
      })}
      {nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={4} fill="none" stroke="#C8FF00"
            strokeWidth={1} opacity={0.15 + seeded(slug, i + 400) * 0.2} />
          <circle cx={n.x} cy={n.y} r={1.5} fill="#C8FF00"
            opacity={0.2 + seeded(slug, i + 500) * 0.25} />
        </g>
      ))}
    </g>
  );
}

function BrandPattern({ slug }) {
  return (
    <g>
      {/* Concentric rings */}
      {[200, 160, 120, 80].map((r, i) => (
        <circle key={i} cx={600} cy={250} r={r}
          fill="none" stroke="#C8FF00" strokeWidth={0.6}
          opacity={0.04 + i * 0.03} />
      ))}
      {/* PassGeni P */}
      <text x={600} y={290} textAnchor="middle"
        fontFamily="Arial Black, sans-serif" fontSize={120} fontWeight={900}
        fill="#C8FF00" opacity={0.08}>
        P
      </text>
      {/* Accent lines */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const r1 = 220, r2 = 240;
        return (
          <line key={i}
            x1={600 + Math.cos(angle) * r1} y1={250 + Math.sin(angle) * r1}
            x2={600 + Math.cos(angle) * r2} y2={250 + Math.sin(angle) * r2}
            stroke="#C8FF00" strokeWidth={1} opacity={0.25} />
        );
      })}
    </g>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────

export default function BlogHeroSVG({ category = "SECURITY", slug = "", title = "", style = {} }) {
  const config = CATEGORY_CONFIGS[category] || CATEGORY_CONFIGS.SECURITY;
  const seed   = slug || title;

  const renderPattern = () => {
    switch (config.pattern) {
      case "shield":  return <ShieldPattern  slug={seed} />;
      case "grid":    return <GridPattern    slug={seed} />;
      case "scatter": return <ScatterPattern slug={seed} />;
      case "steps":   return <StepsPattern   slug={seed} />;
      case "code":    return <CodePattern    slug={seed} />;
      case "circuit": return <CircuitPattern slug={seed} />;
      case "brand":   return <BrandPattern   slug={seed} />;
      default:        return <ScatterPattern slug={seed} />;
    }
  };

  // Unique gradient offset per slug
  const gx = 200 + seeded(seed, "gx") * 800;
  const gy = 100 + seeded(seed, "gy") * 300;

  return (
    <svg
      viewBox="0 0 1200 500"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
      style={{ width: "100%", height: "100%", display: "block", ...style }}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`bg-${seed}`} cx={`${gx / 12}%`} cy={`${gy / 5}%`} r="70%">
          <stop offset="0%"   stopColor="#0d0d14" />
          <stop offset="100%" stopColor="#060608" />
        </radialGradient>
        <radialGradient id={`glow-${seed}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#C8FF00" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#C8FF00" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Background */}
      <rect width={1200} height={500} fill={`url(#bg-${seed})`} />
      <rect width={1200} height={500} fill={`url(#glow-${seed})`} />

      {/* Pattern layer */}
      {renderPattern()}

      {/* Bottom gradient fade */}
      <defs>
        <linearGradient id={`fade-${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="40%"  stopColor="#060608" stopOpacity="0" />
          <stop offset="100%" stopColor="#060608" stopOpacity="1" />
        </linearGradient>
      </defs>
      <rect width={1200} height={500} fill={`url(#fade-${seed})`} />

      {/* Category label */}
      <rect x={40} y={40} width={Math.max(80, config.label.length * 9 + 24)} height={24} rx={4}
        fill="rgba(200,255,0,0.1)" />
      <text x={52} y={57} fontFamily="monospace" fontSize={10} fontWeight={700}
        fill="#C8FF00" letterSpacing={2} opacity={0.8}>
        {config.label}
      </text>
    </svg>
  );
}
