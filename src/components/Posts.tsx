import React from 'react';

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

const Posts = ({ posts }: { posts: DataItem[] }) => {
	return (
		<ol className='relative border-s border-gray-200 dark:border-gray-700'>
			{posts.map((post) => (
				<li key={post.id} className='mb-10 ms-6 text-start'>
					<span className='absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -start-3 ring-8 ring-white dark:ring-gray-900 dark:bg-blue-900'>
						<svg className='w-2.5 h-2.5 text-blue-800 dark:text-blue-300' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 20'></svg>
					</span>
					<div className='flex items-center gap-2 mb-1'>
						<h3 className='text-lg font-semibold text-gray-900 dark:text-white'>{post.author.name}</h3>
					</div>
					<p className='mb-4 text-base font-normal text-gray-500 dark:text-gray-400'>{post.content}</p>
					<time className='block mb-2 text-sm font-normal leading-none text-gray-400 dark:text-gray-500'>{formatDate(post.createdAt.toDate())}</time>
				</li>
			))}
		</ol>
	);
};

export default Posts;
