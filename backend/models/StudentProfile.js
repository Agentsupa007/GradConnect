import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fileUrl: { type: String, required: true },
  isActive: { type: Boolean, default: false },
  uploadedAt: { type: Date, default: Date.now },
});

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  liveLink: { type: String, default: '' },
  githubLink: { type: String, default: '' },
  skillsUsed: [{ type: String }],
}, { timestamps: true });

const studentProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  rollNumber: { type: String, default: '' },
  branch: { type: String, default: '' },
  year: { type: Number, min: 1, max: 6, default: 1 },
  cgpa: { type: Number, min: 0, max: 10, default: 0 },
  phone: { type: String, default: '' },
  skills: [{ type: String }],
  resumes: [resumeSchema],
  projects: [projectSchema],
  profileCompleted: { type: Boolean, default: false },
  starredStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'StudentProfile' }],
}, { timestamps: true });

export default mongoose.model('StudentProfile', studentProfileSchema);
