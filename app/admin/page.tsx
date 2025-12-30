"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
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

    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === 'admin') fetchStats();
  }, [session, status]);

  if (loading) return <div className="p-10 text-center">Loading Admin Panel...</div>;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
            <h3 className="text-muted-foreground font-medium">Total Users</h3>
            <p className="text-3xl font-bold text-foreground">{stats?.totalUsers}</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-muted-foreground font-medium">Total Jobs</h3>
            <p className="text-3xl font-bold text-foreground">{stats?.totalJobs}</p>
          </div>
          <div className="bg-card p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <h3 className="text-muted-foreground font-medium">Total Companies</h3>
            <p className="text-3xl font-bold text-foreground">{stats?.totalCompanies}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/admin/users" className="block bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition border border-border group">
            <h2 className="text-2xl font-bold text-foreground group-hover:text-primary mb-2">Manage Users</h2>
            <p className="text-muted-foreground">View, ban, or delete user accounts.</p>
          </Link>
          
          <Link href="/admin/jobs" className="block bg-card p-8 rounded-lg shadow-md hover:shadow-lg transition border border-border group">
            <h2 className="text-2xl font-bold text-foreground group-hover:text-primary mb-2">Manage Jobs</h2>
            <p className="text-muted-foreground">View and remove job listings.</p>
          </Link>
        </div>

      </div>
    </div>
  );
}