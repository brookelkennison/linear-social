import { getDocs, collection, query, orderBy } from 'firebase/firestore';
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

    console.log('fetchedData', fetchedData);

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
export const createPost = async (content, userId) => {
	try {
		const postsRef = collection(db, 'posts');
		const newPost = await addDoc(postsRef, {
			content,
			author: userId,
			timestamp: new Date().toISOString(),
		});
		return newPost.id;
	} catch (error) {
		console.error('Error creating post:', error);
		throw error;
	}
};
