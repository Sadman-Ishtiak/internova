"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
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

    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user.role === 'admin') fetchUsers();
  }, [session, status]);

  const handleBan = async (id: string, currentStatus: boolean) => {
    if (!confirm(`Are you sure you want to ${currentStatus ? 'unban' : 'ban'} this user?`)) return;

    try {
        const res = await fetch(`/api/admin/users/${id}/ban`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isBanned: !currentStatus })
        });
        if (res.ok) {
            setUsers(users.map(u => u._id === id ? { ...u, isBanned: !currentStatus } : u));
        }
    } catch (err) {
        alert("Failed to update ban status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? This action is irreversible.")) return;

    try {
        const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
        if (res.ok) {
            setUsers(users.filter(u => u._id !== id));
        }
    } catch (err) {
        alert("Failed to delete user");
    }
  };

  if (loading) return <div className="p-10 text-center">Loading Users...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">User Management</h1>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="p-4 font-semibold text-gray-600">Name</th>
                  <th className="p-4 font-semibold text-gray-600">Email</th>
                  <th className="p-4 font-semibold text-gray-600">Role</th>
                  <th className="p-4 font-semibold text-gray-600">Status</th>
                  <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">
                        <div className="flex items-center gap-3">
                            <img src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} className="w-8 h-8 rounded-full" />
                            {user.name}
                        </div>
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600 capitalize">{user.role}</td>
                    <td className="p-4">
                        {user.isBanned ? (
                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Banned</span>
                        ) : (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Active</span>
                        )}
                    </td>
                    <td className="p-4 text-right space-x-2">
                      {user.role !== 'admin' && (
                          <>
                            <button 
                                onClick={() => handleBan(user._id, user.isBanned)}
                                className={`px-3 py-1 rounded text-xs font-bold ${user.isBanned ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                            >
                                {user.isBanned ? 'Unban' : 'Ban'}
                            </button>
                            <button 
                                onClick={() => handleDelete(user._id)}
                                className="px-3 py-1 rounded text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200"
                            >
                                Delete
                            </button>
                          </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}