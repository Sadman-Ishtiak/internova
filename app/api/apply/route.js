import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import User from '@/models/User';
import { handler as authOptions } from '../auth/[...nextauth]/route';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { jobId } = await req.json();
    await dbConnect();

    // 1. Fetch User and Job
    const user = await User.findById(session.user.id);
    const job = await Job.findById(jobId);

    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // 2. Security Checks
    if (user.isBanned) {
      return NextResponse.json({ error: "Your account is banned." }, { status: 403 });
    }
    
    // Restriction: Company staff cannot apply to any jobs
    if (user.companyId) {
      return NextResponse.json({ error: "Company owners/managers cannot apply to jobs." }, { status: 403 });
    }

    // Check if already applied
    const alreadyApplied = job.applicants.some(
      app => app.userId.toString() === user._id.toString()
    );
    if (alreadyApplied) {
      return NextResponse.json({ error: "You have already applied." }, { status: 400 });
    }

    // 3. Buzzword Matching Algorithm
    // Normalize to lowercase for better matching
    const userSkills = (user.skills || []).map(s => s.toLowerCase().trim());
    const jobSkills = (job.requiredSkills || []).map(s => s.toLowerCase().trim());

    let score = 0;
    
    if (jobSkills.length > 0) {
      // Find how many job skills the user has
      const matchedSkills = jobSkills.filter(skill => userSkills.includes(skill));
      
      // Calculate percentage (e.g., 3 matches out of 4 required = 75%)
      score = (matchedSkills.length / jobSkills.length) * 100;
    } else {
      // If no skills required, give 100% (or 0% depending on logic, usually 100 for general labor)
      score = 100; 
    }

    // 4. Save Application
    job.applicants.push({
      userId: user._id,
      matchScore: score
    });
    
    await job.save();

    return NextResponse.json({ success: true, score: score });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}