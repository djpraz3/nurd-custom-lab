import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ConfigureStep from "@/components/ConfigureStep";

export default async function DesignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { options: { where: { active: true } } },
  });

  if (!product) notFound();

  const byName = (name: string) =>
    product.options
      .filter((o) => o.optionName === name)
      .map((o) => ({ label: o.choiceLabel, price: Number(o.priceAdjustment) }));

  return (
    <ConfigureStep
      product={{
        id: product.id,
        name: product.name,
        productType: product.productType,
        basePrice: Number(product.basePrice),
        minQuantity: product.minQuantity,
        widthIn: Number(product.widthIn),
        heightIn: Number(product.heightIn),
        depthIn: Number(product.depthIn),
        productionDays: product.productionDays,
      }}
      covers={byName("Cover")}
      colors={byName("Color")}
      graphics={byName("Graphic")}
      rearFinishes={byName("Rear Finish")}
    />
  );
}
