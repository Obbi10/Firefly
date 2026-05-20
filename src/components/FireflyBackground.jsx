import { useMemo } from 'react'

export default function FireflyBackground() {
  const flies = useMemo(() =>
    Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      tx: `${(Math.random() - 0.5) * 120}px`,
      ty: `${(Math.random() - 0.5) * 120}px`,
      duration: `${4 + Math.random() * 6}s`,
      delay: `${Math.random() * 6}s`,
      size: Math.random() > 0.7 ? 5 : 3,
    })), []
  )

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {flies.map((f) => (
        <div
          key={f.id}
          className="firefly"
          style={{
            left: f.left,
            top: f.top,
            '--tx': f.tx,
            '--ty': f.ty,
            '--duration': f.duration,
            '--delay': f.delay,
            width: f.size,
            height: f.size,
          }}
        />
      ))}
    </div>
  )
}
