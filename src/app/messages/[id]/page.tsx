import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.scss";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

interface MessageDetails {
    message_id: number;
    author_id: number;
    author_username: string;
    author_avatar: string | null;
    recipient_id: number;
    recipient_username: string;
    recipient_avatar: string | null;
    body: string;
    date: Date;
}

export default async function MessageDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    const messageId = parseInt(resolvedParams.id);

    if (isNaN(messageId)) {
        notFound();
    }

    const user = await requireAuth();

    // Fetch the message details
    const messageResult = await query(
        `SELECT
        m.message_id,
        m.author_id,
        m.recipient_id,
        m.body,
        m.date,
        a.username as author_username,
        a.avatar as author_avatar,
        r.username as recipient_username,
        r.avatar as recipient_avatar
        FROM messages m
        JOIN users a ON m.author_id = a.user_id
        JOIN users r ON m.recipient_id = r.user_id
        WHERE m.message_id = $1`,
        [messageId],
    );

    if (messageResult.rows.length === 0) {
        notFound();
    }

    const message = messageResult.rows[0] as MessageDetails;

    // Check if user is authorized to view this message
    if (
        message.author_id !== user.user_id &&
        message.recipient_id !== user.user_id
    ) {
        notFound();
    }

    const isReceived = message.recipient_id === user.user_id;

    // Mark message as read if it's received and unread
    if (isReceived) {
        await query(
            `UPDATE messages SET is_read = true WHERE message_id = $1 AND is_read = false`,
            [messageId],
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/messages" className={styles.backButton}>
                    ← Back to Messages
                </Link>
                <Link
                    href={`/messages/new?to=${isReceived ? message.author_id : message.recipient_id}`}
                    className={styles.replyButton}
                >
                    Reply
                </Link>
            </div>

            <div className={styles.messageCard}>
                <div className={styles.messageHeader}>
                    <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                            {(
                                isReceived
                                    ? message.author_avatar
                                    : message.recipient_avatar
                            ) ? (
                                <img
                                    src={
                                        isReceived
                                            ? message.author_avatar!
                                            : message.recipient_avatar!
                                    }
                                    alt={
                                        isReceived
                                            ? message.author_username
                                            : message.recipient_username
                                    }
                                    className={styles.avatarImage}
                                />
                            ) : (
                                <div className={styles.avatarPlaceholder}>
                                    {(isReceived
                                        ? message.author_username
                                        : message.recipient_username
                                    )
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div className={styles.userDetails}>
                            <Link
                                href={`/user/${isReceived ? message.author_id : message.recipient_id}`}
                                className={styles.username}
                            >
                                {isReceived
                                    ? message.author_username
                                    : message.recipient_username}
                            </Link>
                            <div className={styles.date}>
                                {new Date(message.date).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.messageBody}>
                    {message.body.split("\n").map((line: string, i: number) => (
                        <p key={i}>{line}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}
