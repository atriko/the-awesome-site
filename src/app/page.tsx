import { query } from "@/lib/db";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import styles from "./page.module.scss";
import Image from "next/image";

export default async function HomePage() {
    const user = await getCurrentUser();

    // Fetch recent threads for the homepage
    const recentThreads = await query(`
    SELECT t.thread_id, t.title, t.date, u.username
    FROM threads t
    JOIN users u ON t.author_id = u.user_id
    ORDER BY t.date DESC
    LIMIT 10
    `);

    // Fetch forum statistics
    const statsResult = await query(`
    SELECT
    (SELECT COUNT(*) FROM threads) as thread_count,
                                    (SELECT COUNT(*) FROM posts) as post_count,
                                    (SELECT COUNT(*) FROM users) as user_count
                                    `);

    const stats = statsResult.rows[0];
    const recentThreadsList = recentThreads.rows;

    return (
        <div className={styles.homepage}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <h1>Welcome to Awesome Forum</h1>
                <p>A place to discover and share awesome things</p>
                <Image
                    src="/explosion-cool.jpg"
                    alt="explosion in sunglasses"
                    width={400}
                    height={400}
                />
            </section>

            {/* Stats Section */}
            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <h3>{stats.thread_count || 0}</h3>
                    <p>Threads</p>
                </div>
                <div className={styles.statCard}>
                    <h3>{stats.post_count || 0}</h3>
                    <p>Posts</p>
                </div>
                <div className={styles.statCard}>
                    <h3>{stats.user_count || 0}</h3>
                    <p>Members</p>
                </div>
            </div>

            {/* Recent Threads Section */}
            <section className={styles.recentThreads}>
                <h2>Recent Discussions</h2>
                {recentThreadsList.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>
                            No threads yet. Be the first to start a discussion!
                        </p>
                        <Link
                            href="/forum/new-thread"
                            className={styles.btnPrimary}
                        >
                            Create First Thread
                        </Link>
                    </div>
                ) : (
                    <>
                        <ul className={styles.threadList}>
                            {recentThreadsList.map((thread: any) => (
                                <li
                                    key={thread.thread_id}
                                    className={styles.threadItem}
                                >
                                    <Link
                                        href={`/forum/thread/${thread.thread_id}`}
                                    >
                                        {thread.title}
                                    </Link>
                                    <span className={styles.threadMeta}>
                                        by {thread.username} •{" "}
                                        {new Date(
                                            thread.date,
                                        ).toLocaleDateString()}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <div className={styles.viewAll}>
                            <Link href="/forum">View all threads →</Link>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
