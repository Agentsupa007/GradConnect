import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import RecruiterProfile from '../models/RecruiterProfile.js';
import Job from '../models/Job.js';

// ─── Recruiters ────────────────────────────────────────────────────────────────

const RECRUITERS = [
  {
    name: 'Rahul Kapoor',
    email: 'rahul.kapoor@tcs.com',
    profile: {
      companyName: 'Tata Consultancy Services',
      designation: 'Talent Acquisition Manager',
      companyWebsite: 'https://www.tcs.com',
      industry: 'IT Services & Consulting',
      companyLocation: 'Mumbai, Maharashtra',
      phone: '+91 98200 11111',
    },
  },
  {
    name: 'Anjali Verma',
    email: 'anjali.verma@infosys.com',
    profile: {
      companyName: 'Infosys',
      designation: 'Campus Recruiter',
      companyWebsite: 'https://www.infosys.com',
      industry: 'IT Services & Consulting',
      companyLocation: 'Bengaluru, Karnataka',
      phone: '+91 98200 22222',
    },
  },
  {
    name: 'Sameer Bhat',
    email: 'sameer.bhat@amazon.com',
    profile: {
      companyName: 'Amazon',
      designation: 'University Recruiter',
      companyWebsite: 'https://www.amazon.jobs',
      industry: 'E-commerce & Cloud',
      companyLocation: 'Hyderabad, Telangana',
      phone: '+91 98200 33333',
    },
  },
  {
    name: 'Neha Joshi',
    email: 'neha.joshi@google.com',
    profile: {
      companyName: 'Google',
      designation: 'Engineering Recruiter',
      companyWebsite: 'https://careers.google.com',
      industry: 'Internet & Technology',
      companyLocation: 'Bengaluru, Karnataka',
      phone: '+91 98200 44444',
    },
  },
  {
    name: 'Vikram Nair',
    email: 'vikram.nair@wipro.com',
    profile: {
      companyName: 'Wipro',
      designation: 'HR Business Partner',
      companyWebsite: 'https://www.wipro.com',
      industry: 'IT Services & Consulting',
      companyLocation: 'Pune, Maharashtra',
      phone: '+91 98200 55555',
    },
  },
];

// ─── Jobs (keyed by recruiter email) ───────────────────────────────────────────

const JOBS = [
  // ── TCS ──
  {
    recruiterEmail: 'rahul.kapoor@tcs.com',
    title: 'Software Engineer',
    description:
      'Join TCS as a Software Engineer to work on large-scale enterprise solutions for global clients. You will be part of an agile team delivering high-quality software across banking, retail, and logistics domains.',
    location: 'Pan India',
    jobType: 'Full-time',
    package: '7 LPA',
    eligibility: {
      branches: [
        'Computer Science Engineering',
        'Information Technology',
        'Electronics & Communication',
        'Electrical Engineering',
      ],
      minCGPA: 6.0,
      years: [4],
    },
    skillsRequired: ['Java', 'SQL', 'Problem Solving', 'DSA'],
    rounds: [
      { name: 'TCS National Qualifier Test (NQT)', description: 'Online aptitude + coding test on the TCS iON platform. Covers verbal, reasoning, and programming logic.' },
      { name: 'Technical Interview', description: 'Discussion on CS fundamentals — OOPs, DBMS, OS, and one coding problem.' },
      { name: 'HR Interview', description: 'Culture fit, career goals, and offer discussion.' },
    ],
    deadline: daysFromNow(30),
    status: 'open',
  },
  {
    recruiterEmail: 'rahul.kapoor@tcs.com',
    title: 'Data Analyst Intern',
    description:
      'A 6-month internship on TCS\'s internal analytics team. Work on real datasets from manufacturing and supply chain clients, building dashboards and predictive models.',
    location: 'Mumbai, Maharashtra',
    jobType: 'Internship',
    package: '₹25,000/month',
    eligibility: {
      branches: ['Data Science', 'Artificial Intelligence', 'Computer Science Engineering'],
      minCGPA: 7.0,
      years: [3, 4],
    },
    skillsRequired: ['Python', 'Pandas', 'Data Analysis', 'SQL'],
    rounds: [
      { name: 'Online Assessment', description: 'SQL queries, Python data manipulation tasks, and a short case study.' },
      { name: 'Technical Interview', description: 'Live data analysis exercise and discussion of your past projects.' },
    ],
    deadline: daysFromNow(20),
    status: 'open',
  },

  // ── Infosys ──
  {
    recruiterEmail: 'anjali.verma@infosys.com',
    title: 'Systems Engineer',
    description:
      'Infosys Systems Engineers work across a variety of technology stacks, building and maintaining software systems for Fortune 500 clients. Selected candidates undergo 3 months of training at the Infosys Mysuru campus.',
    location: 'Mysuru / Client Location',
    jobType: 'Full-time',
    package: '6.5 LPA',
    eligibility: {
      branches: [
        'Computer Science Engineering',
        'Information Technology',
        'Electronics & Communication',
        'Electrical Engineering',
        'Mechanical Engineering',
      ],
      minCGPA: 6.5,
      years: [4],
    },
    skillsRequired: ['Problem Solving', 'Java', 'SQL', 'Agile'],
    rounds: [
      { name: 'InfyTQ Certification', description: 'Online test covering programming fundamentals and reasoning. Must score ≥65%.' },
      { name: 'Hackathon / Online Coding Round', description: 'Two coding problems of medium difficulty within 90 minutes.' },
      { name: 'HR Interview', description: 'Behavioural questions and offer fitment discussion.' },
    ],
    deadline: daysFromNow(25),
    status: 'open',
  },
  {
    recruiterEmail: 'anjali.verma@infosys.com',
    title: 'Frontend Developer Intern',
    description:
      'Work with Infosys\'s digital experience team to build responsive web interfaces for banking and insurance clients. Expected to contribute production code within the first month.',
    location: 'Bengaluru, Karnataka',
    jobType: 'Internship',
    package: '₹30,000/month',
    eligibility: {
      branches: ['Computer Science Engineering', 'Information Technology'],
      minCGPA: 7.5,
      years: [3],
    },
    skillsRequired: ['React.js', 'JavaScript', 'HTML', 'CSS', 'TypeScript'],
    rounds: [
      { name: 'Portfolio Review', description: 'Submit a GitHub profile or live project link before the interview.' },
      { name: 'Technical Interview', description: 'Live coding exercise (React component) and CSS/JS fundamentals.' },
    ],
    deadline: daysFromNow(15),
    status: 'open',
  },

  // ── Amazon ──
  {
    recruiterEmail: 'sameer.bhat@amazon.com',
    title: 'Software Development Engineer (SDE-1)',
    description:
      'Join one of Amazon\'s product or infrastructure teams in Hyderabad. SDE-1s own and ship features independently, participate in design reviews, and are mentored by senior engineers. Work on systems serving hundreds of millions of customers.',
    location: 'Hyderabad, Telangana',
    jobType: 'Full-time',
    package: '26 LPA',
    eligibility: {
      branches: ['Computer Science Engineering', 'Information Technology', 'Artificial Intelligence', 'Data Science'],
      minCGPA: 7.5,
      years: [4],
    },
    skillsRequired: ['DSA', 'Problem Solving', 'JavaScript', 'Python', 'System Design'],
    rounds: [
      { name: 'Online Assessment (OA)', description: 'Two DSA problems (medium–hard) on HackerEarth. 90 minutes. Focus: arrays, trees, graphs, DP.' },
      { name: 'Technical Interview 1 — DSA', description: 'Two coding problems with complexity analysis. Be ready to optimise your solution.' },
      { name: 'Technical Interview 2 — System Design & LLD', description: 'Design a scalable system (e.g. URL shortener, rate limiter). Class diagrams and discussion.' },
      { name: 'Bar Raiser Interview', description: 'Amazon Leadership Principles + a coding/design question. Conducted by a senior from a different team.' },
    ],
    deadline: daysFromNow(45),
    status: 'open',
  },
  {
    recruiterEmail: 'sameer.bhat@amazon.com',
    title: 'Cloud Support Engineer Intern',
    description:
      'A 6-month internship with the AWS Technical Support team. Resolve complex customer infrastructure issues and build internal tooling to improve support workflows.',
    location: 'Hyderabad, Telangana',
    jobType: 'Internship',
    package: '₹60,000/month',
    eligibility: {
      branches: ['Computer Science Engineering', 'Information Technology', 'Electronics & Communication'],
      minCGPA: 7.0,
      years: [3, 4],
    },
    skillsRequired: ['AWS', 'Linux', 'Python', 'Networking', 'Docker'],
    rounds: [
      { name: 'Technical Phone Screen', description: 'Linux basics, networking concepts (TCP/IP, DNS), and one scripting problem in Python/Bash.' },
      { name: 'Technical Interview', description: 'AWS service deep-dive (EC2, S3, VPC) and a troubleshooting scenario walkthrough.' },
      { name: 'HR & Culture Fit', description: 'Amazon Leadership Principles — STAR format behavioural questions.' },
    ],
    deadline: daysFromNow(18),
    status: 'open',
  },

  // ── Google ──
  {
    recruiterEmail: 'neha.joshi@google.com',
    title: 'Software Engineer, New Grad',
    description:
      'Google Bengaluru is hiring new graduate SWEs across Search, Ads, Payments, and Infrastructure teams. You\'ll work on globally distributed systems, write production code from day one, and collaborate with engineers across offices in 40+ countries.',
    location: 'Bengaluru, Karnataka',
    jobType: 'Full-time',
    package: '40 LPA',
    eligibility: {
      branches: ['Computer Science Engineering', 'Information Technology', 'Artificial Intelligence'],
      minCGPA: 8.0,
      years: [4],
    },
    skillsRequired: ['DSA', 'Problem Solving', 'System Design', 'Python', 'Go'],
    rounds: [
      { name: 'Coding Interview 1', description: 'Two medium-hard DSA problems. Communicating your thought process matters as much as the solution.' },
      { name: 'Coding Interview 2', description: 'One hard DSA problem focused on graphs or dynamic programming.' },
      { name: 'System Design Interview', description: 'Design a distributed system — focus on scalability, consistency, and trade-offs (e.g. design Google Drive).' },
      { name: 'Googleyness & Leadership', description: 'Behavioural round assessing collaboration, ambiguity handling, and impact-driven thinking.' },
    ],
    deadline: daysFromNow(60),
    status: 'open',
  },
  {
    recruiterEmail: 'neha.joshi@google.com',
    title: 'ML Engineer Intern (STEP)',
    description:
      'Google\'s STEP internship for pre-final year students with a strong interest in machine learning. You\'ll work on a real ML problem — from data pipeline to model deployment — within one of Google\'s core product teams.',
    location: 'Bengaluru, Karnataka',
    jobType: 'Internship',
    package: '₹1,20,000/month',
    eligibility: {
      branches: ['Computer Science Engineering', 'Data Science', 'Artificial Intelligence'],
      minCGPA: 8.5,
      years: [3],
    },
    skillsRequired: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'DSA'],
    rounds: [
      { name: 'Online Coding Assessment', description: 'Two DSA problems on Google\'s internal platform. Focus: recursion, DP, and tree traversal.' },
      { name: 'ML Technical Interview', description: 'Conceptual ML questions (bias-variance, gradient descent, regularisation) + code a model from scratch.' },
      { name: 'Host Match', description: 'Conversation with the potential internship host team about project fit and mutual interests.' },
    ],
    deadline: daysFromNow(35),
    status: 'open',
  },

  // ── Wipro ──
  {
    recruiterEmail: 'vikram.nair@wipro.com',
    title: 'Project Engineer',
    description:
      'Wipro is hiring Project Engineers for its Engineering & Construction, Utilities, and Manufacturing verticals. Responsibilities include developing and testing software modules, participating in client calls, and producing technical documentation.',
    location: 'Pune / Chennai',
    jobType: 'Full-time',
    package: '6 LPA',
    eligibility: {
      branches: [
        'Computer Science Engineering',
        'Information Technology',
        'Electronics & Communication',
        'Electrical Engineering',
        'Mechanical Engineering',
      ],
      minCGPA: 6.0,
      years: [4],
    },
    skillsRequired: ['Java', 'Python', 'SQL', 'Problem Solving'],
    rounds: [
      { name: 'Wipro NLTH Online Test', description: 'National Level Talent Hunt: aptitude, verbal, logical reasoning, and coding section.' },
      { name: 'Technical Interview', description: 'Core CS concepts (OOPs, DBMS, OS) and one coding problem.' },
      { name: 'HR Interview', description: 'Soft skills, relocation flexibility, and offer discussion.' },
    ],
    deadline: daysFromNow(22),
    status: 'open',
  },
  {
    recruiterEmail: 'vikram.nair@wipro.com',
    title: 'Cybersecurity Analyst Intern',
    description:
      'Join Wipro\'s CyberDefense practice for a 6-month internship. You will work alongside experienced security analysts on vulnerability assessments, log analysis, and SOC operations for enterprise clients.',
    location: 'Remote',
    jobType: 'Internship',
    package: '₹20,000/month',
    eligibility: {
      branches: ['Computer Science Engineering', 'Information Technology', 'Electronics & Communication'],
      minCGPA: 7.0,
      years: [3, 4],
    },
    skillsRequired: ['Cybersecurity', 'Linux', 'Python', 'Networking'],
    rounds: [
      { name: 'MCQ Test', description: 'Networking fundamentals, Linux commands, and basic security concepts.' },
      { name: 'Technical Interview', description: 'Scenario-based: how would you respond to a phishing incident? Plus discussion of your security projects.' },
    ],
    deadline: daysFromNow(14),
    status: 'open',
  },
];

// ─── Helpers ───────────────────────────────────────────────────────────────────

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// ─── Main seed ─────────────────────────────────────────────────────────────────

const PASSWORD = 'Recruiter@123';

const seed = async () => {
  await connectDB();

  console.log('Clearing existing recruiter seed data...');
  const seedEmails = RECRUITERS.map(r => r.email);
  const existingUsers = await User.find({ email: { $in: seedEmails } });
  const existingIds = existingUsers.map(u => u._id);

  const existingProfiles = await RecruiterProfile.find({ user: { $in: existingIds } });
  const profileIds = existingProfiles.map(p => p._id);
  await Job.deleteMany({ recruiter: { $in: profileIds } });
  await RecruiterProfile.deleteMany({ user: { $in: existingIds } });
  await User.deleteMany({ email: { $in: seedEmails } });

  console.log(`Seeding ${RECRUITERS.length} recruiters...`);
  const hashedPassword = await bcrypt.hash(PASSWORD, 12);

  // Create recruiter accounts and profiles
  const profileMap = {}; // email → RecruiterProfile._id
  for (const r of RECRUITERS) {
    const user = await User.create({
      name: r.name,
      email: r.email,
      password: hashedPassword,
      role: 'recruiter',
    });
    await User.updateOne({ _id: user._id }, { password: hashedPassword });

    const profile = await RecruiterProfile.create({ user: user._id, ...r.profile });
    profileMap[r.email] = profile._id;
    console.log(`  ✓ ${r.name} — ${r.profile.companyName}`);
  }

  console.log(`\nSeeding ${JOBS.length} jobs...`);
  for (const j of JOBS) {
    const recruiterId = profileMap[j.recruiterEmail];
    if (!recruiterId) { console.warn(`  ⚠ No profile found for ${j.recruiterEmail}, skipping`); continue; }

    const { recruiterEmail, ...jobData } = j;
    await Job.create({ recruiter: recruiterId, ...jobData });
    console.log(`  ✓ [${j.jobType}] ${j.title} — ${j.recruiterEmail.split('@')[1].split('.')[0].toUpperCase()}`);
  }

  console.log(`\nDone!`);
  console.log(`  ${RECRUITERS.length} recruiters seeded`);
  console.log(`  ${JOBS.length} jobs posted`);
  console.log(`  Login password for all recruiters: ${PASSWORD}`);
  await mongoose.disconnect();
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
