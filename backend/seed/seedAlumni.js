import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import AlumniProfile from '../models/AlumniProfile.js';

const ALUMNI = [
  {
    name: 'Aryan Mehta',
    email: 'aryan.mehta@alumni.college.edu',
    profile: {
      currentCompany: 'Google',
      currentRole: 'Senior Software Engineer',
      graduationYear: 2020,
      branch: 'Computer Science Engineering',
      yearsOfExperience: 4,
      linkedInUrl: 'https://linkedin.com/in/aryan-mehta',
      bio: 'Full-stack engineer at Google Bengaluru working on Search infrastructure. Happy to help with DSA prep, system design, and cracking big-tech interviews. Went through 6 placement cycles before landing this — I know what works.',
      skills: ['Python', 'Go', 'System Design', 'DSA', 'Kubernetes', 'PostgreSQL', 'React.js', 'CI/CD'],
      isAvailableForMentorship: true,
    },
  },
  {
    name: 'Kavya Reddy',
    email: 'kavya.reddy@alumni.college.edu',
    profile: {
      currentCompany: 'Amazon',
      currentRole: 'SDE-2',
      graduationYear: 2021,
      branch: 'Computer Science Engineering',
      yearsOfExperience: 3,
      linkedInUrl: 'https://linkedin.com/in/kavya-reddy',
      bio: 'Building AWS Lambda at Amazon Hyderabad. Passionate about distributed systems and cloud-native architecture. I mentor students on LeetCode grinding strategies and how to stand out in Amazon\'s Leadership Principles round.',
      skills: ['Java', 'AWS', 'Docker', 'Kubernetes', 'System Design', 'DSA', 'Microservices', 'DynamoDB'],
      isAvailableForMentorship: true,
    },
  },
  {
    name: 'Rohan Singhania',
    email: 'rohan.singhania@alumni.college.edu',
    profile: {
      currentCompany: 'Microsoft',
      currentRole: 'Software Engineer II',
      graduationYear: 2019,
      branch: 'Information Technology',
      yearsOfExperience: 5,
      linkedInUrl: 'https://linkedin.com/in/rohan-singhania',
      bio: 'Working on Azure DevOps at Microsoft Hyderabad. Previously at Wipro and TCS — I\'ve seen both service and product company life. Can guide you on resume building, referrals, and how to switch from service to product companies.',
      skills: ['C#', '.NET', 'Azure', 'TypeScript', 'React.js', 'SQL Server', 'Docker', 'Agile'],
      isAvailableForMentorship: true,
    },
  },
  {
    name: 'Sneha Iyer',
    email: 'sneha.iyer@alumni.college.edu',
    profile: {
      currentCompany: 'Flipkart',
      currentRole: 'Data Scientist',
      graduationYear: 2021,
      branch: 'Data Science',
      yearsOfExperience: 3,
      linkedInUrl: 'https://linkedin.com/in/sneha-iyer',
      bio: 'Building recommendation systems and pricing models at Flipkart. I can help with ML interviews, Kaggle, and how to frame data science projects on your resume. Always happy to review your portfolio.',
      skills: ['Python', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn', 'Spark', 'SQL', 'TensorFlow', 'Data Analysis'],
      isAvailableForMentorship: true,
    },
  },
  {
    name: 'Aditya Nambiar',
    email: 'aditya.nambiar@alumni.college.edu',
    profile: {
      currentCompany: 'Razorpay',
      currentRole: 'Backend Engineer',
      graduationYear: 2022,
      branch: 'Computer Science Engineering',
      yearsOfExperience: 2,
      linkedInUrl: 'https://linkedin.com/in/aditya-nambiar',
      bio: 'Working on payment gateway infrastructure at Razorpay. Just a couple of years out of college, so the placement hustle is very fresh in my mind. I can be real with you about what your resume needs, how to negotiate offers, and the startup vs big-tech trade-offs.',
      skills: ['Go', 'Node.js', 'Redis', 'PostgreSQL', 'REST API', 'Docker', 'Kafka', 'JavaScript'],
      isAvailableForMentorship: true,
    },
  },
  {
    name: 'Priyanka Sharma',
    email: 'priyanka.sharma@alumni.college.edu',
    profile: {
      currentCompany: 'Infosys',
      currentRole: 'Technology Lead',
      graduationYear: 2017,
      branch: 'Information Technology',
      yearsOfExperience: 7,
      linkedInUrl: 'https://linkedin.com/in/priyanka-sharma',
      bio: 'Seven years in the industry — started as a fresher at Infosys and now leading a team of 12. I mentor on career growth in service companies, how to get promoted, and transitioning to tech leads. I also help with Java and enterprise architecture.',
      skills: ['Java', 'Spring Boot', 'Microservices', 'Oracle DB', 'REST API', 'Agile', 'Scrum', 'Docker', 'MySQL'],
      isAvailableForMentorship: true,
    },
  },
  {
    name: 'Vikram Joshi',
    email: 'vikram.joshi@alumni.college.edu',
    profile: {
      currentCompany: 'NVIDIA',
      currentRole: 'ML Research Engineer',
      graduationYear: 2020,
      branch: 'Artificial Intelligence',
      yearsOfExperience: 4,
      linkedInUrl: 'https://linkedin.com/in/vikram-joshi',
      bio: 'Doing deep learning research at NVIDIA Pune — working on GPU-accelerated model training and inference optimization. I can guide students on ML research, getting into top MS programs abroad, and how to publish papers as an undergrad.',
      skills: ['Python', 'PyTorch', 'TensorFlow', 'CUDA', 'Deep Learning', 'Computer Vision', 'NLP', 'C++', 'Machine Learning'],
      isAvailableForMentorship: true,
    },
  },
  {
    name: 'Divya Krishnan',
    email: 'divya.krishnan@alumni.college.edu',
    profile: {
      currentCompany: 'Swiggy',
      currentRole: 'Frontend Engineer',
      graduationYear: 2022,
      branch: 'Computer Science Engineering',
      yearsOfExperience: 2,
      linkedInUrl: 'https://linkedin.com/in/divya-krishnan',
      bio: 'Building the Swiggy consumer app. I focus on frontend performance, accessibility, and design systems. Can help with React, CSS deep dives, and how to build a portfolio that actually gets you interviews at product startups.',
      skills: ['React.js', 'TypeScript', 'Next.js', 'Tailwind CSS', 'JavaScript', 'Redux', 'Figma', 'HTML', 'CSS'],
      isAvailableForMentorship: true,
    },
  },
  {
    name: 'Karthik Rajan',
    email: 'karthik.rajan@alumni.college.edu',
    profile: {
      currentCompany: 'Deloitte',
      currentRole: 'Cybersecurity Analyst',
      graduationYear: 2021,
      branch: 'Electronics & Communication',
      yearsOfExperience: 3,
      linkedInUrl: 'https://linkedin.com/in/karthik-rajan',
      bio: 'Red team security analyst at Deloitte. I help students who want to break into cybersecurity — an underrated career path. Can guide on certifications (CEH, OSCP), building a home lab, and transitioning from an ECE background into tech.',
      skills: ['Cybersecurity', 'Linux', 'Python', 'Networking', 'Penetration Testing', 'Bash', 'Wireshark'],
      isAvailableForMentorship: true,
    },
  },
  {
    name: 'Meghna Pillai',
    email: 'meghna.pillai@alumni.college.edu',
    profile: {
      currentCompany: 'Accenture',
      currentRole: 'Cloud Architect',
      graduationYear: 2018,
      branch: 'Electrical Engineering',
      yearsOfExperience: 6,
      linkedInUrl: 'https://linkedin.com/in/meghna-pillai',
      bio: 'Cloud architect working with AWS and GCP for large retail and BFSI clients. Started from EE and switched to cloud — happy to show you how to make that pivot. Also mentor on AWS certifications and building a cloud career from a non-CS background.',
      skills: ['AWS', 'Google Cloud', 'Azure', 'Terraform', 'Docker', 'Kubernetes', 'Python', 'Linux', 'CI/CD'],
      isAvailableForMentorship: true,
    },
  },
  {
    name: 'Nikhil Bansal',
    email: 'nikhil.bansal@alumni.college.edu',
    profile: {
      currentCompany: 'PhonePe',
      currentRole: 'SDE-1',
      graduationYear: 2023,
      branch: 'Computer Science Engineering',
      yearsOfExperience: 1,
      linkedInUrl: 'https://linkedin.com/in/nikhil-bansal',
      bio: 'Just finished my first year at PhonePe. The placement grind is extremely fresh — I got 4 offers in the final semester. I can do mock interviews, review resumes, and help you figure out which companies to target based on your profile.',
      skills: ['Java', 'DSA', 'Spring Boot', 'MySQL', 'Problem Solving', 'REST API', 'Git'],
      isAvailableForMentorship: true,
    },
  },
  {
    name: 'Tanya Bose',
    email: 'tanya.bose@alumni.college.edu',
    profile: {
      currentCompany: 'Zeta',
      currentRole: 'Product Engineer',
      graduationYear: 2021,
      branch: 'Information Technology',
      yearsOfExperience: 3,
      linkedInUrl: 'https://linkedin.com/in/tanya-bose',
      bio: 'Full-stack engineer at Zeta (fintech). I enjoy working across the whole product and can help students who want to go deep into fintech, payments, or startup engineering. Open to reviewing projects and giving honest feedback.',
      skills: ['Vue.js', 'Node.js', 'JavaScript', 'PostgreSQL', 'Redis', 'Docker', 'REST API', 'TypeScript'],
      isAvailableForMentorship: true,
    },
  },
  {
    name: 'Saurabh Gupta',
    email: 'saurabh.gupta@alumni.college.edu',
    profile: {
      currentCompany: 'Oracle',
      currentRole: 'Principal Engineer',
      graduationYear: 2015,
      branch: 'Computer Science Engineering',
      yearsOfExperience: 9,
      linkedInUrl: 'https://linkedin.com/in/saurabh-gupta',
      bio: 'Nine years in enterprise software — databases, distributed systems, and now OCI. I mentor senior students on long-term career planning, salary negotiation, moving into architect roles, and how to think about the first 10 years of your engineering career.',
      skills: ['Java', 'C++', 'Oracle DB', 'Distributed Systems', 'System Design', 'AWS', 'Kubernetes', 'DSA'],
      isAvailableForMentorship: false,
    },
  },
  {
    name: 'Ishaan Verma',
    email: 'ishaan.verma@alumni.college.edu',
    profile: {
      currentCompany: 'Atlassian',
      currentRole: 'Software Engineer',
      graduationYear: 2022,
      branch: 'Data Science',
      yearsOfExperience: 2,
      linkedInUrl: 'https://linkedin.com/in/ishaan-verma',
      bio: 'Working on Jira backend at Atlassian Sydney (remote from Bengaluru). Got into a product company straight from college with a Data Science degree — happy to share what skills and projects made the difference.',
      skills: ['Python', 'Node.js', 'MongoDB', 'REST API', 'Docker', 'Data Analysis', 'Git', 'Agile'],
      isAvailableForMentorship: true,
    },
  },
  {
    name: 'Ananya Menon',
    email: 'ananya.menon@alumni.college.edu',
    profile: {
      currentCompany: 'Adobe',
      currentRole: 'UX Engineer',
      graduationYear: 2020,
      branch: 'Information Technology',
      yearsOfExperience: 4,
      linkedInUrl: 'https://linkedin.com/in/ananya-menon',
      bio: 'Bridging design and engineering at Adobe Bengaluru. I help students who want to go into frontend, design systems, or the intersection of UX and code. Great at reviewing portfolio projects and teaching how to present your work to interviewers.',
      skills: ['React.js', 'TypeScript', 'CSS', 'Figma', 'JavaScript', 'Accessibility', 'HTML', 'Tailwind CSS', 'UI/UX Design'],
      isAvailableForMentorship: true,
    },
  },
];

const PASSWORD = 'Alumni@123';

const seed = async () => {
  await connectDB();

  console.log('Clearing existing alumni seed data...');
  const seedEmails = ALUMNI.map(a => a.email);
  const existingUsers = await User.find({ email: { $in: seedEmails } });
  const existingIds = existingUsers.map(u => u._id);
  await AlumniProfile.deleteMany({ user: { $in: existingIds } });
  await User.deleteMany({ email: { $in: seedEmails } });

  console.log(`Seeding ${ALUMNI.length} alumni...\n`);
  const hashedPassword = await bcrypt.hash(PASSWORD, 12);

  for (const a of ALUMNI) {
    const user = await User.create({
      name: a.name,
      email: a.email,
      password: hashedPassword,
      role: 'alumni',
    });
    await User.updateOne({ _id: user._id }, { password: hashedPassword });

    await AlumniProfile.create({ user: user._id, ...a.profile });

    const avail = a.profile.isAvailableForMentorship ? '✓' : '–';
    console.log(`  ${avail} ${a.name.padEnd(20)} | ${a.profile.currentRole} @ ${a.profile.currentCompany} | ${a.profile.yearsOfExperience} yrs`);
  }

  const available = ALUMNI.filter(a => a.profile.isAvailableForMentorship).length;
  console.log(`\nDone! ${ALUMNI.length} alumni seeded (${available} available for mentorship).`);
  console.log(`Login password for all alumni: ${PASSWORD}`);
  await mongoose.disconnect();
};

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
