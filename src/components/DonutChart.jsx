// data: [{ label, minutes, color }]
export default function DonutChart({ data, size = 200, thickness = 32, showTotal = true }) {
  const filtered = data.filter((d) => d.minutes > 0)
  const total = filtered.reduce((s, d) => s + d.minutes, 0)

  if (total === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-full text-gray-600 text-sm"
        style={{ width: size, height: size, border: `${thickness}px solid #0a1628` }}
      >
        No data yet
      </div>
    )
  }

  const r = (size - thickness) / 2
  const cx = size / 2
  const cy = size / 2
  const C = 2 * Math.PI * r
  const GAP = filtered.length > 1 ? 3 : 0 // gap in px between slices

  let cumulative = 0
  const slices = filtered.map((d) => {
    const pct = d.minutes / total
    const arcLen = Math.max(0, pct * C - GAP)
    const offset = C * (1 - cumulative)
    cumulative += pct
    return { ...d, pct, arcLen, offset }
  })

  const totalHours = (total / 60).toFixed(1)

  return (
    <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke="#0a1628"
          strokeWidth={thickness}
        />
        {/* Slices */}
        {slices.map((s, i) => (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${s.arcLen} ${C}`}
            strokeDashoffset={s.offset}
            strokeLinecap={filtered.length === 1 ? 'round' : 'butt'}
            style={{ filter: `drop-shadow(0 0 4px ${s.color}70)` }}
          />
        ))}
      </svg>

      {/* Centre label */}
      {showTotal && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-black text-white leading-none">{totalHours}</span>
          <span className="text-xs text-gray-500 mt-0.5">hours total</span>
        </div>
      )}
    </div>
  )
}
