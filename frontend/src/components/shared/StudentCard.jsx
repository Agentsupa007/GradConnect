import { useState } from 'react';
import { Star, MessageCircle, ExternalLink, FileText, GitBranch } from 'lucide-react';
import SkillBadge from './SkillBadge.jsx';

const avatarBgs = [
  'bg-indigo-500', 'bg-sky-500', 'bg-violet-500',
  'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
];

const StudentCard = ({ student, isStarred, onStar, onChat, matchCount }) => {
  const [starring, setStarring] = useState(false);
  const activeResume = student.resumes?.find(r => r.isActive) || student.resumes?.[0];
  const user = student.user || {};

  const avatarColor = avatarBgs[(user.name || 'S').charCodeAt(0) % avatarBgs.length];

  const handleStar = async (e) => {
    e.stopPropagation();
    setStarring(true);
    try { await onStar(student._id, !isStarred); } finally { setStarring(false); }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 hover:shadow-md hover:border-zinc-300 transition-all flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${avatarColor} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}>
            {(user.name || 'S')[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-zinc-900 text-sm leading-tight">{user.name}</h3>
            <p className="text-xs text-zinc-400 mt-0.5 truncate">
              {[student.branch?.replace(' Engineering', ''), student.year && `Year ${student.year}`].filter(Boolean).join(' · ')}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {matchCount > 0 && (
            <span className="text-[11px] bg-green-50 text-green-700 border border-green-100 font-semibold px-2 py-0.5 rounded-full">
              {matchCount} match{matchCount > 1 ? 'es' : ''}
            </span>
          )}
          {onStar && (
            <button
              onClick={handleStar}
              disabled={starring}
              className={`p-1.5 rounded-lg transition-colors ${
                isStarred
                  ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                  : 'text-zinc-300 hover:text-amber-400 hover:bg-amber-50'
              }`}
              title={isStarred ? 'Remove from shortlist' : 'Add to shortlist'}
            >
              <Star className="h-4 w-4" fill={isStarred ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>

      {/* Stats row */}
      {(student.cgpa > 0 || student.projects?.length > 0) && (
        <div className="flex items-center gap-3 mb-3">
          {student.cgpa > 0 && (
            <div className="text-xs bg-zinc-50 border border-zinc-100 rounded-lg px-2.5 py-1">
              <span className="text-zinc-500">CGPA </span>
              <span className="font-semibold text-zinc-800">{student.cgpa}</span>
            </div>
          )}
          {student.projects?.length > 0 && (
            <div className="text-xs bg-zinc-50 border border-zinc-100 rounded-lg px-2.5 py-1">
              <span className="font-semibold text-zinc-800">{student.projects.length}</span>
              <span className="text-zinc-500"> project{student.projects.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      )}

      {/* Skills */}
      {student.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {student.skills.slice(0, 5).map(skill => (
            <SkillBadge key={skill} skill={skill} size="xs" />
          ))}
          {student.skills.length > 5 && (
            <span className="text-[11px] text-zinc-400 px-1 self-center">+{student.skills.length - 5}</span>
          )}
        </div>
      )}

      {/* Projects */}
      {student.projects?.length > 0 && (
        <div className="mb-4 space-y-1.5">
          {student.projects.slice(0, 2).map(proj => (
            <div key={proj._id} className="flex items-center justify-between bg-zinc-50 rounded-lg px-3 py-2">
              <span className="text-xs font-medium text-zinc-700 truncate flex-1">{proj.title}</span>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                {proj.liveLink && (
                  <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-zinc-400 hover:text-indigo-600 transition-colors">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {proj.githubLink && (
                  <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-zinc-400 hover:text-zinc-700 transition-colors">
                    <GitBranch className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Spacer + Actions */}
      <div className="mt-auto pt-3 border-t border-zinc-100 flex items-center gap-2">
        {activeResume && (
          <a
            href={activeResume.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-zinc-100 text-zinc-600 rounded-lg hover:bg-zinc-200 transition-colors font-medium"
          >
            <FileText className="h-3 w-3" />
            Resume
          </a>
        )}
        {onChat && (
          <button
            onClick={(e) => { e.stopPropagation(); onChat(user._id); }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto font-medium"
          >
            <MessageCircle className="h-3 w-3" />
            Message
          </button>
        )}
      </div>
    </div>
  );
};

export default StudentCard;
