import { readFileSync } from 'node:fs';
import { after, before, beforeEach, test } from 'node:test';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';

const PROJECT_ID = 'demo-ridemint';
const RULES = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');
const FIXTURE_TIME = Timestamp.fromDate(new Date('2026-01-01T00:00:00.000Z'));

let testEnvironment;

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
      'A well maintained city-friendly vehicle with complete service history and comfortable seating.',
    images: [{
      url: 'https://example.test/nexon.jpg',
      publicId: 'test/nexon',
      assetId: 'asset-nexon',
      width: 1200,
      height: 800,
      format: 'jpg',
    }],
    listingStatus: 'pending',
    availabilityStatus: 'available',
    createdAt: FIXTURE_TIME,
    updatedAt: FIXTURE_TIME,
    ...overrides,
  };
}

function listingCreateData(ownerId, overrides = {}) {
  const data = listingData(ownerId, {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...overrides,
  });
  return data;
}

function profileData(uid, overrides = {}) {
  return {
    uid,
    name: `${uid} member`,
    email: `${uid}@example.test`,
    photo: '',
    role: 'user',
    favorites: [],
    createdAt: FIXTURE_TIME,
    ...overrides,
  };
}

function authenticatedDb(uid) {
  return testEnvironment.authenticatedContext(uid, {
    email: `${uid}@example.test`,
  }).firestore();
}

function publicDb() {
  return testEnvironment.unauthenticatedContext().firestore();
}

async function seedDocument(path, data) {
  await testEnvironment.withSecurityRulesDisabled(async (context) => {
    await setDoc(doc(context.firestore(), path), data);
  });
}

async function seedAdmin(uid = 'admin-user') {
  await seedDocument(`users/${uid}`, profileData(uid, { role: 'admin' }));
}

before(async () => {
  if (!process.env.FIRESTORE_EMULATOR_HOST) {
    throw new Error('Firestore Emulator is required. Run `npm run test:rules`.');
  }

  testEnvironment = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: { rules: RULES },
  });
});

beforeEach(async () => {
  await testEnvironment.clearFirestore();
});

after(async () => {
  await testEnvironment?.cleanup();
});

test('1. owner creates a pending listing with their own UID', async () => {
  const db = authenticatedDb('owner-a');
  await assertSucceeds(
    setDoc(doc(db, 'vehicleListings/listing-1'), listingCreateData('owner-a'))
  );
});

test('2. owner cannot create a listing using another UID', async () => {
  const db = authenticatedDb('owner-a');
  await assertFails(
    setDoc(doc(db, 'vehicleListings/listing-2'), listingCreateData('owner-b'))
  );
});

test('3. owner cannot create an approved listing', async () => {
  const db = authenticatedDb('owner-a');
  await assertFails(
    setDoc(
      doc(db, 'vehicleListings/listing-3'),
      listingCreateData('owner-a', { listingStatus: 'approved' })
    )
  );
});

test('4. owner reads their own pending listing', async () => {
  await seedDocument('vehicleListings/listing-4', listingData('owner-a'));
  await assertSucceeds(getDoc(doc(authenticatedDb('owner-a'), 'vehicleListings/listing-4')));
});

test('5. another normal user cannot read a pending listing', async () => {
  await seedDocument('vehicleListings/listing-5', listingData('owner-a'));
  await assertFails(getDoc(doc(authenticatedDb('owner-b'), 'vehicleListings/listing-5')));
});

test('6. public user reads an approved available listing', async () => {
  await seedDocument(
    'vehicleListings/listing-6',
    listingData('owner-a', { listingStatus: 'approved' })
  );
  await assertSucceeds(getDoc(doc(publicDb(), 'vehicleListings/listing-6')));
});

test('7. public user cannot read a pending listing', async () => {
  await seedDocument('vehicleListings/listing-7', listingData('owner-a'));
  await assertFails(getDoc(doc(publicDb(), 'vehicleListings/listing-7')));
});

test('8. public user cannot read an approved unavailable listing', async () => {
  await seedDocument(
    'vehicleListings/listing-8',
    listingData('owner-a', {
      listingStatus: 'approved',
      availabilityStatus: 'unavailable',
    })
  );
  await assertFails(getDoc(doc(publicDb(), 'vehicleListings/listing-8')));
});

test('9. owner edits permitted listing fields', async () => {
  await seedDocument('vehicleListings/listing-9', listingData('owner-a'));
  await assertSucceeds(
    updateDoc(doc(authenticatedDb('owner-a'), 'vehicleListings/listing-9'), {
      description:
        'An updated, well maintained city vehicle with service history and comfortable seating for five.',
      listingStatus: 'pending',
      updatedAt: serverTimestamp(),
    })
  );
});

test('10. owner cannot change ownerId', async () => {
  await seedDocument('vehicleListings/listing-10', listingData('owner-a'));
  await assertFails(
    updateDoc(doc(authenticatedDb('owner-a'), 'vehicleListings/listing-10'), {
      ownerId: 'owner-b',
      updatedAt: serverTimestamp(),
    })
  );
});

test('11. owner cannot edit another user listing', async () => {
  await seedDocument('vehicleListings/listing-11', listingData('owner-a'));
  await assertFails(
    updateDoc(doc(authenticatedDb('owner-b'), 'vehicleListings/listing-11'), {
      pricePerDay: 2800,
      listingStatus: 'pending',
      updatedAt: serverTimestamp(),
    })
  );
});

test('12. owner cannot self-approve', async () => {
  await seedDocument('vehicleListings/listing-12', listingData('owner-a'));
  await assertFails(
    updateDoc(doc(authenticatedDb('owner-a'), 'vehicleListings/listing-12'), {
      listingStatus: 'approved',
      updatedAt: serverTimestamp(),
    })
  );
});

test('13. owner deactivates an allowed listing', async () => {
  await seedDocument(
    'vehicleListings/listing-13',
    listingData('owner-a', { listingStatus: 'approved' })
  );
  await assertSucceeds(
    updateDoc(doc(authenticatedDb('owner-a'), 'vehicleListings/listing-13'), {
      listingStatus: 'inactive',
      updatedAt: serverTimestamp(),
    })
  );
});

test('14. owner reactivates an inactive listing to pending and available', async () => {
  await seedDocument(
    'vehicleListings/listing-14',
    listingData('owner-a', {
      listingStatus: 'inactive',
      availabilityStatus: 'unavailable',
    })
  );
  await assertSucceeds(
    updateDoc(doc(authenticatedDb('owner-a'), 'vehicleListings/listing-14'), {
      listingStatus: 'pending',
      availabilityStatus: 'available',
      updatedAt: serverTimestamp(),
    })
  );
});

test('15. owner cannot reactivate directly to approved', async () => {
  await seedDocument(
    'vehicleListings/listing-15',
    listingData('owner-a', { listingStatus: 'inactive' })
  );
  await assertFails(
    updateDoc(doc(authenticatedDb('owner-a'), 'vehicleListings/listing-15'), {
      listingStatus: 'approved',
      availabilityStatus: 'available',
      updatedAt: serverTimestamp(),
    })
  );
});

test('16. owner cannot hard-delete a listing', async () => {
  await seedDocument('vehicleListings/listing-16', listingData('owner-a'));
  await assertFails(
    deleteDoc(doc(authenticatedDb('owner-a'), 'vehicleListings/listing-16'))
  );
});

test('17. administrator approves a pending listing', async () => {
  await seedAdmin();
  await seedDocument('vehicleListings/listing-17', listingData('owner-a'));
  await assertSucceeds(
    updateDoc(doc(authenticatedDb('admin-user'), 'vehicleListings/listing-17'), {
      listingStatus: 'approved',
      rejectionReason: null,
      moderatedAt: serverTimestamp(),
      moderatedBy: 'admin-user',
      updatedAt: serverTimestamp(),
    })
  );
});

test('18. administrator rejects a listing with moderation data', async () => {
  await seedAdmin();
  await seedDocument('vehicleListings/listing-18', listingData('owner-a'));
  await assertSucceeds(
    updateDoc(doc(authenticatedDb('admin-user'), 'vehicleListings/listing-18'), {
      listingStatus: 'rejected',
      rejectionReason: 'Please replace the blurred registration image.',
      moderatedAt: serverTimestamp(),
      moderatedBy: 'admin-user',
      updatedAt: serverTimestamp(),
    })
  );
});

test('19. user creates and updates permitted profile fields', async () => {
  const db = authenticatedDb('profile-owner');
  const profileRef = doc(db, 'users/profile-owner');

  await assertSucceeds(
    setDoc(profileRef, {
      ...profileData('profile-owner'),
      createdAt: serverTimestamp(),
    })
  );
  await assertSucceeds(updateDoc(profileRef, { name: 'Updated member name' }));
});

test('20. normal user cannot promote their profile to admin', async () => {
  await seedDocument('users/profile-owner', profileData('profile-owner'));
  await assertFails(
    updateDoc(doc(authenticatedDb('profile-owner'), 'users/profile-owner'), {
      role: 'admin',
    })
  );
});

test('21. user cannot edit another user private profile', async () => {
  await seedDocument('users/profile-owner', profileData('profile-owner'));
  await assertFails(
    updateDoc(doc(authenticatedDb('other-user'), 'users/profile-owner'), {
      name: 'Unauthorised change',
    })
  );
});

test('22. administrator performs an allowed role-management update', async () => {
  await seedAdmin();
  await seedDocument('users/profile-owner', profileData('profile-owner'));
  await assertSucceeds(
    updateDoc(doc(authenticatedDb('admin-user'), 'users/profile-owner'), {
      role: 'admin',
    })
  );
});

test('23. unauthenticated user cannot read a private booking', async () => {
  await seedDocument('bookings/booking-23', {
    userId: 'customer-a',
    carId: 'car-a',
    status: 'pending',
    totalPrice: 5000,
    createdAt: FIXTURE_TIME,
  });
  await assertFails(getDoc(doc(publicDb(), 'bookings/booking-23')));
});

test('24. customer reads their own booking', async () => {
  await seedDocument('bookings/booking-24', {
    userId: 'customer-a',
    carId: 'car-a',
    status: 'pending',
    totalPrice: 5000,
    createdAt: FIXTURE_TIME,
  });
  await assertSucceeds(getDoc(doc(authenticatedDb('customer-a'), 'bookings/booking-24')));
});

test('25. customer cannot read another customer booking', async () => {
  await seedDocument('bookings/booking-25', {
    userId: 'customer-a',
    carId: 'car-a',
    status: 'pending',
    totalPrice: 5000,
    createdAt: FIXTURE_TIME,
  });
  await assertFails(getDoc(doc(authenticatedDb('customer-b'), 'bookings/booking-25')));
});

test('26. normal user cannot perform an administrator-only legacy operation', async () => {
  await seedDocument('cars/car-26', {
    brand: 'Tata',
    model: 'Nexon',
    available: true,
    pricePerDay: 3200,
  });
  await assertFails(
    updateDoc(doc(authenticatedDb('customer-a'), 'cars/car-26'), {
      available: false,
    })
  );
});

function rentalBookingData(overrides = {}) {
  return {
    customerId: 'customer-a',
    ownerId: 'owner-a',
    listingId: 'listing-a',
    pickupDate: '2026-08-10',
    returnDate: '2026-08-13',
    status: 'pending',
    createdAt: FIXTURE_TIME,
    updatedAt: FIXTURE_TIME,
    ...overrides,
  };
}

test('28. customer reads their own rental booking', async () => {
  await seedDocument('rentalBookings/rental-28', rentalBookingData());
  await assertSucceeds(
    getDoc(doc(authenticatedDb('customer-a'), 'rentalBookings/rental-28'))
  );
});

test('29. host reads a request for their listing', async () => {
  await seedDocument('rentalBookings/rental-29', rentalBookingData());
  await assertSucceeds(
    getDoc(doc(authenticatedDb('owner-a'), 'rentalBookings/rental-29'))
  );
});

test('30. unrelated user cannot read a rental booking', async () => {
  await seedDocument('rentalBookings/rental-30', rentalBookingData());
  await assertFails(
    getDoc(doc(authenticatedDb('unrelated-user'), 'rentalBookings/rental-30'))
  );
});

test('31. browser cannot create a rental booking directly', async () => {
  await assertFails(
    setDoc(
      doc(authenticatedDb('customer-a'), 'rentalBookings/rental-31'),
      rentalBookingData()
    )
  );
});

test('32. browser cannot update rental booking status directly', async () => {
  await seedDocument('rentalBookings/rental-32', rentalBookingData());
  await assertFails(
    updateDoc(doc(authenticatedDb('customer-a'), 'rentalBookings/rental-32'), {
      status: 'confirmed',
    })
  );
});

test('33. browser cannot read or write booking locks', async () => {
  await seedDocument('bookingLocks/listing-a_2026-08-10', {
    listingId: 'listing-a',
    bookingId: 'rental-33',
    rentalDate: '2026-08-10',
    createdAt: FIXTURE_TIME,
  });
  const lockRef = doc(authenticatedDb('owner-a'), 'bookingLocks/listing-a_2026-08-10');

  await assertFails(getDoc(lockRef));
  await assertFails(
    setDoc(doc(authenticatedDb('owner-a'), 'bookingLocks/listing-a_2026-08-11'), {
      listingId: 'listing-a',
      bookingId: 'rental-33',
      rentalDate: '2026-08-11',
      createdAt: FIXTURE_TIME,
    })
  );
});
