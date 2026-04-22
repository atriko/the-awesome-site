import { LoginForm } from "@/components/LoginForm";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const user = await getCurrentUser();
    if (user) {
        redirect("/forum");
    }

    return <LoginForm />;
}
