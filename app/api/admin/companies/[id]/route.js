import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import dbConnect from '@/lib/db';
import Company from '@/models/Company';
import { authOptions } from '@/lib/auth';

export async function PUT(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  const updateData = await req.json();

  await dbConnect();

  try {
    const company = await Company.findByIdAndUpdate(id, updateData, { new: true });
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });
    return NextResponse.json({ success: true, company });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { id } = await params;
  await dbConnect();

  try {
    const company = await Company.findByIdAndDelete(id);
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}