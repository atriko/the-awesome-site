import { query } from "@/lib/db";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

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
        <div className="homepage">
        {/* Hero Section */}
        <section className="hero">
        <h1>Welcome to Awesome Forum</h1>
        <p>A place to discover and share awesome things</p>
        {!user && (
            <div className="cta-buttons">
            <Link href="/register" className="btn-primary">
            Get Started
            </Link>
            <Link href="/forum" className="btn-secondary">
            Browse Forum
            </Link>
            </div>
        )}
        </section>

        {/* Stats Section */}
        <section className="stats">
        <div className="stat-card">
        <h3>{stats.thread_count || 0}</h3>
        <p>Threads</p>
        </div>
        <div className="stat-card">
        <h3>{stats.post_count || 0}</h3>
        <p>Posts</p>
        </div>
        <div className="stat-card">
        <h3>{stats.user_count || 0}</h3>
        <p>Members</p>
        </div>
        </section>

        {/* Recent Threads Section */}
        <section className="recent-threads">
        <h2>Recent Discussions</h2>
        {recentThreadsList.length === 0 ? (
            <p>No threads yet. Be the first to start a discussion!</p>
        ) : (
            <ul className="thread-list">
            {recentThreadsList.map((thread: any) => (
                <li key={thread.thread_id}>
                <Link href={`/forum/thread/${thread.thread_id}`}>
                {thread.title}
                </Link>
                <span className="thread-meta">
                by {thread.username} • {new Date(thread.date).toLocaleDateString()}
                </span>
                </li>
            ))}
            </ul>
        )}
        <div className="view-all">
        <Link href="/forum">View all threads →</Link>
        </div>
        </section>
        </div>
    );
}
