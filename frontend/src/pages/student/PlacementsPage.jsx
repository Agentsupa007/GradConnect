import { useState, useEffect } from 'react';
import { getPlacements } from '../../api/jobApi.js';
import { Building2, Users, MapPin, Trophy } from 'lucide-react';
import toast from 'react-hot-toast';

const typeColors = {
  'Full-time': 'bg-indigo-50 text-indigo-700',
  'Internship': 'bg-sky-50 text-sky-700',
  'Part-time': 'bg-violet-50 text-violet-700',
  'Contract': 'bg-amber-50 text-amber-700',
};

const avatarBgs = ['bg-indigo-400', 'bg-sky-400', 'bg-violet-400', 'bg-emerald-400', 'bg-amber-400', 'bg-rose-400'];

const PlacementsPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlacements()
      .then(({ data }) => setCompanies(data))
      .catch(() => toast.error('Failed to load placements'))
      .finally(() => setLoading(false));
  }, []);

  const totalStudents = companies.reduce((sum, c) => sum + c.jobs.reduce((s, j) => s + j.students.length, 0), 0);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-zinc-900">Placement Drive</h1>
        <p className="text-zinc-400 text-sm mt-0.5">Companies that visited campus and students placed</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <div className="text-3xl font-extrabold text-zinc-900 mb-1">{companies.length}</div>
          <div className="text-xs text-zinc-500">Companies</div>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-5">
          <div className="text-3xl font-extrabold text-zinc-900 mb-1">{totalStudents}</div>
          <div className="text-xs text-zinc-500">Students placed</div>
        </div>
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <Trophy className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-semibold text-zinc-800">Top packages</span>
          </div>
          <div className="space-y-0.5">
            {companies
              .flatMap(c => c.jobs.map(j => j.package).filter(Boolean))
              .slice(0, 2)
              .map((pkg, i) => (
                <p key={i} className="text-xs text-zinc-600 font-medium">{pkg}</p>
              ))}
            {companies.flatMap(c => c.jobs.map(j => j.package).filter(Boolean)).length === 0 && (
              <p className="text-xs text-zinc-400">—</p>
            )}
          </div>
        </div>
      </div>

      {companies.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-200 p-16 text-center">
          <Building2 className="h-10 w-10 text-zinc-300 mx-auto mb-4" />
          <p className="font-semibold text-zinc-700">No placements yet</p>
          <p className="text-sm text-zinc-400 mt-1">Placement data will appear here once companies make offers</p>
        </div>
      ) : (
        <div className="space-y-5">
          {companies.map((company) => (
            <div key={company.companyName} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
              {/* Company header */}
              <div className="px-5 py-4 border-b border-zinc-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="font-bold text-zinc-900">{company.companyName}</h2>
                    <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                      {company.industry && <span>{company.industry}</span>}
                      {company.companyLocation && (
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{company.companyLocation}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                    <Users className="h-4 w-4" />
                    <span>{company.jobs.reduce((s, j) => s + j.students.length, 0)} placed</span>
                  </div>
                </div>
              </div>

              {/* Jobs + placed students */}
              <div className="divide-y divide-zinc-50">
                {company.jobs.map((job, ji) => (
                  <div key={ji} className="px-5 py-4">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-semibold text-zinc-800 text-sm">{job.title}</h3>
                      {job.jobType && (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${typeColors[job.jobType] || 'bg-zinc-50 text-zinc-600'}`}>
                          {job.jobType}
                        </span>
                      )}
                      {job.package && (
                        <span className="text-sm font-bold text-zinc-900 ml-auto">{job.package}</span>
                      )}
                    </div>
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {job.students.map((student) => {
                        const color = avatarBgs[(student.name || 'S').charCodeAt(0) % avatarBgs.length];
                        return (
                          <div key={student._id} className="flex items-center gap-2.5 bg-zinc-50 rounded-xl px-3 py-2.5">
                            <div className={`w-7 h-7 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                              {(student.name || 'S')[0].toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-zinc-800 truncate">{student.name}</p>
                              <p className="text-xs text-zinc-400 truncate">
                                {[student.branch?.replace(' Engineering', ''), student.year && `Y${student.year}`, student.cgpa && `${student.cgpa} CGPA`].filter(Boolean).join(' · ')}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlacementsPage;
