# RideMint

RideMint is a placement-ready peer-to-peer car-listing marketplace being
developed incrementally with React, Vite, Firebase, Cloudinary, and Tailwind CSS.

Authenticated members can submit and manage vehicle listings. Administrators
moderate them, and public browsing includes only approved, available listings.
Booking requests, payments, payouts, and messaging are not implemented.

## Previous status

Phase 1B — branding and product-scope alignment — is complete. The Graphite Mint
design system can be inspected at `/design-system` while the development server
is running. Existing product pages have not yet been redesigned.

## Previous status

Phase 2 — core customer browsing — is complete. The light-first Graphite Mint
customer shell now includes a focused Home page, a filterable demo catalogue,
vehicle details, and About. The design system remains available at
`/design-system`.

Phase 2 deliberately uses a deterministic local demo catalogue. Existing
Firebase configuration, collections, authentication, booking, and administrator
behavior remain unchanged.

## Current status

The basic listing vertical slice is implemented:

- `/list-your-car` and `/list-your-car/:listingId`
- `/my-listings`
- `/admin/listings`
- Cloudinary unsigned upload widget integration
- `vehicleListings` Firestore service, approval policy, rules, and index file
- approved public listing integration with the legacy demo fallback

The repository contains a local-only Firebase Emulator configuration and an
emulator-certified Firestore Security Rules suite. The complete listing,
booking-domain, callable, concurrency, and Rules suite passes locally.

The secure `rentalBookings` callable backend and deterministic date-lock
transactions are local-emulator-only. The Spark-plan public build defaults to
an honest booking preview and never deploys Functions.

The latest polish phase adds inactive-listing reactivation, clearer status-based
owner listing groups, supplied PNG branding, and a light Graphite Mint migration
for the admin shell and listing moderation.

See:

- [Architecture](docs/architecture.md)
- [Product scope](docs/product-scope.md)
- [Design system](docs/design-system.md)
- [Route audit](docs/route-audit.md)
- [Image credits and strategy](docs/image-credits.md)
- [Listing MVP and emulator setup](docs/listing-mvp.md)
- [Firebase setup](docs/firebase-setup.md)
- [Firestore security decisions](docs/firestore-security.md)
- [Secure booking backend](docs/booking-backend.md)
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

## Spark production-demo preparation

Build the public site with booking forced to preview mode:

```powershell
$env:VITE_BOOKING_MODE="preview"
$env:VITE_USE_FIREBASE_EMULATORS="false"
npm run build
```

After manually verifying the real Firebase project ID, deploy only traditional
Hosting, Firestore Rules, and indexes:

```powershell
npx firebase login
npx firebase projects:list
npx firebase deploy --only "hosting,firestore:rules,firestore:indexes" --project YOUR_VERIFIED_REAL_PROJECT_ID
```

Never use `demo-ridemint`, unrestricted `firebase deploy`, or a deployment
target containing `functions`. Firebase Authentication has no separate CLI
deployment step, but the deployed domain may need to be added to Authentication
authorized domains.
