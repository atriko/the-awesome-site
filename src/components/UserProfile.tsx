"use client";

import Link from "next/link";
import styles from "./UserProfile.module.scss";

interface UserProfileProps {
    user: {
        user_id: number;
        username: string;
        name: string | null;
        avatar: string | null;
        bio: string | null;
        signature: string | null;
        registered: Date;
        last_login: Date | null;
        is_admin: boolean;
    };
    recentThreads: Array<{
        thread_id: number;
        title: string;
        date: Date;
        post_count: string;
    }>;
    recentPosts: Array<{
        post_id: number;
        body: string;
        date: Date;
        thread_id: number;
        thread_title: string;
    }>;
    isOwnProfile: boolean;
}

export function UserProfile({
    user,
    recentThreads,
    recentPosts,
    isOwnProfile,
}: UserProfileProps) {
    // Truncate post preview to 150 characters
    const truncate = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    return (
        <div className={styles.profile}>
            {/* Profile Header Card */}
            <div className={styles.headerCard}>
                <div className={styles.avatar}>
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.username} />
                    ) : (
                        <div className={styles.avatarPlaceholder}>
                            {user.username.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>

                <div className={styles.userInfo}>
                    <div className={styles.nameRow}>
                        <h1 className={styles.username}>{user.username}</h1>
                        {user.is_admin && (
                            <span className={styles.adminBadge}>Admin</span>
                        )}
                        {isOwnProfile && (
                            <span className={styles.ownBadge}>You</span>
                        )}
                    </div>

                    {user.name && (
                        <div className={styles.displayName}>{user.name}</div>
                    )}

                    <div className={styles.meta}>
                        <span>
                            📅 Joined:{" "}
                            {new Date(user.registered).toLocaleDateString()}
                        </span>
                        {user.last_login && (
                            <span>
                                🕒 Last seen:{" "}
                                {new Date(user.last_login).toLocaleDateString()}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Bio Section */}
            {user.bio && (
                <div className={styles.section}>
                    <h2>About</h2>
                    <div className={styles.bio}>
                        <p>{user.bio}</p>
                    </div>
                </div>
            )}

            {/* Signature Section */}
            {user.signature && (
                <div className={styles.section}>
                    <h2>Signature</h2>
                    <div className={styles.signature}>
                        <p>{user.signature}</p>
                    </div>
                </div>
            )}

            {/* Two-Column Layout for Activity */}
            <div className={styles.activityGrid}>
                {/* Recent Threads */}
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

                {/* Recent Posts */}
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
