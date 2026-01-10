"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  Plus, 
  Briefcase, 
  Clock, 
  MapPin, 
  DollarSign,
  ChevronLeft,
  Loader2,
  Building2
} from "lucide-react";

function PostJobFormContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const editingJobId = searchParams.get("edit");
  
  const [loading, setLoading] = useState(false);
  const [fetchingJob, setFetchingJob] = useState(!!editingJobId);
  const [jobForm, setJobForm] = useState({
    title: "",
    type: "job",
    location: "Remote",
    category: "",
    description: "",
    imageUrl: "",
    requiredSkills: "",
    deadline: "",
    salary: { min: "", max: "", currency: "BDT", period: "monthly" }
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (editingJobId) fetchJobToEdit();
  }, [status, editingJobId]);

  const fetchJobToEdit = async () => {
    try {
      const res = await fetch(`/api/jobs/${editingJobId}`);
      const data = await res.json();
      if (res.ok && data.job) {
        setJobForm({
          title: data.job.title,
          type: data.job.type || "job",
          location: data.job.location || "Remote",
          category: data.job.category || "",
          description: data.job.description || "",
          imageUrl: data.job.imageUrl,
          requiredSkills: data.job.requiredSkills.join(", "),
          deadline: data.job.deadline ? new Date(data.job.deadline).toISOString().slice(0, 16) : "",
          salary: data.job.salary || { min: "", max: "", currency: "BDT", period: "monthly" }
        });
      }
    } catch (error) {
      console.error("Error fetching job:", error);
    } finally {
      setFetchingJob(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const formData = new FormData(); formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setJobForm({ ...jobForm, imageUrl: data.url }); else alert("Upload failed");
    } catch (err) { console.error(err); alert("Error uploading image"); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const skillsArray = typeof jobForm.requiredSkills === 'string' 
        ? jobForm.requiredSkills.split(",").map(s => s.trim()).filter(s => s) 
        : jobForm.requiredSkills;
      
      if (new Date(jobForm.deadline) <= new Date()) {
        alert("Deadline must be in the future");
        setLoading(false);
        return;
      }

      const method = editingJobId ? "PUT" : "POST";
      const body = {
        ...jobForm,
        requiredSkills: skillsArray,
        salary: {
          ...jobForm.salary,
          min: jobForm.salary.min ? parseInt(jobForm.salary.min as any) : null,
          max: jobForm.salary.max ? parseInt(jobForm.salary.max as any) : null
        },
        jobId: editingJobId || undefined
      };

      const res = await fetch("/api/jobs", { 
        method, 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(body) 
      });

      if (res.ok) {
        alert(editingJobId ? "Job updated!" : "Job posted!");
        router.push("/company");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to save job");
      }
    } catch (error) {
      console.error("Error saving job:", error);
      alert("Error saving job");
    } finally {
      setLoading(false);
    }
  };

  if (fetchingJob) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <Link href="/company" className="inline-flex items-center text-sm text-muted-foreground hover:text-indigo-600 transition-colors mb-4">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
        </Link>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
            <Plus className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">{editingJobId ? "Edit Circular" : "Post New Circular"}</h1>
            <p className="text-muted-foreground">Fill in the details to find your next great hire.</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Job Title</label>
              <input 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                placeholder="e.g. Senior Frontend Developer" 
                value={jobForm.title} 
                onChange={e => setJobForm({...jobForm, title: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Job Category</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                value={jobForm.category} 
                onChange={e => setJobForm({...jobForm, category: e.target.value})}
                required
              >
                <option value="">Select Category</option>
                <option value="IT & Software">IT & Software</option>
                <option value="Finance & Accounting">Finance & Accounting</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
                <option value="Human Resources">Human Resources</option>
                <option value="Design & Multimedia">Design & Multimedia</option>
                <option value="Management">Management</option>
                <option value="Legal">Legal</option>
                <option value="Operations">Operations</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Location</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                value={jobForm.location} 
                onChange={e => setJobForm({...jobForm, location: e.target.value})}
              >
                <option value="Remote">Remote</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chattogram">Chattogram</option>
                <option value="Sylhet">Sylhet</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Khulna">Khulna</option>
                <option value="Barishal">Barishal</option>
                <option value="Rangpur">Rangpur</option>
                <option value="Mymensingh">Mymensingh</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Employment Type</label>
              <select 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                value={jobForm.type} 
                onChange={e => setJobForm({...jobForm, type: e.target.value})}
              >
                <option value="job">Full Time Job</option>
                <option value="internship">Internship</option>
              </select>
            </div>
          </div>

          {/* Image & Skills */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Banner Image (Optional)</label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center border-2 border-dashed border-border overflow-hidden">
                  {jobForm.imageUrl ? <img src={jobForm.imageUrl} className="w-full h-full object-cover" /> : <Briefcase className="w-5 h-5 text-slate-400" />}
                </div>
                <input type="file" className="text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={handleImageUpload} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-foreground">Skills Required <span className="text-xs font-normal text-muted-foreground">(comma separated)</span></label>
              <input 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                placeholder="React, Node.js, TypeScript" 
                value={jobForm.requiredSkills} 
                onChange={e => setJobForm({...jobForm, requiredSkills: e.target.value})} 
                required 
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-foreground">Job Description</label>
            <textarea 
              className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all h-40" 
              placeholder="Detailed description of the role, responsibilities, and requirements..." 
              value={jobForm.description} 
              onChange={e => setJobForm({...jobForm, description: e.target.value})} 
            />
          </div>

          {/* Salary & Deadline */}
          <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-border">
            <div className="space-y-4">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-green-600" /> Salary Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                 <div className="space-y-1">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold ml-1">Minimum</span>
                    <input type="number" placeholder="0" className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-3 rounded-xl outline-none" value={jobForm.salary.min} onChange={e => setJobForm({...jobForm, salary: {...jobForm.salary, min: e.target.value}})} />
                 </div>
                 <div className="space-y-1">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold ml-1">Maximum</span>
                    <input type="number" placeholder="0" className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-3 rounded-xl outline-none" value={jobForm.salary.max} onChange={e => setJobForm({...jobForm, salary: {...jobForm.salary, max: e.target.value}})} />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                 <select className="bg-slate-50 dark:bg-slate-800 border border-border p-3 rounded-xl outline-none text-sm" value={jobForm.salary.currency} onChange={e => setJobForm({...jobForm, salary: {...jobForm.salary, currency: e.target.value}})}>
                    <option>BDT</option> <option>USD</option> <option>EUR</option> <option>INR</option>
                 </select>
                 <select className="bg-slate-50 dark:bg-slate-800 border border-border p-3 rounded-xl outline-none text-sm" value={jobForm.salary.period} onChange={e => setJobForm({...jobForm, salary: {...jobForm.salary, period: e.target.value}})}>
                    <option value="monthly">Monthly</option> <option value="annually">Annually</option> <option value="hourly">Hourly</option>
                 </select>
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" /> Application Deadline
              </label>
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-muted-foreground font-bold ml-1">Expiry Date & Time</span>
                <input 
                  type="datetime-local" 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  value={jobForm.deadline} 
                  onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })} 
                  required 
                />
              </div>
              <p className="text-[11px] text-muted-foreground px-1 italic">
                Note: The circular will automatically be moved to "Expired" after this time.
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-border flex flex-col md:flex-row gap-4">
            <button 
              type="submit" 
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {editingJobId ? "Save Changes" : "Publish Job Posting"}
            </button>
            <Link 
              href="/company" 
              className="px-10 py-4 bg-slate-100 dark:bg-slate-800 font-bold rounded-xl hover:bg-slate-200 transition-all text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PostJobPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      }>
        <PostJobFormContent />
      </Suspense>
    </div>
  );
}
