// Import Firebase modules
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';


export const signup = async (email: string, password: string) => {
  try {
    // need to add createdAt to user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password,);
    const user = userCredential.user;
    return {
      success: true,
      message: "User created successfully",
      user
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    };
  }
};

export const login = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    setAuthStateListener();
    return {
      success: true,
      message: "User logged in successfully",
      user
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message
    };
  }
};

export const logout = async () => {
    try {
      await signOut(auth);
      return {
        success: true,
        message: "User logged out successfully"
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message
      };
    }
  };

const setAuthStateListener = async () => {
onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/auth.user
      const uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
};
