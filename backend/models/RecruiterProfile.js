import mongoose from 'mongoose';

const recruiterProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  companyName: { type: String, default: '' },
  designation: { type: String, default: '' },
  companyWebsite: { type: String, default: '' },
  industry: { type: String, default: '' },
  companyLocation: { type: String, default: '' },
  phone: { type: String, default: '' },
  starredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' }],
}, { timestamps: true });

export default mongoose.model('RecruiterProfile', recruiterProfileSchema);
