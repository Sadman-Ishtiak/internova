import Link from "next/link";
import { Facebook, Twitter, Linkedin, Instagram, ChevronRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="print:hidden">
      {/* MAIN FOOTER */}
      <div className="bg-slate-900 text-slate-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Brand & Social */}
            <div className="lg:col-span-2">
              <Link href="/" className="text-2xl font-bold text-white mb-4 inline-block">
                InternNova
              </Link>
              <p className="text-slate-400 mb-6 leading-relaxed max-w-xs">
                Connecting talented students with top companies for internships and entry-level jobs. Start your career journey with us today.
              </p>
              <div className="flex gap-3">
                {[Facebook, Twitter, Linkedin, Instagram].map((Icon, idx) => (
                  <a key={idx} href="#" className="w-10 h-10 rounded bg-slate-800 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all text-slate-400">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Company Links */}
            <div>
              <h5 className="text-white font-semibold text-lg mb-4">Company</h5>
              <ul className="space-y-2">
                <li><FooterLink href="/about">About Us</FooterLink></li>
                {/* <li><FooterLink href="/blog">Blog</FooterLink></li> */}
              </ul>
            </div>

            {/* For Jobs */}
            <div>
              <h5 className="text-white font-semibold text-lg mb-4">For Jobs</h5>
              <ul className="space-y-2">
                <li><FooterLink href="/jobs">Browse Jobs</FooterLink></li>
                <li><FooterLink href="/companies">Browse Companies</FooterLink></li>
                <li><FooterLink href="/register">Create Account</FooterLink></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h5 className="text-white font-semibold text-lg mb-4">Support</h5>
              <ul className="space-y-2">
                <li><FooterLink href="/help">Help Center</FooterLink></li>
                <li><FooterLink href="/faq">FAQ's</FooterLink></li>
                <li><FooterLink href="/legal">Privacy & Terms</FooterLink></li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* FOOTER BOTTOM */}
      <div className="bg-slate-950 py-6 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} InternNova. Developed By Sadman Ishtiak and Md. Jahid Hasan Khan Ornob.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children }: { href: string, children: React.ReactNode }) {
  return (
    <Link href={href} className="flex items-center gap-1 hover:text-white hover:translate-x-1 transition-all duration-200">
      <ChevronRight className="w-3 h-3" />
      {children}
    </Link>
  );
}