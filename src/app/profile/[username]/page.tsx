import { query } from "@/lib/db";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { UserProfile } from "@/components/UserProfile";
import styles from "./page.module.scss";

interface PageProps {
    params: Promise<{
        username: string;
    }>;
}

export default async function UserProfilePage({ params }: PageProps) {
    const resolvedParams = await params;
    const { username } = resolvedParams;

    // Fetch user data by username
    const userResult = await query(
        `SELECT
        user_id,
        username,
        name,
        avatar,
        bio,
        signature,
        registered,
        last_login,
        is_admin
        FROM users
        WHERE username = $1`,
        [username],
    );

    if (userResult.rows.length === 0) {
        notFound();
    }

    const profileUser = userResult.rows[0];
    const currentUser = await getCurrentUser();

    // Fetch user's recent threads
    const threadsResult = await query(
        `SELECT
        t.thread_id,
        t.title,
        t.date,
        COUNT(p.post_id) as post_count
        FROM threads t
        LEFT JOIN posts p ON t.thread_id = p.thread_id
        WHERE t.author_id = $1
        GROUP BY t.thread_id
        ORDER BY t.date DESC
        LIMIT 5`,
        [profileUser.user_id],
    );

    // Fetch user's recent posts
    const postsResult = await query(
        `SELECT
        p.post_id,
        p.body,
        p.date,
        t.thread_id,
        t.title as thread_title
        FROM posts p
        JOIN threads t ON p.thread_id = t.thread_id
        WHERE p.author_id = $1
        ORDER BY p.date DESC
        LIMIT 10`,
        [profileUser.user_id],
    );

    const recentThreads = threadsResult.rows;
    const recentPosts = postsResult.rows;

    return (
        <div className={styles.container}>
            <UserProfile
                user={profileUser}
                recentThreads={recentThreads}
                recentPosts={recentPosts}
                isOwnProfile={currentUser?.user_id === profileUser.user_id}
            />
        </div>
    );
}
