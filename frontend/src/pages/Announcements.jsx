import { useEffect, useState } from 'react'
import { getAnnouncements } from '../api'
import { format, formatDistanceToNow } from 'date-fns'

const priorityConfig = {
  urgent: { label: 'URGENT', cls: 'bg-red-500/20 text-red-400 border-red-500/30', bar: 'border-l-red-500', bg: 'bg-red-500/5' },
  info:   { label: 'INFO',   cls: 'bg-blue-500/20 text-blue-400 border-blue-500/30', bar: 'border-l-blue-500', bg: 'bg-blue-500/5' },
  normal: { label: 'UPDATE', cls: 'bg-border text-text-dim border-border', bar: 'border-l-border', bg: 'bg-surface' },
}

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getAnnouncements()
      .then(r => setAnnouncements(r.data))
      .catch(() => setAnnouncements([
        { id: 1, title: 'Sports Meet Registration Now Open', content: 'All students from Grade 6–13 are invited to register for the Annual Sports Meet 2025. Register via the Events page before October 30th.', priority: 'urgent', created_at: new Date().toISOString() },
        { id: 2, title: 'Venue Change: Debate Championship', content: 'Please note the Inter-School Debate Championship will now be held in the Main Hall instead of the Library.', priority: 'info', created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
        { id: 3, title: 'Science Exhibition Guidelines Released', content: 'The official guidelines for the Science & Tech Exhibition have been released. Please read them carefully before submitting your projects.', priority: 'normal', created_at: new Date(Date.now() - 5 * 86400000).toISOString() },
        { id: 4, title: 'Cultural Night Highlights Now Available', content: 'Photos and video highlights from Cultural Night 2024 are now available on our gallery page.', priority: 'normal', created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
      ]))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all'
    ? announcements
    : announcements.filter(a => a.priority === filter)

  return (
    <div className="pt-24 pb-24 max-w-4xl mx-auto px-6">
      {/* Header */}
      <div className="mb-10 animate-fade-up stagger-1">
        <h1 className="font-display font-extrabold text-5xl text-text mb-3">Announcements</h1>
        <p className="font-body text-text-dim text-lg">Stay up to date with the latest news and updates.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-8 animate-fade-up stagger-2">
        {['all', 'urgent', 'info', 'normal'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-display font-semibold capitalize border transition-all
              ${filter === f
                ? 'bg-accent text-ink border-accent'
                : 'border-border text-text-dim hover:border-accent/40 hover:text-text'}`}
          >
            {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-display font-bold text-2xl text-text-dim">No announcements found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a, i) => {
            const cfg = priorityConfig[a.priority] || priorityConfig.normal
            return (
              <div
                key={a.id}
                className={`border-l-4 rounded-r-2xl px-6 py-5 ${cfg.bar} ${cfg.bg} animate-fade-up`}
                style={{ animationDelay: `${i * 80}ms`, opacity: 0 }}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h3 className="font-display font-bold text-text text-lg">{a.title}</h3>
                  <span className={`shrink-0 border text-xs font-display font-bold px-2.5 py-1 rounded-full ${cfg.cls}`}>
                    {cfg.label}
                  </span>
                </div>
                <p className="font-body text-text-dim leading-relaxed mb-4">{a.content}</p>
                <div className="flex items-center gap-4 text-xs text-muted font-body">
                  <span>📅 {format(new Date(a.created_at), 'MMMM d, yyyy')}</span>
                  <span>· {formatDistanceToNow(new Date(a.created_at), { addSuffix: true })}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
