import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getPosts } from '../services/api/postsApi';
import Posts from '../components/Posts';

interface DataItem {
	id: string;
	title: string;
	content: string;
	author: Author;
	createdAt: Date;
}

interface PostProps {
	title: string;
	content: string;
	author: Author;
	createdAt: Date;
}

interface Author {
	name: string;
	email: string;
}

const formatDate = (timestamp: Date): string => {
	const date = new Date(timestamp);
	const options: Intl.DateTimeFormatOptions = {
		month: 'long',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	};
	return date.toLocaleString('en-US', options);
};

const Post = ({ title, content, author, createdAt }: PostProps) => {
	return (
		<div className='bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200'>
			<div className='text-sm text-gray-500'>{formatDate(createdAt)}</div>
			<h2 className='text-lg font-semibold text-gray-800'>{title}</h2>
			<p className='text-sm text-gray-600'>By {author.name}</p>
			<p className='mt-2 text-gray-700'>{content}</p>
		</div>
	);
};

export default function Home() {
	const [data, setData] = useState<DataItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const posts = await getPosts();
				setData(posts as DataItem[]);
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	return (
		<>
			<header className='mb-40'>
				<div className='relative mb-6 w-full md:w-4/5 mx-auto'>
					<input id='steps-range' type='range' min={0} max={3} defaultValue='4' step='1' className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700' />
					<span className='text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6'>1 month ago</span>
					<span className='text-sm text-gray-500 dark:text-gray-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6'>1 week ago</span>
					<span className='text-sm text-gray-500 dark:text-gray-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6'>Yesterday</span>
					<span className='text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6'>Today</span>
				</div>
			</header>
			<div className='max-w-2xl mx-auto mt-8'>
				<Posts posts={data} />
			</div>
		</>
	);
}
