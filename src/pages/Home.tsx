import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { getPosts } from '../services/api/postsApi';
import Timeline from '../components/Timeline';

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
			<div className='max-w-2xl mx-auto mt-8'>
				{data.map((item) => (
					<Post key={item.id} title={item.title} content={item.content} author={item.author} createdAt={item.createdAt.toDate()} />
				))}
			</div>
			<Timeline />
		</>
	);
}
