"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { 
  MapPin, 
  Briefcase, 
  Clock, 
  DollarSign, 
  ChevronLeft,
  Building2,
  ShieldCheck,
  Users,
  Calendar,
  Globe,
  Share2,
  Bookmark,
  ExternalLink,
  ArrowRight
} from "lucide-react";

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

  if (loading) return <div className="p-10 text-center min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>;
  if (!job) return <div className="p-10 text-center text-red-500">Job not found.</div>;

  const isExpired = new Date(job.deadline) <= new Date();

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => router.back()}
          className="flex items-center text-sm font-semibold text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to listings
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: Job Details */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* MAIN CARD */}
            <div className="bg-white dark:bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
               <div className="relative h-48 bg-slate-900 overflow-hidden">
                  <div className="absolute inset-0 opacity-30">
                     <Image 
                       src={job.imageUrl || job.companyId?.imageUrl || "/assets/images/featured-job/img-01.png"} 
                       alt="Background"
                       fill
                       unoptimized
                       className="w-full h-full object-cover blur-sm" 
                     />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  <div className="absolute bottom-6 left-8 flex items-end gap-6">
                     <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-2xl border border-border overflow-hidden flex-shrink-0 relative">
                        <Image 
                          src={job.companyId?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyId?.name || "Company")}&background=random`} 
                          alt={job.companyId?.name || "Company"}
                          fill
                          unoptimized
                          className="w-full h-full object-cover rounded-xl"
                        />
                     </div>
                     <div className="mb-2">
                        <div className="flex items-center gap-2 text-white/80 text-sm font-bold uppercase tracking-widest mb-1">
                           <Building2 className="w-3.5 h-3.5" />
                           {job.companyId?.industry}
                        </div>
                        <h1 className="text-3xl font-black text-white">{job.title}</h1>
                     </div>
                  </div>
               </div>

               <div className="p-8">
                  <div className="flex flex-wrap gap-4 mb-8">
                     <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-border text-sm font-bold">
                        <Clock className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                        <span className="capitalize">{job.type}</span>
                     </div>
                     <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-border text-sm font-bold">
                        <MapPin className="w-4 h-4 text-red-500 dark:text-red-400" />
                        <span>{job.location || "Remote"}</span>
                     </div>
                     <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-border text-sm font-bold">
                        <DollarSign className="w-4 h-4 text-green-500 dark:text-green-400" />
                        <span>{job.salary?.min ? `${job.salary.min} - ${job.salary.max} ${job.salary.currency}` : "Competitive"}</span>
                     </div>
                  </div>

                  <div className="prose dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">Description</h2>
                    {job.description ? (
                      <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-line">
                        {job.description}
                      </p>
                    ) : (
                      <p className="text-muted-foreground leading-relaxed text-lg">
                        This is an exciting opportunity for a <strong>{job.title}</strong> to join the team at <strong>{job.companyId?.name}</strong>. 
                        We are looking for someone who is passionate, driven, and ready to make an impact.
                      </p>
                    )}
                    {job.companyId?.description && (
                      <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-border">
                        <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 text-foreground">Company Context</h4>
                        <p className="text-muted-foreground leading-relaxed italic">
                          {job.companyId.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-10 pt-10 border-t border-border">
                    <h3 className="text-xl font-bold mb-6 text-foreground">Required Skills</h3>
                    <div className="flex flex-wrap gap-3">
                      {job.requiredSkills.map((skill: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl font-bold text-sm border border-indigo-100 dark:border-indigo-900/30 transition-all hover:scale-105">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
               </div>
            </div>

            {/* ABOUT THE EMPLOYER SECTION */}
            <Link 
              href={`/company/${job.companyId?._id}`}
              className="block bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all group"
            >
               <div className="flex items-center justify-between mb-6 text-foreground">
                  <h3 className="text-xl font-bold flex items-center gap-2 group-hover:text-indigo-600 transition-colors">
                    About the Employer
                  </h3>
                  <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <ArrowRight className="w-5 h-5" />
                  </div>
               </div>
               <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-border flex-shrink-0 bg-slate-50 relative">
                     <Image 
                       src={job.companyId?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.companyId?.name || "Company")}&background=random`} 
                       alt={job.companyId?.name || "Company"}
                       fill
                       unoptimized
                       className="w-full h-full object-cover" 
                     />
                  </div>
                  <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-lg font-bold text-foreground group-hover:text-indigo-600 transition-colors">{job.companyId?.name}</h4>
                        {job.companyId?.verified && <ShieldCheck className="w-5 h-5 text-green-500 fill-green-50" />}
                     </div>
                     {job.companyId?.tagline && <p className="text-sm text-indigo-600 font-medium mb-3 italic">"{job.companyId.tagline}"</p>}
                     <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {job.companyId?.companySize} Employees</span>
                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Est. {job.companyId?.foundedYear}</span>
                        <span className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> {job.companyId?.companyType}</span>
                     </div>
                  </div>
               </div>
            </Link>
          </div>

          {/* RIGHT: Summary & Actions */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm sticky top-24">
               <div className="flex items-center justify-between mb-8">
                  <div className="text-xs font-black text-muted-foreground uppercase tracking-widest text-foreground">Job Overview</div>
                  <div className="flex gap-2">
                     <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg hover:text-indigo-600 transition-colors border border-border"><Share2 className="w-4 h-4" /></button>
                     <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg hover:text-indigo-600 transition-colors border border-border"><Bookmark className="w-4 h-4" /></button>
                  </div>
               </div>

               <div className="space-y-6 mb-10">
                  <SummaryItem label="Experience" value="Freshers / Students" />
                  <SummaryItem label="Location" value={job.location || "Remote"} />
                  <SummaryItem label="Apply Before" value={new Date(job.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} highlight />
                  <SummaryItem label="Salary" value={job.salary?.min ? `${job.salary.min} - ${job.salary.max} ${job.salary.currency}` : "Competitive"} />
               </div>

               <div className="space-y-3">
                  <button 
                    onClick={handleApply}
                    disabled={isExpired}
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95"
                  >
                    {isExpired ? "Applications Closed" : "Apply For This Role"}
                  </button>
                  <p className="text-[10px] text-center text-muted-foreground uppercase font-bold tracking-widest">
                    {isExpired ? "This circular has expired" : "Secure application through InternNova"}
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, highlight }: { label: string, value: string, highlight?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{label}</span>
      <span className={`text-base font-bold ${highlight ? 'text-red-500' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}
