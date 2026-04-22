import { query } from "@/lib/db";
import { PostForm } from "@/components/PostForm";
import { LikeButton } from "@/components/LikeButton";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ThreadPage({ params }: PageProps) {
    const resolvedParams = await params;
    const threadId = parseInt(resolvedParams.id);

    if (isNaN(threadId)) {
        notFound();
    }

    const user = await getCurrentUser();

    // Fetch thread
    const threadResult = await query(
        `SELECT t.*, u.username
        FROM threads t
        JOIN users u ON t.author_id = u.user_id
        WHERE t.thread_id = $1`,
        [threadId]
    );

    if (threadResult.rows.length === 0) {
        notFound();
    }

    const thread = threadResult.rows[0];

    // Fetch posts
    const postsResult = await query(
        `SELECT
        p.*,
        u.username,
        COUNT(CASE WHEN l.like_dislike = 1 THEN 1 END) as like_count,
                                    COUNT(CASE WHEN l.like_dislike = -1 THEN 1 END) as dislike_count,
                                    MAX(CASE WHEN l.user_id = $2 THEN l.like_dislike END) as user_like
                                    FROM posts p
                                    JOIN users u ON p.author_id = u.user_id
                                    LEFT JOIN likes l ON p.post_id = l.post_id
                                    WHERE p.thread_id = $1
                                    GROUP BY p.post_id, u.username
                                    ORDER BY p.date ASC`,
                                    [threadId, user?.user_id || null]
    );

    const posts = postsResult.rows;

    return (
        <div>
        <div className="thread-header">
        <h1>{thread.title}</h1>
        <div className="thread-meta">
        Started by {thread.username} on {new Date(thread.date).toLocaleDateString()}
        </div>
        </div>

        <div className="posts-list">
        {posts.map((post: any) => (
            <div key={post.post_id} className="post-item">
            <div className="post-header">
            <div className="post-author">{post.username}</div>
            <div className="post-date">
            {new Date(post.date).toLocaleString()}
            </div>
            </div>

            <div className="post-body">
            {post.body.split('\n').map((line: string, i: number) => (
                <p key={i}>{line}</p>
            ))}
            </div>

            <div className="post-footer">
            <LikeButton
            postId={post.post_id}
            initialLikes={parseInt(post.like_count || "0")}
            initialDislikes={parseInt(post.dislike_count || "0")}
            initialUserLike={post.user_like}
            />
            </div>
            </div>
        ))}
        </div>

        <div className="reply-section">
        <h2>Post a Reply</h2>
        <PostForm threadId={threadId} />
        </div>
        </div>
    );
}
