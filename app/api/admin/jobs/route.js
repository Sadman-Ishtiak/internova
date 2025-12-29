import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  await dbConnect();

  try {
    const jobs = await Job.find().populate('companyId').sort({ deadline: 1 });
    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}