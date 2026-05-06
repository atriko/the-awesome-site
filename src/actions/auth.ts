"use server";

import { login, register, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    const user = await login(username, password);

    if (!user) {
        throw new Error("Invalid username or password");
    }

    // Do NOT wrap redirect in try/catch
    redirect("/forum");
}

export async function registerAction(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = (formData.get("email") as string) || undefined;
    const name = (formData.get("name") as string) || undefined;

    // Validate required fields
    if (!username || username.length < 3) {
        throw new Error("Username must be at least 3 characters");
    }

    if (!password || password.length < 6) {
        throw new Error("Password must be at least 6 characters");
    }

    await register(username, password, email, name);

    // Do NOT wrap redirect in try/catch
    redirect("/forum");
}

export async function logoutAction() {
    await logout();
    // logout() already calls redirect("/")
}
