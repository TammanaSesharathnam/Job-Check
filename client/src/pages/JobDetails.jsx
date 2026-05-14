import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { MOCK_JOBS } from "../data/mockJobs";
import { ArrowLeft, MapPin, Clock, IndianRupee, Briefcase, CheckCircle2, ShieldCheck, Share2, Bookmark, Loader2, Sparkles } from "lucide-react";

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const job = MOCK_JOBS.find(j => j.id === id);

    const [isApplying, setIsApplying] = useState(false);
    const [isApplied, setIsApplied] = useState(false);

    if (!job) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-6">
                <h2 className="text-3xl font-bold">Job Not Found</h2>
                <Link to="/jobs" className="btn-gold px-8 py-3 rounded-xl">Back to Job Listings</Link>
            </div>
        );
    }

    const handleApply = () => {
        setIsApplying(true);
        // Simulate a mock application process
        setTimeout(() => {
            setIsApplying(false);
            setIsApplied(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 2000);
    };

    if (isApplied) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-6">
                <div className="max-w-xl w-full text-center space-y-10 animate-in zoom-in duration-500">
                    <div className="relative inline-block">
                        <div className="w-32 h-32 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold shadow-[0_0_50px_rgba(212,175,55,0.3)] border border-gold/20">
                            <CheckCircle2 size={64} strokeWidth={1.5} />
                        </div>
                        <Sparkles className="absolute -top-4 -right-4 text-gold animate-bounce" size={32} />
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl font-serif font-bold tracking-tight">Application <span className="text-gold">Sent!</span></h1>
                        <p className="text-gray-400 text-xl leading-relaxed max-w-md mx-auto">
                            Your professional profile for <span className="text-white font-bold">{job.title}</span> at <span className="text-white font-bold">{job.company}</span> has been successfully delivered.
                        </p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-sm">
                        <p className="text-sm text-gray-400 font-medium">
                            <span className="text-gold">What's next?</span> Our partners typically review elite applications within 48 hours. Keep an eye on your dashboard for updates.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                        <Link to="/jobs" className="btn-gold px-10 py-4 rounded-xl font-bold shadow-xl shadow-gold/20">
                            Explore More Jobs
                        </Link>
                        <Link to="/dashboard" className="px-10 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-bold transition-all">
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full z-0"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 blur-[100px] rounded-full z-0"></div>

            <div className="max-w-5xl mx-auto relative z-10">
                {/* Navigation Header */}
                <div className="flex justify-between items-center mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-500 hover:text-gold transition-colors font-medium group"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Search
                    </button>
                    <div className="flex gap-4">
                        <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-gray-400 hover:text-white transition-all">
                            <Share2 size={20} />
                        </button>
                        <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 text-gray-400 hover:text-gold transition-all">
                            <Bookmark size={20} />
                        </button>
                    </div>
                </div>

                {/* Hero Section */}
                <div className="bg-dark-surface border border-white/10 rounded-[40px] p-8 md:p-14 mb-8 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-10 pb-10 border-b border-white/5">
                        <div className="flex gap-6">
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 shadow-inner">
                                {React.cloneElement(job.logo, { size: 36 })}
                            </div>
                            <div>
                                <h1 className="text-4xl font-serif font-bold mb-2">{job.title}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-gray-400 font-medium">
                                    <span className="text-gold">{job.company}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5"><MapPin size={16} /> {job.location}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1.5"><Clock size={16} /> {job.posted}</span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-auto flex flex-col gap-2">
                            <button
                                onClick={handleApply}
                                disabled={isApplying}
                                className="btn-gold px-12 py-4 rounded-xl font-bold shadow-xl shadow-gold/20 flex items-center justify-center gap-2 text-lg disabled:opacity-70 disabled:cursor-not-allowed group transition-all"
                            >
                                {isApplying ? (
                                    <>Processing Application <Loader2 className="animate-spin" size={20} /></>
                                ) : (
                                    <>Apply This Position <ShieldCheck size={20} className="group-hover:scale-110 transition-transform" /></>
                                )}
                            </button>
                            <p className="text-xs text-center text-gray-500 font-medium tracking-tight">Verified by JobCheck Protection</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Offer Salary</p>
                            <p className="text-2xl font-bold text-white flex items-center gap-2"><IndianRupee size={20} className="text-gold" /> {job.salary}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Job Category</p>
                            <p className="text-lg font-medium text-white">{job.category}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Job Type</p>
                            <p className="text-lg font-medium text-white">{job.type}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-2">Experience</p>
                            <p className="text-lg font-medium text-white">5-8 Years</p>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <section className="bg-dark-surface border border-white/10 rounded-[32px] p-8 md:p-10">
                            <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                                Job Description <Briefcase size={22} className="text-gold" />
                            </h2>
                            <p className="text-gray-400 leading-relaxed text-lg">
                                {job.description}
                            </p>
                        </section>

                        <section className="bg-dark-surface border border-white/10 rounded-[32px] p-8 md:p-10">
                            <h2 className="text-2xl font-serif font-bold mb-6">Requirements</h2>
                            <ul className="space-y-4">
                                {job.requirements.map((req, idx) => (
                                    <li key={idx} className="flex gap-4 items-start text-gray-400 text-lg">
                                        <CheckCircle2 size={24} className="text-gold mt-0.5 shrink-0" />
                                        <span>{req}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    <div className="space-y-8">
                        <section className="bg-dark-surface border border-white/10 rounded-[32px] p-8">
                            <h2 className="text-xl font-serif font-bold mb-6 text-gold">Key Benefits</h2>
                            <ul className="space-y-5">
                                {job.benefits.map((benefit, idx) => (
                                    <li key={idx} className="flex gap-3 items-center text-gray-300 font-medium">
                                        <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                                        {benefit}
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section className="bg-gold p-8 rounded-[32px] text-dark relative overflow-hidden group">
                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/20 blur-2xl group-hover:scale-150 transition-transform"></div>
                            <h3 className="text-2xl font-bold mb-4 relative z-10 font-serif">Want to analyze this job?</h3>
                            <p className="text-dark/80 mb-6 relative z-10 font-medium">
                                Use our AI verification tool to check if this posting is legitimate.
                            </p>
                            <Link to="/dashboard" className="bg-dark text-white w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 relative z-10 hover:scale-[1.02] transition-transform">
                                Go to AI Dashboard
                            </Link>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;
