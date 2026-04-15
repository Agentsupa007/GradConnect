import mongoose from 'mongoose';

const roundSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
}, { _id: false });

const jobSchema = new mongoose.Schema({
  recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'RecruiterProfile', required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  location: { type: String, default: '' },
  jobType: {
    type: String,
    enum: ['Full-time', 'Internship', 'Part-time', 'Contract'],
    default: 'Full-time',
  },
  package: { type: String, default: '' },
  eligibility: {
    branches: [{ type: String }],
    minCGPA: { type: Number, default: 0 },
    years: [{ type: Number }],
  },
  skillsRequired: [{ type: String }],
  rounds: [roundSchema],
  deadline: { type: Date, default: null },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
}, { timestamps: true });

export default mongoose.model('Job', jobSchema);
