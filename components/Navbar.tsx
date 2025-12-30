"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { 
  Briefcase, 
  Building2, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  User, 
  UserCircle, 
  X,
  LogIn,
  UserPlus,
  ShieldAlert
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false); // Mobile menu
  const [isProfileOpen, setIsProfileOpen] = useState(false); // Profile dropdown
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Common Nav Links
  const publicLinks = [
    { href: "/jobs", label: "Jobs", icon: Briefcase },
    { href: "/companies", label: "Companies", icon: Building2 },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 print:hidden transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* LEFT: Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-primary/10 p-1.5 rounded-lg group-hover:bg-primary/20 transition-colors">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                Internova
              </span>
            </Link>
          </div>

          {/* CENTER: Tiled Navigation (Desktop) */}
          <div className="hidden md:flex items-center justify-center flex-1 mx-6">
            <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-full border border-border/50">
               {/* Always show Companies/Jobs even if logged out? Original code showed Browse Jobs only if logged in, but Companies always. Let's make it consistent. */}
               {!session ? (
                 <>
                   <NavLink href="/companies" icon={Building2} label="Companies" />
                   <NavLink href="/login" icon={LogIn} label="Login" />
                 </>
               ) : (
                 <>
                   <NavLink href="/jobs" icon={Briefcase} label="Jobs" />
                   <NavLink href="/companies" icon={Building2} label="Companies" />
                 </>
               )}
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            
            {!session ? (
               <Link 
                 href="/register" 
                 className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all shadow-sm hover:shadow-md"
               >
                 <UserPlus className="w-4 h-4" />
                 Register
               </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full border border-border/50 hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <span className="text-sm font-medium text-foreground ml-2 hidden lg:block max-w-[100px] truncate">
                    {session.user?.name}
                  </span>
                  <img 
                    src={session.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "User")}&background=random`} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-background"
                  />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-xl border border-border bg-popover p-1 shadow-lg ring-1 ring-black/5 focus:outline-none animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-3 py-2 border-b border-border/50 mb-1">
                      <p className="text-sm font-medium text-foreground">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                    </div>

                    <DropdownItem href="/profile" icon={User} label="My Profile" onClick={() => setIsProfileOpen(false)} />
                    
                    {session.user?.companyId && (
                      <DropdownItem href="/company" icon={LayoutDashboard} label="Company Dashboard" onClick={() => setIsProfileOpen(false)} />
                    )}

                    {session.user?.role === 'admin' && (
                       <DropdownItem href="/admin" icon={ShieldAlert} label="Admin Panel" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => setIsProfileOpen(false)} />
                    )}

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        signOut({ callbackUrl: '/login' });
                      }}
                      className="w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
             <ThemeToggle />
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="text-muted-foreground hover:text-primary p-2 rounded-md hover:bg-accent transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-5">
          <div className="space-y-1 p-4">
            {!session ? (
              <>
                <MobileNavLink href="/login" icon={LogIn} label="Login" onClick={() => setIsOpen(false)} />
                <MobileNavLink href="/register" icon={UserPlus} label="Register" onClick={() => setIsOpen(false)} active />
                <MobileNavLink href="/companies" icon={Building2} label="Explore Companies" onClick={() => setIsOpen(false)} />
              </>
            ) : (
              <>
                 <div className="flex items-center gap-3 px-4 py-4 mb-2 bg-secondary/30 rounded-lg">
                    <img 
                      src={session.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user?.name || "User")}&background=random`} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-foreground">{session.user?.name}</p>
                      <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                    </div>
                  </div>

                <MobileNavLink href="/profile" icon={User} label="My Profile" onClick={() => setIsOpen(false)} />
                <MobileNavLink href="/jobs" icon={Briefcase} label="Browse Jobs" onClick={() => setIsOpen(false)} />
                <MobileNavLink href="/companies" icon={Building2} label="Companies" onClick={() => setIsOpen(false)} />
                
                {session.user?.companyId && (
                  <MobileNavLink href="/company" icon={LayoutDashboard} label="Company Dashboard" onClick={() => setIsOpen(false)} />
                )}

                {session.user?.role === 'admin' && (
                   <MobileNavLink href="/admin" icon={ShieldAlert} label="Admin Panel" onClick={() => setIsOpen(false)} className="text-destructive hover:bg-destructive/10" />
                )}
                
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: '/login' });
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

// Helper Components

function NavLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-background transition-all hover:shadow-sm"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}

function DropdownItem({ href, icon: Icon, label, onClick, className }: { href: string; icon: any; label: string; onClick: () => void; className?: string }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ${className}`}
      onClick={onClick}
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}

function MobileNavLink({ href, icon: Icon, label, onClick, active, className }: { href: string; icon: any; label: string; onClick: () => void; active?: boolean; className?: string }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors ${
        active 
          ? "bg-primary text-primary-foreground shadow-md" 
          : "text-muted-foreground hover:text-foreground hover:bg-accent"
      } ${className}`}
      onClick={onClick}
    >
      <Icon className="w-5 h-5" />
      {label}
    </Link>
  );
}