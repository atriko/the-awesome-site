import { query } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { sendMessage } from "@/actions/messages";
import Link from "next/link";
import styles from "./page.module.scss";

interface PageProps {
    searchParams: Promise<{
        to?: string;
    }>;
}

interface ConversationMessage {
    message_id: number;
    author_id: number;
    author_username: string;
    recipient_id: number;
    recipient_username: string;
    body: string;
    date: Date;
    is_own: boolean;
}

export default async function NewMessagePage({ searchParams }: PageProps) {
    const user = await requireAuth();
    const params = await searchParams;
    const recipientId = params.to ? parseInt(params.to) : undefined;

    let recipientUsername = "";
    let conversation: ConversationMessage[] = [];

    if (recipientId) {
        // Get recipient info
        const recipientResult = await query(
            `SELECT username FROM users WHERE user_id = $1`,
            [recipientId],
        );
        if (recipientResult.rows[0]) {
            recipientUsername = recipientResult.rows[0].username;
        }

        // Fetch conversation history between the two users
        const conversationResult = await query(
            `SELECT
            m.message_id,
            m.author_id,
            m.recipient_id,
            m.body,
            m.date,
            a.username as author_username,
            r.username as recipient_username
            FROM messages m
            JOIN users a ON m.author_id = a.user_id
            JOIN users r ON m.recipient_id = r.user_id
            WHERE (m.author_id = $1 AND m.recipient_id = $2)
            OR (m.author_id = $2 AND m.recipient_id = $1)
            ORDER BY m.date ASC
            LIMIT 50`,
            [user.user_id, recipientId],
        );

        conversation = conversationResult.rows.map((msg: any) => ({
            ...msg,
            is_own: msg.author_id === user.user_id,
        }));
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {recipientId
                        ? `Message ${recipientUsername}`
                        : "New Message"}
                </h1>
                <Link href="/messages" className={styles.cancelButton}>
                    Cancel
                </Link>
            </div>

            {/* Conversation History */}
            {recipientId && conversation.length > 0 && (
                <div className={styles.conversationSection}>
                    <h2 className={styles.conversationTitle}>
                        Previous Messages with {recipientUsername}
                    </h2>
                    <div className={styles.conversationList}>
                        {conversation.map((message) => (
                            <div
                                key={message.message_id}
                                className={`${styles.conversationMessage} ${
                                    message.is_own
                                        ? styles.ownMessage
                                        : styles.otherMessage
                                }`}
                            >
                                <div className={styles.messageHeader}>
                                    <Link
                                        href={`/user/${message.author_id}`}
                                        className={styles.messageAuthor}
                                    >
                                        {message.author_username}
                                    </Link>
                                    <span className={styles.messageDate}>
                                        {new Date(
                                            message.date,
                                        ).toLocaleString()}
                                    </span>
                                </div>
                                <div className={styles.messageBody}>
                                    {message.body}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New Message Form */}
            <div className={styles.formSection}>
                <h2 className={styles.formTitle}>
                    {recipientId
                        ? "Send a New Message"
                        : "Start a New Conversation"}
                </h2>

                <form action={sendMessage} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="recipient">To:</label>
                        {recipientId ? (
                            <>
                                <input
                                    type="hidden"
                                    name="recipientId"
                                    value={recipientId}
                                />
                                <input
                                    type="text"
                                    value={recipientUsername}
                                    disabled
                                    className={styles.fixedRecipient}
                                />
                            </>
                        ) : (
                            <input
                                type="text"
                                id="recipient"
                                name="recipientUsername"
                                required
                                placeholder="Enter username"
                                className={styles.input}
                            />
                        )}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="body">Message:</label>
                        <textarea
                            id="body"
                            name="body"
                            required
                            rows={6}
                            placeholder="Write your message here..."
                            className={styles.textarea}
                        />
                    </div>

                    <button type="submit" className={styles.submitButton}>
                        Send Message
                    </button>
                </form>
            </div>
        </div>
    );
}
