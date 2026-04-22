-- ==========================================
-- SEED DATA FOR AWESOME FORUM
-- Theme: Cool discoveries, amazing places, awesome experiences
-- ==========================================

-- Clear existing data (optional - be careful!)
TRUNCATE users, threads, posts, messages, likes, followings, subscriptions, notifications RESTART IDENTITY CASCADE;

-- ==========================================
-- USERS
-- ==========================================

INSERT INTO users (username, password, salt, salt_location, is_admin, email, name, avatar, bio, signature, registered) VALUES
('awesome_alex', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'salt', 1, true, 'alex@example.com', 'Alex', 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex', 'Lover of all things awesome', 'Find something awesome every day', '2024-01-15 10:00:00'),
('wanderer_jane', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'salt', 1, false, 'jane@example.com', 'Jane', 'https://api.dicebear.com/7.x/avataaars/svg?seed=jane', 'Travel enthusiast and foodie', 'Collecting passport stamps since 2015', '2024-02-20 14:30:00'),
('bob_cool', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'salt', 1, false, 'bob@example.com', NULL, 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob', 'Just here for the awesome vibes', NULL, '2024-03-10 09:15:00'),
('sarah_awesome', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'salt', 1, false, 'sarah@example.com', 'Sarah', 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah', 'Finding wonder in ordinary things', 'Life is awesome', '2024-03-25 16:45:00'),
('mike_epic', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'salt', 1, false, 'mike@example.com', 'Mike', 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike', 'Outdoor adventurer', 'Nature is the best therapy', '2024-04-01 11:20:00'),
('lisa_loves', '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', 'salt', 1, false, 'lisa@example.com', 'Lisa', 'https://api.dicebear.com/7.x/avataaars/svg?seed=lisa', 'Music and art enthusiast', 'Creating something every day', '2024-04-10 08:00:00');

-- ==========================================
-- THREADS - Awesome topics
-- ==========================================

INSERT INTO threads (author_id, title, date) VALUES
(1, 'What''s the most awesome thing that happened to you this week?', '2024-03-01 10:00:00'),
(2, 'Hidden gems in your city that everyone should know about', '2024-03-05 09:15:00'),
(3, 'That one meal that changed your life', '2024-03-10 14:20:00'),
(4, 'Best sunrise/sunset spots you''ve ever witnessed', '2024-03-15 12:00:00'),
(1, 'Small acts of kindness that restored your faith in humanity', '2024-03-20 08:30:00'),
(5, 'Underrated travel destinations that blew your mind', '2024-04-01 13:45:00'),
(2, 'What hobby did you pick up that made your life better?', '2024-04-05 11:00:00');

-- ==========================================
-- POSTS
-- ==========================================

-- Thread 1: Most awesome thing this week
INSERT INTO posts (thread_id, author_id, body, date) VALUES
(1, 1, 'I finally learned how to bake sourdough bread and it actually came out perfect! Been trying for months. What awesome things happened to you all?', '2024-03-01 10:00:00'),
(1, 2, 'I found a $20 bill in an old jacket pocket right when I was feeling stressed about money. Small thing but felt like the universe winking at me.', '2024-03-01 11:30:00'),
(1, 3, 'My neighbor saw me struggling to carry groceries and helped me all the way to my door. Restored my faith in people.', '2024-03-01 14:20:00'),
(1, 4, 'Got a promotion at work! Been working towards it for two years. Celebrating with pizza tonight.', '2024-03-02 09:45:00'),
(1, 5, 'My dog learned a new trick! She finally rolls over on command. Proud dog parent moment.', '2024-03-02 15:30:00');

-- Thread 2: Hidden gems in your city
INSERT INTO posts (thread_id, author_id, body, date) VALUES
(2, 2, 'There''s this tiny bookshop hidden in an alley downtown that has the best used book collection. Owner remembers everyone''s name. What''s your hidden gem?', '2024-03-05 09:15:00'),
(2, 1, 'A little ramen shop that only seats 8 people. Best broth I''ve ever had. You have to wait an hour but so worth it.', '2024-03-05 10:45:00'),
(2, 4, 'Sunset spot on top of the parking garage downtown. Free views, no crowds, bring a blanket.', '2024-03-05 13:30:00'),
(2, 6, 'Community garden that''s open to everyone. Grew my first tomatoes there last summer. So satisfying!', '2024-03-06 09:00:00');

-- Thread 3: Meal that changed your life
INSERT INTO posts (thread_id, author_id, body, date) VALUES
(3, 3, 'Street tacos from a random cart in Mexico City. I still dream about them. Simple but perfect.', '2024-03-10 14:20:00'),
(3, 1, 'My grandmother''s lasagna. She finally wrote down the recipe before she passed. Makes me feel close to her every time I make it.', '2024-03-10 16:00:00'),
(3, 2, 'First time I had real Neapolitan pizza in Naples. Life-changing. Can''t look at regular pizza the same way.', '2024-03-11 10:30:00'),
(3, 5, 'Fresh caught fish cooked on a beach in Thailand. Simple grilled fish with lime and chili. Nothing has compared since.', '2024-03-12 09:00:00');

-- Thread 4: Best sunrise/sunset spots
INSERT INTO posts (thread_id, author_id, body, date) VALUES
(4, 4, 'Sunset at the Grand Canyon. Photos don''t do it justice. The colors just kept getting better for an hour.', '2024-03-15 12:00:00'),
(4, 2, 'Watching sunrise from a hot air balloon in Cappadocia, Turkey. Pure magic. Worth waking up at 4am.', '2024-03-15 13:30:00'),
(4, 5, 'My local beach. Nothing fancy but watching the sun rise over the water with my coffee is my happy place.', '2024-03-15 15:00:00'),
(4, 1, 'Sunset from a mountaintop after a hard hike. The feeling of accomplishment makes it even better.', '2024-03-16 10:00:00'),
(4, 3, 'Northern Lights in Iceland. Not sunrise/sunset but still the most incredible sky I''ve ever seen.', '2024-03-17 14:30:00');

-- Thread 5: Small acts of kindness
INSERT INTO posts (thread_id, author_id, body, date) VALUES
(5, 1, 'A stranger paid for my coffee this morning. Just because. I ended up paying for the person behind me to keep it going.', '2024-03-20 08:30:00'),
(5, 3, 'My car broke down and someone stopped to help within 5 minutes. Stayed with me until the tow truck came.', '2024-03-20 11:00:00'),
(5, 4, 'Lost my wallet and someone mailed it back to me with everything inside. Even included a nice note.', '2024-03-20 14:30:00'),
(5, 2, 'My coworker noticed I was having a rough day and brought me my favorite snack without me saying anything. Small gesture meant so much.', '2024-03-21 09:00:00');

-- Thread 6: Underrated travel destinations
INSERT INTO posts (thread_id, author_id, body, date) VALUES
(6, 5, 'Slovenia. Lake Bled is beautiful but the whole country is stunning. Less crowded than neighboring countries.', '2024-04-01 13:45:00'),
(6, 1, 'The Oregon coast. Rugged, dramatic, and so many cool little towns. Way underrated compared to California beaches.', '2024-04-01 15:30:00'),
(6, 2, 'Taiwan. Amazing food, friendly people, great public transit. Taipei is one of my favorite cities now.', '2024-04-02 10:00:00'),
(6, 4, 'Colombia. So much variety - beaches, mountains, cities. Coffee region is incredible. Go before it gets too popular.', '2024-04-02 14:00:00');

-- Thread 7: Hobby that made life better
INSERT INTO posts (thread_id, author_id, body, date) VALUES
(7, 2, 'Started gardening during lockdown. Now I have a whole vegetable patch. Growing your own food is so satisfying.', '2024-04-05 11:00:00'),
(7, 1, 'Learning to play guitar. It''s frustrating sometimes but playing even simple songs makes me happy.', '2024-04-05 13:00:00'),
(7, 5, 'Hiking. Started with small trails, now I''ve done several multi-day trips. Clears my mind like nothing else.', '2024-04-06 09:30:00'),
(7, 3, 'Journaling. Just writing down three good things every day changed my outlook.', '2024-04-06 14:00:00'),
(7, 6, 'Pottery. Something about working with clay is so meditative. And you get useful stuff at the end!', '2024-04-07 10:00:00');

-- ==========================================
-- LIKES
-- ==========================================

INSERT INTO likes (user_id, post_id, like_dislike) VALUES
-- Positive vibes only - mostly likes, few dislikes for realism
(2, 1, 1), (3, 1, 1), (4, 1, 1), (5, 1, 1),  -- Sourdough bread success
(1, 2, 1), (3, 2, 1), (4, 2, 1),              -- Found $20
(1, 4, 1), (2, 4, 1), (5, 4, 1),              -- Promotion
(2, 6, 1), (3, 6, 1), (4, 6, 1), (6, 6, 1),   -- Bookshop
(1, 9, 1), (4, 9, 1),                         -- Tacos
(2, 12, 1), (3, 12, 1), (5, 12, 1),           -- Grand Canyon
(1, 15, 1), (2, 15, 1), (3, 15, 1), (4, 15, 1), -- Coffee kindness
(2, 18, 1), (5, 18, 1),                       -- Slovenia
(1, 21, 1), (2, 21, 1), (4, 21, 1),           -- Gardening

-- A few dislikes for realism (someone disagreed or had bad experience)
(3, 8, -1),  -- Someone doesn't like parking garage sunsets
(5, 13, -1); -- Maybe Lisa had bad pottery experience

-- ==========================================
-- FOLLOWINGS
-- ==========================================

INSERT INTO followings (follower_id, following_id) VALUES
(2, 1), (3, 1), (4, 1), (5, 1), (6, 1),  -- Everyone follows Alex (friendly admin)
(3, 2), (4, 2), (6, 2),                   -- Bob, Sarah, Lisa follow Jane
(1, 5),                                   -- Alex follows Mike
(2, 4), (5, 4),                           -- Jane and Mike follow Sarah
(1, 6);                                   -- Alex follows Lisa (supporting new member)

-- ==========================================
-- SUBSCRIPTIONS
-- ==========================================

INSERT INTO subscriptions (subscriber_id, thread_id) VALUES
(1, 2), (1, 3), (1, 5),    -- Alex follows hidden gems, food, kindness
(2, 1), (2, 4), (2, 7),    -- Jane follows awesome moments, sunsets, hobbies
(3, 3), (3, 6),            -- Bob follows food and travel
(4, 4), (4, 5),            -- Sarah follows sunsets and kindness
(5, 2), (5, 6), (5, 7);    -- Mike follows hidden gems, travel, hobbies

-- ==========================================
-- MESSAGES (Private messages - friendly chat)
-- ==========================================

INSERT INTO messages (author_id, recipient_id, body, date) VALUES
(1, 2, 'Hey Jane, loved your post about the hidden bookshop! What''s the name of the place? I''d love to check it out.', '2024-04-01 10:00:00'),
(2, 1, 'Thanks Alex! It''s called "Corner Pages" on Maple Street. Let me know if you go!', '2024-04-01 10:30:00'),
(1, 2, 'Awesome, thank you! I''ll check it out this weekend.', '2024-04-01 11:00:00'),
(3, 1, 'Hey Alex, your sourdough post inspired me! Any tips for a beginner?', '2024-04-03 14:00:00'),
(1, 3, 'Sure Bob! Patience is key. And don''t give up if your first loaf is flat. Mine were bricks at first!', '2024-04-03 14:15:00'),
(4, 2, 'Jane, your travel posts are amazing. How do you find these hidden gems?', '2024-04-05 09:00:00'),
(2, 4, 'Thanks Sarah! Lots of research and talking to locals. And sometimes just getting lost on purpose!', '2024-04-05 09:45:00');

-- ==========================================
-- NOTIFICATIONS
-- ==========================================

INSERT INTO notifications (recipient_id, sender_id, post_id, notification_type, is_read, date) VALUES
-- Alex's notifications
(1, 2, 2, 'reply', true, '2024-03-01 11:30:00'),
(1, 3, 3, 'reply', true, '2024-03-01 14:20:00'),
(1, 4, 4, 'reply', true, '2024-03-02 09:45:00'),
(1, 5, 5, 'reply', false, '2024-03-02 15:30:00'),
(1, 2, 6, 'like', true, '2024-03-05 10:45:00'),
(1, 3, 10, 'like', false, '2024-03-10 16:00:00'),

-- Jane's notifications
(2, 1, 6, 'reply', true, '2024-03-05 10:45:00'),
(2, 4, 8, 'reply', true, '2024-03-05 13:30:00'),
(2, 1, 11, 'like', false, '2024-03-11 10:30:00'),
(2, 1, 18, 'reply', false, '2024-04-01 15:30:00'),

-- Bob's notifications
(3, 1, 9, 'reply', true, '2024-03-10 16:00:00'),
(3, 2, 11, 'reply', false, '2024-03-11 10:30:00'),
(3, 1, 17, 'like', false, '2024-03-17 14:30:00'),

-- Sarah's notifications
(4, 2, 13, 'reply', true, '2024-03-15 13:30:00'),
(4, 1, 14, 'reply', false, '2024-03-15 15:00:00'),
(4, 2, 16, 'like', false, '2024-03-16 10:00:00'),

-- Mike's notifications
(5, 1, 19, 'reply', false, '2024-04-01 15:30:00'),
(5, 2, 20, 'reply', false, '2024-04-02 10:00:00'),
(5, 4, 23, 'like', false, '2024-04-06 09:30:00'),

-- Follow notifications
(1, 2, NULL, 'follow', true, '2024-03-01 11:00:00'),
(1, 3, NULL, 'follow', true, '2024-03-10 09:30:00'),
(1, 4, NULL, 'follow', false, '2024-03-25 17:00:00'),
(2, 3, NULL, 'follow', true, '2024-03-10 10:00:00'),
(2, 4, NULL, 'follow', false, '2024-03-26 08:00:00'),
(5, 1, NULL, 'follow', true, '2024-04-01 12:00:00');
