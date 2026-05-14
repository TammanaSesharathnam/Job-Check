import React, { useState } from "react";
import { Search, MapPin, Briefcase, TrendingUp, Users, Building2, ChevronRight, Star } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { MOCK_JOBS } from "../data/mockJobs";

const Home = () => {
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (title) params.append("q", title);
        if (location) params.append("l", location);
        navigate(`/jobs?${params.toString()}`);
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative h-[85vh] flex items-center justify-center overflow-hidden px-6">
                <div className="absolute inset-0 bg-gradient-to-b from-gold/5 to-transparent z-0"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/10 blur-[120px] rounded-full z-0"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-gold text-sm font-medium mb-8 animate-bounce">
                        <TrendingUp size={16} /> Now 500+ New Job Openings
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
                        Find Your Next <span className="text-gold">Dream Job</span> With Precision
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        The recruitment platform connecting elite talent with top-tier companies worldwide.
                    </p>

                    <div className="bg-dark-surface p-4 rounded-2xl border border-white/10 shadow-2xl max-w-4xl mx-auto backdrop-blur-xl">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Job title, keywords, or company"
                                    className="w-full bg-white/5 border border-transparent focus:border-gold/50 rounded-xl py-4 pl-12 pr-4 outline-none transition-all text-white"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 relative">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="City, state, or zip code"
                                    className="w-full bg-white/5 border border-transparent focus:border-gold/50 rounded-xl py-4 pl-12 pr-4 outline-none transition-all text-white"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleSearch}
                                className="btn-gold !rounded-xl px-12 py-4 flex items-center justify-center gap-2"
                            >
                                Search Jobs
                            </button>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-gray-500 text-sm font-medium uppercase tracking-widest">
                        <span>Popular: UI/UX Design</span>
                        <span>Frontend Development</span>
                        <span>Product Management</span>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-24 bg-dark-surface border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                        <div className="space-y-2">
                            <h3 className="text-4xl font-serif font-bold text-gold">15k+</h3>
                            <p className="text-gray-400 font-medium">Active Jobs</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-serif font-bold text-gold">10k+</h3>
                            <p className="text-gray-400 font-medium">Hired Candidates</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-serif font-bold text-gold">8k+</h3>
                            <p className="text-gray-400 font-medium">Top Companies</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-serif font-bold text-gold">98%</h3>
                            <p className="text-gray-400 font-medium">Success Rate</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-end mb-16">
                        <div>
                            <h2 className="text-4xl font-serif font-bold mb-4">Explore by Category</h2>
                            <p className="text-gray-400 text-lg">Discover roles tailored to your expertise.</p>
                        </div>
                        <Link to="/jobs" className="text-gold flex items-center gap-2 font-semibold hover:gap-3 transition-all">
                            View All Categories <ChevronRight size={20} />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { title: "Technology", jobs: 1200, icon: <Briefcase /> },
                            { title: "Design", jobs: 450, icon: <Star /> },
                            { title: "Marketing", jobs: 800, icon: <Users /> },
                            { title: "Finance", jobs: 300, icon: <Building2 /> },
                        ].map((cat, idx) => (
                            <div key={idx} className="bg-dark-surface border border-white/5 p-8 rounded-2xl hover:border-gold/30 transition-all cursor-pointer group">
                                <div className="bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl text-gold mb-6 group-hover:bg-gold group-hover:text-dark transition-all">
                                    {cat.icon}
                                </div>
                                <h4 className="text-xl font-bold mb-2">{cat.title}</h4>
                                <p className="text-gray-500">{cat.jobs} Open Positions</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Jobs Section */}
            <section className="py-32 px-6 bg-dark-surface/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-serif font-bold mb-4">Featured Opportunities</h2>
                        <p className="text-gray-400 text-lg">Hand-picked roles from industry leaders.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {MOCK_JOBS.slice(0, 4).map((job) => (
                            <div key={job.id} className="bg-dark-surface border border-white/10 p-8 rounded-3xl hover:shadow-gold/5 hover:shadow-2xl transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-4">
                                        <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center">
                                            {job.logo ? React.cloneElement(job.logo, { className: "text-gold" }) : <Building2 className="text-gold" />}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold group-hover:text-gold transition-colors">{job.title}</h4>
                                            <p className="text-gray-500 font-medium">{job.company} • {job.location}</p>
                                        </div>
                                    </div>
                                    <span className="bg-gold/10 text-gold px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">{job.type}</span>
                                </div>
                                <div className="flex gap-3 mb-8">
                                    {(job.tags || job.requirements.slice(0, 3).map(r => r.split(' ').slice(-1)[0])).map((tag, idx) => (
                                        <span key={idx} className="bg-white/5 text-gray-400 px-3 py-1 rounded-lg text-xs font-medium">{tag}</span>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                    <span className="text-2xl font-bold">{job.salary} <span className="text-sm text-gray-500 font-normal">/ year</span></span>
                                    <Link to={`/jobs/${job.id}`} className="text-gold font-bold hover:underline">Apply Now</Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <Link to="/jobs" className="btn-gold !bg-transparent border border-gold !text-gold hover:!bg-gold hover:!text-dark px-12 py-4">
                            Explore All 15,000+ Jobs
                        </Link>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-gold rounded-[60px] p-8 md:p-20 relative overflow-hidden shadow-2xl shadow-gold/20">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2"></div>

                        <div className="relative z-10 text-center mb-16">
                            <h2 className="text-4xl md:text-6xl font-serif font-extrabold text-dark mb-4 tracking-tight">
                                Get Started Today
                            </h2>
                            <p className="text-dark/80 text-lg font-medium max-w-2xl mx-auto italic">
                                Choose your portal to begin your journey with JobCheck.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10 text-dark">
                            {/* User Portal */}
                            <div className="bg-white/20 backdrop-blur-md rounded-[40px] p-10 border border-white/30 hover:bg-white/30 transition-all flex flex-col justify-between group">
                                <div>
                                    <div className="w-16 h-16 bg-dark rounded-2xl mb-8 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                                        <Users size={32} />
                                    </div>
                                    <h3 className="text-3xl font-serif font-bold mb-4">Job Seeker</h3>
                                    <p className="text-dark/70 font-medium mb-12">Analyze jobs for authenticity and find your next elite role in technology or design.</p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Link to="/register?role=user" className="bg-dark text-white px-10 py-5 rounded-2xl font-black text-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                                        User Registration
                                    </Link>
                                    <Link to="/login?role=user" className="bg-transparent border-2 border-dark text-dark px-10 py-4 rounded-2xl font-black text-center hover:bg-dark hover:text-white transition-all">
                                        User Sign In
                                    </Link>
                                </div>
                            </div>

                            {/* Admin Portal */}
                            <div className="bg-dark/5 backdrop-blur-md rounded-[40px] p-10 border border-dark/10 hover:bg-dark/10 transition-all flex flex-col justify-between group">
                                <div>
                                    <div className="w-16 h-16 bg-dark rounded-2xl mb-8 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                                        <Building2 size={32} />
                                    </div>
                                    <h3 className="text-3xl font-serif font-bold mb-4">Administrator</h3>
                                    <p className="text-dark/70 font-medium mb-12">Manage the platform, monitor job analysis audit logs, and oversee user feedback.</p>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <Link to="/register?role=admin" className="bg-dark text-white px-10 py-5 rounded-2xl font-black text-center shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                                        Admin Registration
                                    </Link>
                                    <Link to="/login?role=admin" className="bg-transparent border-2 border-dark text-dark px-10 py-4 rounded-2xl font-black text-center hover:bg-dark hover:text-white transition-all">
                                        Admin Sign In
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
