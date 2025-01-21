import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../services/api/authenticationApi';
import { createUserEntry } from '../services/api/userApi';

// Add interface for the signup response
interface SignupResponse {
	success: boolean;
	message?: string;
	user: {
		uid: string;
	};
}

const SignUp = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleSignUp = async (e: React.FormEvent) => {
		e.preventDefault();

		// Password verification logic
		if (password.length < 8) {
			setError('Password must be at least 8 characters long.');
			return;
		}

		if (password !== confirmPassword) {
			setError('Passwords do not match.');
			return;
		}

		try {
			const response = (await signup(email, password)) as SignupResponse;
			if (response.success && response.user) {
				const { uid } = response.user;
				await createUserEntry({
					name,
					email,
					uid,
					avatar: '',
				});
				navigate('/');
			} else {
				setError(response.message || 'Signup failed');
			}
		} catch (err) {
			setError('An error occurred during sign up. Please try again.');
		}
	};

	return (
		<div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
			<h1 className='text-2xl font-bold mb-5'>Sign Up</h1>
			<form className='max-w-sm mx-auto' onSubmit={handleSignUp}>
				<div className='mb-5'>
					<label htmlFor='name' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
						Your name
					</label>
					<input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)} className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light' placeholder='Your full name' required />
				</div>
				<div className='mb-5'>
					<label htmlFor='email' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
						Your email
					</label>
					<input type='email' id='email' value={email} onChange={(e) => setEmail(e.target.value)} className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light' placeholder='name@flowbite.com' required />
				</div>
				<div className='mb-5'>
					<label htmlFor='password' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
						Your password
					</label>
					<input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light' placeholder='At least 8 characters' required />
				</div>
				<div className='mb-5'>
					<label htmlFor='confirmPassword' className='block mb-2 text-sm font-medium text-gray-900 dark:text-white'>
						Confirm password
					</label>
					<input type='password' id='confirmPassword' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light' placeholder='Re-enter your password' required />
				</div>
				{error && <p className='text-red-500 text-sm mb-5'>{error}</p>}
				<button type='submit' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
					Sign Up
				</button>
			</form>
		</div>
	);
};

export default SignUp;
