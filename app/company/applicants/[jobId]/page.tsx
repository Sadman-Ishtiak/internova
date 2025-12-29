"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ApplicantsPage() {
  const { jobId } = useParams();
  const router = useRouter();
  const { status } = useSession();
  
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    jobTitle: string;
    totalApplicants: number;
    applicants: any[];
  } | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchApplicants();
    }
  }, [status, jobId]);

  const fetchApplicants = async () => {
    try {
      const res = await fetch(`/api/jobs/${jobId}/applicants`);
      if (!res.ok) {
        if (res.status === 403) alert("Unauthorized: You do not own this job.");
        if (res.status === 404) alert("Job not found");
        router.push("/company"); // Redirect back on error
        return;
      }
      const jsonData = await res.json();
      setData(jsonData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!data) return <div className="p-10 text-center">No data found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applicants for "{data.jobTitle}"</h1>
          <p className="text-gray-500 mt-1">{data.totalApplicants} Total Applicant{data.totalApplicants !== 1 && 's'}</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="text-gray-600 hover:text-black font-medium flex items-center gap-2 bg-white px-4 py-2 rounded shadow-sm border"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      {/* Applicants List */}
      <div className="space-y-6">
        {data.applicants.length === 0 ? (
          <div className="bg-white p-12 rounded-lg shadow-sm border text-center text-gray-500 flex flex-col items-center">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium">No applicants yet</p>
            <p className="text-sm mt-2">Waiting for candidates to apply.</p>
          </div>
        ) : (
          data.applicants.map((app) => (
            <div key={app._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition duration-200">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <img 
                    src={app.userId.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.userId.name)}&background=random`} 
                    alt={app.userId.name} 
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-100 shadow-sm"
                  />
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{app.userId.name}</h3>
                      <p className="text-indigo-600 font-medium">{app.userId.title || "Job Seeker"}</p>
                      <p className="text-sm text-gray-500 mt-1">{app.userId.email}</p>
                    </div>
                    <div className="text-right bg-green-50 px-3 py-2 rounded-lg border border-green-100">
                      <div className="text-2xl font-bold text-green-600">{Math.round(app.matchScore)}%</div>
                      <div className="text-xs text-green-800 uppercase tracking-wide font-bold">Match Score</div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {app.userId.skills?.length > 0 ? (
                        app.userId.skills.map((skill: string, i: number) => (
                          <span key={i} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs border border-gray-200">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-sm italic">No skills listed</span>
                      )}
                    </div>
                  </div>

                  {/* Experience Snippet */}
                  {app.userId.experience?.length > 0 && (
                    <div className="mt-4 border-t pt-4">
                       <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Recent Experience</h4>
                       <div className="text-sm text-gray-700">
                         <span className="font-bold">{app.userId.experience[0].role}</span> at <span className="font-medium">{app.userId.experience[0].company}</span> 
                         <span className="text-gray-500 ml-1">({app.userId.experience[0].years} years)</span>
                       </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-3">
                    <button 
                      onClick={() => router.push(`/profile/${app.userId._id}`)}
                      className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 text-sm font-medium transition"
                    >
                      View Full Profile
                    </button>
                    <a 
                      href={`mailto:${app.userId.email}?subject=Regarding your application for ${data.jobTitle}`}
                      className="border border-gray-300 bg-white px-5 py-2 rounded-md hover:bg-gray-50 text-sm font-medium text-gray-700 transition"
                    >
                      Contact Candidate
                    </a>
                  </div>
                  <div className="mt-2 text-xs text-gray-400 text-right">
                    Applied on {new Date(app.appliedAt).toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
