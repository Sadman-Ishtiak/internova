import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import Company from '@/models/Company'; // Ensure models are registered
import { authOptions } from '@/lib/auth';

// GET: Fetch User Applications
export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await dbConnect();

    // Find jobs where the user is in the applicants array
    const jobs = await Job.find({ "applicants.userId": session.user.id })
      .populate("companyId", "name imageUrl")
      .select("title companyId applicants deadline location type");

    // Format the response to include application details
    const applications = jobs.map(job => {
      const applicantData = job.applicants.find(app => app.userId.toString() === session.user.id);
      return {
        jobId: job._id,
        jobTitle: job.title,
        companyName: job.companyId?.name,
        companyImage: job.companyId?.imageUrl,
        appliedAt: applicantData.appliedAt,
        status: applicantData.status,
        message: applicantData.message,
        location: job.location,
        type: job.type
      };
    });

    // Sort by most recent application
    applications.sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime());

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
