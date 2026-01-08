"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ChevronLeft, 
  User, 
  Briefcase, 
  Award, 
  MapPin, 
  Linkedin, 
  Github, 
  Globe, 
  Phone,
  Plus,
  Trash2,
  Loader2,
  Save
} from "lucide-react";

export default function EditProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form States
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [skills, setSkills] = useState("");
  const [experience, setExperience] = useState<any[]>([]);
  const [contact, setContact] = useState({
    phone: "",
    linkedin: "",
    github: "",
    website: "",
    location: "" // Commas separated
  });
  const [certifications, setCertifications] = useState<any[]>([]);

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
        setName(data.user.name || "");
        setTitle(data.user.title || "");
        setImageUrl(data.user.profileImage || "");
        setSkills(data.user.skills?.join(", ") || "");
        setExperience(data.user.experience || []);
        setContact({
          phone: data.user.contact?.phone || "",
          linkedin: data.user.contact?.linkedin || "",
          github: data.user.contact?.github || "",
          website: data.user.contact?.website || "",
          location: data.user.contact?.location?.join(", ") || ""
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
      setSaving(true);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setImageUrl(data.url);
      else alert("Upload failed");
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const skillsArray = skills.split(",").map(s => s.trim()).filter(s => s);
      const locationArray = contact.location.split(",").map(s => s.trim()).filter(s => s);
      
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          title,
          profileImage: imageUrl,
          skills: skillsArray,
          experience,
          contact: { ...contact, location: locationArray },
          certifications
        })
      });
      
      if (res.ok) {
        router.push("/profile");
      }
    } catch (err) {
      alert("Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  const addExperience = () => setExperience([...experience, { company: "", role: "", years: 0, description: "" }]);
  const updateExperience = (index: number, field: string, value: any) => {
    const newExp = [...experience];
    newExp[index][field] = value;
    setExperience(newExp);
  };
  const removeExperience = (index: number) => setExperience(experience.filter((_, i) => i !== index));

  const addCertification = () => setCertifications([...certifications, { name: "", issuer: "", date: "", type: "Professional", url: "" }]);
  const updateCertification = (index: number, field: string, value: any) => {
    const newCerts = [...certifications];
    newCerts[index][field] = value;
    setCertifications(newCerts);
  };
  const removeCertification = (index: number) => setCertifications(certifications.filter((_, i) => i !== index));

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Link href="/profile" className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Profile
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
              <User className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Edit Your Profile</h1>
              <p className="text-muted-foreground">Keep your professional information up to date.</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-8">
          
          {/* Section: Basic Info */}
          <section className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold mb-2">Profile Image</label>
                <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-border">
                  <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 border border-border overflow-hidden relative group">
                    <Image 
                      src={imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "User")}&background=random`} 
                      alt="Profile" 
                      fill
                      unoptimized
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      className="block w-full text-xs text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" 
                    />
                    <p className="text-[10px] text-muted-foreground mt-2 uppercase tracking-wider font-bold">Recommended: Square JPEG or PNG, max 2MB</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Full Name</label>
                <input 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  value={name} 
                  onChange={e => setName(e.target.value)} 
                  placeholder="Your Full Name"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Professional Title</label>
                <input 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                  value={title} 
                  onChange={e => setTitle(e.target.value)} 
                  placeholder="e.g. Full Stack Developer"
                />
              </div>
            </div>
          </section>

          {/* Section: Contact Info */}
          <section className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-blue-500 rounded-full"></div>
              Contact & Links
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={contact.phone} onChange={e => setContact({...contact, phone: e.target.value})} placeholder="+880 1234..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Location Tags</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={contact.location} onChange={e => setContact({...contact, location: e.target.value})} placeholder="Dhaka, Remote, Chittagong" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">LinkedIn URL</label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={contact.linkedin} onChange={e => setContact({...contact, linkedin: e.target.value})} placeholder="https://linkedin.com/in/..." />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">GitHub URL</label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={contact.github} onChange={e => setContact({...contact, github: e.target.value})} placeholder="https://github.com/..." />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Portfolio Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" value={contact.website} onChange={e => setContact({...contact, website: e.target.value})} placeholder="https://yourportfolio.com" />
                </div>
              </div>
            </div>
          </section>

          {/* Section: Skills */}
          <section className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full"></div>
              Technical Skills
            </h2>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Skills (Comma separated)</label>
              <textarea 
                className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-4 rounded-xl min-h-[100px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                value={skills} 
                onChange={e => setSkills(e.target.value)} 
                placeholder="React, Node.js, MongoDB, Python, UI/UX Design..."
              />
            </div>
          </section>

          {/* Section: Experience */}
          <section className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-1.5 h-6 bg-amber-500 rounded-full"></div>
                Work Experience
              </h2>
              <button 
                onClick={addExperience}
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Experience
              </button>
            </div>
            
            <div className="space-y-4">
              {experience.length === 0 && <p className="text-center py-8 text-muted-foreground italic border border-dashed border-border rounded-2xl">No experience added yet.</p>}
              {experience.map((exp, i) => (
                <div key={i} className="group border border-border p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 relative hover:border-indigo-200 transition-all">
                  <button 
                    onClick={() => removeExperience(i)} 
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Company Name</span>
                      <input className="w-full bg-white dark:bg-slate-900 border border-border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} placeholder="e.g. Tech Solutions Ltd." />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Job Title / Role</span>
                      <input className="w-full bg-white dark:bg-slate-900 border border-border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} placeholder="e.g. Frontend Intern" />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Years</span>
                      <input type="number" className="w-24 bg-white dark:bg-slate-900 border border-border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={exp.years} onChange={e => updateExperience(i, 'years', e.target.value)} />
                    </div>
                    <div className="space-y-1 flex-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Brief Description</span>
                      <input className="w-full bg-white dark:bg-slate-900 border border-border p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" value={exp.description || ""} onChange={e => updateExperience(i, 'description', e.target.value)} placeholder="What did you do there?" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Certifications */}
          <section className="bg-white dark:bg-card border border-border rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="w-1.5 h-6 bg-red-500 rounded-full"></div>
                Certifications
              </h2>
              <button 
                onClick={addCertification}
                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Certificate
              </button>
            </div>

            <div className="space-y-4">
              {certifications.length === 0 && <p className="text-center py-8 text-muted-foreground italic border border-dashed border-border rounded-2xl">No certifications listed.</p>}
              {certifications.map((cert, i) => (
                <div key={i} className="group border border-border p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 relative hover:border-indigo-200 transition-all">
                  <button 
                    onClick={() => removeCertification(i)} 
                    className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Certificate Name</span>
                      <input className="w-full bg-white dark:bg-slate-900 border border-border p-2.5 rounded-lg" value={cert.name} onChange={e => updateCertification(i, 'name', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Issuer</span>
                      <input className="w-full bg-white dark:bg-slate-900 border border-border p-2.5 rounded-lg" value={cert.issuer} onChange={e => updateCertification(i, 'issuer', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="space-y-1">
                       <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Category</span>
                       <select className="w-full bg-white dark:bg-slate-900 border border-border p-2.5 rounded-lg text-sm" value={cert.type} onChange={e => updateCertification(i, 'type', e.target.value)}>
                         <option value="Professional">Professional</option>
                         <option value="Academic">Academic</option>
                         <option value="Extracurricular">Extracurricular</option>
                       </select>
                     </div>
                     <div className="space-y-1">
                       <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Date Issued</span>
                       <input type="date" className="w-full bg-white dark:bg-slate-900 border border-border p-2 rounded-lg text-sm" value={cert.date ? new Date(cert.date).toISOString().split('T')[0] : ""} onChange={e => updateCertification(i, 'date', e.target.value)} />
                     </div>
                     <div className="space-y-1">
                       <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Verification URL</span>
                       <input className="w-full bg-white dark:bg-slate-900 border border-border p-2 rounded-lg text-sm" value={cert.url} onChange={e => updateCertification(i, 'url', e.target.value)} placeholder="https://..." />
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? "Saving Changes..." : "Save Profile Changes"}
            </button>
            <Link 
              href="/profile" 
              className="px-10 py-4 bg-slate-100 dark:bg-slate-800 font-bold rounded-2xl hover:bg-slate-200 transition-all text-center"
            >
              Cancel
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
