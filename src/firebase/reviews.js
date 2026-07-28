import { db } from './config.js';
import {
  collection,
  doc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  writeBatch,
  increment,
  getDoc
} from 'firebase/firestore';

const reviewsCollection = collection(db, 'reviews');

/**
 * Add a review and update car's average rating using batch
 * @param {Object} data
 * @returns {Promise<void>}
 */
export async function addReview({ userId, carId, rating, comment, userSnapshot }) {
  try {
    const batch = writeBatch(db);
    
    // Create new review doc
    const newReviewRef = doc(reviewsCollection);
    batch.set(newReviewRef, {
      userId,
      carId,
      rating,
      comment,
      userSnapshot,
      createdAt: serverTimestamp()
    });
    
    // Update car document
    const carRef = doc(db, 'cars', carId);
    const carSnap = await getDoc(carRef);
    
    if (carSnap.exists()) {
      const carData = carSnap.data();
      const currentRating = carData.rating || 0;
      const currentCount = carData.reviewCount || 0;
      
      const newCount = currentCount + 1;
      const newRating = ((currentRating * currentCount) + rating) / newCount;
      
      batch.update(carRef, {
        rating: newRating,
        reviewCount: newCount
      });
    }
    
    await batch.commit();
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
}

/**
 * Get reviews for a specific car
 * @param {string} carId
 * @returns {Promise<Array>}
 */
export async function getCarReviews(carId) {
  try {
    const q = query(
      reviewsCollection,
      where('carId', '==', carId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching car reviews:', error);
    throw error;
  }
}

/**
 * Get reviews by a specific user
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getUserReviews(userId) {
  try {
    const q = query(
      reviewsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
}

/**
 * Update an existing review (Note: Does not update car average in this simple implementation)
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<void>}
 */
export async function updateReview(id, data) {
  try {
    const docRef = doc(db, 'reviews', id);
    await updateDoc(docRef, data);
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
}

/**
 * Delete a review and recalculate car average rating
 * @param {string} id 
 * @param {string} carId 
 * @param {number} oldRating 
 * @returns {Promise<void>}
 */
export async function deleteReview(id, carId, oldRating) {
  try {
    const batch = writeBatch(db);
    
    // Delete review doc
    const reviewRef = doc(db, 'reviews', id);
    batch.delete(reviewRef);
    
    // Update car document
    const carRef = doc(db, 'cars', carId);
    const carSnap = await getDoc(carRef);
    
    if (carSnap.exists()) {
      const carData = carSnap.data();
      const currentRating = carData.rating || 0;
      const currentCount = carData.reviewCount || 0;
      
      const newCount = Math.max(0, currentCount - 1);
      let newRating = 0;
      
      if (newCount > 0) {
        newRating = ((currentRating * currentCount) - oldRating) / newCount;
      }
      
      batch.update(carRef, {
        rating: newRating,
        reviewCount: newCount
      });
    }
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}
