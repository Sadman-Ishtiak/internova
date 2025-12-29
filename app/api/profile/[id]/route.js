import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Company from '@/models/Company'; // Ensure Company is registered

export async function GET(req, { params }) {
  const { id } = await params;
  await dbConnect();

  try {
    const user = await User.findById(id).select('-password -__v');
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Invalid User ID" }, { status: 400 });
  }
}