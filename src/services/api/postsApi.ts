import { getDocs, collection, query, orderBy, addDoc, doc, Timestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure your Firebase config is imported correctly
import { getReference } from '../../utils/helper';
import { DocumentReference } from 'firebase/firestore';
import { getUserReference } from './userApi';

interface Post {
    title: string;
    content: string;
    author: DocumentReference;
    createdAt?: Timestamp;
}

interface UserData {
    id: string;
    name: string;
    email: string;
    createdAt: Timestamp;
}

export const getPosts = async () => {
  try {
    // Create a query to sort posts by a timestamp field (e.g., 'createdAt') in descending order
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(postsQuery);

    // Map over the query results to get post data and IDs
    const fetchedData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Fetch author data for each post and return the combined result
    const postsWithAuthor = await Promise.all(
      fetchedData.map(async (post) => {
        const authorObject = await getReference(post.author);
        return { ...post, author: authorObject };
      })
    );

    return postsWithAuthor;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};


export async function createPost(title: string, content: string, userRef: DocumentReference) {
    // need to get the user id from the userData
    try {
      // Reference to the users collection)
      // Add a new document with a generated id
    const newPostRef = doc(collection(db, "posts"));
    const newPost = {
        title: title,
        content: content,
        author: userRef,
        createdAt: Timestamp.now() // Automatically generated timestamp
    }
    await setDoc(newPostRef, newPost);
  
      console.log("Post created with ID: ", newPostRef.id);
    } catch (error) {
      console.error("Error creating post: ", error);
    }
  }

