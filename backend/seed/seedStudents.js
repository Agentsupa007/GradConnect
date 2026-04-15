import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';

const BRANCHES = [
  'Computer Science Engineering',
  'Information Technology',
  'Electronics & Communication',
  'Electrical Engineering',
  'Data Science',
  'Artificial Intelligence',
];

const SKILL_POOL = [
  ['JavaScript', 'React.js', 'Node.js', 'MongoDB', 'Express.js', 'HTML', 'CSS', 'Git'],
  ['Python', 'Django', 'Machine Learning', 'NumPy', 'Pandas', 'Scikit-learn', 'Git', 'Linux'],
  ['Java', 'Spring Boot', 'MySQL', 'REST API', 'Docker', 'Git', 'Agile'],
  ['TypeScript', 'React.js', 'Next.js', 'Tailwind CSS', 'PostgreSQL', 'Git', 'Figma'],
  ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'Redis', 'AWS', 'CI/CD'],
  ['C++', 'DSA', 'Competitive Programming', 'Python', 'Git', 'Problem Solving'],
  ['React.js', 'Node.js', 'MongoDB', 'Socket.io', 'Redux', 'JavaScript', 'Git'],
  ['Flutter', 'Dart', 'Firebase', 'React Native', 'JavaScript', 'Git'],
  ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Python', 'Computer Vision', 'NLP'],
  ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Linux', 'Git', 'Python'],
  ['Vue.js', 'JavaScript', 'PHP', 'MySQL', 'HTML', 'CSS', 'Bootstrap'],
  ['Go', 'Docker', 'Kubernetes', 'REST API', 'PostgreSQL', 'Git', 'Linux'],
  ['Cybersecurity', 'Linux', 'Python', 'Networking', 'Git'],
  ['Data Analysis', 'Python', 'R', 'Pandas', 'NumPy', 'Tableau', 'SQL'],
  ['React.js', 'TypeScript', 'GraphQL', 'Node.js', 'MongoDB', 'Git'],
];

const PROJECTS = [
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack MERN e-commerce app with payment integration, admin dashboard, and product reviews.',
    liveLink: 'https://shopify-clone-demo.vercel.app',
    githubLink: 'https://github.com/student/ecommerce',
    skillsUsed: ['React.js', 'Node.js', 'MongoDB', 'Express.js'],
  },
  {
    title: 'Real-Time Chat App',
    description: 'WebSocket-based chat application supporting group rooms and direct messages with read receipts.',
    liveLink: '',
    githubLink: 'https://github.com/student/chat-app',
    skillsUsed: ['Socket.io', 'Node.js', 'React.js', 'MongoDB'],
  },
  {
    title: 'ML Sentiment Analyser',
    description: 'Trained a BERT model on Twitter data to classify tweet sentiments with 91% accuracy.',
    liveLink: '',
    githubLink: 'https://github.com/student/sentiment-ml',
    skillsUsed: ['Python', 'PyTorch', 'NLP', 'Pandas'],
  },
  {
    title: 'Task Management Dashboard',
    description: 'Kanban-style project management tool with drag-and-drop, due dates, and team collaboration.',
    liveLink: 'https://taskflow-demo.netlify.app',
    githubLink: 'https://github.com/student/taskflow',
    skillsUsed: ['React.js', 'TypeScript', 'PostgreSQL', 'REST API'],
  },
  {
    title: 'DevOps Pipeline',
    description: 'CI/CD pipeline using GitHub Actions, Docker, and AWS ECS for a microservices application.',
    liveLink: '',
    githubLink: 'https://github.com/student/devops-pipeline',
    skillsUsed: ['Docker', 'AWS', 'CI/CD', 'Linux'],
  },
  {
    title: 'Budget Tracker App',
    description: 'Personal finance tracker with chart visualizations, category tagging, and monthly reports.',
    liveLink: 'https://budget-track.vercel.app',
    githubLink: 'https://github.com/student/budget-tracker',
    skillsUsed: ['Vue.js', 'JavaScript', 'MySQL'],
  },
  {
    title: 'Portfolio Website',
    description: 'Responsive personal portfolio with dark mode, animated sections, and a contact form.',
    liveLink: 'https://myportfolio.dev',
    githubLink: 'https://github.com/student/portfolio',
    skillsUsed: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    title: 'Image Classification API',
    description: 'REST API wrapping a CNN model that classifies uploaded images into 100 categories.',
    liveLink: '',
    githubLink: 'https://github.com/student/image-classify-api',
    skillsUsed: ['Python', 'FastAPI', 'TensorFlow', 'Docker'],
  },
];

const students = [
  { name: 'Aarav Sharma',    email: 'aarav.sharma@college.edu',    branch: 'Computer Science Engineering',   year: 3, cgpa: 8.7, rollNumber: 'CS21001', skillSet: 0, resumeTitle: 'Full-Stack Developer Resume', projects: [0, 1] },
  { name: 'Priya Nair',      email: 'priya.nair@college.edu',      branch: 'Data Science',                    year: 4, cgpa: 9.1, rollNumber: 'DS20002', skillSet: 1, resumeTitle: 'ML Engineer Resume',        projects: [2, 7] },
  { name: 'Rohan Mehta',     email: 'rohan.mehta@college.edu',     branch: 'Information Technology',          year: 2, cgpa: 7.9, rollNumber: 'IT22003', skillSet: 2, resumeTitle: 'Backend Developer Resume',  projects: [0, 3] },
  { name: 'Sneha Pillai',    email: 'sneha.pillai@college.edu',    branch: 'Computer Science Engineering',   year: 3, cgpa: 9.4, rollNumber: 'CS21004', skillSet: 3, resumeTitle: 'Frontend Dev Resume',       projects: [3, 6] },
  { name: 'Karan Joshi',     email: 'karan.joshi@college.edu',     branch: 'Information Technology',          year: 4, cgpa: 8.2, rollNumber: 'IT20005', skillSet: 4, resumeTitle: 'DevOps Engineer Resume',    projects: [4] },
  { name: 'Anika Singh',     email: 'anika.singh@college.edu',     branch: 'Artificial Intelligence',         year: 3, cgpa: 9.0, rollNumber: 'AI21006', skillSet: 8, resumeTitle: 'AI/ML Resume',             projects: [2, 7] },
  { name: 'Vivek Kumar',     email: 'vivek.kumar@college.edu',     branch: 'Electronics & Communication',     year: 2, cgpa: 7.5, rollNumber: 'EC22007', skillSet: 5, resumeTitle: 'DSA Resume',                projects: [6] },
  { name: 'Tanvi Desai',     email: 'tanvi.desai@college.edu',     branch: 'Computer Science Engineering',   year: 4, cgpa: 8.6, rollNumber: 'CS20008', skillSet: 6, resumeTitle: 'Full-Stack Resume',         projects: [1, 3] },
  { name: 'Arjun Rao',       email: 'arjun.rao@college.edu',       branch: 'Data Science',                    year: 3, cgpa: 8.9, rollNumber: 'DS21009', skillSet: 13, resumeTitle: 'Data Analyst Resume',      projects: [2] },
  { name: 'Ishita Gupta',    email: 'ishita.gupta@college.edu',    branch: 'Computer Science Engineering',   year: 2, cgpa: 9.2, rollNumber: 'CS22010', skillSet: 7, resumeTitle: 'Mobile Dev Resume',         projects: [6, 5] },
  { name: 'Dev Patel',       email: 'dev.patel@college.edu',       branch: 'Information Technology',          year: 4, cgpa: 8.0, rollNumber: 'IT20011', skillSet: 9, resumeTitle: 'Cloud Engineer Resume',     projects: [4] },
  { name: 'Meera Krishnan',  email: 'meera.krishnan@college.edu',  branch: 'Artificial Intelligence',         year: 3, cgpa: 9.3, rollNumber: 'AI21012', skillSet: 8, resumeTitle: 'Deep Learning Resume',     projects: [2, 7] },
  { name: 'Siddharth Bose',  email: 'siddharth.bose@college.edu', branch: 'Computer Science Engineering',   year: 2, cgpa: 7.8, rollNumber: 'CS22013', skillSet: 14, resumeTitle: 'GraphQL Dev Resume',       projects: [1, 3] },
  { name: 'Pooja Iyer',      email: 'pooja.iyer@college.edu',      branch: 'Electronics & Communication',     year: 4, cgpa: 8.4, rollNumber: 'EC20014', skillSet: 12, resumeTitle: 'Security Resume',          projects: [6] },
  { name: 'Nikhil Verma',    email: 'nikhil.verma@college.edu',   branch: 'Information Technology',          year: 3, cgpa: 8.1, rollNumber: 'IT21015', skillSet: 10, resumeTitle: 'PHP Dev Resume',           projects: [5, 6] },
  { name: 'Riya Chatterjee', email: 'riya.chatterjee@college.edu', branch: 'Data Science',                   year: 2, cgpa: 8.8, rollNumber: 'DS22016', skillSet: 1, resumeTitle: 'Data Science Resume',      projects: [2] },
  { name: 'Harsh Agarwal',   email: 'harsh.agarwal@college.edu',  branch: 'Computer Science Engineering',   year: 4, cgpa: 7.6, rollNumber: 'CS20017', skillSet: 11, resumeTitle: 'Go Backend Resume',        projects: [0, 4] },
  { name: 'Nisha Menon',     email: 'nisha.menon@college.edu',     branch: 'Electrical Engineering',          year: 3, cgpa: 8.3, rollNumber: 'EE21018', skillSet: 5, resumeTitle: 'Problem Solving Resume',   projects: [6] },
  { name: 'Abhay Tiwari',    email: 'abhay.tiwari@college.edu',   branch: 'Computer Science Engineering',   year: 2, cgpa: 9.0, rollNumber: 'CS22019', skillSet: 0, resumeTitle: 'MERN Stack Resume',         projects: [1, 0] },
  { name: 'Divya Sharma',    email: 'divya.sharma@college.edu',   branch: 'Artificial Intelligence',         year: 4, cgpa: 9.5, rollNumber: 'AI20020', skillSet: 8, resumeTitle: 'AI Research Resume',       projects: [2, 7] },
];

const PASSWORD = 'Student@123';

const seed = async () => {
  await connectDB();

  console.log('Clearing existing student data...');
  const existingEmails = students.map(s => s.email);
  const existingUsers = await User.find({ email: { $in: existingEmails } });
  const existingIds = existingUsers.map(u => u._id);
  await StudentProfile.deleteMany({ user: { $in: existingIds } });
  await User.deleteMany({ email: { $in: existingEmails } });

  console.log(`Seeding ${students.length} students...`);
  const hashedPassword = await bcrypt.hash(PASSWORD, 12);

  for (const s of students) {
    const user = await User.create({
      name: s.name,
      email: s.email,
      password: hashedPassword,
      role: 'student',
    });
    // Bypass the pre-save hook since we already hashed
    await User.updateOne({ _id: user._id }, { password: hashedPassword });

    const skills = SKILL_POOL[s.skillSet];
    const projects = s.projects.map(i => ({ ...PROJECTS[i] }));

    await StudentProfile.create({
      user: user._id,
      rollNumber: s.rollNumber,
      branch: s.branch,
      year: s.year,
      cgpa: s.cgpa,
      phone: `+91 98${Math.floor(10000000 + Math.random() * 89999999)}`,
      skills,
      resumes: [{ title: s.resumeTitle, fileUrl: `https://drive.google.com/file/d/dummy_${user._id}`, isActive: true }],
      projects,
      profileCompleted: true,
    });

    console.log(`  ✓ ${s.name} (${s.branch}, Year ${s.year}, CGPA ${s.cgpa})`);
  }

  console.log(`\nDone! ${students.length} students seeded.`);
  console.log(`Login password for all students: ${PASSWORD}`);
  await mongoose.disconnect();
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
