"use client";

import { loginAction } from "@/actions/auth";
import { useActionState } from "react";

export function LoginForm() {
    const [error, formAction, isPending] = useActionState(
        async (_: string | null, formData: FormData) => {
            try {
                await loginAction(formData);
                return null;
            } catch (error) {
                return (error as Error).message;
            }
        },
        null
    );

    return (
        <form action={formAction}>
        <div>
        <label htmlFor="username">Username</label>
        <input type="text" id="username" name="username" required />
        </div>

        <div>
        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" required />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Login"}
        </button>
        </form>
    );
}
