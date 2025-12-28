import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  imageUrl: { type: String, required: true }, // The circular image URL
  requiredSkills: [String], // The "Buzzwords" to match against users
  deadline: { type: Date, required: true },
  applicants: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    matchScore: Number, // Calculated score (0-100)
    appliedAt: { type: Date, default: Date.now }
  }]
});

export default mongoose.models.Job || mongoose.model('Job', JobSchema);