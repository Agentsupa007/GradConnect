import RecruiterProfile from '../models/RecruiterProfile.js';
import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';

// GET /api/recruiter/profile
export const getProfile = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/recruiter/profile
export const updateProfile = async (req, res) => {
  try {
    const { companyName, designation, companyWebsite, industry, companyLocation, phone } = req.body;
    const update = {};
    if (companyName !== undefined) update.companyName = companyName;
    if (designation !== undefined) update.designation = designation;
    if (companyWebsite !== undefined) update.companyWebsite = companyWebsite;
    if (industry !== undefined) update.industry = industry;
    if (companyLocation !== undefined) update.companyLocation = companyLocation;
    if (phone !== undefined) update.phone = phone;

    const updated = await RecruiterProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: update },
      { new: true, upsert: true }
    ).populate('user', 'name email');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/recruiter/students
export const getAllStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const students = await StudentProfile.find()
      .populate('user', 'name email')
      .skip(skip)
      .limit(limit)
      .lean();

    // Only include active resume in list view
    const sanitized = students.map(s => ({
      ...s,
      resumes: s.resumes.filter(r => r.isActive),
    }));

    const total = await StudentProfile.countDocuments();
    res.json({ students: sanitized, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/recruiter/students/:studentId
export const getStudentById = async (req, res) => {
  try {
    const student = await StudentProfile.findById(req.params.studentId).populate('user', 'name email');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/recruiter/star/:studentId
export const starStudent = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({ user: req.user._id });
    const studentId = req.params.studentId;
    if (!profile.starredStudents.includes(studentId)) {
      profile.starredStudents.push(studentId);
      await profile.save();
    }
    res.json({ message: 'Student starred', starredStudents: profile.starredStudents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/recruiter/star/:studentId
export const unstarStudent = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({ user: req.user._id });
    profile.starredStudents = profile.starredStudents.filter(
      id => id.toString() !== req.params.studentId
    );
    await profile.save();
    res.json({ message: 'Student unstarred', starredStudents: profile.starredStudents });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/recruiter/starred
export const getStarredStudents = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({ user: req.user._id })
      .populate({
        path: 'starredStudents',
        populate: { path: 'user', select: 'name email' },
      });
    if (!profile) return res.json([]);
    res.json(profile.starredStudents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
