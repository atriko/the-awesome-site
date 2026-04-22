"use server";

import { login, register, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    try {
        const user = await login(username, password);

        if (!user) {
            throw new Error("Invalid username or password");
        }

        redirect("/forum");
    } catch (error) {
        // You'll need client-side error handling for this
        throw new Error("Login failed: " + (error as Error).message);
    }
}

export async function registerAction(formData: FormData) {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    try {
        await register(username, password, email, name);
        redirect("/forum");
    } catch (error) {
        throw new Error("Registration failed: " + (error as Error).message);
    }
}

export async function logoutAction() {
    await logout();
}
