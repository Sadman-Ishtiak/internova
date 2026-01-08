import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET(req) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const skill = searchParams.get('skill');
    
    // Build query
    const query = { role: 'user', isBanned: false }; // Only show candidates, not admins or banned users

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } }
      ];
    }

    if (skill) {
      query.skills = { $in: [new RegExp(skill, 'i')] };
    }

    // Limit fields returned for public view
    const selectFields = 'name email profileImage title skills contact experience certifications';

    const users = await User.find(query).select(selectFields).limit(50);
    
    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error fetching people:", error);
    return NextResponse.json({ error: "Failed to fetch people" }, { status: 500 });
  }
}
