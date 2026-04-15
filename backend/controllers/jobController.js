import Job from '../models/Job.js';
import Application from '../models/Application.js';
import RecruiterProfile from '../models/RecruiterProfile.js';

const recruiterOf = (userId) => RecruiterProfile.findOne({ user: userId });

// POST /api/recruiter/jobs
export const createJob = async (req, res) => {
  try {
    const rp = await recruiterOf(req.user._id);
    if (!rp) return res.status(404).json({ message: 'Recruiter profile not found' });

    const { title, description, location, jobType, package: pkg, eligibility, skillsRequired, rounds, deadline, status } = req.body;
    const job = await Job.create({
      recruiter: rp._id,
      title, description, location, jobType,
      package: pkg,
      eligibility: eligibility || {},
      skillsRequired: skillsRequired || [],
      rounds: rounds || [],
      deadline: deadline || null,
      status: status || 'open',
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/recruiter/jobs
export const getMyJobs = async (req, res) => {
  try {
    const rp = await recruiterOf(req.user._id);
    if (!rp) return res.json([]);

    const jobs = await Job.find({ recruiter: rp._id }).sort({ createdAt: -1 }).lean();

    const jobIds = jobs.map(j => j._id);
    const counts = await Application.aggregate([
      { $match: { job: { $in: jobIds } } },
      {
        $group: {
          _id: '$job',
          total: { $sum: 1 },
          selected: { $sum: { $cond: [{ $eq: ['$status', 'selected'] }, 1, 0] } },
        },
      },
    ]);
    const countMap = {};
    counts.forEach(c => { countMap[c._id.toString()] = c; });

    const result = jobs.map(j => ({
      ...j,
      applicantCount: countMap[j._id.toString()]?.total || 0,
      selectedCount: countMap[j._id.toString()]?.selected || 0,
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/recruiter/jobs/:jobId
export const getJobById = async (req, res) => {
  try {
    const rp = await recruiterOf(req.user._id);
    const job = await Job.findOne({ _id: req.params.jobId, recruiter: rp._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/recruiter/jobs/:jobId
export const updateJob = async (req, res) => {
  try {
    const rp = await recruiterOf(req.user._id);
    const job = await Job.findOneAndUpdate(
      { _id: req.params.jobId, recruiter: rp._id },
      { $set: req.body },
      { new: true }
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /api/recruiter/jobs/:jobId
export const deleteJob = async (req, res) => {
  try {
    const rp = await recruiterOf(req.user._id);
    const job = await Job.findOneAndDelete({ _id: req.params.jobId, recruiter: rp._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });
    await Application.deleteMany({ job: req.params.jobId });
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/recruiter/jobs/:jobId/applications
export const getJobApplications = async (req, res) => {
  try {
    const rp = await recruiterOf(req.user._id);
    const job = await Job.findOne({ _id: req.params.jobId, recruiter: rp._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const applications = await Application.find({ job: req.params.jobId })
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .sort({ createdAt: -1 });

    res.json({ job, applications });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/recruiter/jobs/:jobId/applications/:appId/advance
export const advanceApplication = async (req, res) => {
  try {
    const rp = await recruiterOf(req.user._id);
    const job = await Job.findOne({ _id: req.params.jobId, recruiter: rp._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const app = await Application.findOne({ _id: req.params.appId, job: req.params.jobId });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    if (app.status === 'rejected' || app.status === 'selected') {
      return res.status(400).json({ message: 'Cannot advance a finalized application' });
    }

    const nextRound = app.currentRound + 1;
    if (nextRound >= job.rounds.length) {
      return res.status(400).json({ message: 'No more rounds to advance to. Use "Select" to finalize.' });
    }

    app.currentRound = nextRound;
    app.status = 'in_progress';
    app.history.push({
      action: 'advanced',
      roundName: job.rounds[nextRound].name,
      note: req.body.note || '',
    });
    await app.save();
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/recruiter/jobs/:jobId/applications/:appId/reject
export const rejectApplication = async (req, res) => {
  try {
    const rp = await recruiterOf(req.user._id);
    const job = await Job.findOne({ _id: req.params.jobId, recruiter: rp._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const app = await Application.findOne({ _id: req.params.appId, job: req.params.jobId });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    if (app.status === 'selected') return res.status(400).json({ message: 'Cannot reject a selected candidate' });

    const currentRoundName = app.currentRound >= 0
      ? (job.rounds[app.currentRound]?.name || `Round ${app.currentRound + 1}`)
      : 'Initial Review';

    app.status = 'rejected';
    app.history.push({ action: 'rejected', roundName: currentRoundName, note: req.body.note || '' });
    await app.save();
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/recruiter/jobs/:jobId/applications/:appId/select
export const selectApplication = async (req, res) => {
  try {
    const rp = await recruiterOf(req.user._id);
    const job = await Job.findOne({ _id: req.params.jobId, recruiter: rp._id });
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const app = await Application.findOne({ _id: req.params.appId, job: req.params.jobId });
    if (!app) return res.status(404).json({ message: 'Application not found' });
    if (app.status === 'rejected') return res.status(400).json({ message: 'Cannot select a rejected candidate' });

    app.status = 'selected';
    app.history.push({ action: 'selected', roundName: 'Final Selection', note: req.body.note || '' });
    await app.save();
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
