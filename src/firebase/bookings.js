import { db } from './config.js';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';

const bookingsCollection = collection(db, 'bookings');

/**
 * Get all bookings for a user
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getUserBookings(userId) {
  try {
    const q = query(
      bookingsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    throw error;
  }
}

/**
 * Get all bookings (admin)
 * @returns {Promise<Array>}
 */
export async function getAllBookings() {
  try {
    const q = query(bookingsCollection, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    throw error;
  }
}

/**
 * Get a booking by ID
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getBookingById(id) {
  try {
    const docRef = doc(db, 'bookings', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return { id: snapshot.id, ...snapshot.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching booking:', error);
    throw error;
  }
}

/**
 * Get count of bookings grouped by status
 * @returns {Promise<Object>}
 */
export async function getBookingStats() {
  try {
    const snapshot = await getDocs(bookingsCollection);
    const stats = {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      total: 0
    };
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.status && stats[data.status] !== undefined) {
        stats[data.status]++;
      }
      stats.total++;
    });
    
    return stats;
  } catch (error) {
    console.error('Error fetching booking stats:', error);
    throw error;
  }
}
