import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createPost, getPosts } from '../services/api/postsApi';
import Posts from '../components/Posts';
import { Post, PostWithAuthor } from '../types';

const Home: React.FC = () => {
	// Destructure `useAuth` with proper typing
	const { user, loading, userData, userEntryId, userRef } = useAuth() as {
		user: string | null;
		loading: boolean;
		userData: { id: string; name: string; email: string } | null;
		userEntryId: string | null;
		userRef: any; // Replace with the specific Firestore reference type if available
	};

	const navigate = useNavigate();

	// State definitions with types
	const [data, setData] = useState<PostWithAuthor[]>([]);
	const [filteredData, setFilteredData] = useState<PostWithAuthor[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedFilter, setSelectedFilter] = useState<string>('3');
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [newPost, setNewPost] = useState<{ title: string; content: string }>({ title: '', content: '' });

	// Fetch posts and handle filtering
	useEffect(() => {
		const fetchData = async () => {
			try {
				const posts = await getPosts();
				setData(posts as PostWithAuthor[]);
				filterPosts('3');
			} catch (err) {
				setError(err instanceof Error ? err.message : 'An error occurred');
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	// Filter posts based on selected filter
	const filterPosts = (filter: string) => {
		let filtered: PostWithAuthor[] = [];
		const now = new Date();
		const todayStart = new Date(now);
		todayStart.setHours(0, 0, 0, 0);
		const yesterdayStart = new Date(todayStart);
		yesterdayStart.setDate(yesterdayStart.getDate() - 1);
		const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
		const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

		switch (filter) {
			case '0':
				filtered = data.filter((post) => {
					const postDate = post.createdAt?.toDate();
					return postDate && postDate >= thirtyDaysAgo && postDate < sevenDaysAgo;
				});
				break;

			case '1':
				filtered = data.filter((post) => {
					const postDate = post.createdAt?.toDate();
					return postDate && postDate >= sevenDaysAgo && postDate < yesterdayStart;
				});
				break;

			case '2':
				filtered = data.filter((post) => {
					const postDate = post.createdAt?.toDate();
					return postDate && postDate >= yesterdayStart && postDate < todayStart;
				});
				break;

			case '3':
				filtered = data.filter((post) => {
					const postDate = post.createdAt?.toDate();
					return postDate && postDate >= todayStart;
				});
				break;

			default:
				filtered = data;
		}

		setSelectedFilter(filter);
		setFilteredData(filtered);
	};

	// Handle modal toggle
	const handleModalToggle = () => {
		setIsModalOpen(!isModalOpen);
	};

	// Redirect to login if user is not authenticated
	useEffect(() => {
		if (!loading && !user) {
			navigate('/login');
		}
	}, [user, loading, navigate]);

	// Handle form submission
	const handleFormSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!user || !userRef || newPost.title === '' || newPost.content === '') {
			alert('Please fill in all fields');
			return;
		}
		createPost(newPost.title, newPost.content, userRef);
		setNewPost({ title: '', content: '' });
		setIsModalOpen(false);
	};

	if (isLoading) return <p>Loading...</p>;
	if (error) return <p>Error: {error}</p>;

	const filterLabels: Record<string, string> = {
		'0': '30 days and older',
		'1': '7 days and older',
		'2': 'Yesterday',
		'3': 'Today',
	};

	return (
		<div className='container mx-auto'>
			<div className='mb-4'>
				<button onClick={handleModalToggle} className='justify-self-end bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded shadow flex items-center gap-2'>
					<i className='fas fa-plus'></i> Create
				</button>
			</div>
			<header className='relative mb-20'>
				<div className='relative mb-6 w-full mx-auto'>
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
			{isModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<div className='relative p-4 w-full max-w-md max-h-full'>
						{/* Modal content */}
						<div className='relative bg-white rounded-lg shadow dark:bg-gray-700'>
							{/* Modal header */}
							<div className='flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600'>
								<h3 className='text-lg font-semibold text-gray-900 dark:text-white'>Create New Post</h3>
								<button type='button' className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white' onClick={handleModalToggle}>
									<svg className='w-3 h-3' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 14 14'>
										<path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6' />
									</svg>
									<span className='sr-only' onClick={handleModalToggle}>
										Close modal
									</span>
								</button>
							</div>
							{/* Modal body */}
							<form className='p-4 md:p-5' onSubmit={(e) => handleFormSubmit(e, newPost)}>
								<div className='grid gap-4 mb-4 grid-cols-2 text-left'>
									<div className='col-span-2'>
										<label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
											Title
										</label>
										<input type='text' name='name' id='name' onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500' placeholder='Type product name' required='' />
									</div>
									<div className='col-span-2'>
										<label htmlFor='description' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
											Post Content
										</label>
										<textarea id='description' onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} rows={4} className='block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder='Write post content here' defaultValue={''} />
									</div>
								</div>
								<button type='submit' className='text-white inline-flex bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
									<svg className='me-1 -ms-1 w-5 h-5' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'>
										<path fillRule='evenodd' d='M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z' clipRule='evenodd' />
									</svg>
									Publish
								</button>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Home;
