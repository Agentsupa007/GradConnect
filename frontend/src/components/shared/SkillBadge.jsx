const colors = [
  'bg-blue-100 text-blue-700',
  'bg-green-100 text-green-700',
  'bg-purple-100 text-purple-700',
  'bg-orange-100 text-orange-700',
  'bg-pink-100 text-pink-700',
  'bg-teal-100 text-teal-700',
];

const SkillBadge = ({ skill, onRemove, size = 'sm' }) => {
  const colorIndex = skill.charCodeAt(0) % colors.length;
  const color = colors[colorIndex];
  const padding = size === 'xs' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${color} ${padding}`}>
      {skill}
      {onRemove && (
        <button onClick={() => onRemove(skill)} className="hover:opacity-70 ml-0.5">
          ×
        </button>
      )}
    </span>
  );
};

export default SkillBadge;
