import { PrismaClient } from "@prisma/client";
import { STARTER_PRODUCTS, OPTION_PRICES, INSERT_CHOICES, COLOR_CHOICES, GRAPHIC_CHOICES } from "../src/lib/products";

const prisma = new PrismaClient();

async function main() {
  for (const p of STARTER_PRODUCTS) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        basePrice: p.basePrice,
        productType: p.productType,
        widthIn: p.widthIn,
        heightIn: p.heightIn,
        depthIn: p.depthIn,
        minQuantity: p.minQuantity,
        productionDays: p.productionDays,
        // No 2D/3D editor in this scaffold right now — dielineJson is kept
        // as a bare placeholder purely to satisfy the required DB column.
        dielineJson: { note: "not used — no design editor in this build" },
      },
    });

    const options: {
      optionName: string;
      optionType: string;
      choiceLabel: string;
      priceAdjustment: number;
    }[] = [
      ...p.finishes.map((label) => ({
        optionName: "Finish",
        optionType: "select",
        choiceLabel: label,
        priceAdjustment: OPTION_PRICES.finish[label] ?? 0,
      })),
      ...p.covers.map((label) => ({
        optionName: "Cover",
        optionType: "select",
        choiceLabel: label,
        priceAdjustment: OPTION_PRICES.cover[label] ?? 0,
      })),
      ...INSERT_CHOICES.map((label) => ({
        optionName: "Insert",
        optionType: "select",
        choiceLabel: label,
        priceAdjustment: OPTION_PRICES.insert[label] ?? 0,
      })),
      ...COLOR_CHOICES.map((label) => ({
        optionName: "Color",
        optionType: "select",
        choiceLabel: label,
        priceAdjustment: OPTION_PRICES.color[label] ?? 0,
      })),
      ...GRAPHIC_CHOICES.map((label) => ({
        optionName: "Graphic",
        optionType: "select",
        choiceLabel: label,
        priceAdjustment: OPTION_PRICES.graphic[label] ?? 0,
      })),
    ];

    // "Closure" was renamed to "Cover" (acrylic vs. colored cover) — drop
    // any rows seeded under the old name so stale choices don't linger.
    await prisma.productOption.deleteMany({ where: { productId: product.id, optionName: "Closure" } });

    for (const opt of options) {
      const existing = await prisma.productOption.findFirst({
        where: { productId: product.id, optionName: opt.optionName, choiceLabel: opt.choiceLabel },
      });
      if (!existing) {
        await prisma.productOption.create({ data: { ...opt, productId: product.id } });
      }
    }
  }

  // TEMPORARY: Phase 1 (accounts/auth via NextAuth) hasn't been built yet,
  // so there's no real session to attach anything to yet. Delete this once
  // NextAuth is wired up.
  await prisma.user.upsert({
    where: { email: "demo@nurd.local" },
    update: {},
    create: { name: "Demo User", email: "demo@nurd.local", role: "CUSTOMER" },
  });

  console.log(`Seeded ${STARTER_PRODUCTS.length} products with options, and a demo user.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
