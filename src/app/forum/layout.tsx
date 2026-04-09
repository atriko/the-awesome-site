import { query } from "@/lib/db";
import Link from "next/link";

export default async function ForumLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Fetch recent threads with author username
    const recentThreadsResult = await query(`
    SELECT t.thread_id, t.title, t.date, u.username
    FROM threads t
    JOIN users u ON t.author_id = u.user_id
    ORDER BY t.date DESC
    LIMIT 5
    `);

    const recentThreads = recentThreadsResult.rows;

    return (
        <div className="forum-layout">
            <div className="forum-content">{children}</div>

            <aside className="forum-sidebar">
                <div className="sidebar-section">
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

                <div className="sidebar-section">
                    <h3>Recent Threads</h3>
                    <ul>
                        {recentThreads.map((thread: any) => (
                            <li key={thread.thread_id}>
                                <Link
                                    href={`/forum/thread/${thread.thread_id}`}
                                >
                                    {thread.title}
                                </Link>
                                <span className="thread-author">
                                    by {thread.username}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </aside>
        </div>
    );
}
