CREATE TABLE users (
    -- Required for logging in
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(32) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    salt VARCHAR(16) NOT NULL,
    salt_location SMALLINT NOT NULL CHECK (salt_location <= 255),
    -- Important
    is_admin BOOLEAN NOT NULL DEFAULT false,
    -- Optional 2FA
    auth_key VARCHAR(255),
    -- Optional contact info
    email VARCHAR(64),
    phone VARCHAR(11) CHECK (phone ~ '^[0-9]{10,11}$'),
    -- Optional customizable personal data
    name VARCHAR(32),
    avatar VARCHAR(255),
    bio TEXT,
    signature VARCHAR(255),
    -- Date info
    registered TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);

-----------------------------------------------------------------------------------------
CREATE TABLE threads (
    thread_id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-----------------------------------------------------------------------------------------
CREATE TABLE posts (
    post_id SERIAL PRIMARY KEY,
    thread_id INTEGER NOT NULL REFERENCES threads(thread_id) ON DELETE CASCADE,
    author_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Quickly find all posts in a thread
CREATE INDEX idx_posts_thread_id ON posts(thread_id);
-- Quickly find all posts by a user for their profile
CREATE INDEX idx_posts_author_id ON posts(author_id);
-- Quickly find "recent posts" across the forum
CREATE INDEX idx_posts_date ON posts(date);

-----------------------------------------------------------------------------------------
CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    author_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    recipient_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    body TEXT NOT NULL,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Speed up sent folder generation
CREATE INDEX idx_messages_author_id ON messages(author_id);
-- Speed up inbox generation
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);

-----------------------------------------------------------------------------------------
CREATE TABLE likes (
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    like_dislike SMALLINT NOT NULL CHECK (like_dislike IN (1, -1)),
    PRIMARY KEY (user_id, post_id)
);

-- Quickly count likes on a post
CREATE INDEX idx_likes_post_id ON likes(post_id);

-----------------------------------------------------------------------------------------
CREATE TABLE followings (
    follower_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    following_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (follower_id, following_id)
);

-----------------------------------------------------------------------------------------
CREATE TABLE subscriptions (
    subscriber_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    thread_id INTEGER NOT NULL REFERENCES threads(thread_id) ON DELETE CASCADE,
    PRIMARY KEY (subscriber_id, thread_id)
);

-----------------------------------------------------------------------------------------
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    recipient_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    -- Polymorphic reference fields
    post_id INTEGER REFERENCES posts(post_id) ON DELETE CASCADE,
    message_id INTEGER REFERENCES messages(message_id) ON DELETE CASCADE,
    -- Type determines which ID to look at
    notification_type VARCHAR(20) NOT NULL CHECK (notification_type IN ('reply', 'like', 'follow', 'message')),
    is_read BOOLEAN NOT NULL DEFAULT false,
    date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Ensure exactly one reference is provided
    CHECK (
        (notification_type IN ('reply', 'like') AND post_id IS NOT NULL AND message_id IS NULL) OR
        (notification_type = 'message' AND message_id IS NOT NULL AND post_id IS NULL) OR
        (notification_type = 'follow' AND post_id IS NULL AND message_id IS NULL)
    )
);

-- Quickly find all notifications for a specific user:
CREATE INDEX idx_notifications_recipient_id ON notifications(recipient_id);
-- Quickly count unread notifications for a user for badge:
CREATE INDEX idx_notifications_unread ON notifications(recipient_id, is_read);
-- Speed up sorting by date, especially for pagination:
CREATE INDEX idx_notifications_date ON notifications(date DESC);






