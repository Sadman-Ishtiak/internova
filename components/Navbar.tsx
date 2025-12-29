"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white shadow border-b sticky top-0 z-50 print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo / Home Link */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-indigo-600 hover:text-indigo-500">
              Internova
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            {!session ? (
              <>
                <Link href="/login" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2">
                  Login
                </Link>
                <Link 
                  href="/register" 
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <Link href="/jobs" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2">
                  Browse Jobs
                </Link>
                
                <Link href="/profile" className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium px-3 py-2 group">
                  <img 
                    src={session.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "User")}&background=random`} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full border border-gray-200 group-hover:border-indigo-400 object-cover"
                  />
                  <span>My Profile</span>
                </Link>

                <Link href="/company" className="text-gray-600 hover:text-indigo-600 font-medium px-3 py-2">
                  Company Dashboard
                </Link>

                {session.user?.role === 'admin' && (
                  <Link href="/admin" className="text-red-600 hover:text-red-800 font-medium px-3 py-2 border border-red-200 rounded-md bg-red-50">
                    Admin Panel
                  </Link>
                )}
                
                <button 
                  onClick={() => signOut({ callbackUrl: '/login' })}
                  className="ml-4 bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}