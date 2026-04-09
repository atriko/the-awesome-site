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
    user_like?: number;  // Current user's like/dislike value
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
    like_count: string;   // COUNT returns string from pg
    dislike_count: string;
    user_like: number | null;
}
