import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, select: false }, // Hides password from normal queries
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  isBanned: { type: Boolean, default: false },
  
  // Profile Data (For Auto-CV)
  profileImage: String,
  title: String, // e.g., "Full Stack Developer"
  skills: [String], // e.g., ["React", "Node"]
  experience: [{
    company: String,
    role: String,
    years: Number,
    description: String
  }],
  certifications: [{
    name: String,
    imageUrl: String,
    date: Date
  }],
  
  // Company Association
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  companyRole: { type: String, enum: ['owner', 'manager', null], default: null }
});

// This prevents "Model already compiled" errors in Next.js
export default mongoose.models.User || mongoose.model('User', UserSchema);