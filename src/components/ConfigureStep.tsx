"use client";

import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { GRAPHIC_OPTIONS } from "@/lib/products";

// Early on we only want people testing small orders, not bulk buys —
// revisit once there's a real production pipeline behind this.
const MIN_QUANTITY = 1;
const MAX_QUANTITY = 10;

export interface OptionChoice {
  label: string;
  price: number;
}

export interface ProductForConfigure {
  id: string;
  name: string;
  productType: string;
  basePrice: number;
  minQuantity: number;
  widthIn: number;
  heightIn: number;
  depthIn: number;
}

export default function ConfigureStep({
  product,
  covers,
  inserts,
  colors,
  graphics,
  rearFinishes,
}: {
  product: ProductForConfigure;
  covers: OptionChoice[];
  inserts: OptionChoice[];
  colors: OptionChoice[];
  graphics: OptionChoice[];
  rearFinishes: OptionChoice[];
}) {
  const [quantity, setQuantity] = useState(MIN_QUANTITY);
  const [cover, setCover] = useState(covers[0]?.label ?? "");
  const [insert, setInsert] = useState(inserts[0]?.label ?? "None");
  const [color, setColor] = useState(colors[0]?.label ?? "");
  const [graphic, setGraphic] = useState(graphics[0]?.label ?? "None");
  const [rearFinish, setRearFinish] = useState(rearFinishes[0]?.label ?? "");
  const [added, setAdded] = useState(false);

  // The acrylic cover is inherently clear — color only applies to the
  // solid, non-see-through cover option.
  const coverIsColored = cover.toLowerCase().includes("colored");

  const coverPrice = covers.find((c) => c.label === cover)?.price ?? 0;
  const insertPrice = inserts.find((i) => i.label === insert)?.price ?? 0;
  const graphicPrice = graphics.find((g) => g.label === graphic)?.price ?? 0;
  const rearFinishPrice = rearFinishes.find((r) => r.label === rearFinish)?.price ?? 0;

  const price = useMemo(
    () => product.basePrice + coverPrice + insertPrice + graphicPrice + rearFinishPrice,
    [product.basePrice, coverPrice, insertPrice, graphicPrice, rearFinishPrice]
  );

  return (
    <div className="min-h-screen bg-bg text-ink font-body">
      <nav className="flex justify-between items-center px-10 py-4 border-b border-border">
        <span className="font-display font-bold tracking-wide">PROJECT.NURD</span>
        <Link href="/" className="flex items-center gap-1 text-xs text-inkDim">
          <ChevronLeft size={14} /> Back to products
        </Link>
      </nav>

      <div className="max-w-[1040px] mx-auto px-10 py-11 grid gap-11 sm:grid-cols-[1fr_360px]">
        <div>
          <h1 className="font-display text-3xl font-bold mb-7">{product.name}</h1>

          <Field label="Quantity">
            <input
              type="number"
              min={MIN_QUANTITY}
              max={MAX_QUANTITY}
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Number(e.target.value) || MIN_QUANTITY)))
              }
              className="bg-panel border border-border rounded-md px-3 py-2 text-sm w-40"
            />
          </Field>

          <Field label="Cover type">
            <Chips options={covers} value={cover} onChange={setCover} />
          </Field>

          {coverIsColored && (
            <Field label="Cover color">
              <Chips options={colors} value={color} onChange={setColor} swatches />
            </Field>
          )}

          {rearFinishes.length > 0 && (
            <Field label="Rear finish">
              <Chips options={rearFinishes} value={rearFinish} onChange={setRearFinish} />
              {rearFinish.toLowerCase().includes("holographic") && (
                <div className="mt-3 max-w-xs">
                  <Image
                    src="/rear-finish-holographic.svg"
                    alt="Example of the holographic back finish"
                    width={320}
                    height={200}
                    className="rounded-lg border border-border w-full h-auto"
                  />
                  <div className="text-[11px] text-inkFaint mt-1.5">Example only — actual finish may vary.</div>
                </div>
              )}
            </Field>
          )}

          <Field label="Insert type">
            <Chips options={inserts} value={insert} onChange={setInsert} />
          </Field>

          <Field label="Graphic">
            <GraphicGallery options={graphics} value={graphic} onChange={setGraphic} />
          </Field>
        </div>

        <div>
          <div className="sticky top-6 bg-panel border border-border rounded-xl p-6">
            <div className="font-display font-semibold text-sm mb-4">Price breakdown</div>
            <PriceRow label={`Base box (${product.name})`} value={product.basePrice} />
            {coverPrice > 0 && <PriceRow label={cover} value={coverPrice} />}
            {coverIsColored && color && <PriceRow label={`${color} color`} value={0} />}
            {rearFinish && <PriceRow label={`${rearFinish} finish`} value={rearFinishPrice} />}
            {insert !== "None" && <PriceRow label={insert} value={insertPrice} />}
            {graphic !== "None" && <PriceRow label={`${graphic} graphic`} value={graphicPrice} />}
            <div className="h-px bg-border my-3.5" />
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-[13px] font-semibold">Estimated total</span>
              <span className="font-display font-bold text-2xl text-gold">${price.toFixed(2)}</span>
            </div>
            <div className="text-[11px] text-inkFaint mb-5">per unit · × {quantity} units at checkout</div>
            <button
              onClick={() => setAdded(true)}
              className="w-full justify-center flex items-center gap-1.5 bg-violet text-white rounded-md py-2.5 text-sm font-semibold"
            >
              {added ? "Added" : "Add to Cart"}
            </button>
            <div className="text-[11px] text-inkFaint mt-3 leading-relaxed">
              {added
                ? "Cart & checkout are coming in a later phase — your selections aren't saved yet."
                : "Pricing pulls live from the Project.NURD product database and updates as you change options."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-7">
      <div className="text-xs font-semibold text-inkDim mb-2.5">{label}</div>
      {children}
    </div>
  );
}

function Chips({
  options,
  value,
  onChange,
  swatches,
}: {
  options: OptionChoice[];
  value: string;
  onChange: (v: string) => void;
  swatches?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o.label}
          onClick={() => onChange(o.label)}
          className={`text-xs rounded-full px-3.5 py-1.5 border flex items-center gap-1.5 ${
            value === o.label ? "border-violet bg-violet/[.15] text-ink" : "border-border text-inkDim"
          }`}
        >
          {swatches && (
            <span
              className="inline-block w-2.5 h-2.5 rounded-full border border-border"
              style={{ background: o.label.toLowerCase() }}
            />
          )}
          {o.label}
          {o.price > 0 && <span className="text-inkFaint"> +${o.price.toFixed(2)}</span>}
        </button>
      ))}
    </div>
  );
}

function GraphicGallery({
  options,
  value,
  onChange,
}: {
  options: OptionChoice[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {options.map((o) => {
        const image = GRAPHIC_OPTIONS.find((g) => g.label === o.label)?.image ?? null;
        const selected = value === o.label;
        return (
          <button
            key={o.label}
            onClick={() => onChange(o.label)}
            className={`rounded-lg border overflow-hidden text-left ${
              selected ? "border-violet ring-1 ring-violet" : "border-border"
            }`}
          >
            <div className="aspect-square bg-panel flex items-center justify-center">
              {image ? (
                <Image src={image} alt={o.label} width={160} height={160} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[11px] text-inkFaint">No graphic</span>
              )}
            </div>
            <div className="px-2 py-1.5 text-[11px] text-inkDim flex items-center justify-between">
              <span>{o.label}</span>
              {o.price > 0 && <span className="text-inkFaint">+${o.price.toFixed(2)}</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function PriceRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between text-xs text-inkDim mb-2">
      <span>{label}</span>
      <span className="font-mono">{value > 0 ? `$${value.toFixed(2)}` : "included"}</span>
    </div>
  );
}
