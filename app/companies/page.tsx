"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CompaniesPage() {
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("all");
  const [location, setLocation] = useState("");
  const [hiringFilter, setHiringFilter] = useState("any"); // any, internship, job

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCompanies();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search, industry, location, hiringFilter]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (industry !== "all") params.append("industry", industry);
      if (location) params.append("location", location);
      if (hiringFilter !== "any") params.append("hiring", hiringFilter);

      const res = await fetch(`/api/companies?${params.toString()}`);
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error("Failed to fetch companies", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Explore Companies</h1>
          <p className="text-muted-foreground mt-2">Find top employers offering internships and entry-level jobs.</p>
        </div>

        {/* Filters */}
        <div className="bg-card p-6 rounded-lg shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4 border border-border">
          {/* Search */}
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Company Name</label>
            <input 
              placeholder="Search companies..." 
              className="w-full bg-background border border-border text-foreground p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Industry</label>
            <select 
              className="w-full bg-background border border-border text-foreground p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
              value={industry}
              onChange={e => setIndustry(e.target.value)}
            >
              <option value="all">All Industries</option>
              <option value="Tech">Technology</option>
              <option value="Finance">Finance & Banking</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Marketing">Marketing & Media</option>
              <option value="Service">Service & Hospitality</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Location</label>
            <input 
              placeholder="e.g. Remote, London..." 
              className="w-full bg-background border border-border text-foreground p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
              value={location}
              onChange={e => setLocation(e.target.value)}
            />
          </div>

          {/* Hiring Status */}
          <div>
            <label className="block text-xs font-bold text-muted-foreground uppercase mb-1">Hiring For</label>
            <select 
              className="w-full bg-background border border-border text-foreground p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
              value={hiringFilter}
              onChange={e => setHiringFilter(e.target.value)}
            >
              <option value="any">Anything</option>
              <option value="internship">Internships Only</option>
              <option value="job">Entry-Level Jobs</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : companies.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No companies found matching your criteria.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map(company => (
              <div 
                key={company._id} 
                onClick={() => router.push(`/company/${company._id}`)}
                className="bg-card rounded-lg shadow-sm border border-border hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col"
              >
                <div className="p-6 flex items-start gap-4">
                  <img 
                    src={company.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`} 
                    className="w-16 h-16 rounded object-cover border border-border" 
                    alt={company.name} 
                  />
                  <div>
                    <h3 className="font-bold text-lg text-foreground">{company.name}</h3>
                    <p className="text-sm text-primary font-medium">{company.industry}</p>
                    {company.contact?.location && (
                      <p className="text-xs text-muted-foreground mt-1">{company.contact.location}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-auto bg-muted px-6 py-3 flex justify-between items-center border-t border-border">
                  <div className="text-xs font-medium text-muted-foreground">
                    {company.stats.total === 0 ? (
                      <span className="text-muted-foreground">Not Hiring</span>
                    ) : (
                      <span className="text-green-600 flex gap-2">
                        {company.stats.internships > 0 && <span>{company.stats.internships} Internships</span>}
                        {company.stats.jobs > 0 && <span>{company.stats.jobs} Jobs</span>}
                      </span>
                    )}
                  </div>
                  <span className="text-primary text-sm font-bold">&rarr;</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
