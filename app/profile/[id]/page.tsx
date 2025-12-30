"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PublicProfilePage() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/profile/${id}`);
        const data = await res.json();
        if (data.user) setUser(data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading Profile...</div>;
  if (!user) return <div className="p-10 text-center text-red-500">User not found.</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-card shadow-xl rounded-lg overflow-hidden border border-border">
        
        {/* HEADER */}
        <div className="bg-primary p-8 text-primary-foreground flex flex-col items-center">
           <img 
             src={user.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
             alt="Profile" 
             className="w-32 h-32 rounded-full border-4 border-background object-cover mb-4"
           />
           <h1 className="text-3xl font-bold">{user.name}</h1>
           <p className="text-primary-foreground/80 text-lg">{user.title || "No Title Set"}</p>
           <p className="text-primary-foreground/70 text-sm mt-1">{user.email}</p>
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-8">
          
          {/* SKILLS */}
          <div className="text-center">
            <h2 className="text-xl font-bold text-foreground mb-4">Skills</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {user.skills?.length > 0 ? (
                user.skills.map((skill: string, i: number) => (
                  <span key={i} className="bg-accent px-4 py-2 rounded-full text-accent-foreground font-medium">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-muted-foreground italic">No skills listed.</p>
              )}
            </div>
          </div>

          <hr className="border-border" />

          {/* EXPERIENCE */}
          <div>
            <h3 className="text-2xl font-bold text-foreground mb-6 border-l-4 border-primary pl-4">Experience</h3>
            {user.experience?.length > 0 ? (
              <div className="space-y-8">
                {user.experience.map((exp: any, i: number) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-primary"></div>
                      <div className="w-0.5 h-full bg-border mt-1"></div>
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-foreground">{exp.role}</h4>
                      <p className="text-primary font-medium">{exp.company}</p>
                      <p className="text-muted-foreground text-sm mt-1">{exp.years} Years Experience</p>
                      {exp.description && <p className="text-muted-foreground mt-2">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic ml-4">No experience added yet.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}