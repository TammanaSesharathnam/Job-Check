import { useState } from "react";
import API from "../services/api";
import { ShieldCheck, Search, AlertTriangle, Briefcase, ArrowRight, Loader2 } from "lucide-react";

function Dashboard() {
    const [description, setDescription] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [company, setCompany] = useState("");
    const [result, setResult] = useState("");
    const [confidence, setConfidence] = useState("");
    const [loading, setLoading] = useState(false);

    const handleCheck = async () => {
        if (!description.trim()) return;
        setLoading(true);
        setResult("");
        setConfidence("");

        try {
            const response = await API.post("/predict", { 
                description,
                job_title: jobTitle,
                company: company
            });
            setResult(response.data.result);
            setConfidence(response.data.confidence);
        } catch (error) {
            console.error("Verification failed:", error);
            alert("Analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full z-0"></div>

            <div className="w-full max-w-4xl relative z-10">
                <div className="bg-dark-surface border border-white/10 rounded-[40px] p-8 md:p-14 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
                        <div>
                            <h1 className="text-4xl font-serif font-bold mb-3 flex items-center gap-3">
                                Job<span className="text-gold">Verify</span>
                                <ShieldCheck className="text-gold" size={32} />
                            </h1>
                            <p className="text-gray-400">Advanced AI analysis to detect fake job postings.</p>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold">
                                <Briefcase size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Status</p>
                                <p className="text-sm font-medium">Active Account</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Job Title</label>
                            <input
                                type="text"
                                className="input-field py-4 px-4 text-sm"
                                placeholder="e.g. Senior Software Engineer"
                                value={jobTitle}
                                onChange={(e) => setJobTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Company Name</label>
                            <input
                                type="text"
                                className="input-field py-4 px-4 text-sm"
                                placeholder="e.g. Google"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300 ml-1">Job Description</label>
                            <div className="relative">
                                <textarea
                                    className="input-field min-h-[250px] pt-4 pl-4 resize-none text-sm leading-relaxed"
                                    placeholder="Paste the full job description here to analyze its legitimacy..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleCheck}
                            disabled={loading || !description.trim()}
                            className="btn-gold w-full py-5 rounded-2xl flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin" size={20} /> Analyzing Pattern...
                                </>
                            ) : (
                                <>
                                    Verify Job Legitimacy <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </div>

                    {result && (
                        <div className={`mt-12 p-8 rounded-3xl border animate-in fade-in slide-in-from-bottom-4 duration-500 ${result === "Real Job"
                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                            : "bg-red-500/10 border-red-500/20 text-red-400"
                            }`}>
                            <div className="flex items-center gap-4 mb-4">
                                {result === "Real Job" ? (
                                    <ShieldCheck size={36} />
                                ) : (
                                    <AlertTriangle size={36} />
                                )}
                                <h3 className="text-2xl font-bold uppercase tracking-tight">
                                    Analysis Result: {result}
                                </h3>
                            </div>

                            {confidence && (
                                <div className="flex items-end gap-3 mb-5">
                                    <span className="text-6xl font-serif font-black leading-none">
                                        {confidence}
                                    </span>
                                    <span className="text-2xl font-bold uppercase tracking-widest opacity-80 mb-1">
                                        Confidence
                                    </span>
                                </div>
                            )}
                            <p className="text-gray-300 leading-relaxed font-medium">
                                {result === "Real Job"
                                    ? "Our AI models have verified this job posting. It exhibits patterns consistent with legitimate industry opportunities. You are safe to proceed with your application."
                                    : "Warning: High risk detected. This posting shows significant markers common in fraudulent job advertisements. We strongly advise against sharing personal information or proceeding further."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
