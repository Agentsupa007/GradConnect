import Job from '../models/Job.js';
import Application from '../models/Application.js';
import StudentProfile from '../models/StudentProfile.js';
import AlumniProfile from '../models/AlumniProfile.js';

// GET /api/student/jobs  — browse all open jobs
export const getOpenJobs = async (req, res) => {
  try {
    const now = new Date();
    const jobs = await Job.find({
      status: 'open',
      $or: [{ deadline: null }, { deadline: { $gte: now } }],
    })
      .populate({ path: 'recruiter', populate: { path: 'user', select: 'name' } })
      .sort({ createdAt: -1 })
      .lean();

    const studentProfile = await StudentProfile.findOne({ user: req.user._id });
    const appliedJobIds = new Set();
    if (studentProfile) {
      const apps = await Application.find({ student: studentProfile._id }).select('job');
      apps.forEach(a => appliedJobIds.add(a.job.toString()));
    }

    const result = jobs.map(j => ({ ...j, hasApplied: appliedJobIds.has(j._id.toString()) }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/student/jobs/:jobId/apply
export const applyToJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status !== 'open') return res.status(400).json({ message: 'This job is no longer accepting applications' });
    if (job.deadline && new Date() > job.deadline) {
      return res.status(400).json({ message: 'The application deadline has passed' });
    }

    const sp = await StudentProfile.findOne({ user: req.user._id });
    if (!sp) return res.status(404).json({ message: 'Complete your student profile before applying' });

    const existing = await Application.findOne({ job: job._id, student: sp._id });
    if (existing) return res.status(400).json({ message: 'You have already applied to this job' });

    const app = await Application.create({
      job: job._id,
      student: sp._id,
      status: 'applied',
      currentRound: -1,
      history: [{ action: 'applied', roundName: 'Application Submitted', note: '' }],
    });
    res.status(201).json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/student/applications
export const getMyApplications = async (req, res) => {
  try {
    const sp = await StudentProfile.findOne({ user: req.user._id });
    if (!sp) return res.json([]);

    const applications = await Application.find({ student: sp._id })
      .populate({
        path: 'job',
        populate: { path: 'recruiter', populate: { path: 'user', select: 'name' } },
      })
      .sort({ updatedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/student/mentors  — search alumni mentors
export const getMentors = async (req, res) => {
  try {
    const { skills, company, branch, minYoe, maxYoe, availableOnly } = req.query;

    const query = {};
    if (availableOnly !== 'false') query.isAvailableForMentorship = true;
    if (company) query.currentCompany = { $regex: company, $options: 'i' };
    if (branch) query.branch = branch;
    if (minYoe || maxYoe) {
      query.yearsOfExperience = {};
      if (minYoe) query.yearsOfExperience.$gte = parseInt(minYoe);
      if (maxYoe) query.yearsOfExperience.$lte = parseInt(maxYoe);
    }

    let mentors = await AlumniProfile.find(query)
      .populate('user', 'name email')
      .lean();

    // Rank by skill overlap if skills filter is provided
    const skillList = skills ? skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    mentors = mentors.map(m => ({
      ...m,
      matchCount: skillList.length > 0
        ? (m.skills || []).filter(s => skillList.includes(s)).length
        : 0,
    }));

    if (skillList.length > 0) {
      mentors.sort((a, b) => b.matchCount - a.matchCount);
    }

    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/student/placements  — all selected students grouped by company
export const getPlacements = async (req, res) => {
  try {
    const selections = await Application.find({ status: 'selected' })
      .populate({ path: 'student', populate: { path: 'user', select: 'name email' } })
      .populate({ path: 'job', populate: { path: 'recruiter', populate: { path: 'user', select: 'name' } } })
      .lean();

    // Group: company → job → [students]
    const companyMap = {};
    for (const sel of selections) {
      const rp = sel.job?.recruiter;
      const companyName = rp?.companyName || 'Unknown Company';
      if (!companyMap[companyName]) {
        companyMap[companyName] = {
          companyName,
          companyLocation: rp?.companyLocation || '',
          industry: rp?.industry || '',
          jobs: {},
        };
      }
      const jobKey = sel.job?._id?.toString();
      if (jobKey && !companyMap[companyName].jobs[jobKey]) {
        companyMap[companyName].jobs[jobKey] = {
          title: sel.job.title,
          package: sel.job.package,
          jobType: sel.job.jobType,
          students: [],
        };
      }
      if (jobKey) {
        companyMap[companyName].jobs[jobKey].students.push({
          _id: sel.student._id,
          name: sel.student.user?.name,
          branch: sel.student.branch,
          year: sel.student.year,
          cgpa: sel.student.cgpa,
        });
      }
    }

    const result = Object.values(companyMap).map(c => ({
      ...c,
      jobs: Object.values(c.jobs),
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
