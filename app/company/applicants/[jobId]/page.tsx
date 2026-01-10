"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";

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

  // Status Update State
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);
  const [statusAction, setStatusAction] = useState<'accepted' | 'rejected' | null>(null);
  const [message, setMessage] = useState("");
  const [processing, setProcessing] = useState(false);

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

  const openStatusModal = (applicant: any, action: 'accepted' | 'rejected') => {
    setSelectedApplicant(applicant);
    setStatusAction(action);
    setMessage(applicant.message || ""); // Pre-fill if exists (optional)
  };

  const closeStatusModal = () => {
    setSelectedApplicant(null);
    setStatusAction(null);
    setMessage("");
  };

  const handleStatusUpdate = async () => {
    if (!statusAction || !selectedApplicant) return;
    if (!message.trim()) {
      alert("A message is mandatory for this action.");
      return;
    }

    setProcessing(true);
    try {
      const res = await fetch("/api/company/applications/update-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          userId: selectedApplicant.userId._id,
          status: statusAction,
          message: message
        })
      });

      const result = await res.json();

      if (res.ok) {
        // Update local state
        setData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            applicants: prev.applicants.map(app => 
              app.userId._id === selectedApplicant.userId._id 
                ? { ...app, status: statusAction, message: message } 
                : app
            )
          };
        });
        closeStatusModal();
        alert(`Applicant ${statusAction} successfully.`);
      } else {
        alert(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred.");
    } finally {
      setProcessing(false);
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
    <div className="max-w-5xl mx-auto p-8 min-h-screen relative">
      
      {/* Status Modal */}
      {selectedApplicant && statusAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-background rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-border">
            <div className={`p-6 border-b border-border ${statusAction === 'accepted' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <h3 className={`text-xl font-bold capitalize ${statusAction === 'accepted' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {statusAction === 'accepted' ? 'Accept Candidate' : 'Reject Candidate'}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                You are about to <strong>{statusAction}</strong> {selectedApplicant.userId.name}.
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Message to Candidate <span className="text-red-500">*</span>
                </label>
                <textarea 
                  className="w-full h-32 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                  placeholder={statusAction === 'accepted' ? "Congratulations! We would like to invite you..." : "Thank you for your interest. Unfortunately..."}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground mt-2">
                  This message will be visible to the candidate on their dashboard.
                </p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-slate-900 border-t border-border flex justify-end gap-3">
              <button 
                onClick={closeStatusModal}
                disabled={processing}
                className="px-5 py-2.5 rounded-xl font-bold text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleStatusUpdate}
                disabled={processing || !message.trim()}
                className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                  statusAction === 'accepted' 
                    ? 'bg-green-600 hover:bg-green-700 shadow-green-200 dark:shadow-none' 
                    : 'bg-red-600 hover:bg-red-700 shadow-red-200 dark:shadow-none'
                }`}
              >
                {processing ? "Processing..." : `Confirm ${statusAction === 'accepted' ? 'Acceptance' : 'Rejection'}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Applicants for "{data.jobTitle}"</h1>
          <p className="text-muted-foreground mt-1">{data.totalApplicants} Total Applicant{data.totalApplicants !== 1 && 's'}</p>
        </div>
        <button 
          onClick={() => router.back()}
          className="text-muted-foreground hover:text-foreground font-medium flex items-center gap-2 bg-card px-4 py-2 rounded shadow-sm border border-border"
        >
          &larr; Back to Dashboard
        </button>
      </div>

      {/* Applicants List */}
      <div className="space-y-6">
        {data.applicants.length === 0 ? (
          <div className="bg-card p-12 rounded-lg shadow-sm border border-border text-center text-muted-foreground flex flex-col items-center">
            <svg className="w-16 h-16 text-muted-foreground/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-lg font-medium">No applicants yet</p>
            <p className="text-sm mt-2">Waiting for candidates to apply.</p>
          </div>
        ) : (
          data.applicants.map((app) => (
            <div key={app._id} className="bg-card p-6 rounded-lg shadow-sm border border-border hover:shadow-md transition duration-200">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0 relative w-24 h-24">
                  <Image 
                    src={app.userId.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.userId.name)}&background=random`} 
                    alt={app.userId.name} 
                    fill
                    unoptimized
                    className="rounded-full object-cover border-2 border-border shadow-sm"
                  />
                  <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border shadow-sm ${
                    app.status === 'accepted' ? 'bg-green-100 text-green-700 border-green-200' :
                    app.status === 'rejected' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-amber-100 text-amber-700 border-amber-200'
                  }`}>
                    {app.status || 'Pending'}
                  </div>
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{app.userId.name}</h3>
                      <p className="text-primary font-medium">{app.userId.title || "Job Seeker"}</p>
                      <p className="text-sm text-muted-foreground mt-1">{app.userId.email}</p>
                    </div>
                    <div className="text-right bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-100 dark:border-green-900/30">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(app.matchScore)}%</div>
                      <div className="text-xs text-green-800 dark:text-green-300 uppercase tracking-wide font-bold">Match Score</div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {app.userId.skills?.length > 0 ? (
                        app.userId.skills.map((skill: string, i: number) => (
                          <span key={i} className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs border border-border">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-sm italic">No skills listed</span>
                      )}
                    </div>
                  </div>

                  {/* Experience Snippet */}
                  {app.userId.experience?.length > 0 && (
                    <div className="mt-4 border-t border-border pt-4">
                       <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Recent Experience</h4>
                       <div className="text-sm text-foreground">
                         <span className="font-bold">{app.userId.experience[0].role}</span> at <span className="font-medium">{app.userId.experience[0].company}</span> 
                         <span className="text-muted-foreground ml-1">({app.userId.experience[0].years} years)</span>
                       </div>
                    </div>
                  )}

                  {/* Message Display (if any) */}
                  {app.message && (
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-border text-sm italic text-muted-foreground">
                      <span className="font-bold not-italic mr-2">Note:</span>"{app.message}"
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="mt-6 flex flex-wrap gap-3 items-center justify-between border-t border-border pt-4">
                    <div className="flex gap-3">
                      <button 
                        onClick={() => router.push(`/profile/${app.userId._id}`)}
                        className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:bg-secondary/80 text-sm font-bold transition"
                      >
                        View Profile
                      </button>
                      <a 
                        href={`mailto:${app.userId.email}?subject=Regarding your application for ${data.jobTitle}`}
                        className="border border-border bg-card px-4 py-2 rounded-lg hover:bg-accent text-sm font-bold text-foreground transition"
                      >
                        Email
                      </a>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => openStatusModal(app, 'rejected')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          app.status === 'rejected' 
                            ? 'bg-red-100 text-red-700 opacity-50 cursor-not-allowed' 
                            : 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                        }`}
                        disabled={app.status === 'rejected'}
                      >
                        {app.status === 'rejected' ? 'Rejected' : 'Reject'}
                      </button>
                      <button 
                        onClick={() => openStatusModal(app, 'accepted')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                          app.status === 'accepted' 
                            ? 'bg-green-100 text-green-700 opacity-50 cursor-not-allowed' 
                            : 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-200 dark:shadow-none'
                        }`}
                        disabled={app.status === 'accepted'}
                      >
                        {app.status === 'accepted' ? 'Accepted' : 'Accept'}
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground text-right">
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
