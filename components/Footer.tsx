import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto print:hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & Copyright */}
          <div>
            <Link href="/" className="text-xl font-bold text-indigo-600 hover:text-indigo-500">
              Internova
            </Link>
            <p className="text-gray-500 text-sm mt-2">
              Connecting students with their dream internships and entry-level opportunities.
            </p>
            <p className="text-gray-400 text-xs mt-4">
              &copy; {new Date().getFullYear()} Internova. All rights reserved.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Legal & Support</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/legal" className="hover:text-indigo-600">Privacy & Terms</Link></li>
              <li><Link href="#" className="hover:text-indigo-600">Contact Support</Link></li>
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Developed By</h3>
            <div className="flex items-center gap-4">
              {/* Developer 1 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">D1</div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Developer One</p>
                  <p className="text-xs text-gray-500">Full Stack Engineer</p>
                </div>
              </div>
              
              {/* Developer 2 */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">D2</div>
                <div>
                  <p className="text-sm font-medium text-gray-800">Developer Two</p>
                  <p className="text-xs text-gray-500">Frontend Specialist</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
