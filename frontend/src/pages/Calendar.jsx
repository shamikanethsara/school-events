import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getEvents } from '../api'
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  startOfWeek, endOfWeek, isSameMonth, isSameDay, isToday, isPast
} from 'date-fns'

export default function Calendar() {
  const [events, setEvents] = useState([])
  const [current, setCurrent] = useState(new Date())
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getEvents()
      .then(r => setEvents(r.data))
      .catch(() => setEvents([
        { id: 1, title: 'Annual Sports Meet', category: 'sports', event_date: new Date(Date.now() + 5 * 86400000).toISOString() },
        { id: 2, title: 'Debate Championship', category: 'debate', event_date: new Date(Date.now() + 12 * 86400000).toISOString() },
        { id: 3, title: 'Science Exhibition', category: 'exhibition', event_date: new Date(Date.now() + 20 * 86400000).toISOString() },
      ]))
  }, [])

  const monthStart = startOfMonth(current)
  const monthEnd = endOfMonth(current)
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: calStart, end: calEnd })

  const eventsOnDay = (day) =>
    events.filter(e => isSameDay(new Date(e.event_date), day))

  const selectedEvents = selected ? eventsOnDay(selected) : []

  const catDot = {
    sports:     'bg-orange-400',
    debate:     'bg-blue-400',
    exhibition: 'bg-purple-400',
    cultural:   'bg-pink-400',
    academic:   'bg-green-400',
    other:      'bg-gray-400',
  }

  return (
    <div className="pt-24 pb-24 max-w-6xl mx-auto px-6">
      {/* Header */}
      <div className="mb-10 animate-fade-up stagger-1">
        <h1 className="font-display font-extrabold text-5xl text-text mb-3">Calendar</h1>
        <p className="font-body text-text-dim text-lg">Click any day to see events scheduled.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-6 animate-fade-up stagger-2">
          {/* Month nav */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
              className="w-10 h-10 rounded-xl border border-border text-text-dim hover:border-accent/50 hover:text-accent transition-all flex items-center justify-center font-display font-bold"
            >
              ‹
            </button>
            <h2 className="font-display font-bold text-text text-xl">
              {format(current, 'MMMM yyyy')}
            </h2>
            <button
              onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
              className="w-10 h-10 rounded-xl border border-border text-text-dim hover:border-accent/50 hover:text-accent transition-all flex items-center justify-center font-display font-bold"
            >
              ›
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
              <div key={d} className="text-center text-xs font-display font-semibold text-muted py-2 uppercase tracking-wider">
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map(day => {
              const dayEvents = eventsOnDay(day)
              const inMonth = isSameMonth(day, current)
              const isSelected = selected && isSameDay(day, selected)
              const today = isToday(day)

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelected(isSameDay(day, selected) ? null : day)}
                  className={`relative rounded-xl p-2 min-h-[60px] flex flex-col items-center transition-all
                    ${!inMonth ? 'opacity-25' : ''}
                    ${isSelected ? 'bg-accent/20 border border-accent/50' : 'hover:bg-surface border border-transparent'}
                    ${today && !isSelected ? 'border border-accent/30' : ''}`}
                >
                  <span className={`font-display font-semibold text-sm mb-1
                    ${today ? 'text-accent glow-text' : inMonth ? 'text-text' : 'text-muted'}`}>
                    {format(day, 'd')}
                  </span>
                  {/* Event dots */}
                  <div className="flex flex-wrap gap-0.5 justify-center">
                    {dayEvents.slice(0, 3).map(e => (
                      <span
                        key={e.id}
                        className={`w-1.5 h-1.5 rounded-full ${catDot[e.category] || catDot.other}`}
                      />
                    ))}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-4">
            {Object.entries(catDot).map(([cat, color]) => (
              <div key={cat} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-xs font-body text-text-dim capitalize">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel: selected day or upcoming */}
        <div className="space-y-4 animate-fade-up stagger-3">
          {selected ? (
            <>
              <h3 className="font-display font-bold text-text text-lg">
                {format(selected, 'MMMM d, yyyy')}
              </h3>
              {selectedEvents.length === 0 ? (
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <span className="text-3xl mb-2 block">📭</span>
                  <p className="font-body text-text-dim text-sm">No events on this day.</p>
                </div>
              ) : (
                selectedEvents.map(e => (
                  <Link
                    key={e.id}
                    to={`/events/${e.id}`}
                    className="block bg-card border border-border hover:border-accent/40 rounded-2xl p-5 transition-all group"
                  >
                    <span className={`inline-block w-2 h-2 rounded-full mb-3 ${catDot[e.category] || catDot.other}`} />
                    <h4 className="font-display font-bold text-text group-hover:text-accent transition-colors mb-1">
                      {e.title}
                    </h4>
                    <p className="font-body text-text-dim text-xs">
                      {format(new Date(e.event_date), 'h:mm a')}
                    </p>
                  </Link>
                ))
              )}
            </>
          ) : (
            <>
              <h3 className="font-display font-bold text-text text-lg">Upcoming This Month</h3>
              {events
                .filter(e => isSameMonth(new Date(e.event_date), current) && !isPast(new Date(e.event_date)))
                .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
                .map(e => (
                  <Link
                    key={e.id}
                    to={`/events/${e.id}`}
                    className="block bg-card border border-border hover:border-accent/40 rounded-2xl p-5 transition-all group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="text-center bg-surface border border-border rounded-xl px-3 py-2 min-w-[48px]">
                        <div className="font-display font-bold text-accent text-lg leading-none">
                          {format(new Date(e.event_date), 'd')}
                        </div>
                        <div className="font-body text-muted text-xs mt-0.5">
                          {format(new Date(e.event_date), 'MMM')}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-display font-bold text-text group-hover:text-accent transition-colors text-sm mb-1">
                          {e.title}
                        </h4>
                        <p className="font-body text-muted text-xs capitalize">{e.category}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              {events.filter(e => isSameMonth(new Date(e.event_date), current)).length === 0 && (
                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                  <p className="font-body text-text-dim text-sm">No events this month.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
