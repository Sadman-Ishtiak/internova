import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Job from '@/models/Job';
import { authOptions } from '@/lib/auth';

// DELETE USER
export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  await dbConnect();

  try {
    // Remove user from all job applicants first (prevent orphaned references)
    await Job.updateMany(
      { 'applicants.userId': id },
      { $pull: { applicants: { userId: id } } }
    );
    
    // Then delete the user
    const result = await User.findByIdAndDelete(id);
    
    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: "User deleted and removed from all job applications" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}}
