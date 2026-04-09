import { prisma } from "@/lib/prisma";
import { PostForm } from "@/components/PostForm";
import { LikeButton } from "@/components/LikeButton";
import { notFound } from "next/navigation";

export default async function ThreadPage({ params }: { params: { id: string } }) {
    const thread = await prisma.thread.findUnique({
        where: { thread_id: parseInt(params.id) },
            include: {
                author: true,
                posts: {
                    include: { author: true, likes: true },
                orderBy: { date: "asc" }
            }
        }
    });

    if (!thread) notFound();

    return (
        <div>
            <h1>{thread.title}</h1>
            {thread.posts.map((post) => (
                <div key={post.post_id}>
                <p>{post.author.username}</p>
                <p>{post.body}</p>
                <LikeButton postId={post.post_id} initialLikes={post.likes} />
                </div>
            ))}
            <PostForm threadId={thread.thread_id} />
        </div>
    );
}
