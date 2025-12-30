import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  imageUrl: String,
  description: String,
  industry: { type: String, default: 'Tech' }, // e.g., Tech, Finance, Healthcare
  contact: {
    website: String,
    linkedin: String,
    email: String,
    phone: String,
    location: [String]
  },
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  managers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['active', 'sunset'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);