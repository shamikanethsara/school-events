import { Link } from 'react-router-dom'
import { format, formatDistanceToNow, isPast } from 'date-fns'

const categoryColors = {
  sports:     'bg-orange-500/20 text-orange-400 border-orange-500/30',
  debate:     'bg-blue-500/20 text-blue-400 border-blue-500/30',
  exhibition: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  cultural:   'bg-pink-500/20 text-pink-400 border-pink-500/30',
  academic:   'bg-green-500/20 text-green-400 border-green-500/30',
  other:      'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function EventCard({ event, delay = 0 }) {
  const date = new Date(event.event_date)
  const past = isPast(date)
  const spotsLeft = event.max_capacity - (event.registration_count || 0)
  const catColor = categoryColors[event.category] || categoryColors.other

  return (
    <Link
      to={`/events/${event.id}`}
      className="animate-fade-up block group"
      style={{ animationDelay: `${delay}ms`, opacity: 0 }}
    >
      <div className="bg-card border border-border rounded-2xl overflow-hidden hover:border-accent/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/5">
        {/* Image / placeholder */}
        <div className="h-44 bg-gradient-to-br from-surface to-border relative overflow-hidden">
          {event.image_url ? (
            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl opacity-20 select-none">
                {event.category === 'sports' ? '🏆' :
                 event.category === 'debate' ? '🎤' :
                 event.category === 'exhibition' ? '🖼️' :
                 event.category === 'cultural' ? '🎭' : '📅'}
              </span>
            </div>
          )}
          {event.is_featured && (
            <div className="absolute top-3 right-3 bg-accent text-ink text-xs font-display font-bold px-2 py-0.5 rounded-full">
              FEATURED
            </div>
          )}
          {past && (
            <div className="absolute inset-0 bg-ink/60 flex items-center justify-center">
              <span className="text-text-dim text-sm font-display font-bold tracking-widest uppercase">Ended</span>
            </div>
          )}
        </div>

        <div className="p-5">
          {/* Category */}
          <span className={`inline-block text-xs font-display font-semibold px-2.5 py-0.5 rounded-full border mb-3 ${catColor}`}>
            {event.category || 'other'}
          </span>

          {/* Title */}
          <h3 className="font-display font-bold text-text text-lg leading-tight mb-2 group-hover:text-accent transition-colors">
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-text-dim text-sm font-body leading-relaxed line-clamp-2 mb-4">
            {event.description || 'No description provided.'}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-xs text-text-dim font-body">
            <span>📅 {format(date, 'MMM d, yyyy')}</span>
            {!past && (
              <span className={`font-medium ${spotsLeft < 10 ? 'text-orange-400' : 'text-green-400'}`}>
                {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
              </span>
            )}
          </div>

          {!past && (
            <div className="mt-3 text-xs text-text-dim font-body">
              ⏰ {formatDistanceToNow(date, { addSuffix: true })}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
