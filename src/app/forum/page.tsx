import { query } from "@/lib/db";
import Link from "next/link";

export default async function ForumPage() {
    // Fetch all threads with author username and post count
    const threadsResult = await query(`
        SELECT
        t.thread_id,
        t.title,
        t.date,
        u.username,
        COUNT(p.post_id) as post_count
        FROM threads t
        JOIN users u ON t.author_id = u.user_id
        LEFT JOIN posts p ON t.thread_id = p.thread_id
        GROUP BY t.thread_id, u.username
        ORDER BY t.date DESC
    `);

    const threads = threadsResult.rows;

    return (
        <div>
            <div className="forum-header">
                <h1>Forum Threads</h1>
                <Link href="/forum/new-thread" className="new-thread-button">
                    Create New Thread
                </Link>
            </div>

            <div className="thread-list">
                {threads.length === 0 ? (
                    <p>No threads yet. Be the first to create one!</p>
                ) : (
                    threads.map((thread: any) => (
                        <div key={thread.thread_id} className="thread-item">
                            <div className="thread-info">
                                <Link
                                    href={`/forum/thread/${thread.thread_id}`}
                                >
                                    <h2>{thread.title}</h2>
                                </Link>
                                <div className="thread-meta">
                                    Started by {thread.username} on{" "}
                                    {new Date(thread.date).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="thread-stats">
                                {thread.post_count} replies
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
