import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStarredStudentsRecruiter, starStudentRecruiter, unstarStudentRecruiter } from '../../api/recruiterApi.js';
import { createOrGetConversation } from '../../api/chatApi.js';
import StudentCard from '../../components/shared/StudentCard.jsx';
import { Star } from 'lucide-react';
import toast from 'react-hot-toast';

const ShortlistPage = () => {
  const [starred, setStarred] = useState([]);
  const [starredIds, setStarredIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = async () => {
    try {
      const { data } = await getStarredStudentsRecruiter();
      setStarred(data);
      setStarredIds(new Set(data.map(s => s._id)));
    } catch { /* ok */ }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleStar = async (studentId, star) => {
    try {
      if (!star) {
        await unstarStudentRecruiter(studentId);
        setStarred(prev => prev.filter(s => s._id !== studentId));
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

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" /></div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Shortlist</h1>
        <p className="text-slate-500 text-sm">{starred.length} starred student{starred.length !== 1 ? 's' : ''}</p>
      </div>

      {starred.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-slate-500 bg-white rounded-xl border border-slate-200">
          <Star className="h-12 w-12 mb-3 opacity-20" />
          <p className="font-medium">No starred students yet</p>
          <p className="text-sm mt-1">Star students from the search page to shortlist them</p>
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

export default ShortlistPage;
