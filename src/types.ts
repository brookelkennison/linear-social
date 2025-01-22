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

export interface UserData {
    id: string;
    name: string;
    email: string;
    createdAt: Timestamp;
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