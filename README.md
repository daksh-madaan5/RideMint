# RideMint

RideMint is a placement-ready, company-owned car-rental and fleet-management
application being developed incrementally with React, Vite, Firebase, and
Tailwind CSS.

Customers rent RideMint vehicles directly. The current product does not support
third-party hosts, owner listings, payouts, or peer-to-peer messaging.

## Previous status

Phase 1B — branding and product-scope alignment — is complete. The Graphite Mint
design system can be inspected at `/design-system` while the development server
is running. Existing product pages have not yet been redesigned.

## Current status

Phase 2 — core customer browsing — is complete. The light-first Graphite Mint
customer shell now includes a focused Home page, a filterable demo catalogue,
vehicle details, and About. The design system remains available at
`/design-system`.

Phase 2 deliberately uses a deterministic local demo catalogue. Existing
Firebase configuration, collections, authentication, booking, and administrator
behavior remain unchanged.

See:

- [Architecture](docs/architecture.md)
- [Product scope](docs/product-scope.md)
- [Design system](docs/design-system.md)
- [Route audit](docs/route-audit.md)
- [Image credits and strategy](docs/image-credits.md)
- [Firebase setup](docs/firebase-setup.md)
- [Data model](docs/data-model.md)
- [Progress](docs/progress.md)
- [Engineering guide](AGENTS.md)

## Local commands

```powershell
npm install
npm run dev
npm run lint
npm run build
```

Lint currently completes with pre-existing feature warnings. The production
build succeeds with a large-chunk warning. Details are recorded in
`docs/progress.md`.

## Environment

Firebase still uses the existing `VITE_FIREBASE_*` environment variables.
Visible RideMint branding does not require renaming Firebase projects, deployed
resources, collections, fields, or environment keys.

Never commit a populated `.env`, `.env.local`, service-account file, private
key, or deployment token.
