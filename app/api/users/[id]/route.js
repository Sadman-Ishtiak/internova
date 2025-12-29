import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    await dbConnect();

    const user = await User.findById(id).select('name email title profileImage skills experience certifications contact');

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching public profile:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
