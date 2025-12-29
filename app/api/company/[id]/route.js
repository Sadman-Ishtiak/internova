import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import Job from '@/models/Job'; // Ensure Job is registered

export async function GET(req, { params }) {
  const { id } = await params;
  await dbConnect();

  try {
    const company = await Company.findById(id);
    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // Fetch active jobs for this company
    const jobs = await Job.find({ 
      companyId: id, 
      deadline: { $gt: new Date() } 
    }).sort({ deadline: 1 });

    return NextResponse.json({ company, jobs });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Company ID" }, { status: 400 });
  }
}