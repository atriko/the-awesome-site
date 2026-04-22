import { createThread } from "@/actions/threads";
import { getCurrentUser, requireAuth } from "@/lib/auth";
import Link from "next/link";
import styles from "./page.module.scss";

export default async function NewThreadPage() {
    // Require authentication - redirects to login if not logged in
    const user = await requireAuth();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Create New Thread</h1>
                <p className={styles.subtitle}>
                    Start a new discussion. Share something awesome!
                </p>
            </div>

            <form action={createThread} className={styles.form}>
                <div className={styles.formGroup}>
                    <label htmlFor="title">Title *</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        maxLength={255}
                        placeholder="What's your thread about?"
                        className={styles.inputField}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="body">Content *</label>
                    <textarea
                        id="body"
                        name="body"
                        required
                        rows={8}
                        placeholder="Write your post content here... (supports markdown? plain text for now)"
                        className={styles.textareaField}
                    />
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.submitButton}>
                        Create Thread
                    </button>
                    <Link href="/forum" className={styles.cancelButton}>
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
