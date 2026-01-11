"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  MapPin, 
  Building2, 
  ChevronRight,
  Filter,
  Briefcase,
  ExternalLink,
  List,
  LayoutGrid,
  ShieldCheck,
  Star
} from "lucide-react";

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  // Filters
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("all");
  const [location, setLocation] = useState("");
  const [hiringFilter, setHiringFilter] = useState("any"); // any, internship, job
  const [verifiedFilter, setVerifiedFilter] = useState(false);
  const [featuredFilter, setFeaturedFilter] = useState(false);
  const [sizeFilter, setSizeFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCompanies();
    }, 500);

    const handleRefresh = () => {
      fetchCompanies();
    };

    window.addEventListener("refresh-data", handleRefresh);
    return () => {
      clearTimeout(delayDebounceFn);
      window.removeEventListener("refresh-data", handleRefresh);
    };
  }, [search, industry, location, hiringFilter, verifiedFilter, featuredFilter, sizeFilter, typeFilter]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (industry !== "all") params.append("industry", industry);
      if (location) params.append("location", location);
      if (hiringFilter !== "any") params.append("hiring", hiringFilter);
      if (verifiedFilter) params.append("verified", "true");
      if (featuredFilter) params.append("featured", "true");
      if (sizeFilter !== "all") params.append("size", sizeFilter);
      if (typeFilter !== "all") params.append("type", typeFilter);

      const res = await fetch(`/api/companies?${params.toString()}`);
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error("Failed to fetch companies", error);
    } finally {
      setLoading(false);
    }
  };

  const industries = [
    "Tech", "Finance", "Healthcare", "Education", "Marketing", "Service", "Other"
  ];

  return (
    <div className="min-h-screen bg-background">
      
      {/* PAGE HEADER */}
      <section className="bg-slate-900 py-16 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Company List</h1>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </section>

      {/* SEARCH & FILTERS SECTION */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* SIDEBAR FILTERS */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                  <Filter className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-bold text-lg">Filters</h2>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Company Name</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Search companies..." 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Industry */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Industry</label>
                    <select 
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                    >
                      <option value="all">All Industries</option>
                      {industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="e.g. Dhaka, Remote" 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Hiring Status */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Hiring For</label>
                    <div className="space-y-2">
                      {[
                        { id: 'any', label: 'Anything' },
                        { id: 'internship', label: 'Internships' },
                        { id: 'job', label: 'Entry-Level Jobs' }
                      ].map((type) => (
                        <label key={type.id} className="flex items-center gap-3 cursor-pointer group">
                          <input 
                            type="radio" 
                            name="hiring" 
                            checked={hiringFilter === type.id}
                            onChange={() => setHiringFilter(type.id)}
                            className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-border" 
                          />
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">{type.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Company Size */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Company Size</label>
                    <select 
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={sizeFilter}
                      onChange={(e) => setSizeFilter(e.target.value)}
                    >
                      <option value="all">All Sizes</option>
                      <option value="1-10">1-10 Employees</option>
                      <option value="11-50">11-50 Employees</option>
                      <option value="51-200">51-200 Employees</option>
                      <option value="201-500">201-500 Employees</option>
                      <option value="501-1000">501-1000 Employees</option>
                      <option value="1000+">1000+ Employees</option>
                    </select>
                  </div>

                  {/* Company Type */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Company Type</label>
                    <select 
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                    >
                      <option value="all">All Types</option>
                      <option value="Privately Held">Privately Held</option>
                      <option value="Public Company">Public Company</option>
                      <option value="Startup">Startup</option>
                      <option value="Non-Profit">Non-Profit</option>
                      <option value="Government Agency">Government Agency</option>
                    </select>
                  </div>

                  {/* Verification & Featured */}
                  <div className="space-y-3 pt-2">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={verifiedFilter}
                        onChange={(e) => setVerifiedFilter(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-border" 
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-green-500" /> Verified Only
                      </span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={featuredFilter}
                        onChange={(e) => setFeaturedFilter(e.target.checked)}
                        className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-border" 
                      />
                      <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500" /> Featured Only
                      </span>
                    </label>
                  </div>

                  <button 
                    onClick={() => { 
                      setSearch(""); 
                      setIndustry("all"); 
                      setLocation(""); 
                      setHiringFilter("any");
                      setVerifiedFilter(false);
                      setFeaturedFilter(false);
                      setSizeFilter("all");
                      setTypeFilter("all");
                    }}
                    className="w-full py-2 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>

            {/* COMPANY LISTINGS */}
            <div className="lg:col-span-3">
              
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground text-sm">
                  Showing <span className="text-foreground font-semibold">{companies.length}</span> companies
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
                ) : companies.length === 0 ? (
                  <div className={viewMode === "grid" ? "md:col-span-2 text-center py-20 bg-card rounded-xl border border-dashed border-border" : "text-center py-20 bg-card rounded-xl border border-dashed border-border"}>
                    <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground">No companies found matching your criteria.</p>
                  </div>
                ) : (
                  companies.map((company) => (
                    viewMode === "list" ? (
                      <div 
                        key={company._id} 
                        className="group bg-card border border-border rounded-xl p-5 hover:shadow-xl transition-all hover:border-indigo-200 flex flex-col md:flex-row items-center gap-6 cursor-pointer"
                        onClick={() => router.push(`/company/${company._id}`)}
                      >
                        <div className="w-20 h-20 relative rounded-xl overflow-hidden border border-border flex-shrink-0 bg-slate-50">
                           <Image 
                             src={company.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`} 
                             alt={company.name} 
                             fill 
                             unoptimized
                             className="object-cover"
                           />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="font-bold text-xl mb-1 group-hover:text-indigo-600 transition-colors">{company.name}</h3>
                          <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                            <span className="text-indigo-600 dark:text-indigo-400 font-medium">{company.industry}</span>
                            {company.contact?.location && (
                              <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4 text-indigo-500 dark:text-indigo-400" /> {company.contact.location}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4 text-green-500 dark:text-green-400" /> {company.stats.total} Openings
                            </span>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                           <button className="px-6 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-bold rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all">
                              View Profile
                           </button>
                        </div>
                      </div>
                    ) : (
                      <div 
                        key={company._id} 
                        className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:border-indigo-300 flex flex-col cursor-pointer"
                        onClick={() => router.push(`/company/${company._id}`)}
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 relative rounded-lg overflow-hidden border border-border flex-shrink-0 bg-slate-50">
                               <Image 
                                 src={company.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`} 
                                 alt={company.name} 
                                 fill 
                                 unoptimized
                                 className="object-cover"
                               />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1 group-hover:text-indigo-600 transition-colors">{company.name}</h3>
                              <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-2">{company.industry}</p>
                              {company.contact?.location && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-indigo-500 dark:text-indigo-400" /> {company.contact.location}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-border">
                             <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider">
                                <span className="text-muted-foreground">Open Positions</span>
                                {company.stats.total > 0 ? (
                                  <span className="text-green-600 dark:text-green-400 px-2 py-0.5 bg-green-50 dark:bg-green-900/20 rounded">
                                    {company.stats.total} Active
                                  </span>
                                ) : (
                                  <span className="text-slate-400">0 Active</span>
                                )}
                             </div>
                             <div className="flex gap-3 mt-2">
                                {company.stats.internships > 0 && (
                                  <span className="text-[10px] px-2 py-1 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded flex items-center gap-1">
                                    <Briefcase className="w-2.5 h-2.5" /> {company.stats.internships} Internships
                                  </span>
                                )}
                                {company.stats.jobs > 0 && (
                                  <span className="text-[10px] px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded flex items-center gap-1">
                                    <Briefcase className="w-2.5 h-2.5" /> {company.stats.jobs} Jobs
                                  </span>
                                )}
                             </div>
                          </div>
                        </div>

                        <div className="mt-auto bg-slate-50 dark:bg-slate-800/5 p-4 flex justify-between items-center group-hover:bg-indigo-600 transition-colors">
                          <span className="text-xs font-bold group-hover:text-white transition-colors">View Profile</span>
                          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    )
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}