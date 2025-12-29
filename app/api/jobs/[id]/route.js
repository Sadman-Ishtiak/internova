import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import Company from '@/models/Company'; // Ensure Company is registered

export async function GET(req, { params }) {
  const { id } = await params;
  await dbConnect();

  try {
    const job = await Job.findById(id).populate('companyId');
    
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Job ID" }, { status: 400 });
  }
}