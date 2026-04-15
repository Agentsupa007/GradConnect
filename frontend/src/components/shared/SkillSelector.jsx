import { useState, useEffect, useRef } from 'react';
import { getSkillsApi } from '../../api/authApi.js';
import SkillBadge from './SkillBadge.jsx';
import { ChevronDown } from 'lucide-react';

const SkillSelector = ({ selected = [], onChange, placeholder = 'Select or type skills...' }) => {
  const [allSkills, setAllSkills] = useState([]);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    getSkillsApi().then(({ data }) => setAllSkills(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = allSkills.filter(
    s => !selected.includes(s) && s.toLowerCase().includes(query.toLowerCase())
  );

  const addSkill = (skill) => {
    if (!selected.includes(skill)) onChange([...selected, skill]);
    setQuery('');
    setIsOpen(false);
  };

  const removeSkill = (skill) => onChange(selected.filter(s => s !== skill));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      e.preventDefault();
      addSkill(query.trim());
    }
  };

  return (
    <div ref={ref} className="relative">
      {/* Selected skills */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map(skill => (
            <SkillBadge key={skill} skill={skill} onRemove={removeSkill} />
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="flex items-center gap-2 w-full border border-slate-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 cursor-text"
        onClick={() => setIsOpen(true)}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder={selected.length === 0 ? placeholder : 'Add more...'}
          className="flex-1 outline-none text-sm text-slate-700 bg-transparent"
        />
        <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {query.trim() && !allSkills.includes(query.trim()) && (
            <button
              onClick={() => addSkill(query.trim())}
              className="w-full text-left px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-medium"
            >
              + Add "{query.trim()}"
            </button>
          )}
          {filtered.length === 0 && !query.trim() && (
            <div className="px-3 py-2 text-sm text-slate-500">Type to search skills</div>
          )}
          {filtered.map(skill => (
            <button
              key={skill}
              onClick={() => addSkill(skill)}
              className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700"
            >
              {skill}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillSelector;
