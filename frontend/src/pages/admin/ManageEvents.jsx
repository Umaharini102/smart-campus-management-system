import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/dataServices';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { Calendar, Plus, Trash2, MapPin, Clock } from 'lucide-react';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '10:00 AM - 04:00 PM',
    location: '',
    category: 'Academic',
  });

  const { showToast } = useAuth();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await eventService.getAll();
      setEvents(res.events || []);
    } catch (err) {
      showToast('Error loading events', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      time: '10:00 AM - 04:00 PM',
      location: 'Central University Auditorium',
      category: 'Academic',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await eventService.create(formData);
      showToast('Campus event created', 'success');
      setIsModalOpen(false);
      fetchEvents();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save event', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this event?')) {
      try {
        await eventService.delete(id);
        showToast('Event deleted', 'success');
        fetchEvents();
      } catch (err) {
        showToast('Failed to delete event', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" /> Campus Events & Symposiums
          </h2>
          <p className="text-xs text-slate-500 mt-1">Schedule cultural festivals, tech expos, placements, and seminars.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Schedule Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-slate-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-slate-400">No scheduled campus events.</div>
        ) : (
          events.map((evt) => (
            <div key={evt._id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200">
                    {evt.category}
                  </span>
                  <button
                    onClick={() => handleDelete(evt._id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{evt.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{evt.description || 'Institutional symposium.'}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-semibold text-slate-800">{new Date(evt.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{evt.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{evt.location}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Schedule Campus Event">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Event Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Annual Hackathon 2026"
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Time Range</label>
              <input
                type="text"
                required
                placeholder="10:00 AM - 04:00 PM"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Venue Location</label>
              <input
                type="text"
                required
                placeholder="e.g. Auditorium Hall A"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Academic">Academic</option>
                <option value="Festival">Festival</option>
                <option value="Placement">Placement</option>
                <option value="Workshop">Workshop</option>
                <option value="Sports">Sports</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Event Description</label>
            <textarea
              rows={3}
              placeholder="Guest speakers, prize pools, or itinerary details..."
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm"
            >
              Create Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
