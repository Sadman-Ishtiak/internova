import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';

export async function GET() {
  try {
    await dbConnect();

    // Aggregate active jobs by category
    const categoryStats = await Job.aggregate([
      {
        $match: {
          deadline: { $gt: new Date() } // Only active jobs
        }
      },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 } // Descending order
      },
      {
        $limit: 8 // Limit to top 8 for the homepage
      }
    ]);

    // Format the response
    const formattedStats = categoryStats.map(stat => ({
      name: stat._id || "Other", // Handle missing category
      count: stat.count
    }));

    return NextResponse.json({ categories: formattedStats });
  } catch (error) {
    console.error("Error fetching category stats:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
