import mongoose from 'mongoose';

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  managers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['active', 'sunset'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Company || mongoose.model('Company', CompanySchema);