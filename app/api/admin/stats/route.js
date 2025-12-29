import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Job from '@/models/Job';
import Company from '@/models/Company';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await dbConnect();

  try {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalCompanies = await Company.countDocuments();
    
    // Recent 5 users
    const recentUsers = await User.find().sort({ _id: -1 }).limit(5);

    return NextResponse.json({
      totalUsers,
      totalJobs,
      totalCompanies,
      recentUsers
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}