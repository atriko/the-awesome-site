"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";

export async function createPost(formData: FormData) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const threadId = parseInt(formData.get("threadId") as string);
    const body = formData.get("body") as string;

    await prisma.post.create({
        data: { thread_id: threadId, author_id: user.user_id, body }
    });

    revalidatePath(`/forum/thread/${threadId}`);
}

export async function likePost(postId: number, value: 1 | -1) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await prisma.like.upsert({
        where: {
            user_id_post_id: { user_id: user.user_id, post_id: postId }
        },
        update: { like_dislike: value },
        create: { user_id: user.user_id, post_id: postId, like_dislike: value }
    });

    revalidatePath(`/forum/thread/${postId}`);
}
