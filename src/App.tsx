import { useState } from "react";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n: number, decimals = 4): string => {
  if (!isFinite(n)) return "—";
  if (Math.abs(n) >= 1e6 || (Math.abs(n) < 1e-3 && n !== 0))
    return n.toExponential(3);
  return parseFloat(n.toFixed(decimals)).toString();
};

const parse = (s: string): number => parseFloat(s.replace(",", "."));

// ─── Shared UI primitives ─────────────────────────────────────────────────────

interface BadgeProps { children: React.ReactNode; variant: "green" | "blue" | "orange" }
const Badge = ({ children, variant }: BadgeProps) => {
  const cls: Record<BadgeProps["variant"], string> = {
    green:  "bg-accent1/15 text-accent1",
    blue:   "bg-accent2/15 text-accent2",
    orange: "bg-accent3/15 text-accent3",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded font-mono text-2xs font-bold tracking-widest uppercase mb-2 ${cls[variant]}`}>
      {children}
    </span>
  );
};

const SectionDesc = ({ children }: { children: React.ReactNode }) => (
  <p className="font-mono text-[13px] text-muted leading-relaxed mb-6">{children}</p>
);

interface DotProps { variant?: "green" | "blue" | "orange" }
const Dot = ({ variant = "green" }: DotProps) => {
  const cls: Record<string, string> = {
    green:  "bg-accent1",
    blue:   "bg-accent2",
    orange: "bg-accent3",
  };
  return <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${cls[variant]}`} />;
};

interface CardProps { children: React.ReactNode; className?: string }
const Card = ({ children, className = "" }: CardProps) => (
  <div className={`bg-panel border border-border rounded-xl p-7 mb-5 ${className}`}>
    {children}
  </div>
);

interface CardTitleProps { children: React.ReactNode; dot?: "green" | "blue" | "orange" }
const CardTitle = ({ children, dot = "green" }: CardTitleProps) => (
  <div className="flex items-center gap-2 font-mono text-[13px] font-bold tracking-widest uppercase text-muted mb-5">
    <Dot variant={dot} />
    {children}
  </div>
);

interface FormulaBoxProps { children: React.ReactNode; borderColor?: string }
const FormulaBox = ({ children, borderColor }: FormulaBoxProps) => (
  <div
    className="formula-box relative overflow-hidden bg-surface border border-border rounded-lg px-6 py-5 font-mono text-xl text-center tracking-widest mb-6"
    style={borderColor ? { borderColor } : undefined}
  >
    {children}
  </div>
);

interface ExplanationProps { children: React.ReactNode; variant?: "green" | "blue" | "orange" }
const Explanation = ({ children, variant = "green" }: ExplanationProps) => {
  const border: Record<string, string> = {
    green:  "border-accent1",
    blue:   "border-accent2",
    orange: "border-accent3",
  };
  return (
    <div className={`bg-surface border-l-[3px] ${border[variant]} rounded-r-lg px-5 py-4 font-mono text-[13px] text-muted leading-[1.7]`}>
      {children}
    </div>
  );
};

interface ResultBoxProps {
  children: React.ReactNode;
  variant?: "green" | "blue" | "orange" | "error";
}
const ResultBox = ({ children, variant = "green" }: ResultBoxProps) => {
  const styles: Record<string, React.CSSProperties> = {
    green:  { background: "rgba(0,245,160,0.08)",  borderColor: "rgba(0,245,160,0.25)" },
    blue:   { background: "rgba(0,201,255,0.08)",  borderColor: "rgba(0,201,255,0.25)" },
    orange: { background: "rgba(245,166,35,0.08)", borderColor: "rgba(245,166,35,0.25)" },
    error:  { background: "rgba(255,77,109,0.08)", borderColor: "rgba(255,77,109,0.25)" },
  };
  return (
    <div
      className="border rounded-lg px-6 py-5 flex items-center justify-between gap-4 flex-wrap"
      style={styles[variant]}
    >
      {children}
    </div>
  );
};

const ResultValue = ({ children, variant = "green" }: { children: React.ReactNode; variant?: "green" | "blue" | "orange" | "error" }) => {
  const cls: Record<string, string> = {
    green:  "text-accent1",
    blue:   "text-accent2",
    orange: "text-accent3",
    error:  "text-error text-sm",
  };
  return (
    <div className={`font-mono text-[28px] font-bold ${cls[variant]}`}>{children}</div>
  );
};

interface SolveBtnProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "green" | "blue" | "orange";
}
const SolveBtn = ({ active, onClick, children, variant = "green" }: SolveBtnProps) => {
  const activeStyles: Record<string, React.CSSProperties> = {
    green:  { background: "rgba(0,245,160,0.12)",  borderColor: "#00f5a0", color: "#00f5a0" },
    blue:   { background: "rgba(0,201,255,0.12)",  borderColor: "#00c9ff", color: "#00c9ff" },
    orange: { background: "rgba(245,166,35,0.12)", borderColor: "#f5a623", color: "#f5a623" },
  };
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full border border-border font-mono text-xs text-muted cursor-pointer transition-all duration-200 tracking-wider"
      style={active ? activeStyles[variant] : undefined}
    >
      {children}
    </button>
  );
};

const InputGroup = ({
  label, value, onChange, placeholder, type = "number",
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}) => (
  <div>
    <label className="block font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-muted mb-2">
      {label}
    </label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-surface border border-border rounded-lg px-[14px] py-3 text-text font-mono text-[15px] transition-colors duration-200 focus:outline-none focus:border-accent1 placeholder:text-muted appearance-none"
    />
  </div>
);

const SelectGroup = ({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { key: string; label: string }[];
}) => (
  <div>
    <label className="block font-mono text-[11px] font-semibold tracking-[1.5px] uppercase text-muted mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-surface border border-border rounded-lg px-[14px] py-3 text-text font-mono text-[15px] transition-colors duration-200 focus:outline-none focus:border-accent1 appearance-none cursor-pointer"
    >
      {options.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
    </select>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// 1. LEY DE OHM
// ─────────────────────────────────────────────────────────────────────────────
type OhmVar = "V" | "I" | "R";

function OhmLaw() {
  const [solve, setSolve] = useState<OhmVar>("V");
  const [vals, setVals] = useState<Record<OhmVar, string>>({ V: "", I: "", R: "" });

  const set = (k: OhmVar, v: string) => setVals(p => ({ ...p, [k]: v }));

  const result = (() => {
    const V = parse(vals.V), I = parse(vals.I), R = parse(vals.R);
    if (solve === "V") {
      if (!isFinite(I) || !isFinite(R)) return null;
      return { value: I * R, unit: "V (Voltios)", formula: `V = ${fmt(I)} × ${fmt(R)}`, variant: "green" as const };
    }
    if (solve === "I") {
      if (!isFinite(V) || !isFinite(R) || R === 0) return null;
      return { value: V / R, unit: "A (Amperios)", formula: `I = ${fmt(V)} ÷ ${fmt(R)}`, variant: "blue" as const };
    }
    if (solve === "R") {
      if (!isFinite(V) || !isFinite(I) || I === 0) return null;
      return { value: V / I, unit: "Ω (Ohmios)", formula: `R = ${fmt(V)} ÷ ${fmt(I)}`, variant: "orange" as const };
    }
    return null;
  })();

  const allInputs: { key: OhmVar; label: string; placeholder: string }[] = [
    { key: "V", label: "Voltaje (V)",      placeholder: "ej: 12" },
    { key: "I", label: "Corriente (I)",    placeholder: "ej: 2"  },
    { key: "R", label: "Resistencia (R)",  placeholder: "ej: 6"  },
  ];

  const triActive = (k: OhmVar) => solve === k;

  return (
    <div>
      <Badge variant="green">Ley de Ohm</Badge>
      <SectionDesc>
        La Ley de Ohm establece que la tensión entre dos puntos de un conductor es directamente proporcional a la intensidad de corriente.{" "}
        <strong className="text-text">V = I × R</strong>
      </SectionDesc>

      {/* Triángulo */}
      <Card>
        <CardTitle dot="green">Triángulo de la Ley de Ohm</CardTitle>
        <div className="flex justify-center mb-6">
          <div className="relative w-[180px] h-[160px]">
            {/* V — top */}
            <div
              className={`absolute top-0 left-1/2 flex flex-col items-center justify-center w-[70px] h-[70px] rounded-full font-mono font-bold text-lg border-2 border-accent1 bg-accent1/15 text-accent1 transition-all duration-300 ${triActive("V") ? "scale-[1.15]" : ""}`}
              style={{ transform: `translateX(-50%) ${triActive("V") ? "scale(1.15)" : "scale(1)"}` }}
            >
              V<span className="text-[9px] text-muted tracking-wider mt-0.5">Voltaje</span>
            </div>
            {/* I — bottom left */}
            <div
              className={`absolute bottom-0 left-0 flex flex-col items-center justify-center w-[70px] h-[70px] rounded-full font-mono font-bold text-lg border-2 border-accent2 bg-accent2/15 text-accent2 transition-all duration-300 ${triActive("I") ? "scale-[1.15]" : ""}`}
            >
              I<span className="text-[9px] text-muted tracking-wider mt-0.5">Corriente</span>
            </div>
            {/* R — bottom right */}
            <div
              className={`absolute bottom-0 right-0 flex flex-col items-center justify-center w-[70px] h-[70px] rounded-full font-mono font-bold text-lg border-2 border-accent3 bg-accent3/15 text-accent3 transition-all duration-300 ${triActive("R") ? "scale-[1.15]" : ""}`}
            >
              R<span className="text-[9px] text-muted tracking-wider mt-0.5">Resistencia</span>
            </div>
          </div>
        </div>
        <FormulaBox>
          <span className="text-accent1">V</span>
          {" = "}
          <span className="text-accent2">I</span>
          {" × "}
          <span className="text-accent3">R</span>
        </FormulaBox>
      </Card>

      {/* Calculadora */}
      <Card>
        <CardTitle dot="blue">Calculadora</CardTitle>
        <p className="font-mono text-xs text-muted mb-3">¿Qué quieres calcular?</p>
        <div className="flex gap-2 mb-5 flex-wrap">
          {(["V", "I", "R"] as OhmVar[]).map(k => (
            <SolveBtn
              key={k}
              active={solve === k}
              onClick={() => setSolve(k)}
              variant={k === "V" ? "green" : k === "I" ? "blue" : "orange"}
            >
              {k === "V" ? "Voltaje (V)" : k === "I" ? "Corriente (I)" : "Resistencia (R)"}
            </SolveBtn>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-5">
          {allInputs.filter(i => i.key !== solve).map(({ key, label, placeholder }) => (
            <InputGroup key={key} label={label} placeholder={placeholder} value={vals[key]} onChange={v => set(key, v)} />
          ))}
        </div>
        {result ? (
          <ResultBox variant={result.variant}>
            <div>
              <div className="font-mono text-[11px] tracking-widest uppercase text-muted mb-1">Resultado</div>
              <ResultValue variant={result.variant}>
                {fmt(result.value)} <span className="text-sm font-normal">{result.unit}</span>
              </ResultValue>
            </div>
            <div className="font-mono text-xs text-muted text-right">{result.formula}</div>
          </ResultBox>
        ) : (
          <Explanation>Ingresa los valores conocidos para calcular el resultado.</Explanation>
        )}
      </Card>

      {/* Derivaciones */}
      <Card>
        <CardTitle dot="green">Derivaciones</CardTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
          {[
            { f: "V = I × R", c: "#00f5a0" },
            { f: "I = V ÷ R", c: "#00c9ff" },
            { f: "R = V ÷ I", c: "#f5a623" },
          ].map(({ f, c }) => (
            <div
              key={f}
              className="relative overflow-hidden bg-surface border rounded-lg px-6 py-5 font-mono text-[15px] text-center tracking-widest"
              style={{ borderColor: c }}
            >
              <span style={{ color: c }}>{f}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONVERSIONES
// ─────────────────────────────────────────────────────────────────────────────
interface UnitDef { key: string; label: string; toBase: (v: number) => number; fromBase: (v: number) => number }
interface UnitGroup { label: string; units: UnitDef[] }

const unitGroups: UnitGroup[] = [
  {
    label: "Longitud",
    units: [
      { key: "m",  label: "Metro (m)",        toBase: v => v,            fromBase: v => v },
      { key: "km", label: "Kilómetro (km)",    toBase: v => v * 1000,     fromBase: v => v / 1000 },
      { key: "cm", label: "Centímetro (cm)",   toBase: v => v / 100,      fromBase: v => v * 100 },
      { key: "mm", label: "Milímetro (mm)",    toBase: v => v / 1000,     fromBase: v => v * 1000 },
      { key: "mi", label: "Milla (mi)",        toBase: v => v * 1609.34,  fromBase: v => v / 1609.34 },
      { key: "ft", label: "Pie (ft)",          toBase: v => v * 0.3048,   fromBase: v => v / 0.3048 },
      { key: "in", label: "Pulgada (in)",      toBase: v => v * 0.0254,   fromBase: v => v / 0.0254 },
    ],
  },
  {
    label: "Masa",
    units: [
      { key: "kg", label: "Kilogramo (kg)",  toBase: v => v,            fromBase: v => v },
      { key: "g",  label: "Gramo (g)",       toBase: v => v / 1000,     fromBase: v => v * 1000 },
      { key: "mg", label: "Miligramo (mg)",  toBase: v => v / 1e6,      fromBase: v => v * 1e6 },
      { key: "lb", label: "Libra (lb)",      toBase: v => v * 0.453592, fromBase: v => v / 0.453592 },
      { key: "oz", label: "Onza (oz)",       toBase: v => v * 0.0283495,fromBase: v => v / 0.0283495 },
      { key: "t",  label: "Tonelada (t)",    toBase: v => v * 1000,     fromBase: v => v / 1000 },
    ],
  },
  {
    label: "Temperatura",
    units: [
      { key: "C", label: "Celsius (°C)",    toBase: v => v,           fromBase: v => v },
      { key: "F", label: "Fahrenheit (°F)", toBase: v => (v-32)*5/9,  fromBase: v => v*9/5+32 },
      { key: "K", label: "Kelvin (K)",      toBase: v => v - 273.15,  fromBase: v => v + 273.15 },
    ],
  },
  {
    label: "Velocidad",
    units: [
      { key: "ms",  label: "m/s",  toBase: v => v,           fromBase: v => v },
      { key: "kmh", label: "km/h", toBase: v => v / 3.6,     fromBase: v => v * 3.6 },
      { key: "mph", label: "mi/h", toBase: v => v * 0.44704, fromBase: v => v / 0.44704 },
      { key: "kn",  label: "Nudo", toBase: v => v * 0.514444,fromBase: v => v / 0.514444 },
    ],
  },
  {
    label: "Tiempo",
    units: [
      { key: "s",   label: "Segundo (s)",  toBase: v => v,         fromBase: v => v },
      { key: "min", label: "Minuto (min)", toBase: v => v * 60,    fromBase: v => v / 60 },
      { key: "h",   label: "Hora (h)",     toBase: v => v * 3600,  fromBase: v => v / 3600 },
      { key: "d",   label: "Día (d)",      toBase: v => v * 86400, fromBase: v => v / 86400 },
    ],
  },
];

function Conversions() {
  const [groupIdx, setGroupIdx]   = useState(0);
  const [fromKey,  setFromKey]    = useState("m");
  const [toKey,    setToKey]      = useState("km");
  const [midKey,   setMidKey]     = useState("cm");
  const [value,    setValue]      = useState("");
  const [showDouble, setShowDouble] = useState(false);

  const group = unitGroups[groupIdx];
  const findUnit = (k: string): UnitDef | undefined => group.units.find(u => u.key === k);

  const convert = (v: number, from: string, to: string): number => {
    const fu = findUnit(from), tu = findUnit(to);
    if (!fu || !tu) return NaN;
    return tu.fromBase(fu.toBase(v));
  };

  const num    = parse(value);
  const result = isFinite(num) ? convert(num, fromKey, toKey) : null;
  const mid    = isFinite(num) && showDouble ? convert(num, fromKey, midKey) : null;
  const final  = mid !== null ? convert(mid, midKey, toKey) : null;

  const handleGroupChange = (idx: number) => {
    setGroupIdx(idx);
    const g = unitGroups[idx];
    setFromKey(g.units[0].key);
    setToKey(g.units[1]?.key ?? g.units[0].key);
    setMidKey(g.units[2]?.key ?? g.units[1]?.key ?? g.units[0].key);
    setValue("");
  };

  return (
    <div>
      <Badge variant="blue">Conversiones</Badge>
      <SectionDesc>
        Convierte entre unidades de medida de una misma magnitud física.{" "}
        Las <strong className="text-text">conversiones dobles</strong> permiten pasar por una unidad intermedia.
      </SectionDesc>

      {/* Categoría */}
      <Card>
        <CardTitle dot="blue">Categoría</CardTitle>
        <div className="flex gap-2 flex-wrap">
          {unitGroups.map((g, i) => (
            <SolveBtn key={g.label} active={groupIdx === i} onClick={() => handleGroupChange(i)} variant="blue">
              {g.label}
            </SolveBtn>
          ))}
        </div>
      </Card>

      {/* Simple */}
      <Card>
        <CardTitle dot="blue">Conversión Simple</CardTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-5">
          <InputGroup label="Valor" placeholder="ej: 100" value={value} onChange={setValue} />
          <SelectGroup label="De" value={fromKey} onChange={setFromKey} options={group.units.map(u => ({ key: u.key, label: u.label }))} />
          <SelectGroup label="A"  value={toKey}   onChange={setToKey}   options={group.units.map(u => ({ key: u.key, label: u.label }))} />
        </div>
        {result !== null ? (
          <ResultBox variant="blue">
            <div>
              <div className="font-mono text-[11px] tracking-widest uppercase text-muted mb-1">Resultado</div>
              <ResultValue variant="blue">
                {fmt(result)} <span className="text-sm font-normal">{findUnit(toKey)?.label}</span>
              </ResultValue>
            </div>
            <div className="font-mono text-xs text-muted text-right">{fmt(num)} {fromKey} → {fmt(result)} {toKey}</div>
          </ResultBox>
        ) : (
          <Explanation variant="blue">Ingresa un valor para convertir.</Explanation>
        )}
      </Card>

      {/* Doble */}
      <Card>
        <CardTitle dot="blue">Conversión Doble</CardTitle>
        <div className="mb-4">
          <SolveBtn active={showDouble} onClick={() => setShowDouble(p => !p)} variant="blue">
            {showDouble ? "✓ Activada" : "Activar conversión doble"}
          </SolveBtn>
        </div>

        {showDouble ? (
          <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-5">
              <InputGroup label="Valor inicial" placeholder="ej: 1000" value={value} onChange={setValue} />
              <SelectGroup label="De"               value={fromKey} onChange={setFromKey} options={group.units.map(u => ({ key: u.key, label: u.label }))} />
              <SelectGroup label="Unidad intermedia" value={midKey}  onChange={setMidKey}  options={group.units.map(u => ({ key: u.key, label: u.label }))} />
              <SelectGroup label="Unidad final"      value={toKey}   onChange={setToKey}   options={group.units.map(u => ({ key: u.key, label: u.label }))} />
            </div>
            {isFinite(num) && mid !== null && final !== null ? (
              <>
                {/* cadena */}
                <div className="flex items-center gap-2 flex-wrap my-4 font-mono text-[13px]">
                  {[
                    { label: `${fmt(num)} ${fromKey}`,  color: undefined },
                    { label: "→",                        arrow: true },
                    { label: `${fmt(mid)} ${midKey}`,   color: undefined },
                    { label: "→",                        arrow: true },
                    { label: `${fmt(final)} ${toKey}`,  final: true },
                  ].map((item, i) =>
                    "arrow" in item ? (
                      <span key={i} className="text-muted text-lg">→</span>
                    ) : "final" in item ? (
                      <span key={i} className="px-3 py-1.5 rounded-md border border-accent1/40 bg-accent1/10 text-accent1">{item.label}</span>
                    ) : (
                      <span key={i} className="px-3 py-1.5 rounded-md border border-accent2/20 bg-accent2/10 text-accent2">{item.label}</span>
                    )
                  )}
                </div>
                <ResultBox variant="green">
                  <div>
                    <div className="font-mono text-[11px] tracking-widest uppercase text-muted mb-1">Resultado final</div>
                    <ResultValue variant="green">
                      {fmt(final)} <span className="text-sm font-normal">{findUnit(toKey)?.label}</span>
                    </ResultValue>
                  </div>
                  <div className="font-mono text-xs text-muted text-right">{fromKey} → {midKey} → {toKey}</div>
                </ResultBox>
              </>
            ) : (
              <Explanation variant="blue">Ingresa un valor y selecciona las unidades.</Explanation>
            )}
          </>
        ) : (
          <Explanation variant="blue">
            Una <strong>conversión doble</strong> convierte primero a una unidad intermedia y luego al destino final.
            Útil cuando no existe factor directo entre dos unidades.
          </Explanation>
        )}
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. EFECTO DOPPLER
// ─────────────────────────────────────────────────────────────────────────────
type DopplerVar = "fo" | "fs" | "vs" | "vo";

const SOUND_SPEED = 343;

function DopplerEffect() {
  const [mode, setMode] = useState<DopplerVar>("fo");
  const [vals, setVals] = useState<Record<DopplerVar, string>>({
    fo: "", fs: "", vs: String(SOUND_SPEED), vo: "0",
  });

  const set = (k: DopplerVar, v: string) => setVals(p => ({ ...p, [k]: v }));

  const result = (() => {
    const fo = parse(vals.fo), fs = parse(vals.fs),
          vs = parse(vals.vs), vo = parse(vals.vo);
    try {
      if (mode === "fo") {
        if (!isFinite(fs)||!isFinite(vs)||!isFinite(vo)) return null;
        if (vs - vo === 0) return { error: "vs − vo no puede ser 0" };
        return { value: fs*(vs+vo)/(vs-vo), unit: "Hz", formula: `fo = ${fmt(fs)} × (${fmt(vs)} + ${fmt(vo)}) / (${fmt(vs)} − ${fmt(vo)})` };
      }
      if (mode === "fs") {
        if (!isFinite(fo)||!isFinite(vs)||!isFinite(vo)) return null;
        if (vs + vo === 0) return { error: "vs + vo no puede ser 0" };
        return { value: fo*(vs-vo)/(vs+vo), unit: "Hz", formula: `fs = ${fmt(fo)} × (${fmt(vs)} − ${fmt(vo)}) / (${fmt(vs)} + ${fmt(vo)})` };
      }
      if (mode === "vs") {
        if (!isFinite(fo)||!isFinite(fs)||!isFinite(vo)) return null;
        if (fo === fs) return { error: "fo y fs son iguales, vs indeterminado" };
        return { value: (fo*vo + fs*vo)/(fo-fs), unit: "m/s", formula: "Despejando vs de la ecuación" };
      }
      if (mode === "vo") {
        if (!isFinite(fo)||!isFinite(fs)||!isFinite(vs)) return null;
        if (fs === 0) return { error: "fs no puede ser 0" };
        return { value: vs*(fo/fs-1)/(1+fo/fs), unit: "m/s", formula: "Despejando vo de la ecuación" };
      }
    } catch { return null; }
    return null;
  })();

  const labels: Record<DopplerVar, string> = {
    fo: "Frecuencia observada (fo)", fs: "Frecuencia de la fuente (fs)",
    vs: "Velocidad del sonido (vs)", vo: "Velocidad del observador (vo)",
  };
  const placeholders: Record<DopplerVar, string> = {
    fo: "ej: 440", fs: "ej: 400", vs: "343", vo: "ej: 0",
  };
  const allKeys: DopplerVar[] = ["fo","fs","vs","vo"];

  return (
    <div>
      <Badge variant="orange">Efecto Doppler</Badge>
      <SectionDesc>
        El efecto Doppler es el cambio aparente en la frecuencia de una onda cuando la fuente y el observador están en movimiento relativo.
      </SectionDesc>

      {/* Fórmula */}
      <Card>
        <CardTitle dot="orange">Fórmula General</CardTitle>

        {/* Wave bars */}
        <div className="flex items-center justify-center gap-1 mb-4 h-12 overflow-hidden">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="w-1 rounded-sm bg-accent2 animate-wave"
              style={{ animationDelay: `${i * 0.06}s` }}
            />
          ))}
        </div>

        <FormulaBox borderColor="rgba(245,166,35,0.3)">
          <span className="text-accent3">fo</span>
          {" = "}
          <span className="text-accent1">fs</span>
          {" × ("}
          <span className="text-accent2">vs</span>
          {" + "}
          <span className="text-accent2">vo</span>
          {") / ("}
          <span className="text-accent2">vs</span>
          {" − "}
          <span className="text-accent3">vo<sub className="text-[10px]">fuente</sub></span>
          {")"}
        </FormulaBox>

        <Explanation variant="orange">
          <strong>fo</strong> = frecuencia percibida por el observador &nbsp;|&nbsp;{" "}
          <strong>fs</strong> = frecuencia emitida por la fuente<br />
          <strong>vs</strong> = velocidad del sonido en el medio (343 m/s en aire) &nbsp;|&nbsp;{" "}
          <strong>vo</strong> = velocidad del observador<br /><br />
          + si el observador se acerca a la fuente → tono más agudo<br />
          − si el observador se aleja de la fuente → tono más grave
        </Explanation>
      </Card>

      {/* Calculadora */}
      <Card>
        <CardTitle dot="orange">Calculadora Doppler</CardTitle>
        <p className="font-mono text-xs text-muted mb-3">¿Qué quieres calcular?</p>
        <div className="flex gap-2 flex-wrap mb-5">
          {allKeys.map(k => (
            <SolveBtn key={k} active={mode === k} onClick={() => setMode(k)} variant="orange">
              {k === "fo" ? "Frec. observada" : k === "fs" ? "Frec. fuente" : k === "vs" ? "Vel. sonido" : "Vel. observador"}
            </SolveBtn>
          ))}
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-5">
          {allKeys.filter(k => k !== mode).map(k => (
            <InputGroup
              key={k}
              label={labels[k]}
              placeholder={placeholders[k]}
              value={vals[k]}
              onChange={v => set(k, v)}
            />
          ))}
        </div>
        {result ? (
          "error" in result ? (
            <ResultBox variant="error">
              <ResultValue variant="error">{result.error}</ResultValue>
            </ResultBox>
          ) : (
            <ResultBox variant="orange">
              <div>
                <div className="font-mono text-[11px] tracking-widest uppercase text-muted mb-1">
                  Resultado — {labels[mode]}
                </div>
                <ResultValue variant="orange">
                  {fmt(result.value)} <span className="text-sm font-normal">{result.unit}</span>
                </ResultValue>
              </div>
              <div className="font-mono text-xs text-muted text-right">{result.formula}</div>
            </ResultBox>
          )
        ) : (
          <Explanation variant="orange">Ingresa los valores para calcular.</Explanation>
        )}
      </Card>

      {/* Ejemplos */}
      <Card>
        <CardTitle dot="orange">Ejemplos Prácticos</CardTitle>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
          {[
            { title: "Ambulancia en reposo",  desc: "Una ambulancia emite 700 Hz. Observador a 30 m/s acercándose.", fo: "761.2 Hz" },
            { title: "Tren a 60 km/h",        desc: "Tren silba a 500 Hz. Observador estático. vs = 343 m/s.",       fo: "≈ 574 Hz (acercándose)" },
            { title: "Estrella alejándose",   desc: "Luz roja observada → frecuencia disminuye (redshift).",         fo: "< fs" },
          ].map(ex => (
            <div key={ex.title} className="bg-surface border border-border rounded-lg p-4">
              <div className="font-bold text-[13px] text-accent3 mb-1.5">{ex.title}</div>
              <div className="font-mono text-xs text-muted leading-relaxed">{ex.desc}</div>
              <div className="mt-2 font-mono text-[13px] font-bold text-text">{ex.fo}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────────────────────────────────────────
const tabs = [
  { id: "ohm",     label: "① Ley de Ohm"      },
  { id: "conv",    label: "② Conversiones"     },
  { id: "doppler", label: "③ Efecto Doppler"   },
];

export default function App() {
  const [tab, setTab] = useState("ohm");

  return (
    <div className="min-h-screen bg-bg bg-app-glow">
      {/* Header */}
      <header className="header-accent relative px-6 pt-10 pb-6 text-center border-b border-border">
        <div className="font-mono text-[11px] tracking-[4px] uppercase text-accent1 mb-3">
          Física Interactiva
        </div>
        <h1 className="font-display font-extrabold tracking-tight leading-none" style={{ fontSize: "clamp(28px,5vw,52px)" }}>
          Laboratorio <span className="text-gradient">Virtual</span>
        </h1>
        <p className="mt-2.5 font-mono text-sm text-muted">
          Aprende y practica conceptos fundamentales de física y electrónica
        </p>
      </header>

      {/* Tabs */}
      <div className="flex gap-0 px-6 pt-6 max-w-[900px] mx-auto border-b border-border overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-[22px] py-3 bg-transparent border-none font-display font-semibold text-[13px] cursor-pointer border-b-2 transition-all duration-200 whitespace-nowrap tracking-[0.3px] ${
              tab === t.id
                ? "text-accent1 border-accent1"
                : "text-muted border-transparent hover:text-text"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-[900px] mx-auto px-6 pt-8 pb-16">
        {tab === "ohm"     && <OhmLaw />}
        {tab === "conv"    && <Conversions />}
        {tab === "doppler" && <DopplerEffect />}
      </div>
    </div>
  );
}