const palettes = [
  'bg-indigo-50 text-indigo-700 border-indigo-100',
  'bg-sky-50 text-sky-700 border-sky-100',
  'bg-violet-50 text-violet-700 border-violet-100',
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-amber-50 text-amber-700 border-amber-100',
  'bg-rose-50 text-rose-700 border-rose-100',
  'bg-cyan-50 text-cyan-700 border-cyan-100',
  'bg-orange-50 text-orange-700 border-orange-100',
];

const SkillBadge = ({ skill, onRemove, size = 'sm' }) => {
  const idx = (skill.charCodeAt(0) + skill.charCodeAt(skill.length - 1)) % palettes.length;
  const palette = palettes[idx];
  const sizeClass = size === 'xs'
    ? 'px-2 py-0.5 text-[11px] gap-0.5'
    : 'px-2.5 py-1 text-xs gap-1';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${palette} ${sizeClass}`}>
      {skill}
      {onRemove && (
        <button
          onClick={() => onRemove(skill)}
          className="hover:opacity-60 leading-none"
          aria-label={`Remove ${skill}`}
        >
          ×
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
