# Project.NURD Custom Lab

Custom trading-card box packaging designer. Scaffolded from the full product
spec — see `SPEC.md` (paste the original doc there) for the complete
requirements this repo is building toward.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- react-konva (2D canvas editor) / react-three-fiber (3D preview)
- PostgreSQL + Prisma
- NextAuth (email/password, Google, Apple)
- Stripe (checkout)
- S3-compatible storage for uploads
- Resend for transactional email

## Getting started

```bash
npm install
cp .env.example .env       # fill in DATABASE_URL, Stripe keys, etc.
npx prisma migrate dev     # creates tables from prisma/schema.prisma
npm run db:seed            # seeds the 3 MVP products
npm run dev
```

Open http://localhost:3000 — you should see the seeded product cards.

## What's in this scaffold

- `prisma/schema.prisma` — the full data model from the spec's "Core Database
  Tables" section (Users, Products, ProductOptions, Designs, DesignVersions,
  UploadedAssets, Orders, OrderItems, Proofs, Messages).
- `prisma/seed.ts` + `src/lib/products.ts` — seeds the three MVP products
  (ETB-style box, booster bundle box, booster display box) with **placeholder**
  dimensions/dielines and their `ProductOption` rows (finish/closure/insert),
  plus a temporary demo user (see "Known gaps" below). Replace `dielineJson`
  with the real manufacturing dieline before this goes anywhere near
  production — see `docs/dieline-example.json` for the expected shape.
- `src/app/page.tsx` — home page reading products from the DB, linking each
  into `/design/[slug]`.
- `src/app/design/[slug]/page.tsx` → `DesignWorkspace` — a real, working
  **Phase 2 2D editor**, ported from the prototype onto `react-konva`:
  - `src/lib/editor/` — element/panel types, a Zustand store with working
    undo/redo, safe-zone/bleed validation, and a `Product` row → editor-shape
    adapter.
  - `src/components/editor/` — toolbar, tool panel (templates/uploads/text/
    shapes/background/layers/options/help), the Konva canvas + element nodes
    (drag/resize/rotate via `Transformer`), properties panel, validation
    modal, and a version-history/restore modal.
  - `src/app/api/designs/` — creates a `Design` + version 1 on entry, then
    **autosaves** every change to a new `DesignVersion` row (debounced), so
    version history/restore is real, not just an in-memory undo stack.

## Known gaps / what to verify first in Claude Code

This was built in a sandbox with no network access and no Postgres, so
**none of it has actually been run**. Before building further:

1. `npm install`, `cp .env.example .env` with a real `DATABASE_URL`, then
   `npx prisma migrate dev` and `npm run db:seed`.
2. `npm run dev`, open a product, and actually exercise the editor — add
   text/shapes/an image, drag and resize them, switch panels, undo/redo,
   reload and check autosave restored via "History". Expect some bugs;
   this hasn't been through a single compile or browser yet.
3. There's no auth (Phase 1 isn't built). `src/lib/demoUser.ts` and the demo
   user in `prisma/seed.ts` are a **temporary stand-in** so designs have a
   `userId` to attach to — both are commented `TEMPORARY` and should be
   deleted once NextAuth is wired up and `getDemoUserId()` is replaced with
   a real session lookup.
4. The "Add to cart" button in the validation modal currently just closes
   the modal — cart/checkout is Phase 5.

## Build order (matches the spec's phases)

1. **Storefront + accounts** — product pages (done), auth (NextAuth — not
   started), empty customer/admin dashboards.
2. **2D editor** — canvas/layers/text/upload tools on `react-konva` (done,
   unverified — see "Known gaps"), autosave to `DesignVersion` rows (done),
   real version history/restore (done, basic restore-whole-panel-doc; no
   diffing or thumbnails yet).
3. **Dielines + validation** — load real dieline JSON per product, enforce
   bleed/safe-zone checks server-side (not just in the UI), generate
   flattened 2D proofs and print-ready PDFs (`pdf-lib` + `sharp`).
4. **3D preview** — texture-map the design onto a Three.js model per product,
   simulate finishes (matte/gloss/holo/foil).
5. **Cart + checkout + proofing** — Stripe checkout, order states
   (`Paid — Awaiting Artwork Review` → proof → approval), admin review queue,
   customer/admin messaging.
6. **Testing & hardening** — responsive layouts, upload/autosave/version
   recovery, payment failure handling, permissions, security pass (rate
   limiting, signed URLs, malware scanning on uploads).

Do not skip straight to AI features, community templates, or AR preview —
those are explicitly Phase 7+ in the spec, after the core flow is reliable.

## Legal / content rules baked into the schema and seed data

- No official franchise logos, card art, or protected characters ship in this
  repo. Products are named generically ("ETB-compatible display sleeve", etc.)
  per the spec's brand/legal section.
- The copyright confirmation checkbox is required before any order can be
  placed — enforce this server-side in the checkout API route, not just
  client-side.
- Never expose `UploadedAsset.fileUrl` as a permanent public URL — sign it.
