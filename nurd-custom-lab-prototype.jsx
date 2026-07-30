import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  Layers, Type, Image as ImageIcon, Square, Palette, Settings, HelpCircle,
  Undo2, Redo2, Eye, Save, ShoppingCart, ChevronLeft, ChevronRight, Plus,
  Trash2, Lock, Unlock, EyeOff, ArrowUp, ArrowDown, Copy, Grid3x3,
  ZoomIn, ZoomOut, Maximize2, Ruler, AlertTriangle, CheckCircle2, XCircle,
  X, Sparkles, Box, RotateCw, FlipHorizontal, FlipVertical, ChevronDown,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/* TOKENS                                                                  */
/* ---------------------------------------------------------------------- */
const C = {
  bg: "#08070B",
  panel: "#121019",
  panel2: "#1A1723",
  border: "#2A2534",
  borderLight: "#3A3448",
  violet: "#7A4DFF",
  violetDim: "#4A3480",
  gold: "#C9A24B",
  text: "#F3F1F8",
  textDim: "#9891AC",
  textFaint: "#655D78",
  error: "#EF5350",
  warning: "#E0A857",
  success: "#4ECB8D",
};

const FONT_LINK = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap";

/* ---------------------------------------------------------------------- */
/* PRODUCT DATA (mock admin database)                                     */
/* ---------------------------------------------------------------------- */
const PRODUCTS = [
  {
    id: "etb-style",
    name: "Custom ETB-Style Box",
    tag: "ETB-compatible display sleeve",
    basePrice: 39.99,
    dims: '11.75" × 7.5" × 2.75"',
    turnaround: "7–10 business days",
    minQty: 25,
    panels: ["front", "back", "left", "right", "top", "bottom"],
    panelDims: {
      front: { w: 7.5, h: 9.25 }, back: { w: 7.5, h: 9.25 },
      left: { w: 2.75, h: 9.25 }, right: { w: 2.75, h: 9.25 },
      top: { w: 7.5, h: 2.75 }, bottom: { w: 7.5, h: 2.75 },
    },
    finishes: ["Matte", "Gloss", "Soft-touch", "Holographic laminate", "Spot gloss", "Foil accents"],
    closures: ["Magnetic closure", "Standard tuck closure"],
  },
  {
    id: "booster-bundle",
    name: "Custom Booster Bundle Box",
    tag: "Booster bundle-compatible box",
    basePrice: 24.99,
    dims: '9" × 5" × 3.25"',
    turnaround: "5–8 business days",
    minQty: 25,
    panels: ["front", "back", "left", "right", "top", "bottom"],
    panelDims: {
      front: { w: 9, h: 3.25 }, back: { w: 9, h: 3.25 },
      left: { w: 5, h: 3.25 }, right: { w: 5, h: 3.25 },
      top: { w: 9, h: 5 }, bottom: { w: 9, h: 5 },
    },
    finishes: ["Matte", "Gloss", "Soft-touch", "Foil accents"],
    closures: ["Standard tuck closure"],
  },
  {
    id: "booster-display",
    name: "Custom Booster Display Box",
    tag: "Booster display-compatible box",
    basePrice: 34.99,
    dims: '14.5" × 3.75" × 3.75"',
    turnaround: "7–10 business days",
    minQty: 10,
    panels: ["front", "back", "left", "right", "top", "bottom", "interior"],
    panelDims: {
      front: { w: 14.5, h: 3.75 }, back: { w: 14.5, h: 3.75 },
      left: { w: 3.75, h: 3.75 }, right: { w: 3.75, h: 3.75 },
      top: { w: 14.5, h: 3.75 }, bottom: { w: 14.5, h: 3.75 },
      interior: { w: 14.5, h: 3.75 },
    },
    finishes: ["Matte", "Gloss", "Holographic laminate", "Spot gloss", "Foil accents"],
    closures: ["Standard tuck closure"],
  },
];

const OPTION_PRICES = {
  finish: { Matte: 0, Gloss: 0, "Soft-touch": 4, "Holographic laminate": 8, "Spot gloss": 5, "Foil accents": 6 },
  closure: { "Magnetic closure": 6, "Standard tuck closure": 0 },
  insert: { None: 0, "Standard insert": 4, "Custom insert": 6 },
  protectiveCase: 5,
  customLabel: 3,
  barcode: 2,
  numberedEdition: 4,
};

const TEMPLATES = [
  { id: "blank", name: "Blank", cat: "Blank", bg: "#1A1723" },
  { id: "minimal", name: "Minimal Frame", cat: "Minimal", bg: "#F3F1F8" },
  { id: "dark-lab", name: "Dark Lab", cat: "Dark", bg: "#0D0B12" },
  { id: "neon-grid", name: "Neon Grid", cat: "Neon", bg: "#0B0F1A" },
  { id: "retro-stripe", name: "Retro Stripe", cat: "Retro", bg: "#2B1E14" },
  { id: "comic-burst", name: "Comic Burst", cat: "Comic-inspired", bg: "#1B1030" },
  { id: "collector", name: "Collector Case", cat: "Collector display", bg: "#14110C" },
  { id: "luxury-gold", name: "Luxury Gold", cat: "Luxury", bg: "#0F0D0A" },
];

const FONTS = ["Space Grotesk", "Inter", "JetBrains Mono", "Georgia", "Courier New", "Impact"];

const uid = () => Math.random().toString(36).slice(2, 10);

/* ---------------------------------------------------------------------- */
/* SHARED UI BITS                                                         */
/* ---------------------------------------------------------------------- */
function Logo({ size = 22 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
      <div style={{
        width: size, height: size, borderRadius: 6, background: `linear-gradient(135deg, ${C.violet}, #4A2FA8)`,
        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        boxShadow: `0 0 14px ${C.violetDim}`,
      }}>
        <div style={{ width: size * 0.4, height: size * 0.4, border: `2px solid ${C.text}`, transform: "rotate(45deg)" }} />
      </div>
      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, letterSpacing: 0.3 }}>
        PROJECT.NURD
      </span>
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style, disabled, small }) {
  const base = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 600,
    fontSize: small ? 12.5 : 13.5,
    padding: small ? "7px 13px" : "11px 22px",
    borderRadius: 7,
    cursor: disabled ? "not-allowed" : "pointer",
    border: "1px solid transparent",
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    transition: "all .15s ease",
    opacity: disabled ? 0.4 : 1,
    letterSpacing: 0.2,
  };
  const variants = {
    primary: { background: C.violet, color: "#fff", boxShadow: `0 0 0 rgba(0,0,0,0)` },
    ghost: { background: "transparent", color: C.text, border: `1px solid ${C.border}` },
    gold: { background: "transparent", color: C.gold, border: `1px solid ${C.gold}55` },
    subtle: { background: C.panel2, color: C.textDim, border: `1px solid ${C.border}` },
    danger: { background: "transparent", color: C.error, border: `1px solid ${C.error}55` },
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...style }}
      onMouseEnter={(e) => { if (!disabled && variant === "primary") e.currentTarget.style.background = "#8D62FF"; }}
      onMouseLeave={(e) => { if (!disabled && variant === "primary") e.currentTarget.style.background = C.violet; }}
    >
      {children}
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10.5, color: C.textFaint, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 6, fontWeight: 600 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", background: C.bg, border: `1px solid ${C.border}`, borderRadius: 6,
  color: C.text, padding: "8px 10px", fontSize: 13, fontFamily: "'Inter', sans-serif", outline: "none",
};

const selectStyle = { ...inputStyle, appearance: "none", cursor: "pointer" };

/* ---------------------------------------------------------------------- */
/* LANDING                                                                 */
/* ---------------------------------------------------------------------- */
function Landing({ onStart, onSelectProduct }) {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 40px", borderBottom: `1px solid ${C.border}` }}>
        <Logo />
        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" small onClick={onStart}>My Designs</Btn>
          <Btn variant="primary" small onClick={onStart}>Start Designing</Btn>
        </div>
      </nav>

      <section style={{ position: "relative", padding: "90px 40px 70px", overflow: "hidden", borderBottom: `1px solid ${C.border}` }}>
        <div style={{
          position: "absolute", inset: 0, opacity: 0.5,
          backgroundImage: `linear-gradient(${C.border}22 1px, transparent 1px), linear-gradient(90deg, ${C.border}22 1px, transparent 1px)`,
          backgroundSize: "42px 42px", maskImage: "radial-gradient(ellipse 70% 60% at 50% 20%, black, transparent)",
        }} />
        <div style={{ position: "relative", maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8, padding: "5px 12px", borderRadius: 20,
            border: `1px solid ${C.violet}55`, color: C.violet, fontSize: 11.5, fontWeight: 600, letterSpacing: 0.6,
            fontFamily: "'JetBrains Mono', monospace", marginBottom: 26, textTransform: "uppercase",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.violet }} /> Custom packaging lab
          </div>
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 54, lineHeight: 1.05, fontWeight: 700,
            margin: "0 0 22px", letterSpacing: -1,
          }}>
            Build a Box That Is<br />
            <span style={{ color: C.violet }}>Completely Yours</span>
          </h1>
          <p style={{ color: C.textDim, fontSize: 16.5, lineHeight: 1.6, maxWidth: 520, margin: "0 auto 34px" }}>
            Customize every printable side of your trading-card box. Upload artwork, add text, preview the finished design, and submit it for production.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <Btn variant="primary" onClick={onStart}>Start Designing <ChevronRight size={15} /></Btn>
            <Btn variant="ghost" onClick={onStart}>View My Designs</Btn>
          </div>
        </div>
      </section>

      <section style={{ padding: "64px 40px 90px", maxWidth: 1120, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 30 }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 600 }}>Choose your product</h2>
          <span style={{ color: C.textFaint, fontSize: 12.5, fontFamily: "'JetBrains Mono', monospace" }}>{PRODUCTS.length} products available</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 22 }}>
          {PRODUCTS.map((p) => (
            <div key={p.id} style={{
              background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, overflow: "hidden",
              transition: "border-color .15s", cursor: "pointer",
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = C.violet + "88"}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = C.border}
              onClick={() => onSelectProduct(p)}
            >
              <div style={{
                height: 170, background: `linear-gradient(155deg, ${C.panel2}, ${C.bg})`, position: "relative",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <BoxGlyph productId={p.id} />
              </div>
              <div style={{ padding: 20 }}>
                <div style={{ fontSize: 10.5, color: C.gold, letterSpacing: 0.8, textTransform: "uppercase", fontWeight: 600, marginBottom: 6 }}>{p.tag}</div>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 17, fontWeight: 600, margin: "0 0 10px" }}>{p.name}</h3>
                <div style={{ display: "flex", gap: 16, fontSize: 12, color: C.textDim, marginBottom: 16, fontFamily: "'JetBrains Mono', monospace" }}>
                  <span>{p.dims}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>${p.basePrice}</div>
                    <div style={{ fontSize: 11, color: C.textFaint }}>{p.turnaround}</div>
                  </div>
                  <Btn small onClick={(e) => { e.stopPropagation(); onSelectProduct(p); }}>Customize</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function BoxGlyph({ productId }) {
  const shapes = {
    "etb-style": <rect x="34" y="18" width="52" height="64" rx="3" />,
    "booster-bundle": <rect x="24" y="34" width="72" height="42" rx="3" />,
    "booster-display": <rect x="14" y="38" width="92" height="30" rx="3" />,
  };
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <g stroke={C.violet} strokeWidth="1.5" opacity="0.9">{shapes[productId]}</g>
      <g stroke={C.gold} strokeWidth="1" strokeDasharray="3 3" opacity="0.5">{shapes[productId]}</g>
    </svg>
  );
}

/* ---------------------------------------------------------------------- */
/* CONFIGURATION                                                          */
/* ---------------------------------------------------------------------- */
function Configure({ product, onBack, onOpenEditor }) {
  const [cfg, setCfg] = useState({
    quantity: product.minQty,
    finish: product.finishes[0],
    closure: product.closures[0],
    insert: "None",
    protectiveCase: false,
    customLabel: false,
    barcode: false,
    numberedEdition: false,
  });

  const price = useMemo(() => {
    let total = product.basePrice;
    total += OPTION_PRICES.finish[cfg.finish] || 0;
    total += OPTION_PRICES.closure[cfg.closure] || 0;
    total += OPTION_PRICES.insert[cfg.insert] || 0;
    if (cfg.protectiveCase) total += OPTION_PRICES.protectiveCase;
    if (cfg.customLabel) total += OPTION_PRICES.customLabel;
    if (cfg.barcode) total += OPTION_PRICES.barcode;
    if (cfg.numberedEdition) total += OPTION_PRICES.numberedEdition;
    return total;
  }, [cfg, product]);

  const breakdown = [
    { label: `Base box (${product.name})`, value: product.basePrice },
    OPTION_PRICES.finish[cfg.finish] ? { label: `${cfg.finish} finish`, value: OPTION_PRICES.finish[cfg.finish] } : null,
    OPTION_PRICES.closure[cfg.closure] ? { label: cfg.closure, value: OPTION_PRICES.closure[cfg.closure] } : null,
    cfg.insert !== "None" ? { label: cfg.insert, value: OPTION_PRICES.insert[cfg.insert] } : null,
    cfg.protectiveCase ? { label: "Protective case", value: OPTION_PRICES.protectiveCase } : null,
    cfg.customLabel ? { label: "Custom label", value: OPTION_PRICES.customLabel } : null,
    cfg.barcode ? { label: "Barcode / SKU", value: OPTION_PRICES.barcode } : null,
    cfg.numberedEdition ? { label: "Numbered edition label", value: OPTION_PRICES.numberedEdition } : null,
  ].filter(Boolean);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderBottom: `1px solid ${C.border}` }}>
        <Logo size={20} />
        <Btn variant="ghost" small onClick={onBack}><ChevronLeft size={14} /> Back to products</Btn>
      </nav>
      <div style={{ maxWidth: 1040, margin: "0 auto", padding: "44px 40px", display: "grid", gridTemplateColumns: "1fr 360px", gap: 46 }}>
        <div>
          <div style={{ fontSize: 10.5, color: C.gold, letterSpacing: 0.8, textTransform: "uppercase", fontWeight: 600, marginBottom: 8 }}>{product.tag}</div>
          <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 30, fontWeight: 700, margin: "0 0 30px" }}>{product.name}</h1>

          <Field label="Quantity">
            <input type="number" min={product.minQty} value={cfg.quantity}
              onChange={(e) => setCfg({ ...cfg, quantity: Math.max(product.minQty, Number(e.target.value) || product.minQty) })}
              style={inputStyle} />
            <div style={{ fontSize: 11, color: C.textFaint, marginTop: 5 }}>Minimum order quantity: {product.minQty}</div>
          </Field>

          <Field label="Exterior finish">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {product.finishes.map((f) => (
                <OptionChip key={f} active={cfg.finish === f} onClick={() => setCfg({ ...cfg, finish: f })}
                  label={f} price={OPTION_PRICES.finish[f]} />
              ))}
            </div>
          </Field>

          <Field label="Closure type">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {product.closures.map((c) => (
                <OptionChip key={c} active={cfg.closure === c} onClick={() => setCfg({ ...cfg, closure: c })}
                  label={c} price={OPTION_PRICES.closure[c]} />
              ))}
            </div>
          </Field>

          <Field label="Insert type">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["None", "Standard insert", "Custom insert"].map((i) => (
                <OptionChip key={i} active={cfg.insert === i} onClick={() => setCfg({ ...cfg, insert: i })}
                  label={i} price={OPTION_PRICES.insert[i]} />
              ))}
            </div>
          </Field>

          <Field label="Add-ons">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["protectiveCase", "Protective case", OPTION_PRICES.protectiveCase],
                ["customLabel", "Custom label", OPTION_PRICES.customLabel],
                ["barcode", "Barcode or SKU", OPTION_PRICES.barcode],
                ["numberedEdition", "Numbered-edition label", OPTION_PRICES.numberedEdition],
              ].map(([key, label, cost]) => (
                <label key={key} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px",
                  background: C.panel, border: `1px solid ${C.border}`, borderRadius: 7, cursor: "pointer", fontSize: 13,
                }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <input type="checkbox" checked={cfg[key]} onChange={(e) => setCfg({ ...cfg, [key]: e.target.checked })} />
                    {label}
                  </span>
                  <span style={{ color: C.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>+${cost.toFixed(2)}</span>
                </label>
              ))}
            </div>
          </Field>
        </div>

        <div>
          <div style={{ position: "sticky", top: 24, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 16 }}>Price breakdown</div>
            {breakdown.map((b, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: C.textDim, marginBottom: 9 }}>
                <span>{b.label}</span><span style={{ fontFamily: "'JetBrains Mono', monospace" }}>${b.value.toFixed(2)}</span>
              </div>
            ))}
            <div style={{ height: 1, background: C.border, margin: "14px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Estimated total</span>
              <span style={{ fontSize: 24, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", color: C.gold }}>${price.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: 11, color: C.textFaint, marginBottom: 20 }}>per unit · × {cfg.quantity} units at checkout</div>
            <Btn variant="primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => onOpenEditor(cfg)}>
              Open Design Editor <ChevronRight size={15} />
            </Btn>
            <div style={{ fontSize: 11, color: C.textFaint, marginTop: 12, lineHeight: 1.5 }}>
              Pricing pulls live from the Project.NURD product database and updates as you change options.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OptionChip({ active, onClick, label, price }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 13px", borderRadius: 7, fontSize: 12.5, cursor: "pointer",
      background: active ? C.violet + "22" : C.panel, color: active ? C.text : C.textDim,
      border: `1px solid ${active ? C.violet : C.border}`, display: "flex", gap: 7, alignItems: "center",
      fontFamily: "'Inter', sans-serif",
    }}>
      {label} {price > 0 && <span style={{ color: C.gold, fontSize: 11 }}>+${price}</span>}
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/* EDITOR                                                                  */
/* ---------------------------------------------------------------------- */
const TOOLS = [
  { id: "templates", icon: Sparkles, label: "Templates" },
  { id: "uploads", icon: ImageIcon, label: "Uploads" },
  { id: "text", icon: Type, label: "Text" },
  { id: "shapes", icon: Square, label: "Graphics" },
  { id: "background", icon: Palette, label: "Background" },
  { id: "layers", icon: Layers, label: "Layers" },
  { id: "options", icon: Settings, label: "Product options" },
  { id: "help", icon: HelpCircle, label: "Design help" },
];

const PANEL_LABELS = { front: "Front", back: "Back", left: "Left side", right: "Right side", top: "Top", bottom: "Bottom", interior: "Interior" };

function Editor({ product, config, onBack, onAddToCart }) {
  const [tool, setTool] = useState("templates");
  const [activePanel, setActivePanel] = useState(product.panels[0]);
  const [design, setDesign] = useState(() => {
    const panels = {};
    product.panels.forEach((p) => { panels[p] = { bg: "#1A1723", elements: [] }; });
    return panels;
  });
  const [selectedId, setSelectedId] = useState(null);
  const [showGuides, setShowGuides] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [units, setUnits] = useState("in");
  const [saveState, setSaveState] = useState("Saved");
  const [history, setHistory] = useState([]);
  const [designName, setDesignName] = useState(`My ${product.name}`);
  const [showValidation, setShowValidation] = useState(false);
  const [copyrightConfirmed, setCopyrightConfirmed] = useState(false);
  const [view3D, setView3D] = useState(false);

  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const fileInputRef = useRef(null);

  const dims = product.panelDims[activePanel];
  const CANVAS_W = 560, CANVAS_H = 380;
  const scale = Math.min((CANVAS_W - 60) / dims.w, (CANVAS_H - 60) / dims.h);
  const pxW = dims.w * scale, pxH = dims.h * scale;
  const offX = (CANVAS_W - pxW) / 2, offY = (CANVAS_H - pxH) / 2;
  const bleedPx = 0.125 * scale, safePx = 0.25 * scale;

  const panelData = design[activePanel];
  const selected = panelData.elements.find((e) => e.id === selectedId);

  const commit = useCallback((updater) => {
    setDesign((d) => {
      const next = { ...d, [activePanel]: updater(d[activePanel]) };
      return next;
    });
    setSaveState("Unsaved changes");
    setTimeout(() => setSaveState("Saving…"), 250);
    setTimeout(() => setSaveState("Saved"), 900);
  }, [activePanel]);

  const addElement = (el) => {
    commit((p) => ({ ...p, elements: [...p.elements, { id: uid(), locked: false, hidden: false, rotation: 0, opacity: 1, ...el }] }));
  };

  const updateElement = (id, patch) => {
    commit((p) => ({ ...p, elements: p.elements.map((e) => (e.id === id ? { ...e, ...patch } : e)) }));
  };

  const deleteElement = (id) => {
    commit((p) => ({ ...p, elements: p.elements.filter((e) => e.id !== id) }));
    setSelectedId(null);
  };

  const reorder = (id, dir) => {
    commit((p) => {
      const idx = p.elements.findIndex((e) => e.id === id);
      const swap = dir === "up" ? idx + 1 : idx - 1;
      if (swap < 0 || swap >= p.elements.length) return p;
      const arr = [...p.elements];
      [arr[idx], arr[swap]] = [arr[swap], arr[idx]];
      return { ...p, elements: arr };
    });
  };

  const handleUpload = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const naturalDPI = Math.min(img.width / dims.w, img.height / dims.h);
        let rating = "Excellent";
        if (naturalDPI < 100) rating = "Not recommended";
        else if (naturalDPI < 200) rating = "Low resolution";
        else if (naturalDPI < 300) rating = "Good";
        const wIn = Math.min(dims.w * 0.6, img.width / 96);
        const hIn = wIn * (img.height / img.width);
        addElement({
          type: "image", src: e.target.result, name: file.name,
          x: dims.w / 2 - wIn / 2, y: dims.h / 2 - hIn / 2, w: wIn, h: hIn,
          naturalW: img.width, naturalH: img.height, dpi: Math.round(naturalDPI), rating,
        });
        setTool("layers");
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const addText = () => {
    addElement({
      type: "text", text: "Your Text Here", x: dims.w * 0.2, y: dims.h * 0.42, w: dims.w * 0.6, h: dims.h * 0.16,
      font: "Space Grotesk", size: 22, weight: 600, color: "#F3F1F8", align: "center",
    });
    setTool("layers");
  };

  const addShape = (shape) => {
    addElement({
      type: "shape", shape, x: dims.w * 0.3, y: dims.h * 0.3, w: dims.w * 0.4, h: dims.h * 0.3,
      fill: C.violet, stroke: "none", borderWidth: 0, radius: shape === "circle" ? 999 : 4,
    });
    setTool("layers");
  };

  const applyTemplate = (tpl) => {
    commit((p) => ({ ...p, bg: tpl.bg }));
  };

  /* --- drag / resize --- */
  const startDrag = (e, el, mode) => {
    e.stopPropagation();
    if (el.locked) return;
    setSelectedId(el.id);
    const rect = canvasRef.current.getBoundingClientRect();
    dragRef.current = {
      mode, id: el.id, startX: e.clientX, startY: e.clientY,
      origX: el.x, origY: el.y, origW: el.w, origH: el.h, rectScale: (rect.width / CANVAS_W),
    };
    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", endDrag);
  };
  const onDrag = (e) => {
    const d = dragRef.current;
    if (!d) return;
    const s = scale * d.rectScale;
    const dx = (e.clientX - d.startX) / s;
    const dy = (e.clientY - d.startY) / s;
    if (d.mode === "move") {
      updateElement(d.id, { x: d.origX + dx, y: d.origY + dy });
    } else if (d.mode === "resize") {
      updateElement(d.id, { w: Math.max(0.2, d.origW + dx), h: Math.max(0.2, d.origH + dy) });
    }
  };
  const endDrag = () => {
    dragRef.current = null;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", endDrag);
  };

  /* --- validation --- */
  const validation = useMemo(() => {
    const errors = [], warnings = [], passed = [];
    product.panels.forEach((pid) => {
      const pd = design[pid];
      const hasContent = pd.elements.length > 0 || pd.bg !== "#1A1723";
      if (!hasContent) errors.push(`${PANEL_LABELS[pid]} panel has no artwork or background.`);
      else passed.push(`${PANEL_LABELS[pid]} panel has content.`);
      pd.elements.forEach((el) => {
        if (el.type === "image" && (el.rating === "Low resolution" || el.rating === "Not recommended")) {
          warnings.push(`"${el.name}" on ${PANEL_LABELS[pid]} is ${el.rating.toLowerCase()} (${el.dpi} DPI).`);
        }
        const pDims = product.panelDims[pid];
        const safeIn = 0.25;
        if (el.x < safeIn || el.y < safeIn || el.x + el.w > pDims.w - safeIn || el.y + el.h > pDims.h - safeIn) {
          warnings.push(`An element on ${PANEL_LABELS[pid]} is close to or outside the safe zone.`);
        }
      });
    });
    if (!copyrightConfirmed) errors.push("Artwork ownership / copyright confirmation is required.");
    else passed.push("Copyright confirmation received.");
    if (errors.length === 0) passed.push("All required panels have content.");
    return { errors, warnings, passed };
  }, [design, product, copyrightConfirmed]);

  const canSubmit = validation.errors.length === 0;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif", overflow: "hidden" }}>
      {/* TOP BAR */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Logo size={18} />
          <Btn variant="ghost" small onClick={onBack}><ChevronLeft size={13} /> Products</Btn>
          <input value={designName} onChange={(e) => setDesignName(e.target.value)}
            style={{ background: "transparent", border: "none", color: C.text, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 13.5, outline: "none", width: 220 }} />
          <span style={{
            fontSize: 11, color: saveState === "Saved" ? C.success : C.textFaint, fontFamily: "'JetBrains Mono', monospace",
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <span style={{ width: 5, height: 5, borderRadius: "50%", background: saveState === "Saved" ? C.success : C.textFaint }} />
            {saveState}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <IconBtn icon={Undo2} title="Undo" />
          <IconBtn icon={Redo2} title="Redo" />
          <IconBtn icon={view3D ? Box : Eye} title={view3D ? "3D preview active" : "2D preview"} onClick={() => setView3D(!view3D)} active={view3D} />
          <Btn variant="ghost" small onClick={() => setShowValidation(true)}>Run design check</Btn>
          <Btn variant="subtle" small><Save size={13} /> Save</Btn>
          <Btn variant="primary" small onClick={() => setShowValidation(true)}><ShoppingCart size={13} /> Add to cart</Btn>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* LEFT TOOLBAR */}
        <div style={{ width: 68, borderRight: `1px solid ${C.border}`, display: "flex", flexDirection: "column", alignItems: "center", padding: "14px 0", gap: 4, flexShrink: 0 }}>
          {TOOLS.map((t) => (
            <button key={t.id} onClick={() => setTool(t.id)} title={t.label} style={{
              width: 52, padding: "9px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              background: tool === t.id ? C.violet + "22" : "transparent", border: "none",
              borderRight: tool === t.id ? `2px solid ${C.violet}` : "2px solid transparent",
              color: tool === t.id ? C.violet : C.textDim, cursor: "pointer", borderRadius: 6,
            }}>
              <t.icon size={17} />
              <span style={{ fontSize: 8.5, letterSpacing: 0.2, textAlign: "center", lineHeight: 1.1 }}>{t.label}</span>
            </button>
          ))}
        </div>

        {/* TOOL PANEL */}
        <div style={{ width: 240, borderRight: `1px solid ${C.border}`, padding: 16, overflowY: "auto", flexShrink: 0 }}>
          {tool === "templates" && (
            <>
              <PanelTitle>Templates</PanelTitle>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {TEMPLATES.map((t) => (
                  <div key={t.id} onClick={() => applyTemplate(t)} style={{
                    background: t.bg, height: 60, borderRadius: 7, border: `1px solid ${C.border}`, cursor: "pointer",
                    display: "flex", alignItems: "flex-end", padding: 6,
                  }}>
                    <span style={{ fontSize: 9.5, color: t.bg === "#F3F1F8" ? "#111" : "#fff", fontWeight: 600 }}>{t.name}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: C.textFaint, marginTop: 12, lineHeight: 1.5 }}>
                Applies a starter background to the <b style={{ color: C.textDim }}>{PANEL_LABELS[activePanel]}</b> panel. No franchise or copyrighted artwork is included in public templates.
              </div>
            </>
          )}

          {tool === "uploads" && (
            <>
              <PanelTitle>Uploads</PanelTitle>
              <div onClick={() => fileInputRef.current.click()} style={{
                border: `1.5px dashed ${C.border}`, borderRadius: 8, padding: "26px 10px", textAlign: "center",
                cursor: "pointer", marginBottom: 14,
              }}>
                <ImageIcon size={20} color={C.textFaint} style={{ marginBottom: 8 }} />
                <div style={{ fontSize: 12, color: C.textDim }}>Drop artwork here or click to upload</div>
                <div style={{ fontSize: 10.5, color: C.textFaint, marginTop: 4 }}>PNG, JPG, SVG, PDF, WEBP</div>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }}
                onChange={(e) => { if (e.target.files[0]) handleUpload(e.target.files[0]); e.target.value = ""; }} />
              <div style={{ fontSize: 11, color: C.textFaint, lineHeight: 1.5 }}>
                Uploaded files are checked against the panel's recommended 300 DPI print resolution and rated automatically.
              </div>
            </>
          )}

          {tool === "text" && (
            <>
              <PanelTitle>Text</PanelTitle>
              <Btn style={{ width: "100%", justifyContent: "center", marginBottom: 12 }} onClick={addText}>
                <Plus size={14} /> Add text box
              </Btn>
              <div style={{ fontSize: 11, color: C.textFaint, lineHeight: 1.5 }}>
                Select a text element on the canvas to edit its font, size, color, and effects in the properties panel.
              </div>
            </>
          )}

          {tool === "shapes" && (
            <>
              <PanelTitle>Graphics</PanelTitle>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="subtle" small onClick={() => addShape("rect")}><Square size={13} /> Rectangle</Btn>
                <Btn variant="subtle" small onClick={() => addShape("circle")}>◯ Circle</Btn>
              </div>
            </>
          )}

          {tool === "background" && (
            <>
              <PanelTitle>Background — {PANEL_LABELS[activePanel]}</PanelTitle>
              <input type="color" value={panelData.bg} onChange={(e) => commit((p) => ({ ...p, bg: e.target.value }))}
                style={{ width: "100%", height: 40, border: `1px solid ${C.border}`, borderRadius: 6, background: "none", cursor: "pointer" }} />
              <div style={{ fontSize: 11, color: C.textFaint, marginTop: 10 }}>
                Colors shown on your screen may vary from the final printed product.
              </div>
            </>
          )}

          {tool === "layers" && (
            <>
              <PanelTitle>Layers — {PANEL_LABELS[activePanel]}</PanelTitle>
              {panelData.elements.length === 0 && <div style={{ fontSize: 12, color: C.textFaint }}>No layers on this panel yet.</div>}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[...panelData.elements].reverse().map((el) => (
                  <div key={el.id} onClick={() => setSelectedId(el.id)} style={{
                    display: "flex", alignItems: "center", gap: 7, padding: "7px 8px", borderRadius: 6, cursor: "pointer",
                    background: selectedId === el.id ? C.violet + "22" : C.panel, border: `1px solid ${selectedId === el.id ? C.violet : C.border}`,
                  }}>
                    {el.type === "image" ? <ImageIcon size={13} /> : el.type === "text" ? <Type size={13} /> : <Square size={13} />}
                    <span style={{ fontSize: 11.5, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {el.type === "text" ? el.text : el.name || el.shape || "Shape"}
                    </span>
                    <button onClick={(e) => { e.stopPropagation(); updateElement(el.id, { locked: !el.locked }); }} style={iconMini}>
                      {el.locked ? <Lock size={11} /> : <Unlock size={11} />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); updateElement(el.id, { hidden: !el.hidden }); }} style={iconMini}>
                      {el.hidden ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); deleteElement(el.id); }} style={{ ...iconMini, color: C.error }}>
                      <Trash2 size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {tool === "options" && (
            <>
              <PanelTitle>Product options</PanelTitle>
              <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.9 }}>
                <div>Finish: <b>{config.finish}</b></div>
                <div>Closure: <b>{config.closure}</b></div>
                <div>Insert: <b>{config.insert}</b></div>
                <div>Quantity: <b>{config.quantity}</b></div>
              </div>
              <div style={{ fontSize: 11, color: C.textFaint, marginTop: 12 }}>To change physical product options, go back to product configuration.</div>
            </>
          )}

          {tool === "help" && (
            <>
              <PanelTitle>Design help</PanelTitle>
              <div style={{ fontSize: 12, color: C.textDim, lineHeight: 1.6, marginBottom: 14 }}>
                Stuck on layout, color, or artwork prep? Request Project.NURD design assistance.
              </div>
              <Btn variant="gold" style={{ width: "100%", justifyContent: "center" }}>
                <Sparkles size={14} /> Have Project.NURD Finish My Design
              </Btn>
            </>
          )}
        </div>

        {/* CANVAS */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* panel tabs */}
          <div style={{ display: "flex", borderBottom: `1px solid ${C.border}`, padding: "0 12px", flexShrink: 0, overflowX: "auto" }}>
            {product.panels.map((p) => (
              <button key={p} onClick={() => { setActivePanel(p); setSelectedId(null); }} style={{
                padding: "11px 16px", background: "none", border: "none", cursor: "pointer",
                color: activePanel === p ? C.text : C.textFaint, fontSize: 12.5, fontWeight: activePanel === p ? 600 : 400,
                borderBottom: activePanel === p ? `2px solid ${C.violet}` : "2px solid transparent", whiteSpace: "nowrap",
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                {PANEL_LABELS[p]}
                {design[p].elements.length === 0 && design[p].bg === "#1A1723" && (
                  <span style={{ marginLeft: 6, width: 5, height: 5, borderRadius: "50%", background: C.warning, display: "inline-block" }} />
                )}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", background: "#0C0A10" }}>
            {view3D ? (
              <Preview3D product={product} design={design} />
            ) : (
              <div
                ref={canvasRef}
                onClick={() => setSelectedId(null)}
                style={{
                  width: CANVAS_W, height: CANVAS_H, position: "relative", background: "#0C0A10",
                  transform: `scale(${zoom})`,
                }}
              >
                {/* panel surface */}
                <div style={{ position: "absolute", left: offX, top: offY, width: pxW, height: pxH, background: panelData.bg, overflow: "hidden", boxShadow: "0 0 0 1px #000" }}>
                  {panelData.elements.map((el) => !el.hidden && (
                    <ElementView key={el.id} el={el} scale={scale} selected={selectedId === el.id}
                      onMouseDown={(e, mode) => startDrag(e, el, mode)} onSelect={() => setSelectedId(el.id)} />
                  ))}
                </div>
                {/* guides */}
                {showGuides && (
                  <>
                    <GuideRect x={offX} y={offY} w={pxW} h={pxH} color={C.textFaint} label={false} />
                    <GuideRect x={offX - bleedPx} y={offY - bleedPx} w={pxW + bleedPx * 2} h={pxH + bleedPx * 2} color={C.error} dashed />
                    <GuideRect x={offX + safePx} y={offY + safePx} w={pxW - safePx * 2} h={pxH - safePx * 2} color={C.gold} dashed />
                  </>
                )}
                <div style={{ position: "absolute", bottom: -22, left: offX, fontSize: 10, color: C.textFaint, fontFamily: "'JetBrains Mono', monospace" }}>
                  {dims.w}" × {dims.h}"
                </div>
              </div>
            )}
          </div>

          {/* bottom bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <IconBtn icon={ZoomOut} onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))} small />
              <span style={{ fontSize: 11.5, color: C.textDim, width: 40, textAlign: "center", fontFamily: "'JetBrains Mono', monospace" }}>{Math.round(zoom * 100)}%</span>
              <IconBtn icon={ZoomIn} onClick={() => setZoom((z) => Math.min(2, z + 0.1))} small />
              <IconBtn icon={Maximize2} onClick={() => setZoom(1)} small title="Fit to canvas" />
              <IconBtn icon={Grid3x3} onClick={() => setShowGuides((g) => !g)} small active={showGuides} title="Toggle guides" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 11, color: C.textFaint, display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{ width: 8, height: 2, background: C.error, display: "inline-block" }} /> Bleed
                <span style={{ width: 8, height: 2, background: C.gold, display: "inline-block", marginLeft: 6 }} /> Safe zone
              </span>
              <select value={units} onChange={(e) => setUnits(e.target.value)} style={{ ...selectStyle, width: 90, padding: "5px 8px", fontSize: 11.5 }}>
                <option value="in">Inches</option>
                <option value="mm">Millimeters</option>
                <option value="px">Pixels</option>
              </select>
            </div>
          </div>
        </div>

        {/* PROPERTIES */}
        <div style={{ width: 250, borderLeft: `1px solid ${C.border}`, padding: 16, overflowY: "auto", flexShrink: 0 }}>
          <PanelTitle>Properties</PanelTitle>
          {!selected && <div style={{ fontSize: 12, color: C.textFaint }}>Select an element on the canvas to edit its properties.</div>}
          {selected && selected.type === "text" && (
            <TextProps el={selected} onChange={(patch) => updateElement(selected.id, patch)} onDelete={() => deleteElement(selected.id)} />
          )}
          {selected && selected.type === "image" && (
            <ImageProps el={selected} onChange={(patch) => updateElement(selected.id, patch)} onDelete={() => deleteElement(selected.id)} />
          )}
          {selected && selected.type === "shape" && (
            <ShapeProps el={selected} onChange={(patch) => updateElement(selected.id, patch)} onDelete={() => deleteElement(selected.id)} />
          )}
        </div>
      </div>

      {showValidation && (
        <ValidationModal
          validation={validation}
          copyrightConfirmed={copyrightConfirmed}
          setCopyrightConfirmed={setCopyrightConfirmed}
          canSubmit={canSubmit}
          onClose={() => setShowValidation(false)}
          onSubmit={() => { onAddToCart({ design, product, config, designName }); }}
        />
      )}
    </div>
  );
}

const iconMini = { background: "none", border: "none", color: C.textFaint, cursor: "pointer", padding: 2, display: "flex" };

function PanelTitle({ children }) {
  return <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 12.5, marginBottom: 14, color: C.text }}>{children}</div>;
}

function IconBtn({ icon: Icon, onClick, title, active, small }) {
  return (
    <button onClick={onClick} title={title} style={{
      width: small ? 26 : 30, height: small ? 26 : 30, borderRadius: 6, border: `1px solid ${active ? C.violet : C.border}`,
      background: active ? C.violet + "22" : "transparent", color: active ? C.violet : C.textDim,
      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
    }}>
      <Icon size={small ? 13 : 15} />
    </button>
  );
}

function GuideRect({ x, y, w, h, color, dashed }) {
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: w, height: h,
      border: `1px ${dashed ? "dashed" : "solid"} ${color}`, pointerEvents: "none", opacity: 0.75,
    }} />
  );
}

function ElementView({ el, scale, selected, onMouseDown, onSelect }) {
  const style = {
    position: "absolute",
    left: el.x * scale, top: el.y * scale, width: el.w * scale, height: el.h * scale,
    transform: `rotate(${el.rotation || 0}deg)`,
    outline: selected ? `1.5px solid ${C.violet}` : "1px solid transparent",
    cursor: el.locked ? "not-allowed" : "move",
    opacity: el.opacity ?? 1,
  };
  return (
    <div style={style} onMouseDown={(e) => onMouseDown(e, "move")} onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      {el.type === "image" && <img src={el.src} draggable={false} style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />}
      {el.type === "text" && (
        <div style={{
          width: "100%", height: "100%", display: "flex", alignItems: "center",
          justifyContent: el.align === "left" ? "flex-start" : el.align === "right" ? "flex-end" : "center",
          fontFamily: `'${el.font}', sans-serif`, fontSize: el.size, fontWeight: el.weight, color: el.color,
          textAlign: el.align, pointerEvents: "none", lineHeight: 1.15, wordBreak: "break-word",
        }}>
          {el.text}
        </div>
      )}
      {el.type === "shape" && (
        <div style={{
          width: "100%", height: "100%", background: el.fill, borderRadius: el.shape === "circle" ? "50%" : el.radius,
          border: el.borderWidth ? `${el.borderWidth}px solid ${el.stroke}` : "none", pointerEvents: "none",
        }} />
      )}
      {selected && !el.locked && (
        <div
          onMouseDown={(e) => onMouseDown(e, "resize")}
          style={{
            position: "absolute", right: -5, bottom: -5, width: 10, height: 10, borderRadius: 2,
            background: C.violet, cursor: "nwse-resize",
          }}
        />
      )}
    </div>
  );
}

function TextProps({ el, onChange, onDelete }) {
  return (
    <>
      <Field label="Content">
        <textarea value={el.text} onChange={(e) => onChange({ text: e.target.value })} rows={2} style={{ ...inputStyle, resize: "vertical" }} />
      </Field>
      <Field label="Font">
        <select value={el.font} onChange={(e) => onChange({ font: e.target.value })} style={selectStyle}>
          {FONTS.map((f) => <option key={f}>{f}</option>)}
        </select>
      </Field>
      <div style={{ display: "flex", gap: 8 }}>
        <Field label="Size"><input type="number" value={el.size} onChange={(e) => onChange({ size: Number(e.target.value) })} style={inputStyle} /></Field>
        <Field label="Weight">
          <select value={el.weight} onChange={(e) => onChange({ weight: Number(e.target.value) })} style={selectStyle}>
            {[400, 500, 600, 700].map((w) => <option key={w} value={w}>{w}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Color"><input type="color" value={el.color} onChange={(e) => onChange({ color: e.target.value })} style={{ width: "100%", height: 34, border: `1px solid ${C.border}`, borderRadius: 6, background: "none" }} /></Field>
      <Field label="Alignment">
        <div style={{ display: "flex", gap: 6 }}>
          {["left", "center", "right"].map((a) => (
            <button key={a} onClick={() => onChange({ align: a })} style={{
              flex: 1, padding: "6px 0", borderRadius: 5, cursor: "pointer",
              background: el.align === a ? C.violet + "33" : C.panel, border: `1px solid ${el.align === a ? C.violet : C.border}`, color: C.text, fontSize: 11,
            }}>{a}</button>
          ))}
        </div>
      </Field>
      <Field label="Rotation"><input type="range" min={-45} max={45} value={el.rotation} onChange={(e) => onChange({ rotation: Number(e.target.value) })} style={{ width: "100%" }} /></Field>
      <Field label="Opacity"><input type="range" min={0} max={1} step={0.05} value={el.opacity} onChange={(e) => onChange({ opacity: Number(e.target.value) })} style={{ width: "100%" }} /></Field>
      <Btn variant="danger" small style={{ width: "100%", justifyContent: "center" }} onClick={onDelete}><Trash2 size={12} /> Delete</Btn>
    </>
  );
}

function ImageProps({ el, onChange, onDelete }) {
  const ratingColor = { Excellent: C.success, Good: C.success, "Low resolution": C.warning, "Not recommended": C.error }[el.rating];
  return (
    <>
      <div style={{
        display: "flex", alignItems: "center", gap: 7, padding: "8px 10px", borderRadius: 6, marginBottom: 14,
        background: ratingColor + "18", border: `1px solid ${ratingColor}55`,
      }}>
        {el.rating === "Excellent" || el.rating === "Good" ? <CheckCircle2 size={13} color={ratingColor} /> : <AlertTriangle size={13} color={ratingColor} />}
        <div style={{ fontSize: 11 }}>
          <div style={{ color: ratingColor, fontWeight: 600 }}>{el.rating}</div>
          <div style={{ color: C.textFaint }}>{el.naturalW}×{el.naturalH}px · ~{el.dpi} DPI</div>
        </div>
      </div>
      {(el.rating === "Low resolution" || el.rating === "Not recommended") && (
        <div style={{ fontSize: 11, color: C.warning, marginBottom: 14, lineHeight: 1.5 }}>
          This image may appear blurry when printed at the current size.
        </div>
      )}
      <Field label="Opacity"><input type="range" min={0} max={1} step={0.05} value={el.opacity} onChange={(e) => onChange({ opacity: Number(e.target.value) })} style={{ width: "100%" }} /></Field>
      <Field label="Rotation"><input type="range" min={-45} max={45} value={el.rotation} onChange={(e) => onChange({ rotation: Number(e.target.value) })} style={{ width: "100%" }} /></Field>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <Btn variant="subtle" small style={{ flex: 1, justifyContent: "center" }}><FlipHorizontal size={12} /></Btn>
        <Btn variant="subtle" small style={{ flex: 1, justifyContent: "center" }}><FlipVertical size={12} /></Btn>
        <Btn variant="subtle" small style={{ flex: 1, justifyContent: "center" }}><RotateCw size={12} /></Btn>
      </div>
      <Btn variant="danger" small style={{ width: "100%", justifyContent: "center" }} onClick={onDelete}><Trash2 size={12} /> Delete</Btn>
    </>
  );
}

function ShapeProps({ el, onChange, onDelete }) {
  return (
    <>
      <Field label="Fill color"><input type="color" value={el.fill} onChange={(e) => onChange({ fill: e.target.value })} style={{ width: "100%", height: 34, border: `1px solid ${C.border}`, borderRadius: 6, background: "none" }} /></Field>
      <Field label="Corner radius"><input type="range" min={0} max={40} value={el.radius} onChange={(e) => onChange({ radius: Number(e.target.value) })} style={{ width: "100%" }} /></Field>
      <Field label="Opacity"><input type="range" min={0} max={1} step={0.05} value={el.opacity} onChange={(e) => onChange({ opacity: Number(e.target.value) })} style={{ width: "100%" }} /></Field>
      <Btn variant="danger" small style={{ width: "100%", justifyContent: "center" }} onClick={onDelete}><Trash2 size={12} /> Delete</Btn>
    </>
  );
}

function Preview3D({ product, design }) {
  const front = design.front;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{
        width: 220, height: 280, position: "relative", perspective: 800,
      }}>
        <div style={{
          width: "100%", height: "100%", background: front.bg, borderRadius: 4,
          transform: "rotateY(-18deg) rotateX(4deg)", transformStyle: "preserve-3d",
          boxShadow: "24px 26px 50px rgba(0,0,0,0.6), 0 0 0 1px #000",
          position: "relative", overflow: "hidden",
        }}>
          {front.elements.map((el) => !el.hidden && el.type === "image" && (
            <img key={el.id} src={el.src} style={{
              position: "absolute",
              left: `${(el.x / product.panelDims.front.w) * 100}%`,
              top: `${(el.y / product.panelDims.front.h) * 100}%`,
              width: `${(el.w / product.panelDims.front.w) * 100}%`,
              height: `${(el.h / product.panelDims.front.h) * 100}%`,
              objectFit: "cover",
            }} />
          ))}
          {front.elements.map((el) => !el.hidden && el.type === "text" && (
            <div key={el.id} style={{
              position: "absolute",
              left: `${(el.x / product.panelDims.front.w) * 100}%`,
              top: `${(el.y / product.panelDims.front.h) * 100}%`,
              width: `${(el.w / product.panelDims.front.w) * 100}%`,
              color: el.color, fontFamily: `'${el.font}'`, fontSize: el.size * 0.7, fontWeight: el.weight, textAlign: el.align,
            }}>{el.text}</div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <IconBtn icon={RotateCw} small title="Rotate" />
        <IconBtn icon={ZoomIn} small title="Zoom" />
        <IconBtn icon={Maximize2} small title="Reset view" />
      </div>
      <div style={{ fontSize: 11, color: C.textFaint, textAlign: "center", maxWidth: 260, lineHeight: 1.5 }}>
        Preview is for visualization. Final positioning and color may vary slightly during production.
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* VALIDATION MODAL                                                        */
/* ---------------------------------------------------------------------- */
function ValidationModal({ validation, copyrightConfirmed, setCopyrightConfirmed, canSubmit, onClose, onSubmit }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000aa", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, width: 480, maxHeight: "80vh", overflowY: "auto", padding: 26 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 16 }}>Design check</div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: C.textFaint, cursor: "pointer" }}><X size={18} /></button>
        </div>

        {validation.errors.length > 0 && (
          <ValidationGroup title="Errors" icon={XCircle} color={C.error} items={validation.errors} />
        )}
        {validation.warnings.length > 0 && (
          <ValidationGroup title="Warnings" icon={AlertTriangle} color={C.warning} items={validation.warnings} />
        )}
        {validation.passed.length > 0 && (
          <ValidationGroup title="Passed checks" icon={CheckCircle2} color={C.success} items={validation.passed} collapsedByDefault />
        )}

        <div style={{ height: 1, background: C.border, margin: "18px 0" }} />

        <label style={{ display: "flex", gap: 10, fontSize: 12, color: C.textDim, lineHeight: 1.5, cursor: "pointer", marginBottom: 18 }}>
          <input type="checkbox" checked={copyrightConfirmed} onChange={(e) => setCopyrightConfirmed(e.target.checked)} style={{ marginTop: 2 }} />
          I confirm that I own this artwork or have permission to reproduce it. I understand that Project.NURD may reject designs that violate copyright, trademark, or content policies.
        </label>

        <div style={{ display: "flex", gap: 10 }}>
          <Btn variant="ghost" style={{ flex: 1, justifyContent: "center" }} onClick={onClose}>Keep editing</Btn>
          <Btn variant="primary" style={{ flex: 1, justifyContent: "center" }} disabled={!canSubmit} onClick={onSubmit}>
            <ShoppingCart size={14} /> Add to cart
          </Btn>
        </div>
      </div>
    </div>
  );
}

function ValidationGroup({ title, icon: Icon, color, items, collapsedByDefault }) {
  const [open, setOpen] = useState(!collapsedByDefault);
  return (
    <div style={{ marginBottom: 12 }}>
      <button onClick={() => setOpen(!open)} style={{
        display: "flex", alignItems: "center", gap: 8, width: "100%", background: "none", border: "none",
        cursor: "pointer", padding: "6px 0", color: C.text,
      }}>
        <Icon size={14} color={color} />
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{title}</span>
        <span style={{ fontSize: 11, color: C.textFaint }}>({items.length})</span>
        <ChevronDown size={13} style={{ marginLeft: "auto", transform: open ? "rotate(180deg)" : "none", color: C.textFaint }} />
      </button>
      {open && (
        <div style={{ paddingLeft: 22, display: "flex", flexDirection: "column", gap: 5 }}>
          {items.map((it, i) => <div key={i} style={{ fontSize: 11.5, color: C.textDim, lineHeight: 1.5 }}>{it}</div>)}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* CART / ORDER CONFIRMATION                                              */
/* ---------------------------------------------------------------------- */
function CartScreen({ item, onBackToEditor, onNewDesign }) {
  const [placed, setPlaced] = useState(false);
  if (!item) return null;
  const { product, config, designName } = item;

  const price = (() => {
    let total = product.basePrice;
    total += OPTION_PRICES.finish[config.finish] || 0;
    total += OPTION_PRICES.closure[config.closure] || 0;
    total += OPTION_PRICES.insert[config.insert] || 0;
    if (config.protectiveCase) total += OPTION_PRICES.protectiveCase;
    if (config.customLabel) total += OPTION_PRICES.customLabel;
    if (config.barcode) total += OPTION_PRICES.barcode;
    if (config.numberedEdition) total += OPTION_PRICES.numberedEdition;
    return total;
  })();
  const total = price * config.quantity;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text, fontFamily: "'Inter', sans-serif" }}>
      <nav style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 40px", borderBottom: `1px solid ${C.border}` }}>
        <Logo size={20} />
        <Btn variant="ghost" small onClick={onBackToEditor}><ChevronLeft size={14} /> Back to editor</Btn>
      </nav>
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "50px 40px" }}>
        {!placed ? (
          <>
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 26, fontWeight: 700, marginBottom: 26 }}>Your cart</h1>
            <div style={{ background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20, display: "flex", gap: 16, marginBottom: 22 }}>
              <div style={{ width: 70, height: 70, borderRadius: 8, background: `linear-gradient(155deg, ${C.panel2}, ${C.bg})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <BoxGlyph productId={product.id} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{designName}</div>
                <div style={{ fontSize: 12, color: C.textFaint, margin: "4px 0" }}>{product.name} · {config.finish} · {config.closure}</div>
                <div style={{ fontSize: 12, color: C.textDim, fontFamily: "'JetBrains Mono', monospace" }}>Qty {config.quantity} × ${price.toFixed(2)}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk', sans-serif", color: C.gold }}>
                ${total.toFixed(2)}
              </div>
            </div>
            <div style={{
              padding: "10px 14px", borderRadius: 8, background: C.violet + "14", border: `1px solid ${C.violet}44`,
              fontSize: 11.5, color: C.textDim, marginBottom: 22, lineHeight: 1.5,
            }}>
              Design status: <b style={{ color: C.text }}>Ready for review</b>. After checkout your order enters <b style={{ color: C.text }}>Paid — Awaiting Artwork Review</b> before production begins.
            </div>
            <Btn variant="primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => setPlaced(true)}>
              Proceed to checkout — ${total.toFixed(2)}
            </Btn>
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <CheckCircle2 size={44} color={C.success} style={{ marginBottom: 16 }} />
            <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 10 }}>Order confirmed</h1>
            <p style={{ color: C.textDim, fontSize: 13.5, lineHeight: 1.6, maxWidth: 380, margin: "0 auto 22px" }}>
              Order status: <b style={{ color: C.text }}>Paid — Awaiting Artwork Review</b>. Project.NURD staff will inspect your design and send a proof for approval before production starts.
            </p>
            <Btn variant="ghost" onClick={onNewDesign}>Start another design</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* ROOT APP                                                                */
/* ---------------------------------------------------------------------- */
export default function App() {
  const [screen, setScreen] = useState("landing");
  const [product, setProduct] = useState(null);
  const [config, setConfig] = useState(null);
  const [cartItem, setCartItem] = useState(null);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`@import url('${FONT_LINK}'); * { box-sizing: border-box; } body { margin: 0; } input, select, textarea, button { font-family: inherit; } ::-webkit-scrollbar { width: 8px; height: 8px; } ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 4px; }`}</style>

      {screen === "landing" && (
        <Landing
          onStart={() => setScreen("select")}
          onSelectProduct={(p) => { setProduct(p); setScreen("configure"); }}
        />
      )}

      {screen === "select" && (
        <Landing onStart={() => {}} onSelectProduct={(p) => { setProduct(p); setScreen("configure"); }} />
      )}

      {screen === "configure" && product && (
        <Configure product={product} onBack={() => setScreen("landing")} onOpenEditor={(cfg) => { setConfig(cfg); setScreen("editor"); }} />
      )}

      {screen === "editor" && product && config && (
        <Editor product={product} config={config} onBack={() => setScreen("configure")}
          onAddToCart={(item) => { setCartItem(item); setScreen("cart"); }} />
      )}

      {screen === "cart" && (
        <CartScreen item={cartItem} onBackToEditor={() => setScreen("editor")} onNewDesign={() => setScreen("landing")} />
      )}
    </div>
  );
}
