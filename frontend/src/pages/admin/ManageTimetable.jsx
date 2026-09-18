import React, { useState, useEffect } from 'react';
import { timetableService, subjectService, facultyService } from '../../services/dataServices';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { CalendarDays, Plus, Trash2, Clock, Building2 } from 'lucide-react';

export default function ManageTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    day: 'Monday',
    period: 1,
    subjectId: '',
    facultyId: '',
    classroom: 'Smart Hall Alpha (SH-101)',
    startTime: '09:00 AM',
    endTime: '10:15 AM',
  });

  const { showToast } = useAuth();
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const fetchTimetable = async () => {
    setLoading(true);
    try {
      const [tRes, sRes, fRes] = await Promise.all([
        timetableService.getAll({ day: selectedDay }),
        subjectService.getAll(),
        facultyService.getAll(),
      ]);
      setTimetable(tRes.timetable || []);
      setSubjects(sRes.subjects || []);
      setFacultyList(fRes.faculty || []);
    } catch (err) {
      showToast('Error loading timetable', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [selectedDay]);

  const handleOpenCreate = () => {
    setFormData({
      day: selectedDay,
      period: (timetable.length || 0) + 1,
      subjectId: subjects[0]?._id || '',
      facultyId: facultyList[0]?._id || '',
      classroom: 'Smart Hall Alpha (SH-101)',
      startTime: '09:00 AM',
      endTime: '10:15 AM',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await timetableService.create(formData);
      showToast('Timetable slot added', 'success');
      setIsModalOpen(false);
      fetchTimetable();
    } catch (err) {
      showToast(err.response?.data?.message || 'Action failed', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this timetable session?')) {
      try {
        await timetableService.delete(id);
        showToast('Slot removed', 'success');
        fetchTimetable();
      } catch (err) {
        showToast('Failed to delete slot', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-blue-600" /> Academic Timetable Scheduler
          </h2>
          <p className="text-xs text-slate-500 mt-1">Configure class time allocations, venues, and daily batch schedules.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Timetable Slot
        </button>
      </div>

      {/* Day Selector Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {days.map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              selectedDay === d
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Timetable Slots Grid */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading daily schedule...</div>
        ) : timetable.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-200">
            No scheduled classes for {selectedDay}. Click "Add Timetable Slot" to create one.
          </div>
        ) : (
          timetable.map((slot) => (
            <div
              key={slot._id}
              className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-12 bg-slate-100 rounded-lg flex flex-col items-center justify-center font-mono">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">Period</span>
                  <span className="text-base font-bold text-slate-900">{slot.period}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono font-bold text-xs">
                      {slot.subjectId?.code}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{slot.subjectId?.name}</h4>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1 font-mono text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> {slot.startTime} - {slot.endTime}
                    </span>
                    <span className="flex items-center gap-1 text-slate-700">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" /> {slot.classroom}
                    </span>
                    <span>Instructor: <strong className="text-slate-700">{slot.facultyId?.userId?.name || 'Faculty'}</strong></span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDelete(slot._id)}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete Session"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Timetable Slot">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Day of Week</label>
              <select
                className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              >
                {days.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Period Number</label>
              <input
                type="number"
                min="1"
                max="8"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Subject Module</label>
            <select
              required
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              value={formData.subjectId}
              onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Lecturer / Professor</label>
            <select
              required
              className="w-full p-2 border border-slate-300 rounded-lg bg-white"
              value={formData.facultyId}
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
            >
              <option value="">Select Faculty</option>
              {facultyList.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.userId?.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Classroom / Lecture Hall</label>
            <input
              type="text"
              required
              placeholder="e.g. Smart Hall Alpha (SH-101)"
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.classroom}
              onChange={(e) => setFormData({ ...formData, classroom: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Start Time</label>
              <input
                type="text"
                required
                placeholder="09:00 AM"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">End Time</label>
              <input
                type="text"
                required
                placeholder="10:15 AM"
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              />
            </div>
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
              Add Session Slot
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
