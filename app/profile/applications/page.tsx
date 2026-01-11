"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronLeft, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MessageSquare,
  Building2,
  Calendar,
  Briefcase
} from "lucide-react";

export default function MyApplicationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchApplications();
  }, [status]);

  const fetchApplications = async () => {
    try {
      const res = await fetch("/api/user/applications");
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'accepted': return 'text-green-600 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-900/30';
      case 'rejected': return 'text-red-600 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-900/30';
      default: return 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-900/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'accepted': return <CheckCircle2 className="w-5 h-5" />;
      case 'rejected': return <XCircle className="w-5 h-5" />;
      default: return <Clock className="w-5 h-5" />;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4 mb-8">
          <Link href="/profile" className="p-2 rounded-xl bg-white dark:bg-card border border-border hover:bg-slate-100 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="text-muted-foreground">Track the status of your job applications.</p>
          </div>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white dark:bg-card border border-border rounded-3xl p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold mb-2">No Applications Yet</h3>
            <p className="text-muted-foreground mb-8">You haven't applied to any jobs yet. Start exploring opportunities!</p>
            <Link href="/jobs" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app.jobId} className="bg-white dark:bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  
                  {/* Company Logo */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-border flex-shrink-0 bg-slate-50 relative">
                     <Image 
                       src={app.companyImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.companyName || "C")}&background=random`} 
                       alt={app.companyName}
                       fill
                       unoptimized
                       className="object-cover"
                     />
                  </div>

                  {/* Main Content */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                      <div>
                        <h3 className="text-lg font-bold hover:text-indigo-600 transition-colors">
                          <Link href={`/jobs/${app.jobId}`}>{app.jobTitle}</Link>
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="w-4 h-4" /> {app.companyName}
                          <span>•</span>
                          <span>{app.location || "Remote"}</span>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold capitalize ${getStatusColor(app.status)}`}>
                        {getStatusIcon(app.status)}
                        {app.status}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium uppercase tracking-wider mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Applied: {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5" /> {app.type}
                      </span>
                    </div>

                    {/* Message Section */}
                    {app.message && (
                      <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-border">
                        <div className="flex items-center gap-2 text-sm font-bold text-foreground mb-2">
                          <MessageSquare className="w-4 h-4 text-indigo-500" />
                          Message from Employer:
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                          {app.message}
                        </p>
                      </div>
                    )}
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
