"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminJobsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
        router.push("/login");
        return;
    }
    if (session && session.user && session.user.role !== 'admin') {
        router.push("/");
        return;
    }

    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/admin/jobs");
        const data = await res.json();
        setJobs(data.jobs || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === 'admin') fetchJobs();
  }, [session, status]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This action is irreversible.")) return;

    try {
        const res = await fetch(`/api/admin/jobs/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setJobs(jobs.filter(j => j._id !== id));
        }
    } catch (err) {
        alert("Failed to delete job");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Jobs...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Job Listings Management</h1>

        <div className="bg-card shadow-md rounded-lg overflow-hidden border border-border">
          <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted border-b border-border">
              <th className="p-4 font-semibold text-muted-foreground">Job Title</th>
              <th className="p-4 font-semibold text-muted-foreground">Company</th>
              <th className="p-4 font-semibold text-muted-foreground">Type</th>
              <th className="p-4 font-semibold text-muted-foreground">Deadline</th>
              <th className="p-4 font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job._id} className="hover:bg-accent border-b border-border last:border-0">
                <td className="p-4 font-medium text-foreground">
                        <Link href={`/jobs/${job._id}`} className="hover:underline text-indigo-600">
                            {job.title}
                        </Link>
                    </td>
                    <td className="p-4 text-gray-600">{job.companyId?.name || "Unknown"}</td>
                    <td className="p-4 text-gray-600 capitalize">{job.type}</td>
                    <td className="p-4 text-gray-600">
                        {new Date(job.deadline).toLocaleDateString('en-GB')}
                    </td>
                    <td className="p-4 text-right">
                        <button 
                            onClick={() => handleDelete(job._id)}
                            className="px-3 py-1 rounded text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200"
                        >
                            Delete
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}