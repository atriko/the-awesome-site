import { query } from "@/lib/db";
import Link from "next/link";
import styles from "./page.module.scss";

interface Thread {
    thread_id: number;
    title: string;
    date: Date;
    username: string;
    post_count: string;
}

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

    const threads = threadsResult.rows as Thread[];

    return (
        <div>
            <div className={styles.forumHeader}>
                <h1>Forum Threads</h1>
                <Link
                    href="/forum/new-thread"
                    className={styles.newThreadButton}
                >
                    + Create New Thread
                </Link>
            </div>

            <div className={styles.threadList}>
                {threads.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>
                            ✨ No threads yet. Be the first to start a
                            discussion!
                        </p>
                        <Link
                            href="/forum/new-thread"
                            className={styles.newThreadButton}
                        >
                            Create First Thread
                        </Link>
                    </div>
                ) : (
                    threads.map((thread) => (
                        <div
                            key={thread.thread_id}
                            className={styles.threadCard}
                        >
                            <div className={styles.threadTitle}>
                                <Link
                                    href={`/forum/thread/${thread.thread_id}`}
                                >
                                    {thread.title}
                                </Link>
                            </div>
                            <div className={styles.threadMeta}>
                                <span>👤 by {thread.username}</span>
                                <span>
                                    📅{" "}
                                    {new Date(thread.date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className={styles.threadStats}>
                                <span>
                                    💬 {parseInt(thread.post_count)} replies
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
