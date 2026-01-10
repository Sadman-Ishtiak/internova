import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import User from '@/models/User';
import Company from '@/models/Company'; // Ensure Company is registered
import { authOptions } from '@/lib/auth';

// PUT: Update Application Status
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { jobId, userId, status, message } = await req.json();
    await dbConnect();

    if (!jobId || !userId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!['pending', 'accepted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Mandatory message check
    if ((status === 'rejected' || status === 'accepted') && (!message || !message.trim())) {
      return NextResponse.json({ error: "A message is required when accepting or rejecting a candidate." }, { status: 400 });
    }

    const job = await Job.findById(jobId);
    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // Verify Company Ownership
    const currentUser = await User.findById(session.user.id);
    if (!currentUser.companyId || currentUser.companyId.toString() !== job.companyId.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Find applicant and update
    const applicantIndex = job.applicants.findIndex(app => app.userId.toString() === userId);
    if (applicantIndex === -1) {
      return NextResponse.json({ error: "Applicant not found" }, { status: 404 });
    }

    job.applicants[applicantIndex].status = status;
    job.applicants[applicantIndex].message = message || "";
    
    await job.save();

    return NextResponse.json({ success: true, applicant: job.applicants[applicantIndex] });
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
