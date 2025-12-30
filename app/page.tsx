"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
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
    <div className="min-h-screen">
      
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white py-12 text-center">
        <h2 className="text-4xl font-bold mb-2">Find Your Dream Job</h2>
        <p className="text-indigo-100">Browse active circulars and apply with one click.</p>
      </div>

      {/* Job List */}
      <div className="max-w-6xl mx-auto p-8">
        {loading ? (
          <p className="text-center">Loading circulars...</p>
        ) : jobs.length === 0 ? (
          <p className="text-center text-muted-foreground">No active circulars found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div 
                key={job._id} 
                className="bg-card border border-border rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => window.location.href = `/jobs/${job._id}`}
              >
                {/* Circular Image */}
                <div className="h-48 bg-muted relative">
                  <img 
                    src={job.imageUrl} 
                    alt={job.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-card text-card-foreground px-2 py-1 text-xs font-bold rounded">
                    {new Date(job.deadline).toLocaleDateString('en-GB')}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xl font-bold text-foreground">{job.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded text-white font-bold ${job.type === 'internship' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                       {job.type === 'internship' ? 'Internship' : 'Job'}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{job.companyId?.name || "Unknown Company"}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.requiredSkills.slice(0, 3).map((skill: string, i: number) => (
                      <span key={i} className="text-xs bg-accent px-2 py-1 rounded text-accent-foreground">
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