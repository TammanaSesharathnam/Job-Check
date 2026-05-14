import { Link, useNavigate } from "react-router-dom";
import { Briefcase, LogIn, UserPlus, Menu, X, LayoutDashboard, User, LogOut, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
        setIsOpen(false);
    };

    return (
        <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-gold p-1.5 rounded-lg group-hover:scale-110 transition-transform">
                        <Briefcase className="text-dark w-6 h-6" />
                    </div>
                    <span className="text-2xl font-serif font-bold tracking-tight">
                        Job<span className="text-gold">Check</span>
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/" className="hover:text-gold transition-colors font-medium">Home</Link>

                    {token ? (
                        <>
                            <Link to="/jobs" className="hover:text-gold transition-colors font-medium">Find Jobs</Link>
                            {localStorage.getItem("is_admin") !== "true" && (
                                <Link to="/feedback" className="hover:text-gold transition-colors font-medium">Feedback</Link>
                            )}
                            {localStorage.getItem("is_admin") !== "true" && (
                                <Link to="/dashboard" className="flex items-center gap-2 hover:text-gold transition-colors font-medium">
                                    <ShieldCheck size={18} /> Verify Job
                                </Link>
                            )}
                            {localStorage.getItem("is_admin") === "true" && (
                                <Link to="/admin-control" className="flex items-center gap-2 bg-gold text-dark px-4 py-2 rounded-xl font-black text-sm hover:bg-white hover:text-dark transition-all shadow-lg shadow-gold/20 animate-pulse-slow">
                                    <LayoutDashboard size={18} /> Admin Control
                                </Link>
                            )}
                            <Link to="/profile" className="flex items-center gap-2 hover:text-gold transition-colors font-medium">
                                <User size={18} /> Profile
                            </Link>
                            <div className="h-6 w-px bg-white/20"></div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-medium"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="h-6 w-px bg-white/20"></div>
                            <Link to="/login" className="flex items-center gap-2 hover:text-gold transition-colors font-medium">
                                <LogIn size={18} /> Login
                            </Link>

                            {/* Join Now Dropdown */}
                            <div className="relative group/join">
                                <button className="btn-gold flex items-center gap-2 !py-2 cursor-default">
                                    <UserPlus size={18} /> Join Now
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute top-full right-0 mt-2 w-64 opacity-0 invisible group-hover/join:opacity-100 group-hover/join:visible transition-all duration-300 transform translate-y-2 group-hover/join:translate-y-0 z-[60]">
                                    <div className="bg-dark-surface border border-white/10 rounded-2xl shadow-2xl p-2 backdrop-blur-xl">
                                        <Link
                                            to="/register?role=user"
                                            className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group/item"
                                        >
                                            <div className="bg-gold/10 p-2 rounded-lg text-gold group-hover/item:bg-gold group-hover/item:text-dark transition-all">
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-white">Join as Job Seeker</p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">Find elite career opportunities</p>
                                            </div>
                                        </Link>

                                        <div className="h-px bg-white/5 my-1 mx-2"></div>

                                        <Link
                                            to="/register?role=admin"
                                            className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors group/item"
                                        >
                                            <div className="bg-gold/10 p-2 rounded-lg text-gold group-hover/item:bg-gold group-hover/item:text-dark transition-all">
                                                <Briefcase size={18} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-white">Join as Administrator</p>
                                                <p className="text-[10px] text-gray-500 mt-0.5">Manage talent & platform stats</p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-dark-surface border-b border-white/10 p-6 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
                    <Link to="/" className="text-lg py-2 border-b border-white/5" onClick={() => setIsOpen(false)}>Home</Link>

                    {token ? (
                        <>
                            <Link to="/jobs" className="text-lg py-2 border-b border-white/5" onClick={() => setIsOpen(false)}>Find Jobs</Link>
                            {localStorage.getItem("is_admin") !== "true" && (
                                <Link to="/feedback" className="text-lg py-2 border-b border-white/5" onClick={() => setIsOpen(false)}>Feedback</Link>
                            )}
                            {localStorage.getItem("is_admin") !== "true" && (
                                <Link to="/dashboard" className="text-lg py-2 border-b border-white/5" onClick={() => setIsOpen(false)}>Verify Job</Link>
                            )}
                            {localStorage.getItem("is_admin") === "true" && (
                                <Link to="/admin-control" className="text-lg py-3 border-b-2 border-gold text-gold font-black flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                    <LayoutDashboard size={20} /> Admin Control
                                </Link>
                            )}
                            <Link to="/profile" className="text-lg py-2 border-b border-white/5" onClick={() => setIsOpen(false)}>Profile</Link>
                            <button
                                onClick={handleLogout}
                                className="text-lg py-2 text-left text-red-400 font-medium"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-lg py-2 border-b border-white/5" onClick={() => setIsOpen(false)}>Login</Link>
                            <div className="flex flex-col gap-2 pt-2">
                                <Link to="/register?role=user" className="btn-gold text-center py-3" onClick={() => setIsOpen(false)}>Join as Job Seeker</Link>
                                <Link to="/register?role=admin" className="bg-white/5 text-white border border-white/10 text-center py-3 rounded-xl font-bold hover:bg-white/10 transition-all" onClick={() => setIsOpen(false)}>Join as Administrator</Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
