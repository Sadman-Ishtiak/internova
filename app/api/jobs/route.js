import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

// GET: Fetch all active jobs (Public)
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get('companyId');

  // Only show jobs where deadline is in the future
  let query = { 
    deadline: { $gt: new Date() } 
  };

  if (companyId) {
    query.companyId = companyId;
  }

  // Populate company details so we can show the company name
  const jobs = await Job.find(query).populate('companyId', 'name');
  return NextResponse.json({ jobs });
}

// POST: Create a new Job (Company Only)
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    await dbConnect();

    // Verify User Role
    const user = await User.findById(session.user.id);
    
    // Only allow if user belongs to a company
    if (!user.companyId) {
      return NextResponse.json({ error: "You must belong to a company to post jobs" }, { status: 403 });
    }

    const newJob = await Job.create({
      companyId: user.companyId,
      title: data.title,
      imageUrl: data.imageUrl, // This will be the URL of the uploaded image
      requiredSkills: data.requiredSkills, // Array of strings (Buzzwords)
      deadline: new Date(data.deadline),
      applicants: []
    });

    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}