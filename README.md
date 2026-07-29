# RideMint

RideMint is a peer-to-peer car-listing marketplace built with React, Vite,
Firebase, Cloudinary, and Tailwind CSS. Authenticated members can submit and
manage listings, administrators can moderate them, and public browsing shows
approved, available vehicles.

The repository also contains a server-authoritative booking workflow for local
Firebase Emulator development. Public Firebase Spark builds intentionally use
preview mode: they do not call Cloud Functions or query `rentalBookings`.
Payments, payouts, messaging, KYC, and production booking Functions are outside
the current scope.

## Prerequisites

- Node.js 22
- Java 21 or newer for the Firebase Emulator Suite
- A Firebase web app configuration
- A Cloudinary cloud name and unsigned upload preset for listing images

## Local setup

```powershell
npm install
npm --prefix functions install
Copy-Item .env.example .env.local
npm run dev
```

Fill the `VITE_FIREBASE_*` and `VITE_CLOUDINARY_*` values in `.env.local`.
Never commit that file. The default booking settings in `.env.example` are safe
for the public preview.

To exercise secure booking locally, run the emulators and set these values only
in `.env.local`:

```text
VITE_BOOKING_MODE=local-secure
VITE_USE_FIREBASE_EMULATORS=true
```

```powershell
npm run firebase:emulators
npm run dev
```

Secure booking is additionally restricted to a Vite development build on
`localhost` or `127.0.0.1`.

## Commands

```powershell
npm run dev
npm run lint
npm run build:preview
npm run preview
npm run test:listings
npm run test:booking-domain
npm run test:rules
npm run test:booking-backend
npm run test:firebase
```

`npm run test:firebase` runs the complete listing, booking-domain, callable,
concurrency, and Firestore Rules suite against the local `demo-ridemint`
emulators.

## Manual Firebase Spark deployment

Deployment is intentionally manual. First supply the production Firebase web
configuration through untracked environment variables or an untracked
`.env.local`, and verify that `VITE_FIREBASE_PROJECT_ID` matches the real
Firebase project selected for deployment.

```powershell
$env:VITE_BOOKING_MODE="preview"
$env:VITE_USE_FIREBASE_EMULATORS="false"
npm run build:preview
npx firebase login
npx firebase projects:list
npx firebase deploy --only "hosting,firestore:rules,firestore:indexes" --project YOUR_VERIFIED_REAL_PROJECT_ID
```

Never deploy from `demo-ridemint`, run unrestricted `firebase deploy`, or add
`functions` to the deployment target. Firebase Hosting serves `dist` and
rewrites application routes to `/index.html`. After deployment, add the Hosting
domain to Firebase Authentication authorised domains if needed.

## Documentation

- [Architecture](docs/architecture.md)
- [Product scope](docs/product-scope.md)
- [Firebase and emulator setup](docs/firebase-setup.md)
- [Firestore security decisions](docs/firestore-security.md)
- [Secure booking backend](docs/booking-backend.md)
- [Listing workflow](docs/listing-mvp.md)
- [Data model](docs/data-model.md)
- [Design system](docs/design-system.md)
- [Image credits](docs/image-credits.md)
