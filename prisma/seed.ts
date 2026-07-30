import { PrismaClient } from "@prisma/client";
import { STARTER_PRODUCTS, OPTION_PRICES, COLOR_CHOICES, GRAPHIC_CHOICES } from "../src/lib/products";

// Old option groups that no longer exist at all (renamed or dropped outright)
// — every row under these names should be removed regardless of product.
const RETIRED_OPTION_NAMES = ["Closure", "Finish", "Insert"];

const prisma = new PrismaClient();

async function main() {
  for (const p of STARTER_PRODUCTS) {
    const productFields = {
      name: p.name,
      description: p.description,
      basePrice: p.basePrice,
      productType: p.productType,
      widthIn: p.widthIn,
      heightIn: p.heightIn,
      depthIn: p.depthIn,
      minQuantity: p.minQuantity,
      productionDays: p.productionDays,
    };

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: productFields,
      create: {
        ...productFields,
        slug: p.slug,
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
      ...p.covers.map((label) => ({
        optionName: "Cover",
        optionType: "select",
        choiceLabel: label,
        priceAdjustment: OPTION_PRICES.cover[label] ?? 0,
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
      ...(p.rearFinishes ?? []).map((label) => ({
        optionName: "Rear Finish",
        optionType: "select",
        choiceLabel: label,
        priceAdjustment: OPTION_PRICES.rearFinish[label] ?? 0,
      })),
    ];

    await prisma.productOption.deleteMany({
      where: { productId: product.id, optionName: { in: RETIRED_OPTION_NAMES } },
    });

    // Drop any choice under a still-active option group that's no longer
    // in the current list (e.g. "Standard insert" being removed), so
    // stale choices don't linger after edits — same idea as the retired
    // group cleanup above, just scoped per-group instead of dropping the
    // whole group.
    const byGroup = new Map<string, string[]>();
    for (const opt of options) {
      byGroup.set(opt.optionName, [...(byGroup.get(opt.optionName) ?? []), opt.choiceLabel]);
    }
    for (const [optionName, choiceLabels] of byGroup) {
      await prisma.productOption.deleteMany({
        where: { productId: product.id, optionName, choiceLabel: { notIn: choiceLabels } },
      });
    }
    // Rear Finish doesn't apply to this product at all (e.g. not ETB) —
    // remove any rows entirely if the current product no longer lists it.
    if (!p.rearFinishes) {
      await prisma.productOption.deleteMany({ where: { productId: product.id, optionName: "Rear Finish" } });
    }

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
