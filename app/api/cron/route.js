import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import User from '@/models/User'; // Needed for population
import nodemailer from 'nodemailer';

// This route is called automatically by Vercel
export async function GET(req) {
  // Security: Verify the request comes from Vercel Cron
  const authHeader = req.headers.get('authorization');
  if (!process.env.CRON_SECRET) {
    console.warn('WARNING: CRON_SECRET not configured. Cron endpoint is publicly accessible!');
  } else if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  await dbConnect();

  try {
    // 1. Find Expired Jobs
    const now = new Date();
    const expiredJobs = await Job.find({ deadline: { $lt: now } })
      .populate('companyId') // To get company name
      .populate('applicants.userId'); // To get applicant details

    if (expiredJobs.length === 0) {
      return NextResponse.json({ message: "No expired jobs found" });
    }

    // 2. Setup Email Transporter with validation
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials not configured');
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Process Each Expired Job
    for (const job of expiredJobs) {
      // Sort applicants: Highest Score First
      const sortedApplicants = job.applicants.sort((a, b) => b.matchScore - a.matchScore);
      
      // Generate CSV String manually
      let csvContent = "Full Name,Email,Match Score (%),Profile Link\n";
      
      sortedApplicants.forEach(app => {
        if (app.userId) {
          const profileLink = `${process.env.NEXTAUTH_URL}/profile/${app.userId._id}`;
          const matchScore = app.matchScore ? app.matchScore.toFixed(1) : 'N/A';
          const escapedName = (app.userId.name || '').replace(/"/g, '""');
          const escapedEmail = (app.userId.email || '').replace(/"/g, '""');
          csvContent += `"${escapedName}","${escapedEmail}","${matchScore}","${profileLink}"\n`;
        }
      });

      // We need the owner's email. 
      // Since we didn't populate owner deep inside companyId, let's fetch it or send to a fallback.
      // For this demo, we will send it to YOUR email (the admin/system email) or the Company Owner if you populate it.
      // Let's assume we send it to the system email for demonstration:
      const targetEmail = process.env.EMAIL_USER; 

      console.log(`Sending CSV for job: ${job.title} to ${targetEmail}`);

      // Send Email
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: targetEmail, // In a real app: job.companyId.ownerId.email
        subject: `[CLOSED] Applicant List for: ${job.title}`,
        text: `The deadline for "${job.title}" has passed.\n\nAttached is the list of ${sortedApplicants.length} applicants, sorted by their skill match score.\n\nThis circular has been removed from the platform.`,
        attachments: [
          {
            filename: `applicants_${job._id}.csv`,
            content: csvContent,
          },
        ],
      });

      // Delete the Job
      await Job.findByIdAndDelete(job._id);
    }

    return NextResponse.json({ 
      success: true, 
      processed: expiredJobs.length 
    });

  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}