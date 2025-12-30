"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Experience {
  company: string;
  role: string;
  years: number;
  description?: string;
}

interface Certification {
  name: string;
  issuer?: string;
  date?: string;
  type?: 'Academic' | 'Professional' | 'Extracurricular';
  url?: string;
}

interface Contact {
  linkedin?: string;
  github?: string;
  website?: string;
  location?: string;
}

interface UserProfile {
  name: string;
  email: string;
  title: string;
  profileImage: string;
  skills: string[];
  experience: Experience[];
  certifications: Certification[];
  contact?: Contact;
}

export default function PublicProfilePage() {
  const params = useParams();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (params.id) {
      fetchUser(params.id as string);
    }
  }, [params.id]);

  const fetchUser = async (id: string) => {
    try {
      const res = await fetch(`/api/users/${id}`);
      if (!res.ok) {
        throw new Error("User not found");
      }
      const data = await res.json();
      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
  );

  if (error || !user) return (
          <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">User not found or profile is private.</p>
      <Link href="/" className="text-indigo-600 hover:underline">Return Home</Link>
    </div>
  );

  const safeLink = (url?: string) => {
    if (!url) return "#";
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
      return url;
    }
    return `https://${url}`; // Default to https if missing protocol
  };

  return (
    <div className="min-h-screen bg-muted py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0">
      <div className="max-w-5xl mx-auto bg-card shadow-2xl rounded-lg overflow-hidden print:shadow-none print:rounded-none">
        
        {/* Header Section */}
        <div className="bg-slate-900 text-white p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
            <img 
              src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random&size=200`} 
              alt={user.name} 
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">{user.name}</h1>
              <p className="text-xl text-indigo-300 font-medium">{user.title || "Open to Work"}</p>
              {user.contact?.location && <p className="text-indigo-200 mt-1 text-sm">{user.contact.location}</p>}
              
              <div className="flex gap-4 mt-4 justify-center sm:justify-start print:hidden">
                 {user.contact?.linkedin && <a href={safeLink(user.contact.linkedin)} target="_blank" className="text-white hover:text-indigo-300">LinkedIn</a>}
                 {user.contact?.github && <a href={safeLink(user.contact.github)} target="_blank" className="text-white hover:text-indigo-300">GitHub</a>}
                 {user.contact?.website && <a href={safeLink(user.contact.website)} target="_blank" className="text-white hover:text-indigo-300">Portfolio</a>}
              </div>

              {/* Print-only contact details */}
              <div className="hidden print:block mt-4 space-y-1 text-indigo-100 text-xs">
                {user.contact?.linkedin && <p>LinkedIn: {user.contact.linkedin}</p>}
                {user.contact?.github && <p>GitHub: {user.contact.github}</p>}
                {user.contact?.website && <p>Portfolio: {user.contact.website}</p>}
              </div>

              <p className="text-indigo-200 mt-2 text-sm sm:text-base">{user.email}</p>
            </div>
          </div>
          
          {/* Decorative Background Element */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-600 rounded-full opacity-20 blur-3xl"></div>
        </div>

        {/* TOP: Skills (Full Width) */}
        <div className="p-8 pb-0 sm:p-12 sm:pb-0">
            <section>
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider border-b-2 border-indigo-500 pb-2 mb-4">
                Skills & Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {user.skills && user.skills.length > 0 ? (
                  user.skills.map((skill, index) => (
                    <span key={index} className="bg-primary/10 text-primary px-4 py-2 rounded-md text-sm font-bold border border-primary/20">
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-muted-foreground italic">No skills listed.</p>
                )}
              </div>
            </section>
        </div>

        {/* Main Content Grid (Swapped: Certs Main, Exp Side) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 sm:p-12 pt-8">
          
          {/* Main Column (2/3): Certifications & Academics */}
          <div className="md:col-span-2 space-y-8">
             {/* Certifications Grouped */}
               <section>
                 <h2 className="text-2xl font-bold text-gray-800 uppercase tracking-wider border-b-2 border-green-500 pb-2 mb-6">
                   Education & Certifications
                 </h2>
                 {user.certifications && user.certifications.length > 0 ? (
                 <div className="space-y-8">
                   {['Academic', 'Professional', 'Extracurricular'].map(type => {
                     const certs = user.certifications.filter(c => (c.type || 'Professional') === type);
                     if (certs.length === 0) return null;
                     return (
                       <div key={type}>
                         <h4 className="font-bold text-gray-500 text-sm uppercase mb-4 tracking-wide">{type}</h4>
                         <div className="grid gap-4">
                           {certs.map((cert, i) => (
                             <div key={i} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                               <div className="flex justify-between items-start">
                                 <div>
                                   <p className="font-bold text-gray-900 text-lg">{cert.name}</p>
                                   {cert.issuer && <p className="text-sm text-gray-600">{cert.issuer}</p>}
                                 </div>
                                 <div className="text-right">
                                   {cert.date && <p className="text-sm font-medium text-gray-500">{new Date(cert.date).toLocaleDateString('en-GB')}</p>}
                                 </div>
                               </div>
                               {cert.url && <a href={cert.url} target="_blank" className="text-indigo-600 text-xs hover:underline block mt-2 font-medium">View Credential &rarr;</a>}
                             </div>
                           ))}
                         </div>
                       </div>
                     );
                   })}
                 </div>
                 ) : (
                    <p className="text-gray-500 italic">No certifications or academic records listed.</p>
                 )}
               </section>
          </div>

          {/* Sidebar (1/3): Experience */}
          <div className="md:col-span-1 space-y-8 border-l md:border-l-gray-200 md:pl-8">
            <section>
              <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wider border-b-2 border-gray-400 pb-2 mb-6">
                Experience
              </h2>
              
              <div className="space-y-8">
                {user.experience && user.experience.length > 0 ? (
                  user.experience.map((exp, index) => (
                    <div key={index} className="relative pl-6 border-l-2 border-gray-300">
                      <div className="absolute -left-1.5 top-0 w-3 h-3 bg-gray-500 rounded-full"></div>
                      
                      <div className="mb-1">
                        <h3 className="font-bold text-gray-900">{exp.role}</h3>
                        <h4 className="text-sm text-gray-600 font-medium">{exp.company}</h4>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-2 font-mono">
                        {exp.years} {exp.years === 1 ? 'Year' : 'Years'}
                      </p>
                      
                      {exp.description && (
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-sm">No professional experience.</p>
                )}
              </div>
            </section>
          </div>

        </div>
        
        {/* Footer / Print Button */}
        <div className="bg-gray-50 p-6 text-center border-t print:hidden">
          <button 
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition"
          >
            <span>Print CV</span>
          </button>
        </div>

      </div>
    </div>
  );
}
