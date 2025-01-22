import { getDocs, collection, query, orderBy, addDoc, doc, Timestamp, getDoc, where, limit } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure your Firebase config is imported correctly
import { getReference } from '../../utils/helper';
import { UserData } from '../../types';
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
        if (userDoc) {
            return userDoc.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error retrieving user:', error);
        throw error;
    }
}

export async function getUserEntryIdByUid(uid: string) {
    const q = query(collection(db, "users"), where("uid", "==", uid), limit(1));
    const querySnapshot = await getDocs(q);
    const id = querySnapshot.docs[0].id;
    return id;
}

export async function getUserReference(uid: string) {
    const userRef = doc(db, "users", uid);
    return userRef;
}

export async function createUserEntry(user: UserData) {
    try {
        const docRef = await addDoc(collection(db, "users"), user);
    } catch (error) {
        console.error("Error adding document: ", error);
    }
}
