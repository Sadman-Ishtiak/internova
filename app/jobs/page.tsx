"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  ShieldCheck,
  Building2
} from "lucide-react";
import Countdown from "@/components/Countdown";

function JobsList() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  
  // Filters
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [locationFilter, setLocationFilter] = useState(searchParams.get("location") || "All Locations");
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get("category") || "all");
  const [industryFilter, setIndustryFilter] = useState(searchParams.get("industry") || "all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Debounce search to avoid too many requests
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 500);

    const handleRefresh = () => {
      fetchJobs();
    };

    window.addEventListener("refresh-data", handleRefresh);
    return () => {
      clearTimeout(delayDebounceFn);
      window.removeEventListener("refresh-data", handleRefresh);
    };
  }, [searchTerm, typeFilter, locationFilter, categoryFilter, industryFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (typeFilter !== "all") params.append("type", typeFilter);
      if (locationFilter !== "All Locations") params.append("location", locationFilter);
      if (categoryFilter !== "all") params.append("category", categoryFilter);
      if (industryFilter !== "all") params.append("industry", industryFilter);

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Failed to fetch jobs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!session) return alert("Please login to apply");

    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId })
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Application Successful! Your Skill Match Score: ${data.score.toFixed(1)}%`);
    } else {
      alert(data.error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* PAGE HEADER */}
      <section className="bg-slate-900 py-16 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Job List</h1>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
      </section>

      {/* SEARCH & FILTERS SECTION */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* SIDEBAR FILTERS */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                  <Filter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="font-bold text-lg">Filters</h2>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Keywords</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Job, company..." 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Job Type */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Job Type</label>
                    <div className="space-y-2">
                      {[
                        { id: 'all', label: 'All Types' },
                        { id: 'job', label: 'Full Time' },
                        { id: 'internship', label: 'Internship' }
                      ].map((type) => (
                        <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="type" 
                            checked={typeFilter === type.id}
                            onChange={() => setTypeFilter(type.id)}
                            className="w-4 h-4 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 border-border" 
                          />
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <select 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all appearance-none text-muted-foreground"
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                      >
                        <option>All Locations</option>
                        <option>Dhaka</option>
                        <option>Chattogram</option>
                        <option>Sylhet</option>
                        <option>Rajshahi</option>
                        <option>Khulna</option>
                        <option>Remote</option>
                      </select>
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Category</label>
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="all">All Categories</option>
                      <option value="IT & Software">IT & Software</option>
                      <option value="Finance & Accounting">Finance & Accounting</option>
                      <option value="Sales & Marketing">Sales & Marketing</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Design & Multimedia">Design & Multimedia</option>
                      <option value="Management">Management</option>
                      <option value="Legal">Legal</option>
                      <option value="Operations">Operations</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Industry</label>
                    <select 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-2 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      value={industryFilter}
                      onChange={(e) => setIndustryFilter(e.target.value)}
                    >
                      <option value="all">All Industries</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Construction">Construction</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Retail">Retail</option>
                      <option value="Telecommunications">Telecommunications</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => { setSearchTerm(""); setTypeFilter("all"); setLocationFilter("All Locations"); setCategoryFilter("all"); setIndustryFilter("all"); }}
                    className="w-full py-2 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>

            {/* JOB LISTINGS */}
            <div className="lg:col-span-3">
              
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground text-sm">
                  Showing <span className="text-foreground font-semibold">{jobs.length}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-indigo-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-muted-foreground border border-border hover:text-foreground"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-indigo-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-muted-foreground border border-border hover:text-foreground"}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                {loading ? (
                   <div className={viewMode === "grid" ? "contents" : "flex flex-col gap-4"}>
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl ${viewMode === "grid" ? "h-64" : "h-32"}`}></div>
                      ))}
                   </div>
                ) : jobs.length === 0 ? (
                  <div className={viewMode === "grid" ? "md:col-span-2 text-center py-20 bg-card rounded-xl border border-dashed border-border" : "text-center py-20 bg-card rounded-xl border border-dashed border-border"}>
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground">No opportunities found matching your criteria.</p>
                  </div>
                ) : (
                  jobs.map((job) => (
                    viewMode === "list" ? (
                      <div key={job._id} className="group bg-card border border-border rounded-xl p-5 hover:shadow-xl transition-all hover:border-indigo-200">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                          
                          {/* Company Logo */}
                          <div 
                            className="w-20 h-20 relative rounded-xl overflow-hidden bg-slate-50 flex-shrink-0 border border-border cursor-pointer"
                            onClick={() => window.location.href = `/jobs/${job._id}`}
                          >
                            <Image 
                              src={job.imageUrl || "/assets/images/featured-job/img-01.png"} 
                              alt="Company" 
                              fill 
                              className="object-cover"
                            />
                          </div>

                          {/* Job Details */}
                          <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                              <h3 className="text-xl font-bold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                <Link href={`/jobs/${job._id}`}>{job.title}</Link>
                              </h3>
                              <span className="hidden md:inline text-slate-300">|</span>
                              <div className="flex items-center gap-1.5 justify-center md:justify-start">
                                <span className="text-muted-foreground text-sm">{job.companyId?.name || "InternNova Company"}</span>
                                {job.companyId?.verified && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-green-500 dark:text-green-400 fill-green-50" />
                                )}
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-sm text-muted-foreground mt-3">
                              <span className="flex items-center gap-1.5">
                                <Briefcase className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> {job.category || "General"}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Building2 className="w-4 h-4 text-slate-500" /> {job.industry || "General"}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MapPin className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> {job.location || "Remote"}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <DollarSign className="w-4 h-4 text-green-500 dark:text-green-400" /> 
                                {job.salary?.min ? `${job.salary.min} - ${job.salary.max}` : "Competitive"}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4 text-orange-500" /> 
                                <Countdown deadline={job.deadline} />
                              </span>
                            </div>
                          </div>

                          {/* Tags & Action */}
                          <div className="flex flex-row md:flex-col items-center md:items-end gap-3 min-w-[140px] w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                              job.type === 'internship' 
                                ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                                : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                            }`}>
                              {job.type === 'internship' ? 'Internship' : 'Full Time'}
                            </span>
                            <button 
                               onClick={(e) => { e.stopPropagation(); handleApply(job._id); }}
                               className="flex-1 md:flex-none px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-none"
                            >
                              Apply Now
                            </button>
                          </div>

                        </div>
                      </div>
                    ) : (
                      <div key={job._id} className="group bg-card border border-border rounded-2xl p-6 hover:shadow-2xl transition-all hover:border-indigo-300 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-14 h-14 relative rounded-xl overflow-hidden border border-border bg-slate-50">
                            <Image 
                              src={job.imageUrl || "/assets/images/featured-job/img-01.png"} 
                              alt="Company" 
                              fill 
                              className="object-cover"
                            />
                          </div>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            job.type === 'internship' 
                              ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30' 
                              : 'bg-green-100 text-green-600 dark:bg-green-900/30'
                          }`}>
                            {job.type === 'internship' ? 'Internship' : 'Job'}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
                          <Link href={`/jobs/${job._id}`}>{job.title}</Link>
                        </h3>
                        <p className="text-muted-foreground text-sm mb-4">{job.companyId?.name || "InternNova Company"}</p>

                        <div className="space-y-2 mb-6 flex-grow">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Briefcase className="w-4 h-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                            <span className="truncate">{job.category || "General"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
                            <span className="truncate">{job.location || "Remote"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <DollarSign className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                            <span>{job.salary?.min ? `${job.salary.min} - ${job.salary.max}` : "Competitive"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            <Clock className="w-4 h-4 text-orange-500 flex-shrink-0" />
                            <Countdown deadline={job.deadline} />
                          </div>
                        </div>

                        <button 
                          onClick={() => handleApply(job._id)}
                          className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white text-sm font-bold rounded-xl transition-all border border-indigo-100 dark:border-indigo-900/30 group-hover:border-indigo-600 shadow-sm"
                        >
                          Apply For Job
                        </button>
                      </div>
                    )
                  ))
                )}
              </div>

              {/* PAGINATION PLACEHOLDER */}
              {!loading && jobs.length > 0 && (
                <div className="flex justify-center mt-12">
                   <nav className="flex items-center gap-2">
                      <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-indigo-600 hover:text-white transition-all disabled:opacity-50" disabled>&laquo;</button>
                      <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-md">1</button>
                      <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-indigo-600 hover:text-white transition-all">2</button>
                      <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-indigo-600 hover:text-white transition-all">3</button>
                      <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:bg-indigo-600 hover:text-white transition-all">&raquo;</button>
                   </nav>
                </div>
              )}

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <JobsList />
    </Suspense>
  );
}
