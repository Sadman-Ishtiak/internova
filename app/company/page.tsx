"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Building2, 
  Briefcase, 
  Plus, 
  Pencil, 
  Trash2, 
  Users, 
  Clock, 
  MapPin, 
  DollarSign,
  ChevronRight,
  LayoutDashboard,
  Settings,
  Globe,
  Mail,
  Phone
} from "lucide-react";

export default function CompanyDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [myJobs, setMyJobs] = useState<any[]>([]);

  // Forms
  const [newCompany, setNewCompany] = useState({ 
    name: "", tagline: "", description: "", imageUrl: "", industry: "Technology",
    companySize: "1-10", companyType: "Privately Held", foundedYear: new Date().getFullYear(),
        contact: { website: "", linkedin: "", email: "", phone: "", location: "" }
      });
    
      const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldSetter: (url: string) => void) => {    const file = e.target.files?.[0]; if (!file) return;
    const formData = new FormData(); formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) fieldSetter(data.url); else alert("Upload failed");
    } catch (err) { console.error(err); alert("Error uploading image"); }
  };

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated") fetchCompanyData();
  }, [status, router]);

  const fetchCompanyData = async () => {
    try {
      const res = await fetch("/api/company");
      const data = await res.json();
      if (data.company) {
        setCompany(data.company);
        fetchMyJobs(data.company._id);
      }
    } catch (error) { console.error("Error fetching company:", error); } 
    finally { setLoading(false); }
  };

  const fetchMyJobs = async (companyId: string) => {
    try {
      const res = await fetch(`/api/jobs?companyId=${companyId}&includeExpired=true`);
      const data = await res.json(); setMyJobs(data.jobs || []);
    } catch (error) { console.error("Error fetching jobs:", error); }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/company", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompany)
      });
      const data = await res.json();
      if (res.ok) { setCompany(data.company); alert("Company registered!"); } 
      else alert(data.error);
    } catch (error) { console.error("Error creating company:", error); }
  };
  
  const handleDeleteJob = async (jobId: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      const res = await fetch("/api/jobs", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId }) });
      if (res.ok && company) fetchMyJobs(company._id); else alert("Failed to delete job");
    } catch (error) { console.error("Error deleting job:", error); }
  };

  if (status === "loading" || loading) return <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
  </div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* PAGE HEADER */}
      <section className="bg-slate-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Company Dashboard</h1>
            </div>
            {company && (
              <div className="flex gap-3">
                 <Link 
                  href="/company/post-job" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4" /> Post New Circular
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {!company ? (
          /* REGISTRATION FORM */
          <div className="max-w-2xl mx-auto bg-white dark:bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-indigo-600 p-6 text-white text-center">
              <Building2 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <h2 className="text-2xl font-bold">Register Your Company</h2>
              <p className="text-indigo-100 mt-1">Start recruiting the best talent today.</p>
            </div>
            <form onSubmit={handleCreateCompany} className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Company Name</label>
                    <input 
                      placeholder="e.g. Acme Corp" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-border text-foreground p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                      value={newCompany.name} 
                      onChange={e => setNewCompany({...newCompany, name: e.target.value})} 
                      required 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Tagline</label>
                    <input 
                      placeholder="Short catchy tagline" 
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-border text-foreground p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                      value={newCompany.tagline} 
                      onChange={e => setNewCompany({...newCompany, tagline: e.target.value})} 
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Industry</label>
                    <select
                      required
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-border text-foreground p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={newCompany.industry}
                      onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                    >
                      <option value="Technology">Technology</option>
                      <option value="Finance">Finance & Banking</option>
                      <option value="Textiles & Garments">Textiles & Garments</option>
                      <option value="Telecommunications">Telecommunications</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Marketing">Marketing & Media</option>
                      <option value="Service">Service & Hospitality</option>
                      <option value="Other">Other</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-sm font-bold text-foreground">Company Size</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-border text-foreground p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                      value={newCompany.companySize}
                      onChange={(e) => setNewCompany({ ...newCompany, companySize: e.target.value })}
                    >
                      <option value="1-10">1-10 Employees</option>
                      <option value="11-50">11-50 Employees</option>
                      <option value="51-200">51-200 Employees</option>
                      <option value="201-500">201-500 Employees</option>
                      <option value="501-1000">501-1000 Employees</option>
                      <option value="1000+">1000+ Employees</option>
                    </select>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Company Logo</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center border-2 border-dashed border-border overflow-hidden relative">
                    {newCompany.imageUrl ? (
                      <Image src={newCompany.imageUrl} alt="Logo Preview" fill unoptimized className="object-cover" />
                    ) : (
                      <Building2 className="text-slate-400" />
                    )}
                  </div>
                  <input type="file" className="text-xs" onChange={e => handleImageUpload(e, (url) => setNewCompany({...newCompany, imageUrl: url}))} />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">About Company</label>
                <textarea 
                  placeholder="Describe your company's mission and culture..." 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-border text-foreground p-3 rounded-xl min-h-[120px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  value={newCompany.description} 
                  onChange={e => setNewCompany({...newCompany, description: e.target.value})} 
                  required 
                />
              </div>

              <button type="submit" className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
                Register Company
              </button>
            </form>
          </div>
        ) : (
          /* DASHBOARD CONTENT */
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* SIDEBAR: Company Info & Stats */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white dark:bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                 <div className="h-24 bg-indigo-600 relative">
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl bg-white p-1 border border-border shadow-md overflow-hidden">
                       <Image 
                          src={company.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`} 
                          alt={company.name}
                          fill
                          unoptimized
                          className="w-full h-full object-cover rounded-xl"
                        />
                    </div>
                 </div>
                 <div className="pt-12 p-6 text-center">
                    <h2 className="text-xl font-bold">{company.name}</h2>
                    <p className="text-indigo-600 text-sm font-medium mb-4">{company.industry}</p>
                    
                    <div className="space-y-2 mb-6">
                       <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                         {company.description}
                       </p>
                    </div>

                    <Link 
                      href="/company/edit"
                      className="w-full py-2 bg-slate-50 dark:bg-slate-800 border border-border rounded-lg text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <Settings className="w-4 h-4" /> Edit Profile
                    </Link>
                 </div>
                 <div className="bg-slate-50 dark:bg-slate-800/50 p-4 grid grid-cols-2 gap-4 border-t border-border">
                    <div className="text-center border-r border-border">
                       <p className="text-lg font-bold">{myJobs.length}</p>
                       <p className="text-[10px] uppercase font-bold text-muted-foreground">Postings</p>
                    </div>
                    <div className="text-center">
                       <p className="text-lg font-bold">{myJobs.reduce((acc, j) => acc + (j.applicants?.length || 0), 0)}</p>
                       <p className="text-[10px] uppercase font-bold text-muted-foreground">Applicants</p>
                    </div>
                 </div>
              </div>

              {/* QUICK LINKS */}
              <div className="bg-white dark:bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2"><LayoutDashboard className="w-4 h-4 text-indigo-600" /> Quick Links</h3>
                <div className="space-y-2">
                   <Link href={`/company/${company._id}`} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm group">
                      <span className="text-muted-foreground group-hover:text-indigo-600 transition-colors">Public Profile</span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                   </Link>
                   <Link href="/jobs" className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm group">
                      <span className="text-muted-foreground group-hover:text-indigo-600 transition-colors">Browse Jobs</span>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                   </Link>
                </div>
              </div>
            </div>

            {/* MAIN CONTENT: Jobs & Forms */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* ACTIVE POSTINGS LIST */}
              <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Briefcase className="w-5 h-5 text-indigo-600" /> Active Circulars</h3>
                    <span className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 text-xs font-bold px-3 py-1 rounded-full">{myJobs.length} Total</span>
                 </div>
                 
                 <div className="divide-y divide-border">
                    {myJobs.length === 0 ? (
                       <div className="p-20 text-center">
                          <Briefcase className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                          <p className="text-muted-foreground">You haven't posted any jobs yet.</p>
                       </div>
                    ) : (
                      myJobs.map((job) => {
                        const isExpired = new Date(job.deadline) <= new Date();
                        return (
                          <div key={job._id} className={`p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${isExpired ? 'opacity-60' : ''}`}>
                            <div className="flex flex-col md:flex-row md:items-center gap-6">
                              <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-border relative">
                                <Image 
                                  src={job.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.title)}&background=random`} 
                                  alt={job.title}
                                  fill
                                  unoptimized
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="font-bold text-lg">{job.title}</h4>
                                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${job.type === 'internship' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>{job.type}</span>
                                  {isExpired && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Expired</span>}
                                </div>
                                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                                   <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                   <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {job.applicants?.length || 0} Applicants</span>
                                   <span className="flex items-center gap-1 text-green-600 font-semibold"><DollarSign className="w-3.5 h-3.5" /> {job.salary?.min ? `${job.salary.min}-${job.salary.max}` : "Competitive"}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                 <button 
                                   onClick={() => router.push(`/company/applicants/${job._id}`)}
                                   className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200"
                                 >
                                   View Applicants
                                 </button>
                                 <Link href={`/company/post-job?edit=${job._id}`} className="p-2 border border-border rounded-lg hover:bg-white transition-colors text-muted-foreground hover:text-indigo-600"><Pencil className="w-4 h-4" /></Link>
                                 <button onClick={() => handleDeleteJob(job._id)} className="p-2 border border-border rounded-lg hover:bg-white transition-colors text-muted-foreground hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    )}
                 </div>
              </div>

            </div>

          </div>
        )}
      </div>

    </div>
  );
}