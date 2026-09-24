import React, { useState, useEffect } from 'react';
import { assignmentService } from '../../services/dataServices';
import { getFileUrl } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Modal from '../../components/Modal';
import {
  FileText,
  Upload,
  CheckCircle2,
  Calendar,
  Award,
  Send,
  Download,
  Clock,
  AlertCircle
} from 'lucide-react';

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
    setSubmissionComments(assignment.mySubmission?.comments || '');
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-blue-600" /> Coursework & Assignment Submissions
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Review active problem sets, deadlines, submission status, and upload your coursework solutions.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
          Total Tasks: <span className="text-slate-800 font-bold">{assignments.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-3 text-center py-10 text-slate-400">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="col-span-3 text-center py-10 text-slate-400 bg-white rounded-xl border border-slate-200">
            No coursework assignments currently due.
          </div>
        ) : (
          assignments.map((assign) => {
            const sub = assign.mySubmission;
            const isGraded = sub?.status === 'Graded';
            const isSubmitted = sub && sub.status !== 'Graded';

            return (
              <div
                key={assign._id}
                className={`bg-white rounded-xl p-5 border shadow-sm flex flex-col justify-between transition-all ${
                  isGraded
                    ? 'border-emerald-200'
                    : isSubmitted
                    ? 'border-blue-200'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-0.5 rounded font-mono font-bold text-xs bg-blue-50 text-blue-700 border border-blue-200">
                      {assign.subjectId?.code}
                    </span>

                    {isGraded ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Graded: {sub.marks}/{assign.totalMarks}
                      </span>
                    ) : isSubmitted ? (
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Under Review
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" /> Max: {assign.totalMarks} pts
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-1">{assign.title}</h3>
                  <p className="text-xs text-slate-600 mb-3 whitespace-pre-line leading-relaxed">
                    {assign.description}
                  </p>

                  {/* If faculty attached problem file */}
                  {assign.attachment && (
                    <div className="mb-3">
                      <a
                        href={getFileUrl(assign.attachment)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                      >
                        <Download className="w-3 h-3" /> Problem Attachment
                      </a>
                    </div>
                  )}

                  {/* If student has submitted, show details */}
                  {sub && (
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs mb-3 space-y-1">
                      <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                        {sub.file && (
                          <a
                            href={getFileUrl(sub.file)}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
                          >
                            <Download className="w-3 h-3" /> My Solution
                          </a>
                        )}
                      </div>
                      {sub.comments && (
                        <p className="text-slate-600 italic text-[11px]">"{sub.comments}"</p>
                      )}
                      {sub.feedback && (
                        <div className="mt-1 pt-1 border-t border-slate-200 text-[11px] text-emerald-800 font-medium">
                          <strong>Faculty Feedback:</strong> "{sub.feedback}"
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" /> Due: {new Date(assign.dueDate).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => handleOpenSubmit(assign)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors ${
                      isGraded
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        : isSubmitted
                        ? 'bg-amber-600 hover:bg-amber-700 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {isGraded ? 'Review Submission' : isSubmitted ? 'Resubmit Work' : 'Submit Solution'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submission Modal */}
      <Modal
        isOpen={!!activeSubmitModal}
        onClose={() => setActiveSubmitModal(null)}
        title={`Submit Solution: ${activeSubmitModal?.title || ''}`}
      >
        <form onSubmit={handleSubmitSolution} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Upload Solution / Document / Archive (PDF, ZIP, CODE)
            </label>
            <input
              type="file"
              className="w-full p-2 border border-slate-300 rounded-lg file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Submission Comments / Implementation Remarks
            </label>
            <textarea
              rows={3}
              placeholder="Add implementation remarks, test execution instructions, or github links..."
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
