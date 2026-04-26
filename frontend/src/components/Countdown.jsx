import { useState, useEffect } from 'react'

function pad(n) { return String(n).padStart(2, '0') }

export default function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState({})
  const [done, setDone] = useState(false)

  useEffect(() => {
    function calc() {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) { setDone(true); return }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [targetDate])

  if (done) return (
    <div className="text-accent font-display font-bold text-lg">Event has started!</div>
  )

  const units = [
    { label: 'Days',    val: timeLeft.days },
    { label: 'Hours',   val: timeLeft.hours },
    { label: 'Minutes', val: timeLeft.minutes },
    { label: 'Seconds', val: timeLeft.seconds },
  ]

  return (
    <div className="flex gap-3">
      {units.map(u => (
        <div key={u.label} className="flex flex-col items-center">
          <div className="bg-surface border border-border rounded-xl w-16 h-16 flex items-center justify-center">
            <span className="font-display font-bold text-2xl text-accent glow-text">
              {pad(u.val ?? 0)}
            </span>
          </div>
          <span className="text-text-dim text-xs font-body mt-1.5 uppercase tracking-wider">{u.label}</span>
        </div>
      ))}
    </div>
  )
}
