import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        // Validate user input
        if (!email.trim() || !password.trim()) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            // Send whatever email/password the user entered
            const result = await authService.login({
                email: email.trim(),
                password: password,
            });

            console.log("Login successful:", result);

            // Login successful
            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error);

            const message =
                error.response?.data?.message ||
                "Invalid email or password.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center px-4 py-8">

            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">

                <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl animate-pulse" />

                <div
                    className="absolute top-1/2 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "1s" }}
                />

                <div
                    className="absolute -bottom-40 left-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse"
                    style={{ animationDelay: "2s" }}
                />

                {/* Background Grid */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage:
                            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                        backgroundSize: "50px 50px",
                    }}
                />
            </div>

            {/* Main Container */}
            <div className="relative z-10 w-full max-w-5xl">

                <div className="grid lg:grid-cols-2 bg-white/[0.06] backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

                    {/* ================= LEFT SIDE ================= */}
                    <div className="hidden lg:flex relative flex-col justify-center p-12 xl:p-16 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-transparent">

                        <div className="absolute top-10 right-10 w-20 h-20 border border-blue-400/20 rounded-full" />

                        <div className="absolute bottom-16 left-10 w-12 h-12 border border-cyan-400/20 rounded-full" />

                        {/* Logo */}
                        <div className="flex items-center gap-3 mb-10">

                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30">

                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 21a8 8 0 0116 0"
                                    />
                                </svg>

                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    Employee Portal
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Management System
                                </p>
                            </div>

                        </div>

                        {/* Welcome Text */}
                        <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">

                            Welcome

                            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                                Back!
                            </span>

                        </h1>

                        <p className="mt-6 text-slate-400 text-lg leading-relaxed max-w-md">
                            Manage your employee workspace, access important
                            information and stay connected with your team.
                        </p>

                        {/* Features */}
                        <div className="mt-10 space-y-5">

                            {/* Feature 1 */}
                            <div className="flex items-center gap-4">

                                <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-400/10 flex items-center justify-center">

                                    <svg
                                        className="w-5 h-5 text-blue-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 12l2 2 4-4"
                                        />

                                        <circle
                                            cx="12"
                                            cy="12"
                                            r="9"
                                        />
                                    </svg>

                                </div>

                                <span className="text-slate-300">
                                    Secure employee management
                                </span>

                            </div>

                            {/* Feature 2 */}
                            <div className="flex items-center gap-4">

                                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-400/10 flex items-center justify-center">

                                    <svg
                                        className="w-5 h-5 text-cyan-400"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M17 20h5v-2a4 4 0 00-4-4h-1M9 20H4v-2a4 4 0 014-4h1m4-8a4 4 0 11-8 0 4 4 0 018 0zm6 0a3 3 0 11-6 0"
                                        />
                                    </svg>

                                </div>

                                <span className="text-slate-300">
                                    Connect with your organization
                                </span>

                            </div>

                        </div>

                    </div>

                    {/* ================= RIGHT SIDE ================= */}
                    <div className="p-7 sm:p-10 lg:p-12 xl:p-14 bg-slate-900/60">

                        {/* Mobile Logo */}
                        <div className="flex lg:hidden items-center gap-3 mb-8">

                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">

                                <svg
                                    className="w-6 h-6 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        cx="12"
                                        cy="7"
                                        r="4"
                                    />

                                    <path d="M4 21a8 8 0 0116 0" />
                                </svg>

                            </div>

                            <div>
                                <h2 className="font-bold text-white">
                                    Employee Portal
                                </h2>

                                <p className="text-xs text-slate-400">
                                    Management System
                                </p>
                            </div>

                        </div>

                        {/* Header */}
                        <div className="mb-8">

                            <p className="text-blue-400 text-sm font-semibold mb-2">
                                SECURE LOGIN
                            </p>

                            <h2 className="text-3xl sm:text-4xl font-bold text-white">
                                Sign in to your account
                            </h2>

                            <p className="mt-3 text-slate-400">
                                Enter your credentials to continue.
                            </p>

                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300">

                                <svg
                                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                    />

                                    <path d="M12 8v4M12 16h.01" />
                                </svg>

                                <span className="text-sm">
                                    {error}
                                </span>

                            </div>
                        )}

                        {/* ================= LOGIN FORM ================= */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-6"
                        >

                            {/* EMAIL */}
                            <div>

                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Email Address
                                </label>

                                <div className="relative">

                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                        placeholder="Enter your email"
                                        autoComplete="email"
                                        required
                                        className="w-full pl-4 pr-4 py-3.5 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-600"
                                    />

                                </div>

                            </div>

                            {/* PASSWORD */}
                            <div>

                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        required
                                        className="w-full pl-4 pr-20 py-3.5 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 outline-none transition-all duration-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 hover:border-slate-600"
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 px-4 flex items-center text-sm text-slate-400 hover:text-blue-400"
                                    >
                                        {showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </button>

                                </div>

                            </div>

                            {/* LOGIN BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold shadow-lg shadow-blue-600/20 transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
                            >

                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">

                                        <svg
                                            className="w-5 h-5 animate-spin"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-30"
                                                cx="12"
                                                cy="12"
                                                r="9"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                            />

                                            <path
                                                d="M21 12a9 9 0 00-9-9"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                            />
                                        </svg>

                                        Signing in...

                                    </span>
                                ) : (
                                    "Sign In"
                                )}

                            </button>

                        </form>

                        {/* Footer */}
                        <div className="mt-8 pt-6 border-t border-slate-800 text-center">

                            <p className="text-xs text-slate-500">
                                Protected employee access • Secure login
                            </p>

                        </div>

                    </div>
                </div>

                {/* Bottom */}
                <p className="text-center text-xs text-slate-600 mt-6">
                    © {new Date().getFullYear()} Employee Management System
                </p>

            </div>
        </div>
    );
};

export default Login;