import React, { useState, useEffect } from 'react';
import { materialService } from '../../services/dataServices';
import { FolderDown, Download, FileText } from 'lucide-react';

export default function StudentMaterials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMat = async () => {
      try {
        const res = await materialService.getAll();
        setMaterials(res.materials || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMat();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FolderDown className="w-6 h-6 text-blue-600" /> Course Study Materials & Slides
        </h2>
        <p className="text-xs text-slate-500 mt-1">Lecture slide decks, reference PDFs, and supplementary research files uploaded by faculty.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-slate-400">Loading resources...</div>
        ) : materials.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-200">
            No study materials posted yet for your subjects.
          </div>
        ) : (
          materials.map((m) => (
            <div key={m._id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200">
                    {m.subjectId?.code}
                  </span>
                  <span className="text-xs text-slate-400">{m.fileType?.toUpperCase() || 'FILE'}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{m.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">{m.description || 'Curriculum resource.'}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{m.subjectId?.name}</span>
                <a
                  href={`http://localhost:5000${m.file}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
