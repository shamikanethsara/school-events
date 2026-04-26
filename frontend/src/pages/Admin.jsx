import { useEffect, useState } from 'react'
import { getEvents, createEvent, deleteEvent, getAnnouncements, createAnnouncement } from '../api'
import { format } from 'date-fns'

const TABS = ['events', 'announcements']

export default function Admin() {
  const [tab, setTab] = useState('events')
  const [events, setEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [eventForm, setEventForm] = useState({
    title: '', description: '', category: 'sports', location: '',
    event_date: '', max_capacity: 100, is_featured: false, image_url: ''
  })
  const [annForm, setAnnForm] = useState({ title: '', content: '', priority: 'normal' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  const fetchAll = () => {
    setLoading(true)
    Promise.all([getEvents(), getAnnouncements()])
      .then(([ev, ann]) => { setEvents(ev.data); setAnnouncements(ann.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAll() }, [])

  const flash = (text) => { setMsg(text); setTimeout(() => setMsg(''), 3000) }

  const handleCreateEvent = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createEvent({ ...eventForm, max_capacity: parseInt(eventForm.max_capacity) })
      setEventForm({ title: '', description: '', category: 'sports', location: '', event_date: '', max_capacity: 100, is_featured: false, image_url: '' })
      flash('✅ Event created!')
      fetchAll()
    } catch (err) {
      flash('❌ ' + (err.response?.data?.detail || 'Failed to create event'))
    } finally { setSaving(false) }
  }

  const handleDeleteEvent = async (id) => {
    if (!confirm('Delete this event?')) return
    try { await deleteEvent(id); flash('🗑️ Event deleted'); fetchAll() }
    catch { flash('❌ Failed to delete') }
  }

  const handleCreateAnn = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createAnnouncement(annForm)
      setAnnForm({ title: '', content: '', priority: 'normal' })
      flash('✅ Announcement posted!')
      fetchAll()
    } catch { flash('❌ Failed to post announcement') }
    finally { setSaving(false) }
  }

  const inputCls = "w-full bg-ink border border-border rounded-xl px-4 py-3 text-text font-body text-sm placeholder-muted focus:outline-none focus:border-accent/50 transition-colors"
  const labelCls = "block font-body text-text-dim text-xs uppercase tracking-wider mb-1.5"

  return (
    <div className="pt-24 pb-24 max-w-7xl mx-auto px-6">
      {/* Header */}
      <div className="mb-10 animate-fade-up stagger-1">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-ink text-sm font-bold">⚙</span>
          </div>
          <h1 className="font-display font-extrabold text-4xl text-text">Admin Panel</h1>
        </div>
        <p className="font-body text-text-dim">Manage events and announcements.</p>
      </div>

      {/* Flash message */}
      {msg && (
        <div className="mb-6 bg-accent/10 border border-accent/30 text-accent font-body text-sm px-5 py-3 rounded-xl animate-fade-up">
          {msg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-card border border-border rounded-xl p-1 w-fit mb-10 animate-fade-up stagger-2">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2.5 rounded-lg font-display font-semibold text-sm capitalize transition-all
              ${tab === t ? 'bg-accent text-ink' : 'text-text-dim hover:text-text'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'events' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-up stagger-3">
          {/* Create event form */}
          <div>
            <h2 className="font-display font-bold text-text text-xl mb-6">Create New Event</h2>
            <form onSubmit={handleCreateEvent} className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div>
                <label className={labelCls}>Title *</label>
                <input required className={inputCls} placeholder="Event title" value={eventForm.title}
                  onChange={e => setEventForm({ ...eventForm, title: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Description</label>
                <textarea rows={3} className={inputCls} placeholder="Describe the event..." value={eventForm.description}
                  onChange={e => setEventForm({ ...eventForm, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Category</label>
                  <select className={inputCls} value={eventForm.category}
                    onChange={e => setEventForm({ ...eventForm, category: e.target.value })}>
                    {['sports', 'debate', 'exhibition', 'cultural', 'academic', 'other'].map(c => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Max Capacity</label>
                  <input type="number" className={inputCls} value={eventForm.max_capacity}
                    onChange={e => setEventForm({ ...eventForm, max_capacity: e.target.value })} />
                </div>
              </div>
              <div>
                <label className={labelCls}>Location</label>
                <input className={inputCls} placeholder="e.g. Main Grounds" value={eventForm.location}
                  onChange={e => setEventForm({ ...eventForm, location: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Event Date & Time *</label>
                <input required type="datetime-local" className={inputCls} value={eventForm.event_date}
                  onChange={e => setEventForm({ ...eventForm, event_date: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Image URL (optional)</label>
                <input className={inputCls} placeholder="https://..." value={eventForm.image_url}
                  onChange={e => setEventForm({ ...eventForm, image_url: e.target.value })} />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="featured" checked={eventForm.is_featured}
                  onChange={e => setEventForm({ ...eventForm, is_featured: e.target.checked })}
                  className="w-4 h-4 accent-yellow-400" />
                <label htmlFor="featured" className="font-body text-text-dim text-sm">Mark as Featured</label>
              </div>
              <button type="submit" disabled={saving}
                className="w-full bg-accent text-ink font-display font-bold py-3 rounded-xl hover:bg-accent-dim transition-all disabled:opacity-50">
                {saving ? 'Creating...' : '+ Create Event'}
              </button>
            </form>
          </div>

          {/* Event list */}
          <div>
            <h2 className="font-display font-bold text-text text-xl mb-6">All Events ({events.length})</h2>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <div key={i} className="bg-card border border-border rounded-xl h-16 animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {events.map(e => (
                  <div key={e.id} className="bg-card border border-border rounded-xl px-5 py-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-bold text-text text-sm truncate">{e.title}</p>
                      <p className="font-body text-muted text-xs mt-0.5">
                        {format(new Date(e.event_date), 'MMM d, yyyy')} · {e.registration_count || 0}/{e.max_capacity} registered
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(e.id)}
                      className="shrink-0 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/50 rounded-lg px-3 py-1.5 text-xs font-display font-semibold transition-all"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'announcements' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 animate-fade-up stagger-3">
          {/* Create announcement */}
          <div>
            <h2 className="font-display font-bold text-text text-xl mb-6">Post Announcement</h2>
            <form onSubmit={handleCreateAnn} className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div>
                <label className={labelCls}>Title *</label>
                <input required className={inputCls} placeholder="Announcement title" value={annForm.title}
                  onChange={e => setAnnForm({ ...annForm, title: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Content *</label>
                <textarea required rows={5} className={inputCls} placeholder="Write your announcement..." value={annForm.content}
                  onChange={e => setAnnForm({ ...annForm, content: e.target.value })} />
              </div>
              <div>
                <label className={labelCls}>Priority</label>
                <select className={inputCls} value={annForm.priority}
                  onChange={e => setAnnForm({ ...annForm, priority: e.target.value })}>
                  <option value="normal">Normal Update</option>
                  <option value="info">Info</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <button type="submit" disabled={saving}
                className="w-full bg-accent text-ink font-display font-bold py-3 rounded-xl hover:bg-accent-dim transition-all disabled:opacity-50">
                {saving ? 'Posting...' : '+ Post Announcement'}
              </button>
            </form>
          </div>

          {/* Announcements list */}
          <div>
            <h2 className="font-display font-bold text-text text-xl mb-6">All Announcements ({announcements.length})</h2>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
              {announcements.map(a => (
                <div key={a.id} className="bg-card border border-border rounded-xl px-5 py-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-display font-bold text-text text-sm">{a.title}</p>
                    <span className={`shrink-0 text-xs font-display font-bold px-2 py-0.5 rounded-full border
                      ${a.priority === 'urgent' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                        a.priority === 'info' ? 'text-blue-400 border-blue-500/30 bg-blue-500/10' :
                        'text-text-dim border-border bg-surface'}`}>
                      {a.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="font-body text-muted text-xs">{format(new Date(a.created_at), 'MMM d, yyyy')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
