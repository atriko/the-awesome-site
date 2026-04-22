"use client";

import { useActionState } from "react";
import { loginAction } from "@/actions/auth";
import Link from "next/link";

export function LoginForm() {
    const [error, formAction, isPending] = useActionState(
        async (_: string | null, formData: FormData) => {
            try {
                await loginAction(formData);
                return null;
            } catch (err) {
                return (err as Error).message;
            }
        },
        null
    );

    return (
        <div className="login-container">
        <div className="login-card">
        <h1>Login to Awesome Forum</h1>
        <p className="subtitle">
        Welcome back! Please login to your account
        </p>

        <form action={formAction} className="login-form">
        <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
        type="text"
        id="username"
        name="username"
        required
        autoComplete="username"
        placeholder="Enter your username"
        disabled={isPending}
        />
        </div>

        <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
        type="password"
        id="password"
        name="password"
        required
        autoComplete="current-password"
        placeholder="Enter your password"
        disabled={isPending}
        />
        </div>

        {error && (
            <div className="error-message">
            {error}
            </div>
        )}

        <button
        type="submit"
        className="login-button"
        disabled={isPending}
        >
        {isPending ? "Logging in..." : "Login"}
        </button>
        </form>

        <div className="register-link">
        Don't have an account?{" "}
        <Link href="/register">Register here</Link>
        </div>
        </div>
        </div>
    );
}
