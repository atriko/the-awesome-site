"use client";

import { useState, useTransition } from "react";
import { likePost, removeLike } from "@/actions/posts";
import styles from "./LikeButton.module.scss";

interface LikeButtonProps {
    postId: number;
    initialLikes: number;
    initialDislikes: number;
    initialUserLike: number | null; // 1 = like, -1 = dislike, null = no reaction
    size?: "small" | "medium" | "large";
}

export function LikeButton({
    postId,
    initialLikes,
    initialDislikes,
    initialUserLike,
    size = "medium",
}: LikeButtonProps) {
    const [isPending, startTransition] = useTransition();
    const [likes, setLikes] = useState(initialLikes);
    const [dislikes, setDislikes] = useState(initialDislikes);
    const [userLike, setUserLike] = useState(initialUserLike);

    const handleLike = () => {
        startTransition(async () => {
            if (userLike === 1) {
                // User already liked - remove the like
                const formData = new FormData();
                formData.append("postId", postId.toString());
                await removeLike(formData);
                setLikes(likes - 1);
                setUserLike(null);
            } else {
                // Add or change to like
                const formData = new FormData();
                formData.append("postId", postId.toString());
                formData.append("value", "1");
                await likePost(formData);

                if (userLike === -1) {
                    // Was disliked, now liked
                    setDislikes(dislikes - 1);
                    setLikes(likes + 1);
                } else {
                    // No reaction, now liked
                    setLikes(likes + 1);
                }
                setUserLike(1);
            }
        });
    };

    const handleDislike = () => {
        startTransition(async () => {
            if (userLike === -1) {
                // User already disliked - remove the dislike
                const formData = new FormData();
                formData.append("postId", postId.toString());
                await removeLike(formData);
                setDislikes(dislikes - 1);
                setUserLike(null);
            } else {
                // Add or change to dislike
                const formData = new FormData();
                formData.append("postId", postId.toString());
                formData.append("value", "-1");
                await likePost(formData);

                if (userLike === 1) {
                    // Was liked, now disliked
                    setLikes(likes - 1);
                    setDislikes(dislikes + 1);
                } else {
                    // No reaction, now disliked
                    setDislikes(dislikes + 1);
                }
                setUserLike(-1);
            }
        });
    };

    const sizeClass =
        size === "small" ? styles.small : size === "large" ? styles.large : "";

    return (
        <div className={`${styles.likeButtonContainer} ${sizeClass}`}>
            <button
                onClick={handleLike}
                disabled={isPending}
                className={`${styles.likeButton} ${userLike === 1 ? styles.active : ""}`}
                aria-label="Like"
            >
                <span className={styles.icon}>👍</span>
                {likes > 0 && <span className={styles.count}>{likes}</span>}
                {isPending && userLike === 1 && (
                    <span className={styles.pendingIndicator} />
                )}
            </button>

            <button
                onClick={handleDislike}
                disabled={isPending}
                className={`${styles.dislikeButton} ${userLike === -1 ? styles.active : ""}`}
                aria-label="Dislike"
            >
                <span className={styles.icon}>👎</span>
                {dislikes > 0 && (
                    <span className={styles.count}>{dislikes}</span>
                )}
                {isPending && userLike === -1 && (
                    <span className={styles.pendingIndicator} />
                )}
            </button>
        </div>
    );
}
