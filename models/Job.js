import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
      type: { type: String, enum: ['job', 'internship'], default: 'job' },
      imageUrl: String, // Banner for the job
      salary: {
        min: Number,
        max: Number,
        currency: { type: String, default: 'USD' },
        period: { type: String, enum: ['annually', 'monthly', 'hourly'], default: 'annually' }
      },
      requiredSkills: [String], // Array of strings (Buzzwords)
      deadline: { type: Date, required: true }, // Will store both date and time
      applicants: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        appliedAt: { type: Date, default: Date.now },
        matchScore: Number // From 0 to 100
      }]
    });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);