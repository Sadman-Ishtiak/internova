"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function JobDetailsPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const router = useRouter();
  
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${id}`);
        const data = await res.json();
        if (data.job) setJob(data.job);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!session) {
      router.push("/login");
      return;
    }

    const res = await fetch("/api/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job._id })
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Application Successful! Your Skill Match Score: ${data.score.toFixed(1)}%`);
    } else {
      alert(data.error);
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Opportunity...</div>;
  if (!job) return <div className="p-10 text-center text-red-500">Job not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        
        {/* HERO IMAGE */}
        <div className="h-64 w-full relative">
           <img 
             src={job.imageUrl} 
             alt={job.title} 
             className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-8 text-white w-full">
                <div className="flex justify-between items-end">
                  <div>
                    <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
                    <Link href={`/company/${job.companyId?._id}`} className="text-xl hover:underline text-indigo-200">
                      at {job.companyId?.name || "Unknown Company"}
                    </Link>
                  </div>
                  <span className={`px-4 py-2 rounded text-white font-bold ${job.type === 'internship' ? 'bg-purple-600' : 'bg-blue-600'}`}>
                       {job.type === 'internship' ? 'Internship' : 'Job'}
                  </span>
                </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
           
           {/* LEFT COLUMN: Details */}
           <div className="md:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">About the Role</h2>
                {/* Since we don't have a long description field in the Job model yet, we use a placeholder or the title as context */}
                <p className="text-gray-600 leading-relaxed">
                  We are looking for a talented <strong>{job.title}</strong> to join our team at <strong>{job.companyId?.name}</strong>. 
                  This is a great opportunity to work in a dynamic environment and grow your career.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.requiredSkills.map((skill: string, i: number) => (
                    <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-medium border border-indigo-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
           </div>

           {/* RIGHT COLUMN: Action Card */}
           <div className="md:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg border sticky top-24">
                 <h3 className="font-bold text-gray-800 mb-4 text-lg">Job Overview</h3>
                 
                 <div className="space-y-3 text-sm text-gray-600 mb-6">
                    <div className="flex justify-between">
                      <span>Posted By:</span>
                      <span className="font-medium text-gray-900">{job.companyId?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Type:</span>
                      <span className="capitalize font-medium text-gray-900">{job.type}</span>
                    </div>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <span>📅 Deadline:</span>
              <span className="font-medium text-red-600">{new Date(job.deadline).toLocaleDateString('en-GB')}</span>
            </div>
                 </div>

                 <button 
                   onClick={handleApply}
                   className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-lg"
                 >
                   Apply Now
                 </button>
              </div>
           </div>

        </div>

      </div>
    </div>
  );
}