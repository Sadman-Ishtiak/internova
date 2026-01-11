"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Users, 
  Target, 
  Lightbulb, 
  CheckCircle2, 
  Heart,
  Award
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <section className="bg-slate-900 py-20 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Empowering the Future of <span className="text-indigo-400">Bangladesh's Talent</span></h1>
          <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed">
            InternNova is dedicated to bridging the gap between ambitious students and top-tier companies, 
            creating a seamless transition from education to professional excellence.
          </p>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl -ml-36 -mb-36"></div>
      </section>

      {/* OUR MISSION & VISION */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                To empower every student in Bangladesh by providing them with the tools, resources, and opportunities 
                needed to kickstart their careers through meaningful internships and entry-level roles.
              </p>
            </div>
            <div className="bg-card border border-border p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed">
                To become the most trusted ecosystem for early-career professional development in Bangladesh, 
                fostering innovation and excellence across the local industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Choose InternNova?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We focus on the unique needs of both students and employers to create the perfect match.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              {
                icon: Users,
                title: "Vast Community",
                desc: "Join thousands of students and hundreds of top companies across the country."
              },
              {
                icon: CheckCircle2,
                title: "Verified Opportunities",
                desc: "Every job and internship posted on our platform goes through a strict verification process."
              },
              {
                icon: Award,
                title: "Skill Matching",
                desc: "Our smart algorithms help match candidates with roles that fit their unique skill sets."
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-6">
                <div className="w-16 h-16 bg-white dark:bg-card rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-border group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUES SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {["Transparency", "Innovation", "Empowerment", "Excellence", "Integrity", "Student-First"].map((value) => (
              <span key={value} className="px-6 py-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-full font-bold text-sm border border-indigo-100 dark:border-indigo-900/30">
                {value}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-indigo-600 rounded-3xl p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to start your journey?</h2>
              <p className="text-indigo-100 mb-10 max-w-xl mx-auto">
                Join InternNova today and take the first step towards a successful career.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/jobs" className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors">
                  Find an Internship
                </Link>
                <Link href="/company" className="bg-indigo-500 text-white border border-indigo-400 px-8 py-3 rounded-xl font-bold hover:bg-indigo-400 transition-colors">
                  Post a Job
                </Link>
              </div>
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -ml-32 -mt-32"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/5 rounded-full blur-3xl -mr-32 -mb-32"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
