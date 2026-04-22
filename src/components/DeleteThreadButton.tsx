// src/components/DeleteThreadButton.tsx
"use client";

import { deleteThread } from "@/actions/threads";
import { useTransition } from "react";

export function DeleteThreadButton({ threadId }: { threadId: number }) {
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this thread?")) {
            startTransition(() => {
                deleteThread(threadId);
            });
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isPending}
            className="delete-button"
        >
            {isPending ? "Deleting..." : "Delete Thread"}
        </button>
    );
}
