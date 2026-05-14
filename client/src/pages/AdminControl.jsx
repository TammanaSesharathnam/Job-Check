import { useState, useEffect } from "react";
import API from "../services/api";
import {
    Users, MessageSquare, ShieldCheck, Activity,
    Trash2, UserPlus, Clock, Search, ChevronRight, Loader2, AlertCircle,
    Zap, TrendingUp, BarChart3, Download, RefreshCcw, Filter, FileText, CheckCircle
} from "lucide-react";
import AdminAnalytics from "../components/AdminAnalytics";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function AdminControl() {
    const [stats, setStats] = useState({ total_users: 0, total_feedback: 0, total_checks: 0 });
    const [users, setUsers] = useState([]);
    const [feedback, setFeedback] = useState([]);
    const [activities, setActivities] = useState([]);
    const [activeTab, setActiveTab] = useState("overview");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [retraining, setRetraining] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterResult, setFilterResult] = useState("all");
    const [toast, setToast] = useState(null); // { type: 'success'|'error', msg: string }

    const showToast = (type, msg) => {
        setToast({ type, msg });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchAdminData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch each endpoint independently so one failure doesn't crash everything
            const [statsRes, usersRes] = await Promise.all([
                API.get("/admin/stats"),
                API.get("/admin/users"),
            ]);
            setStats(statsRes.data);
            setUsers(usersRes.data);

            try {
                const feedbackRes = await API.get("/admin/feedback");
                setFeedback(feedbackRes.data);
            } catch (fbErr) {
                console.warn("Feedback endpoint unavailable:", fbErr.message);
                setFeedback([]);
            }

            try {
                const activityRes = await API.get("/admin/activity");
                setActivities(activityRes.data);
            } catch (actErr) {
                console.warn("Activity endpoint unavailable:", actErr.message);
                setActivities([]);
            }
        } catch (err) {
            console.error("Admin fetch error:", err);
            const errMsg = err.response?.data?.error || err.response?.data?.msg || err.message || "Failed to load administrative data";
            const status = err.response?.status ? ` (Status: ${err.response.status})` : " (Network Error)";
            setError(`${errMsg}${status}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    const handleDeleteUser = async (userId, name) => {
        if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        try {
            await API.delete(`/admin/users/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
            setActivities(activities.filter(a => a.username !== name));
            showToast("success", `User "${name}" deleted successfully.`);
        } catch (err) {
            showToast("error", err.response?.data?.error || "Failed to delete user");
        }
    };

    const handleDeleteLog = async (logId, jobTitle) => {
        if (!window.confirm(`Delete log entry "${jobTitle || 'this entry'}"?`)) return;
        try {
            await API.delete(`/admin/logs/${logId}`);
            setActivities(activities.filter(a => a.id !== logId));
            showToast("success", "Log entry deleted.");
        } catch (err) {
            showToast("error", err.response?.data?.error || "Failed to delete log entry");
        }
    };

    const handleRetrain = async () => {
        setRetraining(true);
        try {
            const res = await API.post("/admin/retrain");
            showToast("success", res.data.message || "Neural Core Synchronized");
        } catch (err) {
            showToast("error", err.response?.data?.error || "Retraining failed");
        } finally {
            setRetraining(false);
        }
    };

    const handleExportCSV = (data, filename) => {
        const headers = Object.keys(data[0]).join(",");
        const rows = data.map(obj => Object.values(obj).map(v => `"${v}"`).join(","));
        const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportPDF = (data, title) => {
        if (!data || data.length === 0) {
            showToast("error", "No data available to export.");
            return;
        }
        try {
            const doc = new jsPDF();

            // Title
            doc.setFontSize(20);
            doc.setTextColor(212, 175, 55);
            doc.text(title, 14, 22);

            // Subtitle
            doc.setFontSize(11);
            doc.setTextColor(100);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);

            // Table columns
            const tableColumn = ["User", "Job Title", "Company", "Result", "Confidence", "Date"];
            const tableRows = data.map(act => [
                `@${act.username || "N/A"}`,
                act.job_title || "Untitled Analysis",
                act.company || "N/A",
                act.result || "N/A",
                act.confidence || "N/A",
                act.timestamp ? act.timestamp.split(" ")[0] : "N/A"
            ]);

            autoTable(doc, {
                head: [tableColumn],
                body: tableRows,
                startY: 40,
                theme: "grid",
                headStyles: { fillColor: [212, 175, 55], textColor: [255, 255, 255], fontStyle: "bold" },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                styles: { fontSize: 9 },
                margin: { top: 40 }
            });

            const fileName = `${title.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}.pdf`;
            doc.save(fileName);
            showToast("success", `PDF exported: ${fileName}`);
        } catch (e) {
            console.error("PDF export error:", e);
            showToast("error", "PDF export failed: " + e.message);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <Loader2 className="animate-spin text-gold mx-auto" size={48} />
                    <p className="text-gray-400 animate-pulse font-medium">Securing connection to administrative core...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-6 text-center">
                <div className="bg-red-500/10 border border-red-500/20 p-12 rounded-[40px] max-w-xl">
                    <AlertCircle className="text-red-500 mx-auto mb-6" size={64} />
                    <h2 className="text-3xl font-serif font-bold text-white mb-4">Access Restricted</h2>
                    <p className="text-gray-400 mb-8">{error}</p>
                    <button onClick={() => window.location.href = '/'} className="btn-gold px-10 py-4 rounded-xl">Back to Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 blur-[120px] rounded-full z-0"></div>

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[999] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border animate-in slide-in-from-top-4 duration-300 ${
                    toast.type === "success"
                        ? "bg-green-500/10 border-green-500/30 text-green-400"
                        : "bg-red-500/10 border-red-500/30 text-red-400"
                }`}>
                    {toast.type === "success"
                        ? <CheckCircle size={18} className="shrink-0" />
                        : <AlertCircle size={18} className="shrink-0" />}
                    <p className="text-sm font-semibold max-w-xs">{toast.msg}</p>
                </div>
            )}

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 bg-gold/10 text-gold text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                            System Control Panel
                        </div>
                        <h1 className="text-5xl font-serif font-bold">Admin <span className="text-gold">Control</span></h1>
                    </div>

                    <div className="flex bg-dark-surface border border-white/10 p-1.5 rounded-2xl">
                        {["overview", "users", "feedback", "activities"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all capitalize ${activeTab === tab ? "bg-gold text-dark shadow-lg shadow-gold/20" : "text-gray-500 hover:text-white"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {activeTab === "overview" && (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { title: "Total Members", value: stats.total_users, icon: <Users />, color: "gold", trend: "+12%" },
                                { title: "Job Analysis Logs", value: stats.total_checks, icon: <BarChart3 />, color: "gold", trend: "+24%" },
                                { title: "Feedback Entries", value: stats.total_feedback, icon: <MessageSquare />, color: "gold", trend: "Stable" },
                                { title: "System Uptime", value: "99.9%", icon: <Zap />, color: "gold", trend: "Perfect" }
                            ].map((s, i) => (
                                <div key={i} className="bg-dark-surface border border-white/10 p-8 rounded-[32px] hover:border-gold/30 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                        {s.icon}
                                    </div>
                                    <div className="bg-white/5 w-12 h-12 flex items-center justify-center rounded-xl text-gold mb-6 group-hover:bg-gold group-hover:text-dark transition-all">
                                        {s.icon}
                                    </div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">{s.title}</p>
                                    <div className="flex items-baseline gap-3">
                                        <h3 className="text-3xl font-serif font-bold">{s.value}</h3>
                                        <span className="text-[10px] text-green-500 font-bold">{s.trend}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Enhanced Analytics Section */}
                        <AdminAnalytics activities={activities} />

                        {/* Intelligence & Actions Section */}
                        <div className="bg-dark-surface border border-white/10 p-10 rounded-[48px] relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-gold/5 blur-[80px] rounded-full -mr-20 -mt-20"></div>
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                                <div className="flex-1">
                                    <h3 className="text-3xl font-serif font-bold mb-4">Tactical <span className="text-gold">Intelligence</span></h3>
                                    <p className="text-gray-400 font-medium leading-relaxed mb-8 max-w-lg">
                                        The AI model continuously learns from analyzed patterns. Use the retraining engine to update internal logic with the latest verified data points.
                                    </p>
                                    <div className="flex flex-wrap gap-4">
                                        <button 
                                            onClick={handleRetrain} 
                                            disabled={retraining}
                                            className="btn-gold !px-8 !py-4 rounded-2xl flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {retraining ? <Loader2 className="animate-spin" size={18} /> : <RefreshCcw size={18} />}
                                            {retraining ? "Retraining..." : "Retrain Engine"}
                                        </button>
                                        <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
                                            <TrendingUp className="text-gold" size={20} />
                                            <span className="text-sm font-bold text-white">AI Confidence: {(98.2 + Math.random()).toFixed(1)}%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
                                    <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 backdrop-blur-sm">
                                        <h4 className="text-4xl font-serif font-bold text-gold mb-2">{stats.total_checks}</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Total Analyses</p>
                                    </div>
                                    <div className="bg-white/5 p-8 rounded-[32px] border border-white/5 backdrop-blur-sm">
                                        <h4 className="text-4xl font-serif font-bold text-white mb-2">1.2s</h4>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Processing Speed</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Job Analysis Logs Section */}
                        <div className="bg-dark-surface border border-white/10 rounded-[40px] overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5">
                                <div>
                                    <h3 className="text-2xl font-serif font-bold">Recent Job Analysis Logs</h3>
                                    <p className="text-xs text-gray-500 mt-1">Audit trail of all recent job legitimacy verifications</p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                        <input 
                                            type="text" 
                                            placeholder="Search title/company..." 
                                            className="bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-gold/50 w-full md:w-64"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <select 
                                        className="bg-black/40 border border-white/10 rounded-xl py-2 px-4 text-sm outline-none focus:border-gold/50 text-gray-400"
                                        value={filterResult}
                                        onChange={(e) => setFilterResult(e.target.value)}
                                    >
                                        <option value="all">All Results</option>
                                        <option value="Fake Job">Fake Jobs</option>
                                        <option value="Real Job">Real Jobs</option>
                                    </select>
                                    <button 
                                        onClick={() => handleExportCSV(activities, "analysis_logs")}
                                        className="p-2.5 bg-white/5 hover:bg-gold hover:text-dark border border-white/10 rounded-xl transition-all text-gray-400"
                                        title="Export CSV"
                                    >
                                        <Download size={18} />
                                    </button>
                                    <button 
                                        onClick={() => handleExportPDF(activities, "Recent Job Analysis Logs")}
                                        className="p-2.5 bg-white/5 hover:bg-gold hover:text-dark border border-white/10 rounded-xl transition-all text-gray-400"
                                        title="Export PDF"
                                    >
                                        <FileText size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-gray-400">
                                        <tr>
                                            <th className="px-8 py-6">User</th>
                                            <th className="px-8 py-6">Job Title</th>
                                            <th className="px-8 py-6">Result</th>
                                            <th className="px-8 py-6">Confidence</th>
                                            <th className="px-8 py-6">Date</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {activities
                                            .filter(act => {
                                                const matchesSearch = (act.job_title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                                    (act.company || "").toLowerCase().includes(searchQuery.toLowerCase());
                                                const matchesFilter = filterResult === "all" || act.result === filterResult;
                                                return matchesSearch && matchesFilter;
                                            })
                                            .slice(0, 5)
                                            .map((act, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors group">
                                                <td className="px-8 py-6 text-gold font-bold">@{act.username}</td>
                                                <td className="px-8 py-6">
                                                    <div className="font-bold text-white">{act.job_title || "Untitled Analysis"}</div>
                                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest">{act.company || "Unknown Company"}</div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${act.result === "Real Job" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                                                        {act.result}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-sm font-bold text-white">{act.confidence}</td>
                                                <td className="px-8 py-6 text-sm text-gray-400">{act.timestamp.split(' ')[0]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Flagged Job Posts Section */}
                        <div className="bg-dark-surface border border-white/10 rounded-[40px] overflow-hidden">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-red-500/5">
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-red-400">Flagged Job Posts</h3>
                                    <p className="text-xs text-gray-500 mt-1">Suspected fraudulent postings reported by users or system</p>
                                </div>
                                <button onClick={() => handleExportPDF(activities.filter(a => a.is_flagged || a.result === "Fake Job"), "Flagged Job Posts Report")} className="btn-gold !py-2.5 !px-6 rounded-xl text-xs flex items-center gap-2">
                                    <FileText size={16} /> Export PDF Report
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-gray-400">
                                        <tr>
                                            <th className="px-8 py-6">Job Title</th>
                                            <th className="px-8 py-6">Company</th>
                                            <th className="px-8 py-6">Result</th>
                                            <th className="px-8 py-6">Confidence</th>
                                            <th className="px-8 py-6">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {activities.filter(a => a.is_flagged || a.result === "Fake Job").slice(0, 5).map((act, i) => (
                                            <tr key={i} className="hover:bg-white/5 transition-colors group text-sm">
                                                <td className="px-8 py-6 font-bold text-white">{act.job_title || "Suspected Fraud"}</td>
                                                <td className="px-8 py-6 text-gray-400">{act.company || "N/A"}</td>
                                                <td className="px-8 py-6">
                                                    <span className="text-red-500 font-black uppercase text-[10px] bg-red-500/10 px-2 py-1 rounded">Fake</span>
                                                </td>
                                                <td className="px-8 py-6 font-bold">{act.confidence}</td>
                                                <td className="px-8 py-6 text-right">
                                                    <div className="flex gap-2">
                                                        <button className="text-[10px] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg font-bold">Details</button>
                                                        <button
                                                            onClick={() => handleDeleteLog(act.id, act.job_title)}
                                                            className="text-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/30 px-3 py-1.5 rounded-lg font-bold"
                                                        >Delete</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {activities.filter(a => a.is_flagged || a.result === "Fake Job").length === 0 && (
                                            <tr>
                                                <td colSpan="5" className="px-8 py-12 text-center text-gray-500 italic">No flagged posts at this time.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "users" && (
                    <div className="bg-dark-surface border border-white/10 rounded-[40px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="text-2xl font-serif font-bold">User Directory</h3>
                            <div className="relative">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                <input 
                                    type="text" 
                                    placeholder="Search users..." 
                                    className="bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm outline-none focus:border-gold/50" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-gray-400">
                                    <tr>
                                        <th className="px-8 py-6">Identity</th>
                                        <th className="px-8 py-6">Username</th>
                                        <th className="px-8 py-6">Privileges</th>
                                        <th className="px-8 py-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {users
                                        .filter(u => 
                                            u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                            (u.fullname || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            u.email.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((u, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold">{u.fullname?.[0] || u.username[0]}</div>
                                                    <div>
                                                        <div className="font-bold text-white group-hover:text-gold transition-colors">{u.fullname || u.username}</div>
                                                        <div className="text-xs text-gray-500">{u.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-sm text-gray-400 font-medium">@{u.username}</td>
                                            <td className="px-8 py-6">
                                                {u.is_admin ? (
                                                    <span className="bg-gold/10 text-gold px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Administrator</span>
                                                ) : (
                                                    <span className="bg-white/5 text-gray-500 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Verified Member</span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <button 
                                                    onClick={() => handleDeleteUser(u.id, u.fullname || u.username)}
                                                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "feedback" && (
                    <div className="grid grid-cols-1 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {feedback.map((f, i) => (
                            <div key={i} className="bg-dark-surface border border-white/10 p-8 rounded-[32px] hover:border-gold/30 transition-all flex flex-col md:flex-row gap-8 items-start">
                                <div className="w-16 h-16 bg-white/5 rounded-full shrink-0 flex items-center justify-center text-2xl text-gold font-serif font-bold border border-white/5 shadow-inner">
                                    {f.name[0]}
                                </div>
                                <div className="flex-1">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-white/5">
                                        <div>
                                            <h4 className="text-xl font-bold mb-1">{f.subject}</h4>
                                            <p className="text-sm font-medium text-gold">{f.name} <span className="text-gray-500 mx-2">•</span> {f.email}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest">
                                            <Clock size={14} /> {f.created_at}
                                        </div>
                                    </div>
                                    <p className="text-gray-400 leading-relaxed font-medium italic">"{f.message}"</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === "activities" && (
                    <div className="bg-dark-surface border border-white/10 rounded-[40px] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/5">
                            <h3 className="text-2xl font-serif font-bold">Activity Audit Log</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-white/5 text-[10px] uppercase font-black tracking-widest text-gray-400">
                                    <tr>
                                        <th className="px-8 py-6">User</th>
                                        <th className="px-8 py-6">Job Description</th>
                                        <th className="px-8 py-6">Result</th>
                                        <th className="px-8 py-6">Confidence</th>
                                        <th className="px-8 py-6">Timestamp</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {activities.map((act, i) => (
                                        <tr key={i} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <span className="text-gold font-bold">@{act.username}</span>
                                            </td>
                                            <td className="px-8 py-6 max-w-xs">
                                                <p className="text-xs text-gray-400 line-clamp-2 italic">"{act.description}"</p>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${act.result === "Real Job" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                                    }`}>
                                                    {act.result}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-white">{act.confidence}</td>
                                            <td className="px-8 py-6 text-xs text-gray-500">{act.timestamp}</td>
                                        </tr>
                                    ))}
                                    {activities.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-8 py-12 text-center text-gray-500 italic">No job analysis activity recorded yet.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
