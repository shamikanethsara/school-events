import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEvents, getAnnouncements } from '../api'
import EventCard from '../components/EventCard'
import Countdown from '../components/Countdown'
import { format, isPast } from 'date-fns'

export default function Home() {
  const [events, setEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getEvents(), getAnnouncements()])
      .then(([ev, ann]) => {
        setEvents(ev.data)
        setAnnouncements(ann.data)
      })
      .catch(() => {
        // Fallback demo data if API not connected
        setEvents([
          { id: 1, title: 'Annual Sports Meet 2025', category: 'sports', event_date: new Date(Date.now() + 5 * 86400000).toISOString(), description: 'The biggest sporting event of the year. All houses compete for glory.', max_capacity: 500, registration_count: 342, is_featured: true },
          { id: 2, title: 'Inter-School Debate Championship', category: 'debate', event_date: new Date(Date.now() + 12 * 86400000).toISOString(), description: 'Top debaters from across the country clash on pressing topics.', max_capacity: 200, registration_count: 87, is_featured: false },
          { id: 3, title: 'Science & Tech Exhibition', category: 'exhibition', event_date: new Date(Date.now() + 20 * 86400000).toISOString(), description: 'Showcase your innovations and projects to judges and peers.', max_capacity: 300, registration_count: 120, is_featured: false },
        ])
        setAnnouncements([
          { id: 1, title: 'Registration now open!', content: 'All students can now register for upcoming events via the Events page.', priority: 'urgent', created_at: new Date().toISOString() },
          { id: 2, title: 'New venue for Sports Meet', content: 'The annual sports meet will be held at the main grounds this year.', priority: 'normal', created_at: new Date().toISOString() },
        ])
      })
      .finally(() => setLoading(false))
  }, [])

  const featured = events.find(e => e.is_featured && !isPast(new Date(e.event_date)))
  const upcoming = events.filter(e => !isPast(new Date(e.event_date))).slice(0, 6)

  const priorityStyle = {
    urgent: 'border-l-red-500 bg-red-500/5',
    info:   'border-l-blue-500 bg-blue-500/5',
    normal: 'border-l-border bg-surface',
  }

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#e8ff47 1px, transparent 1px), linear-gradient(90deg, #e8ff47 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
        {/* Glow blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="inline-block border border-accent/30 text-accent text-xs font-display font-semibold px-4 py-1.5 rounded-full mb-8 animate-fade-up stagger-1">
            🎓 Royal College — Event Hub
          </div>
          <h1 className="font-display font-extrabold text-6xl md:text-8xl text-text leading-none mb-6 animate-fade-up stagger-2">
            Every Event.<br />
            <span className="text-accent glow-text">One Place.</span>
          </h1>
          <p className="font-body text-text-dim text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-up stagger-3">
            Announcements, registrations, countdowns, and live updates — all for the school community.
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-up stagger-4">
            <Link to="/events" className="bg-accent text-ink font-display font-bold px-8 py-3.5 rounded-xl hover:bg-accent-dim transition-all hover:scale-105 glow">
              Browse Events
            </Link>
            <Link to="/calendar" className="border border-border text-text font-display font-semibold px-8 py-3.5 rounded-xl hover:border-accent/50 hover:text-accent transition-all">
              View Calendar
            </Link>
          </div>
        </div>

        {/* Stats bar */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-12 animate-fade-up stagger-5">
          {[
            { val: events.length, label: 'Events' },
            { val: events.reduce((a, e) => a + (e.registration_count || 0), 0), label: 'Registered' },
            { val: announcements.length, label: 'Announcements' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display font-bold text-3xl text-accent">{s.val}</div>
              <div className="font-body text-text-dim text-sm mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured event */}
      {featured && (
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-0.5 bg-accent" />
            <h2 className="font-display font-bold text-text text-2xl">Featured Event</h2>
          </div>
          <div className="bg-card border border-accent/30 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-10">
              <div className="flex-1">
                <span className="inline-block bg-accent text-ink text-xs font-display font-bold px-3 py-1 rounded-full mb-4">
                  ⭐ FEATURED
                </span>
                <h3 className="font-display font-extrabold text-4xl text-text mb-4">{featured.title}</h3>
                <p className="font-body text-text-dim text-lg mb-6">{featured.description}</p>
                <p className="font-body text-text-dim text-sm mb-8">
                  📍 {featured.location || 'School Grounds'} &nbsp;·&nbsp; 📅 {format(new Date(featured.event_date), 'MMMM d, yyyy · h:mm a')}
                </p>
                <Link
                  to={`/events/${featured.id}`}
                  className="inline-block bg-accent text-ink font-display font-bold px-6 py-3 rounded-xl hover:bg-accent-dim transition-all"
                >
                  Register Now →
                </Link>
              </div>
              <div>
                <p className="font-body text-text-dim text-sm mb-4 font-semibold uppercase tracking-wider">Starts in</p>
                <Countdown targetDate={featured.event_date} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming events */}
      <section className="max-w-7xl mx-auto px-6 py-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="w-8 h-0.5 bg-accent" />
            <h2 className="font-display font-bold text-text text-2xl">Upcoming Events</h2>
          </div>
          <Link to="/events" className="text-accent text-sm font-display font-semibold hover:underline">
            View all →
          </Link>
        </div>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl h-64 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((e, i) => <EventCard key={e.id} event={e} delay={i * 100} />)}
          </div>
        )}
      </section>

      {/* Announcements */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-0.5 bg-accent" />
          <h2 className="font-display font-bold text-text text-2xl">Latest Announcements</h2>
        </div>
        <div className="space-y-4">
          {announcements.slice(0, 5).map(a => (
            <div key={a.id} className={`border-l-4 rounded-r-xl px-6 py-4 ${priorityStyle[a.priority] || priorityStyle.normal}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-text mb-1">{a.title}</h3>
                  <p className="font-body text-text-dim text-sm">{a.content}</p>
                </div>
                {a.priority === 'urgent' && (
                  <span className="shrink-0 bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-display font-bold px-2 py-0.5 rounded-full">
                    URGENT
                  </span>
                )}
              </div>
              <p className="text-xs text-muted font-body mt-2">{format(new Date(a.created_at), 'MMM d, yyyy')}</p>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Link to="/announcements" className="text-accent text-sm font-display font-semibold hover:underline">
            View all announcements →
          </Link>
        </div>
      </section>
    </div>
  )
}
