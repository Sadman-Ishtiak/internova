"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Search, 
  MapPin, 
  User, 
  ChevronRight,
  Filter,
  GraduationCap,
  ExternalLink,
  Code,
  List,
  LayoutGrid
} from "lucide-react";

export default function PeoplePage() {
  const [people, setPeople] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [isSkillDropdownOpen, setIsSkillDropdownOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");

  useEffect(() => {
    // Fetch Skills List on Load
    fetch("/api/stats/skills")
      .then(res => res.json())
      .then(data => setAllSkills(data.skills || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPeople();
    }, 500);

    const handleRefresh = () => {
      fetchPeople();
    };

    window.addEventListener("refresh-data", handleRefresh);
    return () => {
      clearTimeout(delayDebounceFn);
      window.removeEventListener("refresh-data", handleRefresh);
    };
  }, [searchTerm, skillFilter]);

  const fetchPeople = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (skillFilter) params.append("skill", skillFilter);
      
      const res = await fetch(`/api/people?${params.toString()}`);
      const data = await res.json();
      setPeople(data.users || []);
    } catch (error) {
      console.error("Failed to fetch people", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      
      {/* PAGE HEADER */}
      <section className="bg-slate-900 py-16 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Explore Candidates</h1>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
      </section>

      {/* SEARCH & FILTERS SECTION */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* SIDEBAR FILTERS */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
                  <Filter className="w-5 h-5 text-indigo-600" />
                  <h2 className="font-bold text-lg">Filters</h2>
                </div>

                <div className="space-y-6">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-foreground">Name or Skill</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input 
                        type="text" 
                        placeholder="Search people..." 
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Skills (Typable Dropdown) */}
                  <div className="relative">
                    <label className="block text-sm font-semibold mb-2 text-foreground">Skills</label>
                    <input 
                      type="text" 
                      placeholder="e.g. React, Python..." 
                      className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all"
                      value={skillFilter}
                      onChange={(e) => {
                        setSkillFilter(e.target.value);
                        setIsSkillDropdownOpen(true);
                      }}
                      onFocus={() => setIsSkillDropdownOpen(true)}
                      onBlur={() => setTimeout(() => setIsSkillDropdownOpen(false), 200)} // Delay to allow click
                    />
                    
                    {isSkillDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-900 border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {allSkills
                          .filter(s => s.toLowerCase().includes(skillFilter.toLowerCase()))
                          .map((skill, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setSkillFilter(skill);
                                setIsSkillDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                              {skill}
                            </button>
                          ))}
                        {allSkills.filter(s => s.toLowerCase().includes(skillFilter.toLowerCase())).length === 0 && (
                           <div className="px-4 py-2 text-xs text-muted-foreground italic">No matching skills found</div>
                        )}
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => { setSearchTerm(""); setSkillFilter(""); }}
                    className="w-full py-2 text-indigo-600 text-sm font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                  >
                    Reset Filters
                  </button>
                </div>
              </div>
            </div>

            {/* PEOPLE LISTINGS */}
            <div className="lg:col-span-3">
              
              <div className="flex items-center justify-between mb-6">
                <p className="text-muted-foreground text-sm">
                  Showing <span className="text-foreground font-semibold">{people.length}</span> talented individuals
                </p>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-indigo-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-muted-foreground border border-border hover:text-foreground"}`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-indigo-600 text-white shadow-md" : "bg-white dark:bg-slate-800 text-muted-foreground border border-border hover:text-foreground"}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-6" : "space-y-4"}>
                {loading ? (
                   <div className={viewMode === "grid" ? "contents" : "flex flex-col gap-4"}>
                      {[1,2,3,4].map(i => (
                        <div key={i} className={`bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl ${viewMode === "grid" ? "h-64" : "h-32"}`}></div>
                      ))}
                   </div>
                ) : people.length === 0 ? (
                  <div className={viewMode === "grid" ? "md:col-span-2 text-center py-20 bg-card rounded-xl border border-dashed border-border" : "text-center py-20 bg-card rounded-xl border border-dashed border-border"}>
                    <User className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                    <p className="text-muted-foreground">No people found. Try adjusting your search.</p>
                  </div>
                ) : (
                  people.map((person) => (
                    viewMode === "list" ? (
                      <div 
                        key={person._id} 
                        className="group bg-card border border-border rounded-xl p-5 hover:shadow-xl transition-all hover:border-indigo-200 flex flex-col md:flex-row items-center gap-6 cursor-pointer"
                      >
                        <div className="w-20 h-20 relative rounded-full overflow-hidden border border-border flex-shrink-0 bg-slate-50">
                           <Image 
                             src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`} 
                             alt={person.name} 
                             fill 
                             unoptimized
                             className="object-cover"
                           />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="font-bold text-xl mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{person.name}</h3>
                          <p className="text-indigo-600 dark:text-indigo-400 text-sm font-medium mb-2 flex items-center gap-1 justify-center md:justify-start">
                            <GraduationCap className="w-4 h-4" /> Student / Candidate
                          </p>
                          <div className="flex flex-wrap justify-center md:justify-start gap-1 mt-2">
                             {person.skills?.slice(0, 5).map((skill: string) => (
                               <span key={skill} className="text-[10px] px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/20 rounded text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-tighter">
                                 {skill}
                               </span>
                             ))}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                           <Link href={`/profile/${person._id}`} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-none">
                              View Portfolio
                           </Link>
                        </div>
                      </div>
                    ) : (
                      <div 
                        key={person._id} 
                        className="group bg-card border border-border rounded-2xl overflow-hidden hover:shadow-2xl transition-all hover:border-indigo-300 flex flex-col cursor-pointer"
                      >
                        <div className="p-6">
                          <div className="flex items-start gap-4">
                            <div className="w-16 h-16 relative rounded-full overflow-hidden border border-border flex-shrink-0 bg-slate-50">
                               <Image 
                                 src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`} 
                                 alt={person.name} 
                                 fill 
                                 unoptimized
                                 className="object-cover"
                               />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{person.name}</h3>
                              <p className="text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-2 flex items-center gap-1 uppercase tracking-wider">
                                <GraduationCap className="w-3 h-3" /> Candidate
                              </p>
                              <div className="flex flex-wrap gap-1 mt-2">
                                 {person.skills?.slice(0, 3).map((skill: string) => (
                                   <span key={skill} className="text-[9px] px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-muted-foreground font-medium">
                                     {skill}
                                   </span>
                                 ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto bg-slate-50 dark:bg-slate-800/5 p-4 flex justify-between items-center group-hover:bg-indigo-600 transition-colors">
                          <Link href={`/profile/${person._id}`} className="text-xs font-bold group-hover:text-white transition-colors flex items-center gap-1 w-full justify-between">
                            View Full Portfolio
                            <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                          </Link>
                        </div>
                      </div>
                    )
                  ))
                )}
              </div>

            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
