"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Globe, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ExternalLink,
  Briefcase,
  DollarSign,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Star,
  Users,
  Building2,
  Clock,
  Calendar
} from "lucide-react";

export default function PublicCompanyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`/api/company/${id}`);
        const data = await res.json();
        if (data.company) {
           setCompany(data.company);
           setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCompany();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading Company...</div>;
  if (!company) return <div className="p-10 text-center text-red-500">Company not found.</div>;

  const safeLink = (url?: string) => {
    if (!url) return "#";
    try {
      // Use URL constructor for proper validation
      const parsed = new URL(url.startsWith('http') || url.startsWith('mailto') ? url : `https://${url}`, 'https://example.com');
      if (['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
        return parsed.toString();
      }
    } catch {
      // Invalid URL, return safe fallback
      return "#";
    }
    return "#";
  };

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50">
      
      {/* HERO / HEADER */}
      <div className="bg-white dark:bg-card shadow-sm border-b border-border relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-3xl -mr-48 -mt-48"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-white p-1 shadow-xl border border-border overflow-hidden">
                <Image 
                  src={company.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`} 
                  alt={company.name} 
                  fill
                  unoptimized
                  className="w-full h-full object-cover rounded-2xl"
                />
              </div>
              {company.verified && (
                <div className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-900 p-1 rounded-full shadow-lg">
                  <ShieldCheck className="w-8 h-8 text-green-500 fill-green-50" />
                </div>
              )}
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-foreground tracking-tight">{company.name}</h1>
                {company.featured && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider self-center">
                    <Star className="w-3 h-3 fill-current" /> Featured
                  </span>
                )}
              </div>
              
              {company.tagline && <p className="text-xl text-indigo-600 font-bold mb-4 italic">"{company.tagline}"</p>}
              
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-6">
                 <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-muted-foreground uppercase tracking-widest border border-border/50">{company.industry}</span>
                 <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold text-muted-foreground uppercase tracking-widest border border-border/50">{company.companyType}</span>
                 <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-xs font-bold text-indigo-600 uppercase tracking-widest border border-indigo-100 dark:border-indigo-900/30">{company.companySize} Employees</span>
              </div>

              {/* Social Media Links */}
              {company.socialMedia && (
                <div className="flex justify-center md:justify-start gap-3">
                  {Object.entries(company.socialMedia).map(([platform, url]) => {
                    if (!url) return null;
                    const Icons: any = { facebook: Facebook, twitter: Twitter, linkedin: Linkedin, instagram: Instagram, youtube: Youtube };
                    const Icon = Icons[platform] || ExternalLink;
                    const colors: any = { 
                      facebook: "hover:bg-blue-600", 
                      twitter: "hover:bg-sky-500", 
                      linkedin: "hover:bg-blue-700", 
                      instagram: "hover:bg-pink-600", 
                      youtube: "hover:bg-red-600" 
                    };
                    return (
                      <a 
                        key={platform} 
                        href={safeLink(url as string)} 
                        target="_blank" 
                        className={`w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground hover:text-white transition-all transform hover:-translate-y-1 shadow-sm ${colors[platform]}`}
                        title={platform}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* LEFT: Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* About Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
                About {company.name}
              </h2>
              <div className="bg-white dark:bg-card border border-border p-8 rounded-3xl shadow-sm">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap text-lg">
                  {company.description || "No description provided."}
                </p>
                
                {company.specialties?.length > 0 && (
                  <div className="mt-8 pt-8 border-t border-border">
                    <h3 className="font-bold text-foreground mb-4 uppercase tracking-widest text-xs">Our Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {company.specialties.map((spec: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl text-sm font-medium text-foreground">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Benefits Section */}
            {company.benefits?.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <div className="w-2 h-8 bg-emerald-500 rounded-full"></div>
                  Perks & Benefits
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {company.benefits.map((benefit: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-semibold text-emerald-900 dark:text-emerald-400">{benefit}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Active Opportunities */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-3">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  Active Opportunities
                </h2>
                <span className="px-4 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-bold uppercase">{jobs.length} open roles</span>
              </div>
              
              {jobs.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-card rounded-3xl border border-dashed border-border shadow-sm">
                  <Briefcase className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                  <p className="text-muted-foreground text-lg">No active openings at the moment.</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-6">
                  {jobs.map((job) => (
                    <Link 
                      key={job._id} 
                      href={`/jobs/${job._id}`}
                      className="group bg-white dark:bg-card border border-border rounded-3xl p-6 hover:shadow-2xl transition-all hover:border-indigo-300 flex flex-col shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="w-14 h-14 relative rounded-2xl overflow-hidden border border-border bg-slate-50">
                          <Image 
                            src={job.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.title)}&background=random`} 
                            alt={job.title} 
                            fill
                            unoptimized
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          job.type === 'internship' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                          {job.type}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold mb-4 group-hover:text-indigo-600 transition-colors line-clamp-1">{job.title}</h3>
                      
                      <div className="space-y-2 mb-6">
                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
                           <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" /> {job.location || "Remote"}
                         </div>
                         <div className="flex items-center gap-2 text-sm text-muted-foreground font-semibold">
                           <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" /> {job.salary?.min ? `${job.salary.min}-${job.salary.max} ${job.salary.currency}` : "Competitive"}
                         </div>
                      </div>

                      <div className="mt-auto pt-4 border-t border-border flex items-center justify-between group-hover:border-indigo-200">
                         <div className="flex flex-wrap gap-1">
                            {job.requiredSkills.slice(0, 2).map((skill: string, i: number) => (
                              <span key={i} className="text-[10px] px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg font-bold text-muted-foreground uppercase tracking-tight">
                                {skill}
                              </span>
                            ))}
                         </div>
                         <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                            <ArrowRight className="w-4 h-4" />
                         </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT: Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold mb-6 border-b border-border pb-4">Company Overview</h3>
              
              <div className="space-y-6">
                <SidebarInfo icon={MapPin} label="Locations" value={Array.isArray(company.contact?.location) ? company.contact.location.join(' • ') : company.contact?.location || "Not specified"} color="text-indigo-500" />
                <SidebarInfo icon={Users} label="Company Size" value={`${company.companySize} Employees`} color="text-blue-500" />
                <SidebarInfo icon={Building2} label="Company Type" value={company.companyType} color="text-emerald-500" />
                <SidebarInfo icon={Clock} label="Founded" value={company.foundedYear?.toString() || "Unknown"} color="text-amber-500" />
                <SidebarInfo icon={Calendar} label="Member Since" value={new Date(company.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} color="text-slate-500" />
                
                {/* Leadership Section */}
                {company.ownerId && (
                  <div className="pt-6 border-t border-border">
                    <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest mb-4">Leadership</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full border border-border overflow-hidden bg-slate-50 flex-shrink-0 relative">
                        <Image 
                          src={company.ownerId.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.ownerId.name)}&background=random`} 
                          alt={company.ownerId.name} 
                          fill
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{company.ownerId.name}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{company.ownerId.title || "Founder / Owner"}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="pt-6 border-t border-border space-y-4">
                  <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest">Contact Information</h4>
                  {company.contact?.website && (
                    <a href={safeLink(company.contact.website)} target="_blank" className="flex items-center gap-3 group">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-indigo-600 transition-colors">
                        <Globe className="w-5 h-5 text-muted-foreground group-hover:text-white" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Website</p>
                        <p className="text-sm font-bold text-foreground truncate max-w-[150px]">{company.contact.website.replace(/^https?:\/\//, '')}</p>
                      </div>
                    </a>
                  )}
                  {company.contact?.email && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Email Address</p>
                        <p className="text-sm font-bold text-foreground truncate">{company.contact.email}</p>
                      </div>
                    </div>
                  )}
                  {company.contact?.phone && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Phone</p>
                        <p className="text-sm font-bold text-foreground">{company.contact.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-border">
                 <button 
                   onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
                   className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-[0.98]"
                 >
                   Apply Now
                 </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function SidebarInfo({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-sm font-black text-foreground">{value}</p>
      </div>
    </div>
  );
}
