"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  // User Data State
  const [userData, setUserData] = useState<any>(null);
  
  // Form States
  const [title, setTitle] = useState("");
  const [skills, setSkills] = useState(""); // Comma separated string
  const [experience, setExperience] = useState<any[]>([]);
  
  // Fetch Data on Load
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [status, router]);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.user) {
        setUserData(data.user);
        // Initialize form values
        setTitle(data.user.title || "");
        setSkills(data.user.skills ? data.user.skills.join(", ") : "");
        setExperience(data.user.experience || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Convert comma string back to array
      const skillsArray = skills.split(",").map(s => s.trim()).filter(s => s);
      
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          skills: skillsArray,
          experience
        })
      });
      
      if (res.ok) {
        setIsEditing(false);
        fetchProfile(); // Refresh view
      }
    } catch (err) {
      alert("Failed to save");
    }
  };

  const addExperience = () => {
    setExperience([...experience, { company: "", role: "", years: 0 }]);
  };

  const updateExperience = (index: number, field: string, value: any) => {
    const newExp = [...experience];
    newExp[index][field] = value;
    setExperience(newExp);
  };

  const removeExperience = (index: number) => {
    const newExp = experience.filter((_, i) => i !== index);
    setExperience(newExp);
  };

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
        
        {/* HEADER */}
        <div className="bg-indigo-600 p-6 text-white flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">{userData?.name}</h1>
            <p className="text-indigo-100">{userData?.email}</p>
          </div>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="bg-white text-indigo-600 px-4 py-2 rounded font-bold hover:bg-gray-100"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          
          {/* EDIT MODE */}
          {isEditing ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-2">Professional Title</label>
                <input 
                  className="w-full border p-2 rounded" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g. Senior React Developer"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Skills (Comma separated)</label>
                <textarea 
                  className="w-full border p-2 rounded" 
                  value={skills} 
                  onChange={e => setSkills(e.target.value)} 
                  placeholder="React, Node.js, MongoDB, Python"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">Experience</label>
                {experience.map((exp, i) => (
                  <div key={i} className="border p-4 mb-2 rounded bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <input 
                        placeholder="Company" 
                        className="border p-2" 
                        value={exp.company} 
                        onChange={e => updateExperience(i, 'company', e.target.value)}
                      />
                      <input 
                        placeholder="Role" 
                        className="border p-2" 
                        value={exp.role} 
                        onChange={e => updateExperience(i, 'role', e.target.value)}
                      />
                    </div>
                    <div className="flex justify-between items-center">
                      <input 
                        type="number" 
                        placeholder="Years" 
                        className="border p-2 w-20" 
                        value={exp.years} 
                        onChange={e => updateExperience(i, 'years', e.target.value)}
                      />
                      <button onClick={() => removeExperience(i)} className="text-red-500 text-sm">Remove</button>
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="text-indigo-600 text-sm font-bold">+ Add Position</button>
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          ) : (
            
            /* VIEW MODE (THE AUTO-CV) */
            <div className="space-y-8">
              <div className="text-center border-b pb-6">
                <h2 className="text-2xl font-semibold text-gray-800">{userData?.title || "No Title Set"}</h2>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {userData?.skills?.map((skill: string, i: number) => (
                    <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-indigo-500 pl-3">Experience</h3>
                {userData?.experience?.length > 0 ? (
                  <div className="space-y-6">
                    {userData.experience.map((exp: any, i: number) => (
                      <div key={i} className="flex">
                        <div className="w-1 bg-gray-300 mr-4 relative">
                          <div className="absolute top-0 -left-1.5 w-4 h-4 rounded-full bg-indigo-500"></div>
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{exp.role}</h4>
                          <p className="text-gray-600">{exp.company}</p>
                          <p className="text-sm text-gray-500">{exp.years} Years</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No experience added yet.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}