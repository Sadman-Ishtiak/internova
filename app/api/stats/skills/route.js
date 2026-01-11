import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  try {
    await dbConnect();

    // Aggregate skills from all users
    const skillStats = await User.aggregate([
      { $unwind: "$skills" }, // Deconstruct the skills array
      { 
        $group: { 
          _id: { $toLower: "$skills" }, // Group by lowercase to avoid duplicates like "React" vs "react"
          original: { $first: "$skills" }, // Keep one original casing
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } }, // Sort by popularity
      { $limit: 50 } // Limit to top 50
    ]);

    const skills = skillStats.map(stat => stat.original).sort();

    return NextResponse.json({ skills });
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
