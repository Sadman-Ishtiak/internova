import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import Company from '@/models/Company'; // Ensure Company model is registered
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

// GET: Fetch all active jobs (Public)
export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const companyId = searchParams.get('companyId');
  const search = searchParams.get('search');
  const type = searchParams.get('type');
  const includeExpired = searchParams.get('includeExpired') === 'true';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, parseInt(searchParams.get('limit') || '20')); // Max 100 per page
  const skip = (page - 1) * limit;

  // Only show jobs where deadline is in the future, unless includeExpired is set
  let query = {};
  if (!includeExpired) {
    query.deadline = { $gt: new Date() };
  }

  if (companyId) {
    query.companyId = companyId;
  }

  if (type && type !== 'all') {
    query.type = type;
  }

  if (search) {
    // Escape regex special characters to prevent ReDoS attacks
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const searchRegex = new RegExp(escapedSearch, 'i'); // Case-insensitive
    query.$or = [
      { title: { $regex: searchRegex } },
      { requiredSkills: { $regex: searchRegex } }
    ];
  }

  // Populate company details so we can show the company name
  const jobs = await Job.find(query).sort({ deadline: -1 }).skip(skip).limit(limit);
  const totalJobs = await Job.countDocuments(query);
  const totalPages = Math.ceil(totalJobs / limit);
  
  return NextResponse.json({ 
    jobs: jobs.map(job => ({
      ...job.toObject(),
      companyId: typeof job.companyId === 'object' ? job.companyId : { _id: job.companyId }
    })),
    pagination: {
      page,
      limit,
      totalJobs,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  });
}

// POST: Create a new Job (Company Only)
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    await dbConnect();
    
    // Validate required fields
    if (!data.title || !data.title.trim()) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }
    if (!data.deadline) {
      return NextResponse.json({ error: "Deadline is required" }, { status: 400 });
    }
    if (new Date(data.deadline) <= new Date()) {
      return NextResponse.json({ error: "Deadline must be in the future" }, { status: 400 });
    }
    if (!data.requiredSkills || data.requiredSkills.length === 0) {
      return NextResponse.json({ error: "At least one skill is required" }, { status: 400 });
    }

    // Verify User Role
    const user = await User.findById(session.user.id);
    
    // Only allow if user belongs to a company
    if (!user.companyId) {
      return NextResponse.json({ error: "You must belong to a company to post jobs" }, { status: 403 });
    }
    
    // Verify company exists
    const company = await Company.findById(user.companyId);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const newJob = await Job.create({
      companyId: user.companyId,
      title: data.title,
      type: data.type || 'job',
      imageUrl: data.imageUrl,
      salary: data.salary,
      requiredSkills: data.requiredSkills, // Array of strings (Buzzwords)
      deadline: new Date(data.deadline),
      applicants: []
    });

    return NextResponse.json({ success: true, job: newJob });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update a Job
export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { jobId, title, type, imageUrl, salary, requiredSkills, deadline } = await req.json();
    await dbConnect();
    
    // Validate required fields
    if (title && !title.trim()) {
      return NextResponse.json({ error: "Job title cannot be empty" }, { status: 400 });
    }
    if (deadline && new Date(deadline) <= new Date()) {
      return NextResponse.json({ error: "Deadline must be in the future" }, { status: 400 });
    }
    if (requiredSkills && requiredSkills.length === 0) {
      return NextResponse.json({ error: "At least one skill is required" }, { status: 400 });
    }

    const user = await User.findById(session.user.id);
    const job = await Job.findById(jobId);

    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // Verify Ownership: User must be in the company that owns the job
    if (!user.companyId || user.companyId.toString() !== job.companyId.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update Fields
    if (title) job.title = title;
    if (type) job.type = type;
    if (imageUrl) job.imageUrl = imageUrl;
    if (salary) job.salary = salary;
    if (requiredSkills) job.requiredSkills = requiredSkills;
    if (deadline) job.deadline = new Date(deadline);

    await job.save();

    return NextResponse.json({ success: true, job });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a Job
export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { jobId } = await req.json();
    await dbConnect();

    const user = await User.findById(session.user.id);
    const job = await Job.findById(jobId);

    if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

    // Verify Ownership
    if (!user.companyId || user.companyId.toString() !== job.companyId.toString()) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await Job.findByIdAndDelete(jobId);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}