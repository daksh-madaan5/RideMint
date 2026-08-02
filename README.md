<div align="center">
  <img src="public/images/brand/ridemint-logo.png" alt="RideMint" width="280" />

  <p><strong>A peer-to-peer car marketplace, built around local hosts and trusted journeys.</strong></p>

  <p>
    <img alt="React 19" src="https://img.shields.io/badge/React-19-20232a?style=flat-square&logo=react&logoColor=61dafb" />
    <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white" />
    <img alt="Firebase" src="https://img.shields.io/badge/Firebase-Emulator%20certified-ffca28?style=flat-square&logo=firebase&logoColor=1f2937" />
    <img alt="Licence not specified" src="https://img.shields.io/badge/licence-not%20specified-lightgrey?style=flat-square" />
  </p>
</div>

---

## Meet RideMint

RideMint helps people discover cars listed by other members in their community. There is no separate “host” account to unlock: an authenticated member can list a car, manage it, and track its moderation status, while administrators keep the public catalogue trustworthy.

The project currently includes the complete browsing and listing journeys, alongside a secure booking workflow for local Firebase Emulator development. The interface follows RideMint’s **Editorial Automotive** design direction—warm, practical, and intentionally free of marketplace gimmicks.

> [!IMPORTANT]
> Public Firebase Spark builds run in **preview mode**. They never call Cloud Functions or query `rentalBookings`. Secure booking is local-only until a separate production deployment is approved.

## What works today

- Browse a deterministic public catalogue and view individual cars
- Create, edit, deactivate, and reactivate authenticated member listings
- Upload listing images through Cloudinary unsigned uploads
- Moderate submitted listings from the administrator experience
- Request and cancel bookings in local-secure development mode
- Accept or reject requests as the listing host in local-secure mode
- Review all bookings from the read-only local administrator page
- Prevent booking overlaps with deterministic per-day locks and trusted backend logic
- Enforce listing, booking, user, car, and review access through Firestore Security Rules

Payments, payouts, messaging, KYC, production booking Functions, and booking-management UI are deliberately outside the current scope. See [Product scope](docs/product-scope.md) for the full boundary.

## Under the bonnet

| Area | Technology |
| --- | --- |
| Interface | React 19, React Router, Vite, Tailwind CSS |
| Forms and validation | React Hook Form, Zod |
| Remote state | TanStack Query |
| Authentication and data | Firebase Authentication, Cloud Firestore |
| Trusted booking operations | Second-generation callable Firebase Functions |
| Listing images | Cloudinary unsigned uploads |
| Local verification | Node test runner, Firebase Emulator Suite |

The browser is never treated as the authority for privileged operations. Ownership, moderation access, booking prices, availability, status changes, and overlap protection are enforced through Firestore Rules and trusted backend code.

## Get started

### 1. Prerequisites

Make sure you have:

- [Node.js 22](https://nodejs.org/)
- Java 21 or newer (required by the Firebase Emulator Suite)
- A Firebase web app configuration
- A Cloudinary cloud name and unsigned upload preset

### 2. Install the project

```powershell
npm install
npm --prefix functions install
Copy-Item .env.example .env.local
```

Add your `VITE_FIREBASE_*` and `VITE_CLOUDINARY_*` values to `.env.local`, then start the app:

```powershell
npm run dev
```

Open the local URL printed by Vite. Keep `.env.local` private—it is intentionally ignored by Git and should never be committed.

## Choose a booking mode

RideMint keeps public previews and trusted local booking development clearly separated.

| Mode | Intended use | Booking behaviour |
| --- | --- | --- |
| `preview` | Public builds and everyday interface work | Informational states only; no booking Functions or booking queries |
| `local-secure` | Explicit local development with emulators | Enables the certified callable booking workflow |

The defaults in `.env.example` are safe for a public preview. To work on secure booking locally, change only your untracked `.env.local`:

```dotenv
VITE_BOOKING_MODE=local-secure
VITE_USE_FIREBASE_EMULATORS=true
```

Start the Emulator Suite in one terminal and Vite in another:

```powershell
# Terminal 1
npm run firebase:emulators

# Terminal 2
npm run dev
```

For safety, secure booking also checks that the app is a Vite development build running on `localhost` or `127.0.0.1`.

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Starts the Vite development server |
| `npm run lint` | Runs the Oxlint checks |
| `npm run build:preview` | Creates the production-safe preview build |
| `npm run preview` | Serves the built app locally |
| `npm run test:listings` | Tests listing policy behaviour |
| `npm run test:booking-domain` | Tests booking domain logic |
| `npm run test:rules` | Tests Firestore allow and deny cases |
| `npm run test:booking-backend` | Tests callable booking Functions against the emulators |
| `npm run test:firebase` | Runs the complete certified Firebase test sequence |

`npm run test:firebase` covers listing policy, booking-domain logic, callable integration, concurrency, and Firestore Rules against the local `demo-ridemint` emulators. Tests do not use live production data.

## Deploy a public preview

Deployment is intentionally manual. Before continuing, provide the production Firebase web configuration through untracked environment variables or `.env.local`, and confirm that `VITE_FIREBASE_PROJECT_ID` matches the real project you intend to use.

```powershell
$env:VITE_BOOKING_MODE="preview"
$env:VITE_USE_FIREBASE_EMULATORS="false"

npm run build:preview
npx firebase login
npx firebase projects:list
npx firebase deploy --only "hosting,firestore:rules,firestore:indexes" --project YOUR_VERIFIED_REAL_PROJECT_ID
```

> [!WARNING]
> Never deploy from `demo-ridemint`, run an unrestricted `firebase deploy`, add `functions` to the deployment target, or use `local-secure` for a public build.

Firebase Hosting serves `dist` and rewrites application routes to `/index.html`. After deployment, add the Hosting domain to Firebase Authentication’s authorised domains if required.

## Project guide

| Document | When to read it |
| --- | --- |
| [Architecture](docs/architecture.md) | Understand the application boundaries and code structure |
| [Product scope](docs/product-scope.md) | See what belongs in RideMint—and what intentionally does not |
| [Firebase setup](docs/firebase-setup.md) | Configure Firebase and the local Emulator Suite |
| [Firestore security](docs/firestore-security.md) | Review access-control decisions and rule guarantees |
| [Secure booking backend](docs/booking-backend.md) | Follow the trusted booking contract and local workflow |
| [Listing workflow](docs/listing-mvp.md) | Understand listing creation, ownership, and moderation |
| [Data model](docs/data-model.md) | Explore the stored document shapes and relationships |
| [Design system](docs/design-system.md) | Work with the Graphite Mint visual language |
| [Image credits](docs/image-credits.md) | Review attribution for bundled imagery |

## A note for contributors

RideMint grows in deliberately small, reviewable phases. Before adding a feature, check the current scope and preserve the security boundary: React route guards improve navigation, but Firebase Security Rules and trusted Functions provide authorisation.

When making a change, please run the relevant tests as well as:

```powershell
npm run lint
npm run build:preview
```

Keep the experience grounded in Bengaluru and Indian English, format money in INR, and favour clear, working interactions over decorative controls.

---

<div align="center">
  <sub>Built thoughtfully for local car sharing.</sub>
</div>
