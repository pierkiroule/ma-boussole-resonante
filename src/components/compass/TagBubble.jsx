export default function TagBubble({
  tag,
  selected,
  color,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-full border transition-all duration-300"
      style={{
        background: selected
          ? `${color}33`
          : 'rgba(255,255,255,0.04)',

        borderColor: selected
          ? color
          : 'rgba(255,255,255,0.08)',

        color: selected
          ? color
          : '#94a3b8',
      }}
    >
      {tag}
    </button>
  )
}
