import { Link } from 'react-router-dom';
import { GraduationCap, Search, Star, MessageCircle, ArrowRight, Code, Briefcase, Users } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <GraduationCap className="h-12 w-12" />
            <h1 className="text-5xl font-bold">GradConnect</h1>
          </div>
          <p className="text-xl text-indigo-200 mb-4 max-w-2xl mx-auto">
            A college-specific skill-based networking platform
          </p>
          <p className="text-indigo-300 mb-10 max-w-xl mx-auto">
            Students showcase skills & projects. Recruiters discover talent by skills — not grades. Alumni mentor the next generation.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Get Started <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-3.5 bg-indigo-500/30 text-white font-semibold rounded-xl hover:bg-indigo-500/50 transition-colors border border-indigo-400"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-slate-800 mb-3">Built for every role</h2>
        <p className="text-center text-slate-500 mb-12">Three distinct experiences on one platform</p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Students</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li>• Showcase skills & tech stack</li>
              <li>• Upload & manage resumes</li>
              <li>• Display projects with live links</li>
              <li>• Connect with recruiters & alumni</li>
            </ul>
          </div>
          <div className="p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow bg-indigo-50 border-indigo-200">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
              <Briefcase className="h-6 w-6 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Recruiters</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li>• Search by skills — not CGPA</li>
              <li>• View projects & active resume</li>
              <li>• Star & shortlist candidates</li>
              <li>• Chat directly with students</li>
            </ul>
          </div>
          <div className="p-8 rounded-2xl border border-slate-200 hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-3">Alumni</h3>
            <ul className="space-y-2 text-slate-600 text-sm">
              <li>• Browse & discover students</li>
              <li>• Mentor via real-time chat</li>
              <li>• Star promising students</li>
              <li>• Search by skills & tech stack</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Core Features */}
      <div className="bg-slate-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-12">Core Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Search className="h-6 w-6 text-indigo-600" />, title: 'Skill-Based Search', desc: 'Search students by multiple skills. Results ranked by number of matching skills.' },
              { icon: <Star className="h-6 w-6 text-yellow-500" />, title: 'Shortlisting', desc: 'Star students you are interested in and maintain a curated shortlist.' },
              { icon: <MessageCircle className="h-6 w-6 text-green-600" />, title: 'Real-Time Chat', desc: 'Socket.io powered messaging between students, recruiters, and alumni.' },
            ].map(f => (
              <div key={f.title} className="bg-white p-6 rounded-xl border border-slate-200">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                  {f.icon}
                </div>
                <h4 className="font-semibold text-slate-800 mb-1">{f.title}</h4>
                <p className="text-sm text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-indigo-600 text-white py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to connect?</h2>
        <p className="text-indigo-200 mb-8">Join GradConnect and start building meaningful connections</p>
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-indigo-50 transition-colors"
        >
          Create Account <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default LandingPage;
