import StudentProfile from '../models/StudentProfile.js';

// GET /api/student/profile
export const getProfile = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id }).populate('user', 'name email');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/student/profile
export const updateProfile = async (req, res) => {
  try {
    const { rollNumber, branch, year, cgpa, phone } = req.body;
    const update = {};
    if (rollNumber !== undefined) update.rollNumber = rollNumber;
    if (branch !== undefined) update.branch = branch;
    if (year !== undefined) update.year = year;
    if (cgpa !== undefined) update.cgpa = cgpa;
    if (phone !== undefined) update.phone = phone;

    // Mark profile as completed if key fields are present
    const profile = await StudentProfile.findOne({ user: req.user._id });
    if (profile) {
      const merged = { ...profile.toObject(), ...update };
      if (merged.branch && merged.year && merged.rollNumber) update.profileCompleted = true;
    }

    const updated = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: update },
      { new: true, upsert: true }
    ).populate('user', 'name email');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/student/skills
export const updateSkills = async (req, res) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) return res.status(400).json({ message: 'Skills must be an array' });
    const updated = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { $set: { skills } },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/student/resumes
export const addResume = async (req, res) => {
  try {
    const { title, fileUrl } = req.body;
    if (!title || !fileUrl) return res.status(400).json({ message: 'Title and fileUrl required' });

    const profile = await StudentProfile.findOne({ user: req.user._id });
    const isFirst = profile.resumes.length === 0;
    profile.resumes.push({ title, fileUrl, isActive: isFirst });
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/student/resumes/:resumeId
export const deleteResume = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    const resume = profile.resumes.id(req.params.resumeId);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    profile.resumes.pull(req.params.resumeId);

    // If deleted resume was active, make the first remaining one active
    if (resume.isActive && profile.resumes.length > 0) {
      profile.resumes[0].isActive = true;
    }
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/student/resumes/:resumeId/activate
export const activateResume = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    const resume = profile.resumes.id(req.params.resumeId);
    if (!resume) return res.status(404).json({ message: 'Resume not found' });

    // Deactivate all, then activate the chosen one
    profile.resumes.forEach(r => { r.isActive = false; });
    resume.isActive = true;
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/student/projects
export const addProject = async (req, res) => {
  try {
    const { title, description, liveLink, githubLink, skillsUsed } = req.body;
    if (!title) return res.status(400).json({ message: 'Project title is required' });

    const profile = await StudentProfile.findOne({ user: req.user._id });
    profile.projects.push({ title, description, liveLink, githubLink, skillsUsed: skillsUsed || [] });
    await profile.save();
    res.status(201).json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/student/projects/:projectId
export const updateProject = async (req, res) => {
  try {
    const { title, description, liveLink, githubLink, skillsUsed } = req.body;
    const profile = await StudentProfile.findOne({ user: req.user._id });
    const project = profile.projects.id(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (liveLink !== undefined) project.liveLink = liveLink;
    if (githubLink !== undefined) project.githubLink = githubLink;
    if (skillsUsed !== undefined) project.skillsUsed = skillsUsed;

    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/student/projects/:projectId
export const deleteProject = async (req, res) => {
  try {
    const profile = await StudentProfile.findOne({ user: req.user._id });
    const project = profile.projects.id(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    profile.projects.pull(req.params.projectId);
    await profile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
