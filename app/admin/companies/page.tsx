"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  Building2, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  ExternalLink,
  ShieldCheck,
  Star,
  Search,
  Filter
} from "lucide-react";

export default function AdminCompaniesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [companies, setCompanies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user.role === 'admin') fetchCompanies();
  }, [session, status]);

  const fetchCompanies = async () => {
    try {
      const res = await fetch("/api/admin/companies");
      const data = await res.json();
      setCompanies(data.companies || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, updateData: any) => {
    try {
      const res = await fetch(`/api/admin/companies/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData)
      });
      if (res.ok) fetchCompanies();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This will delete the company profile.")) return;
    try {
      const res = await fetch(`/api/admin/companies/${id}`, { method: "DELETE" });
      if (res.ok) fetchCompanies();
    } catch (err) { console.error(err); }
  };

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.industry.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center">Loading Companies...</div>;

  return (
    <div className="min-h-screen p-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Manage Companies</h1>
            <p className="text-muted-foreground">Verify and moderate company profiles.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              placeholder="Search companies..." 
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-border">
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Company</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Industry & Size</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Verification</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider">Featured</th>
                <th className="p-4 font-bold text-sm text-muted-foreground uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCompanies.map((company) => (
                <tr key={company._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden border border-border flex-shrink-0 relative">
                        <Image 
                          src={company.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(company.name)}&background=random`} 
                          alt={company.name}
                          fill
                          unoptimized
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{company.name}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{company.tagline || 'No tagline set'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-medium text-foreground">{company.industry}</p>
                    <p className="text-xs text-muted-foreground">{company.companySize} employees</p>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleUpdateStatus(company._id, { verified: !company.verified })}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        company.verified 
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30" 
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                      }`}
                    >
                      <ShieldCheck className={`w-3.5 h-3.5 ${company.verified ? 'fill-current' : ''}`} />
                      {company.verified ? "Verified" : "Verify"}
                    </button>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleUpdateStatus(company._id, { featured: !company.featured })}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                        company.featured 
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30" 
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800"
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${company.featured ? 'fill-current' : ''}`} />
                      {company.featured ? "Featured" : "Feature"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <a 
                        href={`/company/${company._id}`} 
                        target="_blank"
                        className="p-2 text-muted-foreground hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                      <button 
                        onClick={() => handleDelete(company._id)}
                        className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCompanies.length === 0 && (
            <div className="p-20 text-center text-muted-foreground italic">
              No companies found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}