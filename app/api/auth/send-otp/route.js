import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Otp from '@/models/Otp';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email } = await req.json();
    await dbConnect();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 2. Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Save to DB (Update if exists or Create new)
    await Otp.findOneAndUpdate(
      { email }, 
      { otp: otpCode }, 
      { upsert: true, new: true }
    );

    // 4. Send Email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Job Portal Verification Code',
      text: `Your OTP code is: ${otpCode}. It expires in 5 minutes.`,
    });

    return NextResponse.json({ success: true, message: "OTP sent" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}