import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/actions/auth";

export async function Header() {
    const user = await getCurrentUser();

    return (
        <header className="site-header">
        <div className="header-container">
        <div className="logo">
        <Link href="/">Awesome Forum</Link>
        </div>

        <nav className="main-nav">
        <Link href="/forum">Forum</Link>
        {user && (
            <Link href="/forum/new-thread">New Thread</Link>
        )}
        </nav>

        <div className="user-section">
        {user ? (
            <>
            <span className="username">Welcome, {user.username}</span>
            <form action={logoutAction}>
            <button type="submit" className="logout-btn">
            Logout
            </button>
            </form>
            </>
        ) : (
            <div className="auth-links">
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
            </div>
        )}
        </div>
        </div>
        </header>
    );
}
