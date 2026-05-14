import { useState } from "react";
import API from "../services/api";
import { Send, MessageSquare, Mail, User, CheckCircle2, Loader2 } from "lucide-react";

export default function Feedback() {
    const [formData, setFormData] = useState({
        name: localStorage.getItem("fullname") || "",
        email: localStorage.getItem("email") || "",
        subject: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post("/feedback", formData);
            setSubmitted(true);
            setFormData({ ...formData, subject: "", message: "" });
        } catch (error) {
            console.error("Feedback error:", error);
            alert("Failed to send feedback. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-6">
                <div className="text-center space-y-6 animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto text-gold border border-gold/20">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold">Feedback Sent!</h2>
                    <p className="text-gray-400 max-w-sm mx-auto">Thank you for your valuable input. We're constantly improving JobCheck based on your thoughts.</p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="btn-gold px-8 py-3 rounded-xl"
                    >
                        Send Another
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full z-0"></div>

            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Share Your <span className="text-gold">Thoughts</span></h1>
                    <p className="text-gray-400 text-lg">Help us build the most transparent recruitment platform in the world.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-8">
                        <div className="bg-dark-surface border border-white/10 p-8 rounded-[32px]">
                            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                                <MessageSquare className="text-gold" size={20} /> Why Feedback?
                            </h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Your feedback directly impacts our AI models and user experience. Whether it's a bug report or a feature request, we listen to every word.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                                    Improve AI Accuracy
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                                    Better User Experience
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-300">
                                    <div className="w-1.5 h-1.5 bg-gold rounded-full"></div>
                                    Report Suspicious Jobs
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-dark-surface border border-white/10 p-8 md:p-12 rounded-[40px] shadow-2xl space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Your Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="text"
                                            className="input-field pl-12"
                                            placeholder="Enter your name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400 ml-1">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                                        <input
                                            type="email"
                                            className="input-field pl-12"
                                            placeholder="name@example.com"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Subject</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="What is this regarding?"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400 ml-1">Message</label>
                                <textarea
                                    className="input-field min-h-[150px] py-4 resize-none"
                                    placeholder="Tell us what's on your mind..."
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-gold w-full py-4 rounded-xl flex items-center justify-center gap-3 group disabled:opacity-50"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} /> Sending...
                                    </>
                                ) : (
                                    <>
                                        Submit Feedback <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
