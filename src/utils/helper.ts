// import { get, set } from 'lodash'
import { DocumentReference, DocumentData, getDoc, doc } from 'firebase/firestore'
import { db } from '../services/firebase';

const getReference = async (documentReference: DocumentReference<DocumentData>) => {
    try {
        const userDocRef = doc(db, "users", documentReference['id']);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            console.log("User data:", userDoc.data());
            return userDoc.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error("Error fetching user:", error);
    }
}

export { getReference }