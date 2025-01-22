import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createPost, getPosts } from '../services/api/postsApi';
import { PostWithAuthor } from '../types';

interface PostsContextProps {
	posts: PostWithAuthor[];
	filteredPosts: PostWithAuthor[];
	isLoading: boolean;
	error: string | null;
	selectedFilter: string;
	setFilter: (filter: string) => void;
	addPost: (title: string, content: string, userRef: any) => Promise<void>;
}

const PostsContext = createContext<PostsContextProps | undefined>(undefined);

export const usePosts = () => {
	const context = useContext(PostsContext);
	if (!context) {
		throw new Error('usePosts must be used within a PostsProvider');
	}
	return context;
};

export const PostsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [posts, setPosts] = useState<PostWithAuthor[]>([]);
	const [filteredPosts, setFilteredPosts] = useState<PostWithAuthor[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedFilter, setSelectedFilter] = useState<string>('3');

	useEffect(() => {
		const fetchData = async () => {
			try {
				const fetchedPosts = await getPosts();
				setPosts(fetchedPosts as PostWithAuthor[]);
				filterPosts('3', fetchedPosts as PostWithAuthor[]);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const filterPosts = (filter: string, data: PostWithAuthor[] = posts) => {
		const now = new Date();
		const todayStart = new Date(now.setHours(0, 0, 0, 0));
		const yesterdayStart = new Date(todayStart);
		yesterdayStart.setDate(yesterdayStart.getDate() - 1);
		const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		let filtered: PostWithAuthor[] = [];
		switch (filter) {
			case '0':
				filtered = data.filter((post) => post.createdAt?.toDate() >= thirtyDaysAgo && post.createdAt?.toDate() < sevenDaysAgo);
				break;
			case '1':
				filtered = data.filter((post) => post.createdAt?.toDate() >= sevenDaysAgo && post.createdAt?.toDate() < yesterdayStart);
				break;
			case '2':
				filtered = data.filter((post) => post.createdAt?.toDate() >= yesterdayStart && post.createdAt?.toDate() < todayStart);
				break;
			case '3':
				filtered = data.filter((post) => post.createdAt?.toDate() >= todayStart);
				break;
			default:
				filtered = data;
		}
		setFilteredPosts(filtered);
		setSelectedFilter(filter);
	};

	const setFilter = (filter: string) => {
		filterPosts(filter);
	};

	const addPost = async (title: string, content: string, userRef: any) => {
		try {
			await createPost(title, content, userRef);
			const fetchedPosts = await getPosts();
			setPosts(fetchedPosts as PostWithAuthor[]);
			filterPosts(selectedFilter, fetchedPosts as PostWithAuthor[]);
		} catch (err) {
			console.error('Error creating post:', err);
			throw err;
		}
	};

	return (
		<PostsContext.Provider
			value={{
				posts,
				filteredPosts,
				isLoading,
				error,
				selectedFilter,
				setFilter,
				addPost,
			}}>
			{children}
		</PostsContext.Provider>
	);
};
