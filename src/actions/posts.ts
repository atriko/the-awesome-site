"use server";

import { query } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

// Create a new post in a thread
export async function createPost(formData: FormData) {
    // Check authentication
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("You must be logged in to post");
    }

    const threadId = parseInt(formData.get("threadId") as string);
    const body = formData.get("body") as string;

    // Validate input
    if (!body || body.trim().length === 0) {
        throw new Error("Post body cannot be empty");
    }

    if (body.length > 10000) {
        throw new Error("Post is too long (max 10,000 characters)");
    }

    // Insert the post
    await query(
        `INSERT INTO posts (thread_id, author_id, body, date)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
                [threadId, user.user_id, body]
    );

    // Update the thread's last activity date
    await query(
        `UPDATE threads SET date = CURRENT_TIMESTAMP
        WHERE thread_id = $1`,
        [threadId]
    );

    // Revalidate the thread page to show the new post
    revalidatePath(`/forum/thread/${threadId}`);
}

// Delete a post
export async function deletePost(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("You must be logged in to delete posts");
    }

    const postId = parseInt(formData.get("postId") as string);
    const threadId = parseInt(formData.get("threadId") as string);

    // Check if user is admin or post author
    const postResult = await query(
        `SELECT author_id FROM posts WHERE post_id = $1`,
        [postId]
    );

    if (postResult.rows.length === 0) {
        throw new Error("Post not found");
    }

    const post = postResult.rows[0];

    if (post.author_id !== user.user_id && !user.is_admin) {
        throw new Error("You can only delete your own posts");
    }

    // Delete the post
    await query(`DELETE FROM posts WHERE post_id = $1`, [postId]);

    // Revalidate the thread page
    revalidatePath(`/forum/thread/${threadId}`);
}

// Like or dislike a post
export async function likePost(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("You must be logged in to like posts");
    }

    const postId = parseInt(formData.get("postId") as string);
    const value = parseInt(formData.get("value") as string); // 1 or -1

    if (value !== 1 && value !== -1) {
        throw new Error("Invalid like value");
    }

    // Upsert: update if exists, insert if not
    await query(
        `INSERT INTO likes (user_id, post_id, like_dislike)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, post_id)
        DO UPDATE SET like_dislike = $3`,
        [user.user_id, postId, value]
    );

    // Get thread_id for revalidation
    const postResult = await query(
        `SELECT thread_id FROM posts WHERE post_id = $1`,
        [postId]
    );

    if (postResult.rows.length > 0) {
        revalidatePath(`/forum/thread/${postResult.rows[0].thread_id}`);
    }
}

// Remove a like/dislike
export async function removeLike(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("You must be logged in");
    }

    const postId = parseInt(formData.get("postId") as string);

    await query(
        `DELETE FROM likes WHERE user_id = $1 AND post_id = $2`,
        [user.user_id, postId]
    );

    // Get thread_id for revalidation
    const postResult = await query(
        `SELECT thread_id FROM posts WHERE post_id = $1`,
        [postId]
    );

    if (postResult.rows.length > 0) {
        revalidatePath(`/forum/thread/${postResult.rows[0].thread_id}`);
    }
}
