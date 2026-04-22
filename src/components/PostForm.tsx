"use client";

import { useRef, useState, useTransition } from "react";
import { createPost } from "@/actions/posts";
import styles from "./PostForm.module.scss";

interface PostFormProps {
    threadId: number;
    onSuccess?: () => void;
    onCancel?: () => void;
    showCancel?: boolean;
    placeholder?: string;
}

export function PostForm({
    threadId,
    onSuccess,
    onCancel,
    showCancel = false,
    placeholder = "Write your reply here...",
}: PostFormProps) {
    const formRef = useRef<HTMLFormElement>(null);
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [body, setBody] = useState("");
    const [charCount, setCharCount] = useState(0);
    const maxChars = 10000;

    const handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setBody(value);
        setCharCount(value.length);
    };

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            try {
                await createPost(formData);
                formRef.current?.reset();
                setBody("");
                setCharCount(0);
                onSuccess?.();
            } catch (err) {
                setError((err as Error).message);
            }
        });
    };

    const charsLeft = maxChars - charCount;
    const isNearLimit = charsLeft < 100;
    const isAtLimit = charsLeft === 0;

    return (
        <div className={styles.postForm}>
            <form ref={formRef} action={handleSubmit}>
                <input type="hidden" name="threadId" value={threadId} />

                <div className={styles.formGroup}>
                    <label htmlFor="body" className={styles.label}>
                        Your Reply
                    </label>
                    <textarea
                        id="body"
                        name="body"
                        rows={6}
                        value={body}
                        onChange={handleBodyChange}
                        placeholder={placeholder}
                        className={styles.textarea}
                        disabled={isPending}
                        maxLength={maxChars}
                    />
                    <div
                        className={`${styles.charCounter} ${isNearLimit ? styles.nearLimit : ""} ${isAtLimit ? styles.atLimit : ""}`}
                    >
                        {charsLeft} characters remaining
                    </div>
                </div>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <div className={styles.formActions}>
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isPending || !body.trim() || isAtLimit}
                    >
                        {isPending ? "Posting..." : "Post Reply"}
                    </button>

                    {showCancel && onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className={styles.cancelButton}
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
