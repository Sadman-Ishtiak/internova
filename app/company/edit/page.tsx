"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  Building2, 
  Globe, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  Loader2,
  Save,
  Plus,
  Trash2,
  Tag
} from "lucide-react";

export default function EditCompanyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<any>({ 
    name: "", tagline: "", description: "", imageUrl: "", industry: "Technology",
    companySize: "1-10", companyType: "Privately Held", foundedYear: new Date().getFullYear(),
    contact: { website: "", linkedin: "", email: "", phone: "", location: [] },
    socialMedia: { facebook: "", twitter: "", instagram: "", youtube: "" },
    specialties: [],
    benefits: []
  });

  // Temporary state for arrays
  const [specialtyInput, setSpecialtyInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    else if (status === "authenticated") fetchCompanyData();
  }, [status, router]);

  const fetchCompanyData = async () => {
    try {
      const res = await fetch("/api/company");
      const data = await res.json();
      if (data.company) {
        setFormData({
          ...data.company,
          contact: data.company.contact || { website: "", linkedin: "", email: "", phone: "", location: [] },
          socialMedia: data.company.socialMedia || { facebook: "", twitter: "", instagram: "", youtube: "" },
          specialties: data.company.specialties || [],
          benefits: data.company.benefits || []
        });
      }
    } catch (error) {
      console.error("Error fetching company:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const uploadFormData = new FormData(); uploadFormData.append("file", file);
    try {
      setSaving(true);
      const res = await fetch("/api/upload", { method: "POST", body: uploadFormData });
      const data = await res.json();
      if (res.ok) setFormData({ ...formData, imageUrl: data.url }); else alert("Upload failed");
    } catch (err) { console.error(err); alert("Error uploading image"); }
    finally { setSaving(false); }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert("Company profile updated successfully!");
        router.push("/company");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Error saving changes");
    } finally {
      setSaving(false);
    }
  };

  // Array Handlers
  const addToArray = (field: string, value: string, setter: (v: string) => void) => {
    if (!value.trim()) return;
    setFormData({ ...formData, [field]: [...formData[field], value.trim()] });
    setter("");
  };

  const removeFromArray = (field: string, index: number) => {
    const newArr = [...formData[field]];
    newArr.splice(index, 1);
    setFormData({ ...formData, [field]: newArr });
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <Link href="/company" className="inline-flex items-center text-sm font-bold text-muted-foreground hover:text-indigo-600 transition-colors mb-4">
            <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tight">Company Profile</h1>
              <p className="text-muted-foreground">Manage your brand's presence on InternNova.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* Section: Basic Brand Identity */}
          <section className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-8 md:p-10 shadow-sm">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
              <div className="w-2 h-8 bg-indigo-600 rounded-full"></div>
              Brand Identity
            </h2>
            <div className="space-y-8">
              <div className="flex flex-col md:flex-row gap-10 items-start">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-3xl bg-slate-100 dark:bg-slate-800 border-2 border-dashed border-border overflow-hidden flex items-center justify-center">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  <input 
                    type="file" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                  <div className="mt-2 text-center">
                    <span className="text-[10px] font-black uppercase text-indigo-600 tracking-widest">Change Logo</span>
                  </div>
                </div>
                
                <div className="flex-1 grid md:grid-cols-2 gap-6 w-full">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Company Name</label>
                    <input className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-bold" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Tagline</label>
                    <input className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-4 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium" value={formData.tagline} onChange={e => setFormData({...formData, tagline: e.target.value})} placeholder="e.g. Innovating the future of Tech" />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Industry</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-4 rounded-2xl outline-none" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
                    <option>Technology</option>
                    <option>Finance</option>
                    <option>Healthcare</option>
                    <option>Education</option>
                    <option>Textiles & Garments</option>
                    <option>Marketing & Media</option>
                    <option>Service & Hospitality</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Company Size</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-4 rounded-2xl outline-none" value={formData.companySize} onChange={e => setFormData({...formData, companySize: e.target.value})}>
                    <option value="1-10">1-10 Employees</option>
                    <option value="11-50">11-50 Employees</option>
                    <option value="51-200">51-200 Employees</option>
                    <option value="201-500">201-500 Employees</option>
                    <option value="501-1000">501-1000 Employees</option>
                    <option value="1000+">1000+ Employees</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Company Type</label>
                  <select className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-4 rounded-2xl outline-none" value={formData.companyType} onChange={e => setFormData({...formData, companyType: e.target.value})}>
                    <option>Privately Held</option>
                    <option>Public Company</option>
                    <option>Startup</option>
                    <option>Non-Profit</option>
                    <option>Government Agency</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                <textarea 
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-border p-4 rounded-2xl min-h-[150px] focus:ring-2 focus:ring-indigo-500 outline-none transition-all leading-relaxed" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="Tell us about your company history, mission, and what makes you unique..."
                />
              </div>
            </div>
          </section>

          {/* Section: Contact & Social */}
          <div className="grid md:grid-cols-2 gap-8">
            <section className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-blue-600">
                <Globe className="w-5 h-5" /> Official Links
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl outline-none" placeholder="Website URL" value={formData.contact.website} onChange={e => setFormData({...formData, contact: {...formData.contact, website: e.target.value}})} />
                </div>
                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl outline-none" placeholder="LinkedIn Page" value={formData.contact.linkedin} onChange={e => setFormData({...formData, contact: {...formData.contact, linkedin: e.target.value}})} />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl outline-none" placeholder="Official Email" value={formData.contact.email} onChange={e => setFormData({...formData, contact: {...formData.contact, email: e.target.value}})} />
                </div>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl outline-none" placeholder="Contact Phone" value={formData.contact.phone} onChange={e => setFormData({...formData, contact: {...formData.contact, phone: e.target.value}})} />
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-3 text-pink-600">
                <Facebook className="w-5 h-5" /> Social Media
              </h2>
              <div className="space-y-4">
                <div className="relative">
                  <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl outline-none" placeholder="Facebook URL" value={formData.socialMedia.facebook} onChange={e => setFormData({...formData, socialMedia: {...formData.socialMedia, facebook: e.target.value}})} />
                </div>
                <div className="relative">
                  <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl outline-none" placeholder="Twitter URL" value={formData.socialMedia.twitter} onChange={e => setFormData({...formData, socialMedia: {...formData.socialMedia, twitter: e.target.value}})} />
                </div>
                <div className="relative">
                  <Instagram className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl outline-none" placeholder="Instagram URL" value={formData.socialMedia.instagram} onChange={e => setFormData({...formData, socialMedia: {...formData.socialMedia, instagram: e.target.value}})} />
                </div>
                <div className="relative">
                  <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800 border border-border rounded-xl outline-none" placeholder="YouTube URL" value={formData.socialMedia.youtube} onChange={e => setFormData({...formData, socialMedia: {...formData.socialMedia, youtube: e.target.value}})} />
                </div>
              </div>
            </section>
          </div>

          {/* Section: Locations & Specialties */}
          <div className="grid md:grid-cols-2 gap-8">
             <section className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-red-500" /> Locations
                </h2>
                <div className="flex gap-2 mb-4">
                  <input className="flex-1 bg-slate-50 dark:bg-slate-800 border border-border px-4 py-2 rounded-xl outline-none" placeholder="Add a city..." value={locationInput} onChange={e => setLocationInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToArray('contact', locationInput, setLocationInput))} />
                  <button type="button" onClick={() => {
                    const newLocs = Array.isArray(formData.contact.location) ? [...formData.contact.location, locationInput] : [locationInput];
                    setFormData({...formData, contact: {...formData.contact, location: newLocs}});
                    setLocationInput("");
                  }} className="bg-indigo-600 text-white p-2 rounded-xl"><Plus /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(formData.contact?.location) ? formData.contact.location : []).map((loc: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold flex items-center gap-2">
                      {loc} <button type="button" onClick={() => {
                        const newLocs = [...formData.contact.location];
                        newLocs.splice(i, 1);
                        setFormData({...formData, contact: {...formData.contact, location: newLocs}});
                      }} className="text-red-500">×</button>
                    </span>
                  ))}
                </div>
             </section>

             <section className="bg-white dark:bg-card border border-border rounded-[2.5rem] p-8 shadow-sm">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
                  <Tag className="w-5 h-5 text-amber-500" /> Specialties
                </h2>
                <div className="flex gap-2 mb-4">
                  <input className="flex-1 bg-slate-50 dark:bg-slate-800 border border-border px-4 py-2 rounded-xl outline-none" placeholder="Add specialty..." value={specialtyInput} onChange={e => setSpecialtyInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addToArray('specialties', specialtyInput, setSpecialtyInput))} />
                  <button type="button" onClick={() => addToArray('specialties', specialtyInput, setSpecialtyInput)} className="bg-indigo-600 text-white p-2 rounded-xl"><Plus /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.specialties.map((spec: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-lg text-xs font-bold flex items-center gap-2">
                      {spec} <button type="button" onClick={() => removeFromArray('specialties', i)} className="text-red-500">×</button>
                    </span>
                  ))}
                </div>
             </section>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-4 pt-6">
            <button 
              type="submit" 
              disabled={saving}
              className="flex-1 bg-indigo-600 text-white py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-indigo-500/25 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6" />}
              Save All Changes
            </button>
            <Link 
              href="/company" 
              className="px-12 py-5 bg-white dark:bg-slate-800 border border-border font-bold rounded-[2rem] hover:bg-slate-50 transition-all text-center"
            >
              Discard
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}
