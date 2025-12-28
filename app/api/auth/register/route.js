import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Otp from '@/models/Otp';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { name, email, password, otp } = await req.json();
    await dbConnect();

    // 1. Verify OTP
    const validOtp = await Otp.findOne({ email, otp });
    if (!validOtp) {
      return NextResponse.json({ error: "Invalid or Expired OTP" }, { status: 400 });
    }

    // 2. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create User
    await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default role
      isBanned: false
    });

    // 4. Delete used OTP
    await Otp.deleteOne({ _id: validOtp._id });

    return NextResponse.json({ success: true, message: "Account created successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}