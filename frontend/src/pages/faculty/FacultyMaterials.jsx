import React, { useState, useEffect } from 'react';
import { materialService, subjectService } from '../../services/dataServices';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { FolderDown, Plus, Trash2, FileText, Download } from 'lucide-react';

export default function FacultyMaterials() {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    file: null,
  });

  const { showToast } = useAuth();

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const [mRes, sRes] = await Promise.all([materialService.getAll(), subjectService.getAll()]);
      setMaterials(mRes.materials || []);
      setSubjects(sRes.subjects || []);
    } catch (err) {
      showToast('Error loading study materials', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      subjectId: subjects[0]?._id || '',
      file: null,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('subjectId', formData.subjectId);
      if (formData.file) {
        data.append('file', formData.file);
      }

      await materialService.upload(data);
      showToast('Study material uploaded', 'success');
      setIsModalOpen(false);
      fetchMaterials();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to upload material', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this study material?')) {
      try {
        await materialService.delete(id);
        showToast('Material deleted', 'success');
        fetchMaterials();
      } catch (err) {
        showToast('Failed to delete material', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FolderDown className="w-6 h-6 text-blue-600" /> Academic Study Materials
          </h2>
          <p className="text-xs text-slate-500 mt-1">Share lecture slides, research readings, and textbook references with students.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Upload Material
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-slate-400">Loading materials...</div>
        ) : materials.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-200">
            No course materials shared yet. Click "Upload Material" to share notes with scholars.
          </div>
        ) : (
          materials.map((m) => (
            <div key={m._id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200">
                    {m.subjectId?.code}
                  </span>
                  <button
                    onClick={() => handleDelete(m._id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-slate-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Upload Course Material">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Resource Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Lecture 4: Attention Mechanisms Slides"
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
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
            <label className="block font-semibold text-slate-700 mb-1">Description / Notes</label>
            <textarea
              rows={3}
              placeholder="Brief description of chapters covered..."
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Attach File (PDF, PPT, ZIP)</label>
            <input
              type="file"
              required
              className="w-full p-2 border border-slate-300 rounded-lg file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
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
              Upload Material
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
