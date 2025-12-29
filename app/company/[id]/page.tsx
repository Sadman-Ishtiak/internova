"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function PublicCompanyPage() {
  const { id } = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await fetch(`/api/company/${id}`);
        const data = await res.json();
        if (data.company) {
           setCompany(data.company);
           setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCompany();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading Company...</div>;
  if (!company) return <div className="p-10 text-center text-red-500">Company not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* HERO / HEADER */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center gap-8">
          <img 
            src={company.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`} 
            alt="Logo" 
            className="w-32 h-32 rounded-lg object-cover shadow-md border"
          />
          <div className="text-center md:text-left flex-1">
            <h1 className="text-4xl font-bold text-gray-900">{company.name}</h1>
            <p className="text-gray-600 mt-4 max-w-2xl">{company.description}</p>
            
            {/* Contact Info */}
            {company.contact && (
              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-gray-500">
                {company.contact.location && <span className="flex items-center gap-1">📍 {company.contact.location}</span>}
                {company.contact.website && (
                  <a href={company.contact.website} target="_blank" className="flex items-center gap-1 text-indigo-600 hover:underline">
                    🌐 Website
                  </a>
                )}
                {company.contact.linkedin && (
                  <a href={company.contact.linkedin} target="_blank" className="flex items-center gap-1 text-blue-600 hover:underline">
                    💼 LinkedIn
                  </a>
                )}
                {company.contact.email && (
                   <a href={`mailto:${company.contact.email}`} className="flex items-center gap-1 text-gray-700 hover:text-black">
                     📧 {company.contact.email}
                   </a>
                )}
                 {company.contact.phone && (
                   <span className="flex items-center gap-1">
                     📞 {company.contact.phone}
                   </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ACTIVE JOBS */}
      <div className="max-w-6xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Active Opportunities at {company.name}</h2>
        
        {jobs.length === 0 ? (
          <p className="text-gray-500 italic">No active job openings at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <div key={job._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer" onClick={() => router.push(`/jobs/${job._id}`)}>
                {/* Image */}
                <div className="h-40 bg-gray-200 relative">
                  <img 
                    src={job.imageUrl} 
                    alt={job.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-white px-2 py-1 text-xs font-bold rounded">
                    {new Date(job.deadline).toLocaleDateString('en-GB')}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-gray-800">{job.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded text-white font-bold ${job.type === 'internship' ? 'bg-purple-500' : 'bg-blue-500'}`}>
                       {job.type === 'internship' ? 'Internship' : 'Job'}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {job.requiredSkills.slice(0, 3).map((skill: string, i: number) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
