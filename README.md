# GradConnect

A campus placement and mentorship platform connecting students, recruiters, and alumni. Students apply to jobs, track their application status round-by-round, find peer collaborators, and connect with alumni mentors. Recruiters post jobs and manage the hiring pipeline. Alumni mentor students based on their tech stack and experience.

---

## Features

### Students
- Build a profile with skills, projects, CGPA, and resumes
- Browse open job postings and apply with one click
- Track application status in real time — Applied → Round 1 → Round 2 → Selected / Rejected
- View a timeline of every round they've been through
- See the full campus placement summary (companies, packages, selected students)
- Find and shortlist peer students by skills
- Search alumni mentors by tech stack, company, years of experience, and branch
- Real-time chat with recruiters and alumni

### Recruiters
- Set up a company profile
- Post jobs with full details — eligibility, required skills, package, deadline
- Define custom interview rounds (e.g. Aptitude → Technical → HR)
- View all applicants grouped by round
- Advance, select, or reject candidates at any stage
- Shortlist students from the search page
- Chat directly with candidates

### Alumni
- Build a mentor profile with current company, role, tech stack, and years of experience
- Toggle availability for student mentorship
- Find and shortlist students to mentor
- Chat with students

---

## Tech Stack

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- Socket.io — real-time chat, typing indicators, online presence
- JWT — access tokens (15 min) + refresh tokens (7 days)
- bcrypt, dotenv, multer, cors

**Frontend**
- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Axios
- Socket.io client
- Lucide React (icons)
- React Hot Toast

---

## Project Structure

```
GradConnect/
├── backend/
│   ├── config/          # MongoDB connection
│   ├── controllers/     # Route handlers
│   │   ├── authController.js
│   │   ├── studentController.js
│   │   ├── recruiterController.js
│   │   ├── alumniController.js
│   │   ├── jobController.js       # Recruiter job & applicant management
│   │   ├── applicationController.js  # Student jobs, applications, placements, mentors
│   │   ├── searchController.js
│   │   └── chatController.js
│   ├── middlewares/     # Auth + role guards
│   ├── models/
│   │   ├── User.js
│   │   ├── StudentProfile.js
│   │   ├── RecruiterProfile.js
│   │   ├── AlumniProfile.js
│   │   ├── Job.js
│   │   ├── Application.js
│   │   ├── Conversation.js
│   │   └── Message.js
│   ├── routes/
│   ├── seed/
│   │   ├── seedStudents.js
│   │   ├── seedRecruiters.js
│   │   └── seedAlumni.js
│   ├── socket/          # Socket.io handler
│   ├── utils/           # Constants, token helpers
│   └── server.js
├── frontend/
│   └── src/
│       ├── api/         # Axios calls per domain
│       ├── components/
│       │   ├── layout/  # Navbar, ProtectedRoute
│       │   └── shared/  # StudentCard, SkillBadge, SkillSelector
│       ├── context/     # AuthContext, SocketContext
│       └── pages/
│           ├── auth/
│           ├── student/
│           ├── recruiter/
│           └── alumni/
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### 1. Clone and install

```bash
git clone https://github.com/Agentsupa007/GradConnect.git
cd GradConnect

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb://localhost:27017/gradconnect
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### 3. Run

```bash
# Terminal 1 — backend (with hot reload)
npm run dev

# Terminal 2 — frontend
npm run dev:frontend
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

---

## Seed Data

Populate the database with realistic demo data:

```bash
# 20 students across CSE, IT, Data Science, AI, ECE, EE
node backend/seed/seedStudents.js

# 5 recruiters (TCS, Infosys, Amazon, Google, Wipro) with 10 job postings
node backend/seed/seedRecruiters.js

# 15 alumni mentors across companies (Google, Amazon, Flipkart, NVIDIA, etc.)
node backend/seed/seedAlumni.js
```

| Role | Email format | Password |
|---|---|---|
| Student | `name@college.edu` | `Student@123` |
| Recruiter | `name@company.com` | `Recruiter@123` |
| Alumni | `name@alumni.college.edu` | `Alumni@123` |

See the seed files for the full list of accounts.

---

## API Overview

| Prefix | Role | Description |
|---|---|---|
| `/api/auth` | Public | Register, login, refresh token, logout |
| `/api/student` | Student | Profile, skills, projects, resumes, jobs, applications, mentors, peer search |
| `/api/recruiter` | Recruiter | Profile, student search, shortlist, job postings, applicant management |
| `/api/recruiter/jobs` | Recruiter | Full job CRUD + per-round applicant pipeline |
| `/api/alumni` | Alumni | Profile, student search, shortlist |
| `/api/search` | Recruiter, Alumni, Student | Skill-ranked student search |
| `/api/chat` | All | Conversations, messages |
| `/api/skills` | Public | Predefined skill list |

---

## Key Workflows

**Job application pipeline**

```
Student applies → Recruiter views under "Applied" tab
  → Advance to Round 1 (Aptitude)
  → Advance to Round 2 (Technical)
  → Select  →  Student sees "Selected" with green badge
          or
  → Reject at any stage  →  Student sees "Not Selected"
```

**Mentor discovery**

Students search alumni by tech stack, company, years of experience, and branch. Results are ranked by skill match count. A direct message opens a real-time chat.

---

## License

MIT
