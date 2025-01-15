import { getDocs, collection, query, orderBy, addDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase'; // Ensure your Firebase config is imported correctly
import { getReference } from '../../utils/helper';

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

// Create a new post
export const createPost = async (title: string, content: string, userId: string) => {
  try {
    // Create a reference to the user document
    const userRef = doc(db, 'users', userId);

    // Prepare the post object
    const post = {
      title,
      content,
      author: userRef, // Reference to the author document
      createdAt: Timestamp.now(), // Firestore-compatible timestamp
    };

    // Add the post to the 'posts' collection
    const postsRef = collection(db, 'posts');
    const newPost = await addDoc(postsRef, post);
    console.log('New post created with ID:', newPost.id);
    return newPost.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};
