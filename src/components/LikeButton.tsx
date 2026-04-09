"use client";

import { useState, useTransition } from "react";
import { likePost, removeLike } from "@/actions/posts";

interface LikeButtonProps {
    postId: number;
    initialLikes: number;
    initialDislikes: number;
    initialUserLike: number | null; // 1 = like, -1 = dislike, null = no reaction
}

export function LikeButton({
    postId,
    initialLikes,
    initialDislikes,
    initialUserLike,
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

    return (
        <div className="like-button-container">
        <button
        onClick={handleLike}
        disabled={isPending}
        className={`like-button ${userLike === 1 ? "active" : ""}`}
        aria-label="Like"
        >
        👍 {likes > 0 && <span className="count">{likes}</span>}
        </button>

        <button
        onClick={handleDislike}
        disabled={isPending}
        className={`dislike-button ${userLike === -1 ? "active" : ""}`}
        aria-label="Dislike"
        >
        👎 {dislikes > 0 && <span className="count">{dislikes}</span>}
        </button>

        {isPending && <span className="pending-indicator">...</span>}
        </div>
    );
}
