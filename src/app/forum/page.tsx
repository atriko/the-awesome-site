import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function ForumPage() {
    const threads = await prisma.thread.findMany({
        include: {
            author: { select: { username: true } },
            _count: { select: { posts: true } }
        },
        orderBy: { date: "desc" }
    });

    return (
        <div>
        {threads.map((thread) => (
            <div key={thread.thread_id}>
            <Link href={`/forum/thread/${thread.thread_id}`}>
            {thread.title}
            </Link>
            <p>By {thread.author.username} · {thread._count.posts} replies</p>
            </div>
        ))}
        </div>
    );
}
