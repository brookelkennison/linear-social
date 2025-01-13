import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api/authenticationApi';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const navigate = useNavigate();

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		const response = await login(email, password);
		if (response.success) {
			setError('');
			navigate('/');
		} else {
			setError(response.message);
		}
	};

	return (
		<div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
			<h1>Login</h1>
			<form className='max-w-sm mx-auto' onSubmit={handleLogin}>
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
					<input type='password' id='password' value={password} onChange={(e) => setPassword(e.target.value)} className='shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light' required />
				</div>
				{/* <div className='flex items-start mb-5'>
					<div className='flex items-center h-5'>
						<input id='terms' type='checkbox' defaultValue='' className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800' required='' />
					</div>
					<label htmlFor='terms' className='ms-2 text-sm font-medium text-gray-900 dark:text-gray-300'>
						Remember me
					</label>
				</div> */}
				<button type='submit' className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>
					Login
				</button>
			</form>
		</div>
	);
};

export default Login;
