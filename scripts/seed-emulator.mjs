import { FALLBACK_VEHICLES } from '../src/features/cars/data/catalogVehicles.js';

const projectId = process.env.GCLOUD_PROJECT || 'demo-ridemint';
const authHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || '127.0.0.1:9099';
const firestoreHost = process.env.FIRESTORE_EMULATOR_HOST || '127.0.0.1:8080';
const authorization = { Authorization: 'Bearer owner' };
const hostAccount = {
  uid: 'seeded-host',
  name: 'RideMint Host',
  email: 'host@ridemint.local',
  password: 'LocalHost123!',
};

if (!['127.0.0.1', 'localhost'].includes(new URL(`http://${authHost}`).hostname)
  || !['127.0.0.1', 'localhost'].includes(new URL(`http://${firestoreHost}`).hostname)) {
  throw new Error('The seed command may connect only to local Firebase emulators.');
}

await ensureAuthAccount();
await createDocumentIfMissing(`users/${hostAccount.uid}`, {
  uid: hostAccount.uid,
  name: hostAccount.name,
  email: hostAccount.email,
  photo: '',
  favorites: [],
  role: 'user',
  createdAt: new Date(),
});

for (const vehicle of FALLBACK_VEHICLES) {
  await createDocumentIfMissing(`vehicleListings/seed-${vehicle.id}`, {
    ownerId: hostAccount.uid,
    ownerSnapshot: {
      displayName: hostAccount.name,
      photoURL: '',
      emailVerified: true,
    },
    make: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    category: vehicle.category,
    city: vehicle.city,
    transmission: vehicle.transmission,
    fuelType: vehicle.fuelType,
    seats: vehicle.seats,
    pricePerDay: vehicle.pricePerDay,
    description: vehicle.description,
    pickupArea: vehicle.branch.address,
    rentalTerms: vehicle.rentalTerms,
    fuelPolicy: vehicle.fuelPolicy,
    securityDeposit: vehicle.securityDeposit,
    cancellationPolicy: vehicle.cancellationPolicy,
    images: [{
      url: vehicle.image,
      publicId: `local-seed/${vehicle.id}`,
      assetId: `local-seed-${vehicle.id}`,
      width: 1600,
      height: 1000,
      format: 'webp',
    }],
    listingStatus: 'approved',
    availabilityStatus: 'available',
    source: 'seed',
    createdAt: new Date(),
    updatedAt: new Date(),
    moderatedAt: new Date(),
    moderatedBy: 'emulator-seed',
    rejectionReason: null,
  });
}

console.log(`Local emulator seed ready: ${FALLBACK_VEHICLES.length} approved listings owned by ${hostAccount.email}.`);

async function ensureAuthAccount() {
  const response = await fetch(
    `http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`,
    {
      method: 'POST',
      headers: { ...authorization, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        localId: hostAccount.uid,
        email: hostAccount.email,
        password: hostAccount.password,
        emailVerified: true,
        displayName: hostAccount.name,
      }),
    }
  );

  if (response.ok) return;
  const payload = await response.json();
  if (['EMAIL_EXISTS', 'DUPLICATE_LOCAL_ID'].includes(payload?.error?.message)) return;
  throw new Error(`Could not seed the host account: ${payload?.error?.message || response.statusText}`);
}

async function createDocumentIfMissing(path, data) {
  const url = `http://${firestoreHost}/v1/projects/${projectId}/databases/(default)/documents/${path}`;
  const existing = await fetch(url, { headers: authorization });
  if (existing.ok) {
    console.log(`Preserved existing ${path}`);
    return;
  }
  if (existing.status !== 404) {
    throw new Error(`Could not inspect ${path}: ${existing.status} ${existing.statusText}`);
  }

  const response = await fetch(url, {
    method: 'PATCH',
    headers: { ...authorization, 'Content-Type': 'application/json' },
    body: JSON.stringify({ fields: firestoreFields(data) }),
  });
  if (!response.ok) {
    throw new Error(`Could not seed ${path}: ${response.status} ${response.statusText}`);
  }
  console.log(`Created ${path}`);
}

function firestoreFields(record) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [key, firestoreValue(value)])
  );
}

function firestoreValue(value) {
  if (value === null) return { nullValue: null };
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) {
    return { arrayValue: { values: value.map(firestoreValue) } };
  }
  if (typeof value === 'object') {
    return { mapValue: { fields: firestoreFields(value) } };
  }
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    return Number.isInteger(value)
      ? { integerValue: String(value) }
      : { doubleValue: value };
  }
  return { stringValue: String(value) };
}
