import { RegisterForm } from "@/components/RegisterForm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
    // If user is already logged in, redirect to forum
    const user = await getCurrentUser();
    if (user) {
        redirect("/forum");
    }

    return <RegisterForm />;
}
