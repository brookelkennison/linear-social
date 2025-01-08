import { db } from '../firebase';
import { collection, query, orderBy, getDocs, addDoc } from 'firebase/firestore';
import { getReference } from '../../utils/helper';

// Fetch all posts in reverse chronological order
export const getPosts = async () => {
	try {
		const querySnapshot = await getDocs(collection(db, 'posts'));
		const fetchedData = querySnapshot.docs.map((doc) => ({
			id: doc.id,
			...doc.data(),
		}));
		const postsWithAuthor = await Promise.all(
			fetchedData.map(async (post) => {
				const authorObject = await getReference(post.author);
				console.log('authorObject', authorObject);
				return { ...post, author: authorObject };
			})
		);
		console.log('postsWithAuthor', postsWithAuthor);
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
