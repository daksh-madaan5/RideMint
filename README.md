<div align="center">
  <img src="public/images/brand/ridemint-logo.png" alt="RideMint" width="280" />

  <p><strong>A peer-to-peer car marketplace, built around local hosts and trusted journeys.</strong></p>

  <p>
    <img alt="React 19" src="https://img.shields.io/badge/React-19-20232a?style=flat-square&logo=react&logoColor=61dafb" />
    <img alt="Vite 8" src="https://img.shields.io/badge/Vite-8-646cff?style=flat-square&logo=vite&logoColor=white" />
    <img alt="Firebase" src="https://img.shields.io/badge/Firebase-Emulator%20certified-ffca28?style=flat-square&logo=firebase&logoColor=1f2937" />
  </p>
</div>

---

## Meet RideMint

RideMint is a peer-to-peer car rental marketplace where users can browse available cars, list their own vehicles, manage listings, and go through an admin moderation flow before a car becomes publicly visible.

The project is built with React, Firebase, Firestore, and Cloudinary, with a focus on practical marketplace workflows such as multi-image vehicle listings, moderation, availability handling, and secure booking logic.

The public deployment includes browsing, authentication, listing management, and moderation. The booking backend is implemented and tested locally with Firebase Functions and the Emulator Suite, but is not deployed publicly on the current Firebase Spark setup.

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

Payments, payouts, messaging, KYC, production booking Functions, and booking-management UI are deliberately outside the current scope.

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
| `npm run dev` | Start the development server |
| `npm run lint` | Run lint checks |
| `npm run build:preview` | Create the production preview build |
| `npm run test:firebase` | Run the Firebase test suite which covers listing policy, booking-domain logic, callable integration, concurrency, and Firestore Rules |


## Deployment

RideMint is deployed using Firebase Hosting.

The public build runs in preview mode, while the secure booking backend is currently tested locally with Firebase Functions and the Emulator Suite.

To create a production preview build:

```powershell
npm run build:preview
---

<div align="center">
  <sub>Built thoughtfully for local car sharing.</sub>
</div>
