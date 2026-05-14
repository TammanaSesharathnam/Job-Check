import React, { useState } from "react";
import { Briefcase, Building2, MapPin, DollarSign, FileText, Send, CheckCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PostJob = () => {
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        company: "",
        location: "",
        salary: "",
        category: "Technology",
        description: ""
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (submitted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-6">
                <div className="max-w-md w-full text-center space-y-8 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold shadow-2xl shadow-gold/20">
                        <CheckCircle size={48} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-serif font-bold mb-4">Job Published!</h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Your job posting has been successfully created and is now visible to thousands of elite professionals.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 pt-4">
                        <Link to="/jobs" className="btn-gold py-4 rounded-xl font-bold shadow-xl">Browse All Jobs</Link>
                        <button onClick={() => setSubmitted(false)} className="text-gray-500 hover:text-white transition-colors font-medium">Post Another Job</button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-gold/5 blur-[100px] rounded-full z-0"></div>

            <div className="max-w-3xl mx-auto relative z-10">
                <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-gold transition-colors mb-12 font-medium">
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <div className="bg-dark-surface border border-white/10 rounded-[40px] p-8 md:p-14 shadow-2xl backdrop-blur-xl">
                    <div className="mb-12">
                        <h1 className="text-4xl font-serif font-bold mb-4">Hire Top <span className="text-gold">Talent</span></h1>
                        <p className="text-gray-400">Fill the form below to reach the industry's best candidates.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-300 ml-1">Job Title</label>
                                <div className="relative">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Senior Software Engineer"
                                        className="input-field pl-12"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-300 ml-1">Company Name</label>
                                <div className="relative">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. JobCheck Inc."
                                        className="input-field pl-12"
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-300 ml-1">Location</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. London, UK or Remote"
                                        className="input-field pl-12"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-gray-300 ml-1">Salary Range</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. $120k - $150k"
                                        className="input-field pl-12"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-300 ml-1">Category</label>
                            <select
                                className="input-field appearance-none cursor-pointer"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                <option>Technology</option>
                                <option>Design</option>
                                <option>Marketing</option>
                                <option>Finance</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-300 ml-1">Job Description</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-4 text-gray-500" size={18} />
                                <textarea
                                    className="input-field min-h-[200px] pl-12 pt-4 resize-none"
                                    required
                                    placeholder="Describe the role, responsibilities, and requirements..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-gold w-full py-5 rounded-2xl flex items-center justify-center gap-3 group mt-8 text-lg">
                            Publish Job Posting <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;
