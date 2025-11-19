-- =========================================================
-- EXTENSIONS
-- =========================================================
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =========================================================
-- ENUM TYPES
-- =========================================================
CREATE TYPE shop_item_type AS ENUM ('icon', 'banner', 'accessory');
CREATE TYPE list_genre AS ENUM ('action', 'fantasy', 'sci-fi', 'horror', 'christmas');

-- =========================================================
-- USERS
-- =========================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    passhash VARCHAR(255) NOT NULL,
    credits INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- SHOP ITEMS
-- =========================================================
CREATE TABLE shop (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INT NOT NULL,
    type shop_item_type NOT NULL,
    image_url VARCHAR(255)
);

-- =========================================================
-- USER INVENTORY (users ↔ shop)
-- =========================================================
CREATE TABLE user_items (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES shop(id) ON DELETE CASCADE,
    is_equipped BOOLEAN DEFAULT FALSE
);

-- =========================================================
-- REVIEWS
-- =========================================================
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    movie_id INT NOT NULL,
    movie_name VARCHAR(255) NOT NULL,
    content TEXT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- GROUPS
-- =========================================================
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    creator_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    banner_url VARCHAR(255),
    icon_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- GROUP MEMBERSHIP (users ↔ groups)
-- =========================================================
CREATE TABLE group_user (
    id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT FALSE,
    is_member BOOLEAN DEFAULT FALSE,
    is_applied BOOLEAN DEFAULT FALSE
);

-- Ensure a user can be a member of a group only once
CREATE UNIQUE INDEX IF NOT EXISTS group_user_unique_idx ON group_user (group_id, user_id);

-- =========================================================
-- LISTS
-- =========================================================
CREATE TABLE lists (
    id SERIAL PRIMARY KEY,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    genre list_genre,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================================
-- MOVIES (optional cached data)
-- =========================================================
CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    release_year INT,
    poster_url VARCHAR(255)
);

-- =========================================================
-- LIST MOVIES (lists ↔ movies)
-- =========================================================
CREATE TABLE list_movies (
    id SERIAL PRIMARY KEY,
    list_id INT NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    movie_id INT NOT NULL REFERENCES movies(id) ON DELETE CASCADE
);
