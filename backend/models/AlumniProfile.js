import mongoose from 'mongoose';

const alumniProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  currentCompany: { type: String, default: '' },
  currentRole: { type: String, default: '' },
  graduationYear: { type: Number, default: null },
  branch: { type: String, default: '' },
  linkedInUrl: { type: String, default: '' },
  bio: { type: String, default: '' },
  phone: { type: String, default: '' },
  skills: [{ type: String }],
  yearsOfExperience: { type: Number, default: null },
  isAvailableForMentorship: { type: Boolean, default: true },
  starredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' }],
}, { timestamps: true });

export default mongoose.model('AlumniProfile', alumniProfileSchema);
