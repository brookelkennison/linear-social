import { getDocs, collection, query, orderBy, addDoc, doc, Timestamp, getDoc, where, limit } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure your Firebase config is imported correctly
import { getReference } from '../../utils/helper';
/**
 * Function to get user data by UID from the Firestore 'user' collection.
 * @param {string} uid - The user ID to look up.
 * @returns {Promise<object|null>} - The user data or null if not found.
 */

export async function getUserByUid(uid: string) {
    try {
        const q = query(collection(db, "users"), where("uid", "==", uid), limit(1));
        const querySnapshot = await getDocs(q);
        const userDoc = querySnapshot.docs[0];
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            console.log('No user found with the specified UID.');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
        throw error;
    }
}


// Example usage
getUserByUid('your-uid-here').then((userData) => {
    if (userData) {
        console.log('Retrieved user data:', userData);
    } else {
        console.log('User not found.');
    }
});
