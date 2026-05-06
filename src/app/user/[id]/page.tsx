import { query } from "@/lib/db";
import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.scss";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

interface UserProfile {
    user_id: number;
    username: string;
    name: string | null;
    email: string | null;
    avatar: string | null;
    bio: string | null;
    signature: string | null;
    registered: Date;
    last_login: Date | null;
    is_admin: boolean;
}

interface Thread {
    thread_id: number;
    title: string;
    date: Date;
    post_count: string;
}

interface Post {
    post_id: number;
    body: string;
    date: Date;
    thread_id: number;
    thread_title: string;
}

export default async function UserPage({ params }: PageProps) {
    const resolvedParams = await params;
    const userId = parseInt(resolvedParams.id);

    if (isNaN(userId)) {
        notFound();
    }

    // Fetch user data
    const userResult = await query(
        `SELECT
        user_id,
        username,
        name,
        email,
        avatar,
        bio,
        signature,
        registered,
        last_login,
        is_admin
        FROM users
        WHERE user_id = $1`,
        [userId],
    );

    if (userResult.rows.length === 0) {
        notFound();
    }

    const profileUser = userResult.rows[0] as UserProfile;
    const currentUser = await getCurrentUser();
    const isOwnProfile = currentUser?.user_id === profileUser.user_id;

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
        [userId],
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
        [userId],
    );

    const recentThreads = threadsResult.rows as Thread[];
    const recentPosts = postsResult.rows as Post[];

    const truncate = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    return (
        <div className={styles.container}>
            {/* Profile Header */}
            <div className={styles.header}>
                <div className={styles.avatarSection}>
                    {profileUser.avatar ? (
                        <Image
                            src={profileUser.avatar}
                            alt={profileUser.username}
                            width={120}
                            height={120}
                            className={styles.avatar}
                        />
                    ) : (
                        <div className={styles.avatarPlaceholder}>
                            {profileUser.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className={styles.userInfo}>
                    <div className={styles.nameRow}>
                        <h1 className={styles.username}>
                            {profileUser.username}
                        </h1>
                        {profileUser.is_admin && (
                            <span className={styles.adminBadge}>Admin</span>
                        )}
                        {isOwnProfile && (
                            <span className={styles.ownBadge}>You</span>
                        )}
                    </div>

                    {profileUser.name && (
                        <div className={styles.displayName}>
                            {profileUser.name}
                        </div>
                    )}

                    <div className={styles.meta}>
                        <span>
                            📅 Joined:{" "}
                            {new Date(
                                profileUser.registered,
                            ).toLocaleDateString()}
                        </span>
                        {profileUser.last_login && (
                            <span>
                                🕒 Last seen:{" "}
                                {new Date(
                                    profileUser.last_login,
                                ).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    {isOwnProfile && profileUser.email && (
                        <div className={styles.email}>
                            📧 {profileUser.email}
                        </div>
                    )}

                    {/* Send Message Button - Only show if not own profile and user is logged in */}
                    {!isOwnProfile && currentUser && (
                        <div className={styles.messageButtonContainer}>
                            <Link
                                href={`/messages/new?to=${profileUser.user_id}`}
                                className={styles.messageButton}
                            >
                                💬 Send Message
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Rest of your component remains the same */}
            {profileUser.bio && (
                <div className={styles.section}>
                    <h2>About</h2>
                    <div className={styles.bio}>
                        <p>{profileUser.bio}</p>
                    </div>
                </div>
            )}

            {profileUser.signature && (
                <div className={styles.section}>
                    <h2>Signature</h2>
                    <div className={styles.signature}>
                        <p>{profileUser.signature}</p>
                    </div>
                </div>
            )}

            <div className={styles.activityGrid}>
                <div className={styles.section}>
                    <h2>Recent Threads</h2>
                    {recentThreads.length === 0 ? (
                        <p className={styles.empty}>No threads created yet.</p>
                    ) : (
                        <ul className={styles.threadList}>
                            {recentThreads.map((thread) => (
                                <li key={thread.thread_id}>
                                    <Link
                                        href={`/forum/thread/${thread.thread_id}`}
                                    >
                                        {thread.title}
                                    </Link>
                                    <div className={styles.itemMeta}>
                                        <span>
                                            📅{" "}
                                            {new Date(
                                                thread.date,
                                            ).toLocaleDateString()}
                                        </span>
                                        <span>
                                            💬 {thread.post_count} replies
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className={styles.section}>
                    <h2>Recent Posts</h2>
                    {recentPosts.length === 0 ? (
                        <p className={styles.empty}>No posts made yet.</p>
                    ) : (
                        <ul className={styles.postList}>
                            {recentPosts.map((post) => (
                                <li key={post.post_id}>
                                    <div className={styles.postPreview}>
                                        {truncate(post.body, 120)}
                                    </div>
                                    <div className={styles.itemMeta}>
                                        <span>
                                            📅{" "}
                                            {new Date(
                                                post.date,
                                            ).toLocaleDateString()}
                                        </span>
                                        <span>
                                            in:{" "}
                                            <Link
                                                href={`/forum/thread/${post.thread_id}`}
                                            >
                                                {post.thread_title}
                                            </Link>
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
