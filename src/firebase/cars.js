import { db } from './config.js';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp
} from 'firebase/firestore';

const carsCollection = collection(db, 'cars');

/**
 * Get cars with advanced filtering and pagination
 * @param {Object} options
 * @returns {Promise<{cars: Array, lastDoc: any}>}
 */
export async function getCars({
  brand, fuel, transmission, minPrice, maxPrice, seats, available,
  sortBy = 'createdAt', sortDir = 'desc', pageSize = 10, lastDocRef
} = {}) {
  try {
    let q = query(carsCollection);

    if (brand) q = query(q, where('brand', '==', brand));
    if (fuel) q = query(q, where('fuel', '==', fuel));
    if (transmission) q = query(q, where('transmission', '==', transmission));
    if (minPrice !== undefined) q = query(q, where('pricePerDay', '>=', minPrice));
    if (maxPrice !== undefined) q = query(q, where('pricePerDay', '<=', maxPrice));
    if (seats) q = query(q, where('seats', '>=', seats));
    if (available !== undefined) q = query(q, where('available', '==', available));

    q = query(q, orderBy(sortBy, sortDir));
    
    if (lastDocRef) {
      q = query(q, startAfter(lastDocRef));
    }
    
    q = query(q, limit(pageSize));

    const snapshot = await getDocs(q);
    const cars = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;

    return { cars, lastDoc };
  } catch (error) {
    console.error('Error fetching cars:', error);
    throw error;
  }
}

/**
 * Get a single car by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getCarById(id) {
  try {
    const docRef = doc(db, 'cars', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching car:', error);
    throw error;
  }
}

/**
 * Create a new car
 * @param {Object} data
 * @returns {Promise<string>} Created car ID
 */
export async function createCar(data) {
  try {
    const carData = {
      ...data,
      brandLower: data.brand?.toLowerCase(),
      modelLower: data.model?.toLowerCase(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    const docRef = await addDoc(carsCollection, carData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating car:', error);
    throw error;
  }
}

/**
 * Update an existing car
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<void>}
 */
export async function updateCar(id, data) {
  try {
    const docRef = doc(db, 'cars', id);
    const updateData = {
      ...data,
      updatedAt: serverTimestamp()
    };
    if (data.brand) updateData.brandLower = data.brand.toLowerCase();
    if (data.model) updateData.modelLower = data.model.toLowerCase();

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating car:', error);
    throw error;
  }
}

/**
 * Delete a car
 * @param {string} id
 * @returns {Promise<void>}
 */
export async function deleteCar(id) {
  try {
    const docRef = doc(db, 'cars', id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting car:', error);
    throw error;
  }
}

/**
 * Get top rated available cars
 * @param {number} count
 * @returns {Promise<Array>}
 */
export async function getFeaturedCars(count = 6) {
  try {
    const q = query(
      carsCollection,
      where('available', '==', true),
      orderBy('rating', 'desc'),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching featured cars:', error);
    throw error;
  }
}

/**
 * Search cars by brand or model (prefix search)
 * @param {string} searchTerm
 * @returns {Promise<Array>}
 */
export async function searchCars(searchTerm) {
  try {
    if (!searchTerm) return [];
    
    const term = searchTerm.toLowerCase();
    
    // We can do a prefix search on brand or model.
    // For simplicity, let's search by brand prefix or model prefix.
    const brandQuery = query(
      carsCollection,
      where('brandLower', '>=', term),
      where('brandLower', '<=', term + '\uf8ff')
    );
    
    const modelQuery = query(
      carsCollection,
      where('modelLower', '>=', term),
      where('modelLower', '<=', term + '\uf8ff')
    );
    
    const [brandSnap, modelSnap] = await Promise.all([
      getDocs(brandQuery),
      getDocs(modelQuery)
    ]);
    
    const resultsMap = new Map();
    
    brandSnap.docs.forEach(doc => resultsMap.set(doc.id, { id: doc.id, ...doc.data() }));
    modelSnap.docs.forEach(doc => {
      if (!resultsMap.has(doc.id)) {
        resultsMap.set(doc.id, { id: doc.id, ...doc.data() });
      }
    });
    
    return Array.from(resultsMap.values());
  } catch (error) {
    console.error('Error searching cars:', error);
    throw error;
  }
}
