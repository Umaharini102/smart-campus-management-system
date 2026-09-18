import React, { useState, useEffect } from 'react';
import { assignmentService } from '../../services/dataServices';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { FileText, Upload, CheckCircle2, Calendar, Award, Send } from 'lucide-react';

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubmitModal, setActiveSubmitModal] = useState(null);
  const [submissionComments, setSubmissionComments] = useState('');
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useAuth();

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const res = await assignmentService.getAll();
      setAssignments(res.assignments || []);
    } catch (err) {
      showToast('Error loading assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenSubmit = (assignment) => {
    setActiveSubmitModal(assignment);
    setSubmissionComments('');
    setFile(null);
  };

  const handleSubmitSolution = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const data = new FormData();
      data.append('comments', submissionComments);
      if (file) {
        data.append('file', file);
      }

      await assignmentService.submit(activeSubmitModal._id, data);
      showToast('Assignment solution submitted successfully!', 'success');
      setActiveSubmitModal(null);
      fetchAssignments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Submission failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-blue-600" /> Coursework & Assignment Submissions
        </h2>
        <p className="text-xs text-slate-500 mt-1">Review active problem sets, deadlines, and upload your coursework solutions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-slate-400">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-200">
            No coursework assignments currently due.
          </div>
        ) : (
          assignments.map((assign) => (
            <div key={assign._id} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200">
                    {assign.subjectId?.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" /> Max: {assign.totalMarks} pts
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mb-1">{assign.title}</h3>
                <p className="text-xs text-slate-600 mb-4 whitespace-pre-line leading-relaxed">{assign.description}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Due: {new Date(assign.dueDate).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleOpenSubmit(assign)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" /> Submit Solution
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal
        isOpen={!!activeSubmitModal}
        onClose={() => setActiveSubmitModal(null)}
        title={`Submit Solution: ${activeSubmitModal?.title || ''}`}
      >
        <form onSubmit={handleSubmitSolution} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Upload Work / Code Archive / Document
            </label>
            <input
              type="file"
              className="w-full p-2 border border-slate-300 rounded-lg file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Submission Comments / Notes</label>
            <textarea
              rows={3}
              placeholder="Add implementation remarks, test execution commands, or references..."
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={submissionComments}
              onChange={(e) => setSubmissionComments(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setActiveSubmitModal(null)}
              className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm flex items-center gap-1.5 disabled:opacity-60"
            >
              <Send className="w-3.5 h-3.5" /> {submitting ? 'Uploading...' : 'Submit Work'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
