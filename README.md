# DriveFleet

DriveFleet is a placement-ready car-rental and fleet-management web application
being developed incrementally with React, Vite, Firebase, and Tailwind CSS.

The repository currently contains an early customer and administrator interface
connected directly to Firebase client services. Phase 0 identified useful
foundations as well as security, data consistency, accessibility, and visual
design work that must be addressed before the application can be considered
reliable.

## Current status

Phase 0 — repository audit and plan — is complete. No application code or
Firebase configuration was changed during the audit.

See:

- [Architecture](docs/architecture.md)
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

The current lint command completes with warnings, and the production build
completes with a large-chunk warning. These are recorded in
`docs/progress.md`.

## Environment

The application expects the following Vite variables:

```text
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

Do not commit a populated `.env` or `.env.local`. An example file will be added
as part of the approved foundation/Firebase setup work without inventing values.

