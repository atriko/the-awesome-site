"use server";

import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Create a new thread with its first post
export async function createThread(formData: FormData) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("You must be logged in to create a thread");
    }

    const title = formData.get("title") as string;
    const body = formData.get("body") as string;

    // Validate input
    if (!title || title.trim().length === 0) {
        throw new Error("Title is required");
    }

    if (title.length > 255) {
        throw new Error("Title must be less than 255 characters");
    }

    if (!body || body.trim().length === 0) {
        throw new Error("Post content cannot be empty");
    }

    if (body.length > 10000) {
        throw new Error("Post is too long (max 10,000 characters)");
    }

    try {
        // Insert the thread
        const threadResult = await query(
            `INSERT INTO threads (author_id, title, date)
            VALUES ($1, $2, CURRENT_TIMESTAMP)
            RETURNING thread_id`,
            [user.user_id, title.trim()],
        );

        const threadId = threadResult.rows[0].thread_id;

        // Insert the first post
        await query(
            `INSERT INTO posts (thread_id, author_id, body, date)
            VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
            [threadId, user.user_id, body.trim()],
        );

        // Revalidate the forum page to show the new thread
        revalidatePath("/forum");

        // Redirect to the new thread
        redirect(`/forum/thread/${threadId}`);
    } catch (error) {
        console.error("Failed to create thread:", error);
        throw new Error("Failed to create thread. Please try again.");
    }
}

// Delete a thread (admin only or thread author)
export async function deleteThread(threadId: number) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("You must be logged in to delete a thread");
    }

    // Check if user is admin or thread author
    const threadResult = await query(
        `SELECT author_id FROM threads WHERE thread_id = $1`,
        [threadId],
    );

    if (threadResult.rows.length === 0) {
        throw new Error("Thread not found");
    }

    const thread = threadResult.rows[0];

    if (thread.author_id !== user.user_id && !user.is_admin) {
        throw new Error("You can only delete your own threads");
    }

    try {
        // Delete the thread (posts will cascade due to foreign key)
        await query(`DELETE FROM threads WHERE thread_id = $1`, [threadId]);

        revalidatePath("/forum");
        redirect("/forum");
    } catch (error) {
        console.error("Failed to delete thread:", error);
        throw new Error("Failed to delete thread");
    }
}

// Edit thread title (admin or author only)
export async function editThreadTitle(threadId: number, newTitle: string) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("You must be logged in to edit a thread");
    }

    if (!newTitle || newTitle.trim().length === 0) {
        throw new Error("Title cannot be empty");
    }

    if (newTitle.length > 255) {
        throw new Error("Title must be less than 255 characters");
    }

    // Check permission
    const threadResult = await query(
        `SELECT author_id FROM threads WHERE thread_id = $1`,
        [threadId],
    );

    if (threadResult.rows.length === 0) {
        throw new Error("Thread not found");
    }

    const thread = threadResult.rows[0];

    if (thread.author_id !== user.user_id && !user.is_admin) {
        throw new Error("You can only edit your own threads");
    }

    await query(`UPDATE threads SET title = $1 WHERE thread_id = $2`, [
        newTitle.trim(),
        threadId,
    ]);

    revalidatePath(`/forum/thread/${threadId}`);
    revalidatePath("/forum");
}
