import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, maxLength: 100 },
  email: { type: String, unique: true, required: true, maxLength: 100 },
  password: { type: String, select: false }, // Hides password from normal queries
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  isBanned: { type: Boolean, default: false },
  
  // Profile Data (For Auto-CV)
  profileImage: String,
  title: { type: String, maxLength: 200 }, // e.g., "Full Stack Developer"
  contact: {
    phone: { type: String, maxLength: 50 },
    linkedin: { type: String, maxLength: 200 },
    github: { type: String, maxLength: 200 },
    website: { type: String, maxLength: 200 },
    location: { type: String, maxLength: 100 }
  },
  skills: [String], // e.g., ["React", "Node"]
  experience: [{
    company: String,
    role: String,
    years: Number,
    description: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    url: String,
    type: { 
      type: String, 
      enum: ['Academic', 'Professional', 'Extracurricular'], 
      default: 'Professional' 
    }
  }],
  
  // Company Association
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  companyRole: { type: String, enum: ['owner', 'manager', null], default: null }
});

// This prevents "Model already compiled" errors in Next.js
export default mongoose.models.User || mongoose.model('User', UserSchema);