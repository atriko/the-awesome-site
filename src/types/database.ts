export interface User {
    user_id: number;
    username: string;
    password: string;
    salt: string;
    salt_location: number;
    is_admin: boolean;
    auth_key: string | null;
    email: string | null;
    phone: string | null;
    name: string | null;
    avatar: string | null;
    bio: string | null;
    signature: string | null;
    registered: Date;
    last_login: Date | null;
}

export interface Post {
    post_id: number;
    thread_id: number;
    author_id: number;
    body: string;
    date: Date;
}

export interface PostWithAuthor extends Post {
    username: string;
    like_count: number;
    dislike_count: number;
    user_like?: number; // Current user's like/dislike value
}

export interface ThreadWithAuthor {
    thread_id: number;
    author_id: number;
    title: string;
    date: Date;
    username: string;
}

export interface PostWithDetails {
    post_id: number;
    thread_id: number;
    author_id: number;
    body: string;
    date: Date;
    username: string;
    like_count: string; // COUNT returns string from pg
    dislike_count: string;
    user_like: number | null;
}
