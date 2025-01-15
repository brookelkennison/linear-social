import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api/authenticationApi';

const NavBar: React.FC = () => {
	const { user, loading, userData } = useAuth();

	const navigate = useNavigate();
	const handleLoginClick = () => {
		navigate('/login');
	};

	const handleLogout = async () => {
		await logout();
		navigate('/login');
	};

	return (
		<header className='bg-blue-600 text-white shadow-md'>
			<div className='container mx-auto px-4 py-3 flex items-center justify-between'>
				{/* Logo Section */}
				<div className='flex items-center space-x-2'>
					<i className='fas fa-comments text-xl'></i>
					<span className='text-2xl font-bold'>Linear Social</span>
				</div>

				{/* Action Buttons */}
				<div className='space-x-4'>
					{user && userData ? (
						<>
							<p>Welcome, {userData?.name}</p>
							<button className='bg-red-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-red-600' onClick={handleLogout}>
								Log Out
							</button>
						</>
					) : (
						<>
							<p>Sign up</p>
							<button className='bg-white text-blue-600 px-4 py-2 rounded-md shadow-md hover:bg-gray-100' onClick={handleLoginClick}>
								Log In
							</button>
						</>
					)}
				</div>
			</div>
		</header>
	);
};

export default NavBar;
