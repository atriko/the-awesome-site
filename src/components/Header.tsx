import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { logout } from "@/actions/auth";
import { logoutAction } from "@/actions/auth";
import styles from "./Header.module.scss";

export async function Header() {
    const user = await getCurrentUser();

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/">Awesome Forum</Link>
                </div>

                <nav className={styles.nav}>
                    <Link href="/forum">Forum</Link>
                    {user && <Link href="/forum/new-thread">New Thread</Link>}
                </nav>

                <div className={styles.userSection}>
                    {user ? (
                        <>
                            <Link
                                href={`/profile/${user.username}`}
                                className={styles.profileLink}
                            >
                                Profile
                            </Link>
                            <span className={styles.username}>
                                Welcome, {user.username}
                            </span>
                            <form action={logoutAction}>
                                <button
                                    type="submit"
                                    className={styles.logoutBtn}
                                >
                                    Logout
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className={styles.authLinks}>
                            <Link href="/login">Login</Link>
                            <Link href="/register">Register</Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
