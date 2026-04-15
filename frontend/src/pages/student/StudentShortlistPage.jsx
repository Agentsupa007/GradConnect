import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getStarredStudentsStudent, unstarStudentStudent } from '../../api/studentApi.js';
import { createOrGetConversation } from '../../api/chatApi.js';
import StudentCard from '../../components/shared/StudentCard.jsx';
import toast from 'react-hot-toast';

const StudentShortlistPage = () => {
  const [starred, setStarred] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getStarredStudentsStudent()
      .then(({ data }) => setStarred(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStar = async (studentId, star) => {
    if (!star) {
      try {
        await unstarStudentStudent(studentId);
        setStarred(prev => prev.filter(s => s._id !== studentId));
        toast.success('Removed from shortlist');
      } catch { toast.error('Failed'); }
    }
  };

  const handleChat = async (userId) => {
    try {
      const { data } = await createOrGetConversation(userId);
      navigate(`/student/chat?conv=${data._id}`);
    } catch { toast.error('Could not start chat'); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-zinc-900">My Shortlist</h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          {starred.length > 0 ? `${starred.length} student${starred.length !== 1 ? 's' : ''} saved` : 'Star students from the search page to build your list'}
        </p>
      </div>

      {starred.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-200 p-16 text-center">
          <p className="font-semibold text-zinc-700 mb-2">Your shortlist is empty</p>
          <p className="text-sm text-zinc-400 mb-6">Find peers with skills you're interested in and star them</p>
          <Link to="/student/search" className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors">
            Find students →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {starred.map(student => (
            <StudentCard
              key={student._id}
              student={student}
              isStarred={true}
              onStar={handleStar}
              onChat={handleChat}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentShortlistPage;
