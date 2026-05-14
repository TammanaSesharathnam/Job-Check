import React from "react";
import { User, Mail, ShieldCheck, Briefcase } from "lucide-react";

export default function Profile() {
    const username = localStorage.getItem("username");
    const email = localStorage.getItem("email");
    const fullname = localStorage.getItem("fullname");

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full z-0"></div>

            <div className="w-full max-w-2xl relative z-10">
                <div className="bg-dark-surface border border-white/10 rounded-[40px] p-8 md:p-14 shadow-2xl backdrop-blur-xl">
                    <div className="text-center mb-12">
                        <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center text-gold mx-auto mb-6 border border-gold/20">
                            <User size={48} />
                        </div>
                        <h1 className="text-4xl font-serif font-bold mb-3 uppercase tracking-tight">
                            {localStorage.getItem("is_admin") === "true" ? "Admin" : "User"} <span className="text-gold">Profile</span>
                        </h1>
                        <p className="text-gray-400">Manage your account details</p>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-6 group hover:border-gold/30 transition-all">
                            <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-dark transition-all">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Full Name</p>
                                <p className="text-xl font-medium">{fullname && fullname !== "null" ? fullname : "N/A"}</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-6 group hover:border-gold/30 transition-all">
                            <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-dark transition-all">
                                <User size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Username</p>
                                <p className="text-xl font-medium">{username || "N/A"}</p>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-6 group hover:border-gold/30 transition-all">
                            <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-dark transition-all">
                                <Mail size={24} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Email Address</p>
                                <p className="text-xl font-medium">{email || "Please re-login to view"}</p>
                            </div>
                        </div>

                        {localStorage.getItem("is_admin") === "true" ? (
                            <div className="mt-12 flex flex-col gap-4">
                                <div className="flex items-center gap-4 p-6 bg-gold/10 border border-gold/30 rounded-2xl shadow-lg shadow-gold/5">
                                    <ShieldCheck className="text-gold" size={24} />
                                    <div>
                                        <p className="text-sm font-black text-gold uppercase tracking-widest">Administrator Account</p>
                                        <p className="text-xs text-gray-400">You have full administrative control over the platform.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => window.location.href = "/admin-control"}
                                    className="btn-gold w-full py-4 rounded-2xl font-black text-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all"
                                >
                                    Go to Admin Control Panel
                                </button>
                            </div>
                        ) : (
                            <div className="mt-12 flex items-center gap-4 p-6 bg-gold/5 border border-gold/10 rounded-2xl">
                                <ShieldCheck className="text-gold" size={24} />
                                <div>
                                    <p className="text-sm font-bold text-white">Account Verified</p>
                                    <p className="text-xs text-gray-400">You have full access to JobCheck features.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
