import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchStudents } from '../../api/searchApi.js';
import { getRecruiterProfile, starStudentRecruiter, unstarStudentRecruiter, getStarredStudentsRecruiter } from '../../api/recruiterApi.js';
import { createOrGetConversation } from '../../api/chatApi.js';
import SkillSelector from '../../components/shared/SkillSelector.jsx';
import StudentCard from '../../components/shared/StudentCard.jsx';
import { Search, Users } from 'lucide-react';
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
    getStarredStudentsRecruiter()
      .then(({ data }) => setStarredIds(new Set(data.map(s => s._id))))
      .catch(() => {});
    // Load all students on mount
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

  const handleSearch = () => doSearch(skills);

  const handleStar = async (studentId, star) => {
    try {
      if (star) {
        await starStudentRecruiter(studentId);
        setStarredIds(prev => new Set([...prev, studentId]));
        toast.success('Student shortlisted!');
      } else {
        await unstarStudentRecruiter(studentId);
        setStarredIds(prev => { const s = new Set(prev); s.delete(studentId); return s; });
        toast.success('Removed from shortlist');
      }
    } catch { toast.error('Failed'); }
  };

  const handleChat = async (userId) => {
    try {
      const { data } = await createOrGetConversation(userId);
      navigate(`/recruiter/chat?conv=${data._id}`);
    } catch { toast.error('Could not start chat'); }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Find Students</h1>
        <p className="text-slate-500 text-sm">Search by skills — results ranked by best match</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <label className="block text-sm font-medium text-slate-700 mb-2">Filter by Skills</label>
        <div className="flex gap-3">
          <div className="flex-1">
            <SkillSelector selected={skills} onChange={setSkills} placeholder="Select skills to search..." />
          </div>
          <button
            onClick={handleSearch}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex-shrink-0 self-end"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
        {skills.length > 0 && (
          <button onClick={() => { setSkills([]); doSearch([]); }} className="text-xs text-slate-500 hover:text-red-500 mt-2">Clear filters</button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      ) : searched && students.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 text-slate-500">
          <Users className="h-10 w-10 mb-2 opacity-30" />
          <p className="font-medium">No students found</p>
          <p className="text-sm">Try different skill combinations</p>
        </div>
      ) : (
        <>
          {total > 0 && (
            <p className="text-sm text-slate-600 mb-4">
              <strong>{total}</strong> student{total !== 1 ? 's' : ''} found
              {skills.length > 0 && <span> matching <strong>{skills.join(', ')}</strong></span>}
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
