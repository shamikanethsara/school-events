import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getEvent, registerForEvent } from '../api'
import Countdown from '../components/Countdown'
import { format, isPast } from 'date-fns'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', grade: '', school: '' })
  const [submitting, setSubmitting] = useState(false)
  const [ticket, setTicket] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getEvent(id)
      .then(r => setEvent(r.data))
      .catch(() => setEvent({
        id: 1,
        title: 'Annual Sports Meet 2025',
        category: 'sports',
        event_date: new Date(Date.now() + 5 * 86400000).toISOString(),
        description: 'The biggest sporting event of the year. All houses compete for glory on the main grounds. Students, teachers, and parents are all welcome to witness the excitement.',
        location: 'Main Grounds, Royal College',
        max_capacity: 500,
        registration_count: 342,
        is_featured: true,
      }))
      .finally(() => setLoading(false))
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const res = await registerForEvent({ ...form, event_id: parseInt(id) })
      setTicket(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div className="pt-24 max-w-4xl mx-auto px-6">
      <div className="h-10 bg-card rounded-xl animate-pulse mb-6 w-2/3" />
      <div className="h-64 bg-card rounded-2xl animate-pulse" />
    </div>
  )

  if (!event) return (
    <div className="pt-24 text-center">
      <p className="font-display text-2xl text-text-dim">Event not found.</p>
      <Link to="/events" className="text-accent mt-4 inline-block">← Back to Events</Link>
    </div>
  )

  const past = isPast(new Date(event.event_date))
  const spotsLeft = event.max_capacity - (event.registration_count || 0)
  const full = spotsLeft <= 0

  return (
    <div className="pt-24 pb-24 max-w-5xl mx-auto px-6">
      {/* Back */}
      <Link to="/events" className="inline-flex items-center gap-2 text-text-dim hover:text-accent font-body text-sm mb-8 transition-colors animate-fade-up stagger-1">
        ← Back to Events
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Event info */}
        <div className="lg:col-span-2 space-y-6 animate-fade-up stagger-2">
          {/* Category badge */}
          <span className="inline-block border border-accent/40 text-accent text-xs font-display font-bold px-3 py-1 rounded-full capitalize">
            {event.category || 'event'}
          </span>

          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-text leading-tight">
            {event.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap gap-6 text-sm font-body text-text-dim">
            <span>📅 {format(new Date(event.event_date), 'EEEE, MMMM d, yyyy')}</span>
            <span>🕐 {format(new Date(event.event_date), 'h:mm a')}</span>
            {event.location && <span>📍 {event.location}</span>}
          </div>

          <p className="font-body text-text-dim text-lg leading-relaxed">
            {event.description}
          </p>

          {/* Capacity bar */}
          <div>
            <div className="flex justify-between text-sm font-body mb-2">
              <span className="text-text-dim">{event.registration_count || 0} registered</span>
              <span className={full ? 'text-red-400' : 'text-green-400'}>
                {full ? 'Fully Booked' : `${spotsLeft} spots remaining`}
              </span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${full ? 'bg-red-500' : 'bg-accent'}`}
                style={{ width: `${Math.min(100, ((event.registration_count || 0) / event.max_capacity) * 100)}%` }}
              />
            </div>
          </div>

          {/* Countdown */}
          {!past && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="font-display font-semibold text-text-dim text-sm uppercase tracking-wider mb-4">
                Time Until Event
              </p>
              <Countdown targetDate={event.event_date} />
            </div>
          )}
        </div>

        {/* Right: Registration */}
        <div className="animate-fade-up stagger-3">
          <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
            {ticket ? (
              /* Success state */
              <div className="text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 className="font-display font-bold text-text text-xl mb-2">You're registered!</h3>
                <p className="font-body text-text-dim text-sm mb-6">Your ticket code:</p>
                <div className="bg-surface border border-accent/30 rounded-xl px-6 py-4 mb-6">
                  <span className="font-display font-bold text-accent text-2xl tracking-widest">
                    {ticket.ticket_code}
                  </span>
                </div>
                <p className="font-body text-text-dim text-xs">
                  Save this code. You'll need it at the event entrance.
                </p>
              </div>
            ) : past ? (
              <div className="text-center py-6">
                <span className="text-4xl mb-4 block">📁</span>
                <p className="font-display font-bold text-text-dim text-lg">This event has ended.</p>
              </div>
            ) : full ? (
              <div className="text-center py-6">
                <span className="text-4xl mb-4 block">🔒</span>
                <p className="font-display font-bold text-text text-lg mb-2">Fully Booked</p>
                <p className="font-body text-text-dim text-sm">No spots remaining for this event.</p>
              </div>
            ) : (
              <>
                <h3 className="font-display font-bold text-text text-xl mb-5">Register Now</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { key: 'name', label: 'Full Name', type: 'text', required: true },
                    { key: 'email', label: 'Email Address', type: 'email', required: true },
                    { key: 'grade', label: 'Grade / Year', type: 'text', required: false },
                    { key: 'school', label: 'School', type: 'text', required: false },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block font-body text-text-dim text-xs uppercase tracking-wider mb-1.5">
                        {f.label} {f.required && <span className="text-accent">*</span>}
                      </label>
                      <input
                        type={f.type}
                        required={f.required}
                        value={form[f.key]}
                        onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                        className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-text font-body text-sm placeholder-muted focus:outline-none focus:border-accent/50 transition-colors"
                        placeholder={f.label}
                      />
                    </div>
                  ))}

                  {error && (
                    <p className="text-red-400 font-body text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-accent text-ink font-display font-bold py-3.5 rounded-xl hover:bg-accent-dim transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {submitting ? 'Registering...' : 'Secure My Spot →'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
