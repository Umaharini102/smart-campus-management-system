import React, { useState, useEffect } from 'react';
import { eventService } from '../../services/dataServices';
import { Calendar, MapPin, Clock } from 'lucide-react';

export default function StudentEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchE = async () => {
      try {
        const res = await eventService.getAll();
        setEvents(res.events || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchE();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" /> Campus Events Calendar
        </h2>
        <p className="text-xs text-slate-500 mt-1">Technical symposiums, hackathons, job fairs, and cultural festivals across university halls.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-slate-400">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-200">
            No events scheduled currently.
          </div>
        ) : (
          events.map((evt) => (
            <div key={evt._id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200">
                    {evt.category}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {new Date(evt.date).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{evt.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-3 mb-4">{evt.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
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
    </div>
  );
}
