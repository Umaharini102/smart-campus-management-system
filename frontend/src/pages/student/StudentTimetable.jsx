import React, { useState, useEffect } from 'react';
import { timetableService } from '../../services/dataServices';
import { CalendarDays, Clock, Building2, User } from 'lucide-react';

export default function StudentTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchSchedule = async () => {
      setLoading(true);
      try {
        const res = await timetableService.getAll({ day: selectedDay });
        setTimetable(res.timetable || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [selectedDay]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <CalendarDays className="w-6 h-6 text-blue-600" /> My Academic Class Schedule
        </h2>
        <p className="text-xs text-slate-500 mt-1">Daily timetable slots, classrooms, and allocated professor sessions.</p>
      </div>

      {/* Day Selector */}
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

      {/* Slot Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-10 text-slate-400">Loading daily schedule...</div>
        ) : timetable.length === 0 ? (
          <div className="text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-200">
            No lectures scheduled for {selectedDay}.
          </div>
        ) : (
          timetable.map((slot) => (
            <div
              key={slot._id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-12 bg-blue-50 text-blue-700 rounded-lg flex flex-col items-center justify-center font-mono">
                  <span className="text-[10px] uppercase font-bold text-blue-500">Slot</span>
                  <span className="text-base font-bold">{slot.period}</span>
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
                    <span className="flex items-center gap-1 text-slate-700">
                      <User className="w-3.5 h-3.5 text-slate-400" /> {slot.facultyId?.userId?.name || 'Faculty'}
                    </span>
                  </div>
                </div>
              </div>

              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                75 mins
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
