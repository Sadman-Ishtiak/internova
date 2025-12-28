import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 } // Auto-delete after 300 seconds (5 mins)
});

export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema);