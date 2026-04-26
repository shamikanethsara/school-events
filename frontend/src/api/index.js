import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const api = axios.create({ baseURL: API_BASE })

export const getEvents = () => api.get('/api/events')
export const getEvent = (id) => api.get(`/api/events/${id}`)
export const createEvent = (data) => api.post('/api/events', data)
export const deleteEvent = (id) => api.delete(`/api/events/${id}`)

export const getAnnouncements = () => api.get('/api/announcements')
export const createAnnouncement = (data) => api.post('/api/announcements', data)

export const registerForEvent = (data) => api.post('/api/registrations', data)
export const getEventRegistrations = (id) => api.get(`/api/registrations/event/${id}`)
