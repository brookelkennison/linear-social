// import { get, set } from 'lodash'
import { DocumentReference, DocumentData, getDoc, doc } from 'firebase/firestore'
import { db } from '../services/firebase';

const getReference = async (documentReference: DocumentReference<DocumentData>) => {
    try {
        const userDocRef = doc(db, "users", documentReference['id']);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            return userDoc.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

export { getReference }