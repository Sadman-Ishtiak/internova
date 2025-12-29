"use client";

import { useSession, signOut } from "next-auth/react";
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
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [skills, setSkills] = useState(""); // Comma separated string
  const [experience, setExperience] = useState<any[]>([]);
  
  // New States
  const [contact, setContact] = useState({
    phone: "",
    linkedin: "",
    github: "",
    website: "",
    location: ""
  });
  
  const [certifications, setCertifications] = useState<any[]>([]);

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
        setName(data.user.name || "");
        setTitle(data.user.title || "");
        setImageUrl(data.user.profileImage || "");
        setSkills(data.user.skills ? data.user.skills.join(", ") : "");
        setExperience(data.user.experience || []);
        
        // Initialize new values
        setContact({
          phone: data.user.contact?.phone || "",
          linkedin: data.user.contact?.linkedin || "",
          github: data.user.contact?.github || "",
          website: data.user.contact?.website || "",
          location: data.user.contact?.location || ""
        });
        setCertifications(data.user.certifications || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      if (res.ok) {
        setImageUrl(data.url);
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
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
          name,
          title,
          profileImage: imageUrl,
          skills: skillsArray,
          experience,
          contact,
          certifications
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

  // Helper functions for array updates
  const addExperience = () => {
    setExperience([...experience, { company: "", role: "", years: 0 }]);
  };
  const updateExperience = (index: number, field: string, value: any) => {
    const newExp = [...experience];
    newExp[index][field] = value;
    setExperience(newExp);
  };
  const removeExperience = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    setCertifications([...certifications, { name: "", issuer: "", date: "", type: "Professional", url: "" }]);
  };
  const updateCertification = (index: number, field: string, value: any) => {
    const newCerts = [...certifications];
    newCerts[index][field] = value;
    setCertifications(newCerts);
  };
  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
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
          
          <div className="flex gap-2">
            <button 
              onClick={() => window.open(`/users/${userData._id}`, '_blank')}
              className="bg-emerald-500 text-white px-4 py-2 rounded font-bold hover:bg-emerald-400"
            >
              View Public CV
            </button>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white text-indigo-600 px-4 py-2 rounded font-bold hover:bg-gray-100"
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
            <button 
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="bg-red-500 text-white px-4 py-2 rounded font-bold hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-8">
          
          {/* EDIT MODE */}
          {isEditing ? (
            <div className="space-y-8">
              
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label className="block text-sm font-bold mb-2">Profile Image</label>
                    <div className="flex items-center gap-4">
                      {imageUrl && (
                        <img 
                          src={imageUrl} 
                          alt="Preview" 
                          className="w-16 h-16 rounded-full object-cover border"
                        />
                      )}
                      <input 
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" 
                      />
                                    </div>
                                  </div>
                    
                                  <div>
                                    <label className="block text-sm font-bold mb-2">Full Name</label>
                                    <input 
                                      className="w-full border p-2 rounded" 
                                      value={name} 
                                      onChange={e => setName(e.target.value)} 
                                      placeholder="Your Full Name"
                                    />
                                  </div>
                    
                                  <div>
                                    <label className="block text-sm font-bold mb-2">Professional Title</label>
                    <input 
                      className="w-full border p-2 rounded" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)} 
                      placeholder="e.g. Senior React Developer"
                    />
                 </div>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-bold text-gray-700 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input placeholder="Phone" className="border p-2 rounded" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} />
                  <input placeholder="Location (City, Country)" className="border p-2 rounded" value={contact.location} onChange={e => setContact({...contact, location: e.target.value})} />
                  <input placeholder="LinkedIn URL" className="border p-2 rounded" value={contact.linkedin} onChange={e => setContact({...contact, linkedin: e.target.value})} />
                  <input placeholder="GitHub URL" className="border p-2 rounded" value={contact.github} onChange={e => setContact({...contact, github: e.target.value})} />
                  <input placeholder="Portfolio Website" className="border p-2 rounded md:col-span-2" value={contact.website} onChange={e => setContact({...contact, website: e.target.value})} />
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-bold mb-2">Skills (Comma separated)</label>
                <textarea 
                  className="w-full border p-2 rounded" 
                  value={skills} 
                  onChange={e => setSkills(e.target.value)} 
                  placeholder="React, Node.js, MongoDB, Python"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-bold mb-2">Experience</label>
                {experience.map((exp, i) => (
                  <div key={i} className="border p-4 mb-2 rounded bg-gray-50 relative">
                    <button onClick={() => removeExperience(i)} className="absolute top-2 right-2 text-red-500 font-bold">×</button>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <input placeholder="Company" className="border p-2" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} />
                      <input placeholder="Role" className="border p-2" value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} />
                    </div>
                    <div className="flex gap-4">
                       <input type="number" placeholder="Years" className="border p-2 w-20" value={exp.years} onChange={e => updateExperience(i, 'years', e.target.value)} />
                       <input placeholder="Description (Optional)" className="border p-2 flex-1" value={exp.description || ""} onChange={e => updateExperience(i, 'description', e.target.value)} />
                    </div>
                  </div>
                ))}
                <button onClick={addExperience} className="text-indigo-600 text-sm font-bold">+ Add Position</button>
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-bold mb-2">Certifications & Awards</label>
                {certifications.map((cert, i) => (
                  <div key={i} className="border p-4 mb-2 rounded bg-gray-50 relative">
                    <button onClick={() => removeCertification(i)} className="absolute top-2 right-2 text-red-500 font-bold">×</button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                      <input placeholder="Name (e.g. AWS Solutions Architect)" className="border p-2" value={cert.name} onChange={e => updateCertification(i, 'name', e.target.value)} />
                      <input placeholder="Issuer (e.g. Amazon)" className="border p-2" value={cert.issuer} onChange={e => updateCertification(i, 'issuer', e.target.value)} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                       <div className="flex flex-col">
                         <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Type</label>
                         <select className="border p-2 rounded" value={cert.type} onChange={e => updateCertification(i, 'type', e.target.value)}>
                           <option value="Professional">Professional</option>
                           <option value="Academic">Academic</option>
                           <option value="Extracurricular">Extracurricular</option>
                         </select>
                       </div>
                       <div className="flex flex-col">
                         <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Issue Date</label>
                         <input type="date" className="border p-2 rounded" value={cert.date ? new Date(cert.date).toISOString().split('T')[0] : ""} onChange={e => updateCertification(i, 'date', e.target.value)} />
                       </div>
                       <div className="flex flex-col">
                         <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 ml-1">Verification URL</label>
                         <input placeholder="https://..." className="border p-2 rounded" value={cert.url} onChange={e => updateCertification(i, 'url', e.target.value)} />
                       </div>
                    </div>
                  </div>
                ))}
                <button onClick={addCertification} className="text-indigo-600 text-sm font-bold">+ Add Certification</button>
              </div>

              <button 
                onClick={handleSave}
                className="w-full bg-green-600 text-white py-3 rounded font-bold hover:bg-green-700"
              >
                Save Changes
              </button>
            </div>
          ) : (
            
            /* VIEW MODE */
            <div className="space-y-8">
              
              {/* Header Info */}
              <div className="text-center border-b pb-6">
                <h2 className="text-2xl font-semibold text-gray-800">{userData?.name}</h2>
                <h3 className="text-lg text-indigo-600 font-medium mt-1">{userData?.title || "No Title Set"}</h3>
                {userData?.contact?.location && <p className="text-gray-500 mt-1">{userData.contact.location}</p>}
                
                {/* Contact Links */}
                <div className="flex justify-center gap-4 mt-3">
                  {userData?.contact?.linkedin && <a href={userData.contact.linkedin} target="_blank" className="text-blue-600 hover:underline">LinkedIn</a>}
                  {userData?.contact?.github && <a href={userData.contact.github} target="_blank" className="text-gray-800 hover:underline">GitHub</a>}
                  {userData?.contact?.website && <a href={userData.contact.website} target="_blank" className="text-indigo-600 hover:underline">Portfolio</a>}
                  {userData?.contact?.phone && <span className="text-gray-600">{userData.contact.phone}</span>}
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  {userData?.skills?.map((skill: string, i: number) => (
                    <span key={i} className="bg-gray-200 px-3 py-1 rounded-full text-sm text-gray-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
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
                          {exp.description && <p className="text-gray-600 mt-1">{exp.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No experience added yet.</p>
                )}
              </div>

              {/* Certifications Grouped */}
              {userData?.certifications?.length > 0 && (
                <div>
                   <h3 className="text-xl font-bold text-gray-800 mb-4 border-l-4 border-green-500 pl-3">Certifications & Activities</h3>
                   <div className="space-y-4">
                     {['Academic', 'Professional', 'Extracurricular'].map(type => {
                       const certs = userData.certifications.filter((c: any) => (c.type || 'Professional') === type);
                       if (certs.length === 0) return null;
                       return (
                         <div key={type} className="mb-4">
                           <h4 className="font-bold text-gray-700 uppercase text-sm tracking-wide mb-2">{type}</h4>
                           <ul className="space-y-2">
                             {certs.map((cert: any, i: number) => (
                               <li key={i} className="bg-gray-50 p-3 rounded flex justify-between items-center">
                                 <div>
                                   <p className="font-bold">{cert.name}</p>
                                   <p className="text-sm text-gray-600">{cert.issuer}</p>
                                 </div>
                                 <div className="text-right">
                                   {cert.date && <p className="text-xs text-gray-500">{new Date(cert.date).toLocaleDateString('en-GB')}</p>}
                                   {cert.url && <a href={cert.url} target="_blank" className="text-indigo-600 text-xs hover:underline">Verify</a>}
                                 </div>
                               </li>
                             ))}
                           </ul>
                         </div>
                       );
                     })}
                   </div>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
