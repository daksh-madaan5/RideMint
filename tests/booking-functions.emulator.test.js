import assert from 'node:assert/strict';
import { after, before, beforeEach, test } from 'node:test';
import { initializeApp, deleteApp } from 'firebase/app';
import {
  connectAuthEmulator,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from 'firebase/functions';
import {
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  Timestamp,
} from 'firebase/firestore';

const PROJECT_ID = 'demo-ridemint';
const REGION = 'asia-south1';
const PASSWORD = 'emulator-test-password';
const clientContexts = new Map();
const clientApps = [];
let testEnvironment;

function isoDateFromToday(offsetDays) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

function listingData(ownerId, overrides = {}) {
  return {
    ownerId,
    ownerSnapshot: {
      displayName: `${ownerId} host`,
      photoURL: '',
      emailVerified: true,
    },
    make: 'Tata',
    model: 'Nexon',
    year: 2024,
    category: 'SUV',
    city: 'Bengaluru',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    seats: 5,
    pricePerDay: 3200,
    description:
      'A maintained city-friendly vehicle with complete service history and comfortable seating.',
    images: [{
      url: 'https://example.test/nexon.jpg',
      publicId: 'test/nexon',
      assetId: 'asset-nexon',
      width: 1200,
      height: 800,
      format: 'jpg',
    }],
    listingStatus: 'approved',
    availabilityStatus: 'available',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    ...overrides,
  };
}

function bookingData({
  customerId = 'customer-a',
  ownerId = 'owner-a',
  listingId = 'listing-a',
  pickupDate = isoDateFromToday(10),
  returnDate = isoDateFromToday(13),
  status = 'pending',
} = {}) {
  return {
    customerId,
    ownerId,
    listingId,
    listingSnapshot: {
      make: 'Tata',
      model: 'Nexon',
      year: 2024,
      city: 'Bengaluru',
      imageUrl: 'https://example.test/nexon.jpg',
    },
    pricingSnapshot: {
      pricePerDay: 3200,
      rentalDays: 3,
      baseAmount: 9600,
      totalAmount: 9600,
      currency: 'INR',
    },
    pickupDate,
    returnDate,
    status,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    confirmedAt: status === 'confirmed' ? Timestamp.now() : null,
    cancelledAt: null,
    rejectedAt: null,
  };
}

async function seedDocument(path, data) {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), path), data);
  });
}

async function readDocument(path) {
  let result = null;
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const snapshot = await getDoc(doc(context.firestore(), path));
    result = snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null;
  });
  return result;
}

async function readCollection(path) {
  let result = [];
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    const snapshot = await getDocs(collection(context.firestore(), path));
    result = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
  });
  return result;
}

function emulatorAddress(variableName, fallback) {
  return process.env[variableName] || fallback;
}

async function createDeterministicAuthUser(uid, email) {
  const authHost = emulatorAddress('FIREBASE_AUTH_EMULATOR_HOST', '127.0.0.1:9099');
  const response = await fetch(
    `http://${authHost}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`,
    {
      method: 'POST',
      headers: {
        Authorization: 'Bearer owner',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        localId: uid,
        email,
        password: PASSWORD,
        emailVerified: true,
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Could not create deterministic Auth Emulator user ${uid}: ${errorBody}`);
  }
}

async function clientFor(uid) {
  const cacheKey = uid || 'unauthenticated';
  if (clientContexts.has(cacheKey)) return clientContexts.get(cacheKey);

  const app = initializeApp({
    apiKey: 'demo-api-key',
    authDomain: `${PROJECT_ID}.firebaseapp.com`,
    projectId: PROJECT_ID,
    appId: `demo-${cacheKey}`,
  }, `booking-test-${cacheKey}`);
  clientApps.push(app);

  const auth = getAuth(app);
  const authHost = emulatorAddress('FIREBASE_AUTH_EMULATOR_HOST', '127.0.0.1:9099');
  connectAuthEmulator(auth, `http://${authHost}`, { disableWarnings: true });

  if (uid) {
    const email = `${uid}@example.test`;
    await createDeterministicAuthUser(uid, email);
    const credential = await signInWithEmailAndPassword(auth, email, PASSWORD);
    assert.equal(credential.user.uid, uid);
  }

  const functions = getFunctions(app, REGION);
  const [functionsHost, functionsPort] =
    emulatorAddress('FIREBASE_FUNCTIONS_EMULATOR_HOST', '127.0.0.1:5001').split(':');
  connectFunctionsEmulator(functions, functionsHost, Number(functionsPort));

  const context = { app, auth, functions };
  clientContexts.set(cacheKey, context);
  return context;
}

async function callFunction(name, data, uid) {
  const { functions } = await clientFor(uid);
  return (await httpsCallable(functions, name)(data)).data;
}

async function assertCallableFails(promise, expectedCode) {
  await assert.rejects(promise, (error) => {
    assert.equal(error.code, `functions/${expectedCode}`);
    return true;
  });
}

async function requestFixture({
  customerId = 'customer-a',
  listingId = 'listing-a',
  pickupDate = isoDateFromToday(10),
  returnDate = isoDateFromToday(13),
  requestId = `request-${crypto.randomUUID()}`,
  extra = {},
} = {}) {
  return callFunction('requestBooking', {
    listingId,
    pickupDate,
    returnDate,
    requestId,
    ...extra,
  }, customerId);
}

before(async () => {
  for (const variableName of [
    'FIRESTORE_EMULATOR_HOST',
    'FIREBASE_AUTH_EMULATOR_HOST',
  ]) {
    if (!process.env[variableName]) {
      throw new Error(`Missing ${variableName}. Run npm run test:booking-backend.`);
    }
  }

  testEnvironment = await initializeTestEnvironment({ projectId: PROJECT_ID });
});

beforeEach(async () => {
  await testEnvironment.clearFirestore();
});

after(async () => {
  await testEnvironment?.cleanup();
  await Promise.all(clientApps.map((app) => deleteApp(app)));
});

test('1. unauthenticated request is rejected', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  await assertCallableFails(requestFixture({ customerId: null }), 'unauthenticated');
});

test('2. missing or malformed dates are rejected', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  await assertCallableFails(
    requestFixture({ pickupDate: 'not-a-date' }),
    'invalid-argument'
  );
});

test('3. return before pickup is rejected', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  await assertCallableFails(
    requestFixture({
      pickupDate: isoDateFromToday(10),
      returnDate: isoDateFromToday(9),
    }),
    'invalid-argument'
  );
});

test('4. past pickup is rejected', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  await assertCallableFails(
    requestFixture({
      pickupDate: isoDateFromToday(-1),
      returnDate: isoDateFromToday(1),
    }),
    'invalid-argument'
  );
});

test('5. rental longer than 30 days is rejected', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  await assertCallableFails(
    requestFixture({
      pickupDate: isoDateFromToday(1),
      returnDate: isoDateFromToday(32),
    }),
    'invalid-argument'
  );
});

test('6. customer cannot request their own listing', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('customer-a'));
  await assertCallableFails(requestFixture(), 'failed-precondition');
});

test('7. pending listing cannot be booked', async () => {
  await seedDocument(
    'vehicleListings/listing-a',
    listingData('owner-a', { listingStatus: 'pending' })
  );
  await assertCallableFails(requestFixture(), 'failed-precondition');
});

test('8. inactive listing cannot be booked', async () => {
  await seedDocument(
    'vehicleListings/listing-a',
    listingData('owner-a', { listingStatus: 'inactive' })
  );
  await assertCallableFails(requestFixture(), 'failed-precondition');
});

test('9. client-supplied price manipulation is ignored', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  const result = await requestFixture({
    extra: { pricePerDay: 1, rentalDays: 1, totalAmount: 1, ownerId: 'attacker' },
  });
  const booking = await readDocument(`rentalBookings/${result.bookingId}`);

  assert.deepEqual(booking.pricingSnapshot, {
    pricePerDay: 3200,
    rentalDays: 3,
    baseAmount: 9600,
    totalAmount: 9600,
    currency: 'INR',
  });
  assert.equal(booking.ownerId, 'owner-a');
});

test('10. valid request creates pending booking with authoritative snapshots', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  const result = await requestFixture();
  const booking = await readDocument(`rentalBookings/${result.bookingId}`);

  assert.equal(result.status, 'pending');
  assert.equal(booking.customerId, 'customer-a');
  assert.equal(booking.listingSnapshot.make, 'Tata');
  assert.equal(booking.listingSnapshot.imageUrl, 'https://example.test/nexon.jpg');
  assert.equal((await readCollection('bookingLocks')).length, 0);
});

test('11. unrelated user cannot respond', async () => {
  await seedDocument('rentalBookings/booking-11', bookingData());
  await assertCallableFails(
    callFunction('respondToBooking', { bookingId: 'booking-11', decision: 'accept' }, 'stranger'),
    'permission-denied'
  );
});

test('12. customer cannot accept their own request', async () => {
  await seedDocument('rentalBookings/booking-12', bookingData());
  await assertCallableFails(
    callFunction('respondToBooking', { bookingId: 'booking-12', decision: 'accept' }, 'customer-a'),
    'permission-denied'
  );
});

test('13. correct host rejects a pending request', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  await seedDocument('rentalBookings/booking-13', bookingData());
  const result = await callFunction(
    'respondToBooking',
    { bookingId: 'booking-13', decision: 'reject' },
    'owner-a'
  );
  const booking = await readDocument('rentalBookings/booking-13');

  assert.equal(result.status, 'rejected');
  assert.equal(booking.status, 'rejected');
  assert.ok(booking.rejectedAt);
});

test('14. correct host accepts an available request', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  await seedDocument('rentalBookings/booking-14', bookingData());
  const result = await callFunction(
    'respondToBooking',
    { bookingId: 'booking-14', decision: 'accept' },
    'owner-a'
  );

  assert.equal(result.status, 'confirmed');
  assert.equal((await readDocument('rentalBookings/booking-14')).status, 'confirmed');
});

test('15. repeated response is rejected', async () => {
  await seedDocument('rentalBookings/booking-15', bookingData({ status: 'rejected' }));
  await assertCallableFails(
    callFunction('respondToBooking', { bookingId: 'booking-15', decision: 'reject' }, 'owner-a'),
    'failed-precondition'
  );
});

test('16. accepting creates every expected rental-date lock', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  await seedDocument('rentalBookings/booking-16', bookingData());
  await callFunction(
    'respondToBooking',
    { bookingId: 'booking-16', decision: 'accept' },
    'owner-a'
  );

  const locks = await readCollection('bookingLocks');
  assert.deepEqual(
    locks.map((lock) => lock.rentalDate).sort(),
    [isoDateFromToday(10), isoDateFromToday(11), isoDateFromToday(12)]
  );
});

test('17. return date is not locked', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  await seedDocument('rentalBookings/booking-17', bookingData());
  await callFunction(
    'respondToBooking',
    { bookingId: 'booking-17', decision: 'accept' },
    'owner-a'
  );

  assert.equal(
    await readDocument(`bookingLocks/listing-a_${isoDateFromToday(13)}`),
    null
  );
});

test('18. overlapping acceptance is rejected', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  await seedDocument('rentalBookings/booking-18-a', bookingData());
  await seedDocument('rentalBookings/booking-18-b', bookingData({
    customerId: 'customer-b',
    pickupDate: isoDateFromToday(11),
    returnDate: isoDateFromToday(14),
  }));

  await callFunction(
    'respondToBooking',
    { bookingId: 'booking-18-a', decision: 'accept' },
    'owner-a'
  );
  await assertCallableFails(
    callFunction(
      'respondToBooking',
      { bookingId: 'booking-18-b', decision: 'accept' },
      'owner-a'
    ),
    'already-exists'
  );
});

test('19. concurrent overlapping acceptances produce only one success', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  await seedDocument('rentalBookings/booking-19-a', bookingData());
  await seedDocument('rentalBookings/booking-19-b', bookingData({
    customerId: 'customer-b',
    pickupDate: isoDateFromToday(11),
    returnDate: isoDateFromToday(14),
  }));

  const outcomes = await Promise.allSettled([
    callFunction(
      'respondToBooking',
      { bookingId: 'booking-19-a', decision: 'accept' },
      'owner-a'
    ),
    callFunction(
      'respondToBooking',
      { bookingId: 'booking-19-b', decision: 'accept' },
      'owner-a'
    ),
  ]);

  assert.equal(outcomes.filter((outcome) => outcome.status === 'fulfilled').length, 1);
  assert.equal(outcomes.filter((outcome) => outcome.status === 'rejected').length, 1);
  const bookings = await readCollection('rentalBookings');
  assert.equal(bookings.filter((booking) => booking.status === 'confirmed').length, 1);
});

test('20. non-overlapping requests can both be confirmed', async () => {
  await seedDocument('vehicleListings/listing-a', listingData('owner-a'));
  await seedDocument('rentalBookings/booking-20-a', bookingData());
  await seedDocument('rentalBookings/booking-20-b', bookingData({
    customerId: 'customer-b',
    pickupDate: isoDateFromToday(13),
    returnDate: isoDateFromToday(16),
  }));

  const outcomes = await Promise.all([
    callFunction(
      'respondToBooking',
      { bookingId: 'booking-20-a', decision: 'accept' },
      'owner-a'
    ),
    callFunction(
      'respondToBooking',
      { bookingId: 'booking-20-b', decision: 'accept' },
      'owner-a'
    ),
  ]);
  assert.deepEqual(outcomes.map((result) => result.status), ['confirmed', 'confirmed']);
});

test('21. customer cancels their own pending request', async () => {
  await seedDocument('rentalBookings/booking-21', bookingData());
  const result = await callFunction(
    'cancelBooking',
    { bookingId: 'booking-21' },
    'customer-a'
  );

  assert.equal(result.status, 'cancelled');
  assert.equal((await readDocument('rentalBookings/booking-21')).status, 'cancelled');
});

test('22. customer cancels their confirmed future booking', async () => {
  await seedDocument('rentalBookings/booking-22', bookingData({ status: 'confirmed' }));
  const result = await callFunction(
    'cancelBooking',
    { bookingId: 'booking-22' },
    'customer-a'
  );

  assert.equal(result.status, 'cancelled');
});

test('23. confirmed cancellation releases its lock documents', async () => {
  await seedDocument('rentalBookings/booking-23', bookingData({ status: 'confirmed' }));
  for (const offset of [10, 11, 12]) {
    const rentalDate = isoDateFromToday(offset);
    await seedDocument(`bookingLocks/listing-a_${rentalDate}`, {
      listingId: 'listing-a',
      bookingId: 'booking-23',
      rentalDate,
      createdAt: Timestamp.now(),
    });
  }

  await callFunction('cancelBooking', { bookingId: 'booking-23' }, 'customer-a');
  assert.equal((await readCollection('bookingLocks')).length, 0);
});

test('24. cancellation does not delete another booking lock', async () => {
  await seedDocument('rentalBookings/booking-24', bookingData({ status: 'confirmed' }));
  const rentalDate = isoDateFromToday(10);
  await seedDocument(`bookingLocks/listing-a_${rentalDate}`, {
    listingId: 'listing-a',
    bookingId: 'different-booking',
    rentalDate,
    createdAt: Timestamp.now(),
  });

  await callFunction('cancelBooking', { bookingId: 'booking-24' }, 'customer-a');
  assert.equal(
    (await readDocument(`bookingLocks/listing-a_${rentalDate}`)).bookingId,
    'different-booking'
  );
});

test('25. another customer cannot cancel the booking', async () => {
  await seedDocument('rentalBookings/booking-25', bookingData());
  await assertCallableFails(
    callFunction('cancelBooking', { bookingId: 'booking-25' }, 'customer-b'),
    'permission-denied'
  );
});

test('26. invalid status cancellation is rejected', async () => {
  await seedDocument('rentalBookings/booking-26', bookingData({ status: 'rejected' }));
  await assertCallableFails(
    callFunction('cancelBooking', { bookingId: 'booking-26' }, 'customer-a'),
    'failed-precondition'
  );
});

test('27. already-started confirmed booking cannot be cancelled', async () => {
  await seedDocument('rentalBookings/booking-27', bookingData({
    status: 'confirmed',
    pickupDate: isoDateFromToday(0),
    returnDate: isoDateFromToday(2),
  }));
  await assertCallableFails(
    callFunction('cancelBooking', { bookingId: 'booking-27' }, 'customer-a'),
    'failed-precondition'
  );
});
