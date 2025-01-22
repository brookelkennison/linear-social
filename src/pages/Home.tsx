import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePosts } from '../context/PostsContext';
import Posts from '../components/Posts';

const Home: React.FC = () => {
	const { user, loading, userRef } = useAuth() as {
		user: string | null;
		loading: boolean;
		userData: { id: string; name: string; email: string } | null;
		userEntryId: string | null;
		userRef: any;
	};

	const navigate = useNavigate();
	// need to trigger an update of filteredPosts when a post is added
	const { filteredPosts, isLoading, error, selectedFilter, setFilter, addPost } = usePosts();
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const [newPost, setNewPost] = useState<{ title: string; content: string }>({ title: '', content: '' });

	useEffect(() => {
		console.log('filteredPosts', filteredPosts);
	}, [filteredPosts]);

	useEffect(() => {
		if (!loading && !user) {
			navigate('/login');
		}
	}, [user, loading, navigate]);

	const handleModalToggle = () => {
		setIsModalOpen(!isModalOpen);
	};

	const handleFormSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!user || !userRef || newPost.title === '' || newPost.content === '') {
			alert('Please fill in all fields');
			return;
		}
		await addPost(newPost.title, newPost.content, userRef);
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
					<input id='steps-range' type='range' min={0} max={3} defaultValue='4' step='1' className='w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700' value={selectedFilter} onChange={(e) => setFilter(e.target.value)} />
					<span className='text-sm text-gray-500 dark:text-gray-400 absolute start-0 -bottom-6'>30 days and older</span>
					<span className='text-sm text-gray-500 dark:text-gray-400 absolute start-1/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6'>7 days and older</span>
					<span className='text-sm text-gray-500 dark:text-gray-400 absolute start-2/3 -translate-x-1/2 rtl:translate-x-1/2 -bottom-6'>Yesterday</span>
					<span className='text-sm text-gray-500 dark:text-gray-400 absolute end-0 -bottom-6'>Today</span>
				</div>
			</header>
			<div className='max-w-2xl mx-auto'>
				{/* need to trigger an update when a post is added */}

				{filteredPosts.length > 0 ? (
					<>
						<p className='text-center text-gray-600 mb-7'>
							There are <span className='font-semibold'>{filteredPosts.length}</span> posts from <span className='font-semibold'>{filterLabels[selectedFilter]}</span>!
						</p>
						<Posts posts={filteredPosts} />
					</>
				) : (
					<p className='text-center text-gray-600 mb-7'>
						There are no posts to display for <span className='font-semibold'>{filterLabels[selectedFilter]}</span>.
					</p>
				)}
			</div>
			{isModalOpen && (
				<div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
					<form className='p-4 w-full max-w-md bg-white rounded-lg shadow' onSubmit={handleFormSubmit}>
						<h3 className='text-lg font-semibold mb-4'>Create New Post</h3>
						<input type='text' placeholder='Title' value={newPost.title} onChange={(e) => setNewPost({ ...newPost, title: e.target.value })} className='block w-full p-2 mb-4 border rounded' />
						<textarea placeholder='Content' value={newPost.content} onChange={(e) => setNewPost({ ...newPost, content: e.target.value })} className='block w-full p-2 mb-4 border rounded' />
						<button type='submit' className='bg-blue-500 text-white px-4 py-2 rounded'>
							Publish
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default Home;
