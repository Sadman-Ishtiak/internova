import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    await dbConnect();

    // 1. Ghost Job Analysis
    // Criteria: Active jobs created > 30 days ago, with applicants > 0, but no activity in the last 30 days.
    // We increased this from 14 to 30 days to account for slow hiring processes.
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    
    const ghostJobs = await Job.find({
      deadline: { $gt: new Date() }, // Active
      $expr: { $gt: [{ $size: "$applicants" }, 0] }, // Has applicants
      $or: [
        { lastActivityAt: { $lt: thirtyDaysAgo } }, // Inactive since 30 days
        { lastActivityAt: { $exists: false }, createdAt: { $lt: thirtyDaysAgo } } // Or never active and created > 30 days ago
      ]
    })
    .populate('companyId', 'name')
    .limit(20)
    .select('title companyId applicants createdAt lastActivityAt');

    // 2. Fake User Analysis (Spam detection)
    // Criteria A: High Velocity - Users with > 50 applications in the last 24 hours.
    // Criteria B: New Account Burst - Users created < 24h ago with > 15 applications.
    
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const spamUsersAggregation = await Job.aggregate([
      { $unwind: "$applicants" },
      { $match: { "applicants.appliedAt": { $gt: oneDayAgo } } },
      {
        $group: {
          _id: "$applicants.userId",
          applicationCount: { $sum: 1 }
        }
      },
      // Initial filter for efficiency, strict logic applied below
      { $match: { applicationCount: { $gt: 15 } } }, 
      { $sort: { applicationCount: -1 } },
      { $limit: 30 }
    ]);

    // Populate user details to check creation date and certifications
    const potentialSpamUsers = await User.find({
        _id: { $in: spamUsersAggregation.map(u => u._id) }
    }).select('name email createdAt certifications');
    
    const flaggedUsers = [];

    potentialSpamUsers.forEach(user => {
        const stats = spamUsersAggregation.find(s => s._id.toString() === user._id.toString());
        const count = stats ? stats.applicationCount : 0;
        const isNewAccount = new Date(user.createdAt) > oneDayAgo;

        // Calculate Dynamic Limits based on Certifications
        let velocityLimit = 50;
        let newAccountLimit = 15;

        if (user.certifications && user.certifications.length > 0) {
            user.certifications.forEach(cert => {
                if (cert.type === 'Professional') {
                    velocityLimit += 20;
                    newAccountLimit += 5;
                } else if (cert.type === 'Academic') {
                    velocityLimit += 10;
                    newAccountLimit += 2;
                } else {
                    velocityLimit += 5;
                    newAccountLimit += 1;
                }
            });
        }

        // Rule A: High Volume (> velocityLimit apps/day)
        // Rule B: New Account Burst (New account + > newAccountLimit apps)
        if (count > velocityLimit || (isNewAccount && count > newAccountLimit)) {
            flaggedUsers.push({
                ...user.toObject(),
                applicationCount: count,
                flagReason: count > velocityLimit 
                    ? `High Volume (> ${velocityLimit} apps/day)` 
                    : `New Account Burst (> ${newAccountLimit} apps)`
            });
        }
    });

    return NextResponse.json({
      ghostJobs: ghostJobs.map(job => ({
        _id: job._id,
        title: job.title,
        company: job.companyId?.name || "Unknown",
        applicantCount: job.applicants.length,
        createdAt: job.createdAt,
        lastActivityAt: job.lastActivityAt || job.createdAt,
        status: "Ghost Circular (Inactive 30+ days)"
      })),
      fakeUsers: flaggedUsers.map(user => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        applicationCount: user.applicationCount,
        status: user.flagReason
      }))
    });

  } catch (error) {
    console.error("Risk Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
