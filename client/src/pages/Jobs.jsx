import React, { useState, useEffect } from "react";
import { Search, MapPin, Briefcase, Filter, ChevronRight, Building2, Star, Clock, IndianRupee, AlertTriangle, Flag } from "lucide-react";
import API from "../services/api";
import { Link, useSearchParams } from "react-router-dom";
import { MOCK_JOBS } from "../data/mockJobs";

const Jobs = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
    const [locationQuery, setLocationQuery] = useState(searchParams.get("l") || "");
    const [activeCategory, setActiveCategory] = useState("All Categories");

    // Sync state if URL params change (e.g. browser back)
    useEffect(() => {
        const q = searchParams.get("q") || "";
        const l = searchParams.get("l") || "";
        setSearchQuery(q);
        setLocationQuery(l);
    }, [searchParams]);

    const categories = ["All Categories", "Technology", "Design", "Marketing", "Finance", "Healthcare", "HR", "Management", "Engineering", "Sales", "Retail"];
    const popularCompanies = ["Google", "Meta", "Accenture", "Microsoft", "Amazon", "Netflix"];

    const filteredJobs = MOCK_JOBS.filter(job => {
        const matchesCategory = activeCategory === "All Categories" || job.category === activeCategory;
        const matchesSearch = !searchQuery ||
            job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLocation = !locationQuery ||
            job.location.toLowerCase().includes(locationQuery.toLowerCase());

        return matchesCategory && matchesSearch && matchesLocation;
    });

    // Recommendation logic when no exact matches
    const getRecommendations = () => {
        if (filteredJobs.length > 0) return [];

        return MOCK_JOBS.filter(job => {
            const companyMatch = searchQuery && job.company.toLowerCase().includes(searchQuery.toLowerCase());
            const locationMatch = locationQuery && job.location.toLowerCase().includes(locationQuery.toLowerCase());
            const categoryMatch = activeCategory !== "All Categories" && job.category === activeCategory;

            // Return true if it matches at least one "important" criterion
            return companyMatch || (locationMatch && categoryMatch);
        }).slice(0, 6); // Limit recommendations
    };

    const recommendations = getRecommendations();

    const handleSearchUpdate = (q, l) => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (l) params.set("l", l);
        setSearchParams(params);
    };

    const handleFlag = async (job) => {
        try {
            // We simulate a prediction log entry that is flagged
            // since mock jobs are not in the real JobLog table yet.
            // But if we wanted to make it real, we'd send the job details
            await API.post("/predict", { 
                description: `FLAGGED JOB: ${job.description || job.title}`,
                job_title: job.title,
                company: job.company
            });
            alert("Job has been flagged and reported to administrators for manual verification.");
        } catch (err) {
            console.error("Flag error:", err);
            alert("Failed to flag job. Please try again.");
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setLocationQuery("");
        setActiveCategory("All Categories");
        setSearchParams(new URLSearchParams());
    };

    return (
        <div className="min-h-screen pt-12 pb-24 px-6 md:px-12 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full z-0"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl font-serif font-bold mb-4">Discover Your <span className="text-gold">Future</span></h1>
                    <p className="text-gray-400 text-lg">Browse through high-quality opportunities from industry leaders.</p>
                </div>

                {/* Main Search Bar */}
                <div className="bg-dark-surface border border-white/10 p-2 rounded-[32px] shadow-2xl mb-8 flex flex-col md:flex-row gap-2 backdrop-blur-xl">
                    <div className="flex-[1.5] relative min-w-[200px]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gold" size={20} />
                        <input
                            type="text"
                            placeholder="Job title, company, or keywords"
                            className="w-full bg-white/5 border border-transparent focus:border-gold/30 rounded-[24px] py-5 pl-14 pr-4 outline-none transition-all text-white placeholder:text-gray-500"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                handleSearchUpdate(e.target.value, locationQuery);
                            }}
                        />
                    </div>
                    <div className="flex-1 relative min-w-[200px]">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-gold" size={20} />
                        <input
                            type="text"
                            placeholder="Location (City, Remote...)"
                            className="w-full bg-white/5 border border-transparent focus:border-gold/30 rounded-[24px] py-5 pl-14 pr-4 outline-none transition-all text-white placeholder:text-gray-500"
                            value={locationQuery}
                            onChange={(e) => {
                                setLocationQuery(e.target.value);
                                handleSearchUpdate(searchQuery, e.target.value);
                            }}
                        />
                    </div>
                </div>

                {/* Filters Row */}
                <div className="flex flex-col gap-6 mb-12">
                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">Categories:</span>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                                    ? "bg-gold text-dark shadow-lg shadow-gold/20"
                                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-wrap gap-2 items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mr-2">Companies:</span>
                        {popularCompanies.map(comp => (
                            <button
                                key={comp}
                                onClick={() => {
                                    setSearchQuery(comp);
                                    handleSearchUpdate(comp, locationQuery);
                                }}
                                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${searchQuery.toLowerCase() === comp.toLowerCase()
                                    ? "bg-gold/20 text-gold border-gold/30"
                                    : "bg-white/5 text-gray-400 border-white/5 hover:border-gold/30 hover:text-gold"
                                    } border`}
                            >
                                {comp}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Listings Section */}
                <div>
                    {filteredJobs.length > 0 ? (
                        <>
                            <div className="flex justify-between items-center mb-8 px-2 text-sm border-b border-white/5 pb-4">
                                <p className="text-gray-500"><span className="text-white font-bold">{filteredJobs.length}</span> positions found</p>
                                <div className="flex items-center gap-2 text-gray-400">
                                    <Filter size={16} />
                                    <span>Sort by: <span className="text-white font-medium cursor-pointer hover:text-gold transition-colors">Newest</span></span>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {filteredJobs.map(job => (
                                    <JobCard key={job.id} job={job} onFlag={handleFlag} />
                                ))}
                            </div>
                        </>
                    ) : recommendations.length > 0 ? (
                        <div className="py-12">
                            <div className="flex flex-col items-center text-center mb-16">
                                <div className="bg-gold/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 text-gold animate-pulse">
                                    <Star size={32} />
                                </div>
                                <h3 className="text-3xl font-serif font-bold mb-3 text-white">No exact matches in {locationQuery || 'this location'}</h3>
                                <p className="text-gray-400 max-w-md mb-8">We couldn't find {searchQuery} jobs matching all your filters. Here are some <span className="text-gold font-bold">Smart Matches</span> you might like:</p>
                                <button
                                    onClick={clearFilters}
                                    className="text-gold text-sm font-bold border-b border-gold/30 pb-1 hover:border-gold transition-all"
                                >
                                    Clear all filters to see everything
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="h-[1px] flex-1 bg-white/5"></div>
                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest px-4">Smart Matches for {searchQuery || 'you'}</span>
                                <div className="h-[1px] flex-1 bg-white/5"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {recommendations.map(job => (
                                    <JobCard key={job.id} job={job} onFlag={handleFlag} isRecommendation />
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="bg-white/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-600">
                                <Search size={32} />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No jobs matched your search</h3>
                            <p className="text-gray-400 mb-8">Try adjusting your filters or search keywords.</p>
                            <button onClick={clearFilters} className="btn-gold px-8 py-3 rounded-xl">View All Jobs</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const JobCard = ({ job, isRecommendation, onFlag }) => (
    <div className={`bg-dark-surface border ${isRecommendation ? 'border-gold/20' : 'border-white/10'} p-8 rounded-[32px] hover:border-gold/30 transition-all hover:shadow-2xl hover:shadow-gold/5 group relative overflow-hidden`}>
        {/* Flag Button */}
        <button 
            onClick={() => onFlag(job)}
            className="absolute top-6 left-6 p-2 bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-400 rounded-lg transition-all z-20"
            title="Report / Flag as Suspicious"
        >
            <Flag size={16} />
        </button>

        {/* Hover Effect highlight */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {isRecommendation && (
            <div className="absolute top-6 right-6 bg-gold/10 text-gold text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded border border-gold/20">
                Smart Match
            </div>
        )}

        <div className="flex justify-between items-start mb-6">
            <div className="flex gap-5">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-gold/20 transition-colors">
                    {React.cloneElement(job.logo, { size: 28 })}
                </div>
                <div>
                    <h3 className="text-2xl font-bold mb-1 group-hover:text-gold transition-colors">{job.title}</h3>
                    <p className="text-gray-400 font-medium">{job.company} • {job.location}</p>
                </div>
            </div>
            {!isRecommendation && (
                <div className="flex flex-col items-end gap-2">
                    <span className="bg-gold/10 text-gold px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">{job.type}</span>
                    <div className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <Clock size={12} /> {job.posted}
                    </div>
                </div>
            )}
        </div>

        <div className="mt-8 flex justify-between items-center pt-6 border-t border-white/5">
            <div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Estimated Reality</p>
                <p className="text-2xl font-bold flex items-center gap-1.5"><IndianRupee size={18} className="text-gold" /> {job.salary}</p>
            </div>
            <Link to={`/jobs/${job.id}`} className="btn-gold !bg-transparent border border-gold !text-gold hover:!bg-gold hover:!text-dark px-8 py-3 rounded-xl flex items-center gap-2">
                View Details <ChevronRight size={18} />
            </Link>
        </div>
    </div>
);

export default Jobs;
