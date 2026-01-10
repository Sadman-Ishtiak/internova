import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import { authOptions } from '@/lib/auth';

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { jobId, isGhost } = await req.json();
    await dbConnect();

    const job = await Job.findByIdAndDelete(jobId);

    if (job && isGhost && job.companyId) {
      // Increment ghost strike count for the company
      const Company = (await import('@/models/Company')).default;
      await Company.findByIdAndUpdate(job.companyId, { $inc: { ghostStrikeCount: 1 } });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
