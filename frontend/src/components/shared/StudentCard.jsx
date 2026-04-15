import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, MessageCircle, ExternalLink, GitBranch, FileText } from 'lucide-react';
import SkillBadge from './SkillBadge.jsx';

const StudentCard = ({ student, isStarred, onStar, onChat, matchCount }) => {
  const [starring, setStarring] = useState(false);
  const activeResume = student.resumes?.find(r => r.isActive) || student.resumes?.[0];
  const user = student.user || {};

  const handleStar = async (e) => {
    e.stopPropagation();
    setStarring(true);
    try { await onStar(student._id, !isStarred); } finally { setStarring(false); }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
            {(user.name || 'S')[0].toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-slate-800">{user.name}</h3>
            <p className="text-sm text-slate-500">
              {student.branch && <span>{student.branch}</span>}
              {student.branch && student.year && <span> • </span>}
              {student.year && <span>Year {student.year}</span>}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {matchCount > 0 && (
            <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
              {matchCount} match{matchCount > 1 ? 'es' : ''}
            </span>
          )}
          {onStar && (
            <button
              onClick={handleStar}
              disabled={starring}
              className={`p-1.5 rounded-lg transition-colors ${
                isStarred ? 'text-yellow-500 bg-yellow-50' : 'text-slate-400 hover:text-yellow-500 hover:bg-yellow-50'
              }`}
            >
              <Star className="h-4 w-4" fill={isStarred ? 'currentColor' : 'none'} />
            </button>
          )}
        </div>
      </div>

      {/* Skills */}
      {student.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {student.skills.slice(0, 6).map(skill => (
            <SkillBadge key={skill} skill={skill} size="xs" />
          ))}
          {student.skills.length > 6 && (
            <span className="text-xs text-slate-500 px-1">+{student.skills.length - 6} more</span>
          )}
        </div>
      )}

      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-3 text-xs text-slate-500">
        {student.cgpa > 0 && <span>CGPA: <strong className="text-slate-700">{student.cgpa}</strong></span>}
        {student.projects?.length > 0 && <span><strong className="text-slate-700">{student.projects.length}</strong> project{student.projects.length > 1 ? 's' : ''}</span>}
        {user.email && <span className="truncate">{user.email}</span>}
      </div>

      {/* Projects preview */}
      {student.projects?.length > 0 && (
        <div className="mb-3 space-y-1.5">
          {student.projects.slice(0, 2).map(proj => (
            <div key={proj._id} className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-1.5">
              <span className="text-xs font-medium text-slate-700 truncate">{proj.title}</span>
              <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                {proj.liveLink && (
                  <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-indigo-500 hover:text-indigo-700">
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {proj.githubLink && (
                  <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-slate-500 hover:text-slate-700">
                    <GitBranch className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100">
        {activeResume && (
          <a
            href={activeResume.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <FileText className="h-3 w-3" />
            Resume
          </a>
        )}
        {onChat && (
          <button
            onClick={(e) => { e.stopPropagation(); onChat(user._id); }}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors ml-auto"
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
