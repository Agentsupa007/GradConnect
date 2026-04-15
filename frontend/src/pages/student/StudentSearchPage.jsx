import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchStudents } from '../../api/searchApi.js';
import { starStudentStudent, unstarStudentStudent, getStarredStudentsStudent } from '../../api/studentApi.js';
import { createOrGetConversation } from '../../api/chatApi.js';
import SkillSelector from '../../components/shared/SkillSelector.jsx';
import StudentCard from '../../components/shared/StudentCard.jsx';
import { Search, SlidersHorizontal } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentSearchPage = () => {
  const [skills, setSkills] = useState([]);
  const [students, setStudents] = useState([]);
  const [starredIds, setStarredIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [searched, setSearched] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getStarredStudentsStudent()
      .then(({ data }) => setStarredIds(new Set(data.map(s => s._id))))
      .catch(() => {});
    doSearch([]);
  }, []);

  const doSearch = useCallback(async (skillList) => {
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await searchStudents({ skills: skillList });
      setStudents(data.students);
      setTotal(data.total);
    } catch { toast.error('Search failed'); }
    finally { setLoading(false); }
  }, []);

  const handleStar = async (studentId, star) => {
    try {
      if (star) {
        await starStudentStudent(studentId);
        setStarredIds(prev => new Set([...prev, studentId]));
        toast.success('Added to shortlist');
      } else {
        await unstarStudentStudent(studentId);
        setStarredIds(prev => { const s = new Set(prev); s.delete(studentId); return s; });
        toast.success('Removed from shortlist');
      }
    } catch { toast.error('Failed'); }
  };

  const handleChat = async (userId) => {
    try {
      const { data } = await createOrGetConversation(userId);
      navigate(`/student/chat?conv=${data._id}`);
    } catch { toast.error('Could not start chat'); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-zinc-900">Find Students</h1>
        <p className="text-zinc-400 text-sm mt-0.5">Discover peers by skills — connect and collaborate</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <SlidersHorizontal className="h-4 w-4 text-zinc-400" />
          <span className="text-sm font-medium text-zinc-700">Filter by skills</span>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <SkillSelector selected={skills} onChange={setSkills} placeholder="React.js, Node.js, Python..." />
          </div>
          <button
            onClick={() => doSearch(skills)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors flex-shrink-0 self-end text-sm"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
        {skills.length > 0 && (
          <button
            onClick={() => { setSkills([]); doSearch([]); }}
            className="text-xs text-zinc-400 hover:text-red-500 mt-3 transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : searched && students.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="font-semibold text-zinc-700">No students found</p>
          <p className="text-sm text-zinc-400 mt-1">Try different skill combinations</p>
        </div>
      ) : (
        <>
          {total > 0 && (
            <p className="text-sm text-zinc-500 mb-4">
              <strong className="text-zinc-800">{total}</strong> student{total !== 1 ? 's' : ''}
              {skills.length > 0 && <span> matching <strong className="text-zinc-800">{skills.join(', ')}</strong></span>}
            </p>
          )}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {students.map(student => (
              <StudentCard
                key={student._id}
                student={student}
                isStarred={starredIds.has(student._id)}
                onStar={handleStar}
                onChat={handleChat}
                matchCount={student.matchCount}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default StudentSearchPage;
