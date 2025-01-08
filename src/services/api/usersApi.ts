import { db } from '../firebase';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';

// Add interface for User
interface User {
	id: string;
	// add other user fields here
}

// Fetch all users
export const getUsers = async () => {
	try {
		const usersRef = collection(db, 'users');
		const querySnapshot = await getDocs(usersRef);

		return querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
	} catch (error) {
		console.error('Error fetching users:', error);
		throw error;
	}
};

// Fetch user by ID
export const getUserById = async (userId: string): Promise<User> => {
	try {
		const userRef = doc(db, 'users', userId);
		const userDoc = await getDoc(userRef);

		if (userDoc.exists()) {
			return { id: userDoc.id, ...userDoc.data() };
		} else {
			throw new Error('User not found');
		}
	} catch (error) {
		console.error('Error fetching user:', error);
		throw error;
	}
};
