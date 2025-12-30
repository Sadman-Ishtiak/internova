"use client";

import Countdown from "@/components/Countdown";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function JobsPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Debounce search to avoid too many requests
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, typeFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (typeFilter !== "all") params.append("type", typeFilter);

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
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Opportunities</h1>

        {/* Search & Filter Bar */}
        <div className="bg-card p-4 rounded shadow mb-8 flex flex-col md:flex-row gap-4 border border-border">
          <input 
            type="text" 
            placeholder="Search by title or skill..." 
            className="flex-1 bg-background border border-border text-foreground p-2 rounded focus:ring-2 focus:ring-primary focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="bg-background border border-border text-foreground p-2 rounded w-full md:w-48 focus:ring-2 focus:ring-primary focus:outline-none"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="job">Jobs Only</option>
            <option value="internship">Internships Only</option>
          </select>
        </div>

        {/* Job Grid */}
        {loading ? (
          <p className="text-center">Loading...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-muted-foreground">No opportunities found matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job._id} 
                className="bg-card border border-border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col"
              >
                {/* Image */}
                <div 
                  className="h-48 bg-muted relative cursor-pointer"
                  onClick={() => window.location.href = `/jobs/${job._id}`}
                >
                  <img 
                    src={job.imageUrl} 
                    alt={job.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Countdown deadline={job.deadline} />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-grow flex flex-col">
                  <h3 
                    className="text-xl font-bold text-foreground hover:text-primary cursor-pointer"
                    onClick={() => window.location.href = `/jobs/${job._id}`}
                  >
                    {job.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">{job.companyId?.name || "Unknown Company"}</p>
                  
                  {job.salary?.min && (
                    <div className="text-sm font-semibold text-green-600 mb-2">
                      ${job.salary.min} - ${job.salary.max} {job.salary.currency} / {job.salary.period}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.requiredSkills.slice(0, 3).map((skill: string, i: number) => (
                      <span key={i} className="text-xs bg-accent px-2 py-1 rounded text-accent-foreground">
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 3 && <span className="text-xs text-muted-foreground">+{job.requiredSkills.length - 3} more</span>}
                  </div>

                  <div className="mt-auto">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleApply(job._id); }}
                      className="w-full bg-primary text-primary-foreground py-2 rounded font-medium hover:opacity-90 transition"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}