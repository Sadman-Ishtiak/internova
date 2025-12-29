import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import User from '@/models/User'; // Needed for population
import { authOptions } from '@/lib/auth';

export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await dbConnect();

  try {
    const job = await Job.findById(id).populate({
      path: 'applicants.userId',
      model: 'User',
      select: 'name email title skills experience certifications profileImage'
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Authorization Check: Must belong to the company that owns the job
    // session.user.companyId might be a string or object depending on session callback, usually string if from token.
    if (!session.user.companyId || job.companyId.toString() !== session.user.companyId.toString()) {
       return NextResponse.json({ error: "Forbidden: You do not own this job." }, { status: 403 });
    }

    // Sort applicants by matchScore (descending)
    // Note: applicant.userId is now the populated user object.
    // We should filter out any applicants where userId is null (deleted users)
    const validApplicants = job.applicants.filter(app => app.userId);
    
    const sortedApplicants = validApplicants.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ 
      jobTitle: job.title,
      totalApplicants: sortedApplicants.length,
      applicants: sortedApplicants 
    });
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
