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
    name: "", 
    description: "", 
    imageUrl: "",
    contact: { website: "", linkedin: "", email: "", phone: "", location: "" }
  });
  const [editCompanyForm, setEditCompanyForm] = useState({ 
    name: "", 
    description: "", 
    imageUrl: "", 
    status: "",
    contact: { website: "", linkedin: "", email: "", phone: "", location: "" }
  });
  const [jobForm, setJobForm] = useState({
    title: "",
    type: "job",
    imageUrl: "",
    requiredSkills: "",
    deadline: ""
  });
  const [isPostingJob, setIsPostingJob] = useState(false);
  const [isEditingCompany, setIsEditingCompany] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldSetter: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        fieldSetter(data.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchCompanyData();
    }
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
          contact: {
            website: data.company.contact?.website || "",
            linkedin: data.company.contact?.linkedin || "",
            email: data.company.contact?.email || "",
            phone: data.company.contact?.phone || "",
            location: data.company.contact?.location || ""
          }
        });
        fetchMyJobs(data.company._id);
      }
    } catch (error) {
      console.error("Error fetching company:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyJobs = async (companyId: string) => {
    try {
      const res = await fetch(`/api/jobs?companyId=${companyId}`);
      const data = await res.json();
      setMyJobs(data.jobs || []);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };

  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCompany)
      });
      
      const data = await res.json();
      if (res.ok) {
        setCompany(data.company);
        alert("Company registered successfully!");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error creating company:", error);
    }
  };

  const handleUpdateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editCompanyForm)
      });
      
      const data = await res.json();
      if (res.ok) {
        setCompany(data.company);
        setIsEditingCompany(false);
        alert("Company updated successfully!");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error updating company:", error);
    }
  };

  const handlePostOrUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = typeof jobForm.requiredSkills === 'string' 
        ? jobForm.requiredSkills.split(",").map(s => s.trim()).filter(s => s)
        : jobForm.requiredSkills;
      
      const method = editingJobId ? "PUT" : "POST";
      const body = editingJobId 
        ? { ...jobForm, requiredSkills: skillsArray, jobId: editingJobId }
        : { ...jobForm, requiredSkills: skillsArray };

      const res = await fetch("/api/jobs", {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (res.ok) {
        alert(editingJobId ? "Job updated successfully!" : "Job posted successfully!");
        setIsPostingJob(false);
        setEditingJobId(null);
        setJobForm({ title: "", type: "job", imageUrl: "", requiredSkills: "", deadline: "" });
        if (company) fetchMyJobs(company._id);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error saving job:", error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if(!confirm("Are you sure you want to delete this job?")) return;
    try {
      const res = await fetch("/api/jobs", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId })
      });
      if (res.ok) {
        if (company) fetchMyJobs(company._id);
      } else {
        alert("Failed to delete job");
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const startEditJob = (job: any) => {
    setJobForm({
      title: job.title,
      type: job.type || "job",
      imageUrl: job.imageUrl,
      requiredSkills: job.requiredSkills.join(", "),
      deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : ""
    });
    setEditingJobId(job._id);
    setIsPostingJob(true);
  };

  if (status === "loading" || loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {!company ? (
        <div className="bg-white p-8 rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Register Your Company</h2>
          <form onSubmit={handleCreateCompany} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Company Name</label>
              <input
                type="text"
                required
                className="w-full border p-2 rounded"
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Company Logo</label>
              <div className="flex items-center gap-4">
                 {newCompany.imageUrl && (
                   <img src={newCompany.imageUrl} alt="Preview" className="w-12 h-12 object-cover rounded" />
                 )}
                 <input
                  type="file"
                  accept="image/*"
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                  onChange={(e) => handleImageUpload(e, (url) => setNewCompany(prev => ({ ...prev, imageUrl: url })))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <input placeholder="Website URL" className="border p-2 rounded" value={newCompany.contact.website} onChange={e => setNewCompany({...newCompany, contact: {...newCompany.contact, website: e.target.value}})} />
              <input placeholder="LinkedIn URL" className="border p-2 rounded" value={newCompany.contact.linkedin} onChange={e => setNewCompany({...newCompany, contact: {...newCompany.contact, linkedin: e.target.value}})} />
              <input placeholder="Public Email" className="border p-2 rounded" value={newCompany.contact.email} onChange={e => setNewCompany({...newCompany, contact: {...newCompany.contact, email: e.target.value}})} />
              <input placeholder="Phone" className="border p-2 rounded" value={newCompany.contact.phone} onChange={e => setNewCompany({...newCompany, contact: {...newCompany.contact, phone: e.target.value}})} />
              <input placeholder="Location" className="border p-2 rounded col-span-2" value={newCompany.contact.location} onChange={e => setNewCompany({...newCompany, contact: {...newCompany.contact, location: e.target.value}})} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                className="w-full border p-2 rounded"
                value={newCompany.description}
                onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
              />
            </div>
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Register Company
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Company Info */}
          <div className="bg-white p-6 rounded shadow-md">
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
                      <h1 className="text-3xl font-bold text-gray-800">{company.name}</h1>
                      <p className="text-gray-600 mt-2">{company.description}</p>
                      {company.contact && (
                        <div className="mt-3 text-sm text-gray-500 flex gap-4 flex-wrap">
                          {company.contact.location && <span>{company.contact.location}</span>}
                          {company.contact.website && <a href={company.contact.website} target="_blank" className="text-indigo-600 hover:underline">Website</a>}
                          {company.contact.linkedin && <a href={company.contact.linkedin} target="_blank" className="text-blue-600 hover:underline">LinkedIn</a>}
                        </div>
                      )}
                      <div className={`mt-4 inline-block px-3 py-1 rounded text-sm ${company.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        Status: {company.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => window.open(`/company/${company._id}`, '_blank')}
                        className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded font-bold text-sm hover:bg-emerald-100"
                      >
                        Public Page
                      </button>
                      <button 
                        onClick={() => setIsEditingCompany(true)}
                        className="bg-indigo-50 text-indigo-600 border border-indigo-200 px-3 py-1 rounded font-bold text-sm hover:bg-indigo-100"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateCompany} className="space-y-4">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-xl font-bold">Edit Company Details</h2>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Company Name</label>
                    <input
                      type="text"
                      className="w-full border p-2 rounded"
                      value={editCompanyForm.name}
                      onChange={(e) => setEditCompanyForm({ ...editCompanyForm, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      className="w-full border p-2 rounded"
                      value={editCompanyForm.status}
                      onChange={(e) => setEditCompanyForm({ ...editCompanyForm, status: e.target.value })}
                    >
                      <option value="active">Active</option>
                      <option value="sunset">Sunset (Closed)</option>
                    </select>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-medium mb-1">Company Logo</label>
                   <div className="flex items-center gap-4">
                      {editCompanyForm.imageUrl && (
                        <img src={editCompanyForm.imageUrl} alt="Preview" className="w-12 h-12 object-cover rounded" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-50 file:text-indigo-700
                          hover:file:bg-indigo-100"
                        onChange={(e) => handleImageUpload(e, (url) => setEditCompanyForm(prev => ({ ...prev, imageUrl: url })))}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded">
                  <h3 className="col-span-2 text-sm font-bold text-gray-500 uppercase">Contact Information</h3>
                  <input placeholder="Website URL" className="border p-2 rounded" value={editCompanyForm.contact.website} onChange={e => setEditCompanyForm({...editCompanyForm, contact: {...editCompanyForm.contact, website: e.target.value}})} />
                  <input placeholder="LinkedIn URL" className="border p-2 rounded" value={editCompanyForm.contact.linkedin} onChange={e => setEditCompanyForm({...editCompanyForm, contact: {...editCompanyForm.contact, linkedin: e.target.value}})} />
                  <input placeholder="Public Email" className="border p-2 rounded" value={editCompanyForm.contact.email} onChange={e => setEditCompanyForm({...editCompanyForm, contact: {...editCompanyForm.contact, email: e.target.value}})} />
                  <input placeholder="Phone" className="border p-2 rounded" value={editCompanyForm.contact.phone} onChange={e => setEditCompanyForm({...editCompanyForm, contact: {...editCompanyForm.contact, phone: e.target.value}})} />
                  <input placeholder="Location" className="border p-2 rounded col-span-2" value={editCompanyForm.contact.location} onChange={e => setEditCompanyForm({...editCompanyForm, contact: {...editCompanyForm.contact, location: e.target.value}})} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    className="w-full border p-2 rounded"
                    value={editCompanyForm.description}
                    onChange={(e) => setEditCompanyForm({ ...editCompanyForm, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Save Changes
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsEditingCompany(false)}
                    className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Job Management */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Active Job Postings</h2>
              <button 
                onClick={() => {
                  setIsPostingJob(!isPostingJob);
                  setEditingJobId(null);
                  setJobForm({ title: "", type: "job", imageUrl: "", requiredSkills: "", deadline: "" });
                }}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {isPostingJob ? "Cancel" : "Post New Job"}
              </button>
            </div>

            {isPostingJob && (
              <div className="bg-gray-50 p-6 rounded border mb-6">
                <h3 className="text-lg font-bold mb-4">{editingJobId ? "Edit Circular" : "Create New Circular"}</h3>
                <form onSubmit={handlePostOrUpdateJob} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Job Title</label>
                    <input
                      type="text"
                      required
                      className="w-full border p-2 rounded"
                      value={jobForm.title}
                      onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Type</label>
                    <select
                      className="w-full border p-2 rounded"
                      value={jobForm.type}
                      onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                    >
                      <option value="job">Job</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Circular Image</label>
                    <div className="flex items-center gap-4">
                      {jobForm.imageUrl && (
                        <img src={jobForm.imageUrl} alt="Preview" className="w-12 h-12 object-cover rounded" />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="block w-full text-sm text-slate-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-indigo-50 file:text-indigo-700
                          hover:file:bg-indigo-100"
                        onChange={(e) => handleImageUpload(e, (url) => setJobForm(prev => ({ ...prev, imageUrl: url })))}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Required Skills (comma separated)</label>
                    <input
                      type="text"
                      required
                      placeholder="React, Node.js, MongoDB"
                      className="w-full border p-2 rounded"
                      value={jobForm.requiredSkills}
                      onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Deadline</label>
                    <input
                      type="date"
                      required
                      className="w-full border p-2 rounded"
                      value={jobForm.deadline}
                      onChange={(e) => setJobForm({ ...jobForm, deadline: e.target.value })}
                    />
                  </div>
                  <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
                    Publish Circular
                  </button>
                </form>
              </div>
            )}

            <div className="grid gap-4">
              {myJobs.length === 0 ? (
                <p className="text-gray-500">No active jobs posted yet.</p>
              ) : (
                myJobs.map((job) => (
                  <div key={job._id} className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <img src={job.imageUrl} alt="" className="w-16 h-16 object-cover rounded flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-lg flex flex-wrap items-center gap-2">
                          {job.title}
                          <span className={`text-xs px-2 py-0.5 rounded text-white ${job.type === 'internship' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                            {job.type === 'internship' ? 'Internship' : 'Job'}
                          </span>
                        </h4>
                        <p className="text-sm text-gray-500">
                          Deadline: {new Date(job.deadline).toLocaleDateString('en-GB')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <div className="text-sm font-bold text-indigo-600">
                         {job.applicants?.length || 0} Applicants
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => router.push(`/company/applicants/${job._id}`)}
                          className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200"
                        >
                          View Applicants
                        </button>
                        <button 
                          onClick={() => startEditJob(job)}
                          className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteJob(job._id)}
                          className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
