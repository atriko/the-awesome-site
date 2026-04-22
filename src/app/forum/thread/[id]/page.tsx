import { query } from "@/lib/db";
import { PostForm } from "@/components/PostForm";
import { LikeButton } from "@/components/LikeButton";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import styles from "./page.module.scss";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

interface ThreadWithAuthor {
    thread_id: number;
    author_id: number;
    title: string;
    date: Date;
    username: string;
}

interface PostWithDetails {
    post_id: number;
    thread_id: number;
    author_id: number;
    body: string;
    date: Date;
    username: string;
    like_count: string;
    dislike_count: string;
    user_like: number | null;
}

export default async function ThreadPage({ params }: PageProps) {
    const resolvedParams = await params;
    const threadId = parseInt(resolvedParams.id);

    if (isNaN(threadId)) {
        notFound();
    }

    const user = await getCurrentUser();

    // Fetch thread with author
    const threadResult = await query(
        `SELECT t.*, u.username
        FROM threads t
        JOIN users u ON t.author_id = u.user_id
        WHERE t.thread_id = $1`,
        [threadId],
    );

    if (threadResult.rows.length === 0) {
        notFound();
    }

    const thread = threadResult.rows[0] as ThreadWithAuthor;

    // Fetch posts with author info and like counts
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
        [threadId, user?.user_id || null],
    );

    const posts = postsResult.rows as PostWithDetails[];

    return (
        <div>
            {/* Thread Header */}
            <div className={styles.threadHeader}>
                <h1 className={styles.threadTitle}>{thread.title}</h1>
                <div className={styles.threadMeta}>
                    <span>👤 Started by {thread.username}</span>
                    <span>📅 {new Date(thread.date).toLocaleDateString()}</span>
                    <span>💬 {posts.length} replies</span>
                </div>
            </div>

            {/* Posts List */}
            <div className={styles.postsList}>
                {posts.map((post) => (
                    <div key={post.post_id} className={styles.postItem}>
                        <div className={styles.postHeader}>
                            <div className={styles.postAuthor}>
                                {post.username}
                            </div>
                            <div className={styles.postDate}>
                                {new Date(post.date).toLocaleString()}
                            </div>
                        </div>

                        <div className={styles.postBody}>
                            {post.body
                                .split("\n")
                                .map((line: string, i: number) => (
                                    <p key={i}>{line}</p>
                                ))}
                        </div>

                        <div className={styles.postFooter}>
                            <LikeButton
                                postId={post.post_id}
                                initialLikes={parseInt(post.like_count || "0")}
                                initialDislikes={parseInt(
                                    post.dislike_count || "0",
                                )}
                                initialUserLike={post.user_like}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Reply Section */}
            <div className={styles.replySection}>
                <h2>Post a Reply</h2>
                <div className={styles.replyForm}>
                    <PostForm threadId={threadId} />
                </div>
            </div>
        </div>
    );
}
