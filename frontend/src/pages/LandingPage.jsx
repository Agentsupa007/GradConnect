import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Users, Star, MessageCircle, Search } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-[#f5f4f0] min-h-screen">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">

          {/* Left: text */}
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
              <Zap className="h-3.5 w-3.5" />
              Built for Indian college students
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-zinc-900 leading-[1.08] tracking-tight mb-6">
              Your skills are your{' '}
              <span className="text-indigo-600">real</span>{' '}
              resume.
            </h1>
            <p className="text-zinc-500 text-lg leading-relaxed mb-8 max-w-lg">
              GradConnect lets students showcase projects and skills — not just CGPA.
              Recruiters find the right talent, alumni give back through mentorship.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white font-semibold rounded-xl hover:bg-zinc-700 transition-colors shadow-sm"
              >
                Create free account
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-700 font-semibold rounded-xl border border-zinc-200 hover:bg-zinc-50 transition-colors"
              >
                Sign in
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mt-10 pt-8 border-t border-zinc-200">
              {[
                { num: '20+', label: 'Students' },
                { num: '6', label: 'Branches' },
                { num: 'Live', label: 'Real-time chat' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-zinc-900">{s.num}</div>
                  <div className="text-sm text-zinc-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: mockup cards */}
          <div className="flex-1 w-full lg:max-w-sm">
            <div className="bg-white rounded-2xl shadow-lg p-5 border border-zinc-100 mb-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">A</div>
                <div>
                  <p className="font-semibold text-sm text-zinc-800">Aarav Sharma</p>
                  <p className="text-xs text-zinc-400">CSE · Year 3 · CGPA 8.7</p>
                </div>
                <button className="ml-auto p-1.5 bg-yellow-50 rounded-lg">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {['React.js', 'Node.js', 'MongoDB', 'JavaScript'].map(s => (
                  <span key={s} className="text-[11px] bg-indigo-50 text-indigo-700 font-medium px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
              <div className="text-xs bg-zinc-50 rounded-lg p-3">
                <span className="font-medium text-zinc-700">E-Commerce Platform</span>
                <span className="text-zinc-400"> · Full-stack MERN with payment integration</span>
              </div>
            </div>

            <div className="bg-indigo-600 rounded-2xl p-4 text-white mb-3">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 text-indigo-300" />
                <span className="text-sm font-medium text-indigo-200">Searching for</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {['React.js', 'TypeScript', 'Node.js'].map(s => (
                  <span key={s} className="text-xs bg-indigo-500 text-white px-2.5 py-1 rounded-full font-medium">{s}</span>
                ))}
              </div>
              <p className="text-indigo-200 text-xs mt-3 font-medium">12 students match →</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-4 border border-zinc-100">
              <div className="flex items-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4 text-green-500" />
                <span className="text-xs font-medium text-zinc-600">Alumni mentorship</span>
              </div>
              <p className="text-xs text-zinc-500">"Hey! I saw your ML project — would love to give you feedback on it..."</p>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-zinc-900 mb-3">One platform, three journeys</h2>
          <p className="text-zinc-500 max-w-lg mx-auto">Each role gets a tailored experience built around what actually matters to them.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {/* Student */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-100 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-5">
              <span className="text-xl">🎓</span>
            </div>
            <h3 className="font-bold text-zinc-900 text-lg mb-2">Students</h3>
            <p className="text-sm text-zinc-500 mb-5 leading-relaxed">
              Build a profile that actually represents what you can do — not just your GPA.
            </p>
            <ul className="space-y-2">
              {['Add projects with live & GitHub links', 'Select your tech stack & skills', 'Upload resume links', 'Chat directly with recruiters'].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-600">
                  <span className="text-indigo-500 mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Recruiter */}
          <div className="bg-zinc-900 rounded-2xl p-6 text-white hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-5">
              <span className="text-xl">🏢</span>
            </div>
            <h3 className="font-bold text-white text-lg mb-2">Recruiters</h3>
            <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
              Find students who actually know the stack you need — not just those with the best CGPA.
            </p>
            <ul className="space-y-2">
              {['Search by exact skills needed', 'See projects, not just certificates', 'Star & shortlist candidates', 'Reach out directly via chat'].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-300">
                  <span className="text-indigo-400 mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Alumni */}
          <div className="bg-white rounded-2xl p-6 border border-zinc-100 hover:shadow-md transition-shadow">
            <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center mb-5">
              <span className="text-xl">🤝</span>
            </div>
            <h3 className="font-bold text-zinc-900 text-lg mb-2">Alumni</h3>
            <p className="text-sm text-zinc-500 mb-5 leading-relaxed">
              Give back to your college community. Find students worth mentoring and guide them.
            </p>
            <ul className="space-y-2">
              {['Browse students by tech interest', 'Star students you want to mentor', 'Real-time mentorship chat', 'Toggle mentorship availability'].map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-zinc-600">
                  <span className="text-violet-500 mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-zinc-900 mb-12 text-center">How it works</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: '01', title: 'Build your profile', desc: 'Students set up a profile with skills, projects, and resume. Takes less than 5 minutes.', color: 'text-indigo-600' },
              { step: '02', title: 'Get discovered', desc: 'Recruiters and alumni search by skill — students with matching skills rank higher.', color: 'text-sky-600' },
              { step: '03', title: 'Connect & grow', desc: 'Chat directly on the platform. No emails, no LinkedIn cold messages.', color: 'text-violet-600' },
            ].map(item => (
              <div key={item.step} className="flex flex-col">
                <span className={`text-4xl font-extrabold ${item.color} mb-4 opacity-30`}>{item.step}</span>
                <h4 className="font-bold text-zinc-900 text-lg mb-2">{item.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-indigo-600 rounded-3xl p-10 text-center text-white">
          <h2 className="text-3xl font-bold mb-3">Ready to get started?</h2>
          <p className="text-indigo-200 mb-7 text-base">Join GradConnect and let your skills do the talking.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/register?role=student" className="px-5 py-2.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors text-sm">
              I'm a Student
            </Link>
            <Link to="/register?role=recruiter" className="px-5 py-2.5 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-400 transition-colors text-sm border border-indigo-400">
              I'm a Recruiter
            </Link>
            <Link to="/register?role=alumni" className="px-5 py-2.5 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-400 transition-colors text-sm border border-indigo-400">
              I'm Alumni
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-indigo-600 rounded flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">G</span>
            </div>
            <span className="text-sm font-semibold text-zinc-700">GradConnect</span>
          </div>
          <p className="text-xs text-zinc-400">Connecting campus talent with real opportunities.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
