import { Timestamp, DocumentReference } from "firebase/firestore";

export interface Post {
    id: string;
    title: string;
    content: string;
    author: DocumentReference;
    createdAt?: Timestamp;
}

// Author type
export interface Author {
    id: string;
    name: string;
    email: string;
    createdAt: Timestamp;
}

// What the database stores or what the app expects when everything is fully loaded
export interface UserData {
	id: string;
	name: string;
	email: string;
	createdAt: Timestamp;
	uid: string;
	avatar?: string;
}

// What you send when *creating* a user
export interface NewUserData {
	name: string;
	email: string;
	createdAt: Timestamp;
	uid: string;
	avatar?: string;
}

export interface PostWithAuthor {
    title: string;
    content: string;
    author: Author;
    createdAt?: Timestamp;
}

export interface FetchedPosts {
    posts: Post[];
}