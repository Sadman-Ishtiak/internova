import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Otp from '@/models/Otp';
import User from '@/models/User';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email } = await req.json();
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    
    await dbConnect();

    // 1. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    
    // 2. Check for rate limiting - prevent spam (max 3 OTPs per 15 minutes)
    const recentOtpCount = await Otp.countDocuments({
      email,
      createdAt: { $gt: new Date(Date.now() - 15 * 60 * 1000) } // Last 15 minutes
    });
    
    if (recentOtpCount >= 3) {
      return NextResponse.json({ 
        error: "Too many OTP requests. Please try again in 15 minutes." 
      }, { status: 429 });
    }

    // 3. Generate 6 digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 4. Save to DB (Update if exists or Create new)
    await Otp.findOneAndUpdate(
      { email }, 
      { otp: otpCode, createdAt: new Date() }, 
      { upsert: true, new: true }
    );

    // 5. Send Email
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email credentials not configured');
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }
    
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