// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { DocumentReference } from 'firebase/firestore';
import { getUserByUid, getUserEntryIdByUid, getUserReference } from '../services/api/userApi';

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
	userEntryId: string | null;
	userRef: DocumentReference | null;
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
	const [userEntryId, setUserEntryId] = useState<string | null>(null);
	const [userRef, setUserRef] = useState<DocumentReference | null>(null);
	useEffect(() => {
		const auth = getAuth();

		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setUser(currentUser);
			if (currentUser) {
				const userData = await getUserByUid(currentUser.uid);
				setUserData(userData as UserData);
				const userEntryId = await getUserEntryIdByUid(currentUser.uid);
				setUserEntryId(userEntryId);
				const userRef = await getUserReference(userEntryId);
				setUserRef(userRef as DocumentReference);
			} else {
				setUserData(null);
			}

			setLoading(false);
		});

		return () => unsubscribe(); // Cleanup on unmount
	}, []);

	return <AuthContext.Provider value={{ user, userData, loading, userEntryId, userRef }}>{children}</AuthContext.Provider>;
};

// Custom hook for consuming AuthContext
export const useAuth = (): AuthContextType => {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
