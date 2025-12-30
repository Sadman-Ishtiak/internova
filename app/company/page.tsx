"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CompanyDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [myJobs, setMyJobs] = useState<any[]>([]);

  // Forms
  const [newCompany, setNewCompany] = useState({ 
    name: "", description: "", imageUrl: "", industry: "Tech",
    contact: { website: "", linkedin: "", email: "", phone: "", location: "" }
  });
  const [editCompanyForm, setEditCompanyForm] = useState<any>({ 
    name: "", description: "", imageUrl: "", status: "", industry: "Tech",
    contact: { website: "", linkedin: "", email: "", phone: "", location: "" }
  });
  const [jobForm, setJobForm] = useState({
    title: "",
    type: "job",
    imageUrl: "",
    requiredSkills: "",
    deadline: "",
    salary: { min: "", max: "", currency: "USD", period: "annually" }
  });
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldSetter: (url: string) => void) => {
    const file = e.target.files?.[0]; if (!file) return;
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
        setEditCompanyForm({
          name: data.company.name,
          description: data.company.description,
          imageUrl: data.company.imageUrl,
          status: data.company.status,
          industry: data.company.industry || "Tech",
          contact: data.company.contact || {}
        });
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

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/company", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCompanyForm)
      });
      const data = await res.json();
      if (res.ok) { setCompany(data.company); setIsEditingCompany(false); alert("Company updated!"); }
      else alert(data.error);
    } catch (error) { console.error("Error updating company:", error); }
  };

  const handlePostOrUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = typeof jobForm.requiredSkills === 'string' ? jobForm.requiredSkills.split(",").map(s => s.trim()).filter(s => s) : jobForm.requiredSkills;
      
      // Validate deadline is in the future
      if (new Date(jobForm.deadline) <= new Date()) {
        alert("Deadline must be in the future");
        return;
      }

      // Validate title
      if (!jobForm.title.trim()) {
        alert("Job title is required");
        return;
      }

      // Validate skills
      if (skillsArray.length === 0) {
        alert("At least one skill is required");
        return;
      }

      const method = editingJobId ? "PUT" : "POST";
      const body = {
        ...jobForm,
        requiredSkills: skillsArray,
        salary: {
          ...jobForm.salary,
          min: jobForm.salary.min ? parseInt(jobForm.salary.min) : null,
          max: jobForm.salary.max ? parseInt(jobForm.salary.max) : null
        },
        jobId: editingJobId ? editingJobId : undefined
      };
      const res = await fetch("/api/jobs", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) {
        alert(editingJobId ? "Job updated!" : "Job posted!");
        setIsPostingJob(false); setEditingJobId(null);
        setJobForm({ title: "", type: "job", imageUrl: "", requiredSkills: "", deadline: "", salary: { min: "", max: "", currency: "USD", period: "annually" }});
        if (company) fetchMyJobs(company._id);
      } else alert(data.error || "Failed to save job");
    } catch (error) { console.error("Error saving job:", error); alert("Error saving job"); }
  };
  
  const handleDeleteJob = async (jobId: string) => {
    if(!confirm("Are you sure?")) return;
    try {
      const res = await fetch("/api/jobs", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ jobId }) });
      if (res.ok && company) fetchMyJobs(company._id); else alert("Failed to delete job");
    } catch (error) { console.error("Error deleting job:", error); }
  };

  const startEditJob = (job: any) => {
    setJobForm({
      title: job.title,
      type: job.type || "job",
      imageUrl: job.imageUrl,
      requiredSkills: job.requiredSkills.join(", "),
      deadline: job.deadline ? new Date(job.deadline).toISOString().slice(0, 16) : "",
      salary: job.salary || { min: "", max: "", currency: "USD", period: "annually" }
    });
    setEditingJobId(job._id);
    setIsPostingJob(true);
  };
  
  const resetJobForm = () => {
    setJobForm({ title: "", type: "job", imageUrl: "", requiredSkills: "", deadline: "", salary: { min: "", max: "", currency: "USD", period: "annually" } });
    setEditingJobId(null);
  }

  if (status === "loading" || loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      {!company ? (
        <div className="bg-card p-8 rounded shadow-md border border-border">
           <h2 className="text-2xl font-bold mb-4">Register Your Company</h2>
           <form onSubmit={handleCreateCompany} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <input placeholder="Company Name" className="bg-background border border-border text-foreground p-2 rounded" value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} required />
               <input placeholder="Image URL (or use upload)" className="bg-background border border-border text-foreground p-2 rounded" value={newCompany.imageUrl} onChange={e => setNewCompany({...newCompany, imageUrl: e.target.value})} />
               <input type="file" onChange={e => handleImageUpload(e, (url) => setNewCompany({...newCompany, imageUrl: url}))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Industry</label>
              <select
                required
                className="w-full bg-background border border-border text-foreground p-2 rounded"
                value={newCompany.industry}
                onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
              >
                <option value="Tech">Technology</option>
                <option value="Finance">Finance & Banking</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Marketing">Marketing & Media</option>
                <option value="Service">Service & Hospitality</option>
                <option value="Other">Other</option>
              </select>
            </div>
             <textarea placeholder="Description" className="w-full bg-background border border-border text-foreground p-2 rounded" value={newCompany.description} onChange={e => setNewCompany({...newCompany, description: e.target.value})} required />
             <button type="submit" className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90">Register Company</button>
           </form>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Company Info */}
          {!isEditingCompany ? (
              <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                <img 
                  src={company.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`} 
                  alt="Logo" 
                  className="w-24 h-24 rounded object-cover border"
                />
                <div className="flex-1 w-full">
                  <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                      <h1 className="text-3xl font-bold text-foreground">{company.name}</h1>
                      <p className="text-muted-foreground">{company.industry}</p>
                    </div>
                    <button onClick={() => setIsEditingCompany(true)} className="text-primary hover:underline">Edit Company</button>
                  </div>
                  <p className="mt-2 text-muted-foreground">{company.description}</p>
                </div>
              </div>
          ) : (
              <form onSubmit={handleUpdateCompany} className="space-y-4 bg-muted p-4 rounded border border-border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company Name</label>
                    <input
                      type="text"
                      className="w-full bg-background border border-border text-foreground p-2 rounded"
                      value={editCompanyForm.name}
                      onChange={(e) => setEditCompanyForm({ ...editCompanyForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Industry</label>
                    <select
                      className="w-full bg-background border border-border text-foreground p-2 rounded"
                      value={editCompanyForm.industry}
                      onChange={(e) => setEditCompanyForm({ ...editCompanyForm, industry: e.target.value })}
                    >
                      <option value="Tech">Technology</option>
                      <option value="Finance">Finance & Banking</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Education">Education</option>
                      <option value="Marketing">Marketing & Media</option>
                      <option value="Service">Service & Hospitality</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      className="w-full bg-background border border-border text-foreground p-2 rounded"
                      value={editCompanyForm.status}
                      onChange={(e) => setEditCompanyForm({ ...editCompanyForm, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="sunset">Sunset (Closed)</option>
                    </select>
                  </div>
                </div>
                <textarea className="w-full bg-background border border-border text-foreground p-2 rounded" value={editCompanyForm.description} onChange={e => setEditCompanyForm({...editCompanyForm, description: e.target.value})} />
                <div className="flex gap-2">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Save</button>
                  <button type="button" onClick={() => setIsEditingCompany(false)} className="bg-muted text-muted-foreground px-4 py-2 rounded hover:bg-accent border border-border">Cancel</button>
                </div>
              </form>
          )}
          
          {/* Job Management */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Active Job Postings</h2>
              <button onClick={() => { setIsPostingJob(!isPostingJob); resetJobForm(); }} className="bg-primary text-primary-foreground px-4 py-2 rounded hover:opacity-90">
                {isPostingJob ? "Cancel" : "Post New Job"}
              </button>
            </div>

            {isPostingJob && (
              <div className="bg-muted p-6 rounded border border-border mb-6">
                <h3 className="text-lg font-bold mb-4">{editingJobId ? "Edit Circular" : "Create New Circular"}</h3>
                <form onSubmit={handlePostOrUpdateJob} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input placeholder="Job Title" className="bg-background border border-border text-foreground p-2 rounded" value={jobForm.title} onChange={e => setJobForm({...jobForm, title: e.target.value})} required />
                    <select className="bg-background border border-border text-foreground p-2 rounded" value={jobForm.type} onChange={e => setJobForm({...jobForm, type: e.target.value})}>
                      <option value="job">Job</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <input placeholder="Required Skills (comma separated)" className="bg-background border border-border text-foreground p-2 rounded w-full" value={jobForm.requiredSkills} onChange={e => setJobForm({...jobForm, requiredSkills: e.target.value})} required />
                  
                  {/* Salary Section */}
                  <div className="p-4 rounded-lg bg-accent border border-border">
                    <label className="block text-sm font-bold mb-2 text-primary">Salary</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <input type="number" placeholder="Min" className="bg-background border border-border text-foreground p-2 rounded" value={jobForm.salary.min} onChange={e => setJobForm({...jobForm, salary: {...jobForm.salary, min: e.target.value}})} />
                      <input type="number" placeholder="Max" className="bg-background border border-border text-foreground p-2 rounded" value={jobForm.salary.max} onChange={e => setJobForm({...jobForm, salary: {...jobForm.salary, max: e.target.value}})} />
                      <select className="bg-background border border-border text-foreground p-2 rounded" value={jobForm.salary.currency} onChange={e => setJobForm({...jobForm, salary: {...jobForm.salary, currency: e.target.value}})}>
                        <option>USD</option> <option>EUR</option> <option>GBP</option> <option>CAD</option> <option>AUD</option> <option>JPY</option>
                      </select>
                      <select className="bg-background border border-border text-foreground p-2 rounded" value={jobForm.salary.period} onChange={e => setJobForm({...jobForm, salary: {...jobForm.salary, period: e.target.value}})}>
                        <option value="annually">Annually</option> <option value="monthly">Monthly</option> <option value="hourly">Hourly</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Deadline (Date & Time)</label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full bg-background border border-border text-foreground p-2 rounded"
                      value={jobForm.deadline}
                      onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Job Image/Banner</label>
                    <input placeholder="Image URL" className="bg-background border border-border text-foreground p-2 rounded w-full" value={jobForm.imageUrl} onChange={e => setJobForm({...jobForm, imageUrl: e.target.value})} />
                    <input type="file" onChange={e => handleImageUpload(e, (url) => setJobForm({...jobForm, imageUrl: url}))} className="mt-2 text-sm" />
                  </div>

                  <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded hover:opacity-90">
                    Publish Circular
                  </button>
                </form>
              </div>
            )}
            
            {/* Job List Display - Restored */}
            <div className="space-y-4">
              {myJobs.length === 0 ? (
                <p className="text-gray-500">No jobs posted yet.</p>
              ) : (
                myJobs.map((job) => {
                  const isExpired = new Date(job.deadline) <= new Date();
                  return (
                    <div key={job._id} className={`bg-card p-4 rounded shadow flex flex-col md:flex-row justify-between items-start gap-4 border ${isExpired ? 'border-destructive/50 opacity-75' : 'border-border'}`}>
                      <div className="flex items-start gap-4 w-full md:w-auto">
                        <img 
                          src={job.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.title)}&background=random`} 
                          alt={job.title} 
                          className="w-20 h-20 object-cover rounded flex-shrink-0" 
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-lg flex flex-wrap items-center gap-2">
                            {job.title}
                            <span className={`text-xs px-2 py-1 rounded text-white ${job.type === 'internship' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                              {job.type}
                            </span>
                            {isExpired && (
                              <span className="text-xs px-2 py-1 rounded bg-destructive text-destructive-foreground">Expired</span>
                            )}
                          </h4>
                          <div className="text-sm text-muted-foreground">
                            Deadline: {new Date(job.deadline).toLocaleString('en-GB')}
                          </div>
                          {job.salary?.min && (
                             <div className="text-sm text-green-600 font-medium mt-1">
                               {job.salary.currency} {job.salary.min} - {job.salary.max} / {job.salary.period}
                             </div>
                          )}
                          {job.requiredSkills && job.requiredSkills.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {job.requiredSkills.slice(0, 3).map((skill: string, idx: number) => (
                                <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                  {skill}
                                </span>
                              ))}
                              {job.requiredSkills.length > 3 && (
                                <span className="text-xs text-muted-foreground">+{job.requiredSkills.length - 3} more</span>
                              )}
                            </div>
                          )}
                          <div className="flex gap-2 mt-3">
                            <button onClick={() => router.push(`/company/applicants/${job._id}`)} className="text-sm bg-primary/10 text-primary px-3 py-1 rounded hover:bg-primary/20 font-medium">
                              Applicants ({job.applicants?.length || 0})
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 w-full md:w-auto">
                        <button onClick={() => startEditJob(job)} className="flex-1 md:flex-none px-4 py-2 border border-border rounded hover:bg-accent text-primary hover:text-primary-foreground text-sm font-medium">
                          Edit
                        </button>
                        <button onClick={() => handleDeleteJob(job._id)} className="flex-1 md:flex-none px-4 py-2 border border-destructive/20 text-destructive rounded hover:bg-destructive/10 text-sm font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
