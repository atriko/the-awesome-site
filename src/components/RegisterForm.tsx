"use client";

import { useState, useTransition } from "react";
import { registerAction } from "@/actions/auth";
import Link from "next/link";
import styles from "./RegisterForm.module.scss";

export function RegisterForm() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        name: "",
        password: "",
    });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const getPasswordStrength = (password: string): number => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const strengthLabels = ["Weak", "Fair", "Good", "Strong", "Very Strong"];

    const handleSubmit = async (formDataObj: FormData) => {
        setError(null);
        setFieldErrors({});

        startTransition(async () => {
            try {
                await registerAction(formDataObj);
            } catch (err) {
                const message = (err as Error).message;
                if (message.includes("username")) {
                    setFieldErrors({ username: message });
                } else {
                    setError(message);
                }
            }
        });
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerCard}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Join Awesome Forum</h1>
                    <p className={styles.subtitle}>
                        Create an account to join the discussion
                    </p>
                </div>

                <form action={handleSubmit} className={styles.form}>
                    {/* Username Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="username" className={styles.label}>
                            Username <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>👤</span>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                required
                                value={formData.username}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        username: e.target.value,
                                    })
                                }
                                placeholder="Choose a username"
                                className={`${styles.input} ${fieldErrors.username ? styles.error : ""}`}
                                disabled={isPending}
                            />
                        </div>
                        {fieldErrors.username && (
                            <div className={styles.fieldError}>
                                {fieldErrors.username}
                            </div>
                        )}
                    </div>

                    {/* Email Field (Optional) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                            Email{" "}
                            <span className={styles.optional}>(optional)</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>📧</span>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        email: e.target.value,
                                    })
                                }
                                placeholder="your@email.com"
                                className={styles.input}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    {/* Name Field (Optional) */}
                    <div className={styles.formGroup}>
                        <label htmlFor="name" className={styles.label}>
                            Display Name{" "}
                            <span className={styles.optional}>(optional)</span>
                        </label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>🏷️</span>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="How you want to be seen"
                                className={styles.input}
                                disabled={isPending}
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className={styles.formGroup}>
                        <label htmlFor="password" className={styles.label}>
                            Password <span className={styles.required}>*</span>
                        </label>
                        <div className={styles.passwordWrapper}>
                            <div className={styles.inputWrapper}>
                                <span className={styles.inputIcon}>🔒</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    required
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    placeholder="Create a strong password"
                                    className={styles.input}
                                    disabled={isPending}
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className={styles.passwordToggle}
                                >
                                    {showPassword ? "🙈" : "👁️"}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Meter */}
                        {formData.password && (
                            <div className={styles.passwordStrength}>
                                <div className={styles.strengthMeter}>
                                    <div
                                        className={`${styles.strengthBar} ${styles[`strength-${passwordStrength}`]}`}
                                    />
                                </div>
                                <div
                                    className={`${styles.strengthLabel} ${styles[`strength-${passwordStrength}`]}`}
                                >
                                    {strengthLabels[passwordStrength]}
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className={styles.errorMessage}>{error}</div>
                    )}

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isPending}
                    >
                        {isPending ? "Creating account..." : "Register"}
                    </button>
                </form>

                <div className={styles.loginLink}>
                    Already have an account?{" "}
                    <Link href="/login">Login here</Link>
                </div>
            </div>
        </div>
    );
}
