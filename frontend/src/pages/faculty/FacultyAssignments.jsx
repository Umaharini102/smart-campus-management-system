import React, { useState, useEffect } from 'react';
import { assignmentService, subjectService } from '../../services/dataServices';
import { getFileUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import { FileText, Plus, Eye, CheckCircle2, Calendar, Award, Download } from 'lucide-react';

export default function FacultyAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeSubmissionsModal, setActiveSubmissionsModal] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // Grade Modal State
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [gradeData, setGradeData] = useState({ marks: '', feedback: '' });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    subjectId: '',
    dueDate: '',
    totalMarks: 100,
  });

  const { showToast } = useAuth();

  const fetchAssignments = async () => {
    setLoading(true);
    try {
      const [aRes, sRes] = await Promise.all([assignmentService.getAll(), subjectService.getAll()]);
      setAssignments(aRes.assignments || []);
      setSubjects(sRes.subjects || []);
    } catch (err) {
      showToast('Error loading assignments', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      title: '',
      description: '',
      subjectId: subjects[0]?._id || '',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalMarks: 100,
    });
    setIsCreateOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = new FormData();
      payload.append('title', formData.title);
      payload.append('description', formData.description);
      payload.append('subjectId', formData.subjectId);
      payload.append('dueDate', formData.dueDate);
      payload.append('totalMarks', formData.totalMarks);

      await assignmentService.create(payload);
      showToast('Assignment published successfully', 'success');
      setIsCreateOpen(false);
      fetchAssignments();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create assignment', 'error');
    }
  };

  const handleViewSubmissions = async (assignment) => {
    try {
      const res = await assignmentService.getById(assignment._id);
      setActiveSubmissionsModal(res.assignment);
      setSubmissions(res.submissions || []);
    } catch (err) {
      showToast('Failed to load submissions', 'error');
    }
  };

  const handleOpenGrade = (sub) => {
    setGradingSubmission(sub);
    setGradeData({
      marks: sub.marks !== null ? sub.marks : '',
      feedback: sub.feedback || '',
    });
  };

  const handleGradeSubmit = async (e) => {
    e.preventDefault();
    try {
      await assignmentService.grade(gradingSubmission._id, gradeData);
      showToast('Grade and feedback published', 'success');
      setGradingSubmission(null);
      // Refresh submissions in current view
      const res = await assignmentService.getById(activeSubmissionsModal._id);
      setSubmissions(res.submissions || []);
    } catch (err) {
      showToast('Failed to grade submission', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" /> Coursework & Assignment Manager
          </h2>
          <p className="text-xs text-slate-500 mt-1">Publish problem sets, review scholar submissions, and allocate grades.</p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Assignment
        </button>
      </div>

      {/* Assignment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-slate-400">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-slate-400">No assignments published.</div>
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
                <p className="text-xs text-slate-500 line-clamp-3 mb-4">{assign.description || 'Course assignment description.'}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" /> Due: {new Date(assign.dueDate).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleViewSubmissions(assign)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" /> Review Submissions
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Assignment">
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Assignment Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Lab Project 1: Vector Attention"
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
              <label className="block font-semibold text-slate-700 mb-1">Total Marks</label>
              <input
                type="number"
                required
                className="w-full p-2 border border-slate-300 rounded-lg"
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: Number(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Submission Deadline</label>
            <input
              type="date"
              required
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Instructions & Rubrics</label>
            <textarea
              rows={4}
              required
              placeholder="Provide assignment guidelines, test datasets, or expectations..."
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm"
            >
              Publish Assignment
            </button>
          </div>
        </form>
      </Modal>

      {/* Submissions Review Modal */}
      <Modal
        isOpen={!!activeSubmissionsModal}
        onClose={() => setActiveSubmissionsModal(null)}
        title={`Submissions: ${activeSubmissionsModal?.title || ''}`}
        maxWidth="max-w-3xl"
      >
        <div className="space-y-4">
          <div className="text-xs text-slate-500">
            Total Submissions: <strong className="text-slate-800">{submissions.length}</strong>
          </div>

          {submissions.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No submissions received yet.</p>
          ) : (
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {submissions.map((sub) => (
                <div key={sub._id} className="p-4 bg-white flex items-center justify-between gap-4 text-xs">
                  <div>
                    <h4 className="font-bold text-slate-900">{sub.studentId?.userId?.name || 'Student'}</h4>
                    <p className="text-slate-500 text-[11px]">Roll: {sub.studentId?.rollNumber}</p>
                    {sub.comments && <p className="text-slate-600 italic mt-1">"{sub.comments}"</p>}
                    {sub.file && (
                      <div className="mt-1">
                        <a
                          href={getFileUrl(sub.file)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 hover:bg-blue-100 transition-colors"
                        >
                          <Download className="w-3 h-3" /> View Submitted File
                        </a>
                      </div>
                    )}
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Submitted: {new Date(sub.submittedAt).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-right space-y-1">
                    {sub.status === 'Graded' ? (
                      <div className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block">
                        Score: {sub.marks} / {activeSubmissionsModal?.totalMarks}
                      </div>
                    ) : (
                      <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-1 rounded border border-amber-200 inline-block">
                        Ungraded
                      </span>
                    )}

                    <div className="pt-1">
                      <button
                        onClick={() => handleOpenGrade(sub)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold hover:bg-blue-700 shadow-xs"
                      >
                        {sub.status === 'Graded' ? 'Edit Grade' : 'Grade Solution'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>

      {/* Grade Solution Modal */}
      <Modal
        isOpen={!!gradingSubmission}
        onClose={() => setGradingSubmission(null)}
        title="Grade Assignment Submission"
      >
        <form onSubmit={handleGradeSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Score Awarded (Max: {activeSubmissionsModal?.totalMarks || 100})
            </label>
            <input
              type="number"
              required
              min="0"
              max={activeSubmissionsModal?.totalMarks || 100}
              className="w-full p-2 border border-slate-300 rounded-lg text-sm font-bold"
              value={gradeData.marks}
              onChange={(e) => setGradeData({ ...gradeData, marks: e.target.value })}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Faculty Feedback Comments</label>
            <textarea
              rows={3}
              placeholder="Constructive feedback for the scholar..."
              className="w-full p-2 border border-slate-300 rounded-lg"
              value={gradeData.feedback}
              onChange={(e) => setGradeData({ ...gradeData, feedback: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setGradingSubmission(null)}
              className="px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm"
            >
              Submit Score
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
