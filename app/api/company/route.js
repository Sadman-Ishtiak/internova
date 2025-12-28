import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import User from '@/models/User';
import { authOptions } from '@/lib/auth';

// GET: Fetch the user's company details
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  
  // Find the company where the user is Owner OR Manager
  const company = await Company.findOne({
    $or: [{ ownerId: session.user.id }, { managers: session.user.id }]
  });

  if (!company) return NextResponse.json({ company: null });

  return NextResponse.json({ company });
}

// POST: Create a new company
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, description } = await req.json();
    await dbConnect();

    // Check if user is already in a company
    const user = await User.findById(session.user.id);
    if (user.companyId) {
      return NextResponse.json({ error: "You are already part of a company" }, { status: 400 });
    }

    // 1. Create Company
    const newCompany = await Company.create({
      name,
      description,
      ownerId: user._id,
      managers: [],
      status: 'active'
    });

    // 2. Update User (Make them Owner)
    user.companyId = newCompany._id;
    user.companyRole = 'owner';
    await user.save();

    return NextResponse.json({ success: true, company: newCompany });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}