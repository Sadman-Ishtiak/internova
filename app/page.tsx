"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Monitor, 
  Code, 
  Database, 
  PenTool, 
  Megaphone, 
  BarChart, 
  User, 
  ArrowRight,
  Clock,
  DollarSign
} from "lucide-react";

export default function Home() {
  const { data: session } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("recent");
  
  // Search state
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    fetchData();

    const handleRefresh = () => {
      setLoading(true);
      fetchData();
    };

    window.addEventListener("refresh-data", handleRefresh);
    return () => window.removeEventListener("refresh-data", handleRefresh);
  }, []);

  const fetchData = async () => {
    try {
      const [jobsRes, catsRes] = await Promise.all([
        fetch("/api/jobs"),
        fetch("/api/stats/categories")
      ]);
      
      const jobsData = await jobsRes.json();
      const catsData = await catsRes.json();
      
      setJobs(jobsData.jobs || []);
      setCategories(catsData.categories || []);
    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("software") || lowerName.includes("it")) return Code;
    if (lowerName.includes("tech")) return Monitor;
    if (lowerName.includes("finance") || lowerName.includes("account")) return BarChart;
    if (lowerName.includes("design") || lowerName.includes("multimedia")) return PenTool;
    if (lowerName.includes("marketing")) return Megaphone;
    if (lowerName.includes("data")) return Database;
    if (lowerName.includes("hr") || lowerName.includes("human")) return User;
    return Briefcase;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.append("search", searchTitle);
    if (searchLocation && searchLocation !== "Location...") params.append("location", searchLocation);
    router.push(`/jobs?${params.toString()}`);
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
    <div className="min-h-screen bg-background">
      
      {/* HERO SECTION */}
      <section className="relative pt-20 pb-28 bg-indigo-50/50 dark:bg-slate-950/50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Text Content */}
            <div className="z-10">
              <span className="inline-block py-1 px-3 rounded-full bg-indigo-100 text-indigo-600 dark:text-indigo-400 text-sm font-semibold mb-4">
                We have 150,000+ live jobs
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Find your dream internship in <span className="text-indigo-600 dark:text-indigo-400">Bangladesh</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                The most trusted platform for Bangladeshi students to find internships and entry-level roles in top local and multinational companies.
              </p>
              
              {/* Search Form */}
              <form onSubmit={handleSearch} className="bg-white dark:bg-slate-900 p-3 rounded-xl shadow-lg border border-border max-w-xl">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex-1 flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <Briefcase className="w-5 h-5 text-muted-foreground mr-3" />
                    <input 
                      type="text" 
                      placeholder="Job title, keywords..." 
                      className="bg-transparent border-none focus:outline-none w-full text-sm"
                      value={searchTitle}
                      onChange={(e) => setSearchTitle(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <MapPin className="w-5 h-5 text-muted-foreground mr-3" />
                     <select 
                       className="bg-transparent border-none focus:outline-none w-full text-sm appearance-none text-muted-foreground"
                       value={searchLocation}
                       onChange={(e) => setSearchLocation(e.target.value)}
                     >
                        <option>Location...</option>
                        <option>Dhaka</option>
                        <option>Chattogram</option>
                        <option>Sylhet</option>
                        <option>Rajshahi</option>
                        <option>Khulna</option>
                        <option>Remote</option>
                     </select>
                  </div>
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>

            {/* Hero Image */}
            <div className="relative hidden lg:block">
              <div className="relative w-full h-[500px]">
                 <Image 
                   src="/assets/images/process-02.png" 
                   alt="Hero Illustration" 
                   fill
                   className="object-contain"
                   priority
                 />
              </div>
            </div>

          </div>
        </div>

        {/* Shape Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 150" className="fill-background">
             <path d="M 0,120 C 288,100 1152,40 1440,20 L 1440 150 L 0 150 Z"></path>
          </svg>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse Job Categories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Post a job to tell us about your project. We'll quickly match you with the right freelancers.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => {
              const Icon = getCategoryIcon(cat.name);
              return (
                <div 
                  key={idx} 
                  onClick={() => router.push(`/jobs?category=${encodeURIComponent(cat.name)}`)}
                  className="group p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                >
                  <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                    <Icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count} Jobs</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link href="/jobs" className="inline-flex items-center text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Browse All Categories <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* JOB LIST SECTION */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">New & Random Jobs</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Post a job to tell us about your project. We'll quickly match you with the right freelancers.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8">
             <div className="inline-flex p-1 bg-white dark:bg-slate-800 rounded-lg border border-border">
                {['recent', 'featured', 'freelancer'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === tab 
                      ? 'bg-indigo-600 text-white shadow-sm' 
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)} Jobs
                  </button>
                ))}
             </div>
          </div>

          {/* Jobs */}
          <div className="max-w-5xl mx-auto space-y-4">
            {loading ? (
              <div className="text-center py-12">Loading jobs...</div>
            ) : jobs.length === 0 ? (
               <div className="text-center py-12 text-muted-foreground">No jobs found.</div>
            ) : (
              jobs.slice(0, 5).map((job) => (
                <div key={job._id} className="group bg-white dark:bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all hover:border-indigo-200">
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    
                    {/* Company Logo */}
                    <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <Image 
                        src={job.imageUrl || "/assets/images/featured-job/img-01.png"} 
                        alt="Company" 
                        fill 
                        className="object-cover"
                      />
                    </div>

                    {/* Job Details */}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-lg font-bold mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        <Link href={`/jobs/${job._id}`}>{job.title}</Link>
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">{job.companyId?.name || "InternNova Company"}</p>
                      
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" /> {job.location || "Remote"}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" /> {job.salary?.min ? `${job.salary.min} - ${job.salary.max}` : "Competitive"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" /> {new Date(job.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Tags & Action */}
                    <div className="flex flex-col items-center md:items-end gap-3 min-w-[140px]">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        job.type === 'internship' 
                          ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' 
                          : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                      }`}>
                        {job.type === 'internship' ? 'Internship' : 'Full Time'}
                      </span>
                      <button 
                         onClick={() => handleApply(job._id)}
                         className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-all"
                      >
                        Apply Now
                      </button>
                    </div>

                  </div>
                </div>
              ))
            )}
            
            <div className="text-center mt-10">
               <Link href="/jobs" className="btn bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition">
                 View More Jobs <ArrowRight className="inline-block w-4 h-4 ml-2" />
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="container mx-auto px-4">
           <div className="grid lg:grid-cols-2 gap-12 items-center">
             
             <div className="order-2 lg:order-1 relative h-[400px]">
                {/* We can use another image here or reuse process-02 for now if we don't have others easily available in the public folder yet */}
                 <Image 
                   src="/assets/images/process-02.png" 
                   alt="How it works" 
                   fill
                   className="object-contain -scale-x-100" // Flip it for variety
                 />
             </div>

             <div className="order-1 lg:order-2">
               <h2 className="text-3xl font-bold mb-6">How It Works</h2>
               <p className="text-muted-foreground mb-8">
                 Post a job to tell us about your project. We'll quickly match you with the right freelancers.
               </p>

               <div className="space-y-8">
                 {[
                   { title: "Register an account", desc: "Due to its widespread use as filler text for layouts, non-readability is of great importance.", icon: User },
                   { title: "Find your job", desc: "There are many variations of passages of avaibale majority have suffered alteration.", icon: Search },
                   { title: "Apply for job", desc: "It is a long established fact that a reader will be distracted by the readable content.", icon: Briefcase },
                 ].map((step, idx) => (
                   <div key={idx} className="flex gap-4">
                     <div className="flex-shrink-0 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-200 dark:shadow-none">
                       {idx + 1}
                     </div>
                     <div>
                       <h4 className="text-xl font-bold mb-2">{step.title}</h4>
                       <p className="text-muted-foreground">{step.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

           </div>
        </div>
      </section>

    </div>
  );
}
