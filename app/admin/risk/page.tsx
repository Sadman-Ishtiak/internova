"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, UserX, Clock, ShieldAlert } from "lucide-react";

export default function RiskAnalysisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{ ghostJobs: any[], fakeUsers: any[] }>({ ghostJobs: [], fakeUsers: [] });

  useEffect(() => {
    fetchRiskData();
  }, []);

  const fetchRiskData = async () => {
    try {
      const res = await fetch("/api/admin/risk-analysis");
      if (res.status === 403) {
         router.push("/");
         return;
      }
      const jsonData = await res.json();
      setData(jsonData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlagJob = async (id: string) => {
    if(!confirm("Are you sure you want to delete this job? This will verify it as a ghost circular.")) return;
    await fetch(`/api/admin/jobs/delete`, { 
         method: "POST",
         body: JSON.stringify({ jobId: id, isGhost: true })
    });
    fetchRiskData();
  };

  const handleBanUser = async (id: string) => {
    if(!confirm("Are you sure you want to ban this user?")) return;
    await fetch(`/api/admin/users/ban`, { 
         method: "POST", 
         body: JSON.stringify({ userId: id })
    });
    fetchRiskData();
  };

  if (loading) return <div className="p-10 text-center">Loading Risk Analysis...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <ShieldAlert className="w-8 h-8 text-red-600" />
        Risk & Anomaly Detection
      </h1>
      <p className="text-muted-foreground mb-8">
        Automated detection of ghost circulars and potential spam users.
      </p>

      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* GHOST JOBS */}
        <div className="bg-white dark:bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border bg-orange-50 dark:bg-orange-900/20">
            <h2 className="text-xl font-bold text-orange-700 dark:text-orange-400 flex items-center gap-2">
               <Clock className="w-5 h-5" /> Potential Ghost Circulars
            </h2>
            <p className="text-xs text-orange-600/80 mt-1">
               Active jobs with applicants but no activity for 30+ days.
            </p>
          </div>
          <div className="p-0">
            {data.ghostJobs.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No ghost jobs detected.</div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-3">Job Title</th>
                    <th className="px-6 py-3">Applicants</th>
                    <th className="px-6 py-3">Inactive Since</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.ghostJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4">
                        <div className="font-bold">{job.title}</div>
                        <div className="text-xs text-muted-foreground">{job.company}</div>
                      </td>
                      <td className="px-6 py-4 font-mono">{job.applicantCount}</td>
                      <td className="px-6 py-4 text-orange-600 font-medium">
                        {new Date(job.lastActivityAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <button 
                           onClick={() => handleFlagJob(job._id)}
                           className="text-red-600 hover:underline font-bold text-xs"
                        >
                          Delete Job
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* FAKE USERS */}
        <div className="bg-white dark:bg-card border border-border rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border bg-red-50 dark:bg-red-900/20">
            <h2 className="text-xl font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
               <UserX className="w-5 h-5" /> Potential Spam Bots
            </h2>
            <p className="text-xs text-red-600/80 mt-1">
               High velocity (50+ apps/day) or new account bursts.
            </p>
          </div>
          <div className="p-0">
            {data.fakeUsers.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">No spam bots detected.</div>
            ) : (
               <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-muted-foreground font-medium border-b border-border">
                  <tr>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Flag Reason</th>
                    <th className="px-6 py-3">Apps (24h)</th>
                    <th className="px-6 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.fakeUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="px-6 py-4">
                        <div className="font-bold">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                         <span className="inline-block px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-[10px] font-bold uppercase">
                           {user.status}
                         </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-bold">{user.applicationCount}</td>
                      <td className="px-6 py-4">
                        <button 
                           onClick={() => handleBanUser(user._id)}
                           className="text-red-600 hover:underline font-bold text-xs"
                        >
                          Ban User
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
