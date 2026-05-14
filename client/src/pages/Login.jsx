import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import API from "../services/api";

export default function Login() {
    const [searchParams] = useSearchParams();
    const roleParam = searchParams.get("role");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);
        try {
            const response = await API.post("/login", { email, password });
            if (response.status === 200) {
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("username", response.data.username);
                localStorage.setItem("email", response.data.email);
                localStorage.setItem("fullname", response.data.fullname || "");
                localStorage.setItem("is_admin", response.data.is_admin ? "true" : "false");
                if (response.data.is_admin) {
                    navigate("/admin-control");
                } else {
                    navigate("/dashboard");
                }
            }
        } catch (error) {
            if (!error.response) {
                setErrorMsg("Cannot connect to server. Please ensure the backend is running on port 5000.");
            } else if (error.response.status === 401) {
                setErrorMsg("Invalid credentials. Please check your email/username and password.");
            } else {
                setErrorMsg(error.response.data?.error || "An unexpected error occurred.");
            }
            console.error("Login Error:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 blur-[100px] rounded-full z-0"></div>

            <div className="w-full max-w-md relative z-10">
                <div className="bg-dark-surface border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-serif font-bold mb-3">
                            {roleParam === "admin" ? "Admin Login" : "Welcome Back"}
                        </h1>
                        <p className="text-gray-400">
                            {roleParam === "admin" ? "Access the system control panel" : "Sign in to your career portal"}
                        </p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6" autoComplete="off">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email or Username</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    autoComplete="username"
                                    type="text"
                                    placeholder="Enter email or username"
                                    className="input-field pl-12"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-medium text-gray-300">Password</label>
                                <a href="#" className="text-xs text-gold hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    autoComplete="new-password"
                                    type="password"
                                    placeholder="••••••••"
                                    className="input-field pl-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                                <p className="text-sm text-red-400 font-medium">{errorMsg}</p>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-gold w-full py-4 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed">
                            {loading ? "Signing in..." : <>{"Sign In"} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                        </button>
                    </form>

                    <p className="mt-10 text-center text-gray-400 text-sm">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-gold font-bold hover:underline">User Registration</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
