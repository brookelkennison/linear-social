import { useState, useEffect } from 'react';
import { Timestamp } from 'firebase/firestore';
import { getPosts } from '../services/api/postsApi';
import Posts from '../components/Posts';

interface DataItem {
	id: string;
	title: string;
	content: string;
	author: Author;
	createdAt: Timestamp;
}
interface Author {
	name: string;
	email: string;
}

export default function Home() {
	const [data, setData] = useState<DataItem[]>([]);
	const [filteredData, setFilteredData] = useState<DataItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedFilter, setSelectedFilter] = useState<string>('3'); // To track the selected filter

	useEffect(() => {
		const fetchData = async () => {
			try {
				const posts = await getPosts();
				setData(posts as DataItem[]);
				setFilteredData(posts as DataItem[]); // Default display all posts
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	const filterPosts = (filter: string) => {
		let filtered: DataItem[] = [];
		const now = new Date();
		const todayStart = new Date(now);
		todayStart.setHours(0, 0, 0, 0);
		const yesterdayStart = new Date(todayStart);
		yesterdayStart.setDate(yesterdayStart.getDate() - 1);
		const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		switch (filter) {
			case '0': // Past 30 days (excluding past 7 days)
				filtered = data.filter((post) => {
					const postDate = post.createdAt.toDate();
					return postDate >= thirtyDaysAgo && postDate < sevenDaysAgo;
				});
				break;

			case '1': // Past 7 days (excluding yesterday and today)
				filtered = data.filter((post) => {
					const postDate = post.createdAt.toDate();
					return postDate >= sevenDaysAgo && postDate < yesterdayStart;
				});
				break;

			case '2': // Yesterday only
				filtered = data.filter((post) => {
					const postDate = post.createdAt.toDate();
					return postDate >= yesterdayStart && postDate < todayStart;
				});
				break;

			case '3': // Today only
				filtered = data.filter((post) => {
					const postDate = post.createdAt.toDate();
					return postDate >= todayStart;
				});
				break;

			default:
				filtered = data;
		}

		setSelectedFilter(filter); // Save the selected filter
		setFilteredData(filtered); // Update the filtered data
	};

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	const filterLabels: { [key: string]: string } = {
		'0': '30 days and older',
		'1': '7 days and older',
		'2': 'Yesterday',
		'3': 'Today',
	};

	return (
		<>
			<header className='mb-20'>
				<div className='relative mb-6 w-full md:w-4/5 mx-auto'>
					<input id='steps-range' type='range' min={0} max={3} defaultValue='4' step='1' className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700' onChange={(e) => filterPosts(e.target.value)} />
					<span className='text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6'>30 days and older</span>
					<span className='text-sm text-gray-500 dark:text-gray-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6'>7 days and older</span>
					<span className='text-sm text-gray-500 dark:text-gray-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6'>Yesterday</span>
					<span className='text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6'>Today</span>
				</div>
			</header>
			<div className='max-w-2xl mx-auto'>
				{filteredData.length > 0 ? (
					<>
						<p className='text-center text-gray-600 mb-7'>
							There are <span className='font-semibold'>{filteredData.length}</span> posts from <span className='font-semibold'>{filterLabels[selectedFilter]}</span>!
						</p>
						<Posts posts={filteredData} />
					</>
				) : (
					<p className='text-center text-gray-600 mb-7'>
						There are no posts to display for <span className='font-semibold'>{filterLabels[selectedFilter]}</span>.
					</p>
				)}
			</div>
		</>
	);
}
