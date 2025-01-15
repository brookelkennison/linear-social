// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { getFirestore, doc, getDoc, query, collection, orderBy, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getUserByUid } from '../services/api/userApi';

// Define the shape of the context
interface UserData {
	uid: string;
	email: string;
	displayName: string;
	[otherFields: string]: any; // Add other fields as needed
}

interface AuthContextType {
	user: User | null;
	userData: UserData | null;
	loading: boolean;
}

// Create a default value for the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define props for the AuthProvider
interface AuthProviderProps {
	children: ReactNode;
}

// AuthProvider Component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
	const [user, setUser] = useState<User | null>(null);
	const [userData, setUserData] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const auth = getAuth();
		const firestore = getFirestore();

		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setUser(currentUser);

			if (currentUser) {
				const userData = await getUserByUid(currentUser.uid);
				setUserData(userData);
				console.log('userData: ', userData);

				// console.log('userDoc', userDoc);
				// if (userDoc.exists()) {
				// 	setUserData(userDoc.data() as UserData);
				// } else {
				// 	console.warn('No user document found for UID:', currentUser.uid);
				// 	setUserData(null);
				// }
			} else {
				setUserData(null);
			}

			setLoading(false);
		});

		return () => unsubscribe(); // Cleanup on unmount
	}, []);

	return <AuthContext.Provider value={{ user, userData, loading }}>{children}</AuthContext.Provider>;
};

// Custom hook for consuming AuthContext
export const useAuth = (): AuthContextType => {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
