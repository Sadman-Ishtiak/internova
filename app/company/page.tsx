"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CompanyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<any>(null);
  
  // Create Company Form
  const [compName, setCompName] = useState("");
  const [compDesc, setCompDesc] = useState("");

  // Post Job Form
  const [jobTitle, setJobTitle] = useState("");
  const [jobSkills, setJobSkills] = useState("");
  const [deadline, setDeadline] = useState("");
  const [uploading, setUploading] = useState(false);
  const [jobImage, setJobImage] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (status === "authenticated") fetchCompany();
  }, [status, router]);

  const fetchCompany = async () => {
    try {
      const res = await fetch("/api/company");
      const data = await res.json();
      setCompany(data.company); // null if no company
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 1. Image Upload Helper (Cloudinary)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "job-portal"); // Make sure this exists in Cloudinary
    formData.append("cloud_name", "de1mxdqed"); // REPLACE THIS WITH YOUR CLOUD NAME

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/de1mxdqed/image/upload`, {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      setJobImage(data.secure_url);
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 2. Create Company Logic
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/company", {
      method: "POST",
      body: JSON.stringify({ name: compName, description: compDesc })
    });
    if (res.ok) fetchCompany();
  };

  // 3. Post Job Logic
  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobImage) return alert("Circular Image is required");

    const skillsArray = jobSkills.split(",").map(s => s.trim());

    const res = await fetch("/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        title: jobTitle,
        requiredSkills: skillsArray,
        deadline,
        imageUrl: jobImage
      })
    });

    if (res.ok) {
      alert("Circular Posted!");
      setJobTitle("");
      setJobSkills("");
      setJobImage("");
    }
  };

  // 4. Sunset Logic
  const handleSunset = async () => {
    if(!confirm("Are you sure? This will delete all active jobs.")) return;
    // In a real app, you'd have a specific API for this. 
    // For now, we assume manual DB update or a specific route we haven't built yet.
    alert("Sunset feature would trigger here (Logic to set status='sunset')");
  };

  if (loading) return <div>Loading...</div>;

  // VIEW 1: NO COMPANY (Create One)
  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-4">Register Your Company</h2>
          <form onSubmit={handleCreateCompany} className="space-y-4">
            <input 
              className="w-full border p-2 rounded" 
              placeholder="Company Name" 
              value={compName} 
              onChange={e => setCompName(e.target.value)} 
            />
            <textarea 
              className="w-full border p-2 rounded" 
              placeholder="Description" 
              value={compDesc} 
              onChange={e => setCompDesc(e.target.value)} 
            />
            <button className="w-full bg-blue-600 text-white py-2 rounded">Create Company</button>
          </form>
        </div>
      </div>
    );
  }

  // VIEW 2: COMPANY DASHBOARD
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white p-6 rounded shadow mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{company.name}</h1>
            <p className="text-gray-500">{company.description}</p>
            <span className={`px-2 py-1 rounded text-sm ${company.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100'}`}>
              {company.status.toUpperCase()}
            </span>
          </div>
          {company.ownerId === session?.user?.id && (
            <button onClick={handleSunset} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Sunset Company
            </button>
          )}
        </div>

        {/* Post Job Form */}
        {company.status === 'active' && (
          <div className="bg-white p-6 rounded shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Post New Circular</h2>
            <form onSubmit={handlePostJob} className="grid grid-cols-1 gap-4">
              <input 
                className="border p-2 rounded" 
                placeholder="Job Title (e.g. Senior React Dev)" 
                value={jobTitle} 
                onChange={e => setJobTitle(e.target.value)} 
              />
              
              <input 
                className="border p-2 rounded" 
                placeholder="Required Skills (Comma separated: React, Node, CSS)" 
                value={jobSkills} 
                onChange={e => setJobSkills(e.target.value)} 
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Deadline</label>
                  <input 
                    type="date" 
                    className="border p-2 rounded w-full" 
                    value={deadline} 
                    onChange={e => setDeadline(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Circular Image</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border p-1 rounded w-full"
                  />
                  {uploading && <span className="text-sm text-blue-500">Uploading...</span>}
                </div>
              </div>

              <button 
                disabled={uploading || !jobImage}
                className="bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:bg-gray-400"
              >
                Post Circular
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}