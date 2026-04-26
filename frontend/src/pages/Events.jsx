import { useEffect, useState } from 'react'
import { getEvents } from '../api'
import EventCard from '../components/EventCard'
import { isPast } from 'date-fns'

const CATEGORIES = ['all', 'sports', 'debate', 'exhibition', 'cultural', 'academic', 'other']

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('all')
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('upcoming') // upcoming | past

  useEffect(() => {
    getEvents()
      .then(r => setEvents(r.data))
      .catch(() => setEvents([
        { id: 1, title: 'Annual Sports Meet 2025', category: 'sports', event_date: new Date(Date.now() + 5 * 86400000).toISOString(), description: 'The biggest sporting event of the year.', max_capacity: 500, registration_count: 342, is_featured: true },
        { id: 2, title: 'Inter-School Debate Championship', category: 'debate', event_date: new Date(Date.now() + 12 * 86400000).toISOString(), description: 'Top debaters clash on pressing topics.', max_capacity: 200, registration_count: 87, is_featured: false },
        { id: 3, title: 'Science & Tech Exhibition', category: 'exhibition', event_date: new Date(Date.now() + 20 * 86400000).toISOString(), description: 'Showcase your innovations.', max_capacity: 300, registration_count: 120, is_featured: false },
        { id: 4, title: 'Cultural Night 2024', category: 'cultural', event_date: new Date(Date.now() - 10 * 86400000).toISOString(), description: 'A night of music, dance and drama.', max_capacity: 400, registration_count: 400, is_featured: false },
      ]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = events
    .filter(e => tab === 'upcoming' ? !isPast(new Date(e.event_date)) : isPast(new Date(e.event_date)))
    .filter(e => cat === 'all' || e.category === cat)
    .filter(e => e.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="mb-12 animate-fade-up stagger-1">
        <h1 className="font-display font-extrabold text-5xl text-text mb-3">All Events</h1>
        <p className="font-body text-text-dim text-lg">Browse, register, and stay updated on every school event.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 animate-fade-up stagger-2">
        {/* Search */}
        <input
          type="text"
          placeholder="Search events..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 bg-card border border-border rounded-xl px-5 py-3 text-text font-body placeholder-text-dim focus:outline-none focus:border-accent/50 transition-colors"
        />

        {/* Tab */}
        <div className="flex bg-card border border-border rounded-xl p-1">
          {['upcoming', 'past'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg font-display font-semibold text-sm capitalize transition-all
                ${tab === t ? 'bg-accent text-ink' : 'text-text-dim hover:text-text'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-10 animate-fade-up stagger-3">
        {CATEGORIES.map(c => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`px-4 py-1.5 rounded-full text-sm font-display font-semibold border capitalize transition-all
              ${cat === c
                ? 'bg-accent text-ink border-accent'
                : 'border-border text-text-dim hover:border-accent/40 hover:text-text'}`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display font-bold text-3xl text-text-dim mb-2">No events found</p>
          <p className="font-body text-muted">Try a different filter or search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((e, i) => <EventCard key={e.id} event={e} delay={i * 80} />)}
        </div>
      )}
    </div>
  )
}
