export default function LegalPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Legal Information</h1>
        
        <div className="space-y-8 text-gray-700">
          
          {/* Project Status */}
          <section className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h2 className="text-xl font-bold text-blue-900 mb-2">Sample Project Notice</h2>
            <p className="text-blue-800">
              Internova is a <strong>Sample Project</strong>. It was built as a portfolio piece and proof-of-concept. 
              While it is functional, it is not intended to be a final commercial product. Data entered here 
              is for demonstration purposes.
            </p>
          </section>

          {/* Privacy & Terms */}
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Privacy & Terms of Service</h2>
            <p>
              We hold the utmost respect for your privacy. We collect information solely to demonstrate 
              platform functionality (connecting students with jobs). We implement industry-standard 
              security measures to keep your data safe.
            </p>
            <p className="mt-2 font-medium italic">
              Disclaimer: No digital platform is entirely invulnerable. We apologize beforehand for any 
              potential security incidents and pledge transparency if any data breach occurs.
            </p>
          </section>

          {/* Full MIT License */}
          <section className="bg-gray-100 p-6 rounded-lg font-mono text-xs overflow-auto">
            <h2 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-widest font-sans">The MIT License (MIT)</h2>
            <p>Copyright (c) {new Date().getFullYear()} Internova Developers</p>
            <br />
            <p>
              Permission is hereby granted, free of charge, to any person obtaining a copy of this software and 
              associated documentation files (the "Software"), to deal in the Software without restriction, 
              including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
              and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, 
              subject to the following conditions:
            </p>
            <br />
            <p>
              The above copyright notice and this permission notice shall be included in all copies or substantial 
              portions of the Software.
            </p>
            <br />
            <p className="uppercase">
              THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT 
              LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. 
              IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
              WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
              SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
            </p>
          </section>

          <section className="pt-6 border-t mt-8 text-center">
            <p className="text-sm text-gray-500">
              Last Updated: {new Date().toLocaleDateString('en-GB')}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}