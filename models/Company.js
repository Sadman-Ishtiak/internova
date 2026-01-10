import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  tagline: { type: String, maxLength: 200 },
  imageUrl: String,
  description: String,
  industry: { type: String, default: 'Tech' }, // e.g., Tech, Finance, Healthcare
  companySize: { 
    type: String, 
    enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
    default: '1-10'
  },
  companyType: {
    type: String,
    enum: ['Privately Held', 'Public Company', 'Non-Profit', 'Self-Employed', 'Government Agency', 'Startup'],
    default: 'Privately Held'
  },
  foundedYear: Number,
  specialties: [String], // e.g., ["Software Development", "Cloud Computing"]
  contact: {
    website: String,
    linkedin: String,
    email: String,
    phone: String,
    location: [String]
  },
  socialMedia: {
    facebook: String,
    twitter: String,
    instagram: String,
    youtube: String
  },
  benefits: [String], // e.g., ["Health Insurance", "Flexible Hours"]
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  managers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['active', 'sunset'], default: 'active' },
  verified: { type: Boolean, default: false },
  featured: { type: Boolean, default: false },
  ghostStrikeCount: { type: Number, default: 0 }, // Tracks frequency of ghost/inactive circulars
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);