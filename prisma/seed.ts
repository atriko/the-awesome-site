// prisma/seed.ts
import { PrismaClient } from "@/generated/prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Seeding database...");

    // Clear existing data (optional - be careful in production!)
    await prisma.$transaction([
        prisma.like.deleteMany(),
                              prisma.subscription.deleteMany(),
                              prisma.following.deleteMany(),
                              prisma.post.deleteMany(),
                              prisma.thread.deleteMany(),
                              prisma.message.deleteMany(),
                              prisma.user.deleteMany(),
    ]);

    console.log("✅ Cleared existing data");

    // Create users
    const users = await Promise.all([
        prisma.user.create({
            data: {
                username: "alex_dev",
                password: await hash("password123", 10),
                           salt: "dummy_salt_1",
                           saltLoc: 1,
                           isAdmin: true,
                           name: "Alex Developer",
                           bio: "Full-stack developer and forum enthusiast",
                           avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
                           signature: "Code is poetry",
                           createdAt: new Date("2024-01-15"),
                           lastLogin: new Date(),
            },
        }),
        prisma.user.create({
            data: {
                username: "jane_coder",
                password: await hash("password123", 10),
                           salt: "dummy_salt_2",
                           saltLoc: 1,
                           isAdmin: false,
                           name: "Jane Coder",
                           bio: "React and TypeScript lover",
                           avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
                           signature: "Building the web, one component at a time",
                           createdAt: new Date("2024-02-20"),
                           lastLogin: new Date(),
            },
        }),
        prisma.user.create({
            data: {
                username: "bob_enthusiast",
                password: await hash("password123", 10),
                           salt: "dummy_salt_3",
                           saltLoc: 1,
                           isAdmin: false,
                           name: null, // optional field
                           bio: "Just here to learn",
                           avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
                           signature: null,
                           createdAt: new Date("2024-03-10"),
                           lastLogin: new Date(),
            },
        }),
        prisma.user.create({
            data: {
                username: "sarah_designer",
                password: await hash("password123", 10),
                           salt: "dummy_salt_4",
                           saltLoc: 1,
                           isAdmin: false,
                           name: "Sarah Designer",
                           bio: "UI/UX designer learning to code",
                           avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                           signature: "Design is thinking made visual",
                           createdAt: new Date("2024-03-25"),
                           lastLogin: new Date(),
            },
        }),
    ]);

    console.log(`✅ Created ${users.length} users`);

    // Create threads
    const threads = await Promise.all([
        prisma.thread.create({
            data: {
                title: "Welcome to the forum!",
                authorId: users[0].id,
                createdAt: new Date("2024-03-01"),
            },
        }),
        prisma.thread.create({
            data: {
                title: "Best practices for React 19",
                authorId: users[1].id,
                createdAt: new Date("2024-03-05"),
            },
        }),
        prisma.thread.create({
            data: {
                title: "What's your favorite database?",
                authorId: users[2].id,
                createdAt: new Date("2024-03-10"),
            },
        }),
        prisma.thread.create({
            data: {
                title: "Show off your projects!",
                authorId: users[3].id,
                createdAt: new Date("2024-03-15"),
            },
        }),
        prisma.thread.create({
            data: {
                title: "Tips for learning TypeScript",
                authorId: users[0].id,
                createdAt: new Date("2024-03-20"),
            },
        }),
    ]);

    console.log(`✅ Created ${threads.length} threads`);

    // Create posts for each thread
    const posts = [];

    // Thread 1 posts
    posts.push(
        await prisma.post.create({
            data: {
                content: "Welcome everyone! Feel free to introduce yourselves here.",
                authorId: users[0].id,
                threadId: threads[0].id,
                createdAt: new Date("2024-03-01 10:00:00"),
            },
        }),
        await prisma.post.create({
            data: {
                content: "Thanks for having me! Excited to be part of this community.",
                authorId: users[1].id,
                threadId: threads[0].id,
                createdAt: new Date("2024-03-01 11:30:00"),
            },
        }),
        await prisma.post.create({
            data: {
                content: "Great to see everyone here. Looking forward to great discussions!",
                authorId: users[2].id,
                threadId: threads[0].id,
                createdAt: new Date("2024-03-01 14:20:00"),
            },
        })
    );

    // Thread 2 posts
    posts.push(
        await prisma.post.create({
            data: {
                content: "React 19's compiler is a game changer! What do you all think?",
                authorId: users[1].id,
                threadId: threads[1].id,
                createdAt: new Date("2024-03-05 09:15:00"),
            },
        }),
        await prisma.post.create({
            data: {
                content: "I've been testing it. The automatic memoization is incredible.",
                authorId: users[0].id,
                threadId: threads[1].id,
                createdAt: new Date("2024-03-05 10:45:00"),
            },
        }),
        await prisma.post.create({
            data: {
                content: "Server Components finally feel mature. No more client-side waterfalls!",
                authorId: users[3].id,
                threadId: threads[1].id,
                createdAt: new Date("2024-03-05 13:30:00"),
            },
        })
    );

    // Thread 3 posts
    posts.push(
        await prisma.post.create({
            data: {
                content: "PostgreSQL all the way! The JSON support is fantastic.",
                authorId: users[2].id,
                threadId: threads[2].id,
                createdAt: new Date("2024-03-10 08:00:00"),
            },
        }),
        await prisma.post.create({
            data: {
                content: "SQLite for development, PostgreSQL for production. Best of both worlds.",
                authorId: users[0].id,
                threadId: threads[2].id,
                createdAt: new Date("2024-03-10 10:20:00"),
            },
        }),
        await prisma.post.create({
            data: {
                content: "Has anyone tried Prisma with MongoDB? Curious about the experience.",
                authorId: users[1].id,
                threadId: threads[2].id,
                createdAt: new Date("2024-03-10 15:45:00"),
            },
        })
    );

    // Thread 4 posts
    posts.push(
        await prisma.post.create({
            data: {
                content: "I'm building a forum app! Here's a sneak peek: [screenshot]",
                authorId: users[3].id,
                threadId: threads[3].id,
                createdAt: new Date("2024-03-15 12:00:00"),
            },
        }),
        await prisma.post.create({
            data: {
                content: "That looks awesome! Love the clean UI.",
                authorId: users[1].id,
                threadId: threads[3].id,
                createdAt: new Date("2024-03-15 13:30:00"),
            },
        }),
        await prisma.post.create({
            data: {
                content: "Are you using Tailwind? The styling is beautiful.",
                authorId: users[0].id,
                threadId: threads[3].id,
                createdAt: new Date("2024-03-15 15:00:00"),
            },
        })
    );

    // Thread 5 posts
    posts.push(
        await prisma.post.create({
            data: {
                content: "TypeScript's type system is so powerful once you understand generics.",
                authorId: users[0].id,
                threadId: threads[4].id,
                createdAt: new Date("2024-03-20 09:00:00"),
            },
        }),
        await prisma.post.create({
            data: {
                content: "The 'as const' assertion changed how I write React apps.",
                authorId: users[2].id,
                threadId: threads[4].id,
                createdAt: new Date("2024-03-20 11:00:00"),
            },
        }),
        await prisma.post.create({
            data: {
                content: "Any recommendations for TypeScript courses?",
                authorId: users[3].id,
                threadId: threads[4].id,
                createdAt: new Date("2024-03-20 14:30:00"),
            },
        })
    );

    console.log(`✅ Created ${posts.length} posts`);

    // Create some likes
    const likes = await Promise.all([
        prisma.like.create({ data: { userId: users[1].id, postId: posts[0].id, value: 1 } }),
                                    prisma.like.create({ data: { userId: users[2].id, postId: posts[0].id, value: 1 } }),
                                    prisma.like.create({ data: { userId: users[3].id, postId: posts[1].id, value: 1 } }),
                                    prisma.like.create({ data: { userId: users[0].id, postId: posts[3].id, value: 1 } }),
                                    prisma.like.create({ data: { userId: users[1].id, postId: posts[4].id, value: 1 } }),
                                    prisma.like.create({ data: { userId: users[2].id, postId: posts[6].id, value: -1 } }), // dislike
    ]);

    console.log(`✅ Created ${likes.length} likes`);

    // Create some subscriptions
    const subscriptions = await Promise.all([
        prisma.subscription.create({ data: { userId: users[0].id, threadId: threads[1].id } }),
                                            prisma.subscription.create({ data: { userId: users[1].id, threadId: threads[2].id } }),
                                            prisma.subscription.create({ data: { userId: users[2].id, threadId: threads[3].id } }),
                                            prisma.subscription.create({ data: { userId: users[3].id, threadId: threads[4].id } }),
    ]);

    console.log(`✅ Created ${subscriptions.length} subscriptions`);

    // Create some follow relationships
    const follows = await Promise.all([
        prisma.following.create({ data: { followerId: users[1].id, followingId: users[0].id } }),
                                      prisma.following.create({ data: { followerId: users[2].id, followingId: users[0].id } }),
                                      prisma.following.create({ data: { followerId: users[3].id, followingId: users[1].id } }),
                                      prisma.following.create({ data: { followerId: users[0].id, followingId: users[2].id } }),
    ]);

    console.log(`✅ Created ${follows.length} follows`);

    // Create some private messages
    const messages = await Promise.all([
        prisma.message.create({
            data: {
                authorId: users[0].id,
                recipientId: users[1].id,
                body: "Hey Jane, loved your post about React 19!",
                sentAt: new Date("2024-03-21 10:00:00"),
            },
        }),
        prisma.message.create({
            data: {
                authorId: users[1].id,
                recipientId: users[0].id,
                body: "Thanks Alex! The compiler really is amazing.",
                sentAt: new Date("2024-03-21 10:30:00"),
            },
        }),
        prisma.message.create({
            data: {
                authorId: users[2].id,
                recipientId: users[3].id,
                body: "Hey Sarah, love your design work!",
                sentAt: new Date("2024-03-22 14:00:00"),
            },
        }),
    ]);

    console.log(`✅ Created ${messages.length} messages`);

    console.log("🎉 Seeding completed successfully!");
}

main()
.catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
})
.finally(async () => {
    await prisma.$disconnect();
});
