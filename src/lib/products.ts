// Starter product catalog — mirrors the three MVP products from the spec.
// Real dimensions must be replaced with the actual manufacturing measurements
// before production (see prisma/schema.prisma for the Product row shape).

export const COVER_CHOICES = ["See-through acrylic (1mm)", "Colored cover (1mm, non-see-through)"];

// ETB-only — its rear panel finish is customer-selectable; other products
// don't offer this option.
export const REAR_FINISH_CHOICES = ["Holographic back", "Regular", "Textured"];

export interface StarterProduct {
  slug: string;
  name: string;
  description: string;
  basePrice: number;
  productType: string;
  widthIn: number;
  heightIn: number;
  depthIn: number;
  minQuantity: number;
  productionDays: string;
  covers: string[];
  rearFinishes?: string[];
}

export const STARTER_PRODUCTS: StarterProduct[] = [
  {
    slug: "etb-style",
    name: "Custom ETB-Style Box",
    description: "Custom trading-card box, ETB-compatible display sleeve.",
    basePrice: 39.99,
    productType: "etb-style",
    widthIn: 11.75,
    heightIn: 7.5,
    depthIn: 2.75,
    minQuantity: 1,
    productionDays: "7-10",
    covers: COVER_CHOICES,
    rearFinishes: REAR_FINISH_CHOICES,
  },
  {
    slug: "booster-bundle",
    name: "Custom Booster Bundle Box",
    description: "Custom trading-card box, booster bundle-compatible box.",
    basePrice: 24.99,
    productType: "booster-bundle",
    widthIn: 9,
    heightIn: 5,
    depthIn: 3.25,
    minQuantity: 1,
    productionDays: "5-8",
    covers: COVER_CHOICES,
  },
  {
    slug: "booster-display",
    name: "Custom Booster Display Box",
    description: "Custom trading-card box, booster display-compatible box.",
    basePrice: 34.99,
    productType: "booster-display",
    widthIn: 14.5,
    heightIn: 3.75,
    depthIn: 3.75,
    minQuantity: 1,
    productionDays: "7-10",
    covers: COVER_CHOICES,
  },
];

// "Standard insert" removed per request — None / Custom insert only.
export const INSERT_CHOICES = ["None", "Custom insert"];

// Only relevant when "Colored cover" is picked — the acrylic cover is
// inherently clear, so color doesn't apply to it.
export const COLOR_CHOICES = ["Black", "White", "Red", "Blue", "Green", "Purple", "Gold", "Silver"];

// Preset gallery — no upload, no franchise/copyrighted artwork, per the
// spec's brand/legal section.
export const GRAPHIC_CHOICES = [
  "None",
  "Minimal Frame",
  "Dark Lab",
  "Neon Grid",
  "Retro Stripe",
  "Comic Burst",
  "Collector Case",
  "Luxury Gold",
];

export const OPTION_PRICES = {
  cover: { "See-through acrylic (1mm)": 6, "Colored cover (1mm, non-see-through)": 0 } as Record<string, number>,
  insert: { None: 0, "Custom insert": 6 } as Record<string, number>,
  color: {} as Record<string, number>,
  graphic: {} as Record<string, number>,
  rearFinish: { "Holographic back": 8, Regular: 0, Textured: 3 } as Record<string, number>,
};
