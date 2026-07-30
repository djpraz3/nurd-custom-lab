import Link from "next/link";
import { STARTER_PRODUCTS } from "@/lib/products";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-ink">
      <nav className="flex items-center justify-between px-10 py-5 border-b border-border">
        <span className="font-display font-bold tracking-wide">PROJECT.NURD</span>
        <span className="text-xs text-inkFaint font-mono">Custom Lab — scaffold</span>
      </nav>

      <section className="max-w-3xl mx-auto text-center pt-24 pb-16 px-6">
        <h1 className="font-display text-5xl font-bold leading-tight mb-6">
          Build a Box That Is <span className="text-violet">Completely Yours</span>
        </h1>
        <p className="text-inkDim text-lg max-w-lg mx-auto">
          Customize every printable side of your trading-card box. This is the live
          Next.js scaffold — the editor, storefront, and admin dashboard get built
          out phase by phase from here.
        </p>
      </section>

      <section className="max-w-5xl mx-auto px-6 pb-24 grid gap-6 sm:grid-cols-3">
        {STARTER_PRODUCTS.map((p) => (
          <Link
            key={p.slug}
            href={`/design/${p.slug}`}
            className="border border-border rounded-xl p-6 bg-panel hover:border-violet transition-colors"
          >
            <div className="text-[10px] uppercase tracking-wide text-gold font-semibold mb-2">
              {p.productType}
            </div>
            <h2 className="font-display font-semibold text-lg mb-2">{p.name}</h2>
            <p className="text-inkFaint text-xs mb-4">
              {p.widthIn}&quot; × {p.heightIn}&quot; × {p.depthIn}&quot;
            </p>
            <div className="font-display font-bold text-xl">${p.basePrice}</div>
          </Link>
        ))}
      </section>
    </main>
  );
}
