"use client";

import { createPost } from "@/actions/posts";
import { useRef } from "react";

export function PostForm({ threadId }: { threadId: number }) {
    const formRef = useRef<HTMLFormElement>(null);

    return (
        <form
        ref={formRef}
        action={async (formData: FormData) => {
            await createPost(formData);
            formRef.current?.reset();
        }}
        >
        <input type="hidden" name="threadId" value={threadId} />

        <div>
        <label htmlFor="body" className="block font-medium mb-2">
        Your Reply
        </label>
        <textarea
        id="body"
        name="body"
        rows={6}
        className="w-full border rounded-lg p-3"
        placeholder="Write your reply here..."
        required
        />
        </div>

        <button
        type="submit"
        className="mt-3 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
        Post Reply
        </button>
        </form>
    );
}
