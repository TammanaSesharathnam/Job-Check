import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import { User, Mail, Lock, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";

export default function Register() {
    const [searchParams] = useSearchParams();
    const roleParam = searchParams.get("role");

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAdmin, setIsAdmin] = useState(roleParam === "admin");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setSuccessMsg("");
        setLoading(true);
        try {
            const response = await API.post("/register", {
                name,
                username,
                email,
                password,
                is_admin: isAdmin
            });
            if (response.status === 201 || response.status === 200) {
                setSuccessMsg(isAdmin ? "Admin account created! Redirecting to login..." : "User registered successfully! Redirecting to login...");
                setTimeout(() => navigate("/login"), 1500);
            }
        } catch (error) {
            if (!error.response) {
                setErrorMsg("Cannot connect to server. Please ensure the backend is running.");
            } else {
                setErrorMsg(error.response.data?.error || "Registration failed. Please try again.");
            }
            console.error("Registration Error:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-[90vh] flex items-center justify-center px-6 py-20 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full z-0"></div>

            <div className="w-full max-w-lg relative z-10">
                <div className="bg-dark-surface border border-white/10 rounded-[40px] p-8 md:p-14 shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-serif font-bold mb-4">
                            {roleParam === "admin" ? "Admin Registration" : "User Registration"}
                        </h1>
                        <p className="text-gray-400">Join the elite network of industry professionals</p>
                    </div>

                    <form onSubmit={handleRegister} className="space-y-6" autoComplete="off">
                        {/* Dummy hidden fields to trick Chrome's persistent autofill */}
                        <input type="text" style={{ display: 'none' }} name="fake-user-name" />
                        <input type="password" style={{ display: 'none' }} name="fake-password" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="input-field pl-12"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        placeholder="johndoe"
                                        className="input-field pl-12"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="email"
                                    placeholder="name@gmail.com"
                                    autoComplete="new-password"
                                    className="input-field pl-12"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="input-field pl-12"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 ml-1 italic">Must be at least 8 characters long with a mix of letters and numbers.</p>
                        </div>

                        <div className="flex flex-col gap-3 py-2">
                            <div className="flex items-start gap-3">
                                <input type="checkbox" className="mt-1 accent-gold" required id="terms" />
                                <label htmlFor="terms" className="text-xs text-gray-400 leading-relaxed">
                                    I agree to the <a href="#" className="text-gold hover:underline">Terms of Service</a> and <a href="#" className="text-gold hover:underline">Privacy Policy</a>.
                                </label>
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                                <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={16} />
                                <p className="text-sm text-red-400 font-medium">{errorMsg}</p>
                            </div>
                        )}

                        {successMsg && (
                            <div className="flex items-start gap-3 bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
                                <CheckCircle className="text-green-400 shrink-0 mt-0.5" size={16} />
                                <p className="text-sm text-green-400 font-medium">{successMsg}</p>
                            </div>
                        )}

                        <button type="submit" disabled={loading} className="btn-gold w-full py-4 rounded-2xl flex items-center justify-center gap-2 group mt-4 disabled:opacity-60 disabled:cursor-not-allowed">
                            {loading ? "Registering..." : <><span>User Registration</span> <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                        </button>
                    </form>

                    <p className="mt-12 text-center text-gray-400 text-sm">
                        Already have an account?{" "}
                        <Link to="/login" className="text-gold font-bold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
