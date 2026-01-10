import mongoose from 'mongoose';

const JobSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  title: { type: String, required: true },
  location: { type: String, default: 'Remote' },
  category: { type: String, required: true }, // e.g. IT, Finance, Marketing
  industry: { type: String, required: true }, // e.g. Technology, Healthcare, Construction
  description: { type: String },
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
        matchScore: Number, // From 0 to 100
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
        message: { type: String } // Message from company
      }],
      reports: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reason: String,
        createdAt: { type: Date, default: Date.now }
      }],
      isFlagged: { type: Boolean, default: false },
      lastActivityAt: { type: Date, default: Date.now } // Tracks when company updates status
    });

export default mongoose.models.Job || mongoose.model('Job', JobSchema);