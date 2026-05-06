"use server";

import { query } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function sendMessage(formData: FormData) {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("You must be logged in to send messages");
    }

    let recipientId = formData.get("recipientId") as string;
    const recipientUsername = formData.get("recipientUsername") as string;

    // If recipientId is not provided, look up by username
    if (!recipientId && recipientUsername) {
        const recipientResult = await query(
            `SELECT user_id FROM users WHERE username = $1`,
            [recipientUsername],
        );

        if (recipientResult.rows.length === 0) {
            throw new Error("User not found");
        }
        recipientId = recipientResult.rows[0].user_id;
    }

    if (!recipientId) {
        throw new Error("Recipient is required");
    }

    const body = formData.get("body") as string;

    if (!body || body.trim().length === 0) {
        throw new Error("Message cannot be empty");
    }

    if (body.length > 10000) {
        throw new Error("Message is too long (max 10,000 characters)");
    }

    // Don't allow sending messages to yourself
    if (parseInt(recipientId) === user.user_id) {
        throw new Error("You cannot send a message to yourself");
    }

    // Insert the message
    await query(
        `INSERT INTO messages (author_id, recipient_id, body, date)
        VALUES ($1, $2, $3, CURRENT_TIMESTAMP)`,
        [user.user_id, parseInt(recipientId), body.trim()],
    );

    revalidatePath("/messages");

    // Redirect back to the conversation with the recipient
    redirect(`/messages/new?to=${recipientId}`);
}
