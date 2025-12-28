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
  const [newCompany, setNewCompany] = useState({ name: "", description: "" });
  const [jobForm, setJobForm] = useState({
    title: "",
    imageUrl: "",
    requiredSkills: "",
    deadline: ""
  });
  const [isPostingJob, setIsPostingJob] = useState(false);

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
        // Fetch jobs for this company
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

  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const skillsArray = jobForm.requiredSkills.split(",").map(s => s.trim()).filter(s => s);
      
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...jobForm,
          requiredSkills: skillsArray
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert("Job posted successfully!");
        setIsPostingJob(false);
        setJobForm({ title: "", imageUrl: "", requiredSkills: "", deadline: "" });
        if (company) fetchMyJobs(company._id);
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error posting job:", error);
    }
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
            <h1 className="text-3xl font-bold text-gray-800">{company.name}</h1>
            <p className="text-gray-600 mt-2">{company.description}</p>
            <div className="mt-4 inline-block bg-green-100 text-green-800 px-3 py-1 rounded text-sm">
              Status: {company.status}
            </div>
          </div>

          {/* Job Management */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Active Job Postings</h2>
              <button 
                onClick={() => setIsPostingJob(!isPostingJob)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                {isPostingJob ? "Cancel" : "Post New Job"}
              </button>
            </div>

            {isPostingJob && (
              <div className="bg-gray-50 p-6 rounded border mb-6">
                <h3 className="text-lg font-bold mb-4">Create New Circular</h3>
                <form onSubmit={handlePostJob} className="space-y-4">
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
                    <label className="block text-sm font-medium">Image URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://..."
                      className="w-full border p-2 rounded"
                      value={jobForm.imageUrl}
                      onChange={(e) => setJobForm({ ...jobForm, imageUrl: e.target.value })}
                    />
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
                  <div key={job._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <img src={job.imageUrl} alt="" className="w-16 h-16 object-cover rounded" />
                      <div>
                        <h4 className="font-bold text-lg">{job.title}</h4>
                        <p className="text-sm text-gray-500">
                          Deadline: {new Date(job.deadline).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-indigo-600">
                         {job.applicants?.length || 0} Applicants
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