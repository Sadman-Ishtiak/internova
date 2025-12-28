"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react"; // Added signOut here
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
    <main className="min-h-screen bg-gray-50">
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
          <p className="text-center text-gray-500">No active circulars found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {/* Circular Image */}
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src={job.imageUrl} 
                    alt={job.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold rounded shadow">
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-500 mb-3">{job.companyId?.name || "Unknown Company"}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.requiredSkills.slice(0, 3).map((skill: string, i: number) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {skill}
                      </span>
                    ))}
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
    </main>
  );
}