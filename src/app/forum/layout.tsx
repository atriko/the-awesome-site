import { query } from "@/lib/db";
import Link from "next/link";
import styles from "./layout.module.scss";

export default async function ForumLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch recent threads for sidebar
    const recentThreadsResult = await query(`
    SELECT t.thread_id, t.title, t.date, u.username
    FROM threads t
    JOIN users u ON t.author_id = u.user_id
    ORDER BY t.date DESC
    LIMIT 5
    `);
    const recentThreads = recentThreadsResult.rows;

    // Fetch forum stats
    const statsResult = await query(`
    SELECT
    (SELECT COUNT(*) FROM threads) as thread_count,
                                    (SELECT COUNT(*) FROM posts) as post_count,
                                    (SELECT COUNT(*) FROM users) as user_count
                                    `);
    const stats = statsResult.rows[0];

    return (
        <div className={styles.forumLayout}>
            {/* Main content area */}
            <div className={styles.forumContent}>{children}</div>

            {/* Sidebar - persists across all forum pages */}
            <aside className={styles.forumSidebar}>
                <div className={styles.sidebarSection}>
                    <h3>Forum Navigation</h3>
                    <ul>
                        <li>
                            <Link href="/forum">All Threads</Link>
                        </li>
                        <li>
                            <Link href="/forum/new-thread">
                                Create New Thread
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className={styles.sidebarSection}>
                    <h3>Recent Threads</h3>
                    {recentThreads.length === 0 ? (
                        <p>No threads yet.</p>
                    ) : (
                        <ul>
                            {recentThreads.map((thread: any) => (
                                <li key={thread.thread_id}>
                                    <Link
                                        href={`/forum/thread/${thread.thread_id}`}
                                    >
                                        {thread.title.length > 40
                                            ? thread.title.substring(0, 40) +
                                              "..."
                                            : thread.title}
                                    </Link>
                                    <span className={styles.threadAuthor}>
                                        by {thread.username}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className={styles.sidebarSection}>
                    <h3>Community Stats</h3>
                    <div className={styles.stats}>
                        <p>
                            📝 Threads:{" "}
                            <span className={styles.statNumber}>
                                {stats?.thread_count || 0}
                            </span>
                        </p>
                        <p>
                            💬 Posts:{" "}
                            <span className={styles.statNumber}>
                                {stats?.post_count || 0}
                            </span>
                        </p>
                        <p>
                            👥 Members:{" "}
                            <span className={styles.statNumber}>
                                {stats?.user_count || 0}
                            </span>
                        </p>
                    </div>
                </div>
            </aside>
        </div>
    );
}
