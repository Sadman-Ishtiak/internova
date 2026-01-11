"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  User, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  Phone, 
  Briefcase, 
  Settings,
  ExternalLink,
  ChevronRight,
  GraduationCap,
  Mail,
  Award
} from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.user) {
        setUserData(data.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HEADER SECTION */}
        <div className="bg-white dark:bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="h-32 bg-indigo-600 relative">
             <div className="absolute -bottom-12 left-8 w-32 h-32 rounded-3xl bg-white p-1 border border-border shadow-xl overflow-hidden">
                <Image 
                  src={userData?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.name || "User")}&background=random`} 
                  alt="Profile" 
                  fill 
                  unoptimized
                  className="w-full h-full object-cover rounded-2xl"
                />
             </div>
          </div>
          <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight">{userData?.name}</h1>
              <p className="text-indigo-600 font-bold text-lg">{userData?.title || "Potential Candidate"}</p>
              
              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground font-medium">
                {userData?.contact?.location?.length > 0 && (
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-red-400" /> {userData.contact.location.join(" • ")}</span>
                )}
                <span className="flex items-center gap-1.5"><GraduationCap className="w-4 h-4 text-indigo-500" /> {userData?.experience?.length || 0} Professional Roles</span>
              </div>
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button 
                onClick={() => router.push(`/users/${userData._id}`)}
                className="flex-1 md:flex-none px-6 py-3 bg-slate-100 dark:bg-slate-800 text-foreground font-bold rounded-xl hover:bg-slate-200 transition-all text-sm"
              >
                Public CV
              </button>
              <Link 
                href="/profile/edit"
                className="flex-1 md:flex-none px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 text-sm"
              >
                <Settings className="w-4 h-4" /> Edit Profile
              </Link>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT: Experience & Certifications */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Skills */}
            <div className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {userData?.skills?.length > 0 ? (
                  userData.skills.map((skill: string, i: number) => (
                    <span key={i} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl text-sm font-bold text-foreground hover:border-indigo-200 transition-colors">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground italic text-sm">No skills added yet.</p>
                )}
              </div>
            </div>

            {/* Experience */}
            <div className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                Work History
              </h3>
              {userData?.experience?.length > 0 ? (
                <div className="space-y-10 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {userData.experience.map((exp: any, i: number) => (
                    <div key={i} className="relative flex items-start gap-8 group">
                      <div className="absolute left-0 mt-1.5 w-10 h-10 rounded-xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-indigo-500 transition-colors z-10 shadow-sm">
                        <Briefcase className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <div className="ml-14 flex-1 bg-slate-50/50 dark:bg-slate-800/30 p-6 rounded-2xl border border-transparent hover:border-border transition-all">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2">
                          <h4 className="font-bold text-lg text-foreground">{exp.role}</h4>
                          <span className="text-xs font-black uppercase text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded">{exp.years} Years</span>
                        </div>
                        <p className="text-indigo-600 font-bold text-sm mb-3">{exp.company}</p>
                        {exp.description && <p className="text-muted-foreground text-sm leading-relaxed">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-border rounded-3xl">
                   <p className="text-muted-foreground">No experience listed.</p>
                </div>
              )}
            </div>

            {/* Certifications */}
            <div className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
                Certifications & Awards
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {userData?.certifications?.length > 0 ? (
                  userData.certifications.map((cert: any, i: number) => (
                    <div key={i} className="p-4 bg-slate-50 dark:bg-slate-800/50 border border-border rounded-2xl flex items-start gap-4">
                       <div className="w-10 h-10 rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm border border-border flex-shrink-0">
                          <Award className="w-5 h-5 text-amber-500" />
                       </div>
                       <div className="overflow-hidden">
                          <p className="font-bold text-sm text-foreground truncate">{cert.name}</p>
                          <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                          {cert.url && (
                            <>
                              <a href={cert.url} target="_blank" className="text-[10px] text-indigo-600 font-bold hover:underline flex items-center gap-1 mt-1 print:hidden">
                                Verify <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                              <div className="hidden print:block text-[9px] text-muted-foreground mt-1 break-all">
                                {cert.url}
                              </div>
                            </>
                          )}
                       </div>
                    </div>
                  ))
                ) : (
                  <p className="md:col-span-2 text-center py-12 text-muted-foreground italic">No certifications added.</p>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT: Contact & Sidebar */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm sticky top-24">
              <h3 className="text-lg font-bold mb-6 border-b border-border pb-4">Contact Details</h3>
              <div className="space-y-6">
                <ContactItem icon={Mail} label="Email Address" value={userData?.email} />
                <ContactItem icon={Phone} label="Phone Number" value={userData?.contact?.phone || "Not provided"} />
                <ContactItem icon={Linkedin} label="LinkedIn" value={userData?.contact?.linkedin} isLink />
                <ContactItem icon={Github} label="GitHub" value={userData?.contact?.github} isLink />
                <ContactItem icon={Globe} label="Portfolio" value={userData?.contact?.website} isLink />
              </div>

              <div className="mt-8 pt-6 border-t border-border">
                <button 
                  onClick={() => router.push('/profile/applications')}
                  className="w-full py-3 bg-white dark:bg-card border-2 border-indigo-100 dark:border-indigo-900/30 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all flex items-center justify-center gap-2"
                >
                  <Briefcase className="w-5 h-5" /> View My Applications
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="bg-slate-50 dark:bg-slate-800/5 p-6 rounded-2xl text-center">
                   <h4 className="font-bold mb-2">Employer Zone</h4>
                   <p className="text-xs text-muted-foreground mb-4">Manage your company dashboard and job circulars.</p>
                   <button 
                    onClick={() => router.push('/company')}
                    className="w-full py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-none"
                   >
                     {userData?.companyId ? "Go to Dashboard" : "Register Company"}
                   </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper Components
function ContactItem({ icon: Icon, label, value, isLink }: { icon: any, label: string, value?: string, isLink?: boolean }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4 group">
      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/20 transition-colors">
        <Icon className="w-5 h-5 text-muted-foreground group-hover:text-indigo-600 transition-colors" />
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">{label}</p>
        {isLink ? (
          <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" className="text-sm font-bold text-foreground hover:text-indigo-600 truncate block transition-colors underline decoration-border underline-offset-4 hover:decoration-indigo-600">
            {value.replace(/^https?:\/\/(www\.)?/, '').split('/')[0]}
          </a>
        ) : (
          <p className="text-sm font-bold text-foreground truncate">{value}</p>
        )}
      </div>
    </div>
  );
}
