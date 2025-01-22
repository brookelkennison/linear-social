import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api/authenticationApi';
import { UserData } from '../types'; // Importing UserData type

// Ensure the context provides the appropriate types
interface AuthContextType {
	user: string | null; // Adjust based on what `user` represents (e.g., UID or null)
	loading: boolean;
	userData: UserData | null; // Ensure it matches the UserData type
}

const NavBar: React.FC = () => {
	// Destructure values from `useAuth` with proper typing
	const { user, loading, userData } = useAuth() as AuthContextType;

	const navigate = useNavigate();

	const handleLoginClick = () => {
		navigate('/login');
	};

	const handleSignUpClick = () => {
		navigate('/signup');
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
							<button className='bg-white text-blue-600 px-4 py-2 rounded-md shadow-md hover:bg-gray-100' onClick={handleSignUpClick}>
								Sign Up
							</button>
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
