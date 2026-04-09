"use client";

import { createPost } from "@/actions/posts";

export function PostForm({ threadId }: { threadId: number }) {
    return (
        <form action={createPost}>
        <input type="hidden" name="threadId" value={threadId} />
        <textarea name="body" rows={4} className="w-full border p-2" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2">
        Post Reply
        </button>
        </form>
    );
}
