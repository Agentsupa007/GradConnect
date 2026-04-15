import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getStarredStudentsAlumni, unstarStudentAlumni } from '../../api/alumniApi.js';
import { createOrGetConversation } from '../../api/chatApi.js';
import StudentCard from '../../components/shared/StudentCard.jsx';
import toast from 'react-hot-toast';

const AlumniShortlistPage = () => {
  const [starred, setStarred] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getStarredStudentsAlumni()
      .then(({ data }) => setStarred(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleStar = async (studentId, star) => {
    if (!star) {
      try {
        await unstarStudentAlumni(studentId);
        setStarred(prev => prev.filter(s => s._id !== studentId));
        toast.success('Removed');
      } catch { toast.error('Failed'); }
    }
  };

  const handleChat = async (userId) => {
    try {
      const { data } = await createOrGetConversation(userId);
      navigate(`/alumni/chat?conv=${data._id}`);
    } catch { toast.error('Could not start chat'); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f4f0]">
      <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-zinc-900">My Shortlist</h1>
        <p className="text-zinc-400 text-sm mt-0.5">
          {starred.length > 0 ? `${starred.length} student${starred.length !== 1 ? 's' : ''} you're following` : 'Star students you want to mentor'}
        </p>
      </div>

      {starred.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-200 p-16 text-center">
          <div className="text-5xl mb-4">⭐</div>
          <p className="font-semibold text-zinc-700 mb-2">No students starred yet</p>
          <p className="text-sm text-zinc-400 mb-6">Find students you'd like to mentor and star them</p>
          <Link to="/alumni/search" className="inline-flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors">
            Find students →
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {starred.map(student => (
            <StudentCard key={student._id} student={student} isStarred={true} onStar={handleStar} onChat={handleChat} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AlumniShortlistPage;
