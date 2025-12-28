import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { handler as authOptions } from '../auth/[...nextauth]/route'; // Import auth settings

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  await dbConnect();
  const user = await User.findById(session.user.id);

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Return the user data (excluding password)
  const { password, ...userData } = user._doc;
  return NextResponse.json({ user: userData });
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const data = await req.json();
    await dbConnect();

    // Update the user
    // We explicitly list fields to prevent users from changing their role or ban status
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      {
        title: data.title,
        skills: data.skills, // Array of strings
        experience: data.experience, // Array of objects
        certifications: data.certifications, // Array of objects
        profileImage: data.profileImage, // URL string
      },
      { new: true }
    );

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}