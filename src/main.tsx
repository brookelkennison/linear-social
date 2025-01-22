// src/index.tsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { PostsProvider } from './context/PostsContext.tsx';

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<PostsProvider>
			<AuthProvider>
				<App />
			</AuthProvider>
		</PostsProvider>
	</React.StrictMode>
);
