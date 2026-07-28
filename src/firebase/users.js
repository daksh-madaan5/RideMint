import { db } from './config.js';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  serverTimestamp,
  arrayUnion,
  arrayRemove
} from 'firebase/firestore';

const usersCollection = collection(db, 'users');

/**
 * Create a user profile document
 * @param {Object} data
 * @returns {Promise<void>}
 */
export async function createUserProfile({ uid, name, email, photo }) {
  try {
    const docRef = doc(db, 'users', uid);
    await setDoc(docRef, {
      uid,
      name,
      email,
      photo: photo || '',
      role: 'user',
      favorites: [],
      createdAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
}

/**
 * Get a user profile
 * @param {string} uid
 * @returns {Promise<Object|null>}
 */
export async function getUserProfile(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Update a user profile
 * @param {string} uid
 * @param {Object} data
 * @returns {Promise<void>}
 */
export async function updateUserProfile(uid, data) {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Get all users (admin)
 * @returns {Promise<Array>}
 */
export async function getAllUsers() {
  try {
    const snapshot = await getDocs(usersCollection);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching all users:', error);
    throw error;
  }
}

/**
 * Toggle a car in user's favorites
 * @param {string} uid
 * @param {string} carId
 * @returns {Promise<void>}
 */
export async function toggleFavorite(uid, carId) {
  try {
    const docRef = doc(db, 'users', uid);
    const snapshot = await getDoc(docRef);
    
    if (snapshot.exists()) {
      const data = snapshot.data();
      const favorites = data.favorites || [];
      
      if (favorites.includes(carId)) {
        await updateDoc(docRef, { favorites: arrayRemove(carId) });
      } else {
        await updateDoc(docRef, { favorites: arrayUnion(carId) });
      }
    }
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
}

/**
 * Get a user's favorite car IDs
 * @param {string} uid
 * @returns {Promise<Array>}
 */
export async function getUserFavorites(uid) {
  try {
    const docRef = doc(db, 'users', uid);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data().favorites || [];
    }
    return [];
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    throw error;
  }
}

/**
 * Set a user's role
 * @param {string} uid
 * @param {string} role
 * @returns {Promise<void>}
 */
export async function setUserRole(uid, role) {
  try {
    const docRef = doc(db, 'users', uid);
    await updateDoc(docRef, { role });
  } catch (error) {
    console.error('Error setting user role:', error);
    throw error;
  }
}
