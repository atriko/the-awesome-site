import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import Link from "next/link";
import styles from "./page.module.scss";

// Separate types for received and sent messages
interface ReceivedMessage {
    message_id: number;
    author_id: number;
    author_username: string;
    author_avatar: string | null;
    body: string;
    date: Date;
}

interface SentMessage {
    message_id: number;
    recipient_id: number;
    recipient_username: string;
    recipient_avatar: string | null;
    body: string;
    date: Date;
}

export default async function MessagesPage() {
    // Require authentication
    const user = await requireAuth();

    // Fetch received messages (inbox)
    const receivedResult = await query(
        `SELECT
        m.message_id,
        m.author_id,
        m.body,
        m.date,
        u.username as author_username,
        u.avatar as author_avatar
        FROM messages m
        JOIN users u ON m.author_id = u.user_id
        WHERE m.recipient_id = $1
        ORDER BY m.date DESC
        LIMIT 50`,
        [user.user_id],
    );

    // Fetch sent messages (outbox)
    const sentResult = await query(
        `SELECT
        m.message_id,
        m.recipient_id,
        m.body,
        m.date,
        u.username as recipient_username,
        u.avatar as recipient_avatar
        FROM messages m
        JOIN users u ON m.recipient_id = u.user_id
        WHERE m.author_id = $1
        ORDER BY m.date DESC
        LIMIT 50`,
        [user.user_id],
    );

    const receivedMessages = receivedResult.rows as ReceivedMessage[];
    const sentMessages = sentResult.rows as SentMessage[];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Private Messages</h1>
                <Link href="/messages/new" className={styles.newButton}>
                    + New Message
                </Link>
            </div>

            <div className={styles.messageGrid}>
                {/* Inbox Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Inbox</h2>

                    {receivedMessages.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No messages yet.</p>
                            <Link
                                href="/messages/new"
                                className={styles.emptyLink}
                            >
                                Send your first message
                            </Link>
                        </div>
                    ) : (
                        <ul className={styles.messageList}>
                            {receivedMessages.map((message) => (
                                <li
                                    key={message.message_id}
                                    className={styles.messageItem}
                                >
                                    <Link
                                        href={`/messages/${message.message_id}`}
                                        className={styles.messageLink}
                                    >
                                        <div className={styles.messageAvatar}>
                                            {message.author_avatar ? (
                                                <img
                                                    src={message.author_avatar}
                                                    alt={
                                                        message.author_username
                                                    }
                                                    className={styles.avatar}
                                                />
                                            ) : (
                                                <div
                                                    className={
                                                        styles.avatarPlaceholder
                                                    }
                                                >
                                                    {message.author_username
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.messageContent}>
                                            <div
                                                className={styles.messageHeader}
                                            >
                                                <span
                                                    className={
                                                        styles.senderName
                                                    }
                                                >
                                                    {message.author_username}
                                                </span>
                                                <span
                                                    className={
                                                        styles.messageDate
                                                    }
                                                >
                                                    {new Date(
                                                        message.date,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div
                                                className={
                                                    styles.messagePreview
                                                }
                                            >
                                                {message.body.length > 100
                                                    ? message.body.substring(
                                                          0,
                                                          100,
                                                      ) + "..."
                                                    : message.body}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Sent Section */}
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Sent</h2>

                    {sentMessages.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p>No sent messages.</p>
                        </div>
                    ) : (
                        <ul className={styles.messageList}>
                            {sentMessages.map((message) => (
                                <li
                                    key={message.message_id}
                                    className={styles.messageItem}
                                >
                                    <Link
                                        href={`/messages/${message.message_id}`}
                                        className={styles.messageLink}
                                    >
                                        <div className={styles.messageAvatar}>
                                            {message.recipient_avatar ? (
                                                <img
                                                    src={
                                                        message.recipient_avatar
                                                    }
                                                    alt={
                                                        message.recipient_username
                                                    }
                                                    className={styles.avatar}
                                                />
                                            ) : (
                                                <div
                                                    className={
                                                        styles.avatarPlaceholder
                                                    }
                                                >
                                                    {message.recipient_username
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.messageContent}>
                                            <div
                                                className={styles.messageHeader}
                                            >
                                                <span
                                                    className={
                                                        styles.senderName
                                                    }
                                                >
                                                    To:{" "}
                                                    {message.recipient_username}
                                                </span>
                                                <span
                                                    className={
                                                        styles.messageDate
                                                    }
                                                >
                                                    {new Date(
                                                        message.date,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div
                                                className={
                                                    styles.messagePreview
                                                }
                                            >
                                                {message.body.length > 100
                                                    ? message.body.substring(
                                                          0,
                                                          100,
                                                      ) + "..."
                                                    : message.body}
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
