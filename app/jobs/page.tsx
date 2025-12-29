"use client";

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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Browse Opportunities</h1>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded shadow mb-8 flex flex-col md:flex-row gap-4">
          <input 
            type="text" 
            placeholder="Search by title or skill..." 
            className="flex-1 border p-2 rounded"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            className="border p-2 rounded w-full md:w-48"
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
          <p className="text-center text-gray-500">No opportunities found matching your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job._id} 
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => window.location.href = `/jobs/${job._id}`}
              >
                {/* Image */}
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={job.imageUrl} 
                    alt={job.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold rounded border shadow-sm text-gray-600">
                    {new Date(job.deadline).toLocaleDateString('en-GB')}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-gray-800">{job.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded text-white font-bold ${job.type === 'internship' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                       {job.type === 'internship' ? 'Internship' : 'Job'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{job.companyId?.name || "Unknown Company"}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.requiredSkills.slice(0, 3).map((skill: string, i: number) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 3 && <span className="text-xs text-gray-400">+{job.requiredSkills.length - 3} more</span>}
                  </div>

                  <button 
                    onClick={() => handleApply(job._id)}
                    className="w-full bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}