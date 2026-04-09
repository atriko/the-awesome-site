import { query } from "@/lib/db";
import { compare, hash } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";

// Types
export interface User {
    user_id: number;
    username: string;
    password: string;
    salt: string;
    salt_location: number;
    is_admin: boolean;
    auth_key: string | null;
    email: string | null;
    phone: string | null;
    name: string | null;
    avatar: string | null;
    bio: string | null;
    signature: string | null;
    registered: Date;
    last_login: Date | null;
}

// JWT secret from environment variables
const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || "your-secret-key-minimum-32-characters-long"
);

// Session expiration (7 days)
const SESSION_EXPIRES_IN = 7 * 24 * 60 * 60 * 1000;

// Create a session token for a user
export async function createSession(userId: number) {
    const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(new Date(Date.now() + SESSION_EXPIRES_IN))
    .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(Date.now() + SESSION_EXPIRES_IN),
                    path: "/",
    });

    return token;
}

// Get the current logged-in user
export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("session")?.value;

    if (!token) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as number;

        const result = await query(
            `SELECT * FROM users WHERE user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return null;
        }

        return result.rows[0] as User;
    } catch (error) {
        return null;
    }
}

// Require authentication (redirects to login if not authenticated)
export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }
    return user;
}

// Login a user
export async function login(username: string, password: string): Promise<User | null> {
    const result = await query(
        `SELECT * FROM users WHERE username = $1`,
        [username]
    );

    if (result.rows.length === 0) {
        return null;
    }

    const user = result.rows[0] as User;
    const isValid = await compare(password, user.password);

    if (!isValid) {
        return null;
    }

    await query(
        `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1`,
        [user.user_id]
    );

    await createSession(user.user_id);
    return user;
}

// Register a new user
export async function register(
    username: string,
    password: string,
    email?: string,
    name?: string
): Promise<User | null> {
    const existingUser = await query(
        `SELECT user_id FROM users WHERE username = $1`,
        [username]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Username already taken");
    }

    const hashedPassword = await hash(password, 10);

    const result = await query(
        `INSERT INTO users (username, password, salt, salt_location, email, name, registered)
        VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
        RETURNING *`,
        [username, hashedPassword, "", 0, email || null, name || null]
    );

    const user = result.rows[0] as User;
    await createSession(user.user_id);
    return user;
}

// Logout a user
export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/");
}

// Check if user is admin
export function isAdmin(user: User | null): boolean {
    return user?.is_admin === true;
}
