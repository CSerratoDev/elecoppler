import { useState } from "react";

// ─── Paleta & estilos globales ───────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Syne:wght@400;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --panel: #111118;
    --border: #1e1e2e;
    --accent1: #00f5a0;
    --accent2: #00c9ff;
    --accent3: #f5a623;
    --text: #e8e8f0;
    --muted: #6b6b80;
    --error: #ff4d6d;
    --radius: 12px;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'Space Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-display); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse 80% 40% at 20% -10%, rgba(0,245,160,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 60% 40% at 80% 110%, rgba(0,201,255,0.06) 0%, transparent 60%);
  }

  .header {
    padding: 40px 24px 24px;
    text-align: center;
    border-bottom: 1px solid var(--border);
    position: relative;
  }
  .header::after {
    content: '';
    position: absolute;
    bottom: -1px; left: 50%; transform: translateX(-50%);
    width: 120px; height: 2px;
    background: linear-gradient(90deg, var(--accent1), var(--accent2));
  }
  .header-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 4px;
    color: var(--accent1);
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .header h1 {
    font-size: clamp(28px, 5vw, 52px);
    font-weight: 800;
    letter-spacing: -1px;
    line-height: 1.05;
  }
  .header h1 span { 
    background: linear-gradient(135deg, var(--accent1), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  .header p {
    margin-top: 10px;
    color: var(--muted);
    font-size: 14px;
    font-family: var(--font-mono);
  }

  .tabs {
    display: flex;
    gap: 0;
    padding: 24px 24px 0;
    max-width: 900px;
    margin: 0 auto;
    border-bottom: 1px solid var(--border);
    overflow-x: auto;
  }
  .tab-btn {
    padding: 12px 22px;
    background: none;
    border: none;
    color: var(--muted);
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 13px;
    cursor: pointer;
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
    white-space: nowrap;
    letter-spacing: 0.3px;
  }
  .tab-btn:hover { color: var(--text); }
  .tab-btn.active { color: var(--accent1); border-bottom-color: var(--accent1); }

  .content {
    max-width: 900px;
    margin: 0 auto;
    padding: 32px 24px 64px;
  }

  /* ── Cards ── */
  .card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 28px;
    margin-bottom: 20px;
  }
  .card-title {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .card-title .dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--accent1);
    flex-shrink: 0;
  }
  .card-title .dot.blue { background: var(--accent2); }
  .card-title .dot.orange { background: var(--accent3); }

  /* ── Formula display ── */
  .formula-box {
    background: #0d0d14;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px 24px;
    font-family: var(--font-mono);
    font-size: 20px;
    text-align: center;
    letter-spacing: 2px;
    margin-bottom: 24px;
    position: relative;
    overflow: hidden;
  }
  .formula-box::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--accent1), transparent);
  }
  .formula-box .highlight { color: var(--accent1); }
  .formula-box .highlight.blue { color: var(--accent2); }
  .formula-box .highlight.orange { color: var(--accent3); }

  /* ── Inputs grid ── */
  .inputs-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    margin-bottom: 20px;
  }
  .input-group label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 8px;
    font-family: var(--font-mono);
  }
  .input-group input, .input-group select {
    width: 100%;
    background: #0d0d14;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 14px;
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 15px;
    transition: border-color 0.2s;
    appearance: none;
  }
  .input-group input:focus, .input-group select:focus {
    outline: none;
    border-color: var(--accent1);
  }
  .input-group input::placeholder { color: var(--muted); }

  /* ── Result ── */
  .result-box {
    background: linear-gradient(135deg, rgba(0,245,160,0.08), rgba(0,201,255,0.05));
    border: 1px solid rgba(0,245,160,0.25);
    border-radius: 8px;
    padding: 20px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }
  .result-label {
    font-size: 11px;
    letter-spacing: 2px;
    color: var(--muted);
    text-transform: uppercase;
    font-family: var(--font-mono);
    margin-bottom: 4px;
  }
  .result-value {
    font-family: var(--font-mono);
    font-size: 28px;
    font-weight: 700;
    color: var(--accent1);
  }
  .result-value.blue { color: var(--accent2); }
  .result-value.orange { color: var(--accent3); }
  .result-formula {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
    text-align: right;
  }
  .result-box.error {
    background: rgba(255,77,109,0.08);
    border-color: rgba(255,77,109,0.25);
  }
  .result-box.error .result-value { color: var(--error); font-size: 14px; }

  /* ── Explanation ── */
  .explanation {
    background: #0d0d14;
    border-left: 3px solid var(--accent1);
    border-radius: 0 8px 8px 0;
    padding: 16px 20px;
    font-size: 13px;
    color: var(--muted);
    line-height: 1.7;
    font-family: var(--font-mono);
  }
  .explanation strong { color: var(--text); }
  .explanation.blue { border-left-color: var(--accent2); }
  .explanation.orange { border-left-color: var(--accent3); }

  /* ── Triangle visual for Ohm ── */
  .triangle-container {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  }
  .ohm-triangle {
    position: relative;
    width: 180px;
    height: 160px;
  }
  .tri-cell {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 70px; height: 70px;
    border-radius: 50%;
    font-family: var(--font-mono);
    font-weight: 700;
    font-size: 18px;
    transition: all 0.3s;
  }
  .tri-cell .sub { font-size: 9px; color: var(--muted); letter-spacing: 1px; margin-top: 2px; }
  .tri-cell.top { top: 0; left: 50%; transform: translateX(-50%); background: rgba(0,245,160,0.15); border: 2px solid var(--accent1); color: var(--accent1); }
  .tri-cell.bl  { bottom: 0; left: 0; background: rgba(0,201,255,0.15); border: 2px solid var(--accent2); color: var(--accent2); }
  .tri-cell.br  { bottom: 0; right: 0; background: rgba(245,166,35,0.15); border: 2px solid var(--accent3); color: var(--accent3); }
  .tri-cell.active { transform: translateX(-50%) scale(1.15); }
  .tri-cell.bl.active, .tri-cell.br.active { transform: scale(1.15); }
  .tri-line {
    position: absolute;
    background: var(--border);
    transform-origin: 0 0;
  }

  /* ── Doppler wave visual ── */
  .wave-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    margin-bottom: 16px;
    height: 48px;
    overflow: hidden;
  }
  .wave-bar {
    width: 4px;
    border-radius: 2px;
    background: var(--accent2);
    animation: wave-anim 1.2s ease-in-out infinite;
  }
  @keyframes wave-anim {
    0%, 100% { height: 8px; opacity: 0.3; }
    50% { height: 40px; opacity: 1; }
  }

  /* ── Conversion double ── */
  .conv-chain {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    margin: 16px 0;
    font-family: var(--font-mono);
    font-size: 13px;
  }
  .conv-step {
    background: rgba(0,201,255,0.1);
    border: 1px solid rgba(0,201,255,0.2);
    border-radius: 6px;
    padding: 6px 12px;
    color: var(--accent2);
  }
  .conv-arrow { color: var(--muted); font-size: 18px; }

  /* ── Solve-for radio ── */
  .solve-for {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }
  .solve-btn {
    padding: 8px 16px;
    border-radius: 20px;
    border: 1px solid var(--border);
    background: none;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 1px;
  }
  .solve-btn.active {
    background: rgba(0,245,160,0.12);
    border-color: var(--accent1);
    color: var(--accent1);
  }
  .solve-btn.blue.active { background: rgba(0,201,255,0.12); border-color: var(--accent2); color: var(--accent2); }
  .solve-btn.orange.active { background: rgba(245,166,35,0.12); border-color: var(--accent3); color: var(--accent3); }

  .section-desc {
    font-size: 13px;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 24px;
    font-family: var(--font-mono);
  }
  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 8px;
    font-family: var(--font-mono);
  }
  .badge.green { background: rgba(0,245,160,0.15); color: var(--accent1); }
  .badge.blue  { background: rgba(0,201,255,0.15); color: var(--accent2); }
  .badge.orange{ background: rgba(245,166,35,0.15); color: var(--accent3); }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number, decimals = 4): string => {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1e6 || (Math.abs(n) < 1e-3 && n !== 0))
    return n.toExponential(3);
  return parseFloat(n.toFixed(decimals)).toString();
};

const parse = (s: string): number => parseFloat(s.replace(",", "."));

// ─────────────────────────────────────────────────────────────────────────────
// 1. LEY DE OHM
// ─────────────────────────────────────────────────────────────────────────────
function OhmLaw() {
  const [solve, setSolve] = useState<"V" | "I" | "R">("V");
  const [vals, setVals] = useState({ V: "", I: "", R: "" });

  const set = (k: string, v: string) => setVals(p => ({ ...p, [k]: v }));

  const result = (() => {
    const V = parse(vals.V), I = parse(vals.I), R = parse(vals.R);
    if (solve === "V") {
      if (!isFinite(I) || !isFinite(R)) return null;
      return { value: I * R, unit: "V (Voltios)", formula: `V = ${fmt(I)} × ${fmt(R)}`, color: "green" };
    }
    if (solve === "I") {
      if (!isFinite(V) || !isFinite(R) || R === 0) return null;
      return { value: V / R, unit: "A (Amperios)", formula: `I = ${fmt(V)} ÷ ${fmt(R)}`, color: "blue" };
    }
    if (solve === "R") {
      if (!isFinite(V) || !isFinite(I) || I === 0) return null;
      return { value: V / I, unit: "Ω (Ohmios)", formula: `R = ${fmt(V)} ÷ ${fmt(I)}`, color: "orange" };
    }
    return null;
  })();

  const inputs: Array<{ key: "V" | "I" | "R"; label: string; placeholder: string; unit: string }> = [
    { key: "V", label: "Voltaje (V)", placeholder: "ej: 12", unit: "V" },
    { key: "I", label: "Corriente (I)", placeholder: "ej: 2", unit: "A" },
    { key: "R", label: "Resistencia (R)", placeholder: "ej: 6", unit: "Ω" },
  ];

  return (
    <div>
      <div className="badge green">Ley de Ohm</div>
      <p className="section-desc">
        La Ley de Ohm establece que la tensión entre dos puntos de un conductor es directamente proporcional a la intensidad de corriente. <strong style={{ color: "var(--text)" }}>V = I × R</strong>
      </p>

      <div className="card">
        <div className="card-title"><span className="dot" /> Triángulo de la Ley de Ohm</div>
        <div className="triangle-container">
          <div className="ohm-triangle">
            <div className={`tri-cell top${solve === "V" ? " active" : ""}`}>
              V<span className="sub">Voltaje</span>
            </div>
            <div className={`tri-cell bl${solve === "I" ? " active" : ""}`}>
              I<span className="sub">Corriente</span>
            </div>
            <div className={`tri-cell br${solve === "R" ? " active" : ""}`}>
              R<span className="sub">Resistencia</span>
            </div>
          </div>
        </div>
        <div className="formula-box">
          <span className="highlight">V</span> = <span className="highlight blue">I</span> × <span className="highlight orange">R</span>
        </div>
      </div>

      <div className="card">
        <div className="card-title"><span className="dot blue" /> Calculadora</div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12, fontFamily: "var(--font-mono)" }}>¿Qué quieres calcular?</p>
        <div className="solve-for">
          {(["V", "I", "R"] as const).map(k => (
            <button key={k}
              className={`solve-btn${solve === k ? k === "V" ? " active" : k === "I" ? " blue active" : " orange active" : ""}`}
              onClick={() => setSolve(k)}>
              {k === "V" ? "Voltaje (V)" : k === "I" ? "Corriente (I)" : "Resistencia (R)"}
            </button>
          ))}
        </div>
        <div className="inputs-grid">
          {inputs.filter(i => i.key !== solve).map(({ key, label, placeholder, unit }) => (
            <div key={key} className="input-group">
              <label>{label}</label>
              <input
                type="number"
                placeholder={placeholder}
                value={vals[key]}
                onChange={e => set(key, e.target.value)}
              />
            </div>
          ))}
        </div>
        {result ? (
          <div className={`result-box${result.color === "green" ? "" : result.color === "blue" ? " blue" : ""}`}
            style={result.color === "orange" ? { background: "rgba(245,166,35,0.08)", borderColor: "rgba(245,166,35,0.25)" } : undefined}>
            <div>
              <div className="result-label">Resultado</div>
              <div className={`result-value${result.color === "blue" ? " blue" : result.color === "orange" ? " orange" : ""}`}>
                {fmt(result.value)} <span style={{ fontSize: 14 }}>{result.unit}</span>
              </div>
            </div>
            <div className="result-formula">{result.formula}</div>
          </div>
        ) : (
          <div className="explanation">
            Ingresa los valores conocidos para calcular el resultado.
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-title"><span className="dot" /> Derivaciones</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          {[
            { f: "V = I × R", c: "var(--accent1)" },
            { f: "I = V ÷ R", c: "var(--accent2)" },
            { f: "R = V ÷ I", c: "var(--accent3)" },
          ].map(({ f, c }) => (
            <div key={f} className="formula-box" style={{ fontSize: 15, borderColor: c, marginBottom: 0 }}>
              <span style={{ color: c }}>{f}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONVERSIONES
// ─────────────────────────────────────────────────────────────────────────────
type UnitGroup = { label: string; units: { key: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }[] };

const unitGroups: UnitGroup[] = [
  {
    label: "Longitud",
    units: [
      { key: "m", label: "Metro (m)", toBase: v => v, fromBase: v => v },
      { key: "km", label: "Kilómetro (km)", toBase: v => v * 1000, fromBase: v => v / 1000 },
      { key: "cm", label: "Centímetro (cm)", toBase: v => v / 100, fromBase: v => v * 100 },
      { key: "mm", label: "Milímetro (mm)", toBase: v => v / 1000, fromBase: v => v * 1000 },
      { key: "mi", label: "Milla (mi)", toBase: v => v * 1609.34, fromBase: v => v / 1609.34 },
      { key: "ft", label: "Pie (ft)", toBase: v => v * 0.3048, fromBase: v => v / 0.3048 },
      { key: "in", label: "Pulgada (in)", toBase: v => v * 0.0254, fromBase: v => v / 0.0254 },
    ]
  },
  {
    label: "Masa",
    units: [
      { key: "kg", label: "Kilogramo (kg)", toBase: v => v, fromBase: v => v },
      { key: "g", label: "Gramo (g)", toBase: v => v / 1000, fromBase: v => v * 1000 },
      { key: "mg", label: "Miligramo (mg)", toBase: v => v / 1e6, fromBase: v => v * 1e6 },
      { key: "lb", label: "Libra (lb)", toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { key: "oz", label: "Onza (oz)", toBase: v => v * 0.0283495, fromBase: v => v / 0.0283495 },
      { key: "t", label: "Tonelada (t)", toBase: v => v * 1000, fromBase: v => v / 1000 },
    ]
  },
  {
    label: "Temperatura",
    units: [
      { key: "C", label: "Celsius (°C)", toBase: v => v, fromBase: v => v },
      { key: "F", label: "Fahrenheit (°F)", toBase: v => (v - 32) * 5 / 9, fromBase: v => v * 9 / 5 + 32 },
      { key: "K", label: "Kelvin (K)", toBase: v => v - 273.15, fromBase: v => v + 273.15 },
    ]
  },
  {
    label: "Velocidad",
    units: [
      { key: "ms", label: "m/s", toBase: v => v, fromBase: v => v },
      { key: "kmh", label: "km/h", toBase: v => v / 3.6, fromBase: v => v * 3.6 },
      { key: "mph", label: "mi/h", toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { key: "kn", label: "Nudo", toBase: v => v * 0.514444, fromBase: v => v / 0.514444 },
    ]
  },
  {
    label: "Tiempo",
    units: [
      { key: "s", label: "Segundo (s)", toBase: v => v, fromBase: v => v },
      { key: "min", label: "Minuto (min)", toBase: v => v * 60, fromBase: v => v / 60 },
      { key: "h", label: "Hora (h)", toBase: v => v * 3600, fromBase: v => v / 3600 },
      { key: "d", label: "Día (d)", toBase: v => v * 86400, fromBase: v => v / 86400 },
    ]
  },
];

function Conversions() {
  const [groupIdx, setGroupIdx] = useState(0);
  const [fromKey, setFromKey] = useState("m");
  const [toKey, setToKey] = useState("km");
  const [value, setValue] = useState("");

  // Doble conversión
  const [midKey, setMidKey] = useState("cm");
  const [showDouble, setShowDouble] = useState(false);

  const group = unitGroups[groupIdx];
  const findUnit = (k: string) => group.units.find(u => u.key === k);

  const convert = (v: number, from: string, to: string): number => {
    const fu = findUnit(from), tu = findUnit(to);
    if (!fu || !tu) return NaN;
    return tu.fromBase(fu.toBase(v));
  };

  const num = parse(value);
  const result = isFinite(num) ? convert(num, fromKey, toKey) : null;

  // Doble conversión
  const mid = isFinite(num) && showDouble ? convert(num, fromKey, midKey) : null;
  const final = mid !== null ? convert(mid, midKey, toKey) : null;

  const handleGroupChange = (idx: number) => {
    setGroupIdx(idx);
    const g = unitGroups[idx];
    setFromKey(g.units[0].key);
    setToKey(g.units[1]?.key || g.units[0].key);
    setMidKey(g.units[2]?.key || g.units[1]?.key || g.units[0].key);
    setValue("");
  };

  return (
    <div>
      <div className="badge blue">Conversiones</div>
      <p className="section-desc">
        Convierte entre unidades de medida de una misma magnitud física. Las <strong style={{ color: "var(--text)" }}>conversiones dobles</strong> permiten pasar por una unidad intermedia.
      </p>

      <div className="card">
        <div className="card-title"><span className="dot blue" /> Categoría</div>
        <div className="solve-for">
          {unitGroups.map((g, i) => (
            <button key={g.label}
              className={`solve-btn blue${groupIdx === i ? " active" : ""}`}
              onClick={() => handleGroupChange(i)}>
              {g.label}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="card-title"><span className="dot blue" /> Conversión Simple</div>
        <div className="inputs-grid">
          <div className="input-group">
            <label>Valor</label>
            <input type="number" placeholder="ej: 100" value={value} onChange={e => setValue(e.target.value)} />
          </div>
          <div className="input-group">
            <label>De</label>
            <select value={fromKey} onChange={e => setFromKey(e.target.value)}>
              {group.units.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
            </select>
          </div>
          <div className="input-group">
            <label>A</label>
            <select value={toKey} onChange={e => setToKey(e.target.value)}>
              {group.units.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
            </select>
          </div>
        </div>
        {result !== null ? (
          <div className="result-box" style={{ background: "rgba(0,201,255,0.08)", borderColor: "rgba(0,201,255,0.25)" }}>
            <div>
              <div className="result-label">Resultado</div>
              <div className="result-value blue">{fmt(result)} <span style={{ fontSize: 14 }}>{findUnit(toKey)?.label}</span></div>
            </div>
            <div className="result-formula">{fmt(num)} {fromKey} → {fmt(result)} {toKey}</div>
          </div>
        ) : (
          <div className="explanation blue">Ingresa un valor para convertir.</div>
        )}
      </div>

      <div className="card">
        <div className="card-title"><span className="dot blue" /> Conversión Doble</div>
        <div style={{ marginBottom: 16 }}>
          <button
            className={`solve-btn blue${showDouble ? " active" : ""}`}
            onClick={() => setShowDouble(p => !p)}>
            {showDouble ? "✓ Activada" : "Activar conversión doble"}
          </button>
        </div>
        {showDouble && (
          <>
            <div className="inputs-grid">
              <div className="input-group">
                <label>Valor inicial</label>
                <input type="number" placeholder="ej: 1000" value={value} onChange={e => setValue(e.target.value)} />
              </div>
              <div className="input-group">
                <label>De</label>
                <select value={fromKey} onChange={e => setFromKey(e.target.value)}>
                  {group.units.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Unidad intermedia</label>
                <select value={midKey} onChange={e => setMidKey(e.target.value)}>
                  {group.units.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Unidad final</label>
                <select value={toKey} onChange={e => setToKey(e.target.value)}>
                  {group.units.map(u => <option key={u.key} value={u.key}>{u.label}</option>)}
                </select>
              </div>
            </div>
            {isFinite(num) && mid !== null && final !== null ? (
              <>
                <div className="conv-chain">
                  <span className="conv-step">{fmt(num)} {fromKey}</span>
                  <span className="conv-arrow">→</span>
                  <span className="conv-step">{fmt(mid)} {midKey}</span>
                  <span className="conv-arrow">→</span>
                  <span className="conv-step" style={{ borderColor: "var(--accent1)", color: "var(--accent1)", background: "rgba(0,245,160,0.1)" }}>
                    {fmt(final)} {toKey}
                  </span>
                </div>
                <div className="result-box" style={{ background: "rgba(0,245,160,0.08)", borderColor: "rgba(0,245,160,0.25)" }}>
                  <div>
                    <div className="result-label">Resultado final</div>
                    <div className="result-value">{fmt(final)} <span style={{ fontSize: 14 }}>{findUnit(toKey)?.label}</span></div>
                  </div>
                  <div className="result-formula">{fromKey} → {midKey} → {toKey}</div>
                </div>
              </>
            ) : (
              <div className="explanation blue">Ingresa un valor y selecciona las unidades.</div>
            )}
          </>
        )}
        {!showDouble && (
          <div className="explanation blue">
            Una <strong>conversión doble</strong> convierte primero a una unidad intermedia y luego al destino final. Útil cuando no existe factor directo entre dos unidades.
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EFECTO DOPPLER
// ─────────────────────────────────────────────────────────────────────────────
const SOUND_SPEED = 343; // m/s en aire a 20°C

function DopplerEffect() {
  const [mode, setMode] = useState<"fo" | "fs" | "vs" | "vo">("fo");
  const [vals, setVals] = useState({ fo: "", fs: "", vs: String(SOUND_SPEED), vo: "0" });

  const set = (k: string, v: string) => setVals(p => ({ ...p, [k]: v }));

  const result = (() => {
    const fo = parse(vals.fo), fs = parse(vals.fs),
      vs = parse(vals.vs), vo = parse(vals.vo);
    try {
      if (mode === "fo") {
        if (!isFinite(fs) || !isFinite(vs) || !isFinite(vo)) return null;
        if (vs - vo === 0) return { error: "vs - vo no puede ser 0" };
        return { value: fs * (vs + vo) / (vs - vo), unit: "Hz", formula: `fo = ${fmt(fs)} × (${fmt(vs)} + ${fmt(vo)}) / (${fmt(vs)} - ${fmt(vo)})` };
      }
      if (mode === "fs") {
        if (!isFinite(fo) || !isFinite(vs) || !isFinite(vo)) return null;
        if (vs + vo === 0) return { error: "vs + vo no puede ser 0" };
        return { value: fo * (vs - vo) / (vs + vo), unit: "Hz", formula: `fs = ${fmt(fo)} × (${fmt(vs)} - ${fmt(vo)}) / (${fmt(vs)} + ${fmt(vo)})` };
      }
      if (mode === "vs") {
        if (!isFinite(fo) || !isFinite(fs) || !isFinite(vo)) return null;
        if (fo === fs) return { error: "fo y fs son iguales, vs indeterminado" };
        return { value: (fo * vo + fs * vo) / (fo - fs), unit: "m/s", formula: "Despejando vs de la ecuación" };
      }
      if (mode === "vo") {
        if (!isFinite(fo) || !isFinite(fs) || !isFinite(vs)) return null;
        if (fs === 0) return { error: "fs no puede ser 0" };
        return { value: vs * (fo / fs - 1) / (1 + fo / fs), unit: "m/s", formula: "Despejando vo de la ecuación" };
      }
    } catch { return null; }
    return null;
  })();

  const labels: Record<string, string> = {
    fo: "Frecuencia observada (fo)", fs: "Frecuencia de la fuente (fs)",
    vs: "Velocidad del sonido (vs)", vo: "Velocidad del observador (vo)",
  };
  const placeholders: Record<string, string> = {
    fo: "ej: 440", fs: "ej: 400", vs: "343", vo: "ej: 0",
  };
  const allKeys = ["fo", "fs", "vs", "vo"];

  return (
    <div>
      <div className="badge orange">Efecto Doppler</div>
      <p className="section-desc">
        El efecto Doppler es el cambio aparente en la frecuencia de una onda cuando la fuente y el observador están en movimiento relativo.
      </p>

      <div className="card">
        <div className="card-title"><span className="dot orange" /> Fórmula General</div>
        <div className="wave-visual">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="wave-bar" style={{ animationDelay: `${i * 0.06}s` }} />
          ))}
        </div>
        <div className="formula-box" style={{ borderColor: "rgba(245,166,35,0.3)" }}>
          <span className="highlight orange">fo</span> = <span className="highlight">fs</span> × (<span className="highlight blue">vs</span> + <span className="highlight blue">vo</span>) / (<span className="highlight blue">vs</span> − <span className="highlight orange">vo<sub style={{ fontSize: 10 }}>fuente</sub></span>)
        </div>
        <div className="explanation orange" style={{ marginTop: 16 }}>
          <strong>fo</strong> = frecuencia percibida por el observador &nbsp;|&nbsp; <strong>fs</strong> = frecuencia emitida por la fuente<br />
          <strong>vs</strong> = velocidad del sonido en el medio (343 m/s en aire) &nbsp;|&nbsp; <strong>vo</strong> = velocidad del observador<br /><br />
          + si el observador se acerca a la fuente → tono más agudo<br />
          − si el observador se aleja de la fuente → tono más grave
        </div>
      </div>

      <div className="card">
        <div className="card-title"><span className="dot orange" /> Calculadora Doppler</div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12, fontFamily: "var(--font-mono)" }}>¿Qué quieres calcular?</p>
        <div className="solve-for">
          {(["fo", "fs", "vs", "vo"] as const).map(k => (
            <button key={k}
              className={`solve-btn orange${mode === k ? " active" : ""}`}
              onClick={() => setMode(k)}>
              {k === "fo" ? "Frec. observada" : k === "fs" ? "Frec. fuente" : k === "vs" ? "Vel. sonido" : "Vel. observador"}
            </button>
          ))}
        </div>
        <div className="inputs-grid">
          {allKeys.filter(k => k !== mode).map(k => (
            <div key={k} className="input-group">
              <label>{labels[k]}</label>
              <input
                type="number"
                placeholder={placeholders[k]}
                value={vals[k]}
                onChange={e => set(k, e.target.value)}
              />
            </div>
          ))}
        </div>
        {result ? (
          "error" in result ? (
            <div className="result-box error">
              <div className="result-value">{result.error}</div>
            </div>
          ) : (
            <div className="result-box" style={{ background: "rgba(245,166,35,0.08)", borderColor: "rgba(245,166,35,0.25)" }}>
              <div>
                <div className="result-label">Resultado — {labels[mode]}</div>
                <div className="result-value orange">{fmt(result.value)} <span style={{ fontSize: 14 }}>{result.unit}</span></div>
              </div>
              <div className="result-formula">{result.formula}</div>
            </div>
          )
        ) : (
          <div className="explanation orange">Ingresa los valores para calcular.</div>
        )}
      </div>

      <div className="card">
        <div className="card-title"><span className="dot orange" /> Ejemplos Prácticos</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
          {[
            { title: "Ambulancia en reposo", desc: "Una ambulancia emite 700 Hz. Observador a 30 m/s acercándose.", fo: "761.2 Hz" },
            { title: "Tren a 60 km/h", desc: "Tren silba a 500 Hz. Observador estático. vs = 343 m/s.", fo: "≈ 574 Hz (acercándose)" },
            { title: "Estrella alejándose", desc: "Luz roja observada → frecuencia disminuye (redshift).", fo: "< fs" },
          ].map(ex => (
            <div key={ex.title} style={{ background: "#0d0d14", border: "1px solid var(--border)", borderRadius: 8, padding: "16px 18px" }}>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, color: "var(--accent3)" }}>{ex.title}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, fontFamily: "var(--font-mono)" }}>{ex.desc}</div>
              <div style={{ marginTop: 8, fontSize: 13, color: "var(--text)", fontFamily: "var(--font-mono)", fontWeight: 700 }}>{ex.fo}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
const tabs = [
  { id: "ohm", label: "① Ley de Ohm" },
  { id: "conv", label: "② Conversiones" },
  { id: "doppler", label: "③ Efecto Doppler" },
];

export default function App() {
  const [tab, setTab] = useState("ohm");

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="header-tag">Física Interactiva</div>
          <h1>Laboratorio <span>Virtual</span></h1>
          <p>Aprende y practica conceptos fundamentales de física y electrónica</p>
        </header>

        <div className="tabs">
          {tabs.map(t => (
            <button key={t.id} className={`tab-btn${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="content">
          {tab === "ohm" && <OhmLaw />}
          {tab === "conv" && <Conversions />}
          {tab === "doppler" && <DopplerEffect />}
        </div>
      </div>
    </>
  );
}