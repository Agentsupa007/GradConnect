import { useState, useEffect, useRef } from 'react';
import { getSkillsApi } from '../../api/authApi.js';
import SkillBadge from './SkillBadge.jsx';
import { ChevronDown, Search } from 'lucide-react';

const SkillSelector = ({ selected = [], onChange, placeholder = 'Search skills...' }) => {
  const [allSkills, setAllSkills] = useState([]);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    getSkillsApi().then(({ data }) => setAllSkills(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
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
    if (e.key === 'Escape') setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Selected badges */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {selected.map(skill => (
            <SkillBadge key={skill} skill={skill} onRemove={removeSkill} />
          ))}
        </div>
      )}

      {/* Input */}
      <div
        className="flex items-center gap-2 w-full border border-zinc-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 cursor-text"
        onClick={() => setIsOpen(true)}
      >
        <Search className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          placeholder={selected.length === 0 ? placeholder : 'Add more skills...'}
          className="flex-1 outline-none text-sm text-zinc-700 bg-transparent placeholder-zinc-400 min-w-0"
        />
        <ChevronDown className={`h-3.5 w-3.5 text-zinc-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg max-h-52 overflow-y-auto">
          {query.trim() && !allSkills.map(s => s.toLowerCase()).includes(query.trim().toLowerCase()) && (
            <button
              onClick={() => addSkill(query.trim())}
              className="w-full text-left px-3 py-2.5 text-sm text-indigo-600 hover:bg-indigo-50 font-medium border-b border-zinc-100"
            >
              + Add &ldquo;{query.trim()}&rdquo;
            </button>
          )}
          {filtered.length === 0 && !query.trim() && (
            <div className="px-3 py-3 text-sm text-zinc-400 text-center">Type to search skills</div>
          )}
          {filtered.length === 0 && query.trim() && !(!allSkills.map(s => s.toLowerCase()).includes(query.trim().toLowerCase())) && (
            <div className="px-3 py-3 text-sm text-zinc-400 text-center">No matching skills</div>
          )}
          {filtered.map(skill => (
            <button
              key={skill}
              onClick={() => addSkill(skill)}
              className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
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
